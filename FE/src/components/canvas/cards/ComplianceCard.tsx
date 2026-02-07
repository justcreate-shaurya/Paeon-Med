import { Scale, CheckCircle2, XCircle, AlertTriangle, BookOpen } from 'lucide-react';

export function ComplianceCard() {
  return (
    <div className="rounded-2xl bg-[#1E1E1E]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)] overflow-hidden">
      {/* Header with Gradient Stroke */}
      <div className="h-1.5 bg-gradient-to-r from-[#4F46E5] via-[#10B981] to-transparent" />
      
      <div className="p-8">
        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="w-7 h-7 text-[#4F46E5]" />
            <h1 className="text-3xl font-bold text-white tracking-tight">Legal Compliance Shield</h1>
          </div>
          <p className="text-white/60 text-sm font-medium tracking-wide">UCPMP CODE OF ETHICS & REGULATORY GUIDELINES</p>
        </div>

        {/* UCPMP Guidelines */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Uniform Code for Pharmaceutical Marketing Practices
          </h3>

          {/* Permitted Activities */}
          <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-emerald-400 mb-2 tracking-wide">PERMITTED</h4>
                <ul className="space-y-2 text-xs text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><strong className="text-white">Educational Grants:</strong> Support for genuine CME programs with prior approval from medical institutions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><strong className="text-white">Product Samples:</strong> Maximum 10 strips/vials per doctor per year for genuine evaluation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><strong className="text-white">Scientific Literature:</strong> Distribution of peer-reviewed clinical studies and product monographs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span><strong className="text-white">Reminder Items:</strong> Items ≤₹1000 value (calendars, pads) with company branding only</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Restricted Activities */}
          <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-amber-400 mb-2 tracking-wide">RESTRICTED - APPROVAL REQUIRED</h4>
                <ul className="space-y-2 text-xs text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong className="text-white">Conference Sponsorship:</strong> Travel/accommodation support only for genuine scientific presentations (requires Ethics Committee clearance)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span><strong className="text-white">Hospitality:</strong> Meals during CME events capped at ₹2000 per person (vegetarian preferred)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="p-5 rounded-xl bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-rose-400 mb-2 tracking-wide">STRICTLY PROHIBITED</h4>
                <ul className="space-y-2 text-xs text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong className="text-white">Cash or Cash Equivalents:</strong> Direct monetary payments, gift cards, vouchers to healthcare professionals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong className="text-white">Personal Gifts:</strong> Electronics, jewelry, luxury items irrespective of value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong className="text-white">Entertainment:</strong> Leisure trips, sporting events, family vacation packages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span><strong className="text-white">Off-Label Promotion:</strong> Marketing unapproved indications or dosage regimens</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Penalties Warning */}
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-400 mb-1">Non-Compliance Penalties</p>
              <p className="text-xs text-white/70 leading-relaxed">
                Violations may result in suspension of marketing approval, monetary penalties up to ₹50 lakhs, and imprisonment up to 5 years under Drugs and Cosmetics Act 1940 (Section 27).
              </p>
            </div>
          </div>
        </div>

        {/* Regulatory Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 font-mono">
            DoP UCPMP 2024 | MCI Professional Code 2002 | IMA Code 2002 | Last Reviewed: Jan 2026
          </p>
        </div>
      </div>
    </div>
  );
}
