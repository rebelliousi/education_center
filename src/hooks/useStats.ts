import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript interface for center stats
export interface CenterStats {
  courses: number;
  teachers: number;
  videos: number;
}

// API fetch function
const getCenterStats = async (): Promise<CenterStats> => {
  const response = await api.get("/stats/");
  return response.data;
};

// React Query hook
export const useCenterStats = () => {
  return useQuery<CenterStats>({
    queryKey: ["centerStats"],
    queryFn: getCenterStats,
  });
};




