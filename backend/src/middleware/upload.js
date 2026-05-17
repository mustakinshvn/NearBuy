import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const UPLOAD_ROOT = path.resolve(process.cwd(), 'uploads');
const CLOUDINARY_BASE_FOLDER = String(process.env.CLOUDINARY_FOLDER || 'nearbuy').replace(/^\/+|\/+$/g, '');
const HAS_CLOUDINARY_CONFIG = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

if (HAS_CLOUDINARY_CONFIG) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log(`Cloudinary storage enabled for folder: ${CLOUDINARY_BASE_FOLDER || 'nearbuy'}`);
} else {
  console.log('Cloudinary storage disabled; using local disk upload fallback.');
}

function normalizeRelativeDir(relativeDir) {
  return String(relativeDir || '').replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
}

function resolveUploadDir(relativeDir) {
  return path.join(UPLOAD_ROOT, normalizeRelativeDir(relativeDir));
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

function uniquePublicId(originalName) {
  return `${safeBaseName(originalName)}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
}

function getFieldRelativeDir(relativeDir, fieldname) {
  const dir = normalizeRelativeDir(relativeDir);
  if (dir === 'products' && fieldname === 'variantImages') {
    return 'products/variants';
  }
  return dir;
}

function getCloudinaryFolder(relativeDir, file) {
  const fieldDir = getFieldRelativeDir(relativeDir, file?.fieldname);
  return [CLOUDINARY_BASE_FOLDER, fieldDir].filter(Boolean).join('/');
}

function createDiskStorage(relativeDir) {
  const dest = resolveUploadDir(relativeDir);

  return multer.diskStorage({
    destination: (req, file, cb) => {
      ensureDir(dest);
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uniquePublicId(file.originalname)}${ext}`);
    },
  });
}

function createStorage(relativeDir) {
  if (!HAS_CLOUDINARY_CONFIG) {
    return createDiskStorage(relativeDir);
  }

  return new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: getCloudinaryFolder(relativeDir, file),
      public_id: uniquePublicId(file.originalname),
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
    }),
  });
}

function imageOnlyFileFilter(req, file, cb) {
  if (file?.mimetype && file.mimetype.startsWith('image/')) {
    return cb(null, true);
  }
  const err = new Error('Only image files are allowed');
  err.status = 400;
  cb(err);
}

function createUpload(relativeDir, { files = 1 } = {}) {
  return multer({
    storage: createStorage(relativeDir),
    fileFilter: imageOnlyFileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
      files,
    },
  });
}

function buildStoredImagePath(file, relativeDir) {
  if (!file) return null;

  const remoteUrl = file.path || file.secure_url || file.url;
  if (remoteUrl && /^https?:\/\//i.test(String(remoteUrl))) {
    return remoteUrl;
  }

  if (!file.filename) return null;

  const dir = getFieldRelativeDir(relativeDir, file.fieldname);
  return `/uploads/${dir}/${file.filename}`;
}

export const productImagesUpload = createUpload('products', {
  files: 61,
}).fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'variantImages', maxCount: 50 },
]);

export function getUploadedProductImagePaths(req) {
  const files = req.files || {};
  const main = Array.isArray(files.mainImage) ? files.mainImage[0] : null;
  const images = Array.isArray(files.images) ? files.images : [];
  const variantImages = Array.isArray(files.variantImages) ? files.variantImages : [];

  const toRelative = (file) => buildStoredImagePath(file, 'products');

  return {
    mainImagePath: toRelative(main),
    imagePaths: images.map(toRelative).filter(Boolean),
    variantImagePaths: variantImages.map(toRelative).filter(Boolean),
  };
}

export const customerProfileImageUpload = createUpload('profiles/customers', {
  files: 1,
}).single('profileImage');

export const vendorProfileImageUpload = createUpload('profiles/vendors', {
  files: 1,
}).single('profileImage');

export const productVariantImageUpload = createUpload('products/variants', {
  files: 1,
}).single('image');

export function getUploadedSingleImagePath(req, relativeDir) {
  if (!req.file) return null;

  const remoteUrl = req.file.path || req.file.secure_url || req.file.url;
  if (remoteUrl && /^https?:\/\//i.test(String(remoteUrl))) {
    return remoteUrl;
  }

  if (!req.file.filename) return null;

  const dir = getFieldRelativeDir(relativeDir, req.file.fieldname);
  return `/uploads/${dir}/${req.file.filename}`;
}
