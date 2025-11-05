import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

interface RatingInfo {
  average_rating: number;
  rating_count: number;
}

export const useVideoRatingInfo = (videoId: number | string) => {
  return useQuery<RatingInfo>({
    queryKey: ["video", videoId, "rating-info"],
    queryFn: async () => {
      const res = await api.get(`/videos/${videoId}/rating-info/`);
      return res.data;
    },
    enabled: !!videoId // videoId null/falsy ise tetiklenmez
  });
};