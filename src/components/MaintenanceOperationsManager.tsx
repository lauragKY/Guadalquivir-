import { useState, useEffect } from 'react';
import { GripVertical, Edit, Trash2, Plus, Save, X, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Operation {
  id: string;
  work_order_id: string;
  operation_number: number;
  operation_name: string;
  operation_description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  result: string | null;
  notes: string | null;
  completed_at: string | null;
}

interface Props {
  workOrderId: string;
  isClosed: boolean;
  onOperationsChange?: () => void;
}

export default function MaintenanceOperationsManager({ workOrderId, isClosed, onOperationsChange }: Props) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [newOperation, setNewOperation] = useState({
    operation_name: '',
    operation_description: '',
    status: 'pending' as const
  });

  const [editForm, setEditForm] = useState({
    operation_name: '',
    operation_description: '',
    status: 'pending' as const,
    result: '',
    notes: ''
  });

  useEffect(() => {
    loadOperations();
  }, [workOrderId]);

  const loadOperations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_work_order_operations')
        .select('*')
        .eq('work_order_id', workOrderId)
        .order('operation_number', { ascending: true });

      if (error) throw error;
      setOperations(data || []);
    } catch (error) {
      console.error('Error loading operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOperation = async (insertAtIndex?: number) => {
    if (!newOperation.operation_name.trim()) return;

    try {
      let targetNumber: number;

      if (insertAtIndex !== undefined && insertAtIndex < operations.length) {
        targetNumber = insertAtIndex + 1;

        const operationsToUpdate = operations
          .filter(op => op.operation_number >= targetNumber)
          .map(op => ({
            id: op.id,
            operation_number: op.operation_number + 1
          }));

        for (const op of operationsToUpdate) {
          await supabase
            .from('maintenance_work_order_operations')
            .update({ operation_number: op.operation_number })
            .eq('id', op.id);
        }
      } else {
        targetNumber = operations.length + 1;
      }

      const { error } = await supabase
        .from('maintenance_work_order_operations')
        .insert({
          work_order_id: workOrderId,
          operation_number: targetNumber,
          operation_name: newOperation.operation_name,
          operation_description: newOperation.operation_description || null,
          status: newOperation.status
        });

      if (error) throw error;

      setNewOperation({ operation_name: '', operation_description: '', status: 'pending' });
      setAddingNew(false);
      await loadOperations();
      onOperationsChange?.();
    } catch (error) {
      console.error('Error adding operation:', error);
      alert('Error al añadir la operación');
    }
  };

  const updateOperation = async (id: string) => {
    try {
      const updateData: any = {
        operation_name: editForm.operation_name,
        operation_description: editForm.operation_description || null,
        status: editForm.status,
        result: editForm.result || null,
        notes: editForm.notes || null
      };

      if (editForm.status === 'completed' && !operations.find(o => o.id === id)?.completed_at) {
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = (await supabase.auth.getUser()).data.user?.id;
      }

      const { error } = await supabase
        .from('maintenance_work_order_operations')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      await loadOperations();
      onOperationsChange?.();
    } catch (error) {
      console.error('Error updating operation:', error);
      alert('Error al actualizar la operación');
    }
  };

  const deleteOperation = async (id: string) => {
    if (!confirm('¿Eliminar esta operación?')) return;

    try {
      const opToDelete = operations.find(op => op.id === id);
      if (!opToDelete) return;

      const { error: deleteError } = await supabase
        .from('maintenance_work_order_operations')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      const operationsToUpdate = operations
        .filter(op => op.operation_number > opToDelete.operation_number)
        .map(op => ({
          id: op.id,
          operation_number: op.operation_number - 1
        }));

      for (const op of operationsToUpdate) {
        await supabase
          .from('maintenance_work_order_operations')
          .update({ operation_number: op.operation_number })
          .eq('id', op.id);
      }

      await loadOperations();
      onOperationsChange?.();
    } catch (error) {
      console.error('Error deleting operation:', error);
      alert('Error al eliminar la operación');
    }
  };

  const reorderOperation = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    try {
      const newOperations = [...operations];
      const [movedOp] = newOperations.splice(fromIndex, 1);
      newOperations.splice(toIndex, 0, movedOp);

      const updates = newOperations.map((op, index) => ({
        id: op.id,
        operation_number: index + 1
      }));

      for (const update of updates) {
        await supabase
          .from('maintenance_work_order_operations')
          .update({ operation_number: update.operation_number })
          .eq('id', update.id);
      }

      await loadOperations();
      onOperationsChange?.();
    } catch (error) {
      console.error('Error reordering operations:', error);
      alert('Error al reordenar las operaciones');
    }
  };

  const handleDragStart = (index: number) => {
    if (!isClosed) {
      setDraggedIndex(index);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      reorderOperation(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const startEdit = (op: Operation) => {
    setEditingId(op.id);
    setEditForm({
      operation_name: op.operation_name,
      operation_description: op.operation_description || '',
      status: op.status,
      result: op.result || '',
      notes: op.notes || ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'in_progress': return 'En Progreso';
      default: return 'Pendiente';
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-500">Cargando operaciones...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900">Operaciones</h4>
        {!isClosed && (
          <button
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm flex items-center gap-2"
            onClick={() => setAddingNew(true)}
          >
            <Plus className="w-4 h-4" />
            Añadir Operación
          </button>
        )}
      </div>

      {addingNew && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-gray-900 mb-3">Nueva Operación</h5>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Operación *
              </label>
              <input
                type="text"
                value={newOperation.operation_name}
                onChange={(e) => setNewOperation({ ...newOperation, operation_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Inspección visual de aliviadero"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={newOperation.operation_description}
                onChange={(e) => setNewOperation({ ...newOperation, operation_description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="Descripción detallada de la operación..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addOperation()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar al Final
              </button>
              <button
                onClick={() => setAddingNew(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {operations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay operaciones registradas. {!isClosed && 'Añade la primera operación.'}
          </div>
        ) : (
          operations.map((op, index) => (
            <div
              key={op.id}
              draggable={!isClosed}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              className={`flex items-start gap-2 p-3 rounded-lg border ${
                isClosed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
              } ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              {!isClosed && (
                <GripVertical className="w-5 h-5 text-gray-400 cursor-move flex-shrink-0 mt-1" />
              )}

              <div className="flex-1">
                {editingId === op.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.operation_name}
                      onChange={(e) => setEditForm({ ...editForm, operation_name: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <textarea
                      value={editForm.operation_description}
                      onChange={(e) => setEditForm({ ...editForm, operation_description: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      rows={2}
                      placeholder="Descripción..."
                    />
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="completed">Completada</option>
                    </select>
                    <textarea
                      value={editForm.result}
                      onChange={(e) => setEditForm({ ...editForm, result: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      rows={2}
                      placeholder="Resultado de la operación..."
                    />
                    <textarea
                      value={editForm.notes}
                      onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      rows={2}
                      placeholder="Notas adicionales..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateOperation(op.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {index + 1}. {op.operation_name}
                        </p>
                        {op.operation_description && (
                          <p className="text-xs text-gray-600 mt-1">{op.operation_description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(op.status)}`}>
                            {getStatusLabel(op.status)}
                          </span>
                          {op.completed_at && (
                            <span className="text-xs text-gray-500">
                              Completada: {new Date(op.completed_at).toLocaleDateString('es-ES')}
                            </span>
                          )}
                        </div>
                        {op.result && (
                          <p className="text-xs text-gray-700 mt-2">
                            <strong>Resultado:</strong> {op.result}
                          </p>
                        )}
                        {op.notes && (
                          <p className="text-xs text-gray-600 mt-1">
                            <strong>Notas:</strong> {op.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isClosed && editingId !== op.id && (
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => startEdit(op)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="Editar operación"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteOperation(op.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Eliminar operación"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
