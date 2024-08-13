import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import MessageManager from './components/MessageManager.jsx';
import SessionManager from './components/SessionManager.jsx';
// import ClientManager from './components/ClientManager.jsx';
import ReminderManager from './components/ReminderManager.jsx';

import MainLayout from './components/MainLayout.jsx';

const rootElement = document.getElementById('root');
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <SessionManager />
      },
      {
        path: '/message',
        element: <MessageManager />
      },
      {
        path: '/reminder',
        element: <ReminderManager />
      },
    ]
  }
]);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
