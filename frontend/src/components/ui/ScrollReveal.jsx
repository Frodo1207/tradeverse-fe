import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({ children, delay = 0, className = "", width = "fit-content" }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay }}
            className={className}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
