import { useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Issue } from '../../types';
import { BoardView } from './boardView';
import { useBoardStore } from '../../store/useBoardStore';
import styles from './index.module.css';

export const BoardPage = () => {
  const { pollingInterval, setIssues } = useBoardStore();
  const { data, error, loading } = useFetch<Issue[]>({
    url: 'issues',
    pollingInterval,
  });

  useEffect(() => {
    if (data) {
      setIssues(data);
    }
  }, [data, setIssues]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }
  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <BoardView />
    </div>
  );
};
