import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Package, Search, Filter, Image as ImageIcon,
  ChevronRight, ChevronDown, Building2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useDamSelection } from '../contexts/DamSelectionContext';
import { supabase } from '../lib/supabase';

interface InventoryAsset {
  id: string;
  code: string;
  name: string;
  full_code: string;
  description: string;
  extended_description: string;
  status: string;
  owner: string;
  operator: string;
  designer: string;
  construction_manager: string;
  construction_end_date: string;
  commissioning_date: string;
  risk_category: string;
  usage_type: string;
  exploitation_norms_approval: string;
  emergency_plan_approval: string;
  emergency_plan_homologation: string;
  capacity_nmn: number;
  surface_nmn: number;
  avg_precipitation: number;
  avg_inflow: number;
  design_flood: number;
  extreme_flood: number;
  dam_type: string;
  height_above_riverbed: number;
  height_from_foundation: number;
  crest_length: number;
  crest_elevation: number;
  parent_asset_id: string | null;
  children?: InventoryAsset[];
  category_id: string;
}

interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
}

export default function Inventory() {
  const { selectedDam } = useDamSelection();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ACTIVOS');
  const [assets, setAssets] = useState<InventoryAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<InventoryAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'technical'>('general');
  const [filterText, setFilterText] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedDam && activeCategory && categories.length > 0) {
      loadAssets();
    }
  }, [selectedDam, activeCategory, categories]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_asset_categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadAssets = async () => {
    if (!selectedDam) return;

    try {
      setLoading(true);
      const category = categories.find(c => c.code === activeCategory);
      if (!category) return;

      const { data, error } = await supabase
        .from('inventory_assets')
        .select('*')
        .eq('dam_id', selectedDam.id)
        .eq('category_id', category.id)
        .order('sort_order');

      if (error) throw error;

      const tree = buildAssetTree(data || []);
      setAssets(tree);

      if (tree.length > 0 && !selectedAsset) {
        setSelectedAsset(tree[0]);
        if (tree[0].children && tree[0].children.length > 0) {
          setExpandedNodes(new Set([tree[0].id]));
        }
      }
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildAssetTree = (flatAssets: InventoryAsset[]): InventoryAsset[] => {
    const assetMap = new Map<string, InventoryAsset>();
    const roots: InventoryAsset[] = [];

    flatAssets.forEach(asset => {
      assetMap.set(asset.id, { ...asset, children: [] });
    });

    flatAssets.forEach(asset => {
      const node = assetMap.get(asset.id)!;
      if (asset.parent_asset_id) {
        const parent = assetMap.get(asset.parent_asset_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderAssetTree = (assets: InventoryAsset[], level: number = 0) => {
    const filteredAssets = filterText
      ? assets.filter(asset =>
          asset.name.toLowerCase().includes(filterText.toLowerCase()) ||
          asset.code.toLowerCase().includes(filterText.toLowerCase())
        )
      : assets;

    return filteredAssets.map(asset => {
      const isExpanded = expandedNodes.has(asset.id);
      const hasChildren = asset.children && asset.children.length > 0;
      const isSelected = selectedAsset?.id === asset.id;

      return (
        <div key={asset.id}>
          <div
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-blue-50 border-l-2 transition-colors ${
              isSelected
                ? 'bg-blue-50 border-blue-600 text-blue-900'
                : 'border-transparent text-gray-700'
            }`}
            style={{ paddingLeft: `${(level * 20) + 12}px` }}
            onClick={() => setSelectedAsset(asset)}
          >
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(asset.id);
                }}
                className="p-0 hover:text-blue-600"
              >
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            ) : (
              <div className="w-4" />
            )}
            <Building2 size={16} className="text-blue-600 flex-shrink-0" />
            <span className="text-sm flex-1 truncate">
              {asset.code} - {asset.name}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <div>
              {renderAssetTree(asset.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (!selectedDam) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-gray-500">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Selecciona una presa desde el mapa</p>
          <p className="text-sm mt-1">para ver su inventario</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#00416A] to-[#4682B4] p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-white">
          {selectedDam.code} {selectedDam.name.toUpperCase()}
        </h1>
      </div>

      <div className="flex gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.code)}
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
              activeCategory === category.code
                ? 'bg-white text-[#0066A1]'
                : 'bg-[#0066A1] text-white hover:bg-[#004d7a]'
            }`}
          >
            {category.name.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="w-72 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">FILTRO</h3>
              <button className="ml-auto p-1 hover:bg-gray-200 rounded">
                <Search size={16} />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <Filter size={16} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Ubicación"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : assets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No hay elementos</p>
              </div>
            ) : (
              renderAssetTree(assets)
            )}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          {selectedAsset ? (
            <>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3">
                <h2 className="text-xl font-bold">{selectedAsset.name.toUpperCase()}</h2>
              </div>

              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'general'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  Datos generales
                </button>
                <button
                  onClick={() => setActiveTab('technical')}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === 'technical'
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  Datos técnicos adicionales
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === 'general' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">Datos generales</h3>
                        <div className="space-y-2">
                          <div className="flex">
                            <span className="text-sm text-gray-700 w-48">Código:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedAsset.code}</span>
                          </div>
                          <div className="flex">
                            <span className="text-sm text-gray-700 w-48">Descripción:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedAsset.name}</span>
                          </div>
                          {selectedAsset.extended_description && (
                            <div className="mt-3">
                              <span className="text-sm text-gray-700 font-semibold">Descripción Ampliada:</span>
                              <p className="text-sm text-gray-900 mt-2 leading-relaxed">
                                {selectedAsset.extended_description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {selectedAsset.parent_asset_id === null && (
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                          {selectedAsset.status && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">En fase de:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedAsset.status}</span>
                            </div>
                          )}
                          {selectedAsset.owner && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Titular de la presa:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedAsset.owner}</span>
                            </div>
                          )}
                          {selectedAsset.operator && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Titular de la explotación:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedAsset.operator}</span>
                            </div>
                          )}
                          {selectedAsset.designer && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Proyectista:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedAsset.designer}</span>
                            </div>
                          )}
                          {selectedAsset.construction_manager && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Dirección de obra:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedAsset.construction_manager}</span>
                            </div>
                          )}
                          {selectedAsset.construction_end_date && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Fin de las obras:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(selectedAsset.construction_end_date).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                          )}
                          {selectedAsset.commissioning_date && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Puesta en explotación:</span>
                              <span className="text-sm font-medium text-gray-900">
                                {new Date(selectedAsset.commissioning_date).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                          )}
                          {selectedAsset.risk_category && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Categoría según riesgo:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedAsset.risk_category}</span>
                            </div>
                          )}
                          {selectedAsset.usage_type && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Usos del embalse:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedAsset.usage_type}</span>
                            </div>
                          )}
                          {selectedAsset.emergency_plan_approval && (
                            <div className="flex">
                              <span className="text-sm text-gray-700 w-64">Aprobación del Plan de Emergencia:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedAsset.emergency_plan_approval}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Fotografías</h3>
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src="https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt={selectedAsset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {selectedAsset.parent_asset_id === null && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h3 className="font-semibold text-blue-900 mb-3">Datos hidráulicos</h3>
                          <div className="space-y-2">
                            {selectedAsset.capacity_nmn && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Capacidad (NMN) (hm³):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.capacity_nmn}</span>
                              </div>
                            )}
                            {selectedAsset.surface_nmn && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Superficie (NMN)(ha):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.surface_nmn}</span>
                              </div>
                            )}
                            {selectedAsset.avg_precipitation !== undefined && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Precipitación media anual (mm):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.avg_precipitation}</span>
                              </div>
                            )}
                            {selectedAsset.avg_inflow !== undefined && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Aportación media anual (hm³):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.avg_inflow}</span>
                              </div>
                            )}
                            {selectedAsset.design_flood && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Avenida de proyecto(m³/s):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.design_flood}</span>
                              </div>
                            )}
                            {selectedAsset.extreme_flood && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Avenida extrema(m³/s):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.extreme_flood}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedAsset.parent_asset_id === null && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h3 className="font-semibold text-green-900 mb-3">Datos técnicos</h3>
                          <div className="space-y-2">
                            {selectedAsset.dam_type && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Tipo de presa:</span>
                                <span className="font-medium text-gray-900">{selectedAsset.dam_type}</span>
                              </div>
                            )}
                            {selectedAsset.height_above_riverbed && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Altura sobre cauce (m):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.height_above_riverbed}</span>
                              </div>
                            )}
                            {selectedAsset.height_from_foundation && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Altura desde cimientos (m):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.height_from_foundation}</span>
                              </div>
                            )}
                            {selectedAsset.crest_length && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Longitud de coronación (m):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.crest_length}</span>
                              </div>
                            )}
                            {selectedAsset.crest_elevation && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Cota coronación (m):</span>
                                <span className="font-medium text-gray-900">{selectedAsset.crest_elevation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="text-center py-12 text-gray-500">
                      <p>No hay datos técnicos adicionales registrados</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Selecciona un elemento del inventario</p>
                <p className="text-sm mt-1">para ver sus detalles</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
