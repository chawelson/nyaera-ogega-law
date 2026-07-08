import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    '⚠️ Supabase environment variables not configured. ' +
    'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseServiceKey || '');

/**
 * Uploads a draft document to Supabase Storage.
 * The file is stored under `draft-documents/{orderId}/{fileName}`.
 */
export const uploadDraftDocument = async (orderId: string, file: File) => {
  const { data, error } = await supabase.storage
    .from('draft-documents')
    .upload(`${orderId}/${file.name}`, file, {
      cacheControl: '3600',
      upsert: true,
    });
  return { data, error };
};

/**
 * Uploads a draft document buffer to Supabase Storage.
 * Useful for server-side uploads where we have a Buffer/Uint8Array.
 */
export const uploadDraftDocumentBuffer = async (
  orderId: string,
  fileName: string,
  buffer: Buffer | Uint8Array,
  contentType: string = 'application/pdf'
) => {
  const { data, error } = await supabase.storage
    .from('draft-documents')
    .upload(`${orderId}/${fileName}`, buffer, {
      contentType,
      cacheControl: '3600',
      upsert: true,
    });
  return { data, error };
};

/**
 * Generates a signed URL for downloading a document from Supabase Storage.
 * The URL expires after 24 hours (86400 seconds).
 */
export const getDownloadUrl = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('draft-documents')
    .createSignedUrl(path, 86400); // 24-hour expiry
  return { data, error };
};

/**
 * Downloads a file from Supabase Storage as a Blob.
 * Useful for server-side processing (e.g., adding watermarks).
 */
export const downloadFromSupabase = async (path: string): Promise<Blob | null> => {
  const { data, error } = await supabase.storage
    .from('draft-documents')
    .download(path);

  if (error) {
    console.error('❌ [Supabase] Download failed:', error.message);
    return null;
  }

  return data;
};

/**
 * Lists all files in a specific order's folder.
 */
export const listOrderFiles = async (orderId: string) => {
  const { data, error } = await supabase.storage
    .from('draft-documents')
    .list(orderId);

  return { data, error };
};

/**
 * Deletes a file from Supabase Storage.
 */
export const deleteFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('draft-documents')
    .remove([path]);

  return { data, error };
};
