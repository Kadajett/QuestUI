"use client"

import type {ComponentProps} from 'react'
import * as stylex from '@stylexjs/stylex'

export type QuestDirectionProps = Omit<ComponentProps<'div'>, 'dir'> & {
  dir: 'ltr' | 'rtl' | 'auto'
  xstyle?: stylex.StyleXStyles
}

/** A real HTML direction boundary; nested boundaries can override inheritance. */
export function Direction({dir, xstyle, className, style, ...props}: QuestDirectionProps) {
  const styled = stylex.props(xstyle)
  return <div {...props} {...styled} dir={dir}
    className={[styled.className, className].filter(Boolean).join(' ')}
    style={{...styled.style, ...style}} />
}
