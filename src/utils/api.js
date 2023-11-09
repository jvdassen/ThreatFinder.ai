import axios from 'axios';
import {getDomain} from './getDomain';

export const api = axios.create({
    baseURL: getDomain(),
    headers: {'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')}
});

api.interceptors.response.use(
    function(response) {
        if (response.data.token) sessionStorage.setItem('token', response.data.token);
        return response;
    },
    function(error) {
        if (error.response.status === 401 || error.response.status === 403) {
            if (window.location.pathname !== '/login') {
                sessionStorage.clear();
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);