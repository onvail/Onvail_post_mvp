import React, {FunctionComponent, useRef} from 'react';
import {Pressable, SafeAreaView, View, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'src/app/components/Icons/Icon';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomText from 'src/app/components/Text/CustomText';
import tw from 'src/lib/tailwind';
import Slider from '@react-native-community/slider';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from 'src/app/navigator/types/MainStackParamList';
import CustomBottomSheet, {
  CustomBottomSheetRef,
} from 'src/app/components/BottomSheet/CustomBottomsheet';

type Props = NativeStackScreenProps<MainStackParamList, 'PartyScreen'>;

const PartyScreen: FunctionComponent<Props> = ({navigation}) => {
  const StormzyCover = generalIcon.StormzyCover;
  const HighLightLeft = generalIcon.HighLightLeft;
  const HighLightRight = generalIcon.HighLightRight;
  const PauseIcon = generalIcon.PauseIcon;
  const PlayIcon = generalIcon.PlayIcon;
  const SendIcon = generalIcon.SendIcon;
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  return (
    <LinearGradient style={tw`h-full p-4`} colors={['#0E0E0E', '#087352']}>
      <SafeAreaView>
        <View style={tw`items-end`}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon icon="close-circle-outline" color="white" size={35} />
          </Pressable>
        </View>
        <View style={tw`mt-8 items-center`}>
          <StormzyCover />
          <View style={tw`w-[80%] mt-8 flex-row items-center justify-between`}>
            <HighLightLeft />
            <CustomText style={tw`font-poppinsBold`}>LIVE</CustomText>
            <Pressable onPress={() => openBottomSheet()}>
              <HighLightRight />
            </Pressable>
          </View>
          <View style={tw`mt-6 w-[80%]  justify-center  items-center`}>
            <PauseIcon />
            <View style={tw`flex-row mt-6 items-center`}>
              <Icon icon={'volume-low'} color="white" />
              <Slider
                style={tw`w-70`}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#FFFF"
              />
              <Icon icon={'volume-medium'} color="white" />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <CustomBottomSheet
        ref={bottomSheetRef}
        id="party-sheet"
        customSnapPoints={[30, 300]}
        visibilityHandler={() => {}}>
        <View style={tw`flex-1`}>
          <View style={tw`flex-1  justify-end py-6 px-4`}>
            <View
              style={tw`border flex-row items-center justify-between px-3 h-10 rounded-lg border-grey4`}>
              <TextInput
                placeholder="Add comment"
                style={tw`text-white text-sm w-[90%] font-poppinsItalic h-10`}
                placeHolderColor={'#A2A2A2'}
              />
              <Pressable>
                <SendIcon />
              </Pressable>
            </View>
          </View>
        </View>
      </CustomBottomSheet>
    </LinearGradient>
  );
};

export default PartyScreen;
