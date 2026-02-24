import {
  EmergencySeverity,
  EmergencyStatus,
  OperationalStatus,
  AlertLevel,
  SensorStatus,
} from '../../types';

interface StatusBadgeProps {
  status: EmergencySeverity | EmergencyStatus | OperationalStatus | AlertLevel | SensorStatus;
  type: 'severity' | 'emergency' | 'operational' | 'alert' | 'sensor';
}

const severityConfig: Record<EmergencySeverity, { label: string; className: string }> = {
  critical: { label: 'Crítica', className: 'bg-red-100 text-red-800 border-red-300' },
  high: { label: 'Alta', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  medium: { label: 'Media', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  low: { label: 'Baja', className: 'bg-green-100 text-green-800 border-green-300' },
};

const emergencyConfig: Record<EmergencyStatus, { label: string; className: string }> = {
  detection: { label: 'Detección', className: 'bg-sipresas-lightest text-sipresas-primary border-sipresas-lighter' },
  evaluation: { label: 'Evaluación', className: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  activation: { label: 'Activación', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  management: { label: 'Gestión', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  resolution: { label: 'Resolución', className: 'bg-lime-100 text-lime-800 border-lime-300' },
  closed: { label: 'Cerrada', className: 'bg-gray-100 text-gray-800 border-gray-300' },
};

const operationalConfig: Record<OperationalStatus, { label: string; className: string }> = {
  operational: { label: 'Operativa', className: 'bg-green-100 text-green-800 border-green-300' },
  maintenance: { label: 'Mantenimiento', className: 'bg-sipresas-lightest text-sipresas-primary border-sipresas-lighter' },
  alert: { label: 'Alerta', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  emergency: { label: 'Emergencia', className: 'bg-red-100 text-red-800 border-red-300' },
  warning: { label: 'Advertencia', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
};

const alertConfig: Record<AlertLevel, { label: string; className: string }> = {
  normal: { label: 'Normal', className: 'bg-green-100 text-green-800 border-green-300' },
  caution: { label: 'Precaución', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  alert: { label: 'Alerta', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  critical: { label: 'Crítico', className: 'bg-red-100 text-red-800 border-red-300' },
};

const sensorConfig: Record<SensorStatus, { label: string; className: string }> = {
  active: { label: 'Activo', className: 'bg-green-100 text-green-800 border-green-300' },
  inactive: { label: 'Inactivo', className: 'bg-slate-100 text-slate-800 border-slate-300' },
  maintenance: { label: 'Mantenimiento', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  fault: { label: 'Fallo', className: 'bg-red-100 text-red-800 border-red-300' },
};

export function StatusBadge({ status, type }: StatusBadgeProps) {
  let config;
  let label;
  let className;

  switch (type) {
    case 'severity':
      config = severityConfig[status as EmergencySeverity];
      break;
    case 'emergency':
      config = emergencyConfig[status as EmergencyStatus];
      break;
    case 'operational':
      config = operationalConfig[status as OperationalStatus];
      break;
    case 'alert':
      config = alertConfig[status as AlertLevel];
      break;
    case 'sensor':
      config = sensorConfig[status as SensorStatus];
      break;
  }

  label = config?.label || status;
  className = config?.className || 'bg-slate-100 text-slate-800 border-slate-300';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {label}
    </span>
  );
}
