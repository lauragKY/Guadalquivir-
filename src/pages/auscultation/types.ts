// ─── Types for the Auscultation module ───────────────────────────────────────

export type Screen =
  | 'dashboard'
  | 'variables'
  | 'variable_detail'
  | 'evaluation'
  | 'config'
  | 'alerts'
  | 'emergency_comm'
  | 'validation'
  | 'trends'
  | 'historic'
  | 'audit'
  | 'data_quality';

export type VarStatus = 'normal' | 'extraordinary' | 'scenario_0' | 'scenario_1' | 'incoherent' | 'no_data';
export type AlertStatus = 'pending' | 'sent' | 'confirmed' | 'rejected';
export type EventType =
  | 'data_received'
  | 'threshold_calculated'
  | 'extraordinary_detected'
  | 'scenario_0_proposed'
  | 'scenario_1_proposed'
  | 'alert_sent'
  | 'emergency_comm'
  | 'manual_validation'
  | 'activation_rejected'
  | 'data_blocked'
  | 'formula_modified'
  | 'manual_data_entry'
  | 'data_incoherent';

export type UserRole = 'admin' | 'director' | 'technician' | 'supervisor' | 'consultant';
export type DataSource = 'DAMDATA' | 'SAIH' | 'Manual';
export type SensorType = 'Caudalímetro' | 'Piezómetro' | 'Termómetro' | 'Inclinómetro' | 'Extensómetro' | 'Pluviómetro';

export interface CriticalVariable {
  id: string;
  code: string;
  name: string;
  sensor_code: string;
  sensor_type: SensorType;
  unit: string;
  current_value: number;
  current_ne: number | null;
  source: DataSource;
  last_reading: string;
  status: VarStatus;
  recommended_action: string;
  formula_se: string;
  formula_e0: string;
  threshold_se: number | null;
  threshold_e0: number | null;
  is_blocked: boolean;
  has_manual_data: boolean;
  trend: number[];
  trend_dates: string[];
  ne_trend: number[];
}

export interface ThresholdAlert {
  id: string;
  date: string;
  variable_id: string;
  variable_name: string;
  measured_value: number;
  threshold_value: number;
  formula: string;
  proposed_status: VarStatus;
  recipient: string;
  alert_status: AlertStatus;
  decision_user?: string;
  decision_date?: string;
  decision_reason?: string;
  emergency_comm_sent: boolean;
}

export interface FormulaVersion {
  version: number;
  formula_se: string;
  formula_e0: string;
  user: string;
  date: string;
  reason: string;
  approved: boolean;
}

export interface HistoricEvent {
  id: string;
  date: string;
  time: string;
  variable: string;
  event_type: EventType;
  user: string;
  result: string;
  reason: string;
}

export interface AuditEntry {
  id: string;
  date: string;
  time: string;
  action: string;
  user: string;
  result: string;
  reason: string;
  hash: string;
}

export interface DataQualityIssue {
  id: string;
  variable_id: string;
  variable_name: string;
  issue_type: 'not_received' | 'incoherent' | 'out_of_range' | 'dependent_error';
  original_value: number | null;
  corrected_value: number | null;
  user: string;
  date: string;
  reason: string;
  resolved: boolean;
}
