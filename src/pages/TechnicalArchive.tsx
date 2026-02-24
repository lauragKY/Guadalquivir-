import { useEffect, useState } from 'react';
import { FileText, Folder, FolderOpen, Download, Eye, CheckCircle, Clock, XCircle, Filter, Search, Upload, Database, Server, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { TechnicalDocument, DocumentFolder } from '../types';
import { getDocumentFolders, getTechnicalDocuments, getDams } from '../services/api';
import { documentService } from '../services/documentService';

const DOCUMENT_TYPES = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'Proyecto', label: 'Proyecto' },
  { value: 'Normativa', label: 'Normativa' },
  { value: 'Informe', label: 'Informe' },
  { value: 'Plano', label: 'Plano' },
  { value: 'Manual', label: 'Manual' },
  { value: 'Certificado', label: 'Certificado' },
  { value: 'Acta', label: 'Acta' },
];

const DOCUMENT_STATUSES = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'draft', label: 'Borrador' },
  { value: 'archived', label: 'Archivado' },
  { value: 'obsolete', label: 'Obsoleto' },
];

export default function TechnicalArchive() {
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [documents, setDocuments] = useState<TechnicalDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<TechnicalDocument[]>([]);
  const [selectedDamId, setSelectedDamId] = useState<string>('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<TechnicalDocument | null>(null);
  const [dams, setDams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [alfrescoConnected, setAlfrescoConnected] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [filters, setFilters] = useState({
    documentType: 'all',
    status: 'all',
    storageLocation: 'all',
  });

  useEffect(() => {
    loadDams();
    checkAlfrescoConnection();
  }, []);

  useEffect(() => {
    if (selectedDamId) {
      loadFolders();
      loadDocuments();
    }
  }, [selectedDamId, selectedFolderId]);

  useEffect(() => {
    applyFilters();
  }, [documents, filters, searchTerm]);

  const checkAlfrescoConnection = async () => {
    try {
      const isConnected = await documentService.testAlfrescoConnection();
      setAlfrescoConnected(isConnected);
    } catch (error) {
      console.error('Error checking Alfresco connection:', error);
      setAlfrescoConnected(false);
    }
  };

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

  const loadFolders = async () => {
    try {
      setLoading(true);
      const foldersData = await getDocumentFolders(selectedDamId);
      setFolders(buildFolderTree(foldersData));
    } catch (error) {
      console.error('Error loading folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const docsData = await getTechnicalDocuments(selectedDamId, selectedFolderId || undefined);
      setDocuments(docsData);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const buildFolderTree = (flatFolders: DocumentFolder[]): DocumentFolder[] => {
    const folderMap = new Map<string, DocumentFolder>();
    const rootFolders: DocumentFolder[] = [];

    flatFolders.forEach(folder => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    folderMap.forEach(folder => {
      if (folder.parent_id) {
        const parent = folderMap.get(folder.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(folder);
        }
      } else {
        rootFolders.push(folder);
      }
    });

    return rootFolders;
  };

  const handleUploadToAlfresco = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !selectedDamId) return;

    try {
      setUploading(true);
      await documentService.uploadDocumentToAlfresco(uploadFile, {
        damId: selectedDamId,
        folderId: selectedFolderId || '',
        documentType: 'Informe',
        title: uploadFile.name,
        description: 'Documento subido a Alfresco',
        version: '1.0',
      });

      setShowUploadModal(false);
      setUploadFile(null);
      loadDocuments();
      alert('Documento subido exitosamente a Alfresco');
    } catch (error) {
      console.error('Error uploading to Alfresco:', error);
      alert('Error al subir documento a Alfresco');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadDocument = async (doc: TechnicalDocument) => {
    try {
      if (doc.storage_location === 'alfresco') {
        const { blob, document } = await documentService.downloadDocumentFromAlfresco(doc.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = document.file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Descarga desde Supabase Storage no implementada aún');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Error al descargar documento');
    }
  };

  const applyFilters = () => {
    let filtered = [...documents];

    if (filters.documentType !== 'all') {
      filtered = filtered.filter(doc => doc.document_type === filters.documentType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(doc => doc.status === filters.status);
    }

    if (filters.storageLocation !== 'all') {
      filtered = filtered.filter(doc => doc.storage_location === filters.storageLocation);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        doc =>
          doc.name.toLowerCase().includes(term) ||
          doc.description?.toLowerCase().includes(term) ||
          doc.file_name.toLowerCase().includes(term)
      );
    }

    setFilteredDocuments(filtered);
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (folders: DocumentFolder[], level: number = 0) => {
    return folders.map(folder => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = selectedFolderId === folder.id;
      const hasChildren = folder.children && folder.children.length > 0;

      return (
        <div key={folder.id}>
          <div
            className={`flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-blue-50 rounded transition-colors ${
              isSelected ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => {
              setSelectedFolderId(folder.id);
              if (hasChildren) toggleFolder(folder.id);
            }}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
                className="focus:outline-none"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            {!hasChildren && <span className="w-3"></span>}
            {isExpanded || isSelected ? (
              <FolderOpen className="h-4 w-4 text-blue-600" />
            ) : (
              <Folder className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-sm font-medium">{folder.name}</span>
          </div>
          {hasChildren && isExpanded && renderFolderTree(folder.children!, level + 1)}
        </div>
      );
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'archived':
        return <FileText className="h-4 w-4 text-gray-600" />;
      case 'obsolete':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      approved: 'Aprobado',
      draft: 'Borrador',
      archived: 'Archivado',
      obsolete: 'Obsoleto',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'obsolete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
            <FileText className="h-7 w-7 text-blue-600" />
            Archivo Técnico
          </h1>
          <p className="text-gray-600 mt-1">Gestión documental y archivo técnico de la presa</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${alfrescoConnected ? 'bg-green-50' : 'bg-gray-50'}`}>
            <Database className={`h-4 w-4 ${alfrescoConnected ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${alfrescoConnected ? 'text-green-700' : 'text-gray-500'}`}>
              Alfresco {alfrescoConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
          {alfrescoConnected && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Subir a Alfresco
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documentos</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Alfresco</p>
              <p className="text-2xl font-bold text-blue-600">
                {documents.filter(d => d.storage_location === 'alfresco').length}
              </p>
            </div>
            <Database className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Supabase</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.storage_location === 'supabase').length}
              </p>
            </div>
            <Server className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aprobados</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => d.status === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Carpetas</p>
              <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
            </div>
            <Folder className="h-8 w-8 text-blue-600" />
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

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Filtros:</span>
            </div>

            <select
              value={filters.documentType}
              onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {DOCUMENT_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            <select
              value={filters.storageLocation}
              onChange={(e) => setFilters({ ...filters, storageLocation: e.target.value })}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los almacenes</option>
              <option value="alfresco">Alfresco</option>
              <option value="supabase">Supabase</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 divide-x divide-gray-200">
          <div className="lg:col-span-1 p-4 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Estructura de Carpetas</h3>
            <div className="space-y-1">
              <div
                className={`flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-blue-50 rounded transition-colors ${
                  selectedFolderId === null ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                }`}
                onClick={() => setSelectedFolderId(null)}
              >
                <Folder className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Todos los documentos</span>
              </div>
              {renderFolderTree(folders)}
            </div>
          </div>

          <div className="lg:col-span-3 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Documentos ({filteredDocuments.length})
            </h3>

            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No hay documentos en esta ubicación</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedDocument?.id === doc.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="h-5 w-5 text-blue-600 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">{doc.name}</h4>
                          {doc.description && (
                            <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <Badge variant="info">{doc.document_type}</Badge>
                            <span className={`px-2 py-1 rounded font-medium ${getStatusColor(doc.status)}`}>
                              {getStatusLabel(doc.status)}
                            </span>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded ${doc.storage_location === 'alfresco' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                              {doc.storage_location === 'alfresco' ? (
                                <Database className="h-3 w-3" />
                              ) : (
                                <Server className="h-3 w-3" />
                              )}
                              <span className="font-medium">
                                {doc.storage_location === 'alfresco' ? 'Alfresco' : 'Supabase'}
                              </span>
                            </div>
                            <span>v{doc.version}</span>
                            <span>•</span>
                            <span>{formatFileSize(doc.file_size)}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString('es-ES')}</span>
                            {doc.uploader && (
                              <>
                                <span>•</span>
                                <span>{doc.uploader.full_name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Ver"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadDocument(doc);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="Descargar"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {selectedDocument && (
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Información del Documento</h3>
                <div className="flex items-center gap-2">
                  {selectedDocument.code && <Badge variant="info">{selectedDocument.code}</Badge>}
                  {getStatusIcon(selectedDocument.status)}
                  <span className="text-sm text-gray-600">{getStatusLabel(selectedDocument.status)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre del archivo</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedDocument.file_name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de documento</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedDocument.document_type}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tamaño</label>
                  <p className="text-sm text-gray-900 mt-1">{formatFileSize(selectedDocument.file_size)}</p>
                </div>

                {selectedDocument.mime_type && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tipo MIME</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedDocument.mime_type}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Ubicación de Almacenamiento</label>
                  <div className={`flex items-center gap-2 mt-1 px-3 py-2 rounded-lg ${selectedDocument.storage_location === 'alfresco' ? 'bg-blue-50' : 'bg-green-50'}`}>
                    {selectedDocument.storage_location === 'alfresco' ? (
                      <Database className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Server className="h-4 w-4 text-green-600" />
                    )}
                    <span className={`text-sm font-medium ${selectedDocument.storage_location === 'alfresco' ? 'text-blue-700' : 'text-green-700'}`}>
                      {selectedDocument.storage_location === 'alfresco' ? 'Alfresco ECM' : 'Supabase Storage'}
                    </span>
                  </div>
                </div>

                {selectedDocument.alfresco_node_id && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">ID de Nodo Alfresco</label>
                    <p className="text-xs text-gray-600 mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                      {selectedDocument.alfresco_node_id}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700">Versión</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedDocument.version}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha de creación</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedDocument.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                {selectedDocument.uploader && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subido por</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedDocument.uploader.full_name}</p>
                  </div>
                )}

                {selectedDocument.approved_by && selectedDocument.approved_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Aprobado por</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedDocument.approver?.full_name} -{' '}
                      {new Date(selectedDocument.approved_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Subir Documento a Alfresco</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadFile(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadToAlfresco} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccione archivo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="file-upload"
                      required
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {uploadFile ? uploadFile.name : 'Haga clic para seleccionar un archivo'}
                      </p>
                      {uploadFile && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(uploadFile.size)}
                        </p>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Integración con Alfresco ECM</p>
                      <p>El documento se almacenará en el repositorio Alfresco y se sincronizará automáticamente con SIPRESAS.</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadFile(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={uploading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!uploadFile || uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Subir a Alfresco
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
