import { useBoardStore } from '../../../../store/useBoardStore';
import { Modal } from '../../../../components/Modal';
import { IssueCard } from '../../../../components/IssueCard';
import { useEffect } from 'react';
import styles from './RecentlyAccessedModal.module.css';

interface RecentlyAccessedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecentlyAccessedModal = ({ isOpen, onClose }: RecentlyAccessedModalProps) => {
  const { recentlyAccessed, initializeRecentlyAccessed } = useBoardStore();

  useEffect(() => {
    if (recentlyAccessed.length === 0) {
      initializeRecentlyAccessed();
    }
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Recently Accessed Issues'>
      {recentlyAccessed.length > 0 ? (
        <div className={styles.list}>
          {recentlyAccessed.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No recently accessed issues</div>
      )}
    </Modal>
  );
};

