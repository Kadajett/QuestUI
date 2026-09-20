'use client'

import {ScrollableArea, type ScrollableAreaProps} from '@astryxdesign/core/ScrollableArea'
import {navigationStyles} from './navigation-extra.styles'

export type QuestScrollAreaProps = ScrollableAreaProps

/** Native scroll viewport; provide a height for block scrolling or width for inline scrolling. */
export function ScrollArea({xstyle, ...props}: QuestScrollAreaProps) {
  return <ScrollableArea {...props} xstyle={[navigationStyles.tokens, navigationStyles.viewport, xstyle]} />
}
