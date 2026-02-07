import { useState, useEffect } from 'react';
import { IntelligentHeader } from './components/IntelligentHeader';
import { ChapterNavigation } from './components/ChapterNavigation';
import { DrugIdentity } from './components/DrugIdentity';
import { MechanismCard } from './components/MechanismCard';
import { ComparisonTable } from './components/ComparisonTable';
import { CoverageStatus } from './components/CoverageStatus';
import { ComplianceCard } from './components/ComplianceCard';
import { CommandCenter } from './components/CommandCenter';
import { Footer } from './components/Footer';
import { FloatingCallButton } from './components/FloatingCallButton';
import { DRUG_DATABASE, DrugData } from './data/drugDatabase';

export default function App() {
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDrug, setCurrentDrug] = useState<DrugData | null>(null);
  const [activeChapter, setActiveChapter] = useState('identity');
  const [isNearBottom, setIsNearBottom] = useState(false);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchQuery(query);
      
      // Find drug in database (case-insensitive)
      const drugKey = query.toLowerCase().trim();
      const drugData = DRUG_DATABASE[drugKey as keyof typeof DRUG_DATABASE];
      
      if (drugData) {
        setCurrentDrug(drugData);
        setHasGeneratedContent(true);
      } else {
        // Fallback - use Jardiance template with custom name
        setCurrentDrug({
          ...DRUG_DATABASE.jardiance,
          drug: {
            ...DRUG_DATABASE.jardiance.drug,
            name: query,
            subtitle: 'Generic Medication',
          }
        });
        setHasGeneratedContent(true);
      }
    }
  };

  const handleChapterClick = (chapterId: string) => {
    const element = document.getElementById(chapterId);
    if (element) {
      const offset = 150; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll tracking for active chapter highlighting
  useEffect(() => {
    if (!hasGeneratedContent) return;

    const handleScroll = () => {
      const chapters = ['identity', 'comparison', 'access', 'compliance'];
      const scrollPosition = window.scrollY + 200;

      for (let i = chapters.length - 1; i >= 0; i--) {
        const element = document.getElementById(chapters[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveChapter(chapters[i]);
          break;
        }
      }

      // Check if near bottom (within 600px of document bottom)
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      
      setIsNearBottom(distanceFromBottom < 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasGeneratedContent]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F5F5F7]">
      {/* Animated Gradient Orbs (Northern Lights) */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute left-[20%] top-[10%] h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #00AEEF 0%, transparent 70%)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute right-[15%] top-[30%] h-[500px] w-[500px] rounded-full opacity-25 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #26A69A 0%, transparent 70%)',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
        <div 
          className="absolute bottom-[10%] left-[40%] h-[550px] w-[550px] rounded-full opacity-20 blur-[110px]"
          style={{
            background: 'radial-gradient(circle, #1976D2 0%, transparent 70%)',
            animation: 'float 30s ease-in-out infinite',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>

      {hasGeneratedContent ? (
        <>
          {/* Intelligent Header with Brand Detection */}
          <IntelligentHeader brand={currentDrug?.brand} company={currentDrug?.company} drugName={currentDrug?.drug.name || ''} />

          {/* Chapter Navigation (Sticky) */}
          <ChapterNavigation activeChapter={activeChapter} onChapterClick={handleChapterClick} />

          {/* Single Column Content Stream */}
          <div className="relative mx-auto max-w-[900px] px-8 pb-40">
            <div className="flex flex-col gap-16">
              {/* CHAPTER 1: IDENTITY */}
              <div id="identity" className="scroll-mt-32 flex flex-col gap-12">
                <DrugIdentity drugData={currentDrug} />
                <MechanismCard mechanismData={currentDrug?.mechanism} />
              </div>

              {/* CHAPTER 2: COMPARISON */}
              <ComparisonTable 
                comparisonData={currentDrug?.comparison} 
                brandColor={currentDrug?.brand.color || '#007AFF'} 
              />

              {/* CHAPTER 3: ACCESS */}
              <CoverageStatus 
                coverageData={currentDrug?.coverage} 
                pricing={currentDrug?.pricing}
              />

              {/* CHAPTER 4: COMPLIANCE */}
              <ComplianceCard complianceData={currentDrug?.compliance} />
            </div>
          </div>

          {/* Expanded Command Center at bottom of page */}
          {isNearBottom && (
            <CommandCenter 
              onSearch={handleSearch} 
              isActive={hasGeneratedContent} 
              currentDrug={searchQuery}
              isExpanded={true}
            />
          )}

          {/* Footer */}
          <Footer />
        </>
      ) : (
        /* Empty State Message */
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 
              className="mb-4 text-4xl font-bold tracking-tight text-black/40"
              style={{ fontFamily: 'Source Sans Pro, -apple-system, system-ui, sans-serif' }}
            >
              Ask about any medication
            </h2>
            <p 
              className="mb-8 text-lg font-semibold text-black/30"
              style={{ fontFamily: 'Source Sans Pro, -apple-system, system-ui, sans-serif' }}
            >
              Type a drug name to generate intelligent insights
            </p>

            {/* Quick Examples */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span 
                className="text-xs uppercase tracking-wider font-normal text-black/30"
                style={{ fontFamily: 'Source Sans Pro, -apple-system, system-ui, sans-serif' }}
              >
                Try:
              </span>
              {['Foracort', 'Eliquis', 'Tremfya', 'Jardiance'].map((drug) => (
                <button
                  key={drug}
                  onClick={() => handleSearch(drug)}
                  className="rounded-full px-4 py-2 text-sm font-normal transition-all hover:scale-105"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    color: 'rgba(0, 0, 0, 0.6)',
                    fontFamily: 'Source Sans Pro, -apple-system, system-ui, sans-serif'
                  }}
                >
                  {drug}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Input Bar - hide when expanded version is visible */}
      {!isNearBottom && (
        <CommandCenter 
          onSearch={handleSearch} 
          isActive={hasGeneratedContent} 
          currentDrug={searchQuery} 
        />
      )}

      {/* Floating Call Button */}
      <FloatingCallButton />
    </div>
  );
}