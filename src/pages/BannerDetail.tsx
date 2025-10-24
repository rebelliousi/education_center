import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ImageOff } from "lucide-react";
import { api } from "../api";

const getBannerDetail = async (id: string) => {
  const response = await api.get(`/banner/${id}/`);
  return response.data;
};

const NoisePattern = () => (
  <svg
    className="absolute inset-0 w-full h-full z-20 pointer-events-none"
    style={{ mixBlendMode: "soft-light", opacity: 0.3 }}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
    viewBox="0 0 800 600"
  >
    <filter id="noise" x="0" y="0" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.7"
        numOctaves="3"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="800" height="600" filter="url(#noise)" />
  </svg>
);

const BannerDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { data: banner, isLoading, error } = useQuery({
    queryKey: ["banner", id],
    queryFn: () => getBannerDetail(id as string),
    enabled: !!id,
  });
  const lang = i18n.language || "tr";
  const getTranslated = (obj: any, field: string) =>
    obj?.[`${field}_${lang}`] || obj?.[field] || "";

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-blue-600 text-lg animate-pulse">
          {t("common.loading") || "Yükleniyor..."}
        </span>
      </div>
    );

  if (error || !banner)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-gray-500">
        <ImageOff className="w-12 h-12 mb-3" />
        <span>{t("common.not_found") || "Banner bulunamadı."}</span>
      </div>
    );

  return (
    <div className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden bg-blue-50">
      {/* Arkaplan görseli */}
      {banner.image ? (
        <>
          <img
            src={banner.image}
            alt={getTranslated(banner, "title")}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              imageRendering: "auto",
              objectPosition: "center",
              filter: "blur(16px) brightness(0.7) saturate(1.1)", // Daha yoğun blur ve renk canlılığı
              zIndex: 0,
            }}
          />
          {/* Gradient overlay ile modern soft görünüm */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-200/70 via-indigo-200/30 to-blue-300/60 z-10 pointer-events-none"></div>
          {/* Noise/desen overlay */}
          <NoisePattern />
        </>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-blue-100 flex items-center justify-center">
          <ImageOff className="w-24 h-24 text-blue-300" />
        </div>
      )}
      {/* Sadece başlık ve açıklama gösteriliyor */}
      <div className="relative z-30 max-w-xl mx-auto bg-white/85 rounded-2xl shadow-2xl p-10 text-center border border-blue-100 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">
          {getTranslated(banner, "title")}
        </h1>
        <div className="text-lg text-gray-700">
          {getTranslated(banner, "desc")}
        </div>
      </div>
    </div>
  );
};

export default BannerDetailPage;