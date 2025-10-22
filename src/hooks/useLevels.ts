import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// Level veri tipini tanımla
export interface LevelType {
  id: number;
  name: string;
  order: number;
  [key: string]: any;
}

// API'dan seviyeleri çekme fonksiyonu
const getLevels = async (): Promise<LevelType[]> => {
  const response = await api.get("/levels/");
  return response.data;
};

// React Query hook'u
export const useLevels = () => {
  return useQuery<LevelType[]>({
    queryKey: ["levels"],
    queryFn: getLevels,
  });
};