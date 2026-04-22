import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Auth from './components/Auth';
import FinTechDashboard from './components/FinTechDashboard';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Verificar si ya hay una sesión activa al abrir la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios (login, logout, registro)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Si no hay sesión, mostramos la terminal de Auth
  if (!session) {
    return <Auth />;
  }

  // Si hay sesión, pasamos los datos del usuario al Dashboard
  return <FinTechDashboard user={session.user} />;
}
