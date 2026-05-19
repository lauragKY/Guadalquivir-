export type Screen =
  | 'dashboard'
  | 'viewer'
  | 'alerts'
  | 'models'
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
  | 'access'
  | 'mechanical';

export type ModelFormat = 'IFC' | 'RVT' | 'DWG' | 'FBX';

export type ModelState = 'published' | 'draft' | 'review' | 'obsolete';

export type LayerSource =
  | 'inventory'
  | 'maintenance'
  | 'exploitation'
  | 'auscultation'
  | 'archive';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type AlertSource = 'maintenance' | 'exploitation' | 'auscultation';

export type UserRole =
  | 'viewer'
  | 'maintenance_tech'
  | 'auscultation_tech'
  | 'director'
  | 'bim_admin'
  | 'sipresas_admin';

export interface BimElement {
  id: string;
  code: string;
  name: string;
  category: ElementCategory;
  status: ElementStatus;
  x: number;
  y: number;
  width: number;
  height: number;
  svgType: 'rect' | 'ellipse' | 'polygon';
  points?: string;
  layer: LayerSource[];
  // Integration data
  inventory_ref?: string;
  maintenance_last_date?: string;
  maintenance_last_pdf?: string;
  maintenance_next_date?: string;
  maintenance_status?: string;
  exploitation_status?: string;
  auscultation_variable?: string;
  auscultation_value?: string;
  auscultation_unit?: string;
  auscultation_threshold?: string;
  auscultation_status?: string;
  archive_docs?: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  material?: string;
  dimensions?: string;
  last_inspection?: string;
}

export interface BimModel {
  id: string;
  name: string;
  description: string;
  format: ModelFormat;
  state: ModelState;
  version: string;
  version_date: string;
  size_mb: number;
  elements_count: number;
  author: string;
  published_by?: string;
  published_date?: string;
  saih_sync: boolean;
  last_sync?: string;
  changes_summary?: string;
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
  resolved: boolean;
  resolved_date?: string;
  resolved_by?: string;
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
  result: string;
  detail: string;
  hash: string;
}

export interface ActiveFilters {
  category: ElementCategory | 'all';
  status: ElementStatus | 'all';
  criticality: 'all' | 'low' | 'medium' | 'high' | 'critical';
  layer: LayerSource | 'all';
}
