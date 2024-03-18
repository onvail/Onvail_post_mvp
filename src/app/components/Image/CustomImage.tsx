import React, {FunctionComponent} from 'react';
import FastImage, {FastImageProps} from 'react-native-fast-image';

interface Props extends FastImageProps {
  uri: string;
}

const CustomImage: FunctionComponent<Props> = ({uri, ...props}) => {
  return (
    <FastImage
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
