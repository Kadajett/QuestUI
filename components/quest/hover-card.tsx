'use client'

import {HoverCard as AstryxHoverCard, type HoverCardProps} from '@astryxdesign/core/HoverCard'
import {pickerStyles} from './picker.styles'

export type QuestHoverCardProps = HoverCardProps

/** Astryx owns hover, focus, Escape and touch behavior; Quest frames the floating content. */
export function HoverCard({xstyle, ...props}: QuestHoverCardProps) {
  return <AstryxHoverCard {...props} xstyle={[pickerStyles.popover, xstyle]} />
}
