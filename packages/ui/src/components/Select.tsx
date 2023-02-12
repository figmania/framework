import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { Icon, Icons } from './Icon'
import styles from './Select.module.scss'

export interface SelectOption {
  value: string
  title: string
  icon?: Icons
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  icon?: Icons
  options: SelectOption[]
  placeholder: string
  isDisabled?: boolean
  value?: string | number | boolean
  onToggleMenu?: (showMenu: boolean) => void
  onChange?: (option: SelectOption) => void
}

export interface SelectState {
  showMenu: boolean
  selectedOption?: SelectOption
}

export const Select: FunctionComponent<SelectProps> = ({ value, className, options, placeholder, isDisabled, icon, onToggleMenu, onChange, ...props }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value === value))

  const selectedIcon = selectedOption?.icon ?? icon
  const selectedTitle = selectedOption?.title ?? placeholder

  const toggleMenu = (val: boolean) => {
    setShowMenu(val)
    onToggleMenu?.(val)
  }

  useEffect(() => {
    const option = options.find((entry) => entry.value === value)
    if (option !== selectedOption) { setSelectedOption(option) }
  }, [value])

  return (
    <OutsideClickHandler onOutsideClick={() => { toggleMenu(false) }} disabled={!showMenu}>
      <div className={clsx(styles['select'], className)} {...props}>
        <button type="button" className={clsx(styles['select-button'], selectedIcon ? styles['with-icon'] : styles['without-icon'])} onClick={() => {
          if (isDisabled) { return }
          toggleMenu(!showMenu)
        }} onFocus={() => {
          if (isDisabled) { return }
          toggleMenu(true)
        }} onBlur={() => {
          toggleMenu(false)
        }} disabled={isDisabled} title={selectedTitle}>
          {(selectedIcon) && (<Icon icon={selectedIcon} mute></Icon>)}
          <div className={styles['select-label']}>{selectedOption?.title ?? placeholder}</div>
          <div className={styles['select-caret']}></div>
        </button>
        <div className={clsx(styles['select-menu'], showMenu && styles['select-menu-active'])}>
          {options.map((option, index) => (
            <div className={clsx(styles['select-item'], selectedOption && selectedOption.value === option.value && styles['select-item-selected'])} onMouseDown={() => {
              setSelectedOption(option)
              onChange?.(option)
              toggleMenu(false)
            }} key={`select-option-${index}`} title={option.title}>
              <div className={styles['select-item-icon']}></div>
              <div className={styles['select-item-label']}>{option.title}</div>
            </div>
          ))}
        </div>
      </div>
    </OutsideClickHandler>
  )
}
