import axios from 'axios';
import {CLOUD_NAME, UPLOAD_PRESET} from '@env';

export const truncateText = (text: string, maxLength: number = 40): string => {
  return (
    text.substring(0, maxLength) + `${text.length > maxLength ? '...' : ''} `
  );
};

export const convertTimeToString = (timeObj: {
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  const {hours, minutes, seconds} = timeObj;

  // Pad the numbers to ensure they are always two digits
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  // Construct the time string in HH:mm:ss format
  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
};

export const formatDate = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, add 1 to adjust
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const secondsToMinutesAndSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60); // Divide by 60 to get minutes
  const remainingSeconds = Math.floor(seconds % 60); // Use modulo to get remaining seconds
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`; // Pad with zero if necessary
};

// Detect file type from file url
export const fileType = (
  file: string,
): 'image' | 'song' | 'video' | 'unknown' => {
  // Object mapping extensions to media types
  const extensionToType: Record<string, 'image' | 'song' | 'video'> = {
    '.png': 'image',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.mp3': 'song',
    '.wav': 'song',
    '.mp4': 'video',
    '.mov': 'video',
    '.avi': 'video',
  };

  // Extract the file extension from the file name
  const extension = Object.keys(extensionToType).find(ext =>
    file.endsWith(ext),
  );

  // Return the media type if the extension is found, otherwise return 'unknown'
  return extension ? extensionToType[extension] : 'unknown';
};

export type FileUploadItem = {
  name: string;
  type: string;
  uri: string;
};

// upload files to cloudinary
export const uploadToCloudinary = async (item: FileUploadItem) => {
  const data = new FormData();
  data.append('file', {
    uri: item.uri,
    type: item.type,
    name: item.name,
  });
  data.append('upload_preset', UPLOAD_PRESET);
  data.append('cloud_name', CLOUD_NAME);

  // Determine the folder based on MIME type
  let resourceType = 'auto'; // Default is auto
  let folder = 'other';
  if (item.type.startsWith('image/')) {
    folder = 'images';
    resourceType = 'image';
  } else if (item.type.startsWith('video/')) {
    folder = 'videos';
    resourceType = 'video';
  } else if (item.type.startsWith('audio/')) {
    folder = 'music';
    resourceType = 'video'; // Consider changing to 'audio' if no video stream is intended
  }

  data.append('folder', folder);
  data.append('resource_type', resourceType);

  // Append the folder to FormData
  data.append('folder', folder);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      data,
    );
    return {
      name: response.data.original_filename,
      file_url: response.data.secure_url,
    };
  } catch (error) {
    console.error('Upload Error:', error);
  }
};

export const handleMultipleUploads = async (files: FileUploadItem[]) => {
  try {
    // Start uploads for all files
    const uploadPromises = files.map(file =>
      uploadToCloudinary({
        name: file.name,
        type: file.type,
        uri: file.uri,
      }),
    );

    // Wait for all uploads to complete
    const uploadResults = await Promise.all(uploadPromises);

    // Here, uploadResults is an array of all the responses from uploadToCloudinary
    return uploadResults;
  } catch (error) {
    console.error('Error in handling multiple uploads:', error);
  }
};

export const classifyUrl = (
  url: string,
): {url: string; type: 'Image' | 'Video' | 'Music' | 'Unknown type'} => {
  if (url?.includes('/image/upload/')) {
    return {url, type: 'Image'};
  } else if (url?.includes('/music/')) {
    return {url, type: 'Music'};
  } else if (url?.includes('/video/upload/')) {
    return {url, type: 'Video'};
  } else {
    return {url, type: 'Unknown type'};
  }
};

export const convertMillisecondsToMinSec = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
};
