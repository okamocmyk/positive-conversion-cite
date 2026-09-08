import React from "react";
import {
  Sparkles,
  BookOpen,
  BookmarkCheck,
  Sun,
  Heart,
  Flame,
  Calendar as CalendarIcon,
  Crown,
  LogIn,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  Cloud
} from "lucide-react";
import { UserStats } from "../types";
import { useAuth } from "../context/AuthContext";

export type NavTab = "ai" | "dictionary" | "journal" | "calendar" | "character" | "daily";

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  stats: UserStats;
  partnerName?: string;
  partnerLevel?: number;
  isSyncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stats,
  partnerName = "ココロん",
  partnerLevel = 1,
  isSyncing = false,
}) => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  return (
    <header className="bg-white/40 backdrop-blur-2xl border-b border-white/60 sticky top-0 z-30 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/60 flex items-center justify-center shadow-sm text-indigo-500">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-1.5">
                ココロ・リフレーミング
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/80 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  自己肯定感UP
                </span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                ネガティブな視点を「あなたの強み」へ優しく変換
              </p>
            </div>
          </div>

          {/* User Account & Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab("character")}
              className="bg-white/50 backdrop-blur-md border border-white/60 text-purple-900 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs font-medium hover:bg-white/80 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-purple-500" />
              <span>{partnerName} <strong className="font-bold text-purple-950">Lv.{partnerLevel}</strong></span>
            </button>
            <div className="bg-white/50 backdrop-blur-md border border-white/60 text-indigo-900 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs font-medium">
              <Flame className="w-3.5 h-3.5 text-indigo-500" />
              <span>変換数 <strong className="font-bold text-indigo-950">{stats.totalReframed}</strong>回</span>
            </div>

            {/* Auth status & actions */}
            {user ? (
              <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur-md border border-emerald-200/80 rounded-full pl-1.5 pr-2 py-1 shadow-2xs">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                    {user.displayName ? user.displayName.slice(0, 1) : "U"}
                  </div>
                )}
                <span className="font-medium text-gray-700 max-w-[100px] truncate text-[11px]" title={user.email || ""}>
                  {user.displayName || user.email?.split("@")[0] || "ログイン中"}
                </span>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  保存済
                </span>
                <button
                  id="header-logout-btn"
                  onClick={() => signOut()}
                  className="text-stone-400 hover:text-red-500 ml-1 p-0.5 rounded-full transition-colors cursor-pointer"
                  title="ログアウト"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => signInWithGoogle()}
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs transition-all cursor-pointer text-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>ログインして保存</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1.5 mt-3 pt-2 border-t border-white/40 overflow-x-auto no-scrollbar">
          <button
            id="tab-btn-ai"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "ai"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AIリフレーミング
          </button>

          <button
            id="tab-btn-calendar"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "calendar"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            カレンダー
          </button>

          <button
            id="tab-btn-character"
            onClick={() => setActiveTab("character")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "character"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            パートナー＆きせかえ
          </button>

          <button
            id="tab-btn-dictionary"
            onClick={() => setActiveTab("dictionary")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "dictionary"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            変換辞書（言葉図鑑）
          </button>

          <button
            id="tab-btn-journal"
            onClick={() => setActiveTab("journal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "journal"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-pink-400" />
            マイノート ({stats.favoritesCount})
          </button>

          <button
            id="tab-btn-daily"
            onClick={() => setActiveTab("daily")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "daily"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                : "bg-white/30 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/60 shadow-2xs"
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            今日のアファメーション
          </button>
        </nav>
      </div>
    </header>
  );
};

