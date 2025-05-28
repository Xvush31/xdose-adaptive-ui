import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (import.meta.env.DEV) {
  import('@axe-core/react').then(({ default: axe }) => {
    import('react-dom').then((ReactDOM) => {
      axe(React, ReactDOM, 1000);
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
