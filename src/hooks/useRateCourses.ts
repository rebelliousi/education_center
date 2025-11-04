import { useMutation } from "@tanstack/react-query";
import { api } from "../api";

interface RatePayload {
  rating: number; // 1-5
}

export const useRateCourse = (courseId: number | string) => {
  return useMutation({
    mutationFn: async (payload: RatePayload) => {
      const res = await api.post(`/courses/${courseId}/rate/`, payload);
      return res.data;
    },
  });
};