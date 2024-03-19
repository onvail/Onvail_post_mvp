import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomImage from 'src/app/components/Image/CustomImage';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import tw from 'src/lib/tailwind';

export interface NotificationProps {
  imageUri: string;
  subject: string;
  message: string;
  timeStamp: string;
}

const NotificationCard: FunctionComponent<NotificationProps> = ({
  imageUri,
  subject,
  message,
  timeStamp,
}) => {
  return (
    <View style={tw` border-b-[0.3px] border-grey2 `}>
      <RowContainer style={tw`justify-between px-3 pb-3`}>
        <RowContainer>
          <LinearGradient
            style={tw`h-20 w-20 border-white rounded-full  items-center justify-center`}
            colors={['#392655', '#1A76E7']}>
            <CustomImage
              uri={imageUri}
              style={tw`h-18.5 w-18.5 rounded-full `}
              resizeMode="cover"
            />
          </LinearGradient>
          <View style={tw`ml-5`}>
            <CustomText style={tw`font-poppinsBold`}>{subject}</CustomText>
            <CustomText>{message}</CustomText>
          </View>
        </RowContainer>
        <View style={tw``}>
          <CustomText>{timeStamp}</CustomText>
        </View>
      </RowContainer>
    </View>
  );
};

export default NotificationCard;
