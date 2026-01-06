import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ id, type = 'info', message, onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
        success: <CheckCircle className="text-green-400" size={24} />,
        error: <XCircle className="text-red-400" size={24} />,
        warning: <AlertCircle className="text-yellow-400" size={24} />,
        info: <Info className="text-cyan-400" size={24} />
    };

    const colors = {
        success: 'border-green-500/20 bg-green-500/10',
        error: 'border-red-500/20 bg-red-500/10',
        warning: 'border-yellow-500/20 bg-yellow-500/10',
        info: 'border-cyan-500/20 bg-cyan-500/10'
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`flex items-center gap-4 p-4 rounded-xl border backdrop-blur-md shadow-lg min-w-[300px] max-w-md pointer-events-auto ${colors[type]}`}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1">
                <p className="text-white font-medium text-sm">{message}</p>
            </div>
            <button
                onClick={() => onClose(id)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
};

export default Toast;
