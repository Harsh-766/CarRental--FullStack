import ImageKit from '@imagekit/nodejs';

if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    console.error('Missing ImageKit environment variables');
}

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Debug: Check if imagekit has upload method
console.log('ImageKit methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(imagekit)).slice(0, 10));

export default imagekit;