export const calculateDaysOfFreedom = (capitalInicial, capitalHabitosAcumulado, metaFlujoMensual) => {
  // Aplicamos la regla del 4%
  const totalCapital = capitalInicial + capitalHabitosAcumulado;
  const flujoMensualGenerado = (totalCapital * 0.04) / 12;
  const gastoDiarioObjetivo = metaFlujoMensual / 30;
  
  return flujoMensualGenerado / gastoDiarioObjetivo;
};

export const calculateProjection = (capitalInicial, capitalHabitosAcumulado, aporteMensual) => {
  const years = 15;
  const annualRate = 0.08;
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  
  let currentCapital = capitalInicial + capitalHabitosAcumulado;
  
  // Future Value of an Initial Sum + Future Value of an Annuity (monthly contributions)
  const fvCapital = currentCapital * Math.pow(1 + monthlyRate, months);
  
  let fvAportes = 0;
  if (monthlyRate > 0) {
    fvAportes = aporteMensual * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  } else {
    fvAportes = aporteMensual * months;
  }
  
  return fvCapital + fvAportes;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
};
