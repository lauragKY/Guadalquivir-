import { supabase } from '../lib/supabase';
import { alfrescoService, AlfrescoNode } from './alfrescoService';
import { TechnicalDocument } from '../types';

interface UploadDocumentOptions {
  damId: string;
  folderId: string;
  documentType: string;
  title: string;
  description?: string;
  version: string;
  tags?: string[];
  customMetadata?: Record<string, any>;
}

interface UploadToAlfrescoResult {
  alfrescoNode: AlfrescoNode;
  document: TechnicalDocument;
}

export class DocumentService {
  async uploadDocumentToAlfresco(
    file: File,
    options: UploadDocumentOptions
  ): Promise<UploadToAlfrescoResult> {
    if (!alfrescoService.isConfigured()) {
      throw new Error('Alfresco no está configurado correctamente');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    let parentFolderId = options.folderId;

    if (!parentFolderId) {
      const docLibrary = await alfrescoService.getSiteDocumentLibrary();
      parentFolderId = docLibrary.id;
    }

    const alfrescoNode = await alfrescoService.uploadDocument(
      parentFolderId,
      file,
      {
        name: file.name,
        title: options.title,
        description: options.description,
        properties: {
          'sipresas:damId': options.damId,
          'sipresas:documentType': options.documentType,
          'sipresas:version': options.version,
          'sipresas:tags': options.tags?.join(',') || '',
          ...options.customMetadata,
        },
      }
    );

    const { data: document, error } = await supabase
      .from('technical_documents')
      .insert({
        dam_id: options.damId,
        folder_id: options.folderId,
        document_type: options.documentType,
        title: options.title,
        description: options.description || '',
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        version: options.version,
        tags: options.tags || [],
        storage_location: 'alfresco',
        alfresco_node_id: alfrescoNode.id,
        alfresco_metadata: {
          nodeType: alfrescoNode.nodeType,
          createdAt: alfrescoNode.createdAt,
          createdBy: alfrescoNode.createdByUser.displayName,
          modifiedAt: alfrescoNode.modifiedAt,
          modifiedBy: alfrescoNode.modifiedByUser.displayName,
          content: alfrescoNode.content,
        },
        uploaded_by: user.id,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      await alfrescoService.deleteNode(alfrescoNode.id, true);
      throw error;
    }

    return {
      alfrescoNode,
      document: document as TechnicalDocument,
    };
  }

  async downloadDocumentFromAlfresco(
    documentId: string
  ): Promise<{ blob: Blob; document: TechnicalDocument }> {
    const { data: document, error } = await supabase
      .from('technical_documents')
      .select('*')
      .eq('id', documentId)
      .maybeSingle();

    if (error || !document) {
      throw new Error('Documento no encontrado');
    }

    if (document.storage_location !== 'alfresco' || !document.alfresco_node_id) {
      throw new Error('El documento no está almacenado en Alfresco');
    }

    const blob = await alfrescoService.downloadDocument(document.alfresco_node_id);

    return { blob, document: document as TechnicalDocument };
  }

  async syncDocumentFromAlfresco(nodeId: string, damId: string, folderId: string): Promise<TechnicalDocument> {
    const alfrescoNode = await alfrescoService.getNode(nodeId);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const existingDoc = await supabase
      .from('technical_documents')
      .select('*')
      .eq('alfresco_node_id', nodeId)
      .maybeSingle();

    if (existingDoc.data) {
      const { data: updated, error } = await supabase
        .from('technical_documents')
        .update({
          alfresco_metadata: {
            nodeType: alfrescoNode.nodeType,
            createdAt: alfrescoNode.createdAt,
            createdBy: alfrescoNode.createdByUser.displayName,
            modifiedAt: alfrescoNode.modifiedAt,
            modifiedBy: alfrescoNode.modifiedByUser.displayName,
            content: alfrescoNode.content,
          },
          file_size: alfrescoNode.content?.sizeInBytes || 0,
        })
        .eq('id', existingDoc.data.id)
        .select()
        .single();

      if (error) throw error;
      return updated as TechnicalDocument;
    }

    const properties = alfrescoNode.properties || {};
    const { data: newDoc, error: insertError } = await supabase
      .from('technical_documents')
      .insert({
        dam_id: damId,
        folder_id: folderId,
        document_type: properties['sipresas:documentType'] || 'other',
        title: properties['cm:title'] || alfrescoNode.name,
        description: properties['cm:description'] || '',
        file_name: alfrescoNode.name,
        file_size: alfrescoNode.content?.sizeInBytes || 0,
        mime_type: alfrescoNode.content?.mimeType || 'application/octet-stream',
        version: properties['sipresas:version'] || '1.0',
        tags: properties['sipresas:tags']?.split(',').filter(Boolean) || [],
        storage_location: 'alfresco',
        alfresco_node_id: nodeId,
        alfresco_metadata: {
          nodeType: alfrescoNode.nodeType,
          createdAt: alfrescoNode.createdAt,
          createdBy: alfrescoNode.createdByUser.displayName,
          modifiedAt: alfrescoNode.modifiedAt,
          modifiedBy: alfrescoNode.modifiedByUser.displayName,
          content: alfrescoNode.content,
        },
        uploaded_by: user.id,
        status: 'active',
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newDoc as TechnicalDocument;
  }

  async deleteDocumentFromAlfresco(
    documentId: string,
    permanent: boolean = false
  ): Promise<void> {
    const { data: document, error } = await supabase
      .from('technical_documents')
      .select('*')
      .eq('id', documentId)
      .maybeSingle();

    if (error || !document) {
      throw new Error('Documento no encontrado');
    }

    if (document.storage_location === 'alfresco' && document.alfresco_node_id) {
      await alfrescoService.deleteNode(document.alfresco_node_id, permanent);
    }

    const { error: deleteError } = await supabase
      .from('technical_documents')
      .delete()
      .eq('id', documentId);

    if (deleteError) throw deleteError;
  }

  async searchDocumentsInAlfresco(
    query: string,
    damId?: string
  ): Promise<AlfrescoNode[]> {
    let searchQuery = query;

    if (damId) {
      searchQuery = `${query} AND sipresas:damId:"${damId}"`;
    }

    const result = await alfrescoService.searchDocuments(searchQuery);
    return result.list.entries.map((entry) => entry.entry);
  }

  async syncFolderFromAlfresco(
    alfrescoFolderId: string,
    damId: string,
    supabaseFolderId: string
  ): Promise<TechnicalDocument[]> {
    const children = await alfrescoService.getNodeChildren(alfrescoFolderId);
    const syncedDocs: TechnicalDocument[] = [];

    for (const entry of children.list.entries) {
      const node = entry.entry;

      if (node.isFile) {
        try {
          const doc = await this.syncDocumentFromAlfresco(
            node.id,
            damId,
            supabaseFolderId
          );
          syncedDocs.push(doc);
        } catch (error) {
          console.error(`Error syncing document ${node.name}:`, error);
        }
      }
    }

    return syncedDocs;
  }

  async getDocumentsByStorageLocation(
    location: 'supabase' | 'alfresco',
    damId?: string
  ): Promise<TechnicalDocument[]> {
    let query = supabase
      .from('technical_documents')
      .select(`
        *,
        dam:dams(*),
        folder:document_folders(*),
        uploader:user_profiles!technical_documents_uploaded_by_fkey(*)
      `)
      .eq('storage_location', location)
      .order('created_at', { ascending: false });

    if (damId) {
      query = query.eq('dam_id', damId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as TechnicalDocument[];
  }

  async testAlfrescoConnection(): Promise<boolean> {
    return alfrescoService.testConnection();
  }

  isAlfrescoConfigured(): boolean {
    return alfrescoService.isConfigured();
  }
}

export const documentService = new DocumentService();
