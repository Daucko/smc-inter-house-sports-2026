const API_URL = 'http://localhost:3001/api';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const api = {
    async get(endpoint: string) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },

    async post(endpoint: string, data: any) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    }
};
