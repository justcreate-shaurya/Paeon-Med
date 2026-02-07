import { IndianRupee, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export function AccessCard() {
  return (
    <div className="rounded-2xl bg-[#1E1E1E]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] overflow-hidden">
      {/* Header with Gradient Stroke */}
      <div className="h-1.5 bg-gradient-to-r from-[#10B981] via-[#FFC107] to-transparent" />
      
      <div className="p-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Access & Reimbursement</h1>
          <p className="text-white/60 text-sm font-medium tracking-wide">PRICING & INSURANCE COVERAGE STATUS</p>
        </div>

        {/* Pricing Dashboard */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
              <h3 className="text-xs font-bold text-emerald-400 tracking-wider uppercase">NPPA Ceiling Price</h3>
            </div>
            <p className="text-4xl font-bold text-white mb-1">₹14.50</p>
            <p className="text-xs text-white/50 font-mono">Per 500mg Tablet (Strip of 10)</p>
          </div>

          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs font-bold text-amber-400 tracking-wider uppercase">MRP (Retail)</h3>
            </div>
            <p className="text-4xl font-bold text-white mb-1">₹135.00</p>
            <p className="text-xs text-white/50 font-mono">Strip of 10 Tablets (500mg ER)</p>
          </div>
        </div>

        {/* Insurance Coverage Matrix */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase mb-4">Insurance Coverage Matrix</h3>
          
          {/* Ayushman Bharat */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white">Ayushman Bharat - PMJAY</h4>
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-400 tracking-wider">APPROVED</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Fully covered under essential medicines list. No patient co-payment required for below poverty line beneficiaries.
              </p>
              <p className="text-xs text-emerald-400 font-mono mt-2">Coverage Code: PMJAY-DM-001</p>
            </div>
          </div>

          {/* CGHS */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white">CGHS / ECHS</h4>
                <span className="px-2 py-1 rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-400 tracking-wider">LISTED</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Available at all CGHS-empanelled pharmacies. Government employees can claim 100% reimbursement.
              </p>
            </div>
          </div>

          {/* Private Insurance */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white">Private Health Insurance</h4>
                <span className="px-2 py-1 rounded bg-amber-500/20 text-[10px] font-bold text-amber-400 tracking-wider">WAITING PERIOD</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Covered by major insurers (Star Health, ICICI Lombard, HDFC Ergo) after 30-day waiting period for pre-existing diabetes.
              </p>
            </div>
          </div>

          {/* ESI */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white">ESI Scheme</h4>
                <span className="px-2 py-1 rounded bg-rose-500/20 text-[10px] font-bold text-rose-400 tracking-wider">GENERIC ONLY</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                Only generic metformin covered. Brand coverage requires prior authorization from ESI dispensary.
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Footer */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 font-mono">
            Last Updated: Feb 2026 | NPPA Order No: S.O. 2847(E) | DPCO 2013 Schedule-I
          </p>
        </div>
      </div>
    </div>
  );
}
