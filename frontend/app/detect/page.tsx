"use client";

import { useState, useEffect, useCallback } from "react";
import StatusBadge from "@/components/StatusBadge";
import BlockButton from "@/components/BlockButton";
import { predictFraud, getTransactions } from "@/services/api";
import type { PredictResult, Transaction } from "@/types";

// ── Skeleton table rows ───────────────────────────────────────────────────────
function SkeletonTableRows() {
    return (
        <>
            {[...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-slate-800/60">
                    {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                            <div className={`skeleton h-3 rounded ${j === 2 ? "w-20" : "w-16"}`} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

// ── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: string }) {
    return status === "BLOCKED" ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-900/30 text-red-400 border border-red-500/30">
            🚫 Blocked
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
            ✅ Active
        </span>
    );
}

// ── Main detect page ──────────────────────────────────────────────────────────
export default function DetectPage() {
    const [amount, setAmount] = useState("");
    const [time, setTime] = useState("");

    const [result, setResult] = useState<PredictResult | null>(null);
    const [detecting, setDetecting] = useState(false);
    const [detectError, setDetectError] = useState<string | null>(null);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const loadHistory = useCallback(async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
            setHistoryError(null);
        } catch {
            setHistoryError("Could not load transaction history.");
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    const handleDetect = async () => {
        const amt = parseFloat(amount);
        const hr = parseFloat(time);

        if (isNaN(amt) || amt <= 0) {
            setDetectError("Enter a valid amount greater than 0."); return;
        }
        if (isNaN(hr) || hr < 0 || hr > 23) {
            setDetectError("Enter a valid hour between 0 and 23."); return;
        }

        setDetecting(true);
        setDetectError(null);
        setResult(null);

        try {
            const res = await predictFraud({ amount: amt, time: hr });
            setResult(res);
            await loadHistory();
        } catch {
            setDetectError("Backend not reachable. Make sure the server is running on port 8000.");
        } finally {
            setDetecting(false);
        }
    };

    const fmtTs = (ts: string) => new Date(ts + "Z").toLocaleString();
    const fmtTime = (t: number) => {
        const h = Math.floor(t);
        return `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? "AM" : "PM"}`;
    };
    const fmtAmt = (n: number) =>
        "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-7 fade-in">

            {/* ── Page header ─────────────────────────────────────────────────────── */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Fraud Detection</h1>
                <p className="text-slate-400 text-sm">Submit a transaction to run real-time ML analysis.</p>
            </div>

            {/* ── Input + Result ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Input card */}
                <div className="card p-7">
                    <h2 className="text-white font-semibold text-lg mb-6">Transaction Details</h2>
                    <div className="space-y-5">

                        {/* Amount */}
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">
                                Transaction Amount (USD)
                            </label>
                            <div className="relative glow-blue rounded-xl">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium select-none">$</span>
                                <input
                                    type="number" min={0.01} step={0.01} value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleDetect()}
                                    placeholder="e.g. 9000"
                                    className="w-full bg-slate-800/70 border border-slate-700 text-white rounded-xl
                    pl-8 pr-4 py-3 placeholder:text-slate-600 focus:outline-none
                    focus:border-blue-500/70 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Time */}
                        <div>
                            <label className="block text-slate-400 text-sm font-medium mb-2">
                                Hour of Day (0 – 23)
                            </label>
                            <div className="glow-blue rounded-xl">
                                <input
                                    type="number" min={0} max={23} step={1} value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleDetect()}
                                    placeholder="e.g. 2   (2 AM = high risk)"
                                    className="w-full bg-slate-800/70 border border-slate-700 text-white rounded-xl
                    px-4 py-3 placeholder:text-slate-600 focus:outline-none
                    focus:border-blue-500/70 transition-colors"
                                />
                            </div>
                            <p className="text-slate-600 text-xs mt-1.5">
                                ⚠️ Late-night hours (0–5) significantly increase fraud probability.
                            </p>
                        </div>

                        {/* Error */}
                        {detectError && (
                            <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-400 text-sm flex gap-2">
                                <span>⚠️</span> {detectError}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            onClick={handleDetect}
                            disabled={detecting}
                            className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-semibold rounded-xl py-3.5 transition-all
                hover:shadow-lg hover:shadow-blue-500/25
                flex items-center justify-center gap-2"
                        >
                            {detecting ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Detecting…
                                </>
                            ) : (
                                <>🔍 Analyze Transaction</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Result card */}
                <div className={`card p-7 flex flex-col justify-center transition-all duration-300
          ${result
                        ? result.prediction === "FRAUD"
                            ? "border-red-500/30 bg-red-500/[0.03]"
                            : "border-emerald-500/30 bg-emerald-500/[0.03]"
                        : "border-dashed"
                    }`}
                >
                    {result ? (
                        <div className="space-y-6 fade-in">
                            <div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mb-3">
                                    Analysis Result
                                </p>
                                <StatusBadge prediction={result.prediction} />
                            </div>

                            <div>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mb-2">
                                    Anomaly Risk Score
                                </p>
                                <div className="flex items-end gap-2 mb-3">
                                    <span className={`text-4xl font-bold tabular-nums ${result.prediction === "FRAUD" ? "text-red-400" : "text-emerald-400"
                                        }`}>
                                        {result.risk_score.toFixed(4)}
                                    </span>
                                </div>
                                {/* Risk bar */}
                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${result.prediction === "FRAUD" ? "bg-red-500" : "bg-emerald-500"
                                            }`}
                                        style={{ width: `${Math.min(result.risk_score * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <p className={`text-sm font-medium ${result.prediction === "FRAUD" ? "text-red-400" : "text-emerald-400"
                                }`}>
                                {result.prediction === "FRAUD"
                                    ? "🚨 This transaction has been flagged as suspicious."
                                    : "✅ This transaction appears legitimate."}
                            </p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                                📊
                            </div>
                            <p className="text-slate-400 font-medium">No analysis yet</p>
                            <p className="text-slate-600 text-sm mt-1">
                                Fill in the form and click Analyze.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Transaction History ──────────────────────────────────────────────── */}
            <div className="card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
                    <h2 className="text-white font-semibold text-lg">Transaction History</h2>
                    <span className="text-slate-500 text-sm">
                        {transactions.length} record{transactions.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {historyLoading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <tbody><SkeletonTableRows /></tbody>
                        </table>
                    </div>
                ) : historyError ? (
                    <div className="text-center py-14 text-red-400 text-sm flex flex-col items-center gap-2">
                        <span className="text-2xl">⚠️</span> {historyError}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 gap-3 text-center px-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl">
                            📭
                        </div>
                        <p className="text-slate-300 font-semibold">No transactions monitored yet</p>
                        <p className="text-slate-600 text-sm">Run your first detection using the form above.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm table-head-sticky">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                                    <th className="text-left px-6 py-3.5 font-medium">Amount</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Hour</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Prediction</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Risk Score</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Status</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Timestamp</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {transactions.map((tx) => (
                                    <tr
                                        key={tx.id}
                                        className={`transition-colors
                      ${tx.prediction === "FRAUD"
                                                ? "bg-red-500/[0.04] hover:bg-red-500/[0.08] fraud-row"
                                                : "hover:bg-slate-800/30"
                                            }`}
                                    >
                                        <td className="px-6 py-4 text-white font-semibold">{fmtAmt(tx.amount)}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{fmtTime(tx.time)}</td>
                                        <td className="px-6 py-4"><StatusBadge prediction={tx.prediction} size="sm" /></td>
                                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">{tx.risk_score.toFixed(4)}</td>
                                        <td className="px-6 py-4"><StatusPill status={tx.status} /></td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">{fmtTs(tx.created_at)}</td>
                                        <td className="px-6 py-4">
                                            {tx.prediction === "FRAUD" && tx.status !== "BLOCKED" && (
                                                <BlockButton transactionId={tx.id} onBlocked={loadHistory} />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
