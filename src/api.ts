// Hatalı import satırı buydu:
// import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// DOĞRU YÖNTEM:
// 1. Çalışma zamanında kullanılacak 'axios' objesini normal import et.
import axios from 'axios';
// 2. Sadece tür bildirmek için kullanılacakları 'import type' ile import et.
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { host } from './host';

// Tarayıcıdaki cookie'ler arasından ismi verilen cookie'yi bulup değerini döndüren yardımcı bir fonksiyon.
function getCookie(name: string): string | null {
    let cookieValue: string | null = null;
    if (document.cookie && document.cookie !== '') {
        const cookies: string[] = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie: string = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Merkezi Axios instance'ımızı oluşturuyoruz.
export const api: AxiosInstance = axios.create({
    baseURL: host,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true 
});

// INTERCEPTOR KISMI (DEĞİŞİKLİK YOK, AYNI KALIYOR)
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const method = config.method ? config.method.toUpperCase() : '';

        if (!['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(method)) {
            const csrftoken = getCookie('csrftoken');
            if (csrftoken) {
                config.headers['X-CSRFToken'] = csrftoken;
            }
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);