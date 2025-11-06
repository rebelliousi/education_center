import { useQuery } from "@tanstack/react-query";
import { api } from "../api"; // api objeni buraya göre ayarla

// Tip tanımı: her kurs için rating datası
export interface MultiCourseRating {
  course_id: number;
  average_rating: number;
  rating_count: number;
}

// API'den toplu rating datası çekme fonksiyonu
const getMultiCourseRatings = async (courseIds: number[]): Promise<MultiCourseRating[]> => {
  const qs = courseIds.join(",");
  const response = await api.get(`/courses/ratings/?course_ids=${qs}`);
  return response.data; // Array<MultiCourseRating>
};

// React Query hook'u
export const useMultiCourseRatings = (courseIds: number[]) => {
  return useQuery<MultiCourseRating[]>({
    queryKey: ["multi-course-ratings", courseIds],
    queryFn: () => getMultiCourseRatings(courseIds),
    enabled: !!courseIds && courseIds.length > 0, // courseIds varsa fetch et
  });
};