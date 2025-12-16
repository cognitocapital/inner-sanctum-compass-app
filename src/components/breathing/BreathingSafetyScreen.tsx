import React from 'react';
import SafetyPreScreen from '@/components/clinical/SafetyPreScreen';

interface BreathingSafetyScreenProps {
  onProceed: () => void;
  onSkip?: () => void;
}

// CO2 tolerance and retention breathing contraindications per INCOG 2.0 / Canadian TBI Guidelines
const breathingContraindications = [
  {
    id: 'recent_head_injury',
    question: 'Have you had a head injury or concussion in the last 72 hours?',
    severity: 'stop' as const,
    advice: 'Breath holding can increase intracranial pressure. Please consult your healthcare provider before attempting retention breathing exercises.',
  },
  {
    id: 'cardiac_condition',
    question: 'Do you have any heart conditions or chest pain?',
    severity: 'stop' as const,
    advice: 'Extended breath holds can affect heart rate and blood pressure. Medical clearance is recommended before proceeding.',
  },
  {
    id: 'respiratory_condition',
    question: 'Do you have asthma, COPD, or other respiratory conditions?',
    severity: 'caution' as const,
    advice: 'Start with shorter holds and stop immediately if you feel dizzy or short of breath. Consider basic breathing patterns without retention.',
  },
  {
    id: 'seizure_history',
    question: 'Have you had seizures or epilepsy?',
    severity: 'stop' as const,
    advice: 'Breath retention can potentially trigger seizures in susceptible individuals. Please consult your neurologist before proceeding.',
  },
  {
    id: 'current_dizziness',
    question: 'Are you currently experiencing dizziness or vertigo?',
    severity: 'caution' as const,
    advice: 'Breathing exercises can temporarily affect balance. Use a seated position and have support nearby. Stop if symptoms worsen.',
  },
  {
    id: 'severe_fatigue',
    question: 'Are you experiencing severe fatigue or feeling unwell today?',
    severity: 'caution' as const,
    advice: 'Consider starting with gentler patterns (Calm or Balance) rather than intensive retention breathing. Listen to your body.',
  },
  {
    id: 'pregnant',
    question: 'Are you pregnant?',
    severity: 'caution' as const,
    advice: 'Some breathing techniques are safe during pregnancy, but avoid extended breath holds. Consult your healthcare provider.',
  },
  {
    id: 'medication_effects',
    question: 'Are you taking medications that affect blood pressure or heart rate?',
    severity: 'info' as const,
    advice: 'Breathing exercises can temporarily affect cardiovascular metrics. This is generally safe but monitor how you feel.',
  },
];

const BreathingSafetyScreen: React.FC<BreathingSafetyScreenProps> = ({ onProceed, onSkip }) => {
  return (
    <SafetyPreScreen
      title="Breath Safety Check"
      description="Quick safety screening to ensure the best breathing experience for your recovery journey."
      contraindications={breathingContraindications}
      onProceed={onProceed}
      onSkip={onSkip}
      accentColor="orange"
    />
  );
};

export default BreathingSafetyScreen;
