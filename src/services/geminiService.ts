import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface MarketDataCard {
  label: string;
  value?: string;
  subtext?: string;
  direction?: "Rising" | "Falling" | "Stable";
  emoji?: string;
}

export interface NegotiationAdviceCard {
  label: string;
  advice_text_sheng: string;
  action: string;
}

export type LanguageMode = "english" | "swahili" | "sheng" | "auto";

export interface SokoSenseResponse {
  user_query_analysis: string;
  assistant_header: {
    greeting: string;
    status_message: string;
  };
  market_data_cards: MarketDataCard[];
  negotiation_advice_card: NegotiationAdviceCard;
  final_advisory_message: string;
}

const SYSTEM_INSTRUCTION = `
You are SokoSense AI, a highly intelligent Negotiation Agent for small-scale farmers in Kenya.
Your mission: Reduce information gap and improve farmer earnings.

📊 REFERENCE MARKET DATA (Simulated Context):
- Maize (90kg bag): Eldoret (3200-3400), Kitale (3100-3300), Nairobi (3800-4100). Trend: Rising due to harvest season ending.
- Potatoes (50kg bag): Nakuru (2200-2600), Nairobi (2800-3200), Molo (2000-2300). Trend: Stable.
- Tomatoes (Crate): Nairobi (4500-5000), Kajiado (3800-4200). Trend: Falling due to high supply.
- Beans (90kg): Eldoret (8000-8500), Nairobi (9500-11000). Trend: Rising.

🌾 CORE CAPABILITIES:
1. Market Intelligence: Compare prices (Eldoret, Kitale, Nakuru, Nairobi).
2. Predictive Pricing: Estimate short-term movement (3–7 days).
3. Negotiation Guidance: Actionable advice (Accept, Reject, Counter).
4. Code-Switching: Adhere strictly to the requested language mode.

🧩 LANGUAGE RULES:
The user will provide a 'language_mode'. You MUST strictly follow it:
- "english": Respond ONLY in English.
- "swahili": Respond ONLY in Swahili.
- "sheng": Respond ONLY in Sheng.
- "auto": Naturally mix English, Swahili, and Sheng (Default).

Example (auto): "Bro, soko ya Eldoret iko 3000 leo 📈. Usikubali 2800, hiyo ni chini sana. Jaribu 3100–3200, utakuwa safe."

🧩 OUTPUT RULES:
- ALWAYS return ONLY valid JSON.
- Be concise and practical.
- Use estimates for prices based on logic (reasoning about supply/demand).
- Stay within agricultural context.
`;

export async function getSokoSenseAnalysis(query: string, languageMode: LanguageMode = "auto"): Promise<SokoSenseResponse> {
  try {
    const prompt = `LANGUAGE_MODE: ${languageMode}\nUSER_QUERY: ${query}`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            user_query_analysis: { type: Type.STRING },
            assistant_header: {
              type: Type.OBJECT,
              properties: {
                greeting: { type: Type.STRING },
                status_message: { type: Type.STRING }
              },
              required: ["greeting", "status_message"]
            },
            market_data_cards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  subtext: { type: Type.STRING },
                  direction: { type: Type.STRING, enum: ["Rising", "Falling", "Stable"] },
                  emoji: { type: Type.STRING }
                },
                required: ["label"]
              }
            },
            negotiation_advice_card: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                advice_text_sheng: { type: Type.STRING },
                action: { type: Type.STRING }
              },
              required: ["label", "advice_text_sheng", "action"]
            },
            final_advisory_message: { type: Type.STRING }
          },
          required: ["user_query_analysis", "assistant_header", "market_data_cards", "negotiation_advice_card", "final_advisory_message"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as SokoSenseResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("SokoSense is currently offline. Please try again later.");
  }
}
