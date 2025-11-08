import styles from './Typography.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Caption = ({ children, className }: Props) => {
  return <p className={`${styles.caption} ${className || ''}`}>{children}</p>;
};

export const Label = ({ children, className }: Props) => {
  return <p className={`${styles.label} ${className || ''}`}>{children}</p>;
};

export const Heading = ({ children, className }: Props) => {
  return <h3 className={`${styles.heading} ${className || ''}`}>{children}</h3>;
};

