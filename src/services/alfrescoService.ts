interface AlfrescoConfig {
  baseUrl: string;
  username: string;
  password: string;
  siteId?: string;
}

interface AlfrescoNode {
  id: string;
  name: string;
  nodeType: string;
  isFolder: boolean;
  isFile: boolean;
  modifiedAt: string;
  modifiedByUser: {
    id: string;
    displayName: string;
  };
  createdAt: string;
  createdByUser: {
    id: string;
    displayName: string;
  };
  content?: {
    mimeType: string;
    mimeTypeName: string;
    sizeInBytes: number;
    encoding: string;
  };
  properties?: Record<string, any>;
}

interface AlfrescoSearchResult {
  list: {
    entries: Array<{
      entry: AlfrescoNode;
    }>;
    pagination: {
      count: number;
      hasMoreItems: boolean;
      totalItems: number;
      skipCount: number;
      maxItems: number;
    };
  };
}

interface UploadOptions {
  name: string;
  title?: string;
  description?: string;
  nodeType?: string;
  properties?: Record<string, any>;
}

class AlfrescoService {
  private config: AlfrescoConfig;
  private authToken: string | null = null;

  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_ALFRESCO_URL || '',
      username: import.meta.env.VITE_ALFRESCO_USERNAME || '',
      password: import.meta.env.VITE_ALFRESCO_PASSWORD || '',
      siteId: import.meta.env.VITE_ALFRESCO_SITE_ID || 'sipresas',
    };
  }

  private getAuthHeader(): string {
    if (!this.authToken) {
      const credentials = btoa(`${this.config.username}:${this.config.password}`);
      this.authToken = `Basic ${credentials}`;
    }
    return this.authToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}/alfresco/api/-default-/public/alfresco/versions/1${endpoint}`;

    const headers: HeadersInit = {
      Authorization: this.getAuthHeader(),
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Alfresco API error: ${response.status} - ${errorText}`
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async createFolder(
    parentFolderId: string,
    folderName: string,
    title?: string,
    description?: string
  ): Promise<AlfrescoNode> {
    const response = await this.request<{ entry: AlfrescoNode }>(
      `/nodes/${parentFolderId}/children`,
      {
        method: 'POST',
        body: JSON.stringify({
          name: folderName,
          nodeType: 'cm:folder',
          properties: {
            'cm:title': title || folderName,
            'cm:description': description || '',
          },
        }),
      }
    );

    return response.entry;
  }

  async uploadDocument(
    parentFolderId: string,
    file: File,
    options: UploadOptions
  ): Promise<AlfrescoNode> {
    const formData = new FormData();
    formData.append('filedata', file);
    formData.append('name', options.name);
    formData.append('nodeType', options.nodeType || 'cm:content');

    if (options.title) {
      formData.append('cm:title', options.title);
    }
    if (options.description) {
      formData.append('cm:description', options.description);
    }

    if (options.properties) {
      Object.entries(options.properties).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const response = await this.request<{ entry: AlfrescoNode }>(
      `/nodes/${parentFolderId}/children`,
      {
        method: 'POST',
        body: formData,
      }
    );

    return response.entry;
  }

  async getNode(nodeId: string): Promise<AlfrescoNode> {
    const response = await this.request<{ entry: AlfrescoNode }>(
      `/nodes/${nodeId}`
    );
    return response.entry;
  }

  async getNodeChildren(
    nodeId: string,
    skipCount: number = 0,
    maxItems: number = 100
  ): Promise<AlfrescoSearchResult> {
    return this.request<AlfrescoSearchResult>(
      `/nodes/${nodeId}/children?skipCount=${skipCount}&maxItems=${maxItems}`
    );
  }

  async downloadDocument(nodeId: string): Promise<Blob> {
    const url = `${this.config.baseUrl}/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/content`;

    const response = await fetch(url, {
      headers: {
        Authorization: this.getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.status}`);
    }

    return response.blob();
  }

  async updateNode(
    nodeId: string,
    properties: Record<string, any>
  ): Promise<AlfrescoNode> {
    const response = await this.request<{ entry: AlfrescoNode }>(
      `/nodes/${nodeId}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          properties,
        }),
      }
    );

    return response.entry;
  }

  async deleteNode(nodeId: string, permanent: boolean = false): Promise<void> {
    await this.request<void>(`/nodes/${nodeId}?permanent=${permanent}`, {
      method: 'DELETE',
    });
  }

  async searchDocuments(
    query: string,
    skipCount: number = 0,
    maxItems: number = 100
  ): Promise<AlfrescoSearchResult> {
    const searchBody = {
      query: {
        query: query,
        language: 'afts',
      },
      paging: {
        maxItems,
        skipCount,
      },
    };

    return this.request<AlfrescoSearchResult>('/search/request', {
      method: 'POST',
      body: JSON.stringify(searchBody),
    });
  }

  async searchDocumentsByMetadata(
    filters: Record<string, any>,
    skipCount: number = 0,
    maxItems: number = 100
  ): Promise<AlfrescoSearchResult> {
    const conditions = Object.entries(filters)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}:"${value}"`;
        }
        return `${key}:${value}`;
      })
      .join(' AND ');

    return this.searchDocuments(conditions, skipCount, maxItems);
  }

  async getSiteDocumentLibrary(siteId?: string): Promise<AlfrescoNode> {
    const site = siteId || this.config.siteId;
    const response = await this.request<{ entry: AlfrescoNode }>(
      `/sites/${site}/containers/documentLibrary`
    );
    return response.entry;
  }

  async createFolderStructure(
    parentId: string,
    structure: { name: string; title?: string; description?: string }[]
  ): Promise<AlfrescoNode[]> {
    const folders: AlfrescoNode[] = [];

    for (const folder of structure) {
      try {
        const existingChildren = await this.getNodeChildren(parentId);
        const exists = existingChildren.list.entries.find(
          (entry) =>
            entry.entry.isFolder && entry.entry.name === folder.name
        );

        if (exists) {
          folders.push(exists.entry);
        } else {
          const newFolder = await this.createFolder(
            parentId,
            folder.name,
            folder.title,
            folder.description
          );
          folders.push(newFolder);
        }
      } catch (error) {
        console.error(`Error creating folder ${folder.name}:`, error);
        throw error;
      }
    }

    return folders;
  }

  async moveNode(nodeId: string, targetParentId: string): Promise<AlfrescoNode> {
    const response = await this.request<{ entry: AlfrescoNode }>(
      `/nodes/${nodeId}/move`,
      {
        method: 'POST',
        body: JSON.stringify({
          targetParentId,
        }),
      }
    );

    return response.entry;
  }

  async copyNode(nodeId: string, targetParentId: string): Promise<AlfrescoNode> {
    const response = await this.request<{ entry: AlfrescoNode }>(
      `/nodes/${nodeId}/copy`,
      {
        method: 'POST',
        body: JSON.stringify({
          targetParentId,
        }),
      }
    );

    return response.entry;
  }

  isConfigured(): boolean {
    return Boolean(
      this.config.baseUrl &&
      this.config.username &&
      this.config.password
    );
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('/nodes/-root-');
      return true;
    } catch (error) {
      console.error('Alfresco connection test failed:', error);
      return false;
    }
  }
}

export const alfrescoService = new AlfrescoService();

export type { AlfrescoNode, AlfrescoSearchResult, UploadOptions };
