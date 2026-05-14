export type Criticality = 'baja' | 'media' | 'alta' | 'critica';
export type DocStatus = 'aprobado' | 'borrador' | 'revision' | 'obsoleto';
export type DocType =
  | 'plan_emergencia' | 'norma_explotacion' | 'plano' | 'informe' | 'manual'
  | 'certificado' | 'acta' | 'cartografia' | 'proyecto' | 'otro';
export type AuditAction =
  | 'subida' | 'descarga' | 'movido' | 'criticidad_cambiada' | 'acceso_denegado'
  | 'nueva_version' | 'vinculado' | 'metadatos_editados' | 'version_restaurada';
export type ModuleLink = 'inventario' | 'mantenimiento' | 'emergencias' | 'auscultacion' | 'bim' | 'gis';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  docCount: number;
}

export interface DocVersion {
  version: string;
  date: string;
  user: string;
  reason: string;
  active: boolean;
}

export interface DocLink {
  module: ModuleLink;
  label: string;
  ref: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocType;
  folderId: string;
  folderPath: string;
  version: string;
  criticality: Criticality;
  status: DocStatus;
  size: string;
  format: string;
  updatedAt: string;
  updatedBy: string;
  createdAt: string;
  createdBy: string;
  description: string;
  versions: DocVersion[];
  links: DocLink[];
  alfrescoId: string;
  tags: string[];
}

export interface AuditEvent {
  id: string;
  date: string;
  time: string;
  user: string;
  action: AuditAction;
  document: string;
  documentId: string;
  result: 'ok' | 'denegado' | 'error';
  detail: string;
  criticality?: Criticality;
}
