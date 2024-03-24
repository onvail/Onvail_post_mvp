import {useCameraDevice, useCameraPermission} from 'react-native-vision-camera';

export type CameraType = 'back' | 'front';

interface Props {
  camera?: CameraType;
}

const useCamera = ({camera = 'back'}: Props) => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice(camera, {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera',
    ],
  });
  return {
    hasPermission,
    requestPermission,
    device,
  };
};

export default useCamera;
