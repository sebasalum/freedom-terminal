import React from 'react';
import { calculateProjection, formatCurrency } from '../logic/financialMath';

const TheGap = ({ capitalInicial, capitalHabitosAcumulado, aporteMensual }) => {
  const futureValue = calculateProjection(capitalInicial, capitalHabitosAcumulado, aporteMensual);
  const targetCapital = 1500000000;
  
  // Para el gráfico visual
  const projectionPercentage = Math.min((futureValue / targetCapital) * 100, 100);

  return (
    <div className="border-2 border-white p-6 mb-8">
      <h2 className="text-xl mb-6 uppercase tracking-widest">[ The Gap ]</h2>
      
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>PROYECCIÓN 15 AÑOS (8% Anual)</span>
          <span>{formatCurrency(futureValue)}</span>
        </div>
        <div className="w-full border-2 border-white h-12 relative flex items-center">
          <div 
            className="bg-white h-full" 
            style={{ width: `${projectionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <span>CAPITAL OBJETIVO (Regla 4%)</span>
          <span>{formatCurrency(targetCapital)}</span>
        </div>
        <div className="w-full border-2 border-white h-12 relative flex items-center">
          <div className="bg-white h-full w-full"></div>
        </div>
      </div>

      <div className="border-t-2 border-white pt-6 mt-4">
        <p className="text-lg font-bold uppercase mb-2">BRECHA CRÍTICA DETECTADA</p>
        <p className="text-sm">
          La proyección actual no alcanza el capital objetivo de {formatCurrency(targetCapital)}. 
          Es imperativo escalar los ingresos a través del proyecto secundario (Side B) para cerrar The Gap.
        </p>
      </div>
    </div>
  );
};

export default TheGap;
