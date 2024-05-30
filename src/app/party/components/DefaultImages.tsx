import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import Icon from 'src/app/components/Icons/Icon';
import CustomImage from 'src/app/components/Image/CustomImage';
import CustomText from 'src/app/components/Text/CustomText';
import tw from 'src/lib/tailwind';

interface Props {
  color: 'purple' | 'orange';
  artist: string;
  imageUrl: string;
}

const DefaultImages: FunctionComponent<Props> = ({color, artist, imageUrl}) => {
  return (
    <View style={tw`h-70 flex-1`}>
      {color === 'purple' ? (
        <View style={tw`flex-1 bg-purple6 h-70  w-full rounded-lg`}>
          <View
            style={tw`bg-purple7 h-full w-4/5 rounded-full self-center items-center justify-center`}>
            <View
              style={tw`bg-purple8 h-[80%] w-4/5 items-center justify-center rounded-full`}>
              <View
                style={tw`bg-purple9 h-[75%] self-center justify-center w-3/4 rounded-full`}>
                <View
                  style={tw`bg-purple10 h-[75%] rounded-full w-3/4 self-center items-center justify-center`}>
                  {imageUrl ? (
                    <CustomImage
                      uri={imageUrl}
                      style={tw`h-12 w-12 rounded-full`}
                      resizeMode="cover"
                    />
                  ) : (
                    <Icon icon={'account'} color="white" size={45} />
                  )}
                  <CustomText style={tw`text-white mt-1 text-2xs z-50 `}>
                    Party with
                  </CustomText>
                  <CustomText
                    style={tw`text-white font-poppinsMedium text-xs z-50 `}>
                    {artist}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={tw`flex-1 bg-orange3 h-70  w-full rounded-lg`}>
          <View
            style={tw`bg-orange4 h-full w-4/5 rounded-full self-center items-center justify-center`}>
            <View
              style={tw`bg-orange5 h-[80%] w-4/5 items-center justify-center rounded-full`}>
              <View
                style={tw`bg-orange2 h-[75%] self-center justify-center w-3/4 rounded-full`}>
                <View
                  style={tw`bg-orange6 h-[75%] justify-center items-center rounded-full w-3/4 self-center`}>
                  {imageUrl ? (
                    <CustomImage
                      uri={imageUrl}
                      style={tw`h-12 w-12 rounded-full`}
                      resizeMode="cover"
                    />
                  ) : (
                    <Icon icon={'account'} color="white" size={45} />
                  )}
                  <CustomText style={tw`text-white mt-1 text-2xs z-50 `}>
                    Party with
                  </CustomText>
                  <CustomText
                    style={tw`text-white font-poppinsMedium text-xs z-50 `}>
                    {artist}
                  </CustomText>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DefaultImages;
