import { useState, useEffect } from 'react';
import { Issue, IssuePriority } from '../../../../types';
import { Modal } from '../../../../components/Modal';
import { Select } from '../../../../components/Select';
import { Button } from '../../../../components/Button';
import { LabelValue } from '../../../../components/LabelValue';
import styles from './UpdateIssueModal.module.css';

interface UpdateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: Issue;
  onUpdate: (updatedIssue: Issue) => void;
}

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const rankOptions = Array.from({ length: 10 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString(),
}));

export const UpdateIssueModal = ({ isOpen, onClose, issue, onUpdate }: UpdateIssueModalProps) => {
  const [priority, setPriority] = useState<IssuePriority>(issue.priority);
  const [userDefinedRank, setUserDefinedRank] = useState<string>(
    issue.userDefinedRank?.toString() || ''
  );

  useEffect(() => {
    if (isOpen) {
      setPriority(issue.priority);
      setUserDefinedRank(issue.userDefinedRank?.toString() || '');
    }
  }, [issue, isOpen]);

  const handleSubmit = () => {
    const updatedIssue: Issue = {
      ...issue,
      priority,
      userDefinedRank: userDefinedRank ? parseInt(userDefinedRank, 10) : undefined,
    };
    onUpdate(updatedIssue);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Update Issue'>
      <div className={styles.form}>
        <div>
          <LabelValue label='Title' value={issue.title} />
        </div>

        <div>
          <label className={styles.field}>Priority</label>
          <Select
            options={priorityOptions}
            value={priority}
            onChange={value => setPriority(value as IssuePriority)}
            placeholder='Select priority'
          />
        </div>

        <div>
          <label className={styles.field}>User Defined Rank (1-10)</label>
          <Select
            options={rankOptions}
            value={userDefinedRank}
            onChange={setUserDefinedRank}
            placeholder='Select rank'
          />
        </div>

        <div className={styles.actions}>
          <Button variant='secondary' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='primary' onClick={handleSubmit}>
            Update
          </Button>
        </div>
      </div>
    </Modal>
  );
};

