import clsx from 'clsx'
import { FunctionComponent, useEffect, useState } from 'react'
import { Button, ButtonProps } from '../../Button/Button'
import { ICON } from '../../Icon/Icon'
import styles from './CycleButton.module.scss'

export interface CycleButtonOption {
  value: string
  label?: string
  icon?: ICON
}

export interface CycleButtonProps extends Omit<ButtonProps, 'value' | 'onChange'> {
  options: CycleButtonOption[]
  disabled?: boolean
  value: string | number | boolean
  onChange: (option: CycleButtonOption) => void
}

export const CycleButton: FunctionComponent<CycleButtonProps> = ({ value, className, options, placeholder, disabled, onChange, onClick, ...props }) => {
  const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value === value) ?? options[0])

  useEffect(() => {
    const option = options.find((entry) => entry.value === value)
    if (option && option !== selectedOption) { setSelectedOption(option) }
  }, [value])

  return (
    <Button className={clsx(styles['button'], className)} disabled={disabled}
      icon={selectedOption.icon} label={selectedOption.label}
      onClick={() => {
        if (disabled) { return }
        let nextIndex = options.findIndex((option) => option.value === selectedOption.value) + 1
        if (nextIndex >= options.length) { nextIndex = 0 }
        onChange(options[nextIndex])
      }} {...props} />
  )
}
