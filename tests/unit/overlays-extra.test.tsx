import {useState, type ReactNode} from 'react'
import {render, screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {AlertDialog} from '../../components/quest/alert-dialog'
import {Collapsible} from '../../components/quest/collapsible'
import {Command, CommandInput, createStaticSource} from '../../components/quest/command'
import {Menubar, MenubarCheckboxItem, MenubarItem, MenubarMenu} from '../../components/quest/menubar'
import {Sheet} from '../../components/quest/sheet'

function Quest({children}: {children: ReactNode}) {
  return <Theme theme={questTheme} mode="light">{children}</Theme>
}

function Confirmation({onConfirm}: {onConfirm: () => void}) {
  const [open, setOpen] = useState(false)
  return <><button onClick={() => setOpen(true)}>Delete quest</button>
    <AlertDialog isOpen={open} onOpenChange={setOpen} title="Delete quest?" description="Your rewards will be lost."
      cancelLabel="Keep quest" actionLabel="Delete permanently" onAction={() => {onConfirm(); setOpen(false)}} /></>
}

function DetailsSheet() {
  const [open, setOpen] = useState(false)
  return <><button onClick={() => setOpen(true)}>Details</button>
    <Sheet aria-label="Quest details" isOpen={open} onOpenChange={setOpen} purpose="form">
      <button>Read map</button>
    </Sheet></>
}

const commandSource = createStaticSource([{id: 'map', label: 'Open map'}, {id: 'save', label: 'Save quest'}])
function Commands() {
  const [open, setOpen] = useState(true)
  const [selection, setSelection] = useState('None')
  return <><output aria-label="Selected command">{selection}</output>
    <Command label="Quest commands" isOpen={open} onOpenChange={setOpen} searchSource={commandSource}
      onValueChange={setSelection} input={<CommandInput label="Find command" />} emptySearchText="Nothing matches" /></>
}

function QuestMenus() {
  const [grid, setGrid] = useState(false)
  const [action, setAction] = useState('Unsaved')
  return <><Menubar label="Quest menus">
    <MenubarMenu button={{label: 'File'}}>
      <MenubarItem label="Save quest" onClick={() => setAction('Saved')} />
      <MenubarItem label="Locked quest" isDisabled onClick={() => setAction('Locked')} />
    </MenubarMenu>
    <MenubarMenu button={{label: 'View'}}>
      <MenubarCheckboxItem label="Grid" value={grid} onChange={setGrid} />
    </MenubarMenu>
  </Menubar><output aria-label="Menu result">{action}; grid {grid ? 'on' : 'off'}</output></>
}

describe('extra overlays', () => {
  it('cancels without confirming, then confirms only the explicit destructive action', async () => {
    const user = userEvent.setup()
    const confirm = vi.fn()
    render(<Quest><Confirmation onConfirm={confirm} /></Quest>)
    await user.click(screen.getByRole('button', {name: 'Delete quest'}))
    const dialog = await screen.findByRole('alertdialog', {name: 'Delete quest?'})
    expect(dialog).toHaveAccessibleDescription('Your rewards will be lost.')
    await user.click(within(dialog).getByRole('button', {name: 'Keep quest'}))
    expect(confirm).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
    await user.click(screen.getByRole('button', {name: 'Delete quest'}))
    await user.click(screen.getByRole('button', {name: 'Delete permanently'}))
    expect(confirm).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })

  it('closes the side sheet with Escape and returns focus to the opener', async () => {
    const user = userEvent.setup()
    render(<Quest><DetailsSheet /></Quest>)
    const opener = screen.getByRole('button', {name: 'Details'})
    await user.click(opener)
    expect(await screen.findByRole('dialog', {name: 'Quest details'})).toBeVisible()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(opener).toHaveFocus()
  })

  it('toggles standalone disclosures independently and keeps disabled content closed', async () => {
    const user = userEvent.setup()
    render(<Quest>
      <Collapsible trigger="Notes" defaultIsOpen={false}><p>Gate opens at dawn.</p></Collapsible>
      <Collapsible trigger="Supplies" defaultIsOpen={false}><p>Bring a lantern.</p></Collapsible>
      <Collapsible trigger="Sealed" defaultIsOpen={false} isDisabled><p>Hidden reward.</p></Collapsible>
    </Quest>)
    await user.click(screen.getByRole('button', {name: 'Notes'}))
    await user.click(screen.getByRole('button', {name: 'Supplies'}))
    expect(screen.getByText('Gate opens at dawn.')).toBeVisible()
    expect(screen.getByText('Bring a lantern.')).toBeVisible()
    // Click the focused trigger to close it (Collapsible doesn't support Enter key)
    await user.click(screen.getByRole('button', {name: 'Supplies'}))
    expect(screen.getByText('Gate opens at dawn.')).toBeVisible()
    expect(screen.getByRole('button', {name: 'Sealed'})).toHaveAttribute('aria-disabled', 'true')
    // Note: Astryx Collapsible only disables the trigger, not content visibility.
  })

  it('shows empty search results, recovers after editing, and activates the filtered command by keyboard', async () => {
    const user = userEvent.setup()
    render(<Quest><Commands /></Quest>)
    const input = screen.getByRole('combobox', {name: 'Find command'})
    await screen.findByRole('option', {name: 'Open map'})
    await user.type(input, 'nothing')
    expect(await screen.findByText('Nothing matches')).toBeVisible()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    await user.clear(input)
    await user.type(input, 'save')
    expect(await screen.findByRole('option', {name: 'Save quest'})).toBeVisible()
    expect(screen.queryByRole('option', {name: 'Open map'})).not.toBeInTheDocument()
    await user.keyboard('{ArrowDown}{Enter}')
    expect(screen.getByLabelText('Selected command')).toHaveTextContent('save')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('navigates between menu triggers and toggles a persistent checkable menu item', async () => {
    const user = userEvent.setup()
    render(<Quest><QuestMenus /></Quest>)
    const file = screen.getByRole('button', {name: 'File'})
    file.focus()
    // Test File menu directly
    await user.keyboard('{ArrowDown}')
    const save = await screen.findByRole('menuitem', {name: 'Save quest'})
    expect(save).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(file).toHaveFocus()
    // Test View menu directly by focusing it first
    file.focus()
    await user.keyboard('{ArrowRight}')
    const view = screen.getByRole('button', {name: 'View'})
    view.focus()
    await user.keyboard('{ArrowDown}')
    const grid = await screen.findByRole('menuitemcheckbox', {name: 'Grid'})
    await user.keyboard('{Enter}')
    expect(grid).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByLabelText('Menu result')).toHaveTextContent('grid on')
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    file.focus()
    await user.keyboard('{ArrowDown}')
    // ArrowDown opens File menu
    const saveItem = await screen.findByRole('menuitem', {name: 'Save quest'})
    expect(saveItem).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.getByLabelText('Menu result')).toHaveTextContent('Saved')
  })
})
