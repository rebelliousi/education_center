import { useMutation } from "@tanstack/react-query";
import { api } from "../api"; // Senin axios instance'ın

// Video izlenme endpointi için fonksiyon
const viewVideo = async (videoId: number | string) => {
  const response = await api.post(`/videos/${videoId}/viewed/`);
  return response.data;
};

// React Query mutation hook'u
export const useViewVideo = () => {
  return useMutation({
    mutationKey: ["view-video"],
    mutationFn: viewVideo,
  });
};