"use client"

import type {ComponentProps} from 'react'
import * as stylex from '@stylexjs/stylex'
import {Card as AstryxCard} from '@astryxdesign/core/Card'
import {cardStyles} from './card-styles'

export type QuestCardProps = ComponentProps<typeof AstryxCard>
type PartProps<T extends 'div' | 'h3' | 'p'> = ComponentProps<T> & {xstyle?: stylex.StyleXStyles}

export function Card({xstyle, ...props}: QuestCardProps) {
  return <AstryxCard variant="transparent" padding={0} {...props} xstyle={[cardStyles.frame, xstyle]} />
}

export function CardHeader({xstyle, className, ...props}: PartProps<'div'>) {
  const styled = stylex.props(cardStyles.header, xstyle)
  return <div {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} data-quest-card-header="" />
}

export function CardTitle({xstyle, className, ...props}: PartProps<'h3'>) {
  const styled = stylex.props(cardStyles.title, xstyle)
  return <h3 {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} />
}

export function CardDescription({xstyle, className, ...props}: PartProps<'p'>) {
  const styled = stylex.props(cardStyles.description, xstyle)
  return <p {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} />
}

export function CardContent({xstyle, className, ...props}: PartProps<'div'>) {
  const styled = stylex.props(cardStyles.content, xstyle)
  return <div {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} data-quest-card-content="" />
}

export function CardFooter({xstyle, className, ...props}: PartProps<'div'>) {
  const styled = stylex.props(cardStyles.footer, xstyle)
  return <div {...props} {...styled} className={[styled.className, className].filter(Boolean).join(' ')} />
}
