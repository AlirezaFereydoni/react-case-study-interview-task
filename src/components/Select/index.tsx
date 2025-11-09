import React, { useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import styles from './Select.module.css';
import classNames from 'classnames';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  value: string;
}

export const Select = ({ options, placeholder, onChange, className, value }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside<HTMLDivElement | null>(containerRef, () => setIsOpen(false));

  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder || '';

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(styles.select, className, {
          [styles.selectPlaceholder]: !value,
        })}
      >
        <span>{displayValue}</span>
        <div className={styles.controls}>
          {value && (
            <span
              className={styles.clearButton}
              onClick={e => {
                e.stopPropagation();
                onChange('');
              }}
            >
              X
            </span>
          )}
          <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
        </div>
      </div>
      {isOpen && (
        <div className={styles.dropdown}>
          {options.map(option => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={classNames(styles.option, {
                [styles.optionSelected]: value === option.value,
              })}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

