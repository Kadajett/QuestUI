"use client"

import type {ComponentProps} from 'react'
import {Spinner as AstryxSpinner} from '@astryxdesign/core/Spinner'
import * as stylex from '@stylexjs/stylex'
import './spinner.css'

export type QuestSpinnerProps = ComponentProps<typeof AstryxSpinner>

const styles = stylex.create({
  root: {fontFamily: 'var(--q-font-body)'},
})

/** Astryx supplies localized status naming; CSS changes only the ring's paint. */
export function Spinner({className, xstyle, ...props}: QuestSpinnerProps) {
  return <AstryxSpinner {...props} className={['quest-spinner', className].filter(Boolean).join(' ')}
    xstyle={[styles.root, xstyle]} />
}
