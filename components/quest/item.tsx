"use client"

import type {ComponentProps} from 'react'
import {Item as AstryxItem} from '@astryxdesign/core/Item'
import * as stylex from '@stylexjs/stylex'

export type QuestItemProps = ComponentProps<typeof AstryxItem>

const styles = stylex.create({
  item: {
    borderRadius: 0, borderWidth: 2, borderStyle: 'solid',
    borderColor: {default: 'var(--q-border)', '@media (forced-colors: active)': 'CanvasText'},
    backgroundColor: 'var(--q-card)', color: 'var(--q-card-foreground)',
    fontFamily: 'var(--q-font-body)',
    transitionDuration: {default: '100ms', '@media (prefers-reduced-motion: reduce)': '0s'},
  },
  selected: {
    backgroundColor: {default: 'var(--q-accent)', '@media (forced-colors: active)': 'Highlight'},
    color: {default: 'var(--q-accent-foreground)', '@media (forced-colors: active)': 'HighlightText'},
    borderColor: {default: 'var(--q-primary)', '@media (forced-colors: active)': 'Highlight'},
  },
  highlighted: {backgroundColor: 'var(--q-muted)'},
})

/** Preserves Astryx's separate primary action and nested-control semantics. */
export function Item({xstyle, isSelected, isHighlighted, ...props}: QuestItemProps) {
  return <AstryxItem {...props}
    {...(isSelected === undefined ? {} : {isSelected})}
    {...(isHighlighted === undefined ? {} : {isHighlighted})}
    xstyle={[styles.item, isHighlighted && styles.highlighted, isSelected && styles.selected, xstyle]} />
}
