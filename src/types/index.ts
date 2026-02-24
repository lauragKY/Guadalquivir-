export type UserRole = 'admin' | 'technician' | 'operator' | 'consultation';

export type DamType = 'Gravedad' | 'Arco' | 'Bóveda' | 'Arco-Gravedad' | 'Contrafuertes';

export type OperationalStatus = 'operational' | 'maintenance' | 'alert' | 'emergency' | 'warning';

export type EmergencyType = 'structural' | 'hydrological' | 'seismic' | 'operational' | 'environmental';

export type EmergencySeverity = 'low' | 'medium' | 'high' | 'critical';

export type EmergencyStatus = 'detection' | 'evaluation' | 'activation' | 'management' | 'resolution' | 'closed';

export type PlanType = 'evacuation' | 'structural' | 'hydrological';

export type PlanStatus = 'active' | 'outdated' | 'under_review';

export type SensorType = 'piezometer' | 'inclinometer' | 'extensometer' | 'flowmeter' | 'accelerometer' | 'weather_station';

export type SensorStatus = 'active' | 'inactive' | 'maintenance' | 'fault';

export type AlertLevel = 'normal' | 'caution' | 'alert' | 'critical';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  organization: string;
  phone: string | null;
  active: boolean;
  created_at: string;
}

export interface Dam {
  id: string;
  name: string;
  code: string;
  dam_type: DamType;
  province: string;
  municipality: string;
  river: string;
  max_capacity: number;
  capacity_hm3: number;
  current_level: number;
  current_volume: number;
  operational_status: OperationalStatus;
  height: number;
  coordinates: string;
  created_at: string;
}

export interface Emergency {
  id: string;
  dam_id: string;
  code: string;
  title: string;
  description: string | null;
  emergency_type: EmergencyType;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  responsible_id: string | null;
  detected_at: string;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  dam?: Dam;
  responsible?: UserProfile;
}

export interface EmergencyPlan {
  id: string;
  dam_id: string;
  title: string;
  description: string | null;
  plan_type: PlanType;
  last_review: string;
  next_review: string;
  status: PlanStatus;
  created_at: string;
  updated_at: string;
  dam?: Dam;
}

export interface Sensor {
  id: string;
  dam_id: string;
  name: string;
  sensor_type: SensorType;
  location: string;
  unit: string;
  status: SensorStatus;
  threshold_normal: number;
  threshold_caution: number;
  threshold_alert: number;
  threshold_critical: number;
  created_at: string;
  dam?: Dam;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  value: number;
  alert_level: AlertLevel;
  timestamp: string;
  sensor?: Sensor;
}

export interface DashboardStats {
  totalDams: number;
  operationalDams: number;
  damsInAlert: number;
  damsInEmergency: number;
  activeEmergencies: number;
  criticalEmergencies: number;
  totalSensors: number;
  sensorsInAlert: number;
  avgReservoirLevel: number;
}

export type WorkOrderType = 'preventive' | 'corrective';

export type WorkOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface WorkOrder {
  id: string;
  dam_id: string;
  code: string;
  title: string;
  description: string | null;
  order_type: WorkOrderType;
  status: WorkOrderStatus;
  priority: 'low' | 'medium' | 'high';
  scheduled_date: string;
  completed_date: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface DamParameter {
  name: string;
  value: string | number;
  unit?: string;
}

export type InventoryItemType = 'asset' | 'area' | 'line' | 'equipment';

export type InventoryStatus = 'active' | 'inactive' | 'maintenance' | 'retired';

export interface InventoryItem {
  id: string;
  dam_id: string;
  parent_id: string | null;
  code: string;
  name: string;
  description: string | null;
  extended_description: string | null;
  item_type: InventoryItemType;
  photos: string[];
  technical_data: Record<string, any>;
  general_data: Record<string, any>;
  category: string | null;
  status: InventoryStatus;
  created_at: string;
  updated_at: string;
  dam?: Dam;
  children?: InventoryItem[];
}

export type MaintenanceType = 'preventive' | 'corrective';

export type MaintenancePeriodicity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'biennial';

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export interface MaintenanceActivity {
  id: string;
  dam_id: string;
  inventory_item_id: string | null;
  code: string;
  name: string;
  description: string | null;
  activity_type: MaintenanceType;
  category: string | null;
  periodicity: MaintenancePeriodicity | null;
  estimated_duration: number;
  created_at: string;
  updated_at: string;
  dam?: Dam;
  inventory_item?: InventoryItem;
}

export interface MaintenanceWorkOrder {
  id: string;
  dam_id: string;
  activity_id: string | null;
  equipment_id?: string | null;
  code: string;
  title: string;
  description: string | null;
  order_type: MaintenanceType;
  status: WorkOrderStatus;
  priority: MaintenancePriority;
  scheduled_date: string | null;
  scheduled_month: number | null;
  scheduled_year: number | null;
  started_at: string | null;
  completed_at: string | null;
  assigned_to: string | null;
  created_by: string | null;
  is_closed?: boolean;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;
  dam?: Dam;
  activity?: MaintenanceActivity;
  assigned_user?: UserProfile;
  created_user?: UserProfile;
  report?: MaintenanceReport;
}

export interface MaintenanceReport {
  id: string;
  work_order_id: string;
  performed_by: string;
  performed_at: string;
  duration_minutes: number;
  observations: string | null;
  issues_found: string | null;
  corrective_actions: string | null;
  materials_used: any[];
  next_actions_required: string | null;
  created_at: string;
  updated_at: string;
  work_order?: MaintenanceWorkOrder;
  performer?: UserProfile;
}

export type DocumentStatus = 'draft' | 'approved' | 'archived' | 'obsolete';

export type DocumentAction = 'view' | 'download' | 'upload' | 'update' | 'delete';

export interface DocumentFolder {
  id: string;
  dam_id: string;
  parent_id: string | null;
  name: string;
  description: string | null;
  folder_type: string | null;
  path: string;
  created_at: string;
  updated_at: string;
  dam?: Dam;
  parent?: DocumentFolder;
  children?: DocumentFolder[];
  documents?: TechnicalDocument[];
}

export interface TechnicalDocument {
  id: string;
  dam_id: string;
  folder_id: string | null;
  code: string | null;
  name: string;
  description: string | null;
  document_type: string;
  file_name: string;
  file_size: number;
  file_url: string | null;
  mime_type: string | null;
  version: string;
  status: DocumentStatus;
  metadata: Record<string, any>;
  uploaded_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
  dam?: Dam;
  folder?: DocumentFolder;
  uploader?: UserProfile;
  approver?: UserProfile;
}

export interface DocumentAccessLog {
  id: string;
  document_id: string;
  user_id: string;
  action: DocumentAction;
  accessed_at: string;
  document?: TechnicalDocument;
  user?: UserProfile;
}

export type DataSource = 'manual' | 'excel_import' | 'damdata_sync' | 'automatic';

export type ImportType = 'excel' | 'manual';

export type ImportStatus = 'processing' | 'completed' | 'failed';

export interface AuscultationReading {
  id: string;
  sensor_id: string;
  dam_id: string;
  reading_value: number;
  reading_date: string;
  alert_level: AlertLevel;
  data_source: DataSource;
  imported_by: string | null;
  import_batch_id: string | null;
  notes: string | null;
  metadata: Record<string, any>;
  created_at: string;
  sensor?: Sensor;
  dam?: Dam;
  importer?: UserProfile;
}

export interface AuscultationImportBatch {
  id: string;
  batch_id: string;
  dam_id: string;
  import_type: ImportType;
  file_name: string | null;
  total_records: number;
  successful_records: number;
  failed_records: number;
  status: ImportStatus;
  imported_by: string;
  error_log: any[];
  created_at: string;
  completed_at: string | null;
  dam?: Dam;
  importer?: UserProfile;
}

export type FloodRiskLevel = 'normal' | 'watch' | 'warning' | 'alert' | 'emergency';

export interface ExploitationSystem {
  id: string;
  code: string;
  name: string;
  description: string | null;
  director_id: string | null;
  created_at: string;
  updated_at: string;
  director?: UserProfile;
}

export interface ExploitationZone {
  id: string;
  code: string;
  name: string;
  description: string | null;
  system_id: string | null;
  created_at: string;
  updated_at: string;
  system?: ExploitationSystem;
}

export interface ExploitationDailyData {
  id: string;
  dam_id: string;
  date: string;

  water_level: number;
  stored_volume: number;
  surface_area: number;
  useful_volume: number;

  inflow_total: number;
  outflow_total: number;

  outflow_supply: number;
  outflow_hydroelectric: number;
  outflow_ecological: number;
  outflow_irrigation: number;
  outflow_other: number;

  evaporation: number;
  rainfall: number;

  air_temperature: number | null;
  water_temperature: number | null;

  flood_risk_level: FloodRiskLevel;
  flood_risk_notes: string | null;

  observations: string | null;
  registered_by: string;
  verified_by: string | null;
  verified_at: string | null;

  created_at: string;
  updated_at: string;

  dam?: Dam;
  registrar?: UserProfile;
  verifier?: UserProfile;
}
