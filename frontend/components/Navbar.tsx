// components/Navbar.tsx — Top navigation bar

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/detect", label: "Transactions" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { user, userData, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="navbar-root w-full sticky top-0 z-50 backdrop-blur-md border-b px-6 py-0 flex items-center justify-between h-16 transition-colors duration-300">
            {/* Brand */}
            <Link href="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                    FG
                </div>
                <span className="navbar-brand font-semibold text-[1.05rem] tracking-tight">
                    Fin<span className="text-blue-400">Guard</span>
                    <span className="navbar-brand-ai font-normal"> AI</span>
                </span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-2">
                {links.map(({ href, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`nav-link relative text-sm font-medium px-4 py-2 rounded-lg transition-colors ${isActive ? 'active' : ''}`}
                        >
                            {label}
                            {isActive && (
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                            )}
                        </Link>
                    );
                })}

                <div className="nav-divider h-6 w-px mx-2" />

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="nav-link text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? "🌙" : "☀️"}
                </button>

                {user && (
                    <>
                        <div className="nav-divider h-6 w-px mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="user-name text-xs font-medium">{userData?.name}</span>
                                <span className="user-role text-[10px]">{userData?.role}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="nav-link text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
}
