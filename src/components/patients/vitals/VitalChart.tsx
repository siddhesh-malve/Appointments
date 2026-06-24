import { useState, useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { cn } from '@/lib/utils'
import type { VitalReading, VitalType } from '@/types/vital'

interface ChartPoint {
  date: string
  value: number
  label: string
  reading: VitalReading
}

interface VitalChartProps {
  readings: VitalReading[]
  type: VitalType
  unit: string
  thresholds?: {
    criticalHigh?: number
    high?: number
    low?: number
    criticalLow?: number
  }
}

// Smooth bezier path from array of [x,y] points
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return pts.map(([x, y]) => `${x},${y}`).join(' ')
  let d = `M ${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cpx = (prev[0] + curr[0]) / 2
    d += ` C ${cpx},${prev[1]} ${cpx},${curr[1]} ${curr[0]},${curr[1]}`
  }
  return d
}

const DEFAULT_THRESHOLDS: Record<VitalType, VitalChartProps['thresholds']> = {
  heart_rate:       { criticalHigh: 130, high: 100, low: 60, criticalLow: 40 },
  blood_oxygen:     { criticalHigh: 100, high: 100, low: 95, criticalLow: 90 },
  respiratory_rate: { criticalHigh: 30,  high: 20,  low: 12, criticalLow: 8  },
  blood_pressure:   { criticalHigh: 160, high: 140, low: 90, criticalLow: 60 },
  temperature:      { criticalHigh: 104, high: 100.4, low: 97, criticalLow: 95 },
  blood_sugar:      { criticalHigh: 300, high: 180,  low: 70, criticalLow: 54 },
}

export function VitalChart({ readings, type, unit, thresholds }: VitalChartProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; point: ChartPoint } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const thresh = thresholds ?? DEFAULT_THRESHOLDS[type] ?? {}

  // Convert readings to chart points (blood pressure uses systolic)
  const points: ChartPoint[] = readings
    .map((r) => {
      let val: number
      if (typeof r.value === 'object') {
        val = (r.value as { systolic: number; diastolic: number }).systolic
      } else {
        val = r.value as number
      }
      return {
        date: r.date,
        value: val,
        label: typeof r.value === 'object'
          ? `${(r.value as { systolic: number; diastolic: number }).systolic}/${(r.value as { systolic: number; diastolic: number }).diastolic}`
          : `${val}`,
        reading: r,
      }
    })
    .sort((a, b) => a.date.localeCompare(b.date))

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        No data to display
      </div>
    )
  }

  const W = 700
  const H = 220
  const PAD = { top: 20, right: 20, bottom: 40, left: 48 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const values = points.map((p) => p.value)
  const minVal = Math.min(...values, thresh.criticalLow ?? Infinity, thresh.low ?? Infinity)
  const maxVal = Math.max(...values, thresh.criticalHigh ?? -Infinity, thresh.high ?? -Infinity)
  const padding = (maxVal - minVal) * 0.15 || 5
  const yMin = minVal - padding
  const yMax = maxVal + padding

  function xPos(i: number) {
    return PAD.left + (i / Math.max(points.length - 1, 1)) * chartW
  }
  function yPos(val: number) {
    return PAD.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH
  }

  // Grid lines
  const yTicks = 5
  const yStep = (yMax - yMin) / yTicks
  const yGridLines = Array.from({ length: yTicks + 1 }, (_, i) => yMin + i * yStep)

  // SVG path
  const pathPts: [number, number][] = points.map((p, i) => [xPos(i), yPos(p.value)])
  const linePath = smoothPath(pathPts)

  // Zone fill path (area under line)
  const areaPath = `${linePath} L ${xPos(points.length - 1)},${PAD.top + chartH} L ${xPos(0)},${PAD.top + chartH} Z`

  // Threshold line y positions
  const threshLines = [
    thresh.criticalHigh != null && { y: yPos(thresh.criticalHigh), color: '#ef4444', label: 'Critical High', dash: '4 2' },
    thresh.high          != null && { y: yPos(thresh.high),         color: '#f97316', label: 'High',          dash: '4 2' },
    thresh.low           != null && { y: yPos(thresh.low),          color: '#3b82f6', label: 'Low',           dash: '4 2' },
    thresh.criticalLow   != null && { y: yPos(thresh.criticalLow),  color: '#6366f1', label: 'Critical Low',  dash: '4 2' },
  ].filter(Boolean) as { y: number; color: string; label: string; dash: string }[]

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = W / rect.width
    const relX = (e.clientX - rect.left) * scaleX - PAD.left
    const idx = Math.round((relX / chartW) * (points.length - 1))
    const clamped = Math.max(0, Math.min(points.length - 1, idx))
    const pt = points[clamped]
    setTooltip({ x: xPos(clamped), y: yPos(pt.value), point: pt })
  }

  const statusColors: Record<string, string> = {
    low: '#3b82f6', normal: '#16a34a', high: '#f97316', critical: '#ef4444',
  }

  return (
    <div className="relative w-full overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Threshold zones */}
        {thresh.high != null && thresh.criticalHigh != null && (
          <rect
            x={PAD.left} y={yPos(thresh.criticalHigh)}
            width={chartW} height={yPos(thresh.high) - yPos(thresh.criticalHigh)}
            fill="#ef444415"
          />
        )}
        {thresh.high != null && thresh.low != null && (
          <rect
            x={PAD.left} y={yPos(thresh.high)}
            width={chartW} height={yPos(thresh.low) - yPos(thresh.high)}
            fill="#16a34a10"
          />
        )}
        {thresh.low != null && thresh.criticalLow != null && (
          <rect
            x={PAD.left} y={yPos(thresh.low)}
            width={chartW} height={yPos(thresh.criticalLow) - yPos(thresh.low)}
            fill="#3b82f615"
          />
        )}

        {/* Grid lines */}
        {yGridLines.map((val, i) => (
          <g key={i}>
            <line
              x1={PAD.left} y1={yPos(val)} x2={PAD.left + chartW} y2={yPos(val)}
              stroke="#e5e7eb" strokeWidth="1"
            />
            <text
              x={PAD.left - 6} y={yPos(val) + 4}
              textAnchor="end" fontSize="10" fill="#9ca3af"
            >
              {Math.round(val)}
            </text>
          </g>
        ))}

        {/* Threshold lines */}
        {threshLines.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.left} y1={t.y} x2={PAD.left + chartW} y2={t.y}
              stroke={t.color} strokeWidth="1" strokeDasharray={t.dash} opacity="0.7"
            />
            <text x={PAD.left + chartW - 2} y={t.y - 3} textAnchor="end" fontSize="9" fill={t.color} opacity="0.8">
              {t.label}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="#13826615" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#138266" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* X-axis labels */}
        {points.map((p, i) => {
          const showEvery = Math.ceil(points.length / 7)
          if (i % showEvery !== 0 && i !== points.length - 1) return null
          return (
            <text key={i} x={xPos(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
              {format(parseISO(p.date), 'MMM d')}
            </text>
          )
        })}

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={xPos(i)} cy={yPos(p.value)} r="4"
            fill="white" stroke="#138266" strokeWidth="2"
          />
        ))}

        {/* Tooltip dot highlight */}
        {tooltip && (
          <circle
            cx={tooltip.x} cy={tooltip.y} r="6"
            fill="#138266" opacity="0.9"
          />
        )}

        {/* Tooltip box */}
        {tooltip && (() => {
          const r = tooltip.point.reading
          const tx = tooltip.x > W - 140 ? tooltip.x - 145 : tooltip.x + 12
          const ty = Math.max(PAD.top, Math.min(tooltip.y - 30, H - 80))
          const sc = statusColors[r.status] ?? '#6b7280'
          return (
            <g>
              <rect x={tx} y={ty} width={130} height={70} rx="6"
                fill="white" stroke="#e5e7eb" strokeWidth="1"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }}
              />
              <text x={tx + 10} y={ty + 16} fontSize="10" fill="#6b7280">
                {format(parseISO(tooltip.point.date), 'MMM d, yyyy')}
              </text>
              <text x={tx + 10} y={ty + 34} fontSize="14" fontWeight="600" fill="#111827">
                {tooltip.point.label} {unit}
              </text>
              <rect x={tx + 10} y={ty + 44} width={50} height={16} rx="8" fill={sc + '20'} />
              <text x={tx + 35} y={ty + 55} fontSize="10" fontWeight="500" fill={sc} textAnchor="middle">
                {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
              </text>
            </g>
          )
        })()}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 px-2">
        {[
          { color: '#ef4444', label: 'Critical' },
          { color: '#f97316', label: 'High' },
          { color: '#16a34a', label: 'Normal' },
          { color: '#3b82f6', label: 'Low' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: l.color + '40', border: `1.5px solid ${l.color}` }} />
            <span className="text-xs text-gray-500">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
