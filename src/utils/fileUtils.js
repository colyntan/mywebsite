// File validation helpers
export const validateFile = (file, options = {}) => {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;
    
    if (!file) {
        throw new Error('No file provided');
    }
    
    if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type not supported. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size: ${maxSize / (1024 * 1024)}MB`);
    }
    
    return true;
};

export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
