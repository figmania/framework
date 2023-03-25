import clsx from 'clsx'
import { FunctionComponent, HTMLAttributes, useEffect, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { Icon, ICON } from '../Icon/Icon'
import styles from './Select.module.scss'

export interface SelectOption {
  value: string
  label: string
  icon?: ICON
}

export interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  icon?: ICON
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  value?: string | number | boolean
  onToggleMenu?: (showMenu: boolean) => void
  onChange?: (option: SelectOption) => void
}

export interface SelectState {
  showMenu: boolean
  selectedOption?: SelectOption
}

export const Select: FunctionComponent<SelectProps> = ({ value, className, options, placeholder, disabled, icon, onToggleMenu, onChange, ...props }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options.find((option) => option.value === value))

  const selectedIcon = selectedOption?.icon ?? icon
  const selectedLabel = selectedOption?.label ?? placeholder

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
        <button type="button" className={clsx(styles['button'], selectedIcon ? styles['with-icon'] : styles['without-icon'])} onClick={() => {
          if (disabled) { return }
          toggleMenu(!showMenu)
        }} onFocus={() => {
          if (disabled) { return }
          toggleMenu(true)
        }} onBlur={() => {
          toggleMenu(false)
        }} disabled={disabled}>
          {(selectedIcon) && (<Icon icon={selectedIcon}></Icon>)}
          <div className={styles['label']}>{selectedLabel}</div>
          <svg className={styles['caret']} width="8" height="7" viewBox="0 0 8 7"><path d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z" fillRule="evenodd" fill="currentColor" /></svg>
        </button>
        <div className={clsx(styles['menu'], showMenu && styles['menu-active'])}>
          {options.map((option, index) => (
            <div className={clsx(styles['menu-item'], selectedOption && selectedOption.value === option.value && styles['menu-item-selected'])} onMouseDown={() => {
              setSelectedOption(option)
              onChange?.(option)
              toggleMenu(false)
            }} key={`option-${index}`}>
              <div className={styles['menu-item-icon']}></div>
              <div className={styles['menu-item-label']}>{option.label}</div>
            </div>
          ))}
        </div>
      </div>
    </OutsideClickHandler>
  )
}
