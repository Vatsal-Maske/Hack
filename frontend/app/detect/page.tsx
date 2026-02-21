"use client";

import { useState, useEffect, useCallback } from "react";
import StatusBadge from "@/components/StatusBadge";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";
import { getTransactions, startSimulator, stopSimulator } from "@/services/api";
import type { Transaction } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { formatRiskPercentage, riskTextColorClass } from "@/utils/risk";
import ProtectedRoute from "@/components/ProtectedRoute";

const POLL_INTERVAL = 5000;

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
function DetectContent() {
    const [simulatorRunning, setSimulatorRunning] = useState(false);
    const [simulatorBusy, setSimulatorBusy] = useState(false);
    const [simulatorMsg, setSimulatorMsg] = useState<string | null>(null);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewDetails = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const handleBlock = () => {
        loadHistory();
    };

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

    useEffect(() => {
        loadHistory();
        const id = setInterval(loadHistory, POLL_INTERVAL);
        return () => clearInterval(id);
    }, [loadHistory]);

    const handleStartSimulator = async () => {
        setSimulatorBusy(true);
        setSimulatorMsg(null);
        try {
            const res = await startSimulator();
            setSimulatorRunning(res.running);
            setSimulatorMsg(res.message);
        } catch {
            setSimulatorMsg("Failed to start simulator.");
        } finally {
            setSimulatorBusy(false);
        }
    };

    const handleStopSimulator = async () => {
        setSimulatorBusy(true);
        setSimulatorMsg(null);
        try {
            const res = await stopSimulator();
            setSimulatorRunning(res.running);
            setSimulatorMsg(res.message);
        } catch {
            setSimulatorMsg("Failed to stop simulator.");
        } finally {
            setSimulatorBusy(false);
        }
    };

    const fmtTs = (ts: string) => new Date(ts + "Z").toLocaleString();
    const fmtTime = (t: number) => {
        const h = Math.floor(t);
        return `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? "AM" : "PM"}`;
    };
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-7 fade-in">

            {/* ── Page header ─────────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Transactions</h1>
                    <p className="text-slate-400 text-sm">Transactions Monitoring Console</p>
                </div>

                <div className="card p-4 min-w-[280px]">
                    <h2 className="text-white font-semibold mb-3">Transaction Simulator</h2>
                    <div className="flex items-center gap-2 mb-4">
                        <span className={`w-2.5 h-2.5 rounded-full ${simulatorRunning ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span className={`text-sm font-medium ${simulatorRunning ? "text-emerald-400" : "text-red-400"}`}>
                            {simulatorRunning ? "Running" : "Stopped"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleStartSimulator}
                            disabled={simulatorBusy || simulatorRunning}
                            className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold"
                        >
                            Start Simulator
                        </button>
                        <button
                            onClick={handleStopSimulator}
                            disabled={simulatorBusy || !simulatorRunning}
                            className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold"
                        >
                            Stop Simulator
                        </button>
                    </div>

                    {simulatorMsg && <p className="text-slate-400 text-xs mt-3">{simulatorMsg}</p>}
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
                        <p className="text-slate-600 text-sm">Start simulator to stream live transactions.</p>
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
                                        <td className="px-6 py-4 text-white font-semibold">{formatCurrency(tx.amount)}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">{fmtTime(tx.time)}</td>
                                        <td className="px-6 py-4"><StatusBadge prediction={tx.prediction} size="sm" /></td>
                                        <td
                                            className={`px-6 py-4 font-mono text-xs ${riskTextColorClass(tx.risk_score)}`}
                                            title="Anomaly probability based on ML model"
                                        >
                                            {formatRiskPercentage(tx.risk_score)}
                                        </td>
                                        <td className="px-6 py-4"><StatusPill status={tx.status} /></td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">{fmtTs(tx.created_at)}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetails(tx)}
                                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <TransactionDetailsModal
                    transaction={selectedTransaction}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onBlock={handleBlock}
                />
            )}
        </div>
    );
}

export default function DetectPage() {
    return (
        <ProtectedRoute>
            <DetectContent />
        </ProtectedRoute>
    );
}
