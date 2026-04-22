import React from 'react';
import { formatCurrency } from '../logic/financialMath';

const HabitSubstitution = ({ capitalHabitosAcumulado, onAddHabit }) => {
  return (
    <div className="border-2 border-white p-6 mb-8">
      <h2 className="text-xl mb-4 uppercase tracking-widest">[ Habit Substitution ]</h2>
      <div className="mb-6">
        <p className="text-sm mb-2">CAPITAL RECUPERADO DE DERROCHE:</p>
        <p className="text-3xl font-bold">{formatCurrency(capitalHabitosAcumulado)}</p>
      </div>
      <button 
        onClick={onAddHabit}
        className="w-full bg-black text-white border-2 border-white py-4 text-lg font-bold uppercase transition-colors duration-200 hover:bg-white hover:text-black focus:outline-none"
      >
        + Registrar Día Sin Derroche ($4,166)
      </button>
    </div>
  );
};

export default HabitSubstitution;
