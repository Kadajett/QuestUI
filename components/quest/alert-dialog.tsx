'use client'

import {AlertDialog as AstryxAlertDialog, type AlertDialogProps} from '@astryxdesign/core/AlertDialog'
import {pickerStyles} from './picker.styles'
import {overlayStyles} from './overlays-extra.stylex'
import './overlays-extra.css'

export type QuestAlertDialogProps = AlertDialogProps

/** Confirm invokes onAction; the owner closes after the action succeeds. Cancel never confirms. */
export function AlertDialog({xstyle, className, ...props}: QuestAlertDialogProps) {
  return <AstryxAlertDialog {...props} className={['quest-overlay-extra', className].filter(Boolean).join(' ')}
    xstyle={[pickerStyles.popover, overlayStyles.modal, xstyle]} />
}
