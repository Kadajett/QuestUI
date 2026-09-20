'use client'

import {Tooltip as AstryxTooltip, type TooltipProps} from '@astryxdesign/core/Tooltip'
import {Text} from '@astryxdesign/core/Text'
import './feedback.css'

export type QuestTooltipProps = TooltipProps

/** Astryx owns hover, focus, touch, Escape and the trigger's accessible description. */
export function Tooltip({content, ...props}: QuestTooltipProps) {
  return <AstryxTooltip {...props} content={<Text data-quest-tooltip="">{content}</Text>}/>
}
