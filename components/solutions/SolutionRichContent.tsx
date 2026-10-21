'use client';

import React, { useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  CheckCircle2, 
  Table as TableIcon, 
  Sparkles, 
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { DocumentChart, DocumentTable, DataChapterMetric } from '@/types/solutions';

interface ParsedTable {
  type: 'table';
  headers: string[];
  alignments: ('left' | 'center' | 'right')[];
  rows: string[][];
  raw: string;
}

interface ParsedChart {
  type: 'chart';
  chartType: 'bar' | 'horizontal-bar' | 'line' | 'donut' | 'progress';
  title: string;
  unit?: string;
  items: { label: string; value: number; color?: string; subtext?: string }[];
  raw: string;
}

interface ParsedKPIs {
  type: 'kpi';
  metrics: { value: string; label: string; subtext?: string; trend?: 'up' | 'down' | 'neutral'; color?: string }[];
  raw: string;
}

interface ParsedText {
  type: 'text';
  content: string;
}

type ParsedBlock = ParsedTable | ParsedChart | ParsedKPIs | ParsedText;

const CHART_COLORS = [
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#a855f7', // purple-500
  '#f59e0b', // amber-500
  '#f43f5e', // rose-500
  '#3b82f6', // blue-500
  '#14b8a6', // teal-500
  '#ec4899', // pink-500
];

/**
 * Universal Parser that extracts Markdown Tables, Chart code blocks, and KPI blocks from text
 */
export function parseRichDocumentText(text: string): ParsedBlock[] {
  if (!text) return [];

  const lines = text.split('\n');
  const blocks: ParsedBlock[] = [];
  let currentTextBuffer: string[] = [];

  const flushTextBuffer = () => {
    if (currentTextBuffer.length > 0) {
      const joined = currentTextBuffer.join('\n').trim();
      if (joined.length > 0) {
        blocks.push({ type: 'text', content: joined });
      }
      currentTextBuffer = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Detect Chart Code Block (```chart:type ... ```)
    if (trimmed.startsWith('```chart')) {
      flushTextBuffer();
      const chartTypeMatch = trimmed.match(/```chart(?::(\w+))?/i);
      const chartType = (chartTypeMatch && chartTypeMatch[1]?.toLowerCase()) as any || 'bar';
      
      const chartLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        chartLines.push(lines[i]);
        i++;
      }
      // skip closing ```
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++;
      }

      let title = 'Analytical Metric Distribution';
      let unit = '';
      const items: { label: string; value: number; color?: string; subtext?: string }[] = [];

      chartLines.forEach((cLine, idx) => {
        const cleanCLine = cLine.trim();
        if (!cleanCLine) return;

        if (cleanCLine.toLowerCase().startsWith('title:')) {
          title = cleanCLine.replace(/^title:\s*/i, '').trim();
          return;
        }
        if (cleanCLine.toLowerCase().startsWith('unit:')) {
          unit = cleanCLine.replace(/^unit:\s*/i, '').trim();
          return;
        }

        // Label: Value format or Label | Value
        const separator = cleanCLine.includes(':') ? ':' : cleanCLine.includes('|') ? '|' : ',';
        const parts = cleanCLine.split(separator);
        if (parts.length >= 2) {
          const label = parts[0].trim();
          const rawVal = parts[1].trim().replace(/[^\d.-]/g, '');
          const numVal = parseFloat(rawVal);
          if (!isNaN(numVal)) {
            const subtext = parts[2]?.trim();
            items.push({
              label,
              value: numVal,
              color: CHART_COLORS[idx % CHART_COLORS.length],
              subtext
            });
          }
        }
      });

      if (items.length > 0) {
        blocks.push({
          type: 'chart',
          chartType: ['bar', 'horizontal-bar', 'line', 'donut', 'progress'].includes(chartType) ? chartType : 'bar',
          title,
          unit,
          items,
          raw: chartLines.join('\n')
        });
      }
      continue;
    }

    // 2. Detect KPI Metric Cards (```kpi ... ``` or [KPI: ...])
    if (trimmed.startsWith('```kpi')) {
      flushTextBuffer();
      const kpiLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        kpiLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++;
      }

      const metrics: { value: string; label: string; subtext?: string; trend?: 'up' | 'down' | 'neutral'; color?: string }[] = [];
      kpiLines.forEach((kLine) => {
        const clean = kLine.replace(/^metric:\s*/i, '').trim();
        if (!clean) return;
        const parts = clean.split('|').map(p => p.trim());
        if (parts.length >= 2) {
          metrics.push({
            value: parts[0],
            label: parts[1],
            subtext: parts[2] || undefined,
            trend: (parts[3]?.toLowerCase() as any) || 'neutral',
            color: parts[4] || undefined
          });
        }
      });

      if (metrics.length > 0) {
        blocks.push({
          type: 'kpi',
          metrics,
          raw: kpiLines.join('\n')
        });
      }
      continue;
    }

    // 3. Detect Markdown Table (| Header 1 | Header 2 | ...)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.split('|').length >= 3) {
      // Check if next line is table separator (|---|---|)
      const nextLine = lines[i + 1]?.trim() || '';
      if (nextLine.startsWith('|') && nextLine.includes('---')) {
        flushTextBuffer();
        
        const headerCells = trimmed.split('|').slice(1, -1).map(c => c.trim());
        const separatorCells = nextLine.split('|').slice(1, -1).map(c => c.trim());
        
        const alignments = separatorCells.map(s => {
          if (s.startsWith(':') && s.endsWith(':')) return 'center' as const;
          if (s.endsWith(':')) return 'right' as const;
          return 'left' as const;
        });

        i += 2; // skip header and separator
        const rows: string[][] = [];

        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          const rowCells = lines[i].trim().split('|').slice(1, -1).map(c => c.trim());
          rows.push(rowCells);
          i++;
        }

        blocks.push({
          type: 'table',
          headers: headerCells,
          alignments,
          rows,
          raw: [trimmed, nextLine, ...rows.map(r => `| ${r.join(' | ')} |`)].join('\n')
        });
        continue;
      }
    }

    currentTextBuffer.push(line);
    i++;
  }

  flushTextBuffer();
  return blocks;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT 1: High-Performance Data Table
// ─────────────────────────────────────────────────────────────────────────────
export function RenderedDataTable({ table }: { table: ParsedTable }) {
  return (
    <div className="my-5 rounded-2xl border border-white/10 bg-[#07090e]/80 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="px-4 py-2.5 bg-white/[0.03] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
            Tabular Statutory Schedule &amp; Numerical Register
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-400">
          {table.rows.length} Records • {table.headers.length} Columns
        </span>
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-left text-xs font-sans border-collapse">
          <thead>
            <tr className="border-b border-white/15 bg-white/[0.04]">
              {table.headers.map((h, hIdx) => {
                const align = table.alignments[hIdx] || 'left';
                return (
                  <th
                    key={`th-${hIdx}`}
                    className={`px-4 py-3 text-[11px] font-mono font-bold uppercase tracking-wider text-white whitespace-nowrap ${
                      align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {table.rows.map((row, rIdx) => (
              <tr 
                key={`tr-${rIdx}`} 
                className="hover:bg-cyan-500/[0.04] transition-colors odd:bg-transparent even:bg-white/[0.015]"
              >
                {row.map((cell, cIdx) => {
                  const align = table.alignments[cIdx] || 'left';
                  const isNumber = /^[\$₹€£]?\s*[\d,.-]+%?$/.test(cell.trim());
                  const isBadge = ['MANDATORY', 'TIER 1', 'TIER 2', 'TIER 3', 'HIGH', 'CRITICAL', 'COMPLIANT', 'PASSED'].includes(cell.toUpperCase());

                  return (
                    <td
                      key={`td-${rIdx}-${cIdx}`}
                      className={`px-4 py-2.5 text-neutral-200 text-xs sm:text-[13px] ${
                        align === 'center' ? 'text-center' : align === 'right' || isNumber ? 'text-right font-mono text-cyan-200 font-semibold' : 'text-left font-sans'
                      }`}
                    >
                      {isBadge ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT 2: High-Performance Visual Chart & Graph Engine (SVG)
// ─────────────────────────────────────────────────────────────────────────────
export function RenderedChart({ chart }: { chart: ParsedChart }) {
  const { chartType, title, unit, items } = chart;
  const maxValue = useMemo(() => Math.max(...items.map(i => i.value), 1), [items]);
  const totalValue = useMemo(() => items.reduce((sum, i) => sum + i.value, 0), [items]);

  return (
    <div className="my-5 p-5 rounded-2xl border border-white/10 bg-[#07090e]/90 shadow-[0_12px_40px_rgba(0,0,0,0.6)] space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            {chartType === 'donut' ? <PieChartIcon className="w-4 h-4" /> : chartType === 'line' ? <TrendingUp className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-display font-bold text-sm sm:text-base text-white tracking-wide">
              {title}
            </h4>
            <p className="text-[10px] font-mono text-neutral-400">
              Interactive Data Graph {unit ? `• Measured in [${unit}]` : ''}
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px] font-bold uppercase">
          {chartType.replace('-', ' ')}
        </span>
      </div>

      {/* Chart Renderings */}
      {/* 1. Bar Chart (Vertical) */}
      {chartType === 'bar' && (
        <div className="pt-4">
          <div className="h-48 sm:h-56 flex items-end justify-around gap-2 sm:gap-4 px-2 border-b border-white/15 pb-2">
            {items.map((item, idx) => {
              const heightPct = Math.max((item.value / maxValue) * 100, 6);
              const color = item.color || CHART_COLORS[idx % CHART_COLORS.length];

              return (
                <div key={`bar-${idx}`} className="flex-1 flex flex-col items-center h-full justify-end group min-w-[32px] max-w-[80px]">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 px-1.5 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] font-mono font-bold text-cyan-300 whitespace-nowrap shadow-lg">
                    {item.value}{unit ? ` ${unit}` : ''}
                  </div>

                  {/* The Animated Bar */}
                  <div 
                    className="w-full rounded-t-lg transition-all duration-500 group-hover:brightness-125 relative overflow-hidden"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 15px ${color}40`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/20" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Labels Below */}
          <div className="flex justify-around gap-2 sm:gap-4 px-2 pt-2">
            {items.map((item, idx) => (
              <div key={`lbl-${idx}`} className="flex-1 text-center min-w-[32px] max-w-[80px]">
                <p className="text-[10px] sm:text-[11px] font-mono text-neutral-300 truncate" title={item.label}>
                  {item.label}
                </p>
                <p className="text-[10px] font-mono font-bold text-cyan-400">
                  {item.value}{unit ? unit : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Horizontal Bar Chart */}
      {chartType === 'horizontal-bar' && (
        <div className="space-y-3 pt-2">
          {items.map((item, idx) => {
            const widthPct = Math.max((item.value / maxValue) * 100, 4);
            const color = item.color || CHART_COLORS[idx % CHART_COLORS.length];

            return (
              <div key={`hbar-${idx}`} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-300 font-medium">{item.label}</span>
                  <span className="font-bold text-white">
                    {item.value} {unit ? unit : ''}
                  </span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}50`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Line Chart (SVG with Smooth Spline and Area Gradient) */}
      {chartType === 'line' && (
        <div className="pt-2">
          <div className="h-48 sm:h-56 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id={`grad-line-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />

              {/* Compute Coordinates */}
              {(() => {
                const count = items.length;
                if (count === 0) return null;
                const points = items.map((item, idx) => {
                  const x = (idx / Math.max(count - 1, 1)) * 480 + 10;
                  const y = 180 - (item.value / maxValue) * 140;
                  return { x, y, ...item };
                });

                const pathD = points.reduce((acc, p, idx) => {
                  return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
                }, '');

                const areaD = `${pathD} L ${points[points.length - 1].x} 190 L ${points[0].x} 190 Z`;

                return (
                  <>
                    <path d={areaD} fill={`url(#grad-line-${title.replace(/\s+/g, '')})`} />
                    <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
                    {points.map((p, idx) => (
                      <g key={`pt-${idx}`} className="group cursor-pointer">
                        <circle cx={p.x} cy={p.y} r="5" fill="#0891b2" stroke="#ffffff" strokeWidth="2" className="group-hover:scale-125 transition-transform" />
                        <text x={p.x} y={p.y - 10} fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle" className="font-bold">
                          {p.value}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Labels Below */}
          <div className="flex justify-between items-center px-2 pt-3 border-t border-white/10 text-[10px] sm:text-[11px] font-mono text-neutral-400">
            {items.map((item, idx) => (
              <span key={`line-lbl-${idx}`}>{item.label}</span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Donut / Distribution Chart */}
      {chartType === 'donut' && (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
          <div className="relative w-40 h-40 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {(() => {
                let accumulatedPercent = 0;
                return items.map((item, idx) => {
                  const percent = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                  const strokeDasharray = `${percent} ${100 - percent}`;
                  const strokeDashoffset = -accumulatedPercent;
                  accumulatedPercent += percent;
                  const color = item.color || CHART_COLORS[idx % CHART_COLORS.length];

                  return (
                    <circle
                      key={`donut-seg-${idx}`}
                      cx="50"
                      cy="50"
                      r="15.91549430918954" // circumference = 100
                      fill="transparent"
                      stroke={color}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="hover:opacity-85 transition-opacity"
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Total</span>
              <span className="font-display font-bold text-base text-white">{totalValue}</span>
              {unit && <span className="text-[9px] font-mono text-cyan-400">{unit}</span>}
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex-1 space-y-2 w-full max-w-sm">
            {items.map((item, idx) => {
              const pct = totalValue > 0 ? Math.round((item.value / totalValue) * 100) : 0;
              const color = item.color || CHART_COLORS[idx % CHART_COLORS.length];

              return (
                <div key={`donut-leg-${idx}`} className="flex items-center justify-between text-xs font-mono p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-neutral-200">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <span className="text-white">{item.value}{unit ? ` ${unit}` : ''}</span>
                    <span className="text-cyan-400 text-[10px]">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Progress Milestones */}
      {chartType === 'progress' && (
        <div className="space-y-4 pt-2">
          {items.map((item, idx) => {
            const pct = Math.min(Math.round(item.value), 100);
            return (
              <div key={`prog-${idx}`} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-white font-medium flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${pct >= 100 ? 'text-emerald-400' : 'text-cyan-400'}`} />
                    {item.label}
                  </span>
                  <span className="font-bold text-cyan-300">{pct}%</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {item.subtext && <p className="text-[10px] text-neutral-400 font-mono">{item.subtext}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT 3: KPI Metrics Highlight Tiles
// ─────────────────────────────────────────────────────────────────────────────
export function RenderedKPIs({ block }: { block: ParsedKPIs }) {
  return (
    <div className="my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {block.metrics.map((m, idx) => {
        const colorClass = m.color === 'emerald'
          ? 'from-emerald-950/40 border-emerald-500/40 text-emerald-300'
          : m.color === 'purple'
          ? 'from-purple-950/40 border-purple-500/40 text-purple-300'
          : m.color === 'amber'
          ? 'from-amber-950/40 border-amber-500/40 text-amber-300'
          : m.color === 'rose'
          ? 'from-rose-950/40 border-rose-500/40 text-rose-300'
          : 'from-cyan-950/40 border-cyan-500/40 text-cyan-300';

        return (
          <div
            key={`kpi-${idx}`}
            className={`p-4 rounded-2xl bg-gradient-to-br to-black/80 border ${colorClass} shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform`}
          >
            <div className="flex items-center justify-between pb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 truncate">
                {m.label}
              </span>
              {m.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              {m.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
              {m.trend === 'neutral' && <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
            </div>

            <div className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-1">
              {m.value}
            </div>

            {m.subtext && (
              <p className="text-[11px] text-neutral-400 font-sans leading-snug mt-1 border-t border-white/5 pt-1 line-clamp-2">
                {m.subtext}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: SolutionRichContent
// ─────────────────────────────────────────────────────────────────────────────
interface SolutionRichContentProps {
  content: string;
  className?: string;
}

export function SolutionRichContent({ content, className = '' }: SolutionRichContentProps) {
  const blocks = useMemo(() => parseRichDocumentText(content), [content]);

  if (!blocks || blocks.length === 0) {
    return <span className={className}>{content}</span>;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'table') {
          return <RenderedDataTable key={`block-tbl-${bIdx}`} table={block} />;
        }
        if (block.type === 'chart') {
          return <RenderedChart key={`block-chart-${bIdx}`} chart={block} />;
        }
        if (block.type === 'kpi') {
          return <RenderedKPIs key={`block-kpi-${bIdx}`} block={block} />;
        }
        // Text block: format line breaks & bold formatting
        return (
          <div key={`block-txt-${bIdx}`} className="text-neutral-200 font-serif leading-relaxed text-sm sm:text-[15px] space-y-2">
            {block.content.split('\n\n').map((paragraph, pIdx) => {
              // Parse simple **bold**
              const parts = paragraph.split(/(\*\*.*?\*\*)/g);
              return (
                <p key={`p-${bIdx}-${pIdx}`} className="leading-relaxed">
                  {parts.map((part, partIdx) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={partIdx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
