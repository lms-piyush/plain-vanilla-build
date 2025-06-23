
import { supabase } from "@/integrations/supabase/client";

export const uploadClassThumbnail = async (file: File, classId?: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `class-thumbnails/${fileName}`;

  const { data, error } = await supabase.storage
    .from('uploads') // Changed from 'class-media' to 'uploads' - more standard bucket name
    .upload(filePath, file);

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload thumbnail: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteClassThumbnail = async (thumbnailUrl: string): Promise<void> => {
  if (!thumbnailUrl || !thumbnailUrl.includes('class-thumbnails/')) return;
  
  const filePath = thumbnailUrl.split('/').pop();
  if (!filePath) return;

  const { error } = await supabase.storage
    .from('uploads')
    .remove([`class-thumbnails/${filePath}`]);

  if (error) {
    console.warn('Failed to delete old thumbnail:', error.message);
  }
};

export const uploadCourseMaterial = async (file: File, lessonId?: string): Promise<{ name: string; type: string; url: string }> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `course-materials/${fileName}`;

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

  if (error) {
    console.error('Upload error:', error);
    throw new Error(`Failed to upload material: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return {
    name: file.name,
    type: getFileType(file.type),
    url: publicUrl
  };
};

const getFileType = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'presentation';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
  return 'document';
};
