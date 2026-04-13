/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Exams from './pages/Exams';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import Results from './pages/Results';
import AdminPanel from './pages/AdminPanel';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/exams" element={
        <ProtectedRoute>
          <Layout><Exams /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/exam/:examId" element={
        <ProtectedRoute>
          <ExamPage />
        </ProtectedRoute>
      } />
      
      <Route path="/results" element={
        <ProtectedRoute>
          <Layout><Results /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/result/:resultId" element={
        <ProtectedRoute>
          <Layout><ResultPage /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Layout><AdminPanel /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

