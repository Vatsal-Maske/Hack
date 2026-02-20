// services/api.ts — Axios instance and API functions for FinGuard AI

import axios from "axios";
import type { TransactionInput, PredictResult, Transaction } from "@/types";

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: { "Content-Type": "application/json" },
});

/** Send a transaction to the ML model for fraud prediction. */
export async function predictFraud(data: TransactionInput): Promise<PredictResult> {
    const response = await api.post<PredictResult>("/predict", data);
    return response.data;
}

/** Retrieve all past transactions sorted by most recent first. */
export async function getTransactions(): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>("/transactions");
    return response.data;
}

/** Block a fraudulent transaction by ID. */
export async function blockTransaction(id: number): Promise<Transaction> {
    const response = await api.patch<Transaction>(`/transactions/${id}/block`);
    return response.data;
}

export default api;
