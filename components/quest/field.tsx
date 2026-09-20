'use client'

import {useId, type ReactNode} from 'react'
import {Field as AstryxField, type FieldProps} from '@astryxdesign/core/Field'
import {formExtraStyles} from './form-extra.stylex'

export type QuestFieldControlProps = {
  id: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  disabled?: boolean
  required?: boolean
}
export type QuestFieldProps = Omit<FieldProps, 'inputID' | 'children'> & {
  inputID?: string
  children: ReactNode | ((props: QuestFieldControlProps) => ReactNode)
}

type FieldIDs = {control: string; label: string; description: string; message: string}

function fieldIDs(input: {
  generated: string
  inputID: string | undefined
  labelID: string | undefined
  descriptionID: string | undefined
  messageID: string | undefined
}): FieldIDs {
  return {
    control: input.inputID ?? `${input.generated}-input`,
    label: input.labelID ?? `${input.generated}-label`,
    description: input.descriptionID ?? `${input.generated}-description`,
    message: input.messageID ?? `${input.generated}-status`,
  }
}

function controlProps(input: {
  ids: FieldIDs
  describedBy: string
  groupLabel: boolean | undefined
  invalid: boolean
  disabled: boolean | undefined
  required: boolean | undefined
}): QuestFieldControlProps {
  return {
    id: input.ids.control,
    ...(input.groupLabel ? {'aria-labelledby': input.ids.label} : {}),
    ...(input.describedBy ? {'aria-describedby': input.describedBy} : {}),
    ...(input.invalid ? {'aria-invalid': true as const} : {}),
    ...(input.disabled === undefined ? {} : {disabled: input.disabled}),
    ...(input.required === undefined ? {} : {required: input.required}),
  }
}

/** Use the render child to connect custom controls to the label, help and error. */
export function Field({inputID, labelID, descriptionID, status, children, xstyle, ...props}: QuestFieldProps) {
  const generated = useId()
  const ids = fieldIDs({generated, inputID, labelID, descriptionID, messageID: status?.messageID})
  const describedBy = [
    props.description ? ids.description : '',
    status?.message ? ids.message : '',
  ].filter(Boolean).join(' ')
  const control = controlProps({
    ids,
    describedBy,
    groupLabel: props.isGroupLabel,
    invalid: status?.type === 'error',
    disabled: props.isDisabled,
    required: props.isRequired,
  })
  const fieldStatus = status ? {status: {...status, messageID: ids.message}} : {}
  return <AstryxField {...props} inputID={ids.control} labelID={ids.label}
    descriptionID={ids.description} {...fieldStatus} xstyle={[formExtraStyles.field, xstyle]}>
    {typeof children === 'function' ? children(control) : children}
  </AstryxField>
}
