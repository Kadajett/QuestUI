import {useState} from 'react'
import {describe, expect, it} from 'vitest'
import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {Tabs, Tab} from '../../components/quest/tabs'
import {Dialog, type QuestDialogProps} from '../../components/quest/dialog'

import {DropdownMenu} from '../../components/quest/dropdown-menu'
function Journal() {
  const [value, setValue] = useState('active')
  return <Theme theme={questTheme} mode="light">
    <Tabs value={value} onChange={setValue} aria-label="Journal" overflow="visible">
      <Tab id="active-tab" value="active" label="Active" panelId="active-panel" />
      <Tab id="locked-tab" value="locked" label="Locked" panelId="locked-panel" disabled />
      <Tab id="complete-tab" value="complete" label="Complete" panelId="complete-panel" />
    </Tabs>
    <div role="tabpanel" id="active-panel" aria-labelledby="active-tab" hidden={value !== 'active'}>Find the star</div>
    <div role="tabpanel" id="locked-panel" aria-labelledby="locked-tab" hidden={value !== 'locked'}>Reach level ten</div>
    <div role="tabpanel" id="complete-panel" aria-labelledby="complete-tab" hidden={value !== 'complete'}>Supplies delivered</div>
  </Theme>
}

function Camp({purpose = 'form'}: {purpose?: QuestDialogProps['purpose']}) {
  const [isOpen, setOpen] = useState(false)
  return <Theme theme={questTheme} mode="light">
    <button onClick={() => setOpen(true)}>Make camp</button>
    <Dialog isOpen={isOpen} onOpenChange={setOpen} purpose={purpose} aria-label="Camp">
      <button data-autofocus onClick={() => setOpen(false)}>Keep exploring</button>
      <button onClick={() => setOpen(false)}>Rest</button>
    </Dialog>
  </Theme>
}

describe('pixel tabs', () => {
  it('skips disabled tabs and selects the focused tab only on activation', async () => {
    const user = userEvent.setup()
    render(<Journal />)
    const active = screen.getByRole('tab', {name: 'Active'})
    const complete = screen.getByRole('tab', {name: 'Complete'})
    await user.tab()
    expect(active).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(complete).toHaveFocus()
    expect(active).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', {name: 'Active'})).toHaveTextContent('Find the star')
    await user.keyboard('{Enter}')
    expect(complete).toHaveAttribute('aria-selected', 'true')
    expect(complete).toHaveAttribute('aria-controls', 'complete-panel')
    expect(screen.getByRole('tabpanel', {name: 'Complete'})).toHaveTextContent('Supplies delivered')
    expect(screen.queryByRole('tabpanel', {name: 'Active'})).not.toBeInTheDocument()
    await user.keyboard('{Home}')
    expect(active).toHaveFocus()
    await user.keyboard(' ')
    expect(active).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', {name: 'Locked'}))
    expect(screen.getByRole('tabpanel', {name: 'Active'})).toBeInTheDocument()
  })
})

describe('pixel dialog', () => {
  it('handles controlled dismissal and restores focus to its opener', async () => {
    const user = userEvent.setup()
    render(<Camp />)
    const opener = screen.getByRole('button', {name: 'Make camp'})
    await user.click(opener)
    const dialog = screen.getByRole('dialog', {name: 'Camp'})
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', {name: 'Keep exploring'})).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(dialog).not.toHaveAttribute('open')
    expect(opener).toHaveFocus()
    await user.click(opener)
    await user.click(screen.getByRole('button', {name: 'Rest'}))
    expect(dialog).not.toHaveAttribute('open')
    expect(opener).toHaveFocus()
  })

  it('preserves required-purpose dismissal protection for Escape and native cancel', async () => {
    const user = userEvent.setup()
    render(<Camp purpose="required" />)
    await user.click(screen.getByRole('button', {name: 'Make camp'}))
    const dialog = screen.getByRole('alertdialog', {name: 'Camp'})
    await user.keyboard('{Escape}')
    fireEvent(dialog, new Event('cancel', {cancelable: true}))
    expect(dialog).toHaveAttribute('open')
    await user.click(screen.getByRole('button', {name: 'Rest'}))
    expect(dialog).not.toHaveAttribute('open')
  })
})

describe('pixel dropdown menu', () => {
  function QuestMenu() {
    const [chosen, setChosen] = useState('idle')
    return <Theme theme={questTheme} mode="light">
      <DropdownMenu
        button={{label: 'Quest actions'}}
        aria-label="Quest actions"
        items={[
          {id: 'inspect', label: 'Inspect seal', onClick: () => setChosen('inspecting')},
          {type: 'divider'},
          {id: 'retreat', label: 'Retreat to camp', isDisabled: true, onClick: () => setChosen('retreated')},
          {id: 'abandon', label: 'Abandon quest', variant: 'destructive', onClick: () => setChosen('abandoned')},
        ]}
      />
      <p role="status" aria-label="Selected action">{chosen}</p>
    </Theme>
  }
  it('ignores disabled actions and reports an enabled selection', async () => {
    const user = userEvent.setup()
    render(<QuestMenu />)
    await user.click(screen.getByRole('button', {name: /Quest actions/}))
    const menu = screen.getByRole('menu', {name: 'Quest actions'})
    expect(menu).toBeInTheDocument()
    const inspect = screen.getByRole('menuitem', {name: 'Inspect seal'})
    const retreat = screen.getByRole('menuitem', {name: 'Retreat to camp'})
    await user.click(retreat)
    expect(screen.getByRole('status', {name: 'Selected action'})).toHaveTextContent('idle')
    await user.click(inspect)
    expect(screen.getByRole('status', {name: 'Selected action'})).toHaveTextContent('inspecting')
  })
})
