
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import TrackWalletModal from '@/components/TrackWalletModal';
import AvilashaAssistant from '@/components/AvilashaAssistant';
import { useToast } from '@/hooks/use-toast';

const MainLayout = () => {
  const [trackWalletOpen, setTrackWalletOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const location = useLocation();
  
  // Handle page title and notifications on route change
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    const pageName = path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';
    document.title = `${pageName} | Avilasha Crypto`;
    
    // Show welcome toast on first load
    if (path === '' && !localStorage.getItem('welcomed')) {
      setTimeout(() => {
        toast({
          title: "Welcome to Avilasha",
          description: "Your comprehensive crypto portfolio tracker",
        });
        localStorage.setItem('welcomed', 'true');
      }, 1000);
    }
  }, [location, toast]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header onTrackWallet={() => setTrackWalletOpen(true)} />
      <Sidebar />
      
      <main className={`transition-all duration-300 ml-60 pt-16 min-h-screen`}>
        <div className="container py-6 px-4 lg:px-6 mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
      
      <TrackWalletModal
        open={trackWalletOpen}
        onClose={() => {
          setTrackWalletOpen(false);
          toast({
            title: "Wallet Tracked",
            description: "Your wallet has been successfully tracked",
          });
        }}
      />
      
      {/* Avilasha AI Assistant */}
      <AvilashaAssistant />
    </div>
  );
};

export default MainLayout;
