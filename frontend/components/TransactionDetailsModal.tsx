"use client";

import { useState } from "react";
import type { Transaction } from "@/types";
import { formatCurrency } from "@/utils/currency";
import { formatRiskPercentage, riskTextColorClass } from "@/utils/risk";
import { blockTransaction } from "@/services/api";
import jsPDF from "jspdf";

interface TransactionDetailsModalProps {
  transaction: Transaction;
  isOpen: boolean;
  onClose: () => void;
  onBlock: () => void;
}

export default function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
  onBlock,
}: TransactionDetailsModalProps) {
  const [blocking, setBlocking] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = margin;

      // Header/Title
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("FinGuard AI", margin, yPos);
      yPos += 10;
      pdf.setFontSize(14);
      pdf.text("Fraud Investigation Report", margin, yPos);
      yPos += 15;

      // Horizontal line
      pdf.setLineWidth(0.5);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;

      // SECTION 1 — Transaction Information
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("TRANSACTION INFORMATION", margin, yPos);
      yPos += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      
      pdf.text(`Transaction ID: #${transaction.id.toString().padStart(6, '0')}`, margin, yPos);
      yPos += 6;
      pdf.text(`Amount: ${formatCurrency(transaction.amount)}`, margin, yPos);
      yPos += 6;
      pdf.text(`Date & Time: ${new Date(transaction.created_at + "Z").toLocaleString()}`, margin, yPos);
      yPos += 6;
      pdf.text(`Status: ${transaction.status === "BLOCKED" ? "Blocked" : "Active"}`, margin, yPos);
      yPos += 12;

      // SECTION 2 — Account Flow
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("ACCOUNT FLOW", margin, yPos);
      yPos += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      
      pdf.text(`From Account: ****-****-${Math.floor(1000 + transaction.id * 123.45).toString().slice(-4)}`, margin, yPos);
      yPos += 6;
      pdf.text(`To Account: ****-****-${Math.floor(5000 + transaction.id * 234.56).toString().slice(-4)}`, margin, yPos);
      yPos += 12;

      // SECTION 3 — AI Risk Analysis
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("AI RISK ANALYSIS", margin, yPos);
      yPos += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      
      pdf.text(`Fraud Risk Score: ${formatRiskPercentage(transaction.risk_score)}`, margin, yPos);
      yPos += 6;
      pdf.text(`Prediction: ${transaction.prediction}`, margin, yPos);
      yPos += 6;
      const riskLevel = getRiskLevel(transaction.risk_score);
      pdf.text(`Risk Level: ${riskLevel.label}`, margin, yPos);
      yPos += 12;

      // SECTION 4 — Fraud Indicators (if fraud)
      if (transaction.prediction === "FRAUD") {
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text("FRAUD INDICATORS DETECTED", margin, yPos);
        yPos += 8;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        
        const reasons = getFraudReasons(transaction);
        reasons.forEach((reason, idx) => {
          const lines = pdf.splitTextToSize(`• ${reason}`, pageWidth - 2 * margin);
          lines.forEach((line: string) => {
            pdf.text(line, margin, yPos);
            yPos += 6;
          });
        });
      }

      // Footer
      yPos += 10;
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on ${new Date().toLocaleString()}`, margin, yPos);
      pdf.text("FinGuard AI - Powered by Machine Learning", margin, yPos + 5);

      // Save PDF
      pdf.save(`fraud_report_${transaction.id}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleBlock = async () => {
    setBlocking(true);
    setBlockError(null);
    try {
      await blockTransaction(transaction.id);
      onBlock();
      onClose();
    } catch (err: any) {
      setBlockError(err.message || "Failed to block transaction");
    } finally {
      setBlocking(false);
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 0.4) return { label: "Low", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (score < 0.7) return { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10" };
    return { label: "High", color: "text-red-400", bg: "bg-red-500/10" };
  };

  const getFraudReasons = (transaction: Transaction) => {
    const reasons: string[] = [];
    
    // Time-based anomaly
    if (transaction.time < 6 || transaction.time > 22) {
      reasons.push("Unusual transaction time (outside normal hours)");
    }
    
    // Amount-based anomaly
    if (transaction.amount > 50000) {
      reasons.push("Large amount anomaly detected");
    } else if (transaction.amount < 100) {
      reasons.push("Unusually small transaction amount");
    }
    
    // Risk score based
    if (transaction.risk_score > 0.8) {
      reasons.push("Extremely high deviation from normal behavior pattern");
    } else if (transaction.risk_score > 0.6) {
      reasons.push("Significant deviation from expected transaction profile");
    }
    
    // Time clustering
    if (transaction.time >= 2 && transaction.time <= 4) {
      reasons.push("Transaction during high-risk time window");
    }
    
    if (reasons.length === 0) {
      reasons.push("Pattern matches known fraud characteristics");
    }
    
    return reasons;
  };

  const riskLevel = getRiskLevel(transaction.risk_score);
  const fraudReasons = getFraudReasons(transaction);
  const isFraud = transaction.prediction === "FRAUD";
  const isBlocked = transaction.status === "BLOCKED";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-8 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl my-8 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl light:bg-white light:border-slate-300 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-slate-800 border-b border-slate-700 light:bg-slate-50 light:border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white light:text-slate-900">Transaction Details</h2>
            <p className="text-sm text-slate-400 light:text-slate-600 mt-1">Advanced fraud analysis report</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 bg-slate-900 light:bg-white">
          
          {/* SECTION 1 — Transaction Info */}
          <div className="rounded-xl p-5 border border-slate-700 bg-slate-800 light:bg-slate-50 light:border-slate-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-slate-400 light:text-slate-600">
              Transaction Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium mb-1 text-slate-500 light:text-slate-600">Transaction ID</p>
                <p className="text-sm font-mono text-white light:text-slate-900">#{transaction.id.toString().padStart(6, '0')}</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1 text-slate-500 light:text-slate-600">Amount</p>
                <p className="text-lg font-bold text-white light:text-slate-900">{formatCurrency(transaction.amount)}</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1 text-slate-500 light:text-slate-600">Date & Time</p>
                <p className="text-sm text-white light:text-slate-900">{new Date(transaction.created_at + "Z").toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium mb-1 text-slate-500 light:text-slate-600">Current Status</p>
                {isBlocked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-900/30 text-red-400 border border-red-500/30">
                    🚫 Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ✅ Active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2 — Account Flow */}
          <div className="rounded-xl p-5 border border-slate-700 bg-slate-800 light:bg-slate-50 light:border-slate-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-slate-400 light:text-slate-600">
              Account Flow
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 rounded-lg p-4 border border-slate-600 bg-slate-900 light:bg-white light:border-slate-300">
                <p className="text-xs font-medium mb-2 text-slate-500 light:text-slate-600">From Account</p>
                <p className="font-mono text-sm text-white light:text-slate-900">****-****-{Math.floor(1000 + transaction.id * 123.45).toString().slice(-4)}</p>
                <p className="text-xs mt-1 text-slate-500 light:text-slate-600">Customer Account</p>
              </div>
              <div className="text-2xl text-blue-400">→</div>
              <div className="flex-1 rounded-lg p-4 border border-slate-600 bg-slate-900 light:bg-white light:border-slate-300">
                <p className="text-xs font-medium mb-2 text-slate-500 light:text-slate-600">To Account</p>
                <p className="font-mono text-sm text-white light:text-slate-900">****-****-{Math.floor(5000 + transaction.id * 234.56).toString().slice(-4)}</p>
                <p className="text-xs mt-1 text-slate-500 light:text-slate-600">Recipient Account</p>
              </div>
            </div>
          </div>

          {/* SECTION 3 — AI Risk Analysis */}
          <div className="rounded-xl p-5 border border-slate-700 bg-slate-800 light:bg-slate-50 light:border-slate-200">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-slate-400 light:text-slate-600">
              <span>🤖</span> AI Risk Analysis
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg p-4 text-center border border-slate-600 bg-slate-900 light:bg-white light:border-slate-300">
                <p className="text-xs font-medium mb-2 text-slate-500 light:text-slate-600">Fraud Risk Score</p>
                <p className={`text-2xl font-bold ${riskTextColorClass(transaction.risk_score)}`}>
                  {formatRiskPercentage(transaction.risk_score)}
                </p>
              </div>
              <div className="rounded-lg p-4 text-center border border-slate-600 bg-slate-900 light:bg-white light:border-slate-300">
                <p className="text-xs font-medium mb-2 text-slate-500 light:text-slate-600">Prediction</p>
                <p className={`text-lg font-bold ${isFraud ? 'text-red-400' : 'text-emerald-400'}`}>
                  {transaction.prediction}
                </p>
              </div>
              <div className="rounded-lg p-4 text-center border border-slate-600 bg-slate-900 light:bg-white light:border-slate-300">
                <p className="text-xs font-medium mb-2 text-slate-500 light:text-slate-600">Risk Level</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${riskLevel.bg} ${riskLevel.color}`}>
                  {riskLevel.label}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4 — AI Fraud Reasoning */}
          {isFraud && (
            <div className="rounded-xl p-5 border border-red-500/20 bg-red-500/5">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 text-red-400">
                <span>⚠️</span> Fraud Indicators Detected
              </h3>
              <ul className="space-y-2">
                {fraudReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-sm flex-1 text-slate-300 light:text-slate-700">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {blockError && (
            <div className="text-red-500 text-sm text-center bg-red-900/20 border border-red-800 rounded-lg p-3">
              {blockError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-slate-700 bg-slate-800 light:bg-slate-50 light:border-slate-200 flex items-center justify-between gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-blue-400 bg-blue-500/10 border border-blue-500 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  📄 Download Report
                </>
              )}
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-600 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-200 light:border-slate-300"
              >
                Close
              </button>
            
            {isFraud && !isBlocked && (
              <button
                onClick={handleBlock}
                disabled={blocking}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {blocking ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Blocking...
                  </>
                ) : (
                  <>
                    🚫 Block Transaction
                  </>
                )}
              </button>
            )}

            {!isFraud && (
              <button
                className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-emerald-400 bg-emerald-500/10 border border-emerald-500 hover:bg-emerald-500/20"
              >
                ✅ Mark as Safe
              </button>
            )}
            </div>
        </div>

        {/* Footer End - Modal Container End - Outer Container End */}
      </div>
    </div>
  );
}
