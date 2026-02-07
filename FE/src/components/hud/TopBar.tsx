import { Mic, MicOff, ChevronDown, Radio, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import type { ModeType, LanguageCode, InputMode } from '../../App';

interface TopBarProps {
  activeMode: ModeType;
  setActiveMode: (mode: ModeType) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function TopBar({ 
  activeMode, 
  setActiveMode, 
  isListening, 
  setIsListening, 
  language, 
  setLanguage, 
  inputMode, 
  setInputMode,
  currentQuery,
  setCurrentQuery,
  isProcessing,
  setIsProcessing
}: TopBarProps) {
  const modes: ModeType[] = ['IDENTITY', 'COMPARISON', 'ACCESS', 'COMPLIANCE'];
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const languages: { code: LanguageCode; name: string }[] = [
    { code: 'EN', name: 'English' },
    { code: 'HI', name: 'हिन्दी (Hindi)' },
    { code: 'ML', name: 'മലയാളം (Malayalam)' },
    { code: 'KA', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'TA', name: 'தமிழ் (Tamil)' },
    { code: 'TE', name: 'తెలుగు (Telugu)' },
    { code: 'BN', name: 'বাংলা (Bengali)' },
  ];
  
  const selectLanguage = (code: LanguageCode) => {
    setLanguage(code);
    setShowLangDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle text query submission
  const handleTextSubmit = () => {
    if (currentQuery.trim()) {
      setIsProcessing(true);
      setIsListening(true);
      
      // Simulate AI processing
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentQuery('');
        // Here you would update the drug information based on the query
      }, 3000);
    }
  };

  // Handle Enter key in text input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    }
  };
  
  return (
    <>
      <div className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 relative z-10">
        {/* Left: Brand + Product Selector */}
        <AnimatePresence mode="wait">
          {!isListening ? (
            <motion.div
              key="left-full"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9933] via-[#FFC107] to-[#4F46E5]" />
                <span className="font-bold text-white text-lg tracking-tight">Paeon AI</span>
              </div>
              
              <div className="h-8 w-px bg-white/20" />
              
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                <span className="text-sm text-white/90">Current Product</span>
                <ChevronDown className="w-4 h-4 text-white/60" />
              </button>

              <div className="h-8 w-px bg-white/20" />

              {/* Voice/Text Toggle */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setInputMode(inputMode === 'VOICE' ? 'TEXT' : 'VOICE')}
                className="relative w-14 h-7 rounded-full bg-white/10 border border-white/20 transition-all hover:bg-white/15"
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-[#FF9933] via-[#FFC107] to-[#4F46E5] flex items-center justify-center shadow-lg"
                  animate={{
                    x: inputMode === 'VOICE' ? 0 : 28
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  {inputMode === 'VOICE' ? (
                    <Mic className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  )}
                </motion.div>
              </motion.button>

              <motion.div
                layout
                className="relative"
              >
                {inputMode === 'VOICE' ? (
                  <button
                    onClick={() => setIsListening(true)}
                    className="relative"
                  >
                    <motion.div
                      layoutId="voice-control"
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF9933] via-[#FFC107] to-[#4F46E5] flex items-center justify-center"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <MicOff className="w-5 h-5 text-white/80" />
                    </motion.div>
                  </button>
                ) : (
                  <motion.div
                    layoutId="voice-control"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]"
                  >
                    <input
                      type="text"
                      placeholder="Type your query..."
                      className="bg-transparent text-white placeholder:text-white/40 outline-none text-sm font-medium w-38"
                      value={currentQuery}
                      onChange={(e) => setCurrentQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      onClick={handleTextSubmit}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF9933] via-[#FFC107] to-[#4F46E5] flex items-center justify-center hover:shadow-lg transition-shadow flex-shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </motion.div>

              <div className="relative" ref={dropdownRef}>
                <motion.button
                  layoutId="language-toggle"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm text-white/90 font-medium flex items-center gap-1.5"
                >
                  {language}
                  <ChevronDown className="w-3 h-3 text-white/60" />
                </motion.button>
                
                <AnimatePresence>
                  {showLangDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="absolute top-full mt-2 right-0 w-56 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-50"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                            language === lang.code
                              ? 'bg-gradient-to-r from-[#FF9933]/20 to-[#FFC107]/20 text-white font-semibold'
                              : 'text-white/80 hover:bg-white/10'
                          }`}
                        >
                          <span>{lang.name}</span>
                          {language === lang.code && (
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FF9933] to-[#FFC107]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="left-minimal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF9933] via-[#FFC107] to-[#4F46E5]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Dynamic Island when Agent Active */}
        {isListening && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <motion.div
              layoutId="voice-control"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_0_40px_-10px_rgba(255,153,51,0.6)]"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-[#FF9933] to-[#FFC107]"
                />
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-[#FFC107]" />
                  <span className="text-sm font-bold text-white tracking-wide">
                    {isProcessing ? 'Processing Query...' : (inputMode === 'TEXT' ? 'Analyzing Text' : 'Agent Active')}
                  </span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-4 bg-gradient-to-t from-[#FF9933] to-[#FFC107] rounded-full"
                        animate={{ 
                          height: ['12px', '20px', '12px'],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="h-4 w-px bg-white/20" />
                
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    layoutId="language-toggle"
                    onClick={() => setShowLangDropdown(!showLangDropdown)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-sm text-white/90 font-medium flex items-center gap-1.5"
                  >
                    {language}
                    <ChevronDown className="w-3 h-3 text-white/60" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showLangDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="absolute top-full mt-2 right-0 w-56 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden z-50"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => selectLanguage(lang.code)}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                              language === lang.code
                                ? 'bg-gradient-to-r from-[#FF9933]/20 to-[#FFC107]/20 text-white font-semibold'
                                : 'text-white/80 hover:bg-white/10'
                            }`}
                          >
                            <span>{lang.name}</span>
                            {language === lang.code && (
                              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FF9933] to-[#FFC107]" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button
                  onClick={() => setIsListening(false)}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center group"
                >
                  <X className="w-3.5 h-3.5 text-white/60 group-hover:text-white" />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Right: Mode Selector + Profile */}
        <AnimatePresence mode="wait">
          {!isListening ? (
            <motion.div
              key="right-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center gap-4"
            >
              <div className="flex gap-2">
                {modes.map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      activeMode === mode
                        ? 'bg-gradient-to-r from-[#FF9933] to-[#FFC107] text-white shadow-[0_0_20px_-5px_rgba(255,153,51,0.5)]'
                        : 'bg-white/5 text-white/60 hover:text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              
              <div className="h-8 w-px bg-white/20" />

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                DR
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="right-minimal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold"
            >
              DR
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}