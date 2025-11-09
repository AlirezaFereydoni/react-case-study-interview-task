import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={classNames(styles.button, styles[variant], className)}
    >
      {children}
    </button>
  );
};

