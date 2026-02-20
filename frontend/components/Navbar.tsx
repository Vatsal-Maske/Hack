// components/Navbar.tsx — Top navigation bar

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/detect", label: "Detect Fraud" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="w-full sticky top-0 z-50 bg-[#0a1628]/80 backdrop-blur-md border-b border-slate-800/60 px-6 py-0 flex items-center justify-between h-16">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                    FG
                </div>
                <span className="text-white font-semibold text-[1.05rem] tracking-tight">
                    Fin<span className="text-blue-400">Guard</span>
                    <span className="text-slate-500 font-normal"> AI</span>
                </span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
                {links.slice(0, 2).map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-colors
              ${pathname === href
                                ? "text-white bg-slate-800/80"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                            }`}
                    >
                        {label}
                        {pathname === href && (
                            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                        )}
                    </Link>
                ))}

                <Link
                    href="/detect"
                    className={`ml-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all
            ${pathname === "/detect"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                            : "bg-blue-600/90 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30"
                        }`}
                >
                    + Detect Fraud
                </Link>
            </div>
        </nav>
    );
}
