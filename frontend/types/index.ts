// types/index.ts — Shared TypeScript interfaces for FinGuard AI

export interface TransactionInput {
    amount: number;
    time: number;
}

export interface PredictResult {
    prediction: "FRAUD" | "NORMAL";
    risk_score: number;
}

export interface Transaction {
    id: number;
    amount: number;
    time: number;
    prediction: "FRAUD" | "NORMAL";
    risk_score: number;
    status: "ACTIVE" | "BLOCKED";
    created_at: string;
}
