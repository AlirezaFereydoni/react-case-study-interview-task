import { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import { Issue } from '../../types';
import { useBoardStore } from '../../store/useBoardStore';
import { mockUpdateIssue } from '../../utils/api';
import dayjs from 'dayjs';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { Tag } from '../../components/Tag';
import { LabelValue } from '../../components/LabelValue';
import { Caption } from '../../components/Typography/index';
import { toast } from 'react-toastify';
import { UpdateIssueModal } from './components/UpdateIssueModal';
import styles from './index.module.css';

export const IssueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: issues, loading, error } = useFetch<Issue[]>({ url: 'issues' });
  const {
    issues: storeIssues,
    currentUser,
    setIssues,
    updateIssue,
    addRecentlyAccessed,
    addToUndoHistory,
    revertUpdatedIssue,
    removeFromUndoHistory,
  } = useBoardStore();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (issues && storeIssues.length === 0) {
      setIssues(issues);
    }
  }, [issues, storeIssues.length, setIssues]);

  const issue = useMemo(() => {
    if (!id) return null;
    return storeIssues.find(i => i.id === id);
  }, [id, storeIssues]);

  useEffect(() => {
    if (issue) {
      addRecentlyAccessed(issue);
    }
  }, [issue, addRecentlyAccessed]);

  const handleMarkAsResolved = async () => {
    if (!issue || currentUser.role !== 'admin') return;

    try {
      addToUndoHistory(issue);
      const updatedIssue: Issue = { ...issue, status: 'Done' };
      updateIssue(updatedIssue);

      const response = await mockUpdateIssue(updatedIssue.id, updatedIssue);
      if (response) {
        toast.success('Issue marked as resolved successfully.');
      } else {
        throw new Error('Failed to update issue');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to mark issue as resolved');
      revertUpdatedIssue(issue.id);
    }
  };

  const handleUpdateIssue = async (updatedIssue: Issue) => {
    if (!issue || currentUser.role !== 'admin') return;

    try {
      addToUndoHistory(issue);
      updateIssue(updatedIssue);
      addRecentlyAccessed(updatedIssue);

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

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Loading issue details...</div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className={styles.error}>
        <div className={styles.errorMessage}>{error?.message || `Issue #${id} not found`}</div>
        <Button onClick={() => navigate('/board')}>Back to Board</Button>
      </div>
    );
  }

  const isAdmin = currentUser.role === 'admin';
  const isResolved = issue.status === 'Done';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Button variant='text' onClick={() => navigate('/board')}>
            ← Back to Board
          </Button>
          {isAdmin && (
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className={styles.updateButton}
              aria-label='Update issue'
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
                <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
              </svg>
            </button>
          )}
        </div>
        <h3 className={styles.title}>{issue.title}</h3>
        <div className={styles.meta}>
          <Chip
            title={issue.status}
            variant={
              issue.status === 'Backlog'
                ? 'statusBacklog'
                : issue.status === 'In Progress'
                ? 'statusInProgress'
                : 'statusDone'
            }
          />
          <Chip
            title={issue.priority}
            variant={
              `priority${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}` as
                | 'priorityLow'
                | 'priorityMedium'
                | 'priorityHigh'
            }
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.sectionTitle}>Details</div>
        <div className={styles.detailsGrid}>
          <LabelValue label='Issue ID' value={issue.id} />
          <LabelValue label='Assignee' value={issue.assignee} />
          <LabelValue label='Severity' value={issue.severity.toString()} />
          <LabelValue
            label='Created At'
            value={dayjs(issue.createdAt).format('dddd, MMMM D, YYYY h:mm A')}
          />
          {issue.userDefinedRank !== undefined && (
            <LabelValue label='User Defined Rank' value={issue.userDefinedRank.toString()} />
          )}
        </div>

        {issue.tags.length > 0 && (
          <div className={styles.tagsSection}>
            <div className={styles.tagsLabel}>
              <Caption>Tags:</Caption>
            </div>
            <div className={styles.tagsContainer}>
              {issue.tags.map((tag, index) => (
                <Tag key={`${issue.id}-tag-${index}`} title={tag} />
              ))}
            </div>
          </div>
        )}

        {isAdmin && !isResolved && (
          <div className={styles.actions}>
            <Button onClick={handleMarkAsResolved}>Mark as Resolved</Button>
          </div>
        )}
      </div>

      {issue && (
        <UpdateIssueModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          issue={issue}
          onUpdate={handleUpdateIssue}
        />
      )}
    </div>
  );
};
