import {PermissionsAndroid, Platform} from 'react-native';
import ImagePicker, {Image} from 'react-native-image-crop-picker';

type SelectImageOptions = {
  cropImage: boolean | undefined;
  includeBase64: boolean | undefined;
  action: 'openCamera' | 'openPicker';
};

export const requestCameraPermission = async (): Promise<boolean> => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  } else {
    return false;
  }
};

const selectImageFromGallery = async (
  cropImage: boolean | undefined,
  includeBase64: boolean | undefined,
): Promise<Image> => {
  return await ImagePicker.openPicker({
    mediaType: 'photo',
    width: 200,
    height: 200,
    cropping: cropImage,
    cropperCircleOverlay: cropImage,
    includeBase64: includeBase64,
    compressImageQuality: 0.8,
    smartAlbums: [
      'UserLibrary',
      'RecentlyAdded',
      'PhotoStream',
      'Generic',
      'Favorites',
      'Videos',
      'SelfPortraits',
      'LivePhotos',
      'Panoramas',
      'Timelapses',
      'SlomoVideos',
      'DepthEffect',
      'Bursts',
      'Screenshots',
      'AllHidden',
      'Animated',
      'LongExposure',
    ],
  });
};

const selectImageFromCamera = async (
  cropImage: boolean | undefined,
  includeBase64: boolean | undefined,
): Promise<Image | null> => {
  if (await requestCameraPermission()) {
    return ImagePicker.openCamera({
      mediaType: 'photo',
      width: 200,
      height: 200,
      cropping: cropImage,
      cropperCircleOverlay: cropImage,
      includeBase64: includeBase64,
      compressImageQuality: 0.8,
    });
  } else {
    return null;
  }
};

const selectImage = async ({
  cropImage,
  includeBase64,
  action,
}: SelectImageOptions): Promise<Image | null> => {
  if (action === 'openPicker') {
    return await selectImageFromGallery(cropImage, includeBase64);
  } else {
    return await selectImageFromCamera(cropImage, includeBase64);
  }
};

interface File extends Blob {
  uri?: string;
  name?: string;
}

export type ImageFromDevice = {
  fileName: string;
  file: File;
  base64Data: string | null | undefined;
};

export type ImageFileData = {
  existingImageUrl: string | undefined;
  newImageFromDevice: ImageFromDevice | undefined;
};

export const getImageSourceUri = (imageData: string) => {
  return imageData.startsWith('http://') || imageData.startsWith('https://')
    ? imageData
    : `data:image/png;base64,${imageData}`;
};

const useImageService = () => {
  const tryPickImageFromDevice = async (
    options: SelectImageOptions,
  ): Promise<ImageFromDevice | null> => {
    try {
      const image = await selectImage(options);

      if (!image) {
        return null;
      }

      const filename = image.path.substring(image.path.lastIndexOf('/') + 1);
      const file = {
        uri: Platform.OS === 'ios' ? `file:///${image.path}` : image.path,
        type: image.mime,
        name: filename,
      } as unknown as Blob;

      return {file: file, fileName: filename, base64Data: image.data};
    } catch (e) {
      // @ts-ignore: unknown type
      if (e.code && e.code === 'E_PICKER_CANCELLED') {
        console.info('User cancelled image selection');
        return null;
      }
      return null;
    }
  };

  const uploadProfileImage = async (
    profileImageId: number,
    image: ImageFromDevice,
  ) => {
    const formData = new FormData();

    formData.append('profileId', String(profileImageId));

    formData.append('file', image.file);
    formData.append('name', image.fileName);
    formData.append('cultureName', '');
  };

  return {
    tryPickImageFromDevice,
    uploadProfileImage,
  };
};

export default useImageService;
