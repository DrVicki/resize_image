const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads and processed directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Image resize endpoint
app.post('/resize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { width, height, quality, format, maintainAspectRatio, transparentBackground } = req.body;
    
    let resizeOptions = {};
    
    if (maintainAspectRatio === 'true') {
      resizeOptions = {
        width: parseInt(width) || null,
        height: parseInt(height) || null,
        fit: 'inside',
        withoutEnlargement: true
      };
    } else {
      resizeOptions = {
        width: parseInt(width) || null,
        height: parseInt(height) || null,
        fit: 'fill'
      };
    }

    // Remove null values
    Object.keys(resizeOptions).forEach(key => {
      if (resizeOptions[key] === null) {
        delete resizeOptions[key];
      }
    });

    let sharpInstance = sharp(req.file.path).resize(resizeOptions);

    // Handle transparent background
    if (transparentBackground === 'true') {
      // Remove white/light background and create transparency
      const image = sharp(req.file.path);
      const metadata = await image.metadata();
      
      // Create a mask for white/light pixels
      const mask = await image
        .grayscale()
        .threshold(240) // Pixels above 240 become white
        .negate() // Invert so white background becomes black
        .png()
        .toBuffer();
      
      // Apply the mask to create transparency
      sharpInstance = sharpInstance
        .ensureAlpha()
        .composite([{
          input: mask,
          blend: 'dest-in'
        }])
        .png();
    } else {
      // Set quality for different formats
      if (format === 'jpeg' || format === 'jpg') {
        sharpInstance = sharpInstance.jpeg({ quality: parseInt(quality) || 80 });
      } else if (format === 'png') {
        sharpInstance = sharpInstance.png({ quality: parseInt(quality) || 80 });
      } else if (format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality: parseInt(quality) || 80 });
      } else if (format === 'gif') {
        sharpInstance = sharpInstance.gif();
      }
    }

    const outputFilename = `resized-${Date.now()}.${format || 'jpeg'}`;
    const outputPath = path.join(processedDir, outputFilename);

    await sharpInstance.toFile(outputPath);

    // Get file stats for response
    const stats = fs.statSync(outputPath);
    const fileSizeInKB = Math.round(stats.size / 1024);

    res.json({
      success: true,
      originalFile: req.file.originalname,
      resizedFile: outputFilename,
      fileSize: fileSizeInKB,
      downloadUrl: `/download/${outputFilename}`
    });

  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Error processing image' });
  }
});

// Download endpoint
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(processedDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath, filename);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Cleanup old files (older than 1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  [uploadsDir, processedDir].forEach(dir => {
    fs.readdir(dir, (err, files) => {
      if (err) return;
      
      files.forEach(file => {
        const filePath = path.join(dir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          if (stats.mtime.getTime() < oneHourAgo) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  });
}, 60 * 60 * 1000); // Run every hour

app.listen(PORT, () => {
  console.log(`Dr. Vicki's Image Resizer server running on http://localhost:${PORT}`);
}); 