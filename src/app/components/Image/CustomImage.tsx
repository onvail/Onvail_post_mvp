import React, {FunctionComponent} from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';

interface Props extends FastImageProps {
  uri: string;
  height: number;
  width: number;
}

const CustomImage: FunctionComponent<Props> = ({
  uri,
  height,
  width,
  ...props
}) => {
  return (
    <FastImage
      style={{width: width, height: height}}
      source={{
        uri: uri,
        headers: {Authorization: 'someAuthToken'},
        priority: FastImage.priority.normal,
      }}
      resizeMode={FastImage.resizeMode.contain}
      {...props}
    />
  );
};

export default CustomImage;
