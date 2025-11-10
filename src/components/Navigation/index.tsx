import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Button';
import { useBoardStore } from '../../store/useBoardStore';
import { LabelValue } from '../LabelValue';
import { useTheme } from '../../hooks/useTheme';
import styles from './Navigation.module.css';

export const Navigation = () => {
  const { currentUser, switchUserRole } = useBoardStore();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav}>
      <div className={styles.links}>
        <Link to='/board' className={styles.link}>
          Board
        </Link>
        <Link to='/settings' className={styles.link}>
          Settings
        </Link>
      </div>
      <div className={styles.rightSection}>
        <Button variant='text' onClick={toggleTheme} className={styles.themeButton}>
          {theme === 'light' ? '🌙' : '☀️'}
        </Button>
        <LabelValue label='User' value={currentUser.name} />
        <LabelValue label='Role' value={currentUser.role} />
        <Button
          onClick={() => switchUserRole(currentUser.role === 'admin' ? 'contributor' : 'admin')}
        >
          Switch to {currentUser.role === 'admin' ? 'Contributor' : 'Admin'}
        </Button>
      </div>
    </nav>
  );
};

