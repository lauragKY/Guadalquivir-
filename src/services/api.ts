import { supabase } from '../lib/supabase';
import { Dam, Emergency, Sensor, SensorReading, DashboardStats, EmergencyPlan, InventoryItem, MaintenanceWorkOrder, MaintenanceActivity, MaintenanceReport, DocumentFolder, TechnicalDocument, AuscultationReading, AuscultationImportBatch, ExploitationSystem, ExploitationZone, ExploitationDailyData } from '../types';

export async function getDams(): Promise<Dam[]> {
  const { data, error } = await supabase
    .from('dams')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getDamById(id: string): Promise<Dam | null> {
  const { data, error } = await supabase
    .from('dams')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getEmergencies(): Promise<Emergency[]> {
  const { data, error } = await supabase
    .from('emergencies')
    .select(`
      *,
      dam:dams(*),
      responsible:user_profiles(*)
    `)
    .order('detected_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getActiveEmergencies(): Promise<Emergency[]> {
  const { data, error } = await supabase
    .from('emergencies')
    .select(`
      *,
      dam:dams(*),
      responsible:user_profiles(*)
    `)
    .not('status', 'eq', 'closed')
    .order('detected_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getEmergencyById(id: string): Promise<Emergency | null> {
  const { data, error } = await supabase
    .from('emergencies')
    .select(`
      *,
      dam:dams(*),
      responsible:user_profiles(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getEmergenciesByDam(damId: string): Promise<Emergency[]> {
  const { data, error } = await supabase
    .from('emergencies')
    .select(`
      *,
      dam:dams(*),
      responsible:user_profiles(*)
    `)
    .eq('dam_id', damId)
    .order('detected_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSensors(damId?: string): Promise<Sensor[]> {
  let query = supabase
    .from('sensors')
    .select(`
      *,
      dam:dams(*)
    `);

  if (damId) {
    query = query.eq('dam_id', damId);
  }

  const { data, error } = await query.order('name');

  if (error) throw error;
  return data || [];
}

export async function getSensorReadings(sensorId: string, limit = 50): Promise<SensorReading[]> {
  const { data, error } = await supabase
    .from('sensor_readings')
    .select('*')
    .eq('sensor_id', sensorId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getAlertsFromSensors(): Promise<SensorReading[]> {
  const { data, error } = await supabase
    .from('sensor_readings')
    .select(`
      *,
      sensor:sensors(
        *,
        dam:dams(*)
      )
    `)
    .in('alert_level', ['alert', 'critical'])
    .order('timestamp', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data || [];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [damsData, emergenciesData, sensorsData, alertsData] = await Promise.all([
    supabase.from('dams').select('operational_status, current_level'),
    supabase.from('emergencies').select('severity, status'),
    supabase.from('sensors').select('status'),
    supabase.from('sensor_readings')
      .select('alert_level')
      .in('alert_level', ['alert', 'critical'])
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const dams = damsData.data || [];
  const emergencies = emergenciesData.data || [];
  const sensors = sensorsData.data || [];
  const alerts = alertsData.data || [];

  const operationalDams = dams.filter(d => d.operational_status === 'operational').length;
  const damsInAlert = dams.filter(d => d.operational_status === 'alert').length;
  const damsInEmergency = dams.filter(d => d.operational_status === 'emergency').length;

  const activeEmergencies = emergencies.filter(e => e.status !== 'closed').length;
  const criticalEmergencies = emergencies.filter(
    e => e.severity === 'critical' && e.status !== 'closed'
  ).length;

  const avgLevel = dams.length > 0
    ? dams.reduce((sum, d) => sum + d.current_level, 0) / dams.length
    : 0;

  return {
    totalDams: dams.length,
    operationalDams,
    damsInAlert,
    damsInEmergency,
    activeEmergencies,
    criticalEmergencies,
    totalSensors: sensors.length,
    sensorsInAlert: alerts.length,
    avgReservoirLevel: Math.round(avgLevel * 10) / 10,
  };
}

export async function getEmergencyPlans(damId?: string): Promise<EmergencyPlan[]> {
  let query = supabase
    .from('emergency_plans')
    .select(`
      *,
      dam:dams(*)
    `);

  if (damId) {
    query = query.eq('dam_id', damId);
  }

  const { data, error } = await query.order('last_review', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getInventoryItems(damId: string): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('dam_id', damId)
    .order('code');

  if (error) throw error;
  return data || [];
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*, dam:dams(*)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getInventoryTree(damId: string): Promise<InventoryItem[]> {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('dam_id', damId)
    .order('code');

  if (error) throw error;

  const items = data || [];
  const itemMap = new Map<string, InventoryItem>();
  const rootItems: InventoryItem[] = [];

  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  items.forEach(item => {
    const currentItem = itemMap.get(item.id)!;
    if (item.parent_id) {
      const parent = itemMap.get(item.parent_id);
      if (parent && parent.children) {
        parent.children.push(currentItem);
      }
    } else {
      rootItems.push(currentItem);
    }
  });

  return rootItems;
}

export async function getMaintenanceWorkOrders(damId: string, year?: number): Promise<MaintenanceWorkOrder[]> {
  let query = supabase
    .from('maintenance_work_orders')
    .select(`
      *,
      dam:dams(*),
      activity:maintenance_activities(*),
      assigned_user:user_profiles!maintenance_work_orders_assigned_to_fkey(*)
    `)
    .eq('dam_id', damId);

  if (year) {
    query = query.eq('scheduled_year', year);
  }

  const { data, error } = await query.order('scheduled_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getMaintenanceWorkOrderById(id: string): Promise<MaintenanceWorkOrder | null> {
  const { data, error } = await supabase
    .from('maintenance_work_orders')
    .select(`
      *,
      dam:dams(*),
      activity:maintenance_activities(*),
      assigned_user:user_profiles!maintenance_work_orders_assigned_to_fkey(*),
      report:maintenance_reports(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getMaintenanceActivities(damId: string): Promise<MaintenanceActivity[]> {
  const { data, error } = await supabase
    .from('maintenance_activities')
    .select('*')
    .eq('dam_id', damId)
    .order('code');

  if (error) throw error;
  return data || [];
}

export async function getMaintenanceReport(workOrderId: string): Promise<MaintenanceReport | null> {
  const { data, error } = await supabase
    .from('maintenance_reports')
    .select(`
      *,
      work_order:maintenance_work_orders(*),
      performer:user_profiles!maintenance_reports_performed_by_fkey(*)
    `)
    .eq('work_order_id', workOrderId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getDocumentFolders(damId: string): Promise<DocumentFolder[]> {
  const { data, error } = await supabase
    .from('document_folders')
    .select('*')
    .eq('dam_id', damId)
    .order('path');

  if (error) throw error;
  return data || [];
}

export async function getTechnicalDocuments(damId: string, folderId?: string): Promise<TechnicalDocument[]> {
  let query = supabase
    .from('technical_documents')
    .select(`
      *,
      dam:dams(*),
      folder:document_folders(*),
      uploader:user_profiles!technical_documents_uploaded_by_fkey(*)
    `)
    .eq('dam_id', damId);

  if (folderId) {
    query = query.eq('folder_id', folderId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getTechnicalDocumentById(id: string): Promise<TechnicalDocument | null> {
  const { data, error } = await supabase
    .from('technical_documents')
    .select(`
      *,
      dam:dams(*),
      folder:document_folders(*),
      uploader:user_profiles!technical_documents_uploaded_by_fkey(*),
      approver:user_profiles!technical_documents_approved_by_fkey(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getAuscultationReadings(
  sensorId: string,
  startDate?: string,
  endDate?: string
): Promise<AuscultationReading[]> {
  let query = supabase
    .from('auscultation_readings')
    .select(`
      *,
      sensor:sensors(*),
      dam:dams(*),
      importer:user_profiles(*)
    `)
    .eq('sensor_id', sensorId)
    .order('reading_date', { ascending: false });

  if (startDate) {
    query = query.gte('reading_date', startDate);
  }
  if (endDate) {
    query = query.lte('reading_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getAuscultationReadingsByDam(
  damId: string,
  startDate?: string,
  endDate?: string
): Promise<AuscultationReading[]> {
  let query = supabase
    .from('auscultation_readings')
    .select(`
      *,
      sensor:sensors(*),
      dam:dams(*),
      importer:user_profiles(*)
    `)
    .eq('dam_id', damId)
    .order('reading_date', { ascending: false });

  if (startDate) {
    query = query.gte('reading_date', startDate);
  }
  if (endDate) {
    query = query.lte('reading_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function createAuscultationReading(
  reading: Omit<AuscultationReading, 'id' | 'created_at'>
): Promise<AuscultationReading> {
  const { data, error } = await supabase
    .from('auscultation_readings')
    .insert(reading)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createAuscultationReadingsBulk(
  readings: Omit<AuscultationReading, 'id' | 'created_at'>[]
): Promise<AuscultationReading[]> {
  const { data, error } = await supabase
    .from('auscultation_readings')
    .insert(readings)
    .select();

  if (error) throw error;
  return data || [];
}

export async function getAuscultationImportBatches(damId?: string): Promise<AuscultationImportBatch[]> {
  let query = supabase
    .from('auscultation_import_batches')
    .select(`
      *,
      dam:dams(*),
      importer:user_profiles(*)
    `)
    .order('created_at', { ascending: false });

  if (damId) {
    query = query.eq('dam_id', damId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function createAuscultationImportBatch(
  batch: Omit<AuscultationImportBatch, 'id' | 'created_at' | 'completed_at'>
): Promise<AuscultationImportBatch> {
  const { data, error } = await supabase
    .from('auscultation_import_batches')
    .insert(batch)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAuscultationImportBatch(
  batchId: string,
  updates: Partial<AuscultationImportBatch>
): Promise<AuscultationImportBatch> {
  const { data, error} = await supabase
    .from('auscultation_import_batches')
    .update(updates)
    .eq('id', batchId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExploitationSystems(): Promise<ExploitationSystem[]> {
  const { data, error } = await supabase
    .from('exploitation_systems')
    .select(`
      *,
      director:user_profiles(*)
    `)
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getExploitationZones(systemId?: string): Promise<ExploitationZone[]> {
  let query = supabase
    .from('exploitation_zones')
    .select(`
      *,
      system:exploitation_systems(*)
    `)
    .order('name');

  if (systemId) {
    query = query.eq('system_id', systemId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getExploitationDailyData(
  damId?: string,
  startDate?: string,
  endDate?: string
): Promise<ExploitationDailyData[]> {
  let query = supabase
    .from('exploitation_daily_data')
    .select(`
      *,
      dam:dams(*),
      registrar:user_profiles!exploitation_daily_data_registered_by_fkey(*),
      verifier:user_profiles!exploitation_daily_data_verified_by_fkey(*)
    `)
    .order('date', { ascending: false });

  if (damId) {
    query = query.eq('dam_id', damId);
  }
  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getExploitationDailyDataByDate(
  date: string,
  zoneId?: string,
  systemId?: string
): Promise<ExploitationDailyData[]> {
  let query = supabase
    .from('exploitation_daily_data')
    .select(`
      *,
      dam:dams(
        *,
        exploitation_zone:exploitation_zones(*),
        exploitation_system:exploitation_systems(*)
      ),
      registrar:user_profiles!exploitation_daily_data_registered_by_fkey(*),
      verifier:user_profiles!exploitation_daily_data_verified_by_fkey(*)
    `)
    .eq('date', date);

  const { data, error } = await query;

  if (error) throw error;

  let filtered = data || [];

  if (zoneId) {
    filtered = filtered.filter((item: any) => item.dam?.exploitation_zone_id === zoneId);
  }

  if (systemId) {
    filtered = filtered.filter((item: any) => item.dam?.exploitation_system_id === systemId);
  }

  return filtered;
}

export async function createExploitationDailyData(
  data: Omit<ExploitationDailyData, 'id' | 'created_at' | 'updated_at'>
): Promise<ExploitationDailyData> {
  const { data: result, error } = await supabase
    .from('exploitation_daily_data')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateExploitationDailyData(
  id: string,
  updates: Partial<ExploitationDailyData>
): Promise<ExploitationDailyData> {
  const { data, error } = await supabase
    .from('exploitation_daily_data')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExploitationDataForAnnualReport(
  year: number,
  zoneId?: string,
  systemId?: string
): Promise<ExploitationDailyData[]> {
  const startDate = `${year}-10-01`;
  const endDate = `${year + 1}-09-30`;

  let query = supabase
    .from('exploitation_daily_data')
    .select(`
      *,
      dam:dams(
        *,
        exploitation_zone:exploitation_zones(*),
        exploitation_system:exploitation_systems(*)
      ),
      registrar:user_profiles!exploitation_daily_data_registered_by_fkey(*)
    `)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;

  let filtered = data || [];

  if (zoneId) {
    filtered = filtered.filter((item: any) => item.dam?.exploitation_zone_id === zoneId);
  }

  if (systemId) {
    filtered = filtered.filter((item: any) => item.dam?.exploitation_system_id === systemId);
  }

  return filtered;
}
