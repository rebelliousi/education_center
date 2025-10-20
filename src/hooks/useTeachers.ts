import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript interface'i
export interface TeacherType {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  students: number;
  courses: number;
  likes: number;
  rating: string;
  image: string;
  bio: string;
  achievements: string;
  featured: boolean;
  gender: string;
}

// API'dan öğretmenleri çekme fonksiyonu
const getTeachers = async (): Promise<TeacherType[]> => {
  const response = await api.get("/teachers/"); // endpointini backend'ine göre ayarla!
  return response.data;
};

// React Query hook'u
export const useTeachers = () => {
  return useQuery<TeacherType[]>({
    queryKey: ["teachers"],
    queryFn: getTeachers,
  });
};