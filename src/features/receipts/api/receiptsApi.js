const API_BASE_URL = 'http://localhost:8000/api/v1';

export const uploadReceipt = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // In a real app, get this from auth context/store
    const userId = 1;
    
    const response = await fetch(`${API_BASE_URL}/receipts/upload?user_id=${userId}`, {
        method: 'POST',
        body: formData,
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to process receipt');
    }
    
    return await response.json();
};

export const getReceipts = async (userId, { page = 1, limit = 10 } = {}) => {
    const response = await fetch(
        `${API_BASE_URL}/receipts?user_id=${userId}&page=${page}&limit=${limit}`
    );
    
    if (!response.ok) {
        throw new Error('Failed to fetch receipts');
    }
    
    return await response.json();
};
