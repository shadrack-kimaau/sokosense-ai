import { motion } from "motion/react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-base geo-header-border">
      <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-10 h-10 bg-primary-600 rounded-sm flex items-center justify-center shadow-geo"
          >
            <span className="text-white font-extrabold text-xl">S</span>
          </motion.div>
          <div>
            <h1 className="text-xl font-extrabold leading-none tracking-tight text-primary-600">SokoSense AI</h1>
          </div>
        </div>
        
        <div className="bg-[#E8F0E6] px-3 py-1.5 border border-[#B5C9B3] rounded-full">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            <span className="text-[12px] font-bold text-primary-600 uppercase tracking-tighter">Soko ya Leo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
