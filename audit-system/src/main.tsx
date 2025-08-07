import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Set document direction to RTL for Arabic
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'ar';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);