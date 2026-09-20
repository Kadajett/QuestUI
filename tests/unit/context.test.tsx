import {useState} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {ContextMenu} from '../../components/quest/context-menu'
import {HoverCard} from '../../components/quest/hover-card'

const wrap = (children: React.ReactNode) => <Theme theme={questTheme} mode="light">{children}</Theme>

describe('pixel context menu', () => {
  it('blocks disabled actions and invokes enabled actions before dismissing', async () => {
    const open = vi.fn()
    const sell = vi.fn()
    const user = userEvent.setup()
    render(wrap(<ContextMenu label="Chest" items={[
      {id: 'open', label: 'Open', onClick: open},
      {id: 'sell', label: 'Sell', isDisabled: true, onClick: sell},
    ]}><button>Chest target</button></ContextMenu>))
    fireEvent.contextMenu(screen.getByRole('button', {name: 'Chest target'}))
    await user.click(await screen.findByRole('menuitem', {name: 'Sell'}))
    expect(sell).not.toHaveBeenCalled()
    expect(screen.getByRole('menu', {name: 'Chest'})).toBeVisible()
    await user.click(screen.getByRole('menuitem', {name: 'Open'}))
    expect(open).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu', {name: 'Chest'})).not.toBeInTheDocument())
  })
})

function ControlledPreview() {
  const [open, setOpen] = useState(true)
  return <HoverCard label="Profile" isOpen={open} onOpenChange={setOpen} content={<p>Ranger level twelve</p>}>
    <button>Ranger</button>
  </HoverCard>
}

describe('pixel hover card', () => {
  it('opens on keyboard focus and dismisses with Escape', async () => {
    const user = userEvent.setup()
    render(wrap(<HoverCard label="Profile" content={<p>Ranger level twelve</p>}><button>Ranger</button></HoverCard>))
    await user.tab()
    expect(await screen.findByRole('dialog', {name: 'Profile'})).toHaveTextContent('Ranger level twelve')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Profile'})).not.toBeInTheDocument())
    expect(screen.getByRole('button', {name: 'Ranger'})).toHaveFocus()
  })

  it('lets a controlled owner honor Escape dismissal', async () => {
    const user = userEvent.setup()
    render(wrap(<ControlledPreview />))
    expect(await screen.findByRole('dialog', {name: 'Profile'})).toBeVisible()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog', {name: 'Profile'})).not.toBeInTheDocument())
  })
})
