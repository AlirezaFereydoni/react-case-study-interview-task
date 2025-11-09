import React from 'react';
import { Heading } from '../Typography/index';
import { Button } from '../Button';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {title && (
          <div className={styles.header}>
            <Heading>{title}</Heading>
            <Button variant='text' onClick={onClose} className={styles.closeButton}>
              x
            </Button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

