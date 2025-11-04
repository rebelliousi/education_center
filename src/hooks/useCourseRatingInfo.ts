import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

interface RatingInfo {
  average_rating: number;
  rating_count: number;
}

export const useCourseRatingInfo = (courseId: number | string) => {
  return useQuery<RatingInfo>({
    queryKey: ["course", courseId, "rating-info"],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}/rating-info/`);
      return res.data;
    },
    enabled: !!courseId // courseId null/falsy ise tetiklenmez
  });
};