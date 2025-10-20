import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript interface'i kurs objesine göre tanımla
export interface CourseType {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: number;
  students: number;
  rating: string | number;    // Eğer sayı olacaksa: number
  level: string;
  image: string;
  icon: string;
  color: string;
  category: number;
}

// API'dan kurs çekme fonksiyonu
const getCourses = async (): Promise<CourseType[]> => {
  const response = await api.get("/courses/"); // endpointini kendi API'na göre düzelt
  return response.data;
};

// React Query hook'u
export const useCourses = () => {
  return useQuery<CourseType[]>({
    queryKey: ["courses"],
    queryFn: getCourses,
  });
};