import { AlertCircle, TrendingUp, FileText, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

export function LiveTicker() {
  const alerts = [
    {
      type: 'regulatory',
      icon: AlertCircle,
      title: 'CDSCO Alert',
      timestamp: '12 min ago',
      content: 'New safety advisory issued for SGLT2 inhibitors - risk of euglycemic ketoacidosis',
      priority: 'high'
    },
    {
      type: 'market',
      icon: TrendingUp,
      title: 'Stock Movement',
      timestamp: '28 min ago',
      content: 'Sun Pharma shares up 3.2% following Q4 earnings beat on US generic sales',
      priority: 'low'
    },
    {
      type: 'competitor',
      icon: Building2,
      title: 'Competitor Activity',
      timestamp: '1 hr ago',
      content: 'Novo Nordisk launches Ozempic at ₹18,500/pen in India via Medtronic distribution',
      priority: 'medium'
    },
    {
      type: 'regulatory',
      icon: FileText,
      title: 'NPPA Update',
      timestamp: '2 hrs ago',
      content: 'Price revision for 42 essential diabetes drugs effective March 1, 2026',
      priority: 'medium'
    },
    {
      type: 'market',
      icon: TrendingUp,
      title: 'Ayushman Bharat',
      timestamp: '3 hrs ago',
      content: 'PMJAY expands coverage to 15 new diabetes medications - approval pending',
      priority: 'high'
    },
    {
      type: 'regulatory',
      icon: AlertCircle,
      title: 'Clinical Trial',
      timestamp: '4 hrs ago',
      content: 'DCGI approves Phase III trial for indigenous GLP-1 agonist by Biocon',
      priority: 'low'
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-rose-500/30 bg-rose-500/5';
      case 'medium':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'low':
        return 'border-indigo-500/30 bg-indigo-500/5';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  const getIconColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-rose-400';
      case 'medium':
        return 'text-amber-400';
      case 'low':
        return 'text-indigo-400';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-sm font-bold text-white tracking-wider uppercase mb-1">Intelligence Feed</h2>
        <p className="text-xs text-white/50">Live regulatory & market signals</p>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {alerts.map((alert, idx) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl border ${getPriorityColor(alert.priority)} hover:bg-white/10 transition-colors cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${getIconColor(alert.priority)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white tracking-wide">{alert.title}</h4>
                    <span className="text-[10px] text-white/40 font-mono whitespace-nowrap">{alert.timestamp}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">{alert.content}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-xs font-semibold text-white/80 tracking-wide">
          VIEW ALL ALERTS
        </button>
      </div>
    </div>
  );
}
