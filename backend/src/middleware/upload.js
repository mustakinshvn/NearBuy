import fs from 'fs';
import path from 'path';
import multer from 'multer';

const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads');
const PRODUCT_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'products');

function resolveUploadDir(relativeDir) {
  return path.join(UPLOAD_ROOT, relativeDir);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function safeBaseName(originalName) {
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext);
  const sanitized = base.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  return sanitized || 'image';
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir(PRODUCT_UPLOAD_DIR);
    cb(null, PRODUCT_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBaseName(file.originalname)}-${unique}${ext}`);
  },
});

function imageOnlyFileFilter(req, file, cb) {
  if (file?.mimetype && file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  const err = new Error('Only image files are allowed');
  err.status = 400;
  cb(err);
}

const upload = multer({
  storage,
  fileFilter: imageOnlyFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 61, // main + additional + variants + future headroom
  },
});

export const productImagesUpload = upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'variantImages', maxCount: 50 },
]);

export function getUploadedProductImagePaths(req) {
  const files = req.files || {};
  const main = Array.isArray(files.mainImage) ? files.mainImage[0] : null;
  const images = Array.isArray(files.images) ? files.images : [];
  const variantImages = Array.isArray(files.variantImages) ? files.variantImages : [];

  const toRelative = (file) => (file?.filename ? `/uploads/products/${file.filename}` : null);

  return {
    mainImagePath: toRelative(main),
    imagePaths: images.map(toRelative).filter(Boolean),
    variantImagePaths: variantImages.map(toRelative).filter(Boolean),
  };
}

function makeUpload(relativeDir, { files = 1 } = {}) {
  const dest = resolveUploadDir(relativeDir);

  const customStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${safeBaseName(file.originalname)}-${unique}${ext}`);
    },
  });

  return multer({
    storage: customStorage,
    fileFilter: imageOnlyFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files,
    },
  });
}

export const customerProfileImageUpload = makeUpload('profiles/customers', {
  files: 1,
}).single('profileImage');

export const vendorProfileImageUpload = makeUpload('profiles/vendors', {
  files: 1,
}).single('profileImage');

export const productVariantImageUpload = makeUpload('products/variants', {
  files: 1,
}).single('image');

export function getUploadedSingleImagePath(req, relativeDir) {
  if (!req.file?.filename) return null;
  const dir = String(relativeDir || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
  return `/uploads/${dir}/${req.file.filename}`;
}
