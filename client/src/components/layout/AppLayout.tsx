import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dark-950">
      <Navigation />
      
      <motion.main 
        className="flex-1 p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default AppLayout;
