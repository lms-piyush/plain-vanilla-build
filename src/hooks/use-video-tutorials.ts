import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url?: string;
  created_by: string;
  created_at: string;
  is_active: boolean;
}

export const useVideoTutorials = () => {
  const [tutorials, setTutorials] = useState<VideoTutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTutorials = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('video_tutorials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching video tutorials:', fetchError);
        setError('Failed to load video tutorials');
        return;
      }

      setTutorials(data || []);
    } catch (err) {
      console.error('Error in fetchTutorials:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  // Helper function to get YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  // Helper function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    // Default placeholder thumbnail
    return '/placeholder.svg';
  };

  // Helper function to open video in new tab
  const openVideo = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return {
    tutorials,
    isLoading,
    error,
    getYouTubeThumbnail,
    openVideo,
    refetch: fetchTutorials
  };
};