import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  /** The explanation text shown in the tooltip. */
  content: string;
  /** Optional accessible label for the trigger button. Defaults to "More information". */
  label?: string;
}

/**
 * A small ⓘ button that shows a descriptive tooltip when focused or hovered.
 * Keyboard-accessible and screen-reader friendly.
 */
export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  label = 'More information',
}) => {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close tooltip on outside click
  useEffect(() => {
    if (!visible) return;
    const handleClick = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [visible]);

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-expanded={visible}
        aria-haspopup="true"
        onClick={() => setVisible((v) => !v)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="ml-1 rounded-full text-(--muted) hover:text-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent) transition"
      >
        <Info className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="absolute left-5 top-0 z-50 w-64 rounded-lg border border-(--border-hi) bg-(--surface) p-3 text-xs text-(--text) shadow-lg"
        >
          {content}
        </div>
      )}
    </span>
  );
};
