'use client'

import {Popover as AstryxPopover, type PopoverProps} from '@astryxdesign/core/Popover'
import {pickerStyles} from './picker.styles'

export type QuestPopoverProps = PopoverProps

/** Native light-dismiss popover; no backdrop layer, wash, or blur is introduced. */
export function Popover({xstyle, ...props}: QuestPopoverProps) {
  return <AstryxPopover {...props} xstyle={[pickerStyles.popover, xstyle]} />
}
