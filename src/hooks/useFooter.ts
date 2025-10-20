
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript interface'i
export interface ContactItemType {
  id: number;
  title: string;
  value: string;
  icon: string;
  order: number;
}

// API'dan iletişim bilgilerini çekme fonksiyonu
const getContactItems = async (): Promise<ContactItemType[]> => {
  const response = await api.get("/footer-data/"); // endpointini backend'ine göre düzenle!
  return response.data;
};

// React Query hook'u
export const useContactItems = () => {
  return useQuery<ContactItemType[]>({
    queryKey: ["contactitems"],
    queryFn: getContactItems,
  });
};