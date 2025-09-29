// ...existing code...
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const editorSection = document.getElementById('editorSection');
const originalImage = document.getElementById('originalImage');
const promptInput = document.getElementById('promptInput');
const transformBtn = document.getElementById('transformBtn');
const resetBtn = document.getElementById('resetBtn');
const resultSection = document.getElementById('resultSection');
const resultOriginal = document.getElementById('resultOriginal');
const resultTransformed = document.getElementById('resultTransformed');
const downloadBtn = document.getElementById('downloadBtn');

let currentImageData = null;

// Upload functionality
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        currentImageData = e.target.result;
        displayImage(currentImageData);
    };
    reader.readAsDataURL(file);
}

function displayImage(imageData) {
    originalImage.src = imageData;
    uploadArea.style.display = 'none';
    editorSection.style.display = 'block';
}

transformBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Please enter a description for how to modify the image');
        return;
    }

    if (!currentImageData) {
        alert('Please upload an image first');
        return;
    }

    transformBtn.disabled = true;
    transformBtn.querySelector('.btn-text').style.display = 'none';
    transformBtn.querySelector('.btn-loader').style.display = 'inline-block';

    try {
        // Convert data URL to blob
        const response = await fetch(currentImageData);
        const blob = await response.blob();
        
        // Generate transformed image
        const result = await websim.imageGen({
            prompt: prompt,
            image_inputs: [{
                url: currentImageData
            }]
        });

        // Display results
        resultOriginal.src = currentImageData;
        resultTransformed.src = result.url;
        resultSection.style.display = 'block';

        // Scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error transforming image:', error);
        alert('Error transforming image. Please try again.');
    } finally {
        transformBtn.disabled = false;
        transformBtn.querySelector('.btn-text').style.display = 'inline-block';
        transformBtn.querySelector('.btn-loader').style.display = 'none';
    }
});

resetBtn.addEventListener('click', () => {
    uploadArea.style.display = 'block';
    editorSection.style.display = 'none';
    resultSection.style.display = 'none';
    fileInput.value = '';
    promptInput.value = '';
    currentImageData = null;
});

downloadBtn.addEventListener('click', async () => {
    const link = document.createElement('a');
    link.href = resultTransformed.src;
    link.download = 'nano-banana-transformed.png';
    link.click();
});

