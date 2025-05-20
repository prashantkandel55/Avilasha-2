import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../state/store';
import { FiHome, FiPieChart, FiDollarSign, FiTrendingUp, FiGrid, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isCollapsed, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-avilasha-500/20 text-avilasha-500' 
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }
      `}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="flex items-center"
      >
        <span className="text-xl">{icon}</span>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="ml-3 font-medium"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
      
      {isActive && !isCollapsed && (
        <motion.div
          className="ml-auto h-2 w-2 rounded-full bg-avilasha-500"
          layoutId="activeIndicator"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </NavLink>
  );
};

const Navigation: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useAppSelector(state => state.auth.user);

  const navItems = [
    { to: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/portfolio', icon: <FiPieChart />, label: 'Portfolio' },
    { to: '/token-explorer', icon: <FiTrendingUp />, label: 'Token Explorer' },
    { to: '/wallet', icon: <FiDollarSign />, label: 'Wallet' },
    { to: '/nfts', icon: <FiGrid />, label: 'NFTs' },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 240 }}
        animate={{ width: isCollapsed ? 80 : 240 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col h-screen bg-dark-900 border-r border-gray-800 sticky top-0 z-30"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center"
              >
                <img src="/logo.svg" alt="Avilasha Logo" className="h-8 w-8" />
                <span className="ml-2 text-xl font-bold text-white">Avilasha</span>
              </motion.div>
            ) : (
              <motion.div
                key="small-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <img src="/logo.svg" alt="Avilasha Logo" className="h-8 w-8" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCollapse}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
          >
            {isCollapsed ? <FiMenu /> : <FiX />}
          </motion.button>
        </div>

        <div className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
          <nav className="px-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-avilasha-500 flex items-center justify-center text-white">
                <FiUser />
              </div>
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3"
              >
                <p className="text-sm font-medium text-white">{user?.email || 'User'}</p>
                <NavLink to="/logout" className="text-xs text-gray-400 hover:text-avilasha-500 flex items-center mt-1">
                  <FiLogOut className="mr-1" size={12} />
                  Logout
                </NavLink>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-dark-900 border-b border-gray-800 sticky top-0 z-30">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <img src="/logo.svg" alt="Avilasha Logo" className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-white">Avilasha</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-dark-900/95 backdrop-blur-sm"
          >
            <div className="flex flex-col h-full pt-20 pb-6 px-4">
              <nav className="flex-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isCollapsed={false}
                    onClick={closeMobileMenu}
                  />
                ))}
              </nav>
              <div className="mt-auto border-t border-gray-800 pt-4">
                <div className="flex items-center p-2">
                  <div className="h-10 w-10 rounded-full bg-avilasha-500 flex items-center justify-center text-white">
                    <FiUser />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{user?.email || 'User'}</p>
                    <NavLink 
                      to="/logout" 
                      className="text-xs text-gray-400 hover:text-avilasha-500 flex items-center mt-1"
                      onClick={closeMobileMenu}
                    >
                      <FiLogOut className="mr-1" size={12} />
                      Logout
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
