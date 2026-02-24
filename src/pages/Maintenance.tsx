import { useEffect, useState } from 'react';
import { Wrench, Calendar, Filter, Plus, CheckCircle, Clock, AlertCircle, XCircle, FileText, Download, Lock, Unlock, Trash2, Edit, Save, GripVertical, Send } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MaintenanceWorkOrder } from '../types';
import { getMaintenanceWorkOrders, getDams } from '../services/api';
import { supabase } from '../lib/supabase';
import MaintenanceOperationsManager from '../components/MaintenanceOperationsManager';
import { generateMaintenancePDF, sendPDFToBIM } from '../services/pdfGenerationService';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const PERIODICITIES = [
  { value: 'all', label: 'Todas' },
  { value: 'daily', label: 'Diaria' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semiannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' },
];

const PERSONNEL_TYPES = [
  { value: 'all', label: 'Todos' },
  { value: 'EE', label: 'EE' },
  { value: 'IT', label: 'IT' },
  { value: 'OCA', label: 'OCA' },
];

export default function Maintenance() {
  const [workOrders, setWorkOrders] = useState<MaintenanceWorkOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<MaintenanceWorkOrder[]>([]);
  const [selectedDamId, setSelectedDamId] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [dams, setDams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<MaintenanceWorkOrder | null>(null);
  const [closureObservations, setClosureObservations] = useState('');
  const [processingPDF, setProcessingPDF] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<MaintenanceWorkOrder | null>(null);
  const [newOrder, setNewOrder] = useState({
    order_type: 'preventive',
    periodicity: 'monthly',
    month: new Date().getMonth() + 1,
    personnel_type: 'EE',
    title: '',
    description: ''
  });

  const [filters, setFilters] = useState({
    orderType: 'all',
    status: 'all',
    periodicity: 'all',
    personnelType: 'all',
  });

  useEffect(() => {
    loadDams();
  }, []);

  useEffect(() => {
    if (selectedDamId) {
      loadWorkOrders();
    }
  }, [selectedDamId, selectedYear]);

  useEffect(() => {
    applyFilters();
  }, [workOrders, filters]);

  const loadDams = async () => {
    try {
      const damsData = await getDams();
      setDams(damsData);
      if (damsData.length > 0 && !selectedDamId) {
        setSelectedDamId(damsData[0].id);
      }
    } catch (error) {
      console.error('Error loading dams:', error);
    }
  };

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      const orders = await getMaintenanceWorkOrders(selectedDamId, selectedYear);
      setWorkOrders(orders);
    } catch (error) {
      console.error('Error loading work orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...workOrders];

    if (filters.orderType !== 'all') {
      filtered = filtered.filter(order => order.order_type === filters.orderType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    setFilteredOrders(filtered);
  };

  const getOrdersByMonth = (month: number) => {
    return filteredOrders.filter(order => order.scheduled_month === month);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      in_progress: 'En Progreso',
      completed: 'Realizada',
      cancelled: 'Cancelada',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-orange-500';
    }
  };

  const getOrderTypeLabel = (type: string) => {
    return type === 'preventive' ? 'Preventivo' : 'Correctivo';
  };

  const getOrderTypeColor = (type: string) => {
    return type === 'preventive' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';
  };

  const getOrderStats = () => {
    const stats = {
      total: filteredOrders.length,
      pending: filteredOrders.filter(o => o.status === 'pending').length,
      inProgress: filteredOrders.filter(o => o.status === 'in_progress').length,
      completed: filteredOrders.filter(o => o.status === 'completed').length,
      preventive: filteredOrders.filter(o => o.order_type === 'preventive').length,
      corrective: filteredOrders.filter(o => o.order_type === 'corrective').length,
    };
    return stats;
  };

  const stats = getOrderStats();

  const closeWorkOrder = async () => {
    if (!selectedOrder) return;

    if (!confirm('¿Cerrar esta orden de trabajo? Una vez cerrada no podrá modificarse y se generará automáticamente el PDF.')) {
      return;
    }

    try {
      setProcessingPDF(true);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      await supabase
        .from('maintenance_work_orders')
        .update({
          status: 'completed',
          is_closed: true,
          closed_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);

      const pdfPath = await generateMaintenancePDF(selectedOrder.id);

      const { error: closureError } = await supabase
        .from('maintenance_work_order_closure')
        .insert({
          work_order_id: selectedOrder.id,
          closed_by: user.user.id,
          pdf_generated: true,
          pdf_file_path: pdfPath,
          observations: closureObservations || null
        });

      if (closureError) throw closureError;

      const sentToBIM = await sendPDFToBIM(selectedOrder.id, pdfPath);

      alert(
        `Orden de trabajo cerrada correctamente.\n\nPDF generado: ${pdfPath}\n` +
        (sentToBIM ? 'PDF enviado automáticamente al módulo BIM.' : 'Este equipo no tiene modelo BIM asociado.')
      );

      setClosureObservations('');
      await loadWorkOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error closing work order:', error);
      alert('Error al cerrar la orden de trabajo');
    } finally {
      setProcessingPDF(false);
    }
  };

  const startWorkOrder = async (workOrderId: string) => {
    if (!confirm('¿Iniciar esta orden de trabajo?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('maintenance_work_orders')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('id', workOrderId);

      if (error) throw error;

      alert('Orden de trabajo iniciada correctamente');
      await loadWorkOrders();

      const updatedOrder = workOrders.find(wo => wo.id === workOrderId);
      if (updatedOrder) {
        setSelectedOrder({ ...updatedOrder, status: 'in_progress', started_at: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Error starting work order:', error);
      alert('Error al iniciar la orden de trabajo');
    }
  };

  const deleteWorkOrder = async (workOrderId: string) => {
    if (!confirm('¿Está seguro de eliminar esta orden de trabajo? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('maintenance_work_orders')
        .delete()
        .eq('id', workOrderId);

      if (error) throw error;

      alert('Orden de trabajo eliminada correctamente');
      await loadWorkOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting work order:', error);
      alert('Error al eliminar la orden de trabajo');
    }
  };

  const startEditingOrder = (order: MaintenanceWorkOrder) => {
    setEditingOrder({
      ...order,
      title: order.title,
      description: order.description || '',
      order_type: order.order_type,
      scheduled_month: order.scheduled_month || new Date().getMonth() + 1,
      priority: order.priority || 'medium'
    });
  };

  const cancelEditing = () => {
    setEditingOrder(null);
  };

  const saveOrderChanges = async () => {
    if (!editingOrder) return;

    if (!editingOrder.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      const { error } = await supabase
        .from('maintenance_work_orders')
        .update({
          title: editingOrder.title,
          description: editingOrder.description,
          order_type: editingOrder.order_type,
          scheduled_month: editingOrder.scheduled_month,
          priority: editingOrder.priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingOrder.id);

      if (error) throw error;

      alert('Orden de trabajo actualizada correctamente');
      await loadWorkOrders();

      if (selectedOrder?.id === editingOrder.id) {
        setSelectedOrder({...selectedOrder, ...editingOrder});
      }

      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating work order:', error);
      alert('Error al actualizar la orden de trabajo: ' + (error as Error).message);
    }
  };

  const createWorkOrder = async () => {
    if (!newOrder.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    if (!newOrder.description.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: maxCodeData } = await supabase
        .from('maintenance_work_orders')
        .select('code')
        .order('code', { ascending: false })
        .limit(1)
        .maybeSingle();

      let nextNumber = 1;
      if (maxCodeData?.code) {
        const match = maxCodeData.code.match(/WO-(\d+)/);
        if (match) {
          nextNumber = parseInt(match[1]) + 1;
        }
      }

      const code = `WO-${String(nextNumber).padStart(6, '0')}`;

      const { data, error } = await supabase
        .from('maintenance_work_orders')
        .insert([{
          dam_id: selectedDamId,
          order_type: newOrder.order_type,
          code: code,
          title: newOrder.title,
          description: newOrder.description,
          scheduled_month: newOrder.month,
          scheduled_year: selectedYear,
          status: 'pending',
          priority: 'medium',
          is_closed: false,
          created_by: user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      alert('Orden de trabajo creada correctamente');

      setNewOrder({
        order_type: 'preventive',
        periodicity: 'monthly',
        month: new Date().getMonth() + 1,
        personnel_type: 'EE',
        title: '',
        description: ''
      });

      setShowCreateForm(false);
      await loadWorkOrders();

      if (data) {
        setSelectedOrder(data);
      }
    } catch (error) {
      console.error('Error creating work order:', error);
      alert('Error al crear la orden de trabajo: ' + (error as Error).message);
    }
  };

  const downloadPDF = async (workOrderId: string) => {
    try {
      setProcessingPDF(true);

      const { data: closure } = await supabase
        .from('maintenance_work_order_closure')
        .select('pdf_file_path')
        .eq('work_order_id', workOrderId)
        .maybeSingle();

      if (closure?.pdf_file_path) {
        alert(`Descargando PDF desde: ${closure.pdf_file_path}`);
      } else {
        const pdfPath = await generateMaintenancePDF(workOrderId);
        alert(`PDF generado y disponible en: ${pdfPath}`);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Error al descargar el PDF');
    } finally {
      setProcessingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wrench className="h-7 w-7 text-blue-600" />
            Mantenimiento
          </h1>
          <p className="text-gray-600 mt-1">Gestión de mantenimiento preventivo y correctivo</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Orden de Trabajo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Órdenes Totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Preventivos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.preventive}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Correctivos</p>
              <p className="text-2xl font-bold text-orange-600">{stats.corrective}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedDamId}
              onChange={(e) => setSelectedDamId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dams.map((dam) => (
                <option key={dam.id} value={dam.id}>
                  {dam.code} - {dam.name}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Filtros:</span>
            </div>

            <select
              value={filters.orderType}
              onChange={(e) => setFilters({ ...filters, orderType: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los tipos</option>
              <option value="preventive">Preventivo</option>
              <option value="corrective">Correctivo</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>

            <select
              value={filters.periodicity}
              onChange={(e) => setFilters({ ...filters, periodicity: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PERIODICITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cronograma {selectedYear}
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 border border-gray-300">
                    Actividad
                  </th>
                  {MONTHS.map((month, index) => (
                    <th
                      key={month}
                      className="px-3 py-3 text-center text-xs font-semibold text-gray-700 border border-gray-300 min-w-[80px]"
                    >
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-8 text-center text-gray-500">
                      No hay órdenes de trabajo programadas para este año
                    </td>
                  </tr>
                ) : (
                  <>
                    {Array.from(new Set(filteredOrders.map(o => o.activity?.name || o.title))).map((activityName, idx) => {
                      const ordersForActivity = filteredOrders.filter(
                        o => (o.activity?.name || o.title) === activityName
                      );

                      return (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900 border border-gray-300 font-medium">
                            {activityName}
                          </td>
                          {MONTHS.map((month, monthIndex) => {
                            const monthOrders = ordersForActivity.filter(
                              o => o.scheduled_month === monthIndex + 1
                            );

                            return (
                              <td
                                key={month}
                                className="px-2 py-2 text-center border border-gray-300"
                              >
                                {monthOrders.length > 0 ? (
                                  <div className="flex flex-col gap-1">
                                    {monthOrders.map((order) => (
                                      <button
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className={`w-full px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(
                                          order.status
                                        )} hover:opacity-80 transition-opacity`}
                                        title={`${getStatusLabel(order.status)} - ${order.title}`}
                                      >
                                        {order.status === 'completed' ? 'R' : order.status === 'cancelled' ? 'X' : 'P'}
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-300">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">Realizada (R)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-gray-600">Pendiente (P)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-gray-600">Cancelada (X)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600">En Progreso (P)</span>
            </div>
          </div>
        </div>
      </Card>

      {selectedOrder && (
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalle de Orden de Trabajo</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{selectedOrder.code}</Badge>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getOrderTypeColor(selectedOrder.order_type)}`}>
                    {getOrderTypeLabel(selectedOrder.order_type)}
                  </span>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="text-sm text-gray-600">{getStatusLabel(selectedOrder.status)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {editingOrder && editingOrder.id === selectedOrder.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Título *</label>
                    <input
                      type="text"
                      value={editingOrder.title}
                      onChange={(e) => setEditingOrder({ ...editingOrder, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      value={editingOrder.description}
                      onChange={(e) => setEditingOrder({ ...editingOrder, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Tipo de Orden</label>
                    <select
                      value={editingOrder.order_type}
                      onChange={(e) => setEditingOrder({ ...editingOrder, order_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                    >
                      <option value="preventive">Preventivo</option>
                      <option value="corrective">Correctivo</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mes Programado</label>
                    <select
                      value={editingOrder.scheduled_month}
                      onChange={(e) => setEditingOrder({ ...editingOrder, scheduled_month: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                    >
                      {MONTHS.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Prioridad</label>
                    <select
                      value={editingOrder.priority}
                      onChange={(e) => setEditingOrder({ ...editingOrder, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mt-1"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>

                  {selectedOrder.assigned_user && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Asignado a</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedOrder.assigned_user.full_name}</p>
                    </div>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 flex gap-3">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                    onClick={saveOrderChanges}
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </button>
                  <button
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    onClick={cancelEditing}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Título</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedOrder.title}</p>
                  </div>

                  {selectedOrder.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Descripción</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedOrder.description}</p>
                    </div>
                  )}

                  {selectedOrder.activity && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Actividad</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedOrder.activity.name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Fecha Programada</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedOrder.scheduled_date
                        ? new Date(selectedOrder.scheduled_date).toLocaleDateString('es-ES')
                        : selectedOrder.scheduled_month && selectedOrder.scheduled_year
                        ? `${MONTHS[selectedOrder.scheduled_month - 1]} ${selectedOrder.scheduled_year}`
                        : '—'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Prioridad</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedOrder.priority}</p>
                  </div>

                  {selectedOrder.assigned_user && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Asignado a</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedOrder.assigned_user.full_name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedOrder.status === 'completed' && selectedOrder.is_closed && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900">Parte Cerrado</p>
                      <p className="text-sm text-green-700 mt-1">
                        Esta orden de trabajo ha sido completada y cerrada el {selectedOrder.closed_at ? new Date(selectedOrder.closed_at).toLocaleString('es-ES') : 'fecha desconocida'}.
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Los datos no pueden ser modificados.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={processingPDF}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => downloadPDF(selectedOrder.id)}
                    >
                      <Download className="w-4 h-4" />
                      {processingPDF ? 'Generando...' : 'Descargar PDF'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(selectedOrder.status === 'in_progress' || (selectedOrder.status === 'completed' && !selectedOrder.is_closed)) && !editingOrder && (
              <div className="mb-6">
                <MaintenanceOperationsManager
                  workOrderId={selectedOrder.id}
                  isClosed={selectedOrder.is_closed || false}
                  onOperationsChange={() => loadWorkOrders()}
                />

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-3">Observaciones Finales (Opcional)</h5>
                  <textarea
                    value={closureObservations}
                    onChange={(e) => setClosureObservations(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Añada observaciones finales sobre el trabajo realizado..."
                  />
                </div>

                <div className="mt-4 flex gap-3 flex-wrap">
                  {selectedOrder.status === 'completed' && !selectedOrder.is_closed && (
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      onClick={() => startEditingOrder(selectedOrder)}
                    >
                      <Edit className="w-4 h-4" />
                      Modificar Datos Generales
                    </button>
                  )}
                  <button
                    disabled={processingPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={closeWorkOrder}
                  >
                    <Lock className="w-4 h-4" />
                    {processingPDF ? 'Cerrando...' : 'Cerrar y Generar PDF'}
                  </button>
                  {selectedOrder.equipment_id && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200">
                      <Send className="w-4 h-4 text-yellow-600" />
                      <span>Se enviará automáticamente al módulo BIM si el equipo tiene modelo asociado</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedOrder.status === 'pending' && !selectedOrder.is_closed && !editingOrder && (
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-900">Orden Pendiente</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Esta orden de trabajo está pendiente de iniciar.
                        </p>
                        <p className="text-sm text-yellow-700 mt-2">
                          Puede modificar los datos, iniciar el trabajo o eliminar la orden si no es necesaria.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                      onClick={() => startEditingOrder(selectedOrder)}
                    >
                      <Edit className="w-4 h-4" />
                      Modificar Orden
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                      onClick={() => startWorkOrder(selectedOrder.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Iniciar Orden de Trabajo
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                      onClick={() => deleteWorkOrder(selectedOrder.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar OT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedOrder.is_closed && (
              <div className="mb-6">
                <MaintenanceOperationsManager
                  workOrderId={selectedOrder.id}
                  isClosed={true}
                  onOperationsChange={() => loadWorkOrders()}
                />
              </div>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedOrder(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </Card>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Nueva Orden de Trabajo</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Presa
                  </label>
                  <select
                    value={selectedDamId}
                    onChange={(e) => setSelectedDamId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {dams.map((dam) => (
                      <option key={dam.id} value={dam.id}>
                        {dam.code} - {dam.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Orden
                    </label>
                    <select
                      value={newOrder.order_type}
                      onChange={(e) => setNewOrder({ ...newOrder, order_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="preventive">Preventivo</option>
                      <option value="corrective">Correctivo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mes Programado
                    </label>
                    <select
                      value={newOrder.month}
                      onChange={(e) => setNewOrder({ ...newOrder, month: Number(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {MONTHS.map((month, index) => (
                        <option key={index} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={newOrder.title}
                    onChange={(e) => setNewOrder({ ...newOrder, title: e.target.value })}
                    placeholder="Ej: Revisión mensual de compuertas"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={newOrder.description}
                    onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                    placeholder="Describe las tareas a realizar en esta orden de trabajo..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={createWorkOrder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Crear Orden de Trabajo
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
