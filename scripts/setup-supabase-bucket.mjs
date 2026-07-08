/**
 * Script to create the Supabase storage bucket for draft documents.
 * Run: node scripts/setup-supabase-bucket.mjs
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hxdfxtdivccquwwlmanw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZGZ4dGRpdmNjcXV3d2xtYW53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUzNjE1NywiZXhwIjoyMDk5MTEyMTU3fQ.pwlK8CqlBg-X5YYUxOjkmdaf_GLkt2wGnLxEWsQO5Co';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setup() {
  console.log('🔧 Setting up Supabase storage bucket...');

  // Check if bucket already exists
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('❌ Failed to list buckets:', listError.message);
    process.exit(1);
  }

  const existing = buckets.find(b => b.name === 'draft-documents');
  if (existing) {
    console.log('✅ Bucket "draft-documents" already exists');
    return;
  }

  // Create the bucket
  const { data, error } = await supabase.storage.createBucket('draft-documents', {
    public: false,
    fileSizeLimit: 52428800, // 50MB
    allowedMimeTypes: ['application/pdf'],
  });

  if (error) {
    console.error('❌ Failed to create bucket:', error.message);
    process.exit(1);
  }

  console.log('✅ Bucket "draft-documents" created successfully');
}

setup().catch(console.error);
