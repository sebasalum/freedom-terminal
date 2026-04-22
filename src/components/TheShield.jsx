import React from 'react';
import { formatCurrency } from '../logic/financialMath';

const TheShield = ({ escudoEmergencia }) => {
  // El objetivo es 2,768,000 y se encuentra al 100% de capacidad
  const goal = 2768000;
  const percentage = Math.min((escudoEmergencia / goal) * 100, 100);

  return (
    <div className="border-2 border-white p-6 mb-8">
      <h2 className="text-xl mb-4 uppercase tracking-widest">[ The Shield ]</h2>
      <div className="flex justify-between mb-2 text-sm">
        <span>ESTADO: INTACTO</span>
        <span>{formatCurrency(escudoEmergencia)} / {formatCurrency(goal)}</span>
      </div>
      <div className="w-full border-2 border-white h-8 relative">
        <div 
          className="bg-white h-full transition-all duration-500 ease-in-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TheShield;
