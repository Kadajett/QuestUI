'use client'

import {DropdownMenu as AstryxDropdownMenu, type DropdownMenuProps} from '@astryxdesign/core/DropdownMenu'
import {pickerStyles} from './picker.styles'

export type QuestDropdownMenuProps = DropdownMenuProps

/** Astryx dropdown semantics (keyboard, light-dismiss, bottom-sheet) with Quest's stepped popover frame. */
export function DropdownMenu({xstyle, button, ...props}: QuestDropdownMenuProps) {
  const styledButton = button
    ? {button: {...button, variant: button.variant ?? 'ghost', xstyle: [pickerStyles.popover, button.xstyle]}}
    : {}
  return <AstryxDropdownMenu {...props} {...styledButton} xstyle={[pickerStyles.popover, xstyle]} />
}
