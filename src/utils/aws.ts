import {
  CompleteMultipartUploadCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import {Buffer} from 'buffer';
import 'react-native-url-polyfill/auto';
import {ReadableStream} from 'web-streams-polyfill';
import 'react-native-get-random-values';
import RNFS from 'react-native-fs';
import {Upload} from '@aws-sdk/lib-storage';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {AWS_ACCESSKEY_ID, AWS_SECRET_ACCESS_KEY} from '@env';
declare global {
  var ReadableStream: ReadableStream;
}
globalThis.ReadableStream = ReadableStream;

const client = new S3Client({
  region: 'eu-north-1',
  credentials: {
    accessKeyId: AWS_ACCESSKEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const S3FileUpload = async (paths: DocumentPickerResponse[]) => {
  try {
    const uploadPromises = paths.map(async item => {
      try {
        const base64Data = await RNFS.readFile(item.uri, 'base64');
        const buffer = Buffer.from(base64Data, 'base64');

        const parallelUploads3 = new Upload({
          client,
          params: {
            Bucket: 'onvail-media',
            Key: 'uploads/' + item.name,
            Body: buffer,
            ContentType: item.type!,
            ACL: 'public-read', // This is required to make the uploaded file public
          },
          queueSize: 4,
          leavePartsOnError: false,
        });

        parallelUploads3.on('httpUploadProgress', progress => {
          console.log('upload progress', progress);
        });

        const response = await parallelUploads3.done();
        // Append the file name to the response
        return {...response, fileName: item.name};
      } catch (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }
    });

    // Wait for all uploads to finish
    const results = await Promise.all(uploadPromises);

    return results;
  } catch (error) {
    console.log('Error in awsUpload:', error);
    throw error; // Ensure the error is thrown for further handling if needed
  }
};

export const S3ImageUpload = async (
  imageUri: string,
): Promise<CompleteMultipartUploadCommandOutput> => {
  try {
    const base64Data = await RNFS.readFile(imageUri, 'base64');
    const buffer = Buffer.from(base64Data, 'base64');

    const fileNameWithExt = imageUri.split('/').pop();

    // Remove the extension
    // const fileName = fileNameWithExt?.split('.').slice(0, -1).join('.');

    const parallelUploads3 = new Upload({
      client,
      params: {
        Bucket: 'onvail-media',
        Key: 'images/' + fileNameWithExt,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read', // This is required to make the uploaded file public
      },
      queueSize: 4,
      leavePartsOnError: false,
    });

    parallelUploads3.on('httpUploadProgress', progress => {
      console.log('upload progress', progress);
    });

    const response = await parallelUploads3.done();
    console.log('response', response.Location);
    // Append the file name to the response
    return response;
  } catch (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw uploadError;
  }
};
