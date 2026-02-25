import React, { ReactNode } from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  /** Optional short description under the title */
  subtitle?: string;
  /** Numeric delta (e.g. +5.4) */
  change?: number;
  /** positive = green, negative = red, neutral = gray */
  changeType?: 'positive' | 'negative' | 'neutral';
  /** Optional label under the change, e.g. "vs event avg" */
  changeLabel?: string;
  /** Optional icon to show on the right */
  icon?: ReactNode;
  /** If true, renders a smaller, denser card */
  compact?: boolean;
  /** If true, shows a loading skeleton instead of the value */
  isLoading?: boolean;
  /** Optional tooltip / help text for the metric */
  tooltip?: string;
  /** Optional unit to append to value, e.g. "%" */
  unit?: string;
  /** Optional function to format the main value */
  formatValue?: (value: string | number) => string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  changeLabel,
  icon,
  compact = false,
  isLoading = false,
  tooltip,
  unit,
  formatValue,
}) => {
  const hasChange = change !== undefined && change !== null;

  const basePadding = compact ? 'p-3' : 'p-4';
  const titleTextSize = compact ? 'text-xs' : 'text-sm';
  const valueTextSize = compact ? 'text-lg' : 'text-2xl';

  const formattedValue = isLoading
    ? ''
    : formatValue
    ? formatValue(value)
    : typeof value === 'number'
    ? value.toString()
    : value;

  const ChangeIcon =
    changeType === 'positive' ? ArrowUp : changeType === 'negative' ? ArrowDown : null;

  const changeColorClass =
    changeType === 'positive'
      ? 'text-emerald-600'
      : changeType === 'negative'
      ? 'text-red-600'
      : 'text-neutral-500';

  return (
    <section
      className={`bg-white rounded-lg border border-neutral-100 shadow-sm ${basePadding} transform transition-transform hover:-translate-y-[1px] hover:shadow-md`}
      aria-label={title}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1.5">
            <p className={`${titleTextSize} text-neutral-500 font-medium truncate`}>{title}</p>
            {tooltip && (
              <span className="group relative inline-flex">
                <Info
                  size={14}
                  className="mt-[2px] text-neutral-400 group-hover:text-neutral-600 cursor-help"
                  aria-label={tooltip}
                />
                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 w-40 -translate-x-1/2 rounded-md bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {tooltip}
                </span>
              </span>
            )}
          </div>

          {subtitle && (
            <p className="mt-0.5 text-xs text-neutral-400 truncate">{subtitle}</p>
          )}

          <div className="mt-2 flex items-baseline gap-1.5">
            {isLoading ? (
              <div className="h-7 w-20 rounded bg-neutral-100 animate-pulse" />
            ) : (
              <>
                <h3 className={`${valueTextSize} font-bold text-neutral-900`}>{formattedValue}</h3>
                {unit && !isLoading && (
                  <span className="text-xs text-neutral-400 font-medium">{unit}</span>
                )}
              </>
            )}
          </div>

          {hasChange && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs">
              {ChangeIcon && !isLoading && (
                <ChangeIcon size={14} className={changeColorClass} />
              )}
              {!isLoading && (
                <span className={`font-medium ${changeColorClass}`}>
                  {change! > 0 ? '+' : ''}
                  {change}
                  {unit && typeof change === 'number' ? unit : ''}
                </span>
              )}
              {changeLabel && !isLoading && (
                <span className="text-[11px] text-neutral-400">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={`shrink-0 flex items-center justify-center rounded-full bg-neutral-50 text-neutral-500 ${
              compact ? 'p-1.5' : 'p-2'
            }`}
          >
            {icon}
          </div>
        )}
      </div>
    </section>
  );
};

export default MetricCard;