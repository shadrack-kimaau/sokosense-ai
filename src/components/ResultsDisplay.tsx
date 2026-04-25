import { TrendingUp, TrendingDown, Minus, Info, ArrowRight, Volume2, Square } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { SokoSenseResponse, MarketDataCard } from "../services/geminiService";

interface Props {
  data: SokoSenseResponse;
}

export default function ResultsDisplay({ data }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakAdvice = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${data.assistant_header.greeting}. ${data.negotiation_advice_card.advice_text_sheng}. Action: ${data.negotiation_advice_card.action}`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a Swahili voice
    const voices = window.speechSynthesis.getVoices();
    const swVoice = voices.find(v => v.lang.startsWith('sw') || v.name.includes('Swahili'));
    if (swVoice) utterance.voice = swVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 pb-24"
    >
      {/* Header Greeting */}
      <div className="bg-primary-600 rounded-sm p-6 text-white shadow-geo">
        <h2 className="font-extrabold text-3xl mb-2 leading-tight">{data.assistant_header.greeting}</h2>
        <p className="opacity-90 text-base leading-relaxed">{data.assistant_header.status_message}</p>
      </div>

      {/* Market Data Grid */}
      <div className="grid grid-cols-1 gap-4">
        {data.market_data_cards.map((card, idx) => (
          <MarketCard key={idx} card={card} index={idx} />
        ))}
      </div>

      {/* Negotiation Card */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="geo-card border-l-[6px] border-accent-500!"
      >
        <div className="flex items-center gap-2 mb-4 border-b border-bg-base pb-2">
          <span className="text-xl">🤝</span>
          <span className="text-[12px] font-extrabold uppercase tracking-widest text-[#6A7C68]">Negotiation Strategy</span>
        </div>
        <p className="text-lg font-medium mb-6 leading-relaxed text-gray-800 italic">
          "{data.negotiation_advice_card.advice_text_sheng}"
        </p>

        <div className="flex gap-2 mb-6">
          <button 
            onClick={speakAdvice}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-sm font-extrabold uppercase tracking-widest text-[11px] shadow-geo transition-all active:scale-95 ${
              isSpeaking ? 'bg-red-500 text-white' : 'bg-primary-600 text-white'
            }`}
          >
            {isSpeaking ? (
              <><Square className="w-4 h-4" /> Stop Audio</>
            ) : (
              <><Volume2 className="w-4 h-4" /> Soma Advice (Listen)</>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between bg-accent-500 p-4 rounded-sm shadow-geo">
          <div className="text-white">
            <p className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-0.5">Recommended Action</p>
            <p className="font-extrabold text-lg uppercase tracking-tight leading-none">{data.negotiation_advice_card.action}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-white" />
        </div>
      </motion.div>

      {/* Final Advisory */}
      <div className="flex items-start gap-4 p-5 bg-white border border-[#D1D9CF] rounded-sm">
        <div className="w-2.5 h-2.5 bg-primary-600 rounded-full mt-1.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-[#4A5D48] leading-relaxed">
            <span className="uppercase text-[11px] block mb-1 opacity-60">Market Advisory</span>
            {data.final_advisory_message}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MarketCard({ card, index }: { card: MarketDataCard; index: number }) {
  const isTrend = !!card.direction;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * (index + 1) }}
      className="geo-card flex justify-between items-center"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-extrabold text-[#6A7C68] uppercase tracking-widest">{card.label}</span>
        </div>
        {isTrend ? (
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-primary-600 tracking-tighter">{card.direction}</span>
            <span className="text-3xl">{card.emoji}</span>
          </div>
        ) : (
          <h3 className="text-2xl font-black text-primary-600 tracking-tight font-mono">{card.value}</h3>
        )}
        {!isTrend && card.subtext && (
          <p className="text-[12px] text-gray-500 font-medium mt-2 leading-tight">{card.subtext}</p>
        )}
      </div>
      
      {isTrend && (
        <div className={`w-12 h-12 rounded-sm flex items-center justify-center border-2 ${
          card.direction === 'Rising' ? 'bg-green-50 border-green-200 text-green-600' : 
          card.direction === 'Falling' ? 'bg-red-50 border-red-200 text-red-600' : 
          'bg-gray-50 border-gray-200 text-gray-500'
        }`}>
          {card.direction === 'Rising' && <TrendingUp className="w-6 h-6" />}
          {card.direction === 'Falling' && <TrendingDown className="w-6 h-6" />}
          {card.direction === 'Stable' && <Minus className="w-6 h-6" />}
        </div>
      )}
    </motion.div>
  );
}
