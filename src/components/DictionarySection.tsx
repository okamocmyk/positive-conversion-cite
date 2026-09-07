import React, { useState } from "react";
import { Search, Sparkles, Volume2, ArrowRight, BookOpen, Tag } from "lucide-react";
import { REFRAMING_DICTIONARY } from "../data/dictionary";
import { ReframingDictionaryItem } from "../types";
import { speakText } from "../utils/speech";

interface DictionarySectionProps {
  onSelectForAi: (word: string) => void;
}

export const DictionarySection: React.FC<DictionarySectionProps> = ({ onSelectForAi }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");

  const categories = ["すべて", "性格・自己評価", "人間関係・コミュニケーション", "行動・習慣", "出来事・失敗"];

  const filteredItems = REFRAMING_DICTIONARY.filter((item) => {
    const matchesCategory = selectedCategory === "すべて" || item.category === selectedCategory;
    const matchesSearch =
      item.negativeWord.includes(searchTerm) ||
      item.reframedKeywords.some((k) => k.includes(searchTerm)) ||
      item.explanation.includes(searchTerm) ||
      item.tags.some((t) => t.includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Header Banner */}
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[32px] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              定番ポジティブ変換辞書
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              ネガティブ言葉図鑑（{filteredItems.length}件）
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
              よくある自己批判やコンプレックスを即座に「才能・長所」へ言い換える心理学辞書です。
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="言葉やタグで検索（例: 「頑固」「失敗」「飽き性」「優しさ」）"
            className="w-full bg-white/30 backdrop-blur-md border border-white/50 focus:border-indigo-300 focus:bg-white/60 focus:ring-2 focus:ring-indigo-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-1.5 rounded-full font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-200"
                  : "bg-white/40 backdrop-blur-md border border-white/60 text-gray-700 hover:bg-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Category & Tags */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100/80 text-indigo-700 border border-indigo-200">
                  {item.category}
                </span>
                <button
                  onClick={() => speakText(`ネガティブ。${item.negativeWord}。ポジティブ言い換え。${item.reframedKeywords.join('、')}。アファメーション。${item.affirmation}`)}
                  className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-white/50 transition-colors"
                  title="音声を聴く"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Negative vs Positive Heading */}
              <div>
                <p className="text-xs text-gray-400 line-through">「{item.negativeWord}」</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {item.reframedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-base font-bold text-indigo-700 bg-white/70 backdrop-blur-sm px-3 py-0.5 rounded-xl border border-indigo-100/80 shadow-2xs"
                    >
                      ✨ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <p className="text-xs text-gray-700 leading-relaxed bg-white/30 backdrop-blur-md p-3 rounded-xl border border-white/60">
                {item.explanation}
              </p>

              {/* Situations */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-500 block uppercase tracking-wider">活きる場面:</span>
                <ul className="text-xs text-gray-700 space-y-0.5 list-disc list-inside">
                  {item.situations.map((sit, idx) => (
                    <li key={idx}>{sit}</li>
                  ))}
                </ul>
              </div>

              {/* Affirmation */}
              <div className="bg-indigo-50/70 backdrop-blur-md p-3 rounded-xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-900 leading-snug">
                  「{item.affirmation}」
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-white/40 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 flex-wrap">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] text-gray-500 bg-white/40 px-2 py-0.5 rounded-full border border-white/60">
                    #{t}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onSelectForAi(item.negativeWord)}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white/60 hover:bg-white px-3.5 py-1.5 rounded-full border border-indigo-200 transition-all flex items-center gap-1 shrink-0 shadow-2xs"
              >
                <span>AIで深掘り</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white/40 backdrop-blur-2xl rounded-3xl border border-dashed border-white/80 text-gray-500 text-sm">
            該当する言葉が見つかりませんでした。「AIリフレーミング」で自由に自由入力してみてください。
          </div>
        )}
      </div>
    </div>
  );
};
