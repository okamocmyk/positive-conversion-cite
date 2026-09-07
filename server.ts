import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Initialize Gemini AI lazily
function getGeminiAi() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. API will use smart dictionary fallback.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", hasApiKey: !!process.env.GEMINI_API_KEY });
});

// Reframing Endpoint
app.post("/api/reframe", async (req, res) => {
  const { text, context } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "ネガティブな言葉や出来事を入力してください。" });
  }

  const ai = getGeminiAi();

  if (!ai) {
    // Smart heuristic fallback if no key is present
    return res.json(generateFallbackReframe(text, context));
  }

  try {
    const prompt = `あなたは心理カウンセラーおよびリフレーミングの専門家です。
ユーザーは自分自身や出来事に対してネガティブな自己評価・思考を抱いています。
このネガティブな表現「${text.trim()}」${context ? `（文脈: ${context}）` : ""}を、認知行動療法およびポジティブ心理学のリフレーミング技術を用いて、自己肯定感（Self-Esteem）を高める肯定的な言葉と視点に変換してください。

以下のトーンと原則を守ってください：
1. 嘘っぽいやってつけのポジティブ化ではなく、その性質や出来事の「裏にある真の強み・意図・潜在能力」を見出す。
2. ユーザーの存在と感情を優しく包み込み、否定しない。
3. すぐに唱えられるアファメーション（「私は〜」で始まる短く強力な言葉）を含める。
4. 今後の前向きな行動や意識のヒント（小さな1歩）を提案する。

必ず指定のJSON形式で出力してください。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalText: { type: Type.STRING },
            mainReframedKeyword: {
              type: Type.STRING,
              description: "代表的なポジティブキーワード（例：「行動力がある」「圧倒的な集中力」「繊細で細やかな気配りができる」）",
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "この言葉や出来事に秘められた3つのポジティブな強み・側面",
            },
            situationalExamples: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "この長所が活きる具体的な場面や環境（2〜3項目）",
            },
            selfCompassionMessage: {
              type: Type.STRING,
              description: "自分を肯定し労わる心理カウンセラーからの温かいメッセージ",
            },
            affirmation: {
              type: Type.STRING,
              description: "自己肯定感を高めるアファメーション（「私は〜〜」から始まるポジティブな宣言文）",
            },
            actionAdvice: {
              type: Type.STRING,
              description: "この強みを活かして心地よく過ごすための小さな意識・アクション",
            },
            categoryTag: {
              type: Type.STRING,
              description: "タグ（例：「行動・情熱」「人間関係・思いやり」「失敗・学び」「仕事・集中」「自己理解」）",
            },
          },
          required: [
            "originalText",
            "mainReframedKeyword",
            "strengths",
            "situationalExamples",
            "selfCompassionMessage",
            "affirmation",
            "actionAdvice",
            "categoryTag",
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Gemini returned empty text response");
    }

    const parsedData = JSON.parse(responseText);
    parsedData.originalText = text.trim();
    return res.json(parsedData);
  } catch (error) {
    console.error("Gemini Reframing Error:", error);
    // Fallback on error
    return res.json(generateFallbackReframe(text, context));
  }
});

// Heuristic Reframing Generator for fallback / instant mode
function generateFallbackReframe(input: string, context?: string) {
  const trimmed = input.trim();
  
  // Custom dictionary matching
  if (trimmed.includes("なりふり構わず") || trimmed.includes("暴走") || trimmed.includes("直情")) {
    return {
      originalText: trimmed,
      mainReframedKeyword: "圧倒的な行動力と情熱の持ち主",
      strengths: [
        "目標に向かって迷いなく突き進むエネルギーがある",
        "周囲が躊躇する場面でも素早く第一歩を踏み出せる",
        "自分の「やってみたい」という情熱に誠実である"
      ],
      situationalExamples: [
        "スタートアップや新しい挑戦を始めるスピード感が求められる場面",
        "緊急時や誰も手をあげない問題に真っ先に向き合う時",
        "自分の本当に大切にしたい夢や目標を実現するプロセス"
      ],
      selfCompassionMessage: "なりふり構わず動けるのは、それだけ本気で生きていて情熱を持っている証拠です。周りの目を気にしすぎて動けない人から見れば、あなたのその推進力は眩しいほどの才能ですよ。",
      affirmation: "「私は自分の情熱に従って、パワフルに未来を切り拓く行動力を持っている」",
      actionAdvice: "走り始める直前に『一呼吸だけ深呼吸』を入れて、進む方向を確認するとさらに無敵の行動力になります。",
      categoryTag: "行動・情熱"
    };
  }

  if (trimmed.includes("周り") || trimmed.includes("合わせ") || trimmed.includes("言えない") || trimmed.includes("八方美人")) {
    return {
      originalText: trimmed,
      mainReframedKeyword: "調和を重んじる高度な共感力と協調性",
      strengths: [
        "相手の気持ちや場の雰囲気を察知する繊細な気配り",
        "チームの摩擦を和らげる平和主義と優しさ",
        "多様な意見を受け入れる柔軟な器の広さ"
      ],
      situationalExamples: [
        "チームの調和や意見の仲裁が求められる話し合いの場",
        "初めて出会う人や多様なバックグラウンドを持つ人々との交流",
        "人の気持ちにより添い、安心感を与えるサポート役"
      ],
      selfCompassionMessage: "自分の意見を言わないのは、周囲を傷つけたくない優しさと場の空気を大切にする思いやりがあるからです。あなたの温かさに救われている人がたくさんいます。",
      affirmation: "「私は周囲を優しく包み込み、みんなが心地よく過ごせる環境を作る天才だ」",
      actionAdvice: "「相手を尊重すること」と「自分を大切にすること」は両立できます。まずは小さな選択（今日のランチ等）から自分の本当の望みを叶えてあげましょう。",
      categoryTag: "人間関係・思いやり"
    };
  }

  // General fallback
  return {
    originalText: trimmed,
    mainReframedKeyword: "自分と向き合い進化し続ける深みのある人",
    strengths: [
      "自分の状態や感情を客観的に見つめる自己察知能力",
      "現状に甘んじず『もっと良くなりたい』と願う向上心",
      "物事の繊細な側面に気づくことができる感受性"
    ],
    situationalExamples: [
      "反省を生かして次回さらに素晴らしい結果を出す学びのプロセス",
      "同じように悩む人の気持ちに心から共感し、寄り添える場面",
      "丁寧な振り返りと自己研鑽を通じて深みのある人間性を磨く時"
    ],
    selfCompassionMessage: "「ネガティブだ」と感じる部分は、あなたが真面目に自分の人生に向き合っている証拠です。完璧な人間はいません。その人間らしさこそがあなたの魅力です。",
    affirmation: "「私はありのままの自分を受け入れ、毎日着実に魅力的になっている」",
    actionAdvice: "『〜してしまった』を『〜に気づけた自分はすごい』と言い換えて、今日の自分を労ってあげましょう。",
    categoryTag: "自己理解・成長"
  };
}

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Reframing Server is running on http://localhost:${PORT}`);
  });
}

startServer();
