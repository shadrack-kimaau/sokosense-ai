/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, AlertCircle, RefreshCw, Languages, ArrowRight, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import ResultsDisplay from "./components/ResultsDisplay";
import { getSokoSenseAnalysis, SokoSenseResponse, LanguageMode } from "./services/geminiService";

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

const { SpeechRecognition, webkitSpeechRecognition } = window as unknown as IWindow;

export default function App() {
  const [query, setQuery] = useState("");
  const [languageMode, setLanguageMode] = useState<LanguageMode>("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SokoSenseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await getSokoSenseAnalysis(query, languageMode);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Jaribu tena baadae.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRec = SpeechRecognition || webkitSpeechRecognition;
    if (!SpeechRec) {
      setError("Voice search is not supported in your browser. Jaribu kutumia Chrome.");
      return;
    }

    recognitionRef.current = new SpeechRec();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    
    // Attempt to set language based on mode
    if (languageMode === "swahili") {
      recognitionRef.current.lang = "sw-KE";
    } else if (languageMode === "english") {
      recognitionRef.current.lang = "en-US";
    } else {
      // Auto/Sheng - Swahili is usually better for Sheng transcription in Web Speech
      recognitionRef.current.lang = "sw-KE";
    }

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
      
      // Auto-submit logic
      if (transcript.trim().length > 3) {
        // We use a small timeout to let the UI update the text field first
        setTimeout(() => {
          // Find the form and submit it
          const form = document.querySelector('form');
          if (form) form.requestSubmit();
        }, 500);
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech Recognition Error", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setError("Microphone access denied. Please enable it in your settings.");
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const setSampleQuery = (q: string) => {
    setQuery(q);
  };

  useEffect(() => {
    if (result || error) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [result, error]);

  return (
    <div className="min-h-screen bg-bg-base flex flex-col max-w-md mx-auto relative shadow-2xl shadow-gray-200">
      <Header />

      <main className="flex-1 px-4 pt-6 pb-40">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="text-left space-y-4 py-4">
            <h2 className="text-4xl font-extrabold text-primary-600 tracking-tighter leading-none">
              Oya Farmer, <br/>
              <span className="text-accent-500">Rada iko aje? 👋</span>
            </h2>
            <p className="text-[#4A5D48] text-lg font-medium leading-tight max-w-[300px]">
              Expert agro-negotiation and market intelligence in your pocket.
            </p>
          </div>

          {/* Language Selector */}
          <div className="geo-card flex items-center justify-between py-3">
             <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary-600" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6A7C68]">Language Mode</span>
             </div>
             <select 
               value={languageMode}
               onChange={(e) => setLanguageMode(e.target.value as LanguageMode)}
               className="bg-bg-base border border-[#D1D9CF] rounded-sm text-[11px] font-bold py-1 px-2 focus:ring-1 focus:ring-primary-600 outline-none"
             >
               <option value="auto">Auto (Mix)</option>
               <option value="english">English</option>
               <option value="swahili">Swahili</option>
               <option value="sheng">Sheng</option>
             </select>
          </div>

          {/* Quick Suggestions if no result */}
          {!result && !isLoading && (
            <div className="grid grid-cols-1 gap-3">
              <SuggestionCard 
                text="Bei ya Mahindi Eldoret ni gani?" 
                subtext="📍 Eldoret Maize Prices" 
                onClick={() => setSampleQuery("Bei ya Mahindi Eldoret ni gani leo?")}
              />
              <SuggestionCard 
                text="Napata 2500 kwa Viazi Nakuru, ni deal poa?" 
                subtext="🤝 Negotiation Strategy"
                onClick={() => setSampleQuery("Napata 2500 kwa Viazi Nakuru, ni deal poa?")}
              />
            </div>
          )}

          {/* Result Display */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="geo-card bg-primary-600 text-white flex flex-col items-center text-center py-10 space-y-4"
              >
                <Loader2 className="w-12 h-12 animate-spin" />
                <div>
                  <p className="font-extrabold text-xl uppercase tracking-tight">Tunasoma Soko...</p>
                  <p className="text-sm opacity-80">Scanning markets for the best deal.</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="geo-card border-red-200 bg-red-50 text-center space-y-4"
              >
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
                <p className="text-red-900 font-bold">{error}</p>
                <button 
                  onClick={() => handleSubmit()}
                  className="px-6 py-2 bg-red-500 text-white rounded-sm text-xs font-extrabold uppercase tracking-widest shadow-geo"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {result && <ResultsDisplay data={result} />}
          </AnimatePresence>

          <div ref={scrollRef} />
        </div>
      </main>

      {/* Persistent Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pt-8 bg-gradient-to-t from-bg-base via-bg-base to-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <form 
            onSubmit={handleSubmit}
            className={`geo-card flex items-center gap-3 p-2 pl-5 bg-white! transition-all ${isListening ? 'ring-2 ring-primary-600' : ''}`}
          >
            <input 
              type="text"
              placeholder={isListening ? "Listening... Ongea sasa" : "Uliza bei au negotiation help..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading || isListening}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-gray-400 font-bold"
            />
            
            <button 
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all shadow-geo scale-90 ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-bg-base text-primary-600 hover:bg-primary-50'
              }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button 
              type="submit"
              disabled={isLoading || isListening || !query.trim()}
              className="px-6 py-3 bg-accent-500 text-white rounded-sm flex items-center justify-center transition-all active:translate-x-1 active:translate-y-1 active:shadow-none shadow-geo disabled:opacity-50 disabled:grayscale"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          
          <div className="flex justify-between items-center px-2 mt-4">
             <div className="flex items-center gap-2 opacity-50">
                <div className="w-2 h-2 bg-primary-600 rounded-full" />
                <span className="text-[10px] uppercase font-extrabold tracking-widest">Soko Intelligence</span>
             </div>
             <div className="flex items-center gap-1 opacity-40">
                <Sparkles className="w-3 h-3" />
                <span className="text-[10px] uppercase font-bold tracking-tighter">AI Analysis</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionCard({ text, subtext, onClick }: { text: string; subtext: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="geo-card text-left flex justify-between items-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-98 group bg-white!"
    >
      <div>
        <p className="text-primary-600 font-extrabold text-base leading-tight mb-1">{text}</p>
        <p className="text-[10px] text-[#6A7C68] uppercase font-extrabold tracking-widest">{subtext}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-accent-500 opacity-50 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
