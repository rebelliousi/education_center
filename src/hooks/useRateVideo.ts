import { useMutation } from "@tanstack/react-query";
import { api } from "../api";

interface RatePayload {
  rating: number; // 1-5
}

export const useRateVideo = (videoId: number | string) => {
  return useMutation({
    mutationFn: async (payload: RatePayload) => {
      const res = await api.post(`/videos/${videoId}/rate/`, payload);
      return res.data;
    },
  });
};