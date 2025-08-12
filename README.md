# Dr. Vicki's Image Resizer - Professional Image Processing Tool

A modern, web-based image resizing application built with Node.js, Express, and Sharp. Features a beautiful, responsive UI with drag-and-drop functionality, real-time preview, and multiple output format options.

## Features

- 🖼️ **Drag & Drop Upload**: Easy file upload with visual feedback
- 📐 **Flexible Resizing**: Custom width/height with aspect ratio preservation
- 🎨 **Multiple Formats**: Support for JPEG, PNG, WebP, and GIF
- 🌟 **Transparent Backgrounds**: Remove white/light backgrounds for transparent images
- ⚡ **Quality Control**: Adjustable compression quality (1-100%)
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🔄 **Real-time Preview**: See image details before processing
- 💾 **Automatic Cleanup**: Temporary files are automatically removed
- 🎯 **Smart Validation**: File type and size validation

## Screenshots

The application features a modern gradient design with:
- Beautiful purple gradient background
- Clean white cards with subtle shadows
- Interactive hover effects and animations
- Professional typography and spacing

## Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd dr-vickis-image-resizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Development

For development with auto-restart on file changes:
```bash
npm run dev
```

## Usage

### Basic Workflow

1. **Upload Image**: Drag and drop an image file or click to browse
2. **Configure Settings**: 
   - Set desired width and height (leave empty for auto)
   - Adjust quality slider (1-100%)
   - Choose output format (JPEG, PNG, WebP, GIF)
   - Toggle aspect ratio preservation
3. **Process**: Click "Resize Image" to process
4. **Download**: Click "Download" to save the resized image

### Settings Explained

- **Width/Height**: Set specific dimensions in pixels. Leave empty to maintain original size or auto-calculate based on aspect ratio.
- **Quality**: Controls compression level. Higher values = better quality but larger file size.
- **Format**: 
  - **JPEG**: Best for photographs, smaller file sizes
  - **PNG**: Best for graphics with transparency
  - **WebP**: Modern format with excellent compression
  - **GIF**: For animated images
- **Maintain Aspect Ratio**: When enabled, changing width automatically adjusts height proportionally.
- **Create Transparent Background**: Removes white/light backgrounds to create transparent images (PNG/WebP only)

### Supported File Types

- **Input**: JPEG, JPG, PNG, GIF, WebP
- **Output**: JPEG, PNG, WebP, GIF
- **Max File Size**: 10MB

## Technical Details

### Backend (Node.js/Express)
- **Server**: Express.js with CORS support
- **Image Processing**: Sharp library for high-performance image manipulation
- **File Upload**: Multer middleware with validation
- **Storage**: Temporary file storage with automatic cleanup

### Frontend (Vanilla JavaScript)
- **UI**: Modern CSS with gradients and animations
- **Interactions**: Drag-and-drop, real-time preview, form validation
- **Responsive**: Mobile-first design approach
- **No Frameworks**: Pure HTML, CSS, and JavaScript

### File Structure
```
dr-vickis-image-resizer/
├── server.js          # Express server and API endpoints
├── package.json       # Dependencies and scripts
├── public/            # Frontend files
│   ├── index.html     # Main HTML page
│   ├── styles.css     # CSS styles
│   └── script.js      # JavaScript functionality
├── uploads/           # Temporary upload directory
├── processed/         # Temporary processed files
└── README.md          # This file
```

## API Endpoints

- `GET /` - Serve the main application page
- `POST /resize` - Process image resizing
- `GET /download/:filename` - Download processed image

## Environment Variables

- `PORT` - Server port (default: 3000)

## Performance Features

- **Automatic Cleanup**: Files older than 1 hour are automatically removed
- **File Size Limits**: 10MB upload limit to prevent server overload
- **Optimized Processing**: Sharp library for fast, memory-efficient image processing
- **Caching**: Static files served efficiently

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Common Issues

1. **"Only image files are allowed"**
   - Ensure you're uploading a valid image file (JPEG, PNG, GIF, WebP)

2. **"File size must be less than 10MB"**
   - Compress your image before uploading or use a smaller image

3. **Server won't start**
   - Check if port 3000 is already in use
   - Ensure all dependencies are installed (`npm install`)

4. **Images not processing**
   - Check browser console for errors
   - Ensure the server is running
   - Verify network connectivity

### Performance Tips

- For large images, consider resizing to reasonable dimensions first
- Use WebP format for best compression/quality ratio
- Lower quality settings (60-80%) often provide good results with smaller files

### Transparency Tips

- **Best Results**: Works best with images that have white or light backgrounds
- **Format Requirements**: Transparency is only available for PNG and WebP formats
- **Quality**: Higher quality settings preserve more detail in transparent areas
- **Use Cases**: Perfect for logos, icons, and graphics that need transparent backgrounds

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

Built with:
- [Express.js](https://expressjs.com/) - Web framework
- [Sharp](https://sharp.pixelplumbing.com/) - Image processing
- [Multer](https://github.com/expressjs/multer) - File upload handling
- [Font Awesome](https://fontawesome.com/) - Icons 