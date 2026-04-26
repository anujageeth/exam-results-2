import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const StudentLayout = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StudentLayout;
