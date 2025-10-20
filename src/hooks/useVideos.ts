import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript interface'i
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
}

// API'dan çekme fonksiyonu
const getVideos = async (): Promise<VideosType[]> => {
  const response = await api.get("/videos/"); // endpointini backend'ine göre değiştir!
  return response.data;
};

// React Query hook'u
export const useFeaturedCourses = () => {
  return useQuery<VideosType[]>({
    queryKey: ["videos"],
    queryFn: getVideos,
  });
};