// Application configuration
export const config = {
    api: {
        baseUrl: 'http://localhost:8000/api/v1',
        endpoints: {
            receipts: {
                upload: '/receipts/upload',
                list: '/receipts'
            }
        },
        defaultHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    },
    upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    },
    ui: {
        messageDuration: 5000, // 5 seconds
        loaderDelay: 300 // Delay before showing loader (ms)
    }
};

export default config;
