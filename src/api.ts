import axios from 'axios'
import { host } from './host'

export const api=axios.create({
    baseURL:host,
    headers:{
        'Content-Type':'application/json'
    }
})