/**
 * Step description display component
 * Shows the current algorithm step description
 */

'use client';

interface StepDescriptionProps {
  description: string;
}

export default function StepDescription({ description }: StepDescriptionProps) {
  return (
    <div className="px-6 py-3" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
      <p className="text-xs font-mono" style={{ color: 'var(--foreground)' }}>
        <span className="opacity-60">// </span>{description}
      </p>
    </div>
  );
}
