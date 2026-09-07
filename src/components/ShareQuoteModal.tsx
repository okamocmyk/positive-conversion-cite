import React, { useState } from "react";
import { X, Copy, Check, Sparkles, Heart } from "lucide-react";
import { ReframedCard } from "../types";

interface ShareQuoteModalProps {
  card: ReframedCard;
  onClose: () => void;
}

export const ShareQuoteModal: React.FC<ShareQuoteModalProps> = ({ card, onClose }) => {
  const [copied, setCopied] = useState(false);

  const formattedShareText = `✨【ココロ・リフレーミング】✨
  
ネガティブ：『${card.originalText}』
↓
🌈 ポジティブ再定義：『${card.mainReframedKeyword}』

【強み発見】
${card.strengths.map((s) => `・${s}`).join("\n")}

【アファメーション】
${card.affirmation}

心のお守りメッセージ：
「${card.selfCompassionMessage}」

#リフレーミング #自己肯定感 #ポジティブ変換`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/70 backdrop-blur-3xl rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-white/80 flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/50 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-gray-800 text-base">お守りカードをシェア・保存</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Card Preview */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-white/50 pb-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 border border-indigo-200">
                {card.categoryTag || "自己肯定感"}
              </span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">元の気づき</p>
              <p className="text-gray-600 line-through text-sm italic">「{card.originalText}」</p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-indigo-600 mb-1 font-bold">✨ リフレーミング</p>
              <h4 className="text-xl font-bold text-gray-800 leading-snug">
                {card.mainReframedKeyword}
              </h4>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white p-4 rounded-2xl shadow-sm space-y-1">
              <p className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> アファメーション
              </p>
              <p className="text-white font-bold text-sm leading-relaxed">
                {card.affirmation}
              </p>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed bg-white/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/60">
              {card.selfCompassionMessage}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">コピー用テキスト</label>
            <textarea
              readOnly
              rows={5}
              value={formattedShareText}
              className="w-full text-xs font-mono bg-white/40 border border-white/60 rounded-2xl p-3.5 text-gray-700 leading-relaxed focus:outline-none shadow-inner"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/50 bg-white/40 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 text-sm hover:bg-white/60 rounded-full font-bold transition-colors"
          >
            閉じる
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-md shadow-indigo-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                コピーしました！
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                テキストをコピー
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
