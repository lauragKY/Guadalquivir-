import { supabase } from '../lib/supabase';

export interface WorkOrderPDFData {
  workOrder: {
    code: string;
    title: string;
    description: string | null;
    order_type: string;
    status: string;
    scheduled_date: string | null;
    priority: string;
    dam: {
      code: string;
      name: string;
    };
    assigned_user: {
      full_name: string;
    } | null;
    activity: {
      name: string;
    } | null;
  };
  operations: Array<{
    operation_number: number;
    operation_name: string;
    operation_description: string | null;
    status: string;
    result: string | null;
    notes: string | null;
    completed_at: string | null;
  }>;
  closure: {
    closed_at: string;
    closed_by_name: string;
    observations: string | null;
  };
}

export async function generateMaintenancePDF(workOrderId: string): Promise<string> {
  try {
    const { data: workOrder, error: woError } = await supabase
      .from('maintenance_work_orders')
      .select(`
        *,
        dam:dams(code, name),
        assigned_user:user_profiles(full_name),
        activity:maintenance_activities(name)
      `)
      .eq('id', workOrderId)
      .single();

    if (woError || !workOrder) throw new Error('Work order not found');

    const { data: operations, error: opsError } = await supabase
      .from('maintenance_work_order_operations')
      .select('*')
      .eq('work_order_id', workOrderId)
      .order('operation_number', { ascending: true });

    if (opsError) throw new Error('Error loading operations');

    const { data: closure, error: closureError } = await supabase
      .from('maintenance_work_order_closure')
      .select(`
        *,
        closed_by_user:user_profiles!maintenance_work_order_closure_closed_by_fkey(full_name)
      `)
      .eq('work_order_id', workOrderId)
      .maybeSingle();

    if (closureError) throw new Error('Error loading closure info');

    const pdfData: WorkOrderPDFData = {
      workOrder: {
        code: workOrder.code,
        title: workOrder.title,
        description: workOrder.description,
        order_type: workOrder.order_type,
        status: workOrder.status,
        scheduled_date: workOrder.scheduled_date,
        priority: workOrder.priority,
        dam: workOrder.dam,
        assigned_user: workOrder.assigned_user,
        activity: workOrder.activity
      },
      operations: operations || [],
      closure: closure ? {
        closed_at: closure.closed_at,
        closed_by_name: (closure as any).closed_by_user?.full_name || 'Desconocido',
        observations: closure.observations
      } : {
        closed_at: new Date().toISOString(),
        closed_by_name: 'Sistema',
        observations: null
      }
    };

    const pdfContent = generatePDFContent(pdfData);

    const fileName = `parte_mantenimiento_${workOrder.code}_${Date.now()}.pdf`;
    const filePath = `/maintenance-reports/${fileName}`;

    return filePath;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

function generatePDFContent(data: WorkOrderPDFData): string {
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      completed: 'Completada',
      cancelled: 'Cancelada'
    };
    return labels[status] || status;
  };

  const getOrderTypeLabel = (type: string) => {
    return type === 'preventive' ? 'Preventivo' : 'Correctivo';
  };

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Parte de Mantenimiento - ${data.workOrder.code}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    .header {
      border-bottom: 3px solid #1e40af;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #1e40af;
      margin: 0 0 10px 0;
    }
    .header .subtitle {
      color: #666;
      font-size: 14px;
    }
    .info-section {
      margin-bottom: 30px;
    }
    .info-section h2 {
      color: #1e40af;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 20px;
    }
    .info-item {
      padding: 10px;
      background-color: #f9fafb;
      border-left: 3px solid #1e40af;
    }
    .info-item label {
      font-weight: bold;
      color: #4b5563;
      font-size: 12px;
      display: block;
      margin-bottom: 5px;
    }
    .info-item .value {
      color: #111827;
      font-size: 14px;
    }
    .operations-list {
      margin-top: 20px;
    }
    .operation-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      background-color: #ffffff;
    }
    .operation-header {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 10px;
      font-size: 15px;
    }
    .operation-detail {
      margin-bottom: 8px;
      font-size: 13px;
    }
    .operation-detail label {
      font-weight: bold;
      color: #4b5563;
      margin-right: 5px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    .status-completed {
      background-color: #d1fae5;
      color: #065f46;
    }
    .status-in-progress {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .status-pending {
      background-color: #fed7aa;
      color: #9a3412;
    }
    .closure-section {
      background-color: #f0f9ff;
      border: 2px solid #1e40af;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
    }
    .closure-section h3 {
      color: #1e40af;
      margin-top: 0;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
    }
    .badge-preventive {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .badge-corrective {
      background-color: #fed7aa;
      color: #9a3412;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>PARTE DE MANTENIMIENTO</h1>
    <div class="subtitle">
      Confederación Hidrográfica del Guadalquivir - Sistema SIPRESAS
    </div>
  </div>

  <div class="info-section">
    <h2>Datos Generales</h2>
    <div class="info-grid">
      <div class="info-item">
        <label>Código de Orden:</label>
        <div class="value">${data.workOrder.code}</div>
      </div>
      <div class="info-item">
        <label>Presa:</label>
        <div class="value">${data.workOrder.dam.code} - ${data.workOrder.dam.name}</div>
      </div>
      <div class="info-item">
        <label>Tipo de Mantenimiento:</label>
        <div class="value">
          <span class="badge ${data.workOrder.order_type === 'preventive' ? 'badge-preventive' : 'badge-corrective'}">
            ${getOrderTypeLabel(data.workOrder.order_type)}
          </span>
        </div>
      </div>
      <div class="info-item">
        <label>Estado:</label>
        <div class="value">${getStatusLabel(data.workOrder.status)}</div>
      </div>
      ${data.workOrder.scheduled_date ? `
      <div class="info-item">
        <label>Fecha Programada:</label>
        <div class="value">${new Date(data.workOrder.scheduled_date).toLocaleDateString('es-ES')}</div>
      </div>
      ` : ''}
      ${data.workOrder.assigned_user ? `
      <div class="info-item">
        <label>Asignado a:</label>
        <div class="value">${data.workOrder.assigned_user.full_name}</div>
      </div>
      ` : ''}
    </div>

    <div class="info-item" style="grid-column: span 2;">
      <label>Título:</label>
      <div class="value">${data.workOrder.title}</div>
    </div>

    ${data.workOrder.description ? `
    <div class="info-item" style="grid-column: span 2; margin-top: 15px;">
      <label>Descripción:</label>
      <div class="value">${data.workOrder.description}</div>
    </div>
    ` : ''}

    ${data.workOrder.activity ? `
    <div class="info-item" style="grid-column: span 2; margin-top: 15px;">
      <label>Actividad:</label>
      <div class="value">${data.workOrder.activity.name}</div>
    </div>
    ` : ''}
  </div>

  <div class="info-section">
    <h2>Operaciones Realizadas</h2>
    ${data.operations.length === 0 ? `
      <p style="color: #6b7280; font-style: italic;">No se registraron operaciones para esta orden de trabajo.</p>
    ` : `
      <div class="operations-list">
        ${data.operations.map(op => `
          <div class="operation-item">
            <div class="operation-header">
              ${op.operation_number}. ${op.operation_name}
            </div>
            ${op.operation_description ? `
              <div class="operation-detail">
                <label>Descripción:</label> ${op.operation_description}
              </div>
            ` : ''}
            <div class="operation-detail">
              <label>Estado:</label>
              <span class="status-badge status-${op.status === 'completed' ? 'completed' : op.status === 'in_progress' ? 'in-progress' : 'pending'}">
                ${getStatusLabel(op.status)}
              </span>
            </div>
            ${op.result ? `
              <div class="operation-detail">
                <label>Resultado:</label> ${op.result}
              </div>
            ` : ''}
            ${op.notes ? `
              <div class="operation-detail">
                <label>Notas:</label> ${op.notes}
              </div>
            ` : ''}
            ${op.completed_at ? `
              <div class="operation-detail">
                <label>Fecha de Completado:</label> ${new Date(op.completed_at).toLocaleString('es-ES')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `}
  </div>

  <div class="closure-section">
    <h3>Cierre de Parte de Trabajo</h3>
    <div class="info-grid">
      <div class="info-item">
        <label>Fecha de Cierre:</label>
        <div class="value">${new Date(data.closure.closed_at).toLocaleString('es-ES')}</div>
      </div>
      <div class="info-item">
        <label>Cerrado por:</label>
        <div class="value">${data.closure.closed_by_name}</div>
      </div>
    </div>
    ${data.closure.observations ? `
      <div class="info-item" style="margin-top: 15px;">
        <label>Observaciones Finales:</label>
        <div class="value">${data.closure.observations}</div>
      </div>
    ` : ''}
  </div>

  <div class="footer">
    <p>Documento generado automáticamente por SIPRESAS</p>
    <p>Fecha de generación: ${new Date().toLocaleString('es-ES')}</p>
  </div>
</body>
</html>
  `;

  return html;
}

export async function sendPDFToBIM(workOrderId: string, pdfFilePath: string): Promise<boolean> {
  try {
    const { data: workOrder } = await supabase
      .from('maintenance_work_orders')
      .select('equipment_id, dam_id')
      .eq('id', workOrderId)
      .maybeSingle();

    if (!workOrder || !workOrder.equipment_id) {
      console.log('Work order does not have associated equipment, skipping BIM integration');
      return false;
    }

    const { data: equipment } = await supabase
      .from('inventory_equipment')
      .select('has_bim_model')
      .eq('id', workOrder.equipment_id)
      .maybeSingle();

    if (!equipment || !equipment.has_bim_model) {
      console.log('Equipment does not have BIM model, skipping BIM integration');
      return false;
    }

    const { data: existingDoc } = await supabase
      .from('bim_equipment_documents')
      .select('id')
      .eq('equipment_id', workOrder.equipment_id)
      .eq('document_type', 'maintenance_report')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingDoc) {
      await supabase
        .from('bim_equipment_documents')
        .update({
          file_path: pdfFilePath,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingDoc.id);
    } else {
      await supabase
        .from('bim_equipment_documents')
        .insert({
          equipment_id: workOrder.equipment_id,
          document_type: 'maintenance_report',
          document_name: `Último Parte de Mantenimiento`,
          file_path: pdfFilePath,
          file_format: 'pdf'
        });
    }

    await supabase
      .from('maintenance_work_order_closure')
      .update({
        sent_to_bim: true,
        bim_sent_at: new Date().toISOString()
      })
      .eq('work_order_id', workOrderId);

    return true;
  } catch (error) {
    console.error('Error sending PDF to BIM:', error);
    return false;
  }
}
