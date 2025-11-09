import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Issue, IssueStatus } from '../../../types';
import { useBoardStore } from '../../../store/useBoardStore';
import { FilterBox } from '../components/FilterBox/index';
import { useFilter } from '../../../hooks/useFilter';
import dayjs from 'dayjs';
import { LabelValue } from '../../../components/LabelValue';
import { RecentlyAccessedModal } from '../components/RecentlyAccessedModal/index';
import { Button } from '../../../components/Button';
import { mockUpdateIssue } from '../../../utils/api';
import { toast } from 'react-toastify';
import { BoardColumns } from '../components/BoardColumns';
import styles from './boardView.module.css';

export const BoardView = () => {
  const navigate = useNavigate();
  const {
    issues,
    lastSyncTime,
    currentUser,
    updateIssue,
    addRecentlyAccessed,
    revertUpdatedIssue,
    addToUndoHistory,
    removeFromUndoHistory,
  } = useBoardStore();

  const { filteredIssues, onFilter } = useFilter({ issues });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    Backlog,
    'In Progress': InProgress,
    Done,
  } = useMemo(() => {
    return filteredIssues.reduce(
      (acc, issue) => {
        acc[issue.status].push(issue);
        return acc;
      },
      { Backlog: [], 'In Progress': [], Done: [] } as Record<IssueStatus, Issue[]>
    );
  }, [filteredIssues]);

  const handleUpdateIssue = async (updatedIssue: Issue) => {
    try {
      addToUndoHistory(issues.find(issue => issue.id === updatedIssue.id)!);
      updateIssue(updatedIssue);

      const response = await mockUpdateIssue(updatedIssue.id, updatedIssue);
      if (response) {
        toast.success(
          <div className={styles.toastContent}>
            Issue updated successfully.
            <Button
              variant='text'
              onClick={() => revertUpdatedIssue(updatedIssue.id)}
              className={styles.toastButton}
            >
              Revert
            </Button>
          </div>,
          {
            onClose: () => removeFromUndoHistory(updatedIssue.id),
            onClick: () => revertUpdatedIssue(updatedIssue.id),
          }
        );
      } else {
        throw new Error('Failed to update issue');
      }
    } catch (error) {
      toast.error(error as string);
      revertUpdatedIssue(updatedIssue.id);
    }
  };

  const handleIssueClick = (issue: Issue) => {
    addRecentlyAccessed(issue);
    navigate(`/issue/${issue.id}`);
  };

  return (
    <div>
      <div className={styles.header}>
        <LabelValue
          label='Last Sync Time'
          value={dayjs(lastSyncTime).format('MMMM D, YYYY hh:mm:ss A')}
        />
        <Button variant='secondary' onClick={() => setIsModalOpen(true)}>
          Recently Accessed
        </Button>
      </div>

      <FilterBox onFilterChange={onFilter} />
      <BoardColumns
        Backlog={Backlog}
        InProgress={InProgress}
        Done={Done}
        issues={issues}
        currentUser={currentUser}
        onIssueStatusChange={handleUpdateIssue}
        onIssueClick={handleIssueClick}
      />

      <RecentlyAccessedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
