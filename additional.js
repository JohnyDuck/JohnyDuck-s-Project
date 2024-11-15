fetch('/api/pixels')
    .then(response => response.json())
    .then(data => {
        for (const pixelId in data) {
            const pixel = document.querySelector(`[data-pixel-id="${pixelId}"]`);
            if (pixel) {
                pixel.style.backgroundColor = data[pixelId].color;
                pixel.addEventListener('click', () => {
                    window.open(data[pixelId].url, '_blank');
                });
            }
        }
    });
