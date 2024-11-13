const grid = document.querySelector('.pixel-grid');
const tooltip = document.getElementById('tooltip');
const leaderboardTable = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];
const leaderboardDiv = document.getElementById('leaderboard');
const previewDiv = document.getElementById('preview');
const previewImage = document.getElementById('preview-image');
const fileInput = document.getElementById('file-input');
const emailInput = document.getElementById('email-input');
const otherDataInput = document.getElementById('other-data-input');
let selectedImage = '';

// Sample pixel data
const pixelData = [
    { x: 1, y: 1, owner: 'Alice', contact: 'alice@example.com', img: 'url_to_image', amountSpent: 100 },
    // Add more pixel data here
];

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to display the leaderboard
function updateLeaderboard(data) {
    leaderboardTable.innerHTML = ''; // Clear existing rows
    data.sort((a, b) => b.amountSpent - a.amountSpent); // Sort by amount spent
    data.forEach(item => {
        const row = leaderboardTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = item.owner;
        cell2.textContent = `$${item.amountSpent}`;
    });
}

// Generate pixels
for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        const data = pixelData.find(p => p.x === i && p.y === j);
        
        if (data) {
            pixel.style.backgroundImage = `url(${data.img})`;
            pixel.dataset.owner = data.owner;
            pixel.dataset.contact = data.contact;
            pixel.dataset.amountSpent = data.amountSpent;
        } else {
            pixel.style.backgroundColor = getRandomColor(); // Random color for empty pixels
        }
        
        pixel.addEventListener('mouseenter', (e) => {
            if (data) {
                tooltip.style.display = 'block';
                tooltip.textContent = `Owner: ${data.owner}, Contact: ${data.contact}`;
                tooltip.style.left = `${e.pageX + 10}px`;
                tooltip.style.top = `${e.pageY + 10}px`;
            }
        });
        
        pixel.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
        
        grid.appendChild(pixel);
    }
}

// Update the leaderboard
updateLeaderboard(pixelData);

// Functions to show pixels and leaderboard
function showPixels() {
    grid.style.display = 'grid';
    leaderboardDiv.style.display = 'none';
    previewDiv.style.display = 'none';
    document.querySelector('.warning').style.display = 'block';
}

function showLeaderboard() {
    grid.style.display = 'none';
    leaderboardDiv.style.display = 'block';
    previewDiv.style.display = 'none';
    document.querySelector('.warning').style.display = 'none';
}

// Function to handle file selection
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            selectedImage = reader.result;
            previewPixel(selectedImage);
        };
        reader.readAsDataURL(file);
    }
});

// Function to handle pixel purchase
function buyPixel() {
    const x = prompt('Enter the X coordinate of the pixel:');
    const y = prompt('Enter the Y coordinate of the pixel:');
    const amount = parseFloat(prompt('Enter the amount (minimum $1):'));
    const email = emailInput.value;
    const otherData = otherDataInput.value;
    
    // Check minimum amount
    if (amount < 1) {
        alert('The minimum amount for purchasing a pixel is $1.');
        return;
    }

    // Check for intimate photos
    if (isIntimateImage(selectedImage)) {
        alert('Intimate photos are not allowed.');
        return;
    }

    // Pixel purchase logic
    const pixel = pixelData.find(p => p.x === parseInt(x) && p.y === parseInt(y));
    if (pixel) {
        alert('This pixel has already been purchased.');
    } else {
        // Send data to the server
        fetch('submit_pixel.php', {
            method: 'POST',
            body: JSON.stringify({ x, y, amount, owner: 'User', contact: email, img: selectedImage, otherData }),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.text())
          .then(data => alert('Pixel successfully purchased!'))
          .catch(error => alert('Error purchasing pixel.'));
    }
}

// Function to check intimate photos (example)
function isIntimateImage(img) {
    // Here you can use an API to check images or a simple keyword check
    const forbiddenKeywords = ['intimate', 'nude', 'explicit'];
    return forbiddenKeywords.some(keyword => img.includes(keyword));
}

// Function for pixel preview
function previewPixel(img) {
    previewImage.src = img;
    previewDiv.style.display = 'block';
}

paypal.Buttons({
    createOrder: function(data, actions) {
        // Set the minimum amount to $1
        const amount = parseFloat(prompt('Enter the amount (minimum $1):'));
        if (amount < 1) {
            alert('The minimum amount for purchasing a pixel is $1.');
            return;
        }
        if (!selectedImage) {
            alert('Please select an image first.');
            return;
        }
        if (isIntimateImage(selectedImage)) {
            alert('Intimate photos are not allowed.');
            return;
        }
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: amount
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Pixel purchase logic
            buyPixel();
        });
    }
}).render('#paypal-button-container');
