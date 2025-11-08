import { create } from 'zustand';
import { Issue, User } from '../types';
import { currentUser } from '../constants/currentUser';

interface BoardState {
  currentUser: User;
  issues: Issue[];
  lastSyncTime: Date;
  recentlyAccessed: Issue[];
  undoHistory: Record<Issue['id'], Issue>;
  pollingInterval: number;
}

interface BoardActions {
  setIssues: (issues: Issue[]) => void;
  updateIssue: (updatedIssue: Issue) => void;
  addRecentlyAccessed: (recentlyAccessedIssue: Issue) => void;
  addToUndoHistory: (updatedIssue: Issue) => void;
  removeFromUndoHistory: (issueId: Issue['id']) => void;
  revertUpdatedIssue: (issueId: Issue['id']) => void;
  initializeRecentlyAccessed: () => void;
  switchUserRole: (role: User['role']) => void;
  setPollingInterval: (interval: number) => void;
}

export const useBoardStore = create<BoardState & BoardActions>(set => ({
  currentUser: currentUser,
  issues: [],
  lastSyncTime: new Date(),
  recentlyAccessed: [],
  undoHistory: {},
  pollingInterval: 10000,
  switchUserRole: role =>
    set({
      currentUser: { ...currentUser, role },
    }),
  setPollingInterval: interval => set({ pollingInterval: interval }),
  setIssues: issues => set({ issues, lastSyncTime: new Date() }),
  updateIssue: updatedIssue =>
    set(state => ({
      issues: state.issues.map(prevIssue =>
        updatedIssue.id === prevIssue.id ? updatedIssue : prevIssue
      ),
    })),

  addToUndoHistory: updatedIssue =>
    set(state => ({
      undoHistory: { ...state.undoHistory, [updatedIssue.id]: updatedIssue },
    })),

  removeFromUndoHistory: issueId =>
    set(state => {
      const newUndoHistory = { ...state.undoHistory };
      delete newUndoHistory[issueId];
      return { undoHistory: newUndoHistory };
    }),

  revertUpdatedIssue: issueId =>
    set(state => {
      const revertedIssue = state.undoHistory[issueId];
      if (!revertedIssue) return state;

      state.removeFromUndoHistory(issueId);

      return {
        issues: state.issues.map(prevIssue =>
          revertedIssue.id === prevIssue.id ? revertedIssue : prevIssue
        ),
      };
    }),

  initializeRecentlyAccessed: () =>
    set(() => {
      const recentlyAccessed = localStorage.getItem('recentlyAccessed');
      return { recentlyAccessed: recentlyAccessed ? JSON.parse(recentlyAccessed) : [] };
    }),

  addRecentlyAccessed: recentlyAccessedIssue =>
    set(state => {
      const newRecentlyAccessed = [...state.recentlyAccessed];
      const existingIssueIndex = newRecentlyAccessed.findIndex(
        issue => issue.id === recentlyAccessedIssue.id
      );

      if (existingIssueIndex !== -1) {
        newRecentlyAccessed.splice(existingIssueIndex, 1);
      }
      newRecentlyAccessed.unshift(recentlyAccessedIssue);

      if (newRecentlyAccessed.length > 5) {
        newRecentlyAccessed.pop();
      }

      localStorage.setItem('recentlyAccessed', JSON.stringify(newRecentlyAccessed));
      return { recentlyAccessed: newRecentlyAccessed };
    }),
}));
