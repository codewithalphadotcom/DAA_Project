/**
 * Panel header component for visualization sections
 */

'use client';

interface PanelHeaderProps {
  title: string;
  accentColor?: string;
}

export default function PanelHeader({ title, accentColor = 'var(--accent-primary)' }: PanelHeaderProps) {
  return (
    <div className="px-4 py-3 flex items-center space-x-2" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
      <div className="w-1 h-1" style={{ background: accentColor }}></div>
      <h3 className="text-xs font-mono font-bold">
        {title}
      </h3>
    </div>
  );
}
