import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript interface'i
export interface CategoryType {
  id: number;
  name: string;
  image?: string;
}

// API'dan kategorileri çekme fonksiyonu
const getCategories = async (): Promise<CategoryType[]> => {
  const response = await api.get("/categories/"); // endpointini backend'ine göre ayarla!
  return response.data;
};

// React Query hook'u
export const useCategories = () => {
  return useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};