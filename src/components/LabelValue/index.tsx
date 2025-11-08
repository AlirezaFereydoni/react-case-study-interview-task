import { Caption, Label } from '../Typography/index';
import styles from './LabelValue.module.css';

interface LabelValueProps {
  label: string;
  value: string;
}

export const LabelValue = ({ label, value }: LabelValueProps) => {
  return (
    <div className={styles.container}>
      <Caption>{label}:</Caption>
      <Label>{value}</Label>
    </div>
  );
};

