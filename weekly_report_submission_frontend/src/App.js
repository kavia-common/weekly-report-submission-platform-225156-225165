import React, { useEffect, useState } from 'react';
import './index.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Submit } from './pages/Submit';
import { FormHistory } from './pages/FormHistory';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-6">
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header session={session} signOut={signOut} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/submit"
          element={session ? <Submit /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/history"
          element={session ? <FormHistory /> : <Navigate to="/login" replace />}
        />
        <Route path="/" element={<Navigate to="/submit" replace />} />
        <Route path="*" element={<Navigate to="/submit" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
