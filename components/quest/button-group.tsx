"use client"

import type {ComponentProps} from 'react'
import {ButtonGroup as AstryxButtonGroup} from '@astryxdesign/core/ButtonGroup'
import * as stylex from '@stylexjs/stylex'

export type QuestButtonGroupProps = ComponentProps<typeof AstryxButtonGroup>

const styles = stylex.create({
  group: {gap: 4, padding: 4, borderRadius: 0, backgroundColor: 'var(--q-muted)', maxWidth: '100%'},
})

/** Astryx owns roving focus, orientation, and group-wide disabled state. */
export function ButtonGroup({xstyle, ...props}: QuestButtonGroupProps) {
  return <AstryxButtonGroup {...props} xstyle={[styles.group, xstyle]} />
}
