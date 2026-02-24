// Este archivo contiene datos mock para testing y desarrollo
// En producción, todos los datos vienen de Supabase

export const mockSensors = [];
export const mockAlerts = [];
export const mockIncidents = [];
export const mockReadings = [];
export const dam_status = {};
export const mockDams = [];
export const mockMaintenanceStats = {
  totalOrders: 0,
  completed: 0,
  inProgress: 0,
  pending: 0,
  preventivo: {
    pendientes: 0,
    completadas: 0,
    canceladas: 0
  },
  correctivo: {
    pendientes: 0,
    completadas: 0,
    canceladas: 0
  }
};
export const mockMaintenanceByMonth = [];
export const preventiveScheduleData = [];
export const scheduleTypeLegend = [
  { type: 'Anual', color: '#0066A1' },
  { type: 'Semestral', color: '#4A90E2' },
  { type: 'Trimestral', color: '#7FB3D5' },
  { type: 'Mensual', color: '#A8C6E0' },
];

export const generateSensorHistory = () => [];
export const dam_sensors = [];
export const getSensorById = () => null;
