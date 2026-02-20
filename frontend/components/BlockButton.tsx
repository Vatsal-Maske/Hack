// components/BlockButton.tsx — Block action button for FRAUD transactions

"use client";

import { useState } from "react";
import { blockTransaction } from "@/services/api";

interface BlockButtonProps {
    transactionId: number;
    onBlocked: () => void; // callback to refresh parent data
}

export default function BlockButton({ transactionId, onBlocked }: BlockButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleBlock = async () => {
        setLoading(true);
        try {
            await blockTransaction(transactionId);
            onBlocked();
        } catch {
            // Silently fail — parent refresh will correct state
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleBlock}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
        bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/30
        text-red-400 border border-red-500/30 hover:border-red-500/50
        disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            {loading ? (
                <>
                    <span className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                    Blocking…
                </>
            ) : (
                <>🚫 Block</>
            )}
        </button>
    );
}
