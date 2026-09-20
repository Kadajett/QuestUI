'use client'

import {useId, useRef, type ReactNode} from 'react'
import {Stack, type StackProps} from '@astryxdesign/core/Stack'
import {ResizeHandle as NativeResizeHandle, useResizable, type ResizeHandleProps} from '@astryxdesign/core/Resizable'
import {useMergedRefs} from '@astryxdesign/core/hooks'
import {dataStyles} from './data-extra.styles'

export type QuestResizablePanelProps = StackProps
export type QuestResizableHandleProps = ResizeHandleProps
export type QuestResizableProps = Omit<StackProps, 'children' | 'direction'> & {
  primary: ReactNode
  secondary: ReactNode
  direction?: 'horizontal' | 'vertical'
  /** Initial primary-panel share, in percent. */
  defaultSize?: number
  /** Minimum primary-panel share, in percent. */
  minSize?: number
  /** Minimum secondary-panel share, in percent. */
  minSecondarySize?: number
  handleLabel?: string
  primaryLabel?: string
  secondaryLabel?: string
  /** Astryx reports the current primary size in pixels. */
  onSizeChange?: (pixels: number) => void
}

export function ResizablePanel({xstyle, ...props}: QuestResizablePanelProps) {
  return <Stack {...props} xstyle={[dataStyles.panel, xstyle]}/>
}
export function ResizableHandle({xstyle, ...props}: QuestResizableHandleProps) {
  return <NativeResizeHandle hasDivider pillPlacement="center" {...props} xstyle={[dataStyles.handle, xstyle]}/>
}

/** Two adjacent panels using Astryx pointer capture, keyboard handling and dynamic bounds. Nest to add splits. */
export function Resizable({primary, secondary, direction = 'horizontal', defaultSize = 50, minSize = 20, minSecondarySize = 20, handleLabel = 'Resize panels', primaryLabel = 'Primary panel', secondaryLabel = 'Secondary panel', onSizeChange, xstyle, ref, ...props}: QuestResizableProps) {
  const containerRef = useRef<HTMLElement>(null)
  const id = useId()
  const minimum = Number.isFinite(minSize) ? Math.max(0, Math.min(100, minSize)) : 20
  const secondaryMinimum = Number.isFinite(minSecondarySize) ? Math.max(0, Math.min(100 - minimum, minSecondarySize)) : Math.min(20, 100 - minimum)
  const initial = Math.max(minimum, Math.min(100 - secondaryMinimum, Number.isFinite(defaultSize) ? defaultSize : 50))
  const panel = useResizable({containerRef, direction, defaultSize: `${initial}%`,
    minSize: `${minimum}%`, maxSize: `${100 - secondaryMinimum}%`,
    ...(onSizeChange === undefined ? {} : {onSizeChange})})
  return <Stack gap={0} {...props} direction={direction} ref={useMergedRefs(containerRef, ref)} xstyle={[dataStyles.frame, xstyle]}>
    <ResizablePanel id={`${id}-primary`} role="region" aria-label={primaryLabel} style={{flex: `0 0 ${panel.size}px`}}>{primary}</ResizablePanel>
    <ResizableHandle direction={direction} label={handleLabel} aria-controls={`${id}-primary`} resizable={panel.props}/>
    <ResizablePanel role="region" aria-label={secondaryLabel} style={{flex: '1 1 0'}}>{secondary}</ResizablePanel>
  </Stack>
}
