'use client'

import {ContextMenu as AstryxContextMenu, type ContextMenuProps} from '@astryxdesign/core/ContextMenu'
import {pickerStyles} from './picker.styles'

export type QuestContextMenuProps = ContextMenuProps

/** Native context-menu gestures and action semantics with a stepped Quest surface. */
export function ContextMenu({xstyle, ...props}: QuestContextMenuProps) {
  return <AstryxContextMenu {...props} xstyle={[pickerStyles.popover, xstyle]} />
}
