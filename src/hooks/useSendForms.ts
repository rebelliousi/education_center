import { useMutation } from "@tanstack/react-query";
import { api } from "../api";

// TypeScript arayüzü
export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  is_verified: boolean;
  verification_code: string;
}

// API'ya form POST fonksiyonu
const postContactForm = async (data: ContactFormPayload) => {
  const response = await api.post("/contacts/", data); // endpointini backend'ine göre ayarla!
  return response.data;
};

// React Query mutation hook'u
export const useContactForm = () => {
  return useMutation({
    mutationFn: postContactForm,
  });
};