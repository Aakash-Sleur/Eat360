import React, { useState, useEffect } from 'react';
import { Img } from 'react-image';
import Resizer from 'react-image-file-resizer';

interface WebPImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}

const CustomImage: React.FC<WebPImageProps> = ({ src, alt, ...props }) => {
    const [webpSrc, setWebpSrc] = useState<string>('');

    useEffect(() => {
        if (!src) return;

        const fetchImageAsBlob = async (url: string): Promise<Blob> => {
            const response = await fetch(url);
            const blob = await response.blob();
            return blob;
        };

        const convertToWebP = async (imageBlob: Blob) => {
            try {
                const webp = await new Promise<string>((resolve, reject) => {
                    Resizer.imageFileResizer(
                        imageBlob,
                        800, // max width
                        800, // max height
                        'WEBP',
                        100, // quality
                        0, // rotation
                        (uri) => {
                            if (typeof uri === 'string') {
                                resolve(uri);
                            } else {
                                reject(new Error('Failed to convert image to WebP.'));
                            }
                        },
                        'base64'
                    );
                });
                setWebpSrc(webp);
            } catch (err) {
                console.error('Error converting image to WebP:', err);
            }
        };

        const processImage = async () => {
            try {
                const imageBlob = await fetchImageAsBlob(src);
                await convertToWebP(imageBlob);
            } catch (err) {
                console.error('Error fetching or converting image:', err);
            }
        };

        processImage();
    }, [src]);

    return <Img src={webpSrc || src} alt={alt} {...props} />;
};

export default CustomImage;
