import styles from './Tag.module.css';

interface TagProps {
  title: string;
}

export const Tag = ({ title }: TagProps) => {
  return <div className={styles.tag}>{title}</div>;
};
