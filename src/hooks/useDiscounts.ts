import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript interface'i
export interface DiscountItemType {
  id: number;
  percentage: number;
  title: string;
  description: string;
  requirements: string;
  popular: boolean;
  valid_until: string;
  courses: string;
  color: string;
  bg_gradient: string;
  icon: string;
  [key: string]: any; 
}

// API'dan indirimleri çekme fonksiyonu
const getDiscountItems = async (): Promise<DiscountItemType[]> => {
  const response = await api.get("/discountitems/"); // API endpointini backend'ine göre kontrol et!
  return response.data;
};

// React Query hook'u
export const useDiscountItems = () => {
  return useQuery<DiscountItemType[]>({
    queryKey: ["discountitems"],
    queryFn: getDiscountItems,
  });
};