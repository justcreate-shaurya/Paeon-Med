import { AnimatePresence, motion } from 'motion/react';
import type { ModeType } from '../../App';
import { IdentityCard } from './cards/IdentityCard';
import { ComparisonCard } from './cards/ComparisonCard';
import { AccessCard } from './cards/AccessCard';
import { ComplianceCard } from './cards/ComplianceCard';

interface StageProps {
  activeMode: ModeType;
}

export function Stage({ activeMode }: StageProps) {
  const renderCard = () => {
    switch (activeMode) {
      case 'IDENTITY':
        return <IdentityCard key="identity" />;
      case 'COMPARISON':
        return <ComparisonCard key="comparison" />;
      case 'ACCESS':
        return <AccessCard key="access" />;
      case 'COMPLIANCE':
        return <ComplianceCard key="compliance" />;
    }
  };

  return (
    <div className="w-full max-w-4xl h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="w-full"
        >
          {renderCard()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
