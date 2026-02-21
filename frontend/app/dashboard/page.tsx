"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from "recharts";
import StatusBadge from "@/components/StatusBadge";
import TransactionDetailsModal from "@/components/TransactionDetailsModal";
import { getTransactions } from "@/services/api";
import type { Transaction } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { formatRiskPercentage, riskTextColorClass } from "@/utils/risk";
import ProtectedRoute from "@/components/ProtectedRoute";

const POLL_INTERVAL = 5000;

// ── Skeleton helpers ─────────────────────────────────────────────────────────

function SkeletonKpiCard() {
    return (
        <div className="card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="skeleton h-3 w-28 rounded" />
                <div className="skeleton w-9 h-9 rounded-lg" />
            </div>
            <div className="space-y-2">
                <div className="skeleton h-8 w-20 rounded" />
                <div className="skeleton h-2.5 w-32 rounded" />
            </div>
        </div>
    );
}

function SkeletonTableRows() {
    return (
        <>
            {[...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-slate-800/60">
                    {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                            <div className={`skeleton h-3 rounded ${j === 0 ? "w-6" : j === 3 ? "w-20" : "w-16"}`} />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

// ── Animated KPI Card ─────────────────────────────────────────────────────────

function KpiCard({
    label, value, sub, accent, icon,
}: {
    label: string; value: string | number; sub?: string;
    accent?: "blue" | "red" | "emerald" | "amber"; icon: string;
}) {
    const [animKey, setAnimKey] = useState(0);
    const prevValue = useRef<string | number>(value);

    useEffect(() => {
        if (value !== prevValue.current) {
            prevValue.current = value;
            setAnimKey((k) => k + 1);
        }
    }, [value]);

    const styles = {
        blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "hover:shadow-blue-500/10" },
        red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "hover:shadow-red-500/10" },
        emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", glow: "hover:shadow-emerald-500/10" },
        amber: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", glow: "hover:shadow-amber-500/10" },
    };
    const s = styles[accent ?? "blue"];

    return (
        <div className={`card p-6 flex flex-col gap-4 hover:shadow-lg ${s.glow} transition-all`}>
            <div className="flex items-center justify-between">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</p>
                <span className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg ${s.bg} ${s.border}`}>
                    {icon}
                </span>
            </div>
            <div>
                <p key={animKey} className={`text-3xl font-bold kpi-pop ${s.text}`}>{value}</p>
                {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
            </div>
        </div>
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

// ── Main Dashboard ────────────────────────────────────────────────────────────

function DashboardContent() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newFraudIds, setNewFraudIds] = useState<Set<number>>(new Set());
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const knownIds = useRef<Set<number>>(new Set());

    const handleViewDetails = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const handleBlock = () => {
        fetchData(true);
    };

    const fetchData = useCallback(async (isPolling = false) => {
        if (isPolling) setUpdating(true);
        try {
            const data = await getTransactions();
            const freshFraudIds: number[] = [];
            data.forEach((t) => {
                if (!knownIds.current.has(t.id) && t.prediction === "FRAUD") freshFraudIds.push(t.id);
                knownIds.current.add(t.id);
            });
            setTransactions(data);
            if (freshFraudIds.length > 0) {
                setNewFraudIds((prev) => new Set([...prev, ...freshFraudIds]));
                setTimeout(() => {
                    setNewFraudIds((prev) => {
                        const next = new Set(prev);
                        freshFraudIds.forEach((id) => next.delete(id));
                        return next;
                    });
                }, 2200);
            }
            setError(null);
        } catch {
            if (!isPolling) setError("Could not connect to backend on port 8000.");
        } finally {
            setLoading(false);
            setUpdating(false);
        }
    }, []);

    useEffect(() => {
        fetchData(false);
        const id = setInterval(() => fetchData(true), POLL_INTERVAL);
        return () => clearInterval(id);
    }, [fetchData]);

    const total = transactions.length;
    const fraudCount = transactions.filter((t) => t.prediction === "FRAUD").length;
    const normalCount = total - fraudCount;
    const fraudPct = total > 0 ? ((fraudCount / total) * 100).toFixed(1) : "0.0";
    const latestRisk = total > 0 ? formatRiskPercentage(transactions[0].risk_score) : "—";

    const barData = [
        { label: "Normal", count: normalCount, fill: "#10b981" },
        { label: "Fraud", count: fraudCount, fill: "#ef4444" },
    ];
    const pieData = [{ name: "Normal", value: normalCount }, { name: "Fraud", value: fraudCount }];
    const PIE_COLORS = ["#10b981", "#ef4444"];
    const recent = transactions.slice(0, 5);

    const fmtTs = (ts: string) => new Date(ts + "Z").toLocaleString();
    const fmtTime = (t: number) => {
        const h = Math.floor(t);
        return `${h % 12 === 0 ? 12 : h % 12}:00 ${h < 12 ? "AM" : "PM"}`;
    };
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4 fade-in">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-3xl">⚠️</div>
                <p className="text-red-400 font-semibold text-lg">Backend Unreachable</p>
                <p className="text-slate-500 text-sm text-center max-w-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7 fade-in">

            {/* ── Header ──────────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Executive Dashboard</h1>
                    <p className="text-slate-400 mt-1 text-sm">Real-time fraud monitoring &amp; analytics</p>
                </div>
                <div className="flex items-center gap-3">
                    {updating && (
                        <span className="flex items-center gap-2 text-slate-500 text-xs">
                            <span className="w-3.5 h-3.5 border-2 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
                            Syncing…
                        </span>
                    )}
                    <div className="live-badge-glow flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-xs font-medium">Live Monitoring</span>
                        <span className="text-emerald-700 text-xs">· {POLL_INTERVAL / 1000}s</span>
                    </div>
                </div>
            </div>

            {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {loading ? (
                    [...Array(4)].map((_, i) => <SkeletonKpiCard key={i} />)
                ) : (
                    <>
                        <KpiCard label="Total Transactions" value={total} sub="All time records" accent="blue" icon="📊" />
                        <KpiCard label="Fraud Detected" value={fraudCount} sub={`${fraudPct}% of total`} accent="red" icon="🚨" />
                        <KpiCard
                            label="Fraud Rate"
                            value={`${fraudPct}%`}
                            sub={`${normalCount} normal transactions`}
                            accent={parseFloat(fraudPct) > 20 ? "red" : "emerald"}
                            icon="📈"
                        />
                        <KpiCard label="Latest Risk Score" value={latestRisk} sub={total > 0 ? `From ${transactions[0].prediction}` : "No data yet"} accent="amber" icon="⚡" />
                    </>
                )}
            </div>

            {/* ── Charts Row ──────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                {/* Bar Chart */}
                <div className="lg:col-span-3 card p-6">
                    <h2 className="text-white font-semibold text-lg mb-1">Transaction Breakdown</h2>
                    <p className="text-slate-500 text-sm mb-5">Fraud vs Normal count</p>
                    {loading ? (
                        <div className="skeleton h-[220px] rounded-xl" />
                    ) : total === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} barCategoryGap="40%">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                                <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 13 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#e2e8f0", fontSize: "13px" }} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                    {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Pie Chart */}
                <div className="lg:col-span-2 card p-6">
                    <h2 className="text-white font-semibold text-lg mb-1">Distribution</h2>
                    <p className="text-slate-500 text-sm mb-3">Fraud vs Normal share</p>
                    {loading ? (
                        <div className="skeleton h-[220px] rounded-xl" />
                    ) : total === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="45%" outerRadius={80} innerRadius={50} dataKey="value" paddingAngle={3}>
                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                                </Pie>
                                <Legend formatter={(v) => <span style={{ color: "#94a3b8", fontSize: "13px" }}>{v}</span>} />
                                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#e2e8f0" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* ── Recent Transactions ──────────────────────────────────────────────── */}
            <div className="card overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
                    <div>
                        <h2 className="text-white font-semibold text-lg">Recent Activity</h2>
                        <p className="text-slate-500 text-sm mt-0.5">
                            Latest 5 transactions · <span className="text-slate-600">{total} total</span>
                        </p>
                    </div>
                    <a href="/detect" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                        + New Detection →
                    </a>
                </div>

                {loading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <tbody><SkeletonTableRows /></tbody>
                        </table>
                    </div>
                ) : recent.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm table-head-sticky">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                                    <th className="text-left px-6 py-3.5 font-medium">#</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Amount</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Hour</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Prediction</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Risk Score</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Status</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Timestamp</th>
                                    <th className="text-left px-6 py-3.5 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {recent.map((tx, i) => {
                                    const isNew = newFraudIds.has(tx.id);
                                    const isFraud = tx.prediction === "FRAUD";
                                    return (
                                        <tr
                                            key={tx.id}
                                            className={`transition-colors
                        ${isNew ? "row-fraud-flash" : isFraud ? "bg-red-500/[0.04] hover:bg-red-500/[0.08]" : "hover:bg-slate-800/30"}
                        ${isFraud ? "fraud-row" : "border-l-3 border-transparent"}`}
                                        >
                                            <td className="px-6 py-4 text-slate-600 font-mono text-xs">{i + 1}</td>
                                            <td className="px-6 py-4 text-white font-semibold">{formatCurrency(tx.amount)}</td>
                                            <td className="px-6 py-4 text-slate-300">{fmtTime(tx.time)}</td>
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
                                    );
                                })}
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

// ── Empty state helpers ───────────────────────────────────────────────────────
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl mb-1">
                📭
            </div>
            <p className="text-slate-300 font-semibold">No transactions monitored yet</p>
            <p className="text-slate-600 text-sm max-w-xs">
                Go to{" "}
                <a href="/detect" className="text-blue-400 hover:underline">/detect</a>{" "}
                to run your first fraud analysis.
            </p>
        </div>
    );
}

function EmptyChart() {
    return (
        <div className="flex items-center justify-center h-[220px] text-slate-600 text-sm gap-2">
            <span>📉</span> No data to display
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
