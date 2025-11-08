import { useState } from 'react';
import { Issue, IssueStatus, User } from '../../../../types';
import { DraggableIssueCard } from '../DraggableIssueCard';
import { ColumnWrapper } from '../ColumnWrapper';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
} from '@dnd-kit/core';
import styles from './BoardColumns.module.css';

interface BoardColumnsProps {
  Backlog: Issue[];
  InProgress: Issue[];
  Done: Issue[];
  issues: Issue[];
  currentUser: User;
  onIssueStatusChange: (updatedIssue: Issue) => void;
  onIssueClick: (issue: Issue) => void;
}

export const BoardColumns = ({
  Backlog,
  InProgress,
  Done,
  issues,
  currentUser,
  onIssueStatusChange,
  onIssueClick,
}: BoardColumnsProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const isAdmin = currentUser.role === 'admin';

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const issueId = active.id as string;
    const newStatus = over.id as IssueStatus;

    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    if (issue.status !== newStatus) {
      onIssueStatusChange({ ...issue, status: newStatus });
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.grid}>
        <ColumnWrapper
          id='Backlog'
          title='Backlog'
        >
          {Backlog.map(issue => (
            <DraggableIssueCard
              key={issue.id}
              id={issue.id}
              issue={issue}
              disabled={!isAdmin}
              onClick={() => onIssueClick(issue)}
            />
          ))}
        </ColumnWrapper>

        <ColumnWrapper
          id='In Progress'
          title='In Progress'
        >
          {InProgress.map(issue => (
            <DraggableIssueCard
              key={issue.id}
              id={issue.id}
              issue={issue}
              disabled={!isAdmin}
              onClick={() => onIssueClick(issue)}
            />
          ))}
        </ColumnWrapper>

        <ColumnWrapper
          id='Done'
          title='Done'
        >
          {Done.map(issue => (
            <DraggableIssueCard
              key={issue.id}
              id={issue.id}
              issue={issue}
              disabled={!isAdmin}
              onClick={() => onIssueClick(issue)}
            />
          ))}
        </ColumnWrapper>
      </div>
      <DragOverlay>
        {activeId ? (
          <DraggableIssueCard
            issue={issues.find(i => i.id === activeId)!}
            id={activeId}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

