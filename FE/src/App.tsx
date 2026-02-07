import { useState } from 'react';
import { Stage } from './components/canvas/Stage';
import { LiveTicker } from './components/hud/LiveTicker';
import { TopBar } from './components/hud/TopBar';

export type ModeType = 'IDENTITY' | 'COMPARISON' | 'ACCESS' | 'COMPLIANCE';
export type LanguageCode = 'EN' | 'HI' | 'ML' | 'KA' | 'TA' | 'TE' | 'BN';
export type InputMode = 'VOICE' | 'TEXT';

export default function App() {
  const [activeMode, setActiveMode] = useState<ModeType>('IDENTITY');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>('EN');
  const [inputMode, setInputMode] = useState<InputMode>('VOICE');
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#080C14] relative">
      {/* Rangoli Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
      
      {/* Zone A: Command Bar */}
      <TopBar 
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        isListening={isListening}
        setIsListening={setIsListening}
        language={language}
        setLanguage={setLanguage}
        inputMode={inputMode}
        setInputMode={setInputMode}
        currentQuery={currentQuery}
        setCurrentQuery={setCurrentQuery}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Zone B: The Stage */}
        <div className="w-[65%] flex items-center justify-center p-8">
          <Stage activeMode={activeMode} />
        </div>

        {/* Zone C: Intelligence Rail */}
        <div className="w-[35%] border-l border-white/10 bg-black/20 backdrop-blur-sm">
          <LiveTicker />
        </div>
      </div>
    </div>
  );
}