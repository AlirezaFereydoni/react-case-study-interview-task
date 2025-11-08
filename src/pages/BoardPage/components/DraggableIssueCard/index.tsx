import { useDraggable } from '@dnd-kit/core';
import { useRef } from 'react';
import { Issue } from '../../../../types';
import { IssueCard } from '../../../../components/IssueCard';
import styles from './DraggableIssueCard.module.css';
import classNames from 'classnames';

interface DraggableIssueCardProps {
  id: string;
  issue: Issue;
  isDragging?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const DraggableIssueCard = ({
  id,
  issue,
  isDragging,
  disabled = false,
  onClick,
}: DraggableIssueCardProps) => {
  const draggableResult = useDraggable({
    id,
    disabled: isDragging === true || disabled,
  });

  const { attributes, listeners, setNodeRef, isDragging: isDraggingState } = draggableResult;
  const pointerDownTimeRef = useRef<number | null>(null);
  const pointerDownEventRef = useRef<React.PointerEvent | null>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDragEnabledRef = useRef(false);

  if (isDragging) {
    return (
      <div className={styles.dragging}>
        <IssueCard issue={issue} />
      </div>
    );
  }

  const wrapperClassName = classNames(styles.wrapper, {
    [styles.wrapperDisabled]: disabled,
    [styles.wrapperDragging]: isDraggingState,
    [styles.wrapperGrab]: !disabled && !isDraggingState,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownTimeRef.current = Date.now();
    pointerDownEventRef.current = e;
    isDragEnabledRef.current = false;

    dragTimeoutRef.current = setTimeout(() => {
      if (listeners?.onPointerDown && pointerDownEventRef.current) {
        isDragEnabledRef.current = true;
        listeners.onPointerDown(pointerDownEventRef.current);
      }
    }, 100);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragEnabledRef.current && listeners?.onPointerMove) {
      listeners.onPointerMove(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }

    if (isDragEnabledRef.current && listeners?.onPointerUp) {
      listeners.onPointerUp(e);
      isDragEnabledRef.current = false;
      pointerDownTimeRef.current = null;
      pointerDownEventRef.current = null;
      return;
    }

    if (pointerDownTimeRef.current && onClick) {
      const timeDifference = Date.now() - pointerDownTimeRef.current;
      if (timeDifference < 100) {
        onClick();
      }
    }

    pointerDownTimeRef.current = null;
    pointerDownEventRef.current = null;
    isDragEnabledRef.current = false;
  };

  if (disabled) {
    return (
      <div className={wrapperClassName} onClick={onClick}>
        <IssueCard issue={issue} />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={wrapperClassName}
      {...attributes}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <IssueCard issue={issue} />
    </div>
  );
};

