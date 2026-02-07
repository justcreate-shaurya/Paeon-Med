import { Pill, Shield, Activity } from 'lucide-react';

export function IdentityCard() {
  return (
    <div className="rounded-2xl bg-[#1E1E1E]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_-10px_rgba(255,153,51,0.3)] overflow-hidden">
      {/* Header with Gradient Stroke */}
      <div className="h-1.5 bg-gradient-to-r from-[#FF9933] via-[#FFC107] to-transparent" />
      
      <div className="p-8">
        {/* Product Identity */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Pill className="w-6 h-6 text-[#FF9933]" />
                <h1 className="text-3xl font-bold text-white tracking-tight">Metformin HCl</h1>
              </div>
              <p className="text-white/60 text-sm font-medium tracking-wide">EXTENDED RELEASE FORMULATION</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-emerald-400 text-xs font-bold tracking-wider">CDSCO APPROVED</span>
            </div>
          </div>
        </div>

        {/* Approved Indication */}
        <div className="mb-6 p-5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Approved Indication</h3>
          </div>
          <p className="text-white/90 leading-relaxed">
            Management of Type 2 Diabetes Mellitus as an adjunct to diet and exercise to improve glycemic control in adults. May be used as monotherapy or in combination with other antidiabetic agents including insulin.
          </p>
        </div>

        {/* Dosage Information */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl bg-[#0F172A]/60 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white/80 tracking-wider uppercase">Starting Dose</h4>
            </div>
            <p className="text-2xl font-bold text-white mb-1">500 mg</p>
            <p className="text-xs text-white/50 font-mono">Once daily with evening meal</p>
          </div>

          <div className="p-5 rounded-xl bg-[#0F172A]/60 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-bold text-white/80 tracking-wider uppercase">Maximum Dose</h4>
            </div>
            <p className="text-2xl font-bold text-white mb-1">2000 mg</p>
            <p className="text-xs text-white/50 font-mono">Daily (in divided doses)</p>
          </div>
        </div>

        {/* Key Clinical Data */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-3xl font-bold text-[#FF9933] mb-1">1.5%</p>
            <p className="text-xs text-white/60 tracking-wide">HbA1c Reduction</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-3xl font-bold text-[#FFC107] mb-1">850+</p>
            <p className="text-xs text-white/60 tracking-wide">Clinical Studies</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-3xl font-bold text-[#4F46E5] mb-1">60yr</p>
            <p className="text-xs text-white/60 tracking-wide">Market Presence</p>
          </div>
        </div>

        {/* Manufacturer Code */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 font-mono">
            MFG: Sun Pharma Industries Ltd. | Batch: MET-2026-Q1 | DCGI Ref: ND/DRS/2024/0847
          </p>
        </div>
      </div>
    </div>
  );
}
