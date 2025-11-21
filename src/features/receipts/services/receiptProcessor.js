import { uploadReceipt } from '../api/receiptsApi';
import { validateFile, readFileAsDataURL } from '../../../utils/fileUtils';
import { showElement, hideElement, showTemporaryMessage } from '../../../utils/uiUtils';
import config from '../../../config';

export class ReceiptProcessor {
    constructor(elements) {
        this.elements = {
            // Form elements
            uploadForm: document.getElementById(elements.uploadFormId),
            receiptImage: document.getElementById(elements.receiptImageId),
            uploadArea: document.getElementById(elements.uploadAreaId),
            resultsSection: document.getElementById(elements.resultsSectionId),
            extractedData: document.getElementById(elements.extractedDataId),
            loader: document.getElementById(elements.loaderId),
            saveButton: document.getElementById(elements.saveButtonId),
            processAnotherButton: document.getElementById(elements.processAnotherButtonId),
            // Add any additional elements here
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const { uploadForm, uploadArea, saveButton, processAnotherButton } = this.elements;
        
        // Handle file selection
        uploadForm?.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea?.addEventListener(eventName, this.preventDefaults.bind(this), false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea?.addEventListener(eventName, () => this.highlightArea(true), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea?.addEventListener(eventName, () => this.highlightArea(false), false);
        });

        uploadArea?.addEventListener('drop', (e) => this.handleDrop(e), false);
        
        // Button handlers
        saveButton?.addEventListener('click', () => this.handleSave());
        processAnotherButton?.addEventListener('click', () => this.resetForm());
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlightArea(highlight) {
        const { uploadArea } = this.elements;
        if (!uploadArea) return;
        
        uploadArea.style.borderColor = highlight ? '#3498db' : '#ddd';
        uploadArea.style.backgroundColor = highlight ? 'rgba(52, 152, 219, 0.1)' : '';
    }

    async handleSubmit(e) {
        e.preventDefault();
        const fileInput = document.getElementById('receipt-upload');
        if (fileInput?.files.length > 0) {
            await this.handleFiles(fileInput.files);
        }
    }

    async handleFiles(files) {
        const { receiptImage, uploadArea } = this.elements;
        const file = files[0];
        
        try {
            // Validate file
            validateFile(file, {
                maxSize: config.upload.maxFileSize,
                allowedTypes: config.upload.allowedTypes
            });
            
            this.showLoader(true);
            
            // Preview image
            const imageUrl = await readFileAsDataURL(file);
            if (receiptImage) {
                receiptImage.src = imageUrl;
                receiptImage.onload = () => URL.revokeObjectURL(imageUrl);
            }
            
            // Process with backend
            const result = await uploadReceipt(file);
            this.displayResults(result);
            
        } catch (error) {
            console.error('Error processing file:', error);
            showTemporaryMessage(
                uploadArea || document.body,
                error.message || 'Failed to process receipt',
                config.ui.messageDuration
            );
            this.resetForm();
        } finally {
            this.showLoader(false);
        }
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    }

    displayResults(receiptData) {
        const { resultsSection, extractedData, uploadArea } = this.elements;
        if (!resultsSection || !extractedData) return;
        
        showElement(resultsSection);
        hideElement(uploadArea);
        
        const { merchant_name, total_amount, transaction_date, extracted_data } = receiptData;
        
        let html = `
            <div class="data-row">
                <span class="data-label">Merchant:</span>
                <span class="data-value">${merchant_name || 'Not detected'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Total:</span>
                <span class="data-value">${total_amount ? `$${total_amount.toFixed(2)}` : 'Not detected'}</span>
            </div>
        `;
        
        if (transaction_date) {
            const date = new Date(transaction_date);
            html += `
                <div class="data-row">
                    <span class="data-label">Date:</span>
                    <span class="data-value">${date.toLocaleDateString()}</span>
                </div>
            `;
        }
        
        if (extracted_data?.items?.length > 0) {
            html += `
                <div class="data-section">
                    <h4>Items:</h4>
                    <ul class="item-list">
                        ${extracted_data.items.map(item => 
                            `<li>${item.name || 'Item'} - $${item.price ? item.price.toFixed(2) : '0.00'}</li>`
                        ).join('')}
                    </ul>
                </div>
            `;
        }
        
        extractedData.innerHTML = html || '<p>No data could be extracted from this receipt.</p>';
    }

    showLoader(show) {
        const { loader, uploadArea, resultsSection } = this.elements;
        if (!loader) return;
        
        if (show) {
            showElement(loader);
            hideElement(uploadArea);
            hideElement(resultsSection);
        } else {
            hideElement(loader);
            showElement(uploadArea);
        }
    }
    
    handleSave() {
        // In a real app, you would save the receipt data here
        showTemporaryMessage(
            this.elements.uploadArea || document.body,
            'Receipt saved successfully!',
            config.ui.messageDuration
        );
        this.resetForm();
    }
    
    resetForm() {
        const { uploadForm, receiptImage, extractedData, resultsSection, uploadArea } = this.elements;
        
        uploadForm?.reset();
        if (receiptImage) receiptImage.src = '#';
        if (extractedData) extractedData.innerHTML = '';
        hideElement(resultsSection);
        showElement(uploadArea);
    }
}
