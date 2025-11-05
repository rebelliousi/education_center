import { useMutation } from "@tanstack/react-query";
import { api } from "../api"; // Senin axios instance'ın

// Teacher'a like at (POST /api/v1/center/teachers/{id}/like/)
const likeTeacher = async (teacherId: number | string) => {
  const response = await api.post(`/teachers/${teacherId}/like/`);
  return response.data; // Tüm teacher objesi veya success döner
};

// Teacher'dan like kaldır (POST /api/v1/center/teachers/{id}/remove_like/)
const removeLikeTeacher = async (teacherId: number | string) => {
  const response = await api.post(`/teachers/${teacherId}/remove_like/`);
  return response.data;
};

// Hook: Teacher'a like ekle
export const useLikeTeacher = () => {
  return useMutation({
    mutationKey: ["like-teacher"],
    mutationFn: likeTeacher,
  });
};

// Hook: Teacher like'ını kaldır
export const useRemoveLikeTeacher = () => {
  return useMutation({
    mutationKey: ["remove-like-teacher"],
    mutationFn: removeLikeTeacher,
  });
};