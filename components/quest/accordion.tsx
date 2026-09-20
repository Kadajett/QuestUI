'use client'

import {Collapsible, CollapsibleGroup, type CollapsibleProps, type CollapsibleGroupProps} from '@astryxdesign/core/Collapsible'
import './accordion.css'

export type QuestAccordionProps = Omit<CollapsibleGroupProps, 'hasDividers'>
export type QuestAccordionItemProps = Omit<CollapsibleProps, 'value'> & {value: string}

/**
 * Astryx coordinates items by value. Single mode uses a string ('' closes all);
 * multiple mode uses string[]. Use value/onChange or defaultValue, not both.
 * Every item needs a unique value. Tab navigates triggers; Enter/Space toggles.
 */
export function Accordion({className, ...props}: QuestAccordionProps) {
  return <CollapsibleGroup {...props} hasDividers className={['quest-accordion', className].filter(Boolean).join(' ')}/>
}

/**
 * trigger is a non-interactive label; Astryx supplies its button and aria-controls.
 * Inside Accordion, group value/onChange wins over item isOpen/onOpenChange.
 * Standalone items may instead use isOpen/onOpenChange or defaultIsOpen.
 */
export function AccordionItem({className, ...props}: QuestAccordionItemProps) {
  return <Collapsible {...props} className={['quest-accordion-item', className].filter(Boolean).join(' ')}/>
}
