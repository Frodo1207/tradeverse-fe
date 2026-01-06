import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import './i18n';
import { ToastProvider } from './contexts/ToastContext';

import { TransactionModalProvider } from './contexts/TransactionModalContext';
import { UserProvider } from './contexts/UserContext';
import { WalletProvider } from './contexts/WalletContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <UserProvider>
        <WalletProvider>
          <TransactionModalProvider>
            <App />
          </TransactionModalProvider>
        </WalletProvider>
      </UserProvider>
    </ToastProvider>
  </StrictMode>,
)
