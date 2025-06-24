// Receipt Processor - Handles image upload and OCR processing
class ReceiptProcessor {
    constructor() {
        this.uploadForm = document.getElementById('upload-form');
        this.receiptImage = document.getElementById('receipt-image');
        this.uploadArea = document.getElementById('upload-area');
        this.resultsSection = document.getElementById('results-section');
        this.extractedData = document.getElementById('extracted-data');
        this.loader = document.getElementById('loader');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Handle file selection
        this.uploadForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Handle drag and drop
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => this.highlightArea(true), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => this.highlightArea(false), false);
        });

        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlightArea(highlight) {
        this.uploadArea.style.borderColor = highlight ? '#3498db' : '#ddd';
        this.uploadArea.style.backgroundColor = highlight ? 'rgba(52, 152, 219, 0.1)' : '';
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.handleFiles(files);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const fileInput = document.getElementById('receipt-upload');
        if (fileInput.files.length > 0) {
            await this.handleFiles(fileInput.files);
        }
    }

    async handleFiles(files) {
        const file = files[0];
        if (!file.type.match('image.*')) {
            this.showError('Please upload an image file');
            return;
        }

        try {
            this.showLoader(true);
            
            // Preview the image
            const imageUrl = URL.createObjectURL(file);
            this.receiptImage.src = imageUrl;
            this.receiptImage.onload = () => {
                URL.revokeObjectURL(imageUrl);
            };
            
            // Process the image with Tesseract
            const result = await this.processImageWithTesseract(file);
            this.displayResults(result);
            
        } catch (error) {
            console.error('Error processing image:', error);
            this.showError('Failed to process the receipt. Please try again.');
        } finally {
            this.showLoader(false);
        }
    }

    async processImageWithTesseract(file) {
        return new Promise((resolve, reject) => {
            // Initialize Tesseract worker
            const worker = Tesseract.createWorker({
                logger: m => console.log(m)
            });

            (async () => {
                try {
                    await worker.load();
                    await worker.loadLanguage('eng');
                    await worker.initialize('eng');
                    
                    // Process the image
                    const { data: { text, hocr } } = await worker.recognize(file);
                    await worker.terminate();
                    
                    // Parse the extracted text
                    const parsedData = this.parseReceiptText(text);
                    resolve({
                        rawText: text,
                        parsedData: parsedData,
                        hocr: hocr
                    });
                } catch (error) {
                    reject(error);
                }
            })();
        });
    }

    parseReceiptText(text) {
        // Simple parser - can be enhanced with more sophisticated logic
        const lines = text.split('\n').filter(line => line.trim() !== '');
        
        // Look for common receipt patterns
        const result = {
            merchant: this.extractMerchant(lines),
            date: this.extractDate(lines),
            total: this.extractTotal(lines),
            items: this.extractItems(lines)
        };
        
        return result;
    }

    extractMerchant(lines) {
        // First line is often the merchant name
        return lines.length > 0 ? lines[0] : 'Unknown Merchant';
    }

    extractDate(lines) {
        // Look for date patterns in the first few lines
        for (let i = 0; i < Math.min(5, lines.length); i++) {
            const dateMatch = lines[i].match(/\b\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}\b/);
            if (dateMatch) {
                return dateMatch[0];
            }
        }
        return 'Date not found';
    }

    extractTotal(lines) {
        // Look for total amount (usually at the bottom)
        for (let i = Math.max(0, lines.length - 5); i < lines.length; i++) {
            const totalMatch = lines[i].match(/total.*?(\d+\.\d{2})/i);
            if (totalMatch) {
                return `$${totalMatch[1]}`;
            }
        }
        return 'Total not found';
    }

    extractItems(lines) {
        // Simple item extraction - looks for lines with prices
        const items = [];
        const priceRegex = /\b\d+\.\d{2}\b/;
        
        for (const line of lines) {
            if (priceRegex.test(line) && !line.toLowerCase().includes('total')) {
                const parts = line.split(/\s+/);
                const price = parts.find(part => priceRegex.test(part));
                const name = parts.filter(part => part !== price).join(' ');
                
                if (name && price) {
                    items.push({
                        name: name || 'Unknown Item',
                        price: price
                    });
                }
            }
        }
        
        return items.length > 0 ? items : [{ name: 'No items detected', price: '0.00' }];
    }

    displayResults(result) {
        this.extractedData.innerHTML = '';
        
        // Show merchant and date
        const header = document.createElement('div');
        header.className = 'result-header';
        header.innerHTML = `
            <h3>${result.parsedData.merchant}</h3>
            <p>Date: ${result.parsedData.date}</p>
        `;
        this.extractedData.appendChild(header);
        
        // Show items
        const itemsList = document.createElement('div');
        itemsList.className = 'items-list';
        
        result.parsedData.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'item';
            itemEl.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-price">$${item.price}</span>
            `;
            itemsList.appendChild(itemEl);
        });
        
        this.extractedData.appendChild(itemsList);
        
        // Show total
        const totalEl = document.createElement('div');
        totalEl.className = 'total-amount';
        totalEl.innerHTML = `
            <hr>
            <div class="total-row">
                <span>Total:</span>
                <span>${result.parsedData.total}</span>
            </div>
        `;
        this.extractedData.appendChild(totalEl);
        
        // Show raw text (initially hidden)
        const rawTextToggle = document.createElement('button');
        rawTextToggle.className = 'toggle-raw';
        rawTextToggle.textContent = 'Show Raw Text';
        rawTextToggle.onclick = () => this.toggleRawText(result.rawText);
        this.extractedData.appendChild(rawTextToggle);
        
        this.resultsSection.classList.remove('hidden');
    }
    
    toggleRawText(text) {
        const rawTextEl = this.extractedData.querySelector('.raw-text');
        const toggleBtn = this.extractedData.querySelector('.toggle-raw');
        
        if (rawTextEl) {
            rawTextEl.remove();
            toggleBtn.textContent = 'Show Raw Text';
        } else {
            const textEl = document.createElement('div');
            textEl.className = 'raw-text';
            textEl.textContent = text;
            this.extractedData.appendChild(textEl);
            toggleBtn.textContent = 'Hide Raw Text';
        }
    }

    showLoader(show) {
        this.loader.style.display = show ? 'block' : 'none';
    }

    showError(message) {
        alert(message); // In a real app, you'd want a nicer error display
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the receipt project page
    if (document.getElementById('upload-form')) {
        window.receiptProcessor = new ReceiptProcessor();
    }
});
