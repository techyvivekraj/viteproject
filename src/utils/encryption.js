import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.REACT_APP_ENCRYPTION_KEY;

export const encryptId = (id) => {
  if (!id) return '';
  try {
    const encrypted = CryptoJS.AES.encrypt(String(id), SECRET_KEY).toString();
    return encodeURIComponent(encrypted);
  } catch (error) {
    console.error('Failed to encrypt ID:', error);
    return '';
  }
};

export const decryptId = (encoded) => {
  if (!encoded) return '';
  try {
    const decoded = decodeURIComponent(encoded);
    const decrypted = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Failed to decrypt ID:', error);
    return '';
  }
}; 