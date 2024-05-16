import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
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
  viewNotification: any;
}

const NotificationCard: FunctionComponent<NotificationProps> = ({
  imageUri,
  subject,
  message,
  timeStamp,
  viewNotification,
}) => {
  return (
    <View style={tw` border-b-[0.3px] border-grey2 pt-3`}>
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
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={viewNotification}
          style={tw`bg-[#7C1AFC] px-5 py-1.8 rounded-12`}>
          <CustomText>View</CustomText>
        </TouchableOpacity>
      </RowContainer>
    </View>
  );
};

export default NotificationCard;
