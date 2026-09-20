'use client'

import {TabList as AstryxTabList, Tab as AstryxTab, useTabListContext, type TabListProps, type TabProps} from '@astryxdesign/core/TabList'
import * as stylex from '@stylexjs/stylex'

export type QuestTabsProps = Omit<TabListProps, 'role'>
export type QuestTabProps = TabProps & {disabled?: boolean}

const styles = stylex.create({
  list: {
    '--focus-outline-color': 'var(--q-ring)', '--focus-outline-width': '3px',
    '--focus-outline-offset': '3px', '--radius-full': '0px',
    '--color-accent': 'var(--q-primary-foreground)',
    '--color-overlay-hover': 'transparent',
    fontFamily: 'var(--q-font-display)',
    paddingBlock: 8, paddingInline: 4,
  },
  tab: {
    '--q-tab-fill': {default: 'var(--q-muted)', ':hover': 'var(--q-accent)'},
    '--q-tab-edge': 'var(--q-input)',
    position: 'relative', isolation: 'isolate', boxSizing: 'border-box',
    minHeight: 48, paddingBlock: 12, paddingInline: 20,
    borderWidth: 0, borderRadius: 0, backgroundColor: 'transparent',
    color: 'var(--q-foreground)', fontFamily: 'var(--q-font-display)',
    fontSize: 18, fontWeight: 700, lineHeight: 1.2,
    filter: 'drop-shadow(0 4px 0 var(--q-shadow))',
    transitionProperty: 'none',
    '::before': {
      content: '""', position: 'absolute', inset: 0, zIndex: -1,
      pointerEvents: 'none', clipPath: 'var(--q-step)', backgroundColor: 'var(--q-tab-edge)',
    },
    '::after': {
      content: '""', position: 'absolute', inset: 3, zIndex: -1,
      pointerEvents: 'none', clipPath: 'var(--q-step)', backgroundColor: 'var(--q-tab-fill)',
      boxShadow: 'inset 0 3px 0 color-mix(in srgb,var(--q-tab-fill),white 24%),inset 0 -4px 0 color-mix(in srgb,var(--q-tab-fill),black 25%)',
    },
  },
  selected: {
    '--q-tab-fill': {default: 'var(--q-primary)', ':hover': 'var(--q-primary)'},
    '--q-tab-edge': 'var(--q-edge)', color: 'var(--q-primary-foreground)',
  },
  disabled: {opacity: 0.45, cursor: 'not-allowed'},
})

/** Controlled, horizontal tabs. Arrow keys move focus; Enter or Space selects. */
export function Tabs({xstyle, ...props}: QuestTabsProps) {
  return <AstryxTabList {...props} role="tablist" xstyle={[styles.list, xstyle]} />
}

/** Link panelId to a panel's id, and label that panel with this tab's id. */
export function Tab({xstyle, ...props}: QuestTabProps) {
  const {value} = useTabListContext()
  const isDisabled = props.disabled || props['aria-disabled'] === true || props['aria-disabled'] === 'true'
  return <AstryxTab {...props} xstyle={[styles.tab, value === props.value && styles.selected, isDisabled && styles.disabled, xstyle]} />
}
