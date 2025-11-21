// UI helper functions
export const showElement = (element, display = 'block') => {
    if (!element) return;
    element.style.display = display;
};

export const hideElement = (element) => {
    if (!element) return;
    element.style.display = 'none';
};

export const toggleElement = (element, show, display = 'block') => {
    if (!element) return;
    element.style.display = show ? display : 'none';
};

export const createErrorElement = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    return errorDiv;
};

export const showTemporaryMessage = (container, message, duration = 5000) => {
    if (!container) return;
    
    // Remove any existing messages
    const existingMessage = container.querySelector('.temporary-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = 'temporary-message';
    messageElement.textContent = message;
    
    container.appendChild(messageElement);
    
    // Auto-remove after duration
    setTimeout(() => {
        messageElement.remove();
    }, duration);
    
    return messageElement;
};
