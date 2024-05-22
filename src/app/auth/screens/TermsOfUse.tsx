import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useForm} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';
import api from 'src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorageKeys from 'src/api/config/local-storage-keys';
import messaging from '@react-native-firebase/messaging';
import {AuthError} from 'src/types/authType';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const TermsOfUse: FunctionComponent<Props> = ({navigation}) => {
  const TicksmIcon = generalIcon.Ticksm;
  const [receiveMarketingCom, setReceiveMarketingCom] =
    useState<boolean>(false);
  const [allowForMarketing, setAllowForMarketing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apnToken, setApnToken] = useState<string | null>(null);

  const {handleSubmit} = useForm({
    mode: 'all',
  });

  const storeUser = useSignUpStore((state: SignUpStoreState) => state.user);

  const onSubmit = async () => {
    setIsLoading(true);
    const formData = {
      ...storeUser,
      FCMToken: apnToken ?? storeUser.stageName,
    };
    try {
      const response = await api.post({
        url: 'users/register',
        data: formData,
      });
      AsyncStorage.multiSet([
        [localStorageKeys.accessToken, response?.data?.accessToken],
        [localStorageKeys.userInfo, JSON.stringify(response?.data)],
      ]);
      navigation.replace('AccountCreated');
    } catch (err: unknown) {
      const error = err as AuthError;
      console.log(error.response?.data);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Login error',
        textBody: error?.response?.data?.error,
        titleStyle: tw`font-poppinsRegular text-xs`,
        textBodyStyle: tw`font-poppinsRegular text-xs`,
      });
    }
    setIsLoading(false);
  };

  const requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        const push_notification_token = await messaging().getToken();
        setApnToken(push_notification_token);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  return (
    <AuthScreenContainer>
      <View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={tw`mt-12 px-3`}>
            <RowContainer style={tw`mb-12 mt-3 items-center`}>
              <Icon
                onPress={() => navigation.goBack()}
                icon={'chevron-left'}
                color="white"
                size={30}
              />
            </RowContainer>
            <View>
              <View
                style={tw`w-46 h-46 self-center rounded-full bg-[#7C1AFC] items-center justify-center mb-16`}>
                <CustomText style={tw`text-black text-[123px] font-semibold`}>
                  {storeUser.stageName.charAt(0)}
                </CustomText>
              </View>
              <View style={tw`border-[0.5px] border-white mb-18`} />
              <View style={tw`mb-8`}>
                <CustomText style={tw`text-white text-sm mb-3`}>
                  Onvail is customized for you. By tapping ‘Create account,’ you
                  agree to our Terms of Use.
                </CustomText>
                <CustomText style={tw`text-[#9747FF] text-sm`}>
                  Terms of Use
                </CustomText>
              </View>
              <View style={tw`mb-12`}>
                <CustomText style={tw`text-white text-sm mb-3`}>
                  For details on how Onvail collects, uses, shares, and
                  safeguards your personal data, please review our Privacy
                  Policy.
                </CustomText>
                <CustomText style={tw`text-[#9747FF] text-sm`}>
                  Privacy Policy
                </CustomText>
              </View>
              <View>
                <RowContainer style={tw`items-center mb-8`}>
                  <CustomText style={tw`text-white text-xs mb-3 w-10/12`}>
                    I choose not to receive marketing communications from
                    Onvail.
                  </CustomText>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={tw`w-2/12 items-center relative -top-2`}
                    onPress={() =>
                      setReceiveMarketingCom(!receiveMarketingCom)
                    }>
                    <View
                      style={tw`w-6 h-6 ${
                        !receiveMarketingCom ? 'border border-white' : ''
                      } rounded-full`}>
                      {receiveMarketingCom && (
                        <View
                          style={tw`w-full h-full rounded-full items-center justify-center border border-[#7C1AFC] bg-[#7C1AFC]`}>
                          <TicksmIcon />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </RowContainer>
                <RowContainer style={tw`items-center mb-6`}>
                  <CustomText style={tw`text-white text-xs mb-3 w-10/12`}>
                    Allow Onvail's content providers to use my registration data
                    for marketing.
                  </CustomText>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={tw`w-2/12 items-center relative -top-2`}
                    onPress={() => setAllowForMarketing(!allowForMarketing)}>
                    <View
                      style={tw`w-6 h-6 ${
                        !allowForMarketing ? 'border border-white' : ''
                      } rounded-full`}>
                      {allowForMarketing && (
                        <View
                          style={tw`w-full h-full rounded-full items-center justify-center border border-[#7C1AFC] bg-[#7C1AFC]`}>
                          <TicksmIcon />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </RowContainer>
              </View>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit(onSubmit)}
            style={tw`w-3/5 rounded-12 bg-[#7C1AFC] self-center mt-6 mb-10 py-4.5`}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <CustomText style={tw`text-white text-center font-bold text-lg`}>
                Create account
              </CustomText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </AuthScreenContainer>
  );
};

export default TermsOfUse;
