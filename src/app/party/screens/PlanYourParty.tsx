import React, {FunctionComponent} from 'react';
import {Pressable, ScrollView, View, TouchableOpacity} from 'react-native';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import CustomText from 'src/app/components/Text/CustomText';
import CustomTextInput from 'src/app/components/TextInput/CustomTextInput';
import RowContainer from 'src/app/components/View/RowContainer';
import tw from 'src/lib/tailwind';
import FormSelector from '../components/FormSelector';
import SwitchSelector from '../components/SwitchSelector';

const PlanYourParty: FunctionComponent = () => {
  const GalleryThumbnailSvg = generalIcon.GalleryThumbnail;
  return (
    <ScreenContainer screenHeader="Plan your party" goBack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`mx-4 flex-1 mt-6 mb-20`}>
        <View style={tw`  `}>
          <CustomText style={tw`mb-2`}>Title</CustomText>
          <CustomTextInput
            placeholder="I am on Onvail"
            backgroundColor="transparent"
            borderColor={'#717171'}
            borderWidth="1"
            style={tw`text-white w-full`}
          />
        </View>
        <View style={tw``}>
          <CustomText>Title</CustomText>
          <CustomTextInput
            placeholder="I am on Onvail"
            backgroundColor="transparent"
            borderColor={'#717171'}
            borderWidth="1"
            height={120}
            multiline={true}
            textAlignVertical="top"
            style={tw`h-11/12 w-full text-white`}
          />
        </View>
        <View>
          <Pressable
            style={tw`border border-grey2 h-50 items-center justify-center rounded-md`}>
            <RowContainer>
              <GalleryThumbnailSvg />
              <CustomText style={tw`ml-3`}>Add an image</CustomText>
            </RowContainer>
          </Pressable>
        </View>
        <View style={tw`mt-6`}>
          <FormSelector
            description="Add music file"
            instruction="(max 500mb)"
            icon="library-music"
          />
        </View>
        <View style={tw`mt-6`}>
          <FormSelector
            description="Fix a date"
            instruction="Today"
            icon="calendar-month"
          />
        </View>
        <View style={tw`mt-6`}>
          <FormSelector
            description="Pick a time"
            instruction="01:30"
            icon="schedule"
          />
        </View>
        <View style={tw`mt-6`}>
          <SwitchSelector description="Add voting poll" optional />
        </View>
        <View style={tw`mt-6`}>
          <SwitchSelector description="Public" optional />
        </View>
        <View style={tw`mt-8`}>
          <TouchableOpacity
            style={tw`bg-purple h-13 items-center justify-center rounded-full`}>
            <CustomText style={tw`text-base`}>Save</CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default PlanYourParty;
