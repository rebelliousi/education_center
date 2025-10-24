import { useQuery } from "@tanstack/react-query";

// TypeScript interface for center stats
export interface CenterStats {
  courses: number;
  teachers: number;
  students: number;
}

// API fetch function
const getCenterStats = async (): Promise<CenterStats> => {
  const response = await fetch("/api/v1/center/stats/");
  if (!response.ok) throw new Error("Failed to fetch center stats");
  return response.json();
};

// React Query hook
export const useCenterStats = () => {
  return useQuery<CenterStats>({
    queryKey: ["centerStats"],
    queryFn: getCenterStats,
  });
};
