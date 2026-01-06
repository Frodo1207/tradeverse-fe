import React, { createContext, useContext, useState } from 'react';
import TransactionModal from '../components/ui/TransactionModal';
import { walletService } from '../services/api';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';

const TransactionModalContext = createContext(null);

export const TransactionModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('deposit');
    const { assets, refreshBalance } = useUser();
    const { success, error } = useToast();

    const openModal = (modalType) => {
        setType(modalType);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleTransaction = async (amount, currency) => {
        try {
            if (type === 'deposit') {
                await walletService.deposit(amount, currency);
                success(`Successfully deposited ${amount} ${currency}`);
            } else {
                await walletService.withdraw(amount, currency);
                success(`Successfully withdrew ${amount} ${currency}`);
            }
            // Refresh Global Balance
            await refreshBalance();

            // We don't close automatically here to let user see success or maybe they want to do another?
            // Actually usually we close on success.
            closeModal();

        } catch (err) {
            console.error("Transaction failed:", err);
            error("Transaction failed: " + (err.response?.data?.error || err.message));
        }
    };

    return (
        <TransactionModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <TransactionModal
                isOpen={isOpen}
                onClose={closeModal}
                type={type}
                onConfirm={handleTransaction}
                currencies={Array.isArray(assets) ? assets.map(a => a.currency) : []}
            />
        </TransactionModalContext.Provider>
    );
};

export const useTransactionModal = () => {
    const context = useContext(TransactionModalContext);
    if (!context) {
        throw new Error('useTransactionModal must be used within a TransactionModalProvider');
    }
    return context;
};
