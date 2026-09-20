'use client'

import {Skeleton as AstryxSkeleton, type SkeletonProps} from '@astryxdesign/core/Skeleton'
import {feedbackStyles} from './feedback.styles'

export type QuestSkeletonProps = Omit<SkeletonProps, 'radius'>

/** Decorative pixel placeholder; label the surrounding busy region, not each shape. */
export function Skeleton({xstyle, ...props}: QuestSkeletonProps) {
  return <AstryxSkeleton {...props} radius="none" xstyle={[feedbackStyles.skeleton, xstyle]}/>
}
