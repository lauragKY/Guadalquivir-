/*
  # Add Alfresco Integration to Technical Documents

  1. Changes to technical_documents table
    - Add alfresco_node_id column to store Alfresco node reference
    - Add storage_location column to indicate where document is stored
    - Add alfresco_metadata column for additional Alfresco properties

  2. Important Notes
    - Documents can be stored in Supabase Storage OR Alfresco
    - storage_location indicates which system stores the file
    - alfresco_node_id is the unique identifier in Alfresco
    - Maintains backward compatibility with existing documents
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'technical_documents' AND column_name = 'alfresco_node_id'
  ) THEN
    ALTER TABLE technical_documents 
    ADD COLUMN alfresco_node_id text;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'technical_documents' AND column_name = 'storage_location'
  ) THEN
    ALTER TABLE technical_documents 
    ADD COLUMN storage_location text DEFAULT 'supabase' CHECK (storage_location IN ('supabase', 'alfresco'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'technical_documents' AND column_name = 'alfresco_metadata'
  ) THEN
    ALTER TABLE technical_documents 
    ADD COLUMN alfresco_metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_technical_documents_alfresco_node_id 
  ON technical_documents(alfresco_node_id);

CREATE INDEX IF NOT EXISTS idx_technical_documents_storage_location 
  ON technical_documents(storage_location);

COMMENT ON COLUMN technical_documents.alfresco_node_id IS 
  'Alfresco node ID for documents stored in Alfresco ECM';

COMMENT ON COLUMN technical_documents.storage_location IS 
  'Indicates where the document file is stored: supabase or alfresco';

COMMENT ON COLUMN technical_documents.alfresco_metadata IS 
  'Additional metadata from Alfresco including version, properties, etc.';
