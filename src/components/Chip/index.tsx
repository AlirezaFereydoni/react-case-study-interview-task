import styles from './Chip.module.css';
import classNames from 'classnames';

type ChipVariant =
  | 'statusBacklog'
  | 'statusInProgress'
  | 'statusDone'
  | 'priorityLow'
  | 'priorityMedium'
  | 'priorityHigh';

interface ChipProps {
  title: string;
  variant: ChipVariant;
}

export const Chip = ({ title, variant }: ChipProps) => {
  return <div className={classNames(styles.chip, styles[variant])}>{title}</div>;
};
