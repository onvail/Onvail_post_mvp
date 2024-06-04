import React, {FunctionComponent, useState} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {Avatar, Divider} from 'react-native-paper';
import Icon from 'src/app/components/Icons/Icon';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import useUser from 'src/app/hooks/useUserInfo';
import tw from 'src/lib/tailwind';
import Links from '../components/Links';
import RoundedBtn from 'src/app/components/Buttons/RoundedBtn';
import useImageService from 'src/app/hooks/useImageService';
import CustomImage from 'src/app/components/Image/CustomImage';
import {uploadToCloudinary} from 'src/utils/utilities';
import api from 'src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageKeys from 'src/api/config/local-storage-keys';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from 'src/app/navigator/types/MainStackParamList';
import {Colors} from 'src/app/styles/colors';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

const Settings: FunctionComponent<Props> = ({navigation}) => {
  const {user, updateUser} = useUser();
  const {tryPickImageFromDevice} = useImageService();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState<boolean>(false);

  const updateImage = async (url: string) => {
    try {
      const response = await api.put({
        url: 'users/update-profile',
        data: {
          image: url,
        },
        authorization: true,
        requiresToken: true,
      });
      updateUser(response);
    } catch (error) {
      console.log('error encountered', error);
    }
  };

  const logout = async () => {
    navigation.replace('AuthNavigator', {
      screen: 'Login',
    });
    await AsyncStorage.removeItem(localStorageKeys.accessToken);
    await AsyncStorage.removeItem(localStorageKeys.userInfo);
  };

  const handleSelectPhoto = async (action: 'openCamera' | 'openPicker') => {
    setIsImageUploading(true);
    try {
      const data = await tryPickImageFromDevice({
        cropImage: true,
        includeBase64: true,
        action: action,
      });
      if (data) {
        const response = await uploadToCloudinary({
          uri: data?.file?.uri ?? '',
          type: data?.file?.type ?? '',
          name: data?.file?.name ?? '',
        });
        setProfileImage(response?.file_url);
        updateImage(response?.file_url);
      }
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setIsImageUploading(false);
    }
  };
  return (
    <ScreenContainer goBack screenHeader="Settings">
      <View style={tw`flex-1 mx-3 `}>
        <View style={tw`mt-12 justify-center items-center `}>
          <View style={tw`relative`}>
            {profileImage || user?.image ? (
              <CustomImage
                uri={user?.image ?? profileImage}
                style={tw`h-40 w-40 rounded-full`}
              />
            ) : (
              <Avatar.Text
                style={tw`bg-purple items-center justify-center  rounded-full`}
                size={160}
                label={user?.name?.substring(0, 1)!}
                labelStyle={tw`text-primary  font-poppinsRegular`}
              />
            )}
            {isImageUploading && (
              <ActivityIndicator
                color={Colors.purple}
                style={tw`absolute top-[50%] left-[18%]`}
              />
            )}
            <Pressable
              onPress={() => handleSelectPhoto('openPicker')}
              style={tw`absolute right-4 bottom-2`}>
              <Icon icon={'plus-circle'} color="white" size={27} />
            </Pressable>
          </View>
          <Divider style={tw`w-full mt-8`} />
        </View>
        <View style={tw`mt-4`}>
          <Links title="Reset Password" onPress={() => {}} />
          <Links title="Delete Account" onPress={() => {}} />
          <Links title="Contact Support" onPress={() => {}} />
          <Links title="About" onPress={() => {}} />
          <Links title="Feedback" onPress={() => {}} />
        </View>
        <View style={tw`flex-1 items-center justify-end mb-12`}>
          <RoundedBtn
            title="Log out"
            containerStyle={tw`bg-white w-1/4 items-center p-2 rounded-3xl`}
            textStyle={tw`text-primary font-poppinsMedium`}
            onPress={() => logout()}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Settings;
