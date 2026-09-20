'use client'

import {useMemo, type KeyboardEvent} from 'react'
import {TopNav, TopNavItem, TopNavMenu, type TopNavProps, type TopNavItemProps, type TopNavMenuProps} from '@astryxdesign/core/TopNav'
import {cardStyles} from './card-styles'
import {navigationStyles} from './navigation-extra.styles'
import './navigation-extra.css'

export type QuestNavigationMenuProps = TopNavProps
export type QuestNavigationMenuLinkProps = TopNavItemProps
export type QuestNavigationMenuItemProps = TopNavMenuProps

/** Slot-based navigation bar. Children fill startContent; native AppShell mobile rendering is preserved. */
export function NavigationMenu({xstyle, ...props}: QuestNavigationMenuProps) {
  return <TopNav {...props} xstyle={[cardStyles.frame, navigationStyles.tokens, navigationStyles.bar, xstyle]} />
}

export function NavigationMenuLink({xstyle, ...props}: QuestNavigationMenuLinkProps) {
  return <TopNavItem {...props} xstyle={[navigationStyles.item, xstyle]} />
}

/** Astryx owns the menu; the wrapper adds APG ArrowDown/ArrowUp opening on its trigger. */
export function NavigationMenuItem({xstyle, items, onKeyDown, ...props}: QuestNavigationMenuItemProps) {
  const styledItems = useMemo(() => items.map(item => ({...item, icon: <span className="quest-navigation-menu-icon">{item.icon}</span>})), [items])
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !['ArrowDown', 'ArrowUp'].includes(event.key)) return
    event.preventDefault()
    event.currentTarget.click()
  }
  return <TopNavMenu {...props} items={styledItems} onKeyDown={handleKeyDown} xstyle={[navigationStyles.item, xstyle]} />
}
