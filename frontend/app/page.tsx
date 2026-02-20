"use client";



import Link from "next/link";

import { useEffect, useState } from "react";

import { getTransactions } from "@/services/api";



export default function HomePage() {

  const [backendOk, setBackendOk] = useState<null | boolean>(null);

  const [txCount, setTxCount] = useState<number | null>(null);



  useEffect(() => {

    getTransactions()

      .then((txs) => {

        setBackendOk(true);

        setTxCount(txs.length);

      })

      .catch(() => setBackendOk(false));

  }, []);



  return (

    <div className="min-h-[calc(100vh-4rem)] bg-[#020817] overflow-hidden relative">



      {/* ── Ambient glow background ────────────────────────────────────────── */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>

        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />

        <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />

        <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px]" />

      </div>



      <div className="relative max-w-5xl mx-auto px-6 py-20">



        {/* ── Hero ──────────────────────────────────────────────────────────── */}

        <div className="text-center mb-20 fade-in">

          {/* Live system badge */}

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8 live-badge-glow">

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

            <span className="text-emerald-400 text-xs font-medium tracking-wide">

              AI System {backendOk === null ? "Initialising" : backendOk ? "Online" : "Offline"}

            </span>

          </div>



          <h1 className="text-6xl sm:text-7xl font-extrabold text-white mb-5 tracking-tight leading-[1.08]">

            Fin<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Guard</span> AI

          </h1>



          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">

            Enterprise-grade fraud intelligence that detects, scores, and blocks

            suspicious transactions in real time — powered by machine learning.

          </p>



          <div className="flex flex-wrap items-center justify-center gap-3">

            <Link

              href="/detect"

              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700

                text-white font-semibold px-7 py-3.5 rounded-xl transition-all

                hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5"

            >

              🔍 Detect Fraud

            </Link>

            <Link

              href="/dashboard"

              className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80

                text-slate-200 font-semibold px-7 py-3.5 rounded-xl border border-slate-700

                transition-all hover:border-slate-500 hover:-translate-y-0.5"

            >

              📊 Open Dashboard

            </Link>

          </div>

        </div>



        {/* ── System Status cards ───────────────────────────────────────────── */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16 fade-in fade-in-delay-1">

          {/* Backend */}

          <div className="card p-5 text-center group">

            <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-xl

              ${backendOk === null ? "bg-yellow-500/10" : backendOk ? "bg-emerald-500/10" : "bg-red-500/10"}`}>

              {backendOk === null ? "⏳" : backendOk ? "✅" : "❌"}

            </div>

            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Backend API</p>

            <p className={`font-semibold text-sm ${backendOk === null ? "text-yellow-400" : backendOk ? "text-emerald-400" : "text-red-400"

              }`}>

              {backendOk === null ? "Checking…" : backendOk ? "Running · Port 8000" : "Unreachable"}

            </p>

          </div>



          {/* ML Model */}

          <div className="card p-5 text-center group">

            <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-xl bg-blue-500/10">

              🧠

            </div>

            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">ML Model</p>

            <p className="text-blue-400 font-semibold text-sm">IsolationForest · Active</p>

          </div>



          {/* Transactions */}

          <div className="card p-5 text-center group">

            <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-xl bg-purple-500/10">

              🗄️

            </div>

            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Transactions</p>

            <p className="text-purple-400 font-semibold text-sm">

              {txCount === null ? "Loading…" : `${txCount} stored`}

            </p>

          </div>

        </div>



        {/* ── Feature Grid ──────────────────────────────────────────────────── */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fade-in fade-in-delay-2">

          {[

            { icon: "⚡", title: "Real-Time Detection", desc: "Sub-100ms ML inference on every transaction submitted." },

            { icon: "📈", title: "Live Analytics", desc: "KPI cards and charts refresh every 5 seconds automatically." },

            { icon: "🚫", title: "One-Click Blocking", desc: "Flag and block fraudulent transactions instantly from the UI." },

            { icon: "🔒", title: "Risk Scoring", desc: "Anomaly-based risk scores from IsolationForest model." },

          ].map(({ icon, title, desc }) => (

            <div key={title} className="card p-6 flex gap-4">

              <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>

              <div>

                <h3 className="text-white font-semibold mb-1">{title}</h3>

                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>

              </div>

            </div>

          ))}

        </div>



        {/* ── Footer note ───────────────────────────────────────────────────── */}

        <p className="text-center text-slate-700 text-xs mt-16 fade-in fade-in-delay-3">

          FinGuard AI · FastAPI + Next.js + IsolationForest · Built for Phase 9

        </p>

      </div>

    </div>

  );

}

