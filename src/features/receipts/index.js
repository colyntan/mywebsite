import { ReceiptProcessor } from './services/receiptProcessor';

// Initialize the receipt processor when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the receipt project page
    if (document.getElementById('upload-form')) {
        new ReceiptProcessor({
            uploadFormId: 'upload-form',
            receiptImageId: 'receipt-image',
            uploadAreaId: 'upload-area',
            resultsSectionId: 'results-section',
            extractedDataId: 'extracted-data',
            loaderId: 'loader',
            saveButtonId: 'save-receipt',
            processAnotherButtonId: 'process-another'
        });
    }
});

export { ReceiptProcessor };
