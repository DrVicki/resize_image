class ImageResizer {
    constructor() {
        this.currentFile = null;
        this.originalDimensions = null;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.previewImage = document.getElementById('previewImage');
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.fileDimensions = document.getElementById('fileDimensions');
        this.removeFile = document.getElementById('removeFile');

        // Settings elements
        this.widthInput = document.getElementById('width');
        this.heightInput = document.getElementById('height');
        this.qualityInput = document.getElementById('quality');
        this.qualityValue = document.getElementById('qualityValue');
        this.formatSelect = document.getElementById('format');
        this.maintainAspectRatio = document.getElementById('maintainAspectRatio');
        this.transparentBackground = document.getElementById('transparentBackground');
        this.resizeBtn = document.getElementById('resizeBtn');

        // Add format change listener
        this.formatSelect.addEventListener('change', () => {
            this.updateTransparencyForFormat();
        });

        // Result elements
        this.resultSection = document.getElementById('resultSection');
        this.originalInfo = document.getElementById('originalInfo');
        this.resizedInfo = document.getElementById('resizedInfo');
        this.fileSizeInfo = document.getElementById('fileSizeInfo');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.newImageBtn = document.getElementById('newImageBtn');

        // Loading overlay
        this.loadingOverlay = document.getElementById('loadingOverlay');
    }

    bindEvents() {
        // File upload events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.removeFile.addEventListener('click', () => this.removeCurrentFile());

        // Settings events
        this.qualityInput.addEventListener('input', (e) => {
            this.qualityValue.textContent = `${e.target.value}%`;
        });

        this.maintainAspectRatio.addEventListener('change', () => {
            this.updateAspectRatioConstraints();
        });

        this.transparentBackground.addEventListener('change', () => {
            this.updateFormatForTransparency();
        });

        this.widthInput.addEventListener('input', () => {
            if (this.maintainAspectRatio.checked && this.originalDimensions) {
                this.updateHeightFromWidth();
            }
        });

        this.heightInput.addEventListener('input', () => {
            if (this.maintainAspectRatio.checked && this.originalDimensions) {
                this.updateWidthFromHeight();
            }
        });

        // Action events
        this.resizeBtn.addEventListener('click', () => this.resizeImage());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.newImageBtn.addEventListener('click', () => this.resetApp());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file.');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File size must be less than 10MB.');
            return;
        }

        this.currentFile = file;
        this.displayFileInfo(file);
        this.resizeBtn.disabled = false;
    }

    displayFileInfo(file) {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            
            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                this.originalDimensions = { width: img.width, height: img.height };
                this.fileDimensions.textContent = `${img.width} × ${img.height} pixels`;
                
                // Set default values
                this.widthInput.value = img.width;
                this.heightInput.value = img.height;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // Display file info
        this.fileName.textContent = file.name;
        this.fileSize.textContent = this.formatFileSize(file.size);
        
        this.uploadArea.style.display = 'none';
        this.fileInfo.style.display = 'flex';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeCurrentFile() {
        this.currentFile = null;
        this.originalDimensions = null;
        this.fileInput.value = '';
        this.uploadArea.style.display = 'block';
        this.fileInfo.style.display = 'none';
        this.resizeBtn.disabled = true;
        this.resultSection.style.display = 'none';
        
        // Reset inputs
        this.widthInput.value = '';
        this.heightInput.value = '';
        this.qualityInput.value = 80;
        this.qualityValue.textContent = '80%';
        this.formatSelect.value = 'jpeg';
        this.maintainAspectRatio.checked = true;
        this.transparentBackground.checked = false;
    }

    updateAspectRatioConstraints() {
        if (this.maintainAspectRatio.checked && this.originalDimensions) {
            this.updateHeightFromWidth();
        }
    }

    updateHeightFromWidth() {
        if (this.widthInput.value && this.originalDimensions) {
            const ratio = this.originalDimensions.height / this.originalDimensions.width;
            this.heightInput.value = Math.round(this.widthInput.value * ratio);
        }
    }

    updateWidthFromHeight() {
        if (this.heightInput.value && this.originalDimensions) {
            const ratio = this.originalDimensions.width / this.originalDimensions.height;
            this.widthInput.value = Math.round(this.heightInput.value * ratio);
        }
    }

    updateFormatForTransparency() {
        if (this.transparentBackground.checked) {
            // Only PNG and WebP support transparency
            if (this.formatSelect.value === 'jpeg' || this.formatSelect.value === 'gif') {
                this.formatSelect.value = 'png';
                this.showNotification('Format changed to PNG for transparency support', 'info');
            }
        }
    }

    updateTransparencyForFormat() {
        const format = this.formatSelect.value;
        if (this.transparentBackground.checked) {
            // Only PNG and WebP support transparency
            if (format === 'jpeg' || format === 'gif') {
                this.transparentBackground.checked = false;
                this.showNotification('Transparency disabled - not supported by ' + format.toUpperCase(), 'info');
            }
        }
    }

    async resizeImage() {
        if (!this.currentFile) {
            this.showError('Please select an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('image', this.currentFile);
        formData.append('width', this.widthInput.value || '');
        formData.append('height', this.heightInput.value || '');
        formData.append('quality', this.qualityInput.value);
        formData.append('format', this.formatSelect.value);
        formData.append('maintainAspectRatio', this.maintainAspectRatio.checked);
        formData.append('transparentBackground', this.transparentBackground.checked);

        this.showLoading(true);

        try {
            const response = await fetch('/resize', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.displayResult(result);
            } else {
                this.showError(result.error || 'An error occurred while processing the image.');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Network error. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    displayResult(result) {
        this.originalInfo.textContent = this.currentFile.name;
        this.resizedInfo.textContent = result.resizedFile;
        this.fileSizeInfo.textContent = `${result.fileSize} KB`;
        
        // Store download URL
        this.downloadBtn.onclick = () => {
            window.open(result.downloadUrl, '_blank');
        };

        this.resultSection.style.display = 'block';
        this.resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    downloadImage() {
        // This is handled by the onclick event set in displayResult
    }

    resetApp() {
        this.removeCurrentFile();
        this.resultSection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showLoading(show) {
        this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'error') {
        // Create a notification
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? '#ff4757' : type === 'info' ? '#667eea' : '#27ae60';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
            z-index: 1001;
            font-weight: 500;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageResizer();
}); 