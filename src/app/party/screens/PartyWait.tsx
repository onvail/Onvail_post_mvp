import React, {FunctionComponent, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenContainer from 'components/Screens/ScreenContainer';
import tw from 'src/lib/tailwind';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';

const PartyWait: FunctionComponent = ({navigation}) => {
  const [acceptTC, setAcceptTC] = useState(false);
  const [acceptPrivacyPolicy, setAcceptPrivacyPolicy] = useState(false);

  const EarpieceIcon = generalIcon.EarpieceIcon;
  const TicksmIcon = generalIcon.Ticksm;

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          resizeMode="cover"
          source={require('../../../assets/partywaitbg.png')}
          style={tw`w-full h-70`}
        />
        <EarpieceIcon style={tw`self-center relative -top-8`} />
        <CustomText
          style={tw`w-[60%] text-center self-center mb-10 font-bold text-white text-xl`}>
          For an amazing experience use a headphone
        </CustomText>
        <View style={tw`px-4 mb-20`}>
          <CustomText style={tw`mb-4 font-semibold text-white text-sm`}>
            I will respect all participants and appreciate the creativity and
            music shared during the party.
          </CustomText>
          <CustomText style={tw`mb-4 font-semibold text-white text-sm`}>
            I will not record or redistribute any content from this event. I
            understand that such actions are monitored and prohibited to protect
            the artists' rights.
          </CustomText>
          <CustomText style={tw`mb-4 font-semibold text-white text-sm`}>
            I will uphold privacy and respect throughout the event, contributing
            to a safe and enjoyable experience for everyone.
          </CustomText>
          <CustomText style={tw`mb-8 font-semibold text-white text-sm`}>
            I understand that violating these guidelines may lead to penalties,
            including removal from the event and potential future restrictions.
          </CustomText>
          <View style={tw`mb-12`}>
            <RowContainer style={tw`mb-4`}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={tw`w-2/12 items-center relative`}
                onPress={() => setAcceptTC(!acceptTC)}>
                <View
                  style={tw`w-6 h-6 ${
                    !acceptTC ? 'bg-white border border-white' : ''
                  } rounded-full`}>
                  {acceptTC && (
                    <View
                      style={tw`w-full h-full rounded-full items-center justify-center border border-[#7C1AFC] bg-[#7C1AFC]`}>
                      <TicksmIcon />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <CustomText style={tw`font-semibold text-white text-xs`}>
                I accept the{' '}
                <CustomText style={tw`text-[#7C1AFC]`}>
                  general terms and conditions of use
                </CustomText>
              </CustomText>
            </RowContainer>
            <RowContainer>
              <TouchableOpacity
                activeOpacity={0.9}
                style={tw`w-2/12 items-center relative`}
                onPress={() => setAcceptPrivacyPolicy(!acceptPrivacyPolicy)}>
                <View
                  style={tw`w-6 h-6 ${
                    !acceptPrivacyPolicy ? 'bg-white border border-white' : ''
                  } rounded-full`}>
                  {acceptPrivacyPolicy && (
                    <View
                      style={tw`w-full h-full rounded-full items-center justify-center border border-[#7C1AFC] bg-[#7C1AFC]`}>
                      <TicksmIcon />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <CustomText style={tw`font-semibold text-white text-xs`}>
                I accept the{' '}
                <CustomText style={tw`text-[#7C1AFC]`}>
                  Privacy Policy
                </CustomText>
              </CustomText>
            </RowContainer>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={tw`w-3/12 rounded-14 self-center py-3.5 ${
              acceptTC && acceptPrivacyPolicy ? 'bg-[#7C1AFC]' : 'bg-[#292D32]'
            }`}>
            <CustomText
              style={tw`font-medium text-center text-sm ${
                acceptTC && acceptPrivacyPolicy
                  ? 'text-white'
                  : 'text-[#4C4C4C]'
              }`}>
              Join Party
            </CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default PartyWait;
