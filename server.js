const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.static('.'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Créer le dossier images s'il n'existe pas
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Route pour recevoir et stocker les photos
app.post('/upload', (req, res) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'Pas de photo reçue' });
    }

    // Générer un nom de fichier unique
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(7);
    const filename = `photo_${timestamp}_${randomId}.jpg`;
    const filepath = path.join(imagesDir, filename);

    // Convertir base64 en fichier
    const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(filepath, base64Data, 'base64');

    console.log(`✅ Photo stockée : ${filename}`);
    res.json({ 
      success: true, 
      message: 'Photo stockée avec succès', 
      filename: filename 
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors du stockage' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📁 Les photos seront stockées dans le dossier "images"`);
});
