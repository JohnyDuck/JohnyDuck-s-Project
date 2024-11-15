const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Симуляция базы данных (в реальности используйте MongoDB, PostgreSQL и т.д.)
const pixelData = {};

app.use(bodyParser.json());

// Получение данных о пикселях
app.get('/api/pixels', (req, res) => {
    res.json(pixelData);
});

// Сохранение данных о купленном пикселе
app.post('/api/buyPixel', (req, res) => {
    const { pixelId, color, url } = req.body;
    if (!pixelData[pixelId]) { // Проверка, что пиксель не куплен
        pixelData[pixelId] = { color, url };
        res.status(200).send('Pixel purchased successfully');
    } else {
        res.status(400).send('Pixel already purchased');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
