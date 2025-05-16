// UUID patch to handle crypto.getRandomValues not being available
import 'react-native-get-random-values';

// Fallback random values generator
function getRandomValues(array) {
  // Simple fallback if crypto.getRandomValues fails
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
}

// Apply the patch if needed
if (typeof global.crypto !== 'object') {
  global.crypto = {};
}

if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = getRandomValues;
}

// Export a patched version of uuid
let uuidv4;
try {
  uuidv4 = require('uuid').v4;
} catch (error) {
  console.warn('UUID module could not be loaded, using fallback implementation');
  uuidv4 = () => {
    const timestamp = new Date().getTime().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `fallback-${timestamp}-${randomStr}`;
  };
}

export { uuidv4 }; 