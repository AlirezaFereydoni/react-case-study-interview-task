import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';
import reportWebVitals from './reportWebVitals';
import { App } from './App';
import { useTheme } from './hooks/useTheme';

const ThemeProvider = () => {
  useTheme();
  return <App />;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider />
  </React.StrictMode>
);
reportWebVitals();
