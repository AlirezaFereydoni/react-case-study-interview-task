import React from 'react';
import styles from './Input.module.css';
import classNames from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={classNames(styles.input, className)}
    />
  );
};

