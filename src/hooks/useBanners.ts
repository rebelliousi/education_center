import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

// Banner obje tipini tanımla
export interface BannerType {
  id: number;
  title: string;
  desc: string;
  cta: string;
  url?: string;
  image: string; // veya img, API'ya göre
}

// API'dan banner çekme fonksiyonu
const getBanners = async (): Promise<BannerType[]> => {
  const response = await api.get("/banner/"); // endpointini kendi API'na göre düzelt
  return response.data;
};

// React Query hook'u
export const useBanners = () => {
  return useQuery<BannerType[]>({
    queryKey: ["banners"],
    queryFn: getBanners,
  });
};