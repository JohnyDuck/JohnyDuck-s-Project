const grid = document.querySelector('.pixel-grid');
const tooltip = document.getElementById('tooltip');
const leaderboardTable = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];
const leaderboardDiv = document.getElementById('leaderboard');
const previewDiv = document.getElementById('preview');
const previewImage = document.getElementById('preview-image');

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
                tooltip.style.display