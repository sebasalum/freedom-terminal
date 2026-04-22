import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAccess = async (action) => {
    setLoading(true);
    let result;
    
    if (action === 'LOGIN') {
      result = await supabase.auth.signInWithPassword({ email, password });
    } else {
      result = await supabase.auth.signUp({ email, password });
    }

    const { error } = result;

    if (error) {
      console.error('[SECURITY BREACH]:', error.message);
      alert(`[ERROR]: ${error.message}`);
    } else {
      console.log(`[SYSTEM ACCESS]: ${action} SUCCESSFUL`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4">
      <div className="border-2 border-white p-8 w-full max-w-md">
        <h1 className="text-2xl uppercase tracking-widest border-b-2 border-white pb-4 mb-6">
          [ SYSTEM AUTHENTICATION ]
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">// IDENTIFIER (EMAIL)</label>
            <input 
              type="email" 
              className="w-full bg-black border-2 border-white p-2 text-white outline-none focus:bg-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">// SECURITY KEY (PASSWORD)</label>
            <input 
              type="password" 
              className="w-full bg-black border-2 border-white p-2 text-white outline-none focus:bg-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => handleAccess('LOGIN')}
              disabled={loading}
              className="flex-1 border-2 border-white bg-black text-white py-2 uppercase hover:bg-white hover:text-black transition-none"
            >
              [ LOGIN ]
            </button>
            <button 
              onClick={() => handleAccess('REGISTER')}
              disabled={loading}
              className="flex-1 border-2 border-white bg-black text-white py-2 uppercase hover:bg-white hover:text-black transition-none"
            >
              [ REGISTER ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
