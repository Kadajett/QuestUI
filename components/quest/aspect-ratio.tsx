"use client"

import type {ComponentProps} from 'react'
import {AspectRatio as AstryxAspectRatio} from '@astryxdesign/core/AspectRatio'
import * as stylex from '@stylexjs/stylex'

export type QuestAspectRatioProps = ComponentProps<typeof AstryxAspectRatio>

const styles = stylex.create({
  frame: {
    backgroundColor: 'var(--q-muted)',
    color: 'var(--q-foreground)',
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineColor: {default: 'var(--q-border)', '@media (forced-colors: active)': 'CanvasText'},
    imageRendering: 'pixelated',
  },
})

export function AspectRatio({xstyle, ...props}: QuestAspectRatioProps) {
  return <AstryxAspectRatio {...props} xstyle={[styles.frame, xstyle]} />
}
