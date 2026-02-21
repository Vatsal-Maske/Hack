export function formatRiskPercentage(riskScore: number): string {
    return `${(riskScore * 100).toFixed(2)}%`;
}

export function riskTextColorClass(riskScore: number): string {
    const pct = riskScore * 100;
    if (pct < 40) return "text-emerald-400";
    if (pct < 70) return "text-yellow-400";
    return "text-red-400";
}
