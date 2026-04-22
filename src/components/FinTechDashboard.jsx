import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FinTechDashboard({ user }) {
  const [capitalHabitosAcumulado, setCapitalHabitosAcumulado] = useState(0);
  const [customAmount, setCustomAmount] = useState(0);
  const [capitalSideBAcumulado, setCapitalSideBAcumulado] = useState(0);
  const [sideBAmount, setSideBAmount] = useState('');
  const [sideBSource, setSideBSource] = useState('');
  const [simuladoSideBMensual, setSimuladoSideBMensual] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchFinanzas = async () => {
      // Promesas en paralelo para mayor velocidad
      const [habitosResponse, sideBResponse, historyResponse] = await Promise.all([
        supabase.from('habit_logs').select('amount').eq('user_id', user.id),
        supabase.from('side_b_logs').select('amount').eq('user_id', user.id),
        supabase.from('financial_snapshots').select('*').eq('user_id', user.id).order('recorded_at', { ascending: true })
      ]);

      if (habitosResponse.error) console.error('[ERROR HABITOS]:', habitosResponse.error);
      if (sideBResponse.error) console.error('[ERROR SIDE B]:', sideBResponse.error);

      // Calcular y setear Hábitos
      if (habitosResponse.data) {
        const totalHabitos = habitosResponse.data.reduce((sum, log) => sum + Number(log.amount), 0);
        setCapitalHabitosAcumulado(totalHabitos);
      }

      // Calcular y setear Side B
      if (sideBResponse.data) {
        const totalSideB = sideBResponse.data.reduce((sum, log) => sum + Number(log.amount), 0);
        setCapitalSideBAcumulado(totalSideB);
      }
      
      // Histórico
      if (historyResponse.data) {
        setHistory(historyResponse.data);
      }

      console.log(`[SYSTEM INIT]: Finanzas sincronizadas.`);
    };

    fetchFinanzas();
  }, []);

  // Nuevo Motor de Inserción Dinámico
  const logExtraSaving = async (amountToSave, descriptionText) => {
    const { data, error } = await supabase
      .from('habit_logs')
      .insert([
        { 
          user_id: user.id, // Tu ID de sesión
          amount: amountToSave, 
          description: descriptionText 
        }
      ]);

    if (error) {
      console.error('[SYSTEM ERROR]:', error);
    } else {
      console.log(`[SYSTEM UPDATE]: ${descriptionText} registrado. +$${amountToSave}`);
      
      // Actualizamos la UI en tiempo real
      setCapitalHabitosAcumulado(prevTotal => prevTotal + amountToSave);
    }
  };

  // Motor de Inserción: Tracción Comercial (Side B)
  const logSideBIncome = async () => {
    // 1. Verificación de campos
    if (!sideBAmount || !sideBSource) {
      alert('[SYSTEM HALT]: Debes especificar el ORIGEN y el MONTO.');
      return;
    }

    // 2. Verificación de sesión
    if (!user || !user.id) {
      alert('[CRITICAL ERROR]: El ID de sesión no está definido. Revisa las props del componente.');
      return;
    }

    const numericAmount = Number(sideBAmount);

    // 3. Intento de inyección
    const { data, error } = await supabase
      .from('side_b_logs')
      .insert([
        { 
          user_id: user.id, 
          amount: numericAmount, 
          source: sideBSource 
        }
      ]);

    if (error) {
      // 4. Muestra el error exacto de la base de datos en pantalla
      alert(`[DATABASE REJECTION]: ${error.message}`);
      console.error(error);
    } else {
      console.log(`[SYSTEM UPDATE]: Tracción comercial registrada. +$${numericAmount}`);
      setCapitalSideBAcumulado(prevTotal => prevTotal + numericAmount);
      setSideBAmount('');
      setSideBSource('');
    }
  };

  // --- VARIABLES CORE DEL SISTEMA ---
  const capitalInicial = 4232000;
  const aporteMensual = 245000;
  const tasaAnual = 0.08; // 8% Regla del 4% asume crecimiento ajustado o retorno seguro
  const anosProyeccion = 15;

  // --- ACTUALIZACIÓN DE LÓGICA DE NEGOCIO ---
  // Nuevo Target de Capital (Equivale a un flujo de $1,666,667/mes)
  const capitalObjetivoTotal = 500000000; 

  // --- MATEMÁTICA EN TIEMPO REAL ---
  
  // 1. Capital Base Dinámico (Lo que tienes + lo que has salvado)
  // Tu capital ahora es la suma de: Base + Disciplina (Hábitos) + Tracción Comercial (Side B)
  const capitalTotalActual = capitalInicial + capitalHabitosAcumulado + capitalSideBAcumulado;

  // 2. Days of Freedom (Días comprados)
  // ¿Cuánto flujo mensual me genera mi capital actual con la regla del 4%?
  const flujoMensualGenerado = (capitalTotalActual * 0.04) / 12;
  
  // La fórmula de Days of Freedom se ajusta automáticamente 
  // al usar este nuevo capitalObjetivoTotal en el denominador del costo por día.
  const metaFlujoMensualDerivada = (capitalObjetivoTotal * 0.04) / 12;
  const costoDiaLibertad = metaFlujoMensualDerivada / 30;
  const daysOfFreedom = flujoMensualGenerado / costoDiaLibertad;

  // 3. The Gap (Proyección vs Realidad)

  // Proyección a 15 años con Interés Compuesto (Fórmula de Valor Futuro)
  const rMensual = tasaAnual / 12;
  const nMeses = anosProyeccion * 12;
  
  // A. Lo que crecerá el capital que ya tengo
  const fvCapitalActual = capitalTotalActual * Math.pow(1 + rMensual, nMeses);
  // B. Lo que crecerán mis aportes mensuales constantes
  const fvAportes = aporteMensual * ((Math.pow(1 + rMensual, nMeses) - 1) / rMensual);
  
  const proyeccionTotal = fvCapitalActual + fvAportes;
  const brechaPendiente = capitalObjetivoTotal - proyeccionTotal;

  // --- SIMULADOR ESTRATÉGICO SIDE B ---
  // Calcular cuánto generará este ingreso simulado en 15 años al 8%
  const rMensualSimulador = tasaAnual / 12;
  const nMesesSimulador = anosProyeccion * 12;
  const proyeccionSimuladaSideB = simuladoSideBMensual * ((Math.pow(1 + rMensualSimulador, nMesesSimulador) - 1) / rMensualSimulador);
  
  // Brecha real actual (antes de la simulación)
  const brechaRealActual = capitalObjetivoTotal - proyeccionTotal;
  
  // Brecha restante después de aplicar la simulación
  const brechaRestanteSimulada = brechaRealActual - proyeccionSimuladaSideB;
  
  // Porcentaje de la brecha que cubre el simulador
  const porcentajeBrechaCubierta = Math.min((proyeccionSimuladaSideB / brechaRealActual) * 100, 100) || 0;

  const takeFinancialSnapshot = async () => {
    // Calculamos el capital consolidado en este instante
    const totalCapitalSnapshot = capitalInicial + capitalHabitosAcumulado + capitalSideBAcumulado;
    
    const { data, error } = await supabase
      .from('financial_snapshots')
      .insert([
        { 
          user_id: user.id, 
          total_capital: totalCapitalSnapshot,
          total_habit_savings: capitalHabitosAcumulado
        }
      ]);

    if (error) {
      alert(`[SNAPSHOT ERROR]: ${error.message}`);
    } else {
      alert('[SYSTEM UPDATE]: Instantánea financiera guardada con éxito.');
      // Aquí podrías disparar una función para recargar el gráfico histórico
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-mono p-8">
      {/* Log de Consola */}
      <div className="mb-8 border-b-2 border-white pb-2 flex justify-between items-end">
        <div>
          <p>[SYSTEM STATUS: OPERATIVE]</p>
          <p>[HABIT REPLACEMENT ACTIVE]</p>
        </div>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        
        {/* WIDGET: DAYS OF FREEDOM */}
        <div className="border-2 border-white p-6 flex flex-col justify-between">
          <h2 className="text-xl uppercase tracking-widest border-b-2 border-white pb-2 mb-4">
            [ Days of Freedom ]
          </h2>
          <div>
            <p className="text-sm mb-2 text-gray-400">// Días comprados de por vida</p>
            <p className="text-6xl font-bold">
              {daysOfFreedom.toFixed(2)} <span className="text-2xl">DÍAS</span>
            </p>
          </div>
          <div className="mt-4 text-xs">
            <p>Capital Activo: ${capitalTotalActual.toLocaleString('es-AR')}</p>
            <p>Flujo Pasivo Generado: ${flujoMensualGenerado.toLocaleString('es-AR', { maximumFractionDigits: 0 })}/mes</p>
          </div>
        </div>

        {/* WIDGET: THE GAP VISUALIZER */}
        <div className="border-2 border-white p-6 flex flex-col justify-between h-full">
          <h2 className="text-xl uppercase tracking-widest border-b-2 border-white pb-2 mb-6">
            [ The Gap Analysis ]
          </h2>
          
          <div className="space-y-6">
            {/* Métricas Crudas */}
            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <p className="text-gray-400">// TARGET FINAL</p>
                <p className="text-xl font-bold">${capitalObjetivoTotal.toLocaleString('es-AR')}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">// PROYECCIÓN PASIVA</p>
                <p className="text-xl">${proyeccionTotal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>

            {/* Barra Brutalista (Gráfico CSS) */}
            <div className="w-full h-12 border-2 border-white flex relative bg-black">
              {/* Bloque 1: Proyección Pasiva (Blanco sólido) */}
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${Math.min((proyeccionTotal / capitalObjetivoTotal) * 100, 100)}%` }}
              ></div>
              
              {/* El Vacío se representa por el fondo negro natural del contenedor */}
              
              {/* Marcador de Brecha en texto superpuesto */}
              <div className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none mix-blend-difference">
                <span className="text-white font-bold tracking-widest uppercase text-xs">
                  BRECHA: ${(capitalObjetivoTotal - proyeccionTotal).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Directiva de Acción */}
            <div className="border-t-2 border-dashed border-gray-600 pt-4 mt-4">
              <p className="text-xs text-gray-400 mb-2">// DIRECTIVA DE ESCALABILIDAD</p>
              <p className="text-sm font-bold uppercase">
                Requiere inyección sostenida vía SIDE B para colapsar la brecha del {( ( (capitalObjetivoTotal - proyeccionTotal) / capitalObjetivoTotal ) * 100 ).toFixed(1)}%.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* PANEL DE INYECCIÓN OPTIMIZADO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        
        {/* COLUMNA 1: ACCIÓN RÁPIDA (1/3 del espacio) */}
        <div className="md:col-span-1">
          <button 
            onClick={() => logExtraSaving(4166, 'Hábito de derroche evitado')}
            className="w-full h-full border-2 border-white bg-black text-white p-6 uppercase tracking-wider hover:bg-white hover:text-black transition-none cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <span className="text-xs text-gray-400 font-mono">// Gatillo Diario</span>
            <span className="text-3xl font-bold">+$4,166</span>
            <span className="text-[10px] text-center opacity-70">RESCATE DE HÁBITO BASE</span>
          </button>
        </div>

        {/* COLUMNA 2: CONTROL MAESTRO (2/3 del espacio) */}
        <div className="md:col-span-2 border-2 border-white p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b-2 border-white pb-2 mb-6">
            <h2 className="text-xl uppercase tracking-widest">[ Freno Impulsivo ]</h2>
            <div className="flex items-center bg-white text-black px-3 py-1 font-bold">
              <span className="mr-1">$</span>
              <input 
                type="number" 
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="bg-transparent border-none outline-none w-24 text-right font-mono"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <input 
              type="range" 
              min="0" 
              max="200000" 
              step="1000"
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full h-4 bg-black appearance-none cursor-pointer border-2 border-white accent-white"
            />
            
            <div className="flex justify-between text-[10px] uppercase text-gray-500 font-mono">
              <span>Min: $0</span>
              <span>Max: $200,000</span>
            </div>

            <button 
              onClick={() => logExtraSaving(customAmount, 'Inyección personalizada')}
              className="w-full border-2 border-white bg-black text-white py-4 uppercase font-bold hover:bg-white hover:text-black transition-none"
            >
              [ Ejecutar Inyección de Capital ]
            </button>
          </div>
        </div>
      </div>

      {/* PANEL DE TRACCIÓN COMERCIAL (SIDE B) */}
      <div className="border-2 border-white p-6 mt-8 bg-black">
        <h2 className="text-xl uppercase tracking-widest border-b-2 border-white pb-2 mb-6">
          [ Tracción Comercial : Side B ]
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controles de Ingreso de Datos */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1 font-mono">// ORIGEN DEL CAPITAL (Ej: Auditoría SVC, Venta Dyneema)</label>
              <input 
                type="text" 
                value={sideBSource}
                onChange={(e) => setSideBSource(e.target.value.toUpperCase())}
                placeholder="PROYECTO / PRODUCTO"
                className="w-full bg-transparent border-2 border-white p-3 text-white uppercase outline-none focus:bg-gray-900 font-bold tracking-wider transition-none"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1 font-mono">// MONTO FACTURADO (ARS)</label>
              <div className="flex border-2 border-white focus-within:bg-gray-900 transition-none">
                <span className="p-3 border-r-2 border-white font-bold">$</span>
                <input 
                  type="number" 
                  value={sideBAmount}
                  onChange={(e) => setSideBAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent p-3 text-white outline-none font-bold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Gatillo de Ejecución */}
          <div className="flex flex-col justify-end">
            <button 
              onClick={logSideBIncome}
              className="w-full h-full min-h-[80px] border-2 border-white bg-white text-black text-xl uppercase font-bold hover:bg-black hover:text-white hover:border-white transition-none cursor-pointer flex flex-col items-center justify-center space-y-1"
            >
              <span>[ REGISTRAR INGRESO ]</span>
              <span className="text-xs font-mono text-gray-500 hover:text-gray-400">// IMPACTAR DIRECTO EN THE GAP</span>
            </button>
          </div>
        </div>
      </div>

      {/* SIMULADOR ESTRATÉGICO SIDE B */}
      <div className="border-2 border-white p-6 mt-8 bg-black">
        <div className="flex justify-between items-center border-b-2 border-white pb-2 mb-6">
          <div>
            <h2 className="text-xl uppercase tracking-widest">[ Simulador de Escala : Side B ]</h2>
            <p className="text-xs text-gray-500 font-mono mt-1">// Proyección a 15 años (8% anual) vs Brecha Actual</p>
          </div>
          <div className="flex items-center bg-white text-black px-3 py-1 font-bold">
            <span className="mr-1">$</span>
            <input 
              type="number" 
              value={simuladoSideBMensual}
              onChange={(e) => setSimuladoSideBMensual(Number(e.target.value))}
              className="bg-transparent border-none outline-none w-32 text-right font-mono"
            />
            <span className="ml-2 text-xs font-mono">/ MES</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Slider de Simulación */}
          <input 
            type="range" 
            min="0" 
            max="2000000" 
            step="50000"
            value={simuladoSideBMensual}
            onChange={(e) => setSimuladoSideBMensual(Number(e.target.value))}
            className="w-full h-4 bg-black appearance-none cursor-pointer border-2 border-white accent-white"
          />
          
          <div className="flex justify-between text-[10px] uppercase text-gray-500 font-mono">
            <span>Mín: $0 / mes</span>
            <span>Máx: $2,000,000 / mes</span>
          </div>

          {/* Impacto Visual en la Brecha */}
          <div className="mt-6 border-t-2 border-dashed border-gray-600 pt-6">
            <div className="flex justify-between text-sm font-mono mb-2">
              <span className="text-gray-400">// IMPACTO EN LA BRECHA</span>
              <span className="font-bold text-white">{porcentajeBrechaCubierta.toFixed(1)}% CUBIERTO</span>
            </div>
            
            <div className="w-full h-8 border-2 border-white flex relative bg-black">
              {/* Barra de cobertura simulada */}
              <div 
                className="h-full bg-gray-500 transition-all duration-300"
                style={{ width: `${porcentajeBrechaCubierta}%` }}
              ></div>
            </div>

            <div className="flex justify-between mt-4 font-mono">
              <div className="text-xs text-gray-400">
                <p>// CAPITAL FUTURO GENERADO</p>
                <p className="text-lg text-white font-bold">+ ${proyeccionSimuladaSideB.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="text-xs text-gray-400 text-right">
                <p>// BRECHA RESIDUAL</p>
                <p className={`text-lg font-bold ${brechaRestanteSimulada <= 0 ? 'text-white' : 'text-white'}`}>
                  {brechaRestanteSimulada <= 0 ? 'OBJETIVO SUPERADO' : `$ ${brechaRestanteSimulada.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WIDGET: HISTORICAL PULSE */}
      <div className="border-2 border-white p-6 mt-8 bg-black">
        <h2 className="text-xl uppercase tracking-widest border-b-2 border-white pb-2 mb-6">
          [ Trajectory Pulse : Snapshots ]
        </h2>
        
        {history.length > 1 ? (
          <div className="w-full relative flex flex-col">
            {/* Gráfico SVG con altura controlada */}
            <svg 
              className="w-full h-48 overflow-visible"
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="white"
                strokeWidth="2"
                points={history.map((s, i) => {
                  const x = (i / (history.length - 1)) * 1000;
                  const y = 200 - (Math.min(s.total_capital / 500000000, 1) * 200);
                  return `${x},${y}`;
                }).join(' ')}
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
            </svg>
            
            {/* Texto con margen superior ajustado para no chocar */}
            <div className="flex justify-between text-[10px] text-gray-400 mt-6 uppercase font-mono pb-2">
              <span>Inicio: {new Date(history[0].recorded_at).toLocaleDateString()}</span>
              <span className="text-white">Progreso Real hacia $500M</span>
              <span>Actual: {new Date(history[history.length - 1].recorded_at).toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-800">
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">
              [ Insuficientes datos históricos para renderizar pulso ]
            </p>
          </div>
        )}
      </div>

      {/* SECCIÓN DE SNAPSHOTS */}
      <div className="border-2 border-white p-6 mt-8 flex justify-between items-center bg-black">
        <div>
          <h2 className="text-xl uppercase tracking-widest">[ Protocolo de Captura ]</h2>
          <p className="text-xs text-gray-500 font-mono mt-1">// Guarda el estado actual de tu patrimonio en el histórico.</p>
        </div>
        
        <button 
          onClick={takeFinancialSnapshot}
          className="border-2 border-white bg-black text-white px-8 py-3 uppercase font-bold hover:bg-white hover:text-black transition-none cursor-pointer"
        >
          [ Tomar Snapshot ]
        </button>
      </div>

    </div>
  );
}
