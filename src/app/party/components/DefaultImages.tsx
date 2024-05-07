import React, {FunctionComponent, useCallback, useEffect, useRef} from 'react';
import {View} from 'react-native';
import CustomImage from 'src/app/components/Image/CustomImage';
import CustomText from 'src/app/components/Text/CustomText';
import ViewShot from 'react-native-view-shot';
import tw from 'src/lib/tailwind';

interface Props {
  color: 'purple' | 'orange';
  artist: string;
  imageUrl: string;
}

const DefaultImages: FunctionComponent<Props> = ({color, artist, imageUrl}) => {
  const ref = useRef<any>();

  useEffect(() => {
    ref?.current?.capture().then((uri: string) => {
      console.log('do something with ', uri);
    });
  }, [color]);

  const onCapture = useCallback((uri: string) => {
    console.log('do something with ', uri);
  }, []);

  if (color === 'purple') {
    return (
      <ViewShot
        style={tw`flex-1 w-full`}
        captureMode="mount"
        onCapture={onCapture}
        options={{format: 'jpg', quality: 0.9}}>
        <View style={tw`flex-1 bg-purple6 h-70  w-full rounded-lg`}>
          <View
            style={tw`bg-purple7 h-full w-4/5 rounded-full self-center items-center justify-center`}>
            <View
              style={tw`bg-purple8 h-[80%] w-4/5 items-center justify-center rounded-full`}>
              <View
                style={tw`bg-purple9 h-[75%] self-center justify-center w-3/4 rounded-full`}>
                <View
                  style={tw`bg-purple10 h-[75%] rounded-full w-3/4 self-center items-center justify-center`}>
                  <CustomImage
                    uri={imageUrl}
                    style={tw`h-12 w-12 rounded-full`}
                    resizeMode="cover"
                  />
                  <CustomText style={tw`text-grey8 mt-1 text-2xs z-50 `}>
                    Party with
                  </CustomText>
                  <CustomText style={tw`text-white text-sm z-50 `}>
                    {artist}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ViewShot>
    );
  } else {
    return (
      <ViewShot style={tw`flex-1 w-full`}>
        <View style={tw`flex-1 bg-orange3 h-70  w-full rounded-lg`}>
          <View
            style={tw`bg-orange4 h-full w-4/5 rounded-full self-center items-center justify-center`}>
            <View
              style={tw`bg-orange5 h-[80%] w-4/5 items-center justify-center rounded-full`}>
              <View
                style={tw`bg-orange2 h-[75%] self-center justify-center w-3/4 rounded-full`}>
                <View
                  style={tw`bg-orange6 h-[75%] justify-center items-center rounded-full w-3/4 self-center`}>
                  <CustomImage
                    uri={imageUrl}
                    style={tw`h-12 w-12 rounded-full`}
                    resizeMode="cover"
                  />
                  <CustomText style={tw`text-grey8 mt-1 text-2xs z-50 `}>
                    Party with
                  </CustomText>
                  <CustomText style={tw`text-white text-sm z-50 `}>
                    {artist}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ViewShot>
    );
  }
};

export default DefaultImages;
