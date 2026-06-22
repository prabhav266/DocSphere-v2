import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 w-full">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
