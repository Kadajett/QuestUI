'use client'

import {Collapsible as AstryxCollapsible, type CollapsibleProps} from '@astryxdesign/core/Collapsible'
import {pickerStyles} from './picker.styles'
import './accordion.css'
import './overlays-extra.css'

export type QuestCollapsibleProps = CollapsibleProps

/** The independent trigger slot is a label; Astryx supplies its accessible button and content region. */
export function Collapsible({xstyle, className, ...props}: QuestCollapsibleProps) {
  return <AstryxCollapsible {...props} className={['quest-overlay-extra', 'quest-accordion-item', className].filter(Boolean).join(' ')}
    xstyle={[pickerStyles.popover, xstyle]} />
}
