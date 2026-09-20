import {useState, type ReactNode} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Theme} from '@astryxdesign/core/theme'
import {questTheme} from '../../components/quest/theme'
import {Field} from '../../components/quest/field'
import {NativeSelect} from '../../components/quest/native-select'
import {InputGroup, InputGroupInput} from '../../components/quest/input-group'
import {InputOTP} from '../../components/quest/input-otp'
import {Toggle} from '../../components/quest/toggle'
import {ToggleGroup, ToggleGroupItem} from '../../components/quest/toggle-group'
import {DatePicker} from '../../components/quest/date-picker'

function Surface({children}: {children: ReactNode}) {
  return <Theme theme={questTheme} mode="light">{children}</Theme>
}

function itemAt<T>(items: readonly T[], index: number): T {
  const item = items[index]
  if (item === undefined) throw new Error(`Expected item at index ${index}`)
  return item
}

function Toggles() {
  const [single, setSingle] = useState<string | null>('a')
  const [multiple, setMultiple] = useState<string[]>(['a'])
  const [pressed, setPressed] = useState(false)
  return <Surface>
    <Toggle label="Favorite" isPressed={pressed} onPressedChange={setPressed} />
    <ToggleGroup label="Single" value={single} onChange={setSingle}>
      <ToggleGroupItem label="First" value="a" /><ToggleGroupItem label="Locked" value="locked" isDisabled /><ToggleGroupItem label="Last" value="b" />
    </ToggleGroup>
    <ToggleGroup label="Multiple" type="multiple" value={multiple} onChange={setMultiple}>
      <ToggleGroupItem label="Map" value="a" /><ToggleGroupItem label="Compass" value="b" />
    </ToggleGroup>
  </Surface>
}

describe('extended form controls', () => {
  it('associates custom field and group help and errors with controls', () => {
    render(<Surface>
      <Field label="Agreement" description="Read the rules." status={{type: 'error', message: 'Accept the rules.'}}>
        {props => <input {...props} type="checkbox" />}
      </Field>
      <InputGroup label="Address" description="Your guild address." status={{type: 'error', message: 'Address is taken.'}}>
        <InputGroupInput label="Slug" isLabelHidden value="mira" onChange={() => {}} />
      </InputGroup>
    </Surface>)
    expect(screen.getByRole('checkbox', {name: 'Agreement'})).toHaveAccessibleDescription('Read the rules. Accept the rules.')
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('group', {name: 'Address'})).toHaveAccessibleDescription('Your guild address. Address is taken.')
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Your guild address. Address is taken.')
  })

  it('submits the platform select value and blocks disabled grouped inputs', async () => {
    const user = userEvent.setup()
    render(<Surface><form aria-label="Profile">
      <NativeSelect label="Realm" name="realm" defaultValue="forest"><option value="forest">Forest</option><option value="castle">Castle</option></NativeSelect>
      <InputGroup label="Locked address" isDisabled><InputGroupInput label="Slug" value="mira" onChange={() => {}} /></InputGroup>
    </form></Surface>)
    await user.selectOptions(screen.getByRole('combobox', {name: 'Realm'}), 'castle')
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('realm')).toBe('castle')
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('distributes pasted digits, permits correction and submits one OTP value', async () => {
    const user = userEvent.setup()
    const complete = vi.fn()
    render(<Surface><form aria-label="Verification"><InputOTP label="Code" length={4} name="code" onComplete={complete} /></form></Surface>)
    const digits = screen.getAllByRole('textbox')
    const first = itemAt(digits, 0)
    const second = itemAt(digits, 1)
    const third = itemAt(digits, 2)
    const fourth = itemAt(digits, 3)
    await user.click(first)
    await user.paste('1a2-345')
    expect(digits.map(input => (input as HTMLInputElement).value)).toEqual(['1', '2', '3', '4'])
    expect(complete).toHaveBeenCalledWith('1234')
    expect(fourth).toHaveFocus()
    await user.keyboard('{Backspace}')
    expect(third).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(second).toHaveFocus()
    await user.keyboard('9')
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('code')).toBe('193')
  })

  it('honors controlled OTP updates and disabled state', async () => {
    const user = userEvent.setup()
    const change = vi.fn()
    const {rerender} = render(<Surface><InputOTP label="Code" length={4} value="12" onChange={change} /></Surface>)
    const digits = screen.getAllByRole('textbox')
    fireEvent.change(itemAt(digits, 2), {target: {value: '3'}})
    expect(change).toHaveBeenCalledWith('123')
    expect(digits[2]).toHaveValue('')
    rerender(<Surface><InputOTP label="Code" length={4} value="9876" onChange={change} disabled /></Surface>)
    expect(digits.map(input => (input as HTMLInputElement).value)).toEqual(['9', '8', '7', '6'])
    const first = itemAt(digits, 0)
    await user.click(first)
    expect(first).toBeDisabled()
    expect(change).toHaveBeenCalledTimes(1)
  })

  it('moves over disabled toggles without selecting and supports single deselection and multiple values', async () => {
    const user = userEvent.setup()
    render(<Toggles />)
    await user.click(screen.getByRole('button', {name: 'Favorite'}))
    expect(screen.getByRole('button', {name: 'Favorite'})).toHaveAttribute('aria-pressed', 'true')
    screen.getByRole('button', {name: 'First'}).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('button', {name: 'Last'})).toHaveFocus()
    expect(screen.getByRole('button', {name: 'First'})).toHaveAttribute('aria-pressed', 'true')
    await user.keyboard(' ')
    expect(screen.getByRole('button', {name: 'Last'})).toHaveAttribute('aria-pressed', 'true')
    await user.keyboard(' ')
    expect(screen.getByRole('button', {name: 'Last'})).toHaveAttribute('aria-pressed', 'false')
    await user.click(screen.getByRole('button', {name: 'Compass'}))
    expect(screen.getByRole('button', {name: 'Compass'})).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', {name: 'Map'})).toHaveAttribute('aria-pressed', 'true')
  })

  it('refuses dates outside constraints and commits a typed valid date', () => {
    const change = vi.fn()
    render(<Surface><DatePicker label="Departure" value="2026-09-17" onChange={change} min="2026-09-01" max="2026-09-30" nativePicker="never" /></Surface>)
    const input = screen.getByRole('combobox', {name: 'Departure'})
    fireEvent.change(input, {target: {value: '2026-10-01'}})
    fireEvent.blur(input)
    expect(change).not.toHaveBeenCalled()
    fireEvent.change(input, {target: {value: '2026-09-20'}})
    fireEvent.blur(input)
    expect(change).toHaveBeenCalledWith('2026-09-20')
  })
})
