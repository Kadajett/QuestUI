'use client'

import {ProgressBar as AstryxProgress, type ProgressBarProps} from '@astryxdesign/core/ProgressBar'
import {feedbackStyles} from './feedback.styles'
import './feedback.css'

export type QuestProgressProps = ProgressBarProps

/** Named progress with Astryx's clamping, value text and indeterminate semantics. */
export function Progress({xstyle, className, max = 100, ...props}: QuestProgressProps) {
  // A range must stay ordered even when a caller receives an invalid total.
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100
  return <AstryxProgress {...props} max={safeMax}
    className={className ? `quest-progress ${className}` : 'quest-progress'}
    xstyle={[feedbackStyles.progress, xstyle]}/>
}
