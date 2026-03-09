const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4200;

app.use(express.static(path.join(__dirname, 'dist/shang-parking/browser')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/shang-parking/browser/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
