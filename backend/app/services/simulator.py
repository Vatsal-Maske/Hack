import random
import threading
import time

from ml.predict import predict_fraud
from app.db.session import SessionLocal
from app.services.transaction import save_transaction


class TransactionSimulator:
    def __init__(self):
        self._lock = threading.Lock()
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    def _generate_transaction(self) -> tuple[float, float]:
        is_fraud_like = random.random() < 0.2
        if is_fraud_like:
            amount = random.uniform(100000, 1500000)
            hour = random.uniform(0, 5)
        else:
            amount = random.uniform(500, 60000)
            hour = random.uniform(8, 20)
        return float(round(amount, 2)), float(round(hour, 2))

    def _loop(self):
        while not self._stop_event.is_set():
            amount, txn_time = self._generate_transaction()
            result = predict_fraud(amount=amount, time=txn_time)

            db = SessionLocal()
            try:
                save_transaction(
                    db=db,
                    amount=amount,
                    time=txn_time,
                    prediction=result["prediction"],
                    risk_score=result["risk_score"],
                )
            finally:
                db.close()

            self._stop_event.wait(3)

    def start(self) -> bool:
        with self._lock:
            if self._thread and self._thread.is_alive():
                return False

            self._stop_event.clear()
            self._thread = threading.Thread(target=self._loop, daemon=True)
            self._thread.start()
            return True

    def stop(self) -> bool:
        with self._lock:
            thread = self._thread
            if not thread or not thread.is_alive():
                return False

            self._stop_event.set()

        thread.join(timeout=4)
        return True

    def is_running(self) -> bool:
        with self._lock:
            return bool(self._thread and self._thread.is_alive())


simulator = TransactionSimulator()
