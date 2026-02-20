// components/StatusBadge.tsx — Prediction result badge

interface StatusBadgeProps {
    prediction: "FRAUD" | "NORMAL";
    size?: "sm" | "md";
}

export default function StatusBadge({ prediction, size = "md" }: StatusBadgeProps) {
    const isFraud = prediction === "FRAUD";

    if (size === "sm") {
        return (
            <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide
          ${isFraud
                        ? "bg-red-500/15 text-red-400 border border-red-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    }`}
            >
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isFraud ? "bg-red-400" : "bg-emerald-400"}`} />
                {prediction}
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest shadow-sm
        ${isFraud
                    ? "bg-red-500/15 text-red-400 border border-red-500/40 shadow-red-500/10"
                    : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/10"
                }`}
        >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isFraud ? "bg-red-400 animate-pulse" : "bg-emerald-400"}`} />
            {prediction}
        </span>
    );
}
