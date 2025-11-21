/**
 * Handles receipt image upload, processing, and result display
 * @class ReceiptProcessor
 */
class ReceiptProcessor {
    /**
     * Initialize the ReceiptProcessor with DOM elements and event listeners
     */
    constructor() {
        // Required DOM elements
        this.uploadForm = document.getElementById('upload-form');
        this.receiptImage = document.getElementById('receipt-image');
        this.uploadArea = document.getElementById('upload-area');
        this.resultsSection = document.getElementById('results-section');
        this.extractedData = document.getElementById('extracted-data');
        this.loader = document.getElementById('loader');
        this.saveButton = document.getElementById('save-receipt');
        this.processAnotherButton = document.getElementById('process-another');
        
        // API Configuration
        this.API_BASE_URL = 'http://localhost:8000/api/v1';
        this.MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        this.SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
        
        this.initializeEventListeners();
    }

    /**
     * Set up all event listeners
     */
    initializeEventListeners() {
        // Handle form submission
        this.uploadForm?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Handle drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea?.addEventListener(eventName, this.preventDefaults.bind(this), false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadArea?.addEventListener(eventName, () => this.highlightArea(true), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadArea?.addEventListener(eventName, () => this.highlightArea(false), false);
        });

        this.uploadArea?.addEventListener('drop', (e) => this.handleDrop(e), false);
        
        // Save button
        this.saveButton?.addEventListener('click', async () => {
            try {
                await this.saveReceipt();
                alert('Receipt saved successfully!');
                this.resetForm();
            } catch (error) {
                console.error('Error saving receipt:', error);
                this.showError('Failed to save receipt. Please try again.');
            }
        });
        
        // Process another button
        this.processAnotherButton?.addEventListener('click', () => this.resetForm());
    }

    /**
     * Prevent default behavior for drag and drop events
     * @param {Event} e - The event object
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    /**
     * Highlight the drop area when dragging files over it
     * @param {boolean} highlight - Whether to highlight the area
     */
    highlightArea(highlight) {
        if (this.uploadArea) {
            this.uploadArea.style.borderColor = highlight ? '#3498db' : '#ddd';
            this.uploadArea.style.backgroundColor = highlight ? 'rgba(52, 152, 219, 0.1)' : '';
        }
    }

    /**
     * Handle file drop event
     * @param {DragEvent} e - The drop event
     */
    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    }

    /**
     * Handle form submission
     * @param {Event} e - The submit event
     */
    async handleSubmit(e) {
        e.preventDefault();
        const fileInput = document.getElementById('receipt-upload');
        if (fileInput?.files.length > 0) {
            await this.handleFiles(fileInput.files);
        } else {
            this.showError('Please select a file to upload');
        }
    }

    /**
     * Validate the uploaded file
     * @param {File} file - The file to validate
     * @returns {{isValid: boolean, error?: string}} Validation result
     */
    validateFile(file) {
        if (!file) {
            return { isValid: false, error: 'No file provided' };
        }

        if (file.size > this.MAX_FILE_SIZE) {
            return { 
                isValid: false, 
                error: `File size exceeds ${this.MAX_FILE_SIZE / (1024 * 1024)}MB limit` 
            };
        }

        if (!this.SUPPORTED_FILE_TYPES.includes(file.type)) {
            return { 
                isValid: false, 
                error: `Unsupported file type. Supported types: ${this.SUPPORTED_FILE_TYPES.join(', ')}`
            };
        }

        return { isValid: true };
    }

    /**
     * Process the uploaded files
     * @param {FileList} files - The files to process
     */
    async handleFiles(files) {
        if (!files || files.length === 0) {
            this.showError('No files selected');
            return;
        }

        const file = files[0];
        const validation = this.validateFile(file);
        
        if (!validation.isValid) {
            this.showError(validation.error);
            return;
        }

        try {
            this.showLoader(true);
            
            // Preview the image
            const imageUrl = URL.createObjectURL(file);
            if (this.receiptImage) {
                this.receiptImage.onload = () => URL.revokeObjectURL(imageUrl);
                this.receiptImage.src = imageUrl;
                this.receiptImage.alt = 'Uploaded receipt preview';
            }
            
            // Process the image with the backend API
            const result = await this.processImageWithBackend(file);
            this.displayResults(result);
            
        } catch (error) {
            console.error('Error processing image:', error);
            this.showError(this.getUserFriendlyError(error));
            this.resetForm();
        } finally {
            this.showLoader(false);
        }
    }

    /**
     * Get a user-friendly error message from an error object
     * @param {Error|Object} error - The error object
     * @returns {string} User-friendly error message
     */
    getUserFriendlyError(error) {
        if (error instanceof TypeError) {
            return 'Network error. Please check your connection and try again.';
        }
        
        if (error.message) {
            return error.message;
        }
        
        return 'An unexpected error occurred. Please try again.';
    }

    /**
     * Process the image with the backend API
     * @param {File} file - The image file to process
     * @returns {Promise<Object>} The processed receipt data
     * @throws {Error} If the API request fails
     */
    async processImageWithBackend(file) {
        if (!file) {
            throw new Error('No file provided for processing');
        }

        const formData = new FormData();
        formData.append('file', file);
        
        // In a real app, you would get this from authentication
        const userId = 1;
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/receipts/upload?user_id=${userId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                },
                // Add timeout handling
                signal: AbortSignal.timeout(30000) // 30 second timeout
            });
            
            if (!response.ok) {
                let errorMessage = 'Failed to process receipt';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorMessage;
                } catch (e) {
                    // If we can't parse the error response, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            return await response.json();
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Save the processed receipt
     * @returns {Promise<void>}
     */
    async saveReceipt() {
        // Implement actual save functionality here
        return new Promise((resolve) => {
            // Simulate API call
            setTimeout(resolve, 1000);
        });
    }

    /**
     * Display the processed results
     * @param {Object} receiptData - The processed receipt data
     */
    displayResults(receiptData) {
        if (!this.resultsSection || !this.extractedData) return;
        
        try {
            // Show the results section
            this.resultsSection.classList.remove('hidden');
            if (this.uploadArea) this.uploadArea.style.display = 'none';
            
            // Validate and sanitize data before display
            const { merchant_name, total_amount, transaction_date, extracted_data } = receiptData || {};
            
            // Format date if available
            let formattedDate = 'Not detected';
            if (transaction_date) {
                try {
                    const date = new Date(transaction_date);
                    if (!isNaN(date.getTime())) {
                        formattedDate = date.toLocaleDateString();
                    }
                } catch (e) {
                    console.warn('Invalid date format:', transaction_date);
                }
            }
            
            // Sanitize and escape HTML to prevent XSS
            const escapeHtml = (unsafe) => {
                if (unsafe === null || unsafe === undefined) return '';
                return unsafe.toString()
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            };
            
            // Generate HTML safely
            const html = `
                <div class="data-row">
                    <span class="data-label">Merchant:</span>
                    <span class="data-value">${escapeHtml(merchant_name) || 'Not detected'}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">Total:</span>
                    <span class="data-value">${
                        total_amount !== undefined && total_amount !== null 
                            ? '$' + parseFloat(total_amount).toFixed(2) 
                            : 'Not detected'
                    }</span>
                </div>
                <div class="data-row">
                    <span class="data-label">Date:</span>
                    <span class="data-value">${escapeHtml(formattedDate)}</span>
                </div>
            `;
            
            this.extractedData.innerHTML = html;
            
        } catch (error) {
            console.error('Error displaying results:', error);
            this.showError('Error displaying receipt data');
        }
    }

    /**
     * Show or hide the loading indicator
     * @param {boolean} show - Whether to show the loader
     */
    showLoader(show) {
        if (this.loader) {
            this.loader.style.display = show ? 'flex' : 'none';
        }
    }

    /**
     * Display an error message to the user
     * @param {string} message - The error message to display
     */
    showError(message) {
        if (!message) return;
        
        // In a real app, you might want to use a more sophisticated notification system
        alert(`Error: ${message}`);
    }

    /**
     * Reset the form to its initial state
     */
    resetForm() {
        if (this.uploadForm) {
            this.uploadForm.reset();
        }
        
        if (this.resultsSection) {
            this.resultsSection.classList.add('hidden');
        }
        
        if (this.uploadArea) {
            this.uploadArea.style.display = 'flex';
        }
        
        if (this.receiptImage) {
            this.receiptImage.src = '';
            this.receiptImage.alt = '';
        }
        
        if (this.extractedData) {
            this.extractedData.innerHTML = '';
        }
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the receipt project page
    if (document.getElementById('upload-form')) {
        new ReceiptProcessor();
    }
});
