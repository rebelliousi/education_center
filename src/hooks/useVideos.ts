import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export interface VideosType {
  id: number;
  title: string;
  description: string;
  duration: string;
  views: string;
  rating: string;
  category: string;
  thumbnail: string;
  instructor: string;
  featured: boolean;
  [key: string]: any;
  video_file?: string;
}

const getVideos = async (): Promise<VideosType[]> => {
  const response = await api.get("/videos/");
  return response.data;
};

export const useVideos = () => {
  return useQuery<VideosType[]>({
    queryKey: ["videos"],
    queryFn: getVideos,
    staleTime: 0, // Her mount'ta taze veri
    refetchOnMount: true, // SPA'da route değişiminde her zaman fetch et
    refetchOnWindowFocus: true,
  });
};