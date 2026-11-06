const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Una carpeta por tipo de foto
export const IMAGE_FOLDERS = {
  profile: 'uberclone/profile',
  vehicle: 'uberclone/vehicle',
  documents: 'uberclone/documents', 
};

// Sube una imagen local a Cloudinary y devuelve su URL pública (https)
export function uploadImage(uri, folder, label) {
  return new Promise((resolve, reject) => {
    const isPng = uri.toLowerCase().endsWith('.png');
    const extension = isPng ? 'png' : 'jpg';
    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const formData = new FormData();
    formData.append('file', {
      uri,
      type: isPng ? 'image/png' : 'image/jpeg',
      name: `${label}_${uniqueId}.${extension}`,
    });
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('asset_folder', folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error('uploadFailed'));
        }
      } catch (e) {
        reject(new Error('uploadFailed'));
      }
    };
    xhr.onerror = () => reject(new Error('uploadFailed'));

    xhr.send(formData);
  });
}