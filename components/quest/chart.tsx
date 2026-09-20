'use client'

import {useId, useState, type KeyboardEvent} from 'react'
import * as stylex from '@stylexjs/stylex'
import {Stack, type StackProps} from '@astryxdesign/core/Stack'
import {Text} from '@astryxdesign/core/Text'
import {dataStyles} from './data-extra.styles'
import './chart.css'

export type QuestChartDatum = {label: string; [key: string]: string | number | null | undefined}
export type QuestChartSeries = {key: string; label: string; color?: string}
export type QuestChartProps = Omit<StackProps, 'children'> & {
  data: readonly QuestChartDatum[]
  series: readonly QuestChartSeries[]
  label: string
  description?: string
  variant?: 'bar' | 'line' | 'area'
  formatValue?: (value: number) => string
}
type Point = {x: number; y: number; value: number; label: string; index: number}
const palette = ['var(--q-primary)', 'var(--q-secondary)', 'var(--q-muted-foreground)'] as const
const defaultFormat = (value: number) => String(Math.round(value * 100) / 100)
const width = 640, height = 280, left = 64, top = 24, plotWidth = 552, plotHeight = 208

function seriesColor(series: QuestChartSeries, index: number): string {
  return series.color ?? palette[index % palette.length] ?? palette[0]
}

function chartDomain(data: readonly QuestChartDatum[], series: readonly QuestChartSeries[]) {
  let min = 0, max = 0
  for (const row of data) for (const column of series) {
    const value = row[column.key]
    if (typeof value === 'number' && Number.isFinite(value)) { min = Math.min(min, value); max = Math.max(max, value) }
  }
  return {min, max: max === min ? min + 1 : max}
}
function pointsFor(data: readonly QuestChartDatum[], key: string, domain: {min: number; max: number}) {
  return data.map((row, index): Point | null => {
    const value = row[key]
    if (typeof value !== 'number' || !Number.isFinite(value)) return null
    return {x: left + (index + 0.5) * plotWidth / data.length, y: top + (domain.max - value) / (domain.max - domain.min) * plotHeight, value, label: row.label, index}
  })
}
function linePath(points: readonly (Point | null)[]) {
  let connected = false
  return points.map(point => {
    if (!point) { connected = false; return '' }
    const command = connected ? 'L' : 'M'
    connected = true
    return `${command}${point.x},${point.y}`
  }).join(' ')
}
function areaPath(points: readonly (Point | null)[], baseline: number) {
  let result = '', segment: Point[] = []
  const close = () => {
    const first = segment[0]
    const last = segment[segment.length - 1]
    if (!first || !last) return
    result += `M${first.x},${baseline} ${segment.map(point => `L${point.x},${point.y}`).join(' ')} L${last.x},${baseline} Z `
    segment = []
  }
  for (const point of points) {
    if (point) segment.push(point)
    else close()
  }
  close()
  return result
}

type ActivePoint = {series: string; index: number}
type PlotSeriesProps = {
  data: readonly QuestChartDatum[]
  column: QuestChartSeries
  seriesIndex: number
  seriesCount: number
  variant: NonNullable<QuestChartProps['variant']>
  domain: {min: number; max: number}
  baseline: number
  active: ActivePoint | null
  tooltipID: string | undefined
  formatValue: (value: number) => string
  onActive: (point: ActivePoint | null) => void
}

function PlotSeries({data, column, seriesIndex, seriesCount, variant, domain, baseline, active, tooltipID, formatValue, onActive}: PlotSeriesProps) {
  const points = pointsFor(data, column.key, domain)
  const barWidth = plotWidth / data.length * 0.75 / seriesCount
  return <g role="group" aria-label={column.label} style={{color: seriesColor(column, seriesIndex)}}>
    {variant === 'area' && <path d={areaPath(points, baseline)} fill="currentColor" opacity={0.2} aria-hidden="true"/>}
    {variant !== 'bar' && <path d={linePath(points)} fill="none" stroke="currentColor" strokeWidth={3} strokeLinejoin="miter" aria-hidden="true"/>}
    {points.map(point => {
      if (!point) return null
      const events = {
        tabIndex: 0, role: 'img', 'aria-label': `${point.label}, ${column.label}: ${formatValue(point.value)}`,
        'aria-describedby': active?.series === column.key && active.index === point.index ? tooltipID : undefined,
        onFocus: () => onActive({series: column.key, index: point.index}),
        onBlur: () => onActive(null),
        onMouseEnter: () => onActive({series: column.key, index: point.index}),
        onMouseLeave: () => onActive(null),
        onKeyDown: (event: KeyboardEvent<SVGElement>) => {
          if (event.key !== 'Escape') return
          event.preventDefault()
          onActive(null)
        },
      }
      if (variant !== 'bar') {
        return <rect key={point.index} {...events} {...stylex.props(dataStyles.point)}
          x={point.x - 5} y={point.y - 5} width={10} height={10} fill="currentColor"/>
      }
      return <rect key={point.index} {...events} {...stylex.props(dataStyles.point)}
        x={point.x - barWidth * seriesCount / 2 + seriesIndex * barWidth}
        y={Math.min(point.y, baseline)} width={Math.max(1, barWidth - 2)}
        height={Math.max(2, Math.abs(point.y - baseline))} fill="currentColor" stroke="currentColor"/>
    })}
  </g>
}

type PlotProps = Omit<PlotSeriesProps, 'column' | 'seriesIndex' | 'seriesCount'> & {
  label: string
  series: readonly QuestChartSeries[]
}

function Plot({data, series, label, ...seriesProps}: PlotProps) {
  const svgStyle = stylex.props(dataStyles.svg)
  const {domain, baseline, formatValue} = seriesProps
  return <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label={`${label} plot`}
    {...svgStyle} className={`${svgStyle.className} quest-chart`}>
    <title>{label}</title>
    {[domain.min, (domain.min + domain.max) / 2, domain.max].map(value => {
      const y = top + (domain.max - value) / (domain.max - domain.min) * plotHeight
      return <g key={value} aria-hidden="true">
        <line x1={left} x2={left + plotWidth} y1={y} y2={y} stroke="currentColor" strokeDasharray="4 4" opacity={0.4}/>
        <text x={left - 8} y={y + 5} textAnchor="end" fill="currentColor" fontSize={16}>{formatValue(value)}</text>
      </g>
    })}
    <line x1={left} x2={left + plotWidth} y1={baseline} y2={baseline} stroke="currentColor" aria-hidden="true"/>
    {data.map((row, index) => <text key={row.label} x={left + (index + 0.5) * plotWidth / data.length}
      y={height - 16} textAnchor="middle" fill="currentColor" fontSize={16} aria-hidden="true">{row.label}</text>)}
    {series.map((column, seriesIndex) => <PlotSeries key={column.key} {...seriesProps}
      data={data} column={column} seriesIndex={seriesIndex} seriesCount={series.length}/>)}
  </svg>
}

function Legend({series}: {series: readonly QuestChartSeries[]}) {
  return <Stack direction="horizontal" wrap="wrap" gap={3} role="list" aria-label="Chart legend">
    {series.map((column, index) => <Text as="span" role="listitem" key={column.key}>
      <span aria-hidden="true" {...stylex.props(dataStyles.swatch(seriesColor(column, index)))}/> {column.label}
    </Text>)}
  </Stack>
}

function chartTooltip(data: readonly QuestChartDatum[], series: readonly QuestChartSeries[],
  active: ActivePoint | null, formatValue: (value: number) => string): string | null {
  if (!active) return null
  const row = data[active.index]
  if (!row) return null
  const column = series.find(item => item.key === active.series)
  if (!column) return null
  const value = row[column.key]
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return `${row.label} · ${column.label}: ${formatValue(value)}`
}

export function Chart({data, series, label, description, variant = 'bar', formatValue = defaultFormat, xstyle, ...props}: QuestChartProps) {
  const id = useId()
  const [active, setActive] = useState<ActivePoint | null>(null)
  const domain = chartDomain(data, series)
  const baseline = top + domain.max / (domain.max - domain.min) * plotHeight
  const tooltip = chartTooltip(data, series, active, formatValue)
  const tooltipID = tooltip ? `${id}-tooltip` : undefined
  const graphic = data.length && series.length
    ? <Plot data={data} series={series} label={label} variant={variant} domain={domain}
      baseline={baseline} active={active} tooltipID={tooltipID} formatValue={formatValue} onActive={setActive}/>
    : <Text as="p">No chart data.</Text>
  return <Stack as="figure" gap={3} role="group" aria-label={label}
    aria-describedby={description ? `${id}-description` : undefined} {...props} xstyle={[dataStyles.frame, xstyle]}>
    <figcaption><Text>{label}</Text></figcaption>
    {description ? <Text as="p" id={`${id}-description`} type="supporting">{description}</Text> : null}
    {graphic}
    <Legend series={series}/>
    {tooltip ? <Text as="p" role="tooltip" id={tooltipID} xstyle={dataStyles.tooltip}>{tooltip}</Text> : null}
  </Stack>
}
