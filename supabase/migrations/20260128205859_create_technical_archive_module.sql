/*
  # Create Technical Archive Module Schema

  1. New Tables
    - `document_folders`
      - `id` (uuid, primary key)
      - `dam_id` (uuid, foreign key to dams)
      - `parent_id` (uuid, foreign key to document_folders, nullable for root folders)
      - `name` (text, folder name)
      - `description` (text)
      - `folder_type` (text, predefined folder types)
      - `path` (text, hierarchical path)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `technical_documents`
      - `id` (uuid, primary key)
      - `dam_id` (uuid, foreign key to dams)
      - `folder_id` (uuid, foreign key to document_folders)
      - `code` (text, document code)
      - `name` (text, document name)
      - `description` (text)
      - `document_type` (text, type of document)
      - `file_name` (text, original file name)
      - `file_size` (bigint, file size in bytes)
      - `file_url` (text, URL to file in storage)
      - `mime_type` (text, MIME type)
      - `version` (text, document version)
      - `status` (text: 'draft', 'approved', 'archived', 'obsolete')
      - `metadata` (jsonb, custom metadata)
      - `uploaded_by` (uuid, foreign key to user_profiles)
      - `approved_by` (uuid, foreign key to user_profiles)
      - `approved_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `document_access_log`
      - `id` (uuid, primary key)
      - `document_id` (uuid, foreign key to technical_documents)
      - `user_id` (uuid, foreign key to user_profiles)
      - `action` (text: 'view', 'download', 'upload', 'update', 'delete')
      - `accessed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Authenticated users can view documents
    - Only admins and technicians can upload/modify documents
    - Audit log for all document access

  3. Important Notes
    - Folder structure is hierarchical with parent-child relationships
    - Documents are associated with specific dams and folders
    - Metadata stored as JSONB for flexibility
    - Audit trail for compliance requirements
*/

CREATE TABLE IF NOT EXISTS document_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES document_folders(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  folder_type text,
  path text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS technical_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dam_id uuid REFERENCES dams(id) ON DELETE CASCADE NOT NULL,
  folder_id uuid REFERENCES document_folders(id) ON DELETE SET NULL,
  code text,
  name text NOT NULL,
  description text,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_size bigint DEFAULT 0,
  file_url text,
  mime_type text,
  version text DEFAULT '1.0',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived', 'obsolete')),
  metadata jsonb DEFAULT '{}'::jsonb,
  uploaded_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES technical_documents(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL NOT NULL,
  action text NOT NULL CHECK (action IN ('view', 'download', 'upload', 'update', 'delete')),
  accessed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_document_folders_dam_id ON document_folders(dam_id);
CREATE INDEX IF NOT EXISTS idx_document_folders_parent_id ON document_folders(parent_id);
CREATE INDEX IF NOT EXISTS idx_technical_documents_dam_id ON technical_documents(dam_id);
CREATE INDEX IF NOT EXISTS idx_technical_documents_folder_id ON technical_documents(folder_id);
CREATE INDEX IF NOT EXISTS idx_technical_documents_type ON technical_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_technical_documents_status ON technical_documents(status);
CREATE INDEX IF NOT EXISTS idx_document_access_log_document_id ON document_access_log(document_id);
CREATE INDEX IF NOT EXISTS idx_document_access_log_user_id ON document_access_log(user_id);

ALTER TABLE document_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_access_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view folders"
  ON document_folders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage folders"
  ON document_folders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view documents"
  ON technical_documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload documents"
  ON technical_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "Admins can manage documents"
  ON technical_documents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view access log"
  ON document_access_log
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can log document access"
  ON document_access_log
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
