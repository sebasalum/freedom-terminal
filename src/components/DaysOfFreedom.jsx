import React from 'react';
import { calculateDaysOfFreedom } from '../logic/financialMath';

const DaysOfFreedom = ({ capitalInicial, capitalHabitosAcumulado, metaFlujoMensual }) => {
  const days = calculateDaysOfFreedom(capitalInicial, capitalHabitosAcumulado, metaFlujoMensual);
  
  return (
    <div className="border-2 border-white p-6 mb-8 text-center">
      <h2 className="text-xl mb-6 uppercase tracking-widest">[ Days of Freedom ]</h2>
      <div className="text-6xl md:text-8xl font-bold mb-4">
        {days.toFixed(2)}
      </div>
      <p className="text-sm uppercase tracking-widest">Días de libertad financiados por mes</p>
    </div>
  );
};

export default DaysOfFreedom;
