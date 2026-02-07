import { ArrowRight } from 'lucide-react';

export function ComparisonCard() {
  const comparisonData = [
    {
      parameter: 'HbA1c Reduction',
      us: '1.5%',
      competitor: '1.2%',
      favorable: true
    },
    {
      parameter: 'GI Tolerability',
      us: 'Extended Release',
      competitor: 'Immediate Release',
      favorable: true
    },
    {
      parameter: 'Dosing Frequency',
      us: 'Once Daily',
      competitor: 'Twice Daily',
      favorable: true
    },
    {
      parameter: 'Weight Change',
      us: 'Neutral / -2.5kg',
      competitor: 'Neutral',
      favorable: false
    },
    {
      parameter: 'Hypoglycemia Risk',
      us: 'Low',
      competitor: 'Low',
      favorable: false
    },
    {
      parameter: 'Cardiovascular Benefit',
      us: 'Established',
      competitor: 'Limited Data',
      favorable: true
    },
  ];

  return (
    <div className="rounded-2xl bg-[#1E1E1E]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)] overflow-hidden">
      {/* Header with Gradient Stroke */}
      <div className="h-1.5 bg-gradient-to-r from-[#4F46E5] via-[#FFC107] to-transparent" />
      
      <div className="p-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Competitive Analysis</h1>
          <p className="text-white/60 text-sm font-medium tracking-wide">METFORMIN XR vs. GLICLAZIDE MR</p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-xl border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-white/5">
            <div className="p-4 border-r border-white/10">
              <p className="text-xs font-bold text-white/60 tracking-wider uppercase">Parameter</p>
            </div>
            <div className="p-4 border-r border-white/10 text-center">
              <p className="text-xs font-bold text-[#FF9933] tracking-wider uppercase">Metformin XR</p>
              <p className="text-[10px] text-white/40 mt-1 font-mono">(Our Product)</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-xs font-bold text-white/60 tracking-wider uppercase">Gliclazide MR</p>
              <p className="text-[10px] text-white/40 mt-1 font-mono">(Competitor)</p>
            </div>
          </div>

          {/* Table Rows */}
          {comparisonData.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-3 ${idx !== comparisonData.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <div className="p-4 border-r border-white/10">
                <p className="text-sm text-white/90 font-medium">{row.parameter}</p>
              </div>
              <div className="p-4 border-r border-white/10 text-center">
                <p className={`text-sm ${row.favorable ? 'font-bold text-white' : 'text-white/80'}`}>
                  {row.us}
                </p>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm text-white/70">{row.competitor}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Study Reference */}
        <div className="mt-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3">
          <ArrowRight className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-white/90 leading-relaxed">
              Data derived from meta-analysis of 48 RCTs comparing metformin vs. sulfonylureas in T2DM management. 
              <span className="text-white/60"> (Madiraju et al., Nature 2022; Indian J Endocr Metab 2024)</span>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 font-mono">
            Comparison for educational purposes only. Individual patient response may vary.
          </p>
        </div>
      </div>
    </div>
  );
}
