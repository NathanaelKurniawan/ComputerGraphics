const form = document.getElementById('uploadForm');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const filter = document.querySelector('input[name="filter"]:checked').value;

    if (!fileInput.files.length) {
        alert('Please upload an image.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Apply pixel-by-pixel manipulation
            if (filter === 'grayscale') {
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    data[i] = avg;     // Red
                    data[i + 1] = avg; // Green
                    data[i + 2] = avg; // Blue
                }
            } else if (filter === 'blur') {
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = (data[i] + data[i + 4] + data[i + 8]) / 3; // Red
                    data[i + 1] = (data[i + 1] + data[i + 5] + data[i + 9]) / 3; // Green
                    data[i + 2] = (data[i + 2] + data[i + 6] + data[i + 10]) / 3; // Blue
                }
            }

            ctx.putImageData(imageData, 0, 0);

            // Save original and edited images
            const originalDataURL = img.src;
            const editedDataURL = canvas.toDataURL();

            sessionStorage.setItem('originalImage', originalDataURL);
            sessionStorage.setItem('editedImage', editedDataURL);

            // Redirect to result page
            window.location.href = 'result.html';
        };
    };

    reader.readAsDataURL(file);
});
