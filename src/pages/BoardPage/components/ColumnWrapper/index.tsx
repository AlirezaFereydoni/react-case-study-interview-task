import { useDroppable } from '@dnd-kit/core';
import { IssueStatus } from '../../../../types';
import styles from './ColumnWrapper.module.css';
import classNames from 'classnames';

interface ColumnWrapperProps {
  id: IssueStatus;
  title: string;
  children: React.ReactNode;
}

export const ColumnWrapper = ({ id, title, children }: ColumnWrapperProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const statusVariant = id === 'Backlog' ? 'statusBacklog' : id === 'In Progress' ? 'statusInProgress' : 'statusDone';

  return (
    <div
      ref={setNodeRef}
      className={classNames(styles.column, styles[statusVariant], { [styles.columnOver]: isOver })}
    >
      <h2 className={styles.title}>
        {title}
      </h2>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

