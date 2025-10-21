import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript interface'leri
export interface SocialActivityImageType {
  id: number;
  image: string;
  social_activity: number;
}

export interface SocialActivityType {
  id: number;
  images: SocialActivityImageType[];
  name: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  icon: string;
  color: string;
  image: string;
  [key: string]: any; 
}

// API'dan sosyal aktiviteleri çekme fonksiyonu
const getSocialActivities = async (): Promise<SocialActivityType[]> => {
  const response = await api.get("/socialactivities/"); // endpointini kontrol et!
  return response.data;
};

// React Query hook'u
export const useSocialActivities = () => {
  return useQuery<SocialActivityType[]>({
    queryKey: ["socialactivities"],
    queryFn: getSocialActivities,
  });
};