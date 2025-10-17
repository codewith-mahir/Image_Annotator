const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const MediaItem = require('../models/MediaItem');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const uploadDirectory = path.join(__dirname, '../../uploads');

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB per file
  }
});

const mapMediaToResponse = (item, req) => ({
  id: item._id,
  originalName: item.originalName,
  storedName: item.storedName,
  mimeType: item.mimeType,
  size: item.size,
  path: item.path,
  uploader: item.uploader,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  url: `${req.protocol}://${req.get('host')}/${item.path}`
});

router.post('/upload', authMiddleware, upload.array('files', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const metadata = req.files.map((file) => ({
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: `uploads/${file.filename}`,
      uploader: req.user._id
    }));

    const savedItems = await MediaItem.insertMany(metadata);

    const responseItems = savedItems.map((item) => mapMediaToResponse(item, req));

    res.status(201).json({
      message: 'Files uploaded successfully',
      items: responseItems
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'Failed to upload files' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
  const items = await MediaItem.find().sort({ createdAt: -1 });
  const responseItems = items.map((item) => mapMediaToResponse(item, req));

  res.json({ items: responseItems });
  } catch (error) {
    console.error('List media error:', error.message);
    res.status(500).json({ message: 'Failed to fetch media items' });
  }
});

router.get('/assignments', authMiddleware, async (req, res) => {
  try {
  const mediaItems = await MediaItem.find().sort({ createdAt: 1 });
    const users = await User.find()
      .sort({ createdAt: 1 })
      .select('_id name email role createdAt');

    if (mediaItems.length === 0) {
      return res.json({ items: [] });
    }

    if (users.length === 0) {
      return res.status(400).json({ message: 'No users available for assignments' });
    }

    const currentUserIndex = users.findIndex((user) => user._id.equals(req.user._id));

    if (currentUserIndex === -1) {
      return res.status(403).json({ message: 'User not authorized for assignments' });
    }

    const blockSize = Number(process.env.ASSIGNMENT_BLOCK_SIZE || 200);
    const segments = [];
    let mediaIndex = 0;
    let segmentIndex = 0;

    while (mediaIndex < mediaItems.length) {
      const assignedUser = users[segmentIndex % users.length];
      const start = mediaIndex;
      const end = Math.min(mediaIndex + blockSize, mediaItems.length);

      segments.push({
        userId: assignedUser._id.toString(),
        media: mediaItems.slice(start, end)
      });

      mediaIndex = end;
      segmentIndex += 1;
    }

    const currentAssignments = segments
      .filter((segment) => segment.userId === req.user._id.toString())
      .flatMap((segment) => segment.media);

    const responseItems = currentAssignments.map((item) => mapMediaToResponse(item, req));

    res.json({ items: responseItems });
  } catch (error) {
    console.error('Assignment error:', error.message);
    res.status(500).json({ message: 'Failed to fetch assignments' });
  }
});

module.exports = router;
