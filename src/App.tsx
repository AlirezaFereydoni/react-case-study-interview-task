
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { BoardPage } from './pages/BoardPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { SettingsPage } from './pages/SettingPage';
import { Navigation } from './components/Navigation';

export const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/board' element={<BoardPage />} />
        <Route path='/issue/:id' element={<IssueDetailPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='*' element={<Navigate to='/board' />} />
      </Routes>
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
};
