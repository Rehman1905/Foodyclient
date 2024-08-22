import axios from 'axios';

export const refreshAccessToken = async () => {
    try {
        if (window) {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post('/api/auth/refresh', { refresh_token: refreshToken });

            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;

            localStorage.setItem('access_token', newAccessToken);
            localStorage.setItem('refresh_token', newRefreshToken);

            return newAccessToken;
        }
    } catch (error) {
        console.error('Failed to refresh access token:', error);
        throw error;
    }
};
