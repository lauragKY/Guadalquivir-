export type Screen =
  | 'dashboard'
  | 'viewer'
  | 'alerts'
  | 'models'
  | 'integrations'
  | 'simulation'
  | 'historic'
  | 'audit';

export type ElementStatus =
  | 'operational'
  | 'revision_pending'
  | 'failure'
  | 'threshold_exceeded'
  | 'no_data';

export type ElementCategory =
  | 'structure'
  | 'organ'
  | 'sensor'
  | 'instrumentation'
  | 'electrical'
  | 'access'
  | 'mechanical'
  | 'safety';

export type ModelFormat = 'IFC' | 'RVT' | 'DWG' | 'FBX' | 'glTF' | 'NWD';

export type ModelState = 'pending' | 'processing' | 'optimized' | 'published' | 'obsolete';

export type LayerKey =
  | 'inventory'
  | 'maintenance'
  | 'exploitation'
  | 'auscultation'
  | 'electrical'
  | 'safety'
  | 'alerts';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type AlertSource =
  | 'maintenance'
  | 'exploitation'
  | 'auscultation'
  | 'inventory'
  | 'archive';

export type UserRole =
  | 'viewer'
  | 'maintenance_tech'
  | 'auscultation_tech'
  | 'director'
  | 'bim_admin'
  | 'sipresas_admin';

export type DamGlobalStatus = 'normal' | 'extraordinary' | 'scenario_0';

export type IntegrationStatus = 'connected' | 'synced' | 'pending' | 'error';

export interface BimElement {
  id: string;
  code: string;
  uuid: string;
  name: string;
  category: ElementCategory;
  asset_type: string;
  location: string;
  status: ElementStatus;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  module_origin: string;
  last_updated: string;
  description: string;
  // SVG placement
  x: number;
  y: number;
  width: number;
  height: number;
  svgType: 'rect' | 'ellipse' | 'polygon';
  points?: string;
  layers: LayerKey[];
  // Inventory
  inventory_ref?: string;
  inv_type?: string;
  inv_manufacturer?: string;
  inv_model?: string;
  inv_serial?: string;
  inv_install_date?: string;
  inv_location_func?: string;
  // Maintenance
  maint_status?: string;
  maint_last_date?: string;
  maint_last_pdf?: string;
  maint_last_pdf_name?: string;
  maint_next_date?: string;
  maint_open_incidents?: number;
  maint_total_parts?: number;
  // Exploitation
  expl_status?: string;
  // Auscultation
  ausc_variable?: string;
  ausc_value?: string;
  ausc_unit?: string;
  ausc_threshold_se?: string;
  ausc_threshold_e0?: string;
  ausc_status?: string;
  ausc_source?: string;
  ausc_trend?: number[];
  ausc_trend_dates?: string[];
  // Archive
  archive_docs?: ArchiveDoc[];
  // Historic
  historic?: ElementHistoricEvent[];
}

export interface ArchiveDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  critical: boolean;
  path: string;
}

export interface ElementHistoricEvent {
  id: string;
  date: string;
  time: string;
  user: string;
  role: UserRole;
  module: string;
  action: string;
  result: string;
}

export interface BimModel {
  id: string;
  dam: string;
  name: string;
  description: string;
  format_original: ModelFormat;
  format_optimized?: ModelFormat;
  state: ModelState;
  version: string;
  version_date: string;
  size_original_mb: number;
  size_optimized_mb?: number;
  elements_count: number;
  author: string;
  published_by?: string;
  published_date?: string;
  saih_sync: boolean;
  last_sync?: string;
  changes_summary?: string;
  archive_path: string;
}

export interface BimAlert {
  id: string;
  date: string;
  time: string;
  element_id: string;
  element_name: string;
  source: AlertSource;
  severity: AlertSeverity;
  title: string;
  description: string;
  recommendation: string;
  resolved: boolean;
  assigned_to?: string;
  resolved_date?: string;
  resolved_by?: string;
}

export interface ModuleIntegration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  last_sync?: string;
  events_received: IntegrationEvent[];
  elements_linked: number;
  docs_linked?: number;
}

export interface IntegrationEvent {
  id: string;
  date: string;
  time: string;
  event_type: string;
  description: string;
  element?: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  affected_elements: string[];
  status_change: Record<string, ElementStatus>;
  dam_status?: DamGlobalStatus;
  warning_message: string;
}

export interface BimHistoricEvent {
  id: string;
  date: string;
  time: string;
  element_id?: string;
  element_name?: string;
  event_type: string;
  user: string;
  role: UserRole;
  description: string;
  module: string;
}

export interface BimAuditEntry {
  id: string;
  date: string;
  time: string;
  action: string;
  user: string;
  role: UserRole;
  resource: string;
  result: string;
  detail: string;
  ip: string;
  reason?: string;
  hash: string;
}

export interface ActiveFilters {
  category: ElementCategory | 'all';
  status: ElementStatus | 'all';
  criticality: 'all' | 'low' | 'medium' | 'high' | 'critical';
  layer: LayerKey | 'all';
}

export interface ActiveLayers {
  inventory: boolean;
  maintenance: boolean;
  exploitation: boolean;
  auscultation: boolean;
  electrical: boolean;
  safety: boolean;
  alerts: boolean;
}
