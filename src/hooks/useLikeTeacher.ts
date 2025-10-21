import { useMutation } from "@tanstack/react-query";
import { api } from "../api"; // Senin axios instance'ın

const likeTeacher = async (teacherId: number | string) => {
  const response = await api.post(`/teachers/${teacherId}/like/`);
  return response.data;
};

export const useLikeTeacher = () => {
  return useMutation({
    mutationKey: ["like-teacher"],
    mutationFn: likeTeacher,
  });
};