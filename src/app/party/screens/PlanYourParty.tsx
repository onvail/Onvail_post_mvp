import React, {FunctionComponent, useState} from 'react';
import {Pressable, View, TouchableOpacity} from 'react-native';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import CustomText from 'src/app/components/Text/CustomText';
import CustomTextInput from 'src/app/components/TextInput/CustomTextInput';
import RowContainer from 'src/app/components/View/RowContainer';
import tw from 'src/lib/tailwind';
import FormSelector from '../components/FormSelector';
import SwitchSelector from '../components/SwitchSelector';
import CustomCalendar from 'src/app/components/Calendar/CustomCalendar';
import {Party, PartyError, Songs} from 'src/types/partyTypes';
import {useForm, Controller} from 'react-hook-form';
import useImageService from 'src/app/hooks/useImageService';
import CustomImage from 'src/app/components/Image/CustomImage';
import useDocumentPicker from 'src/app/hooks/useDocumentPicker';
import {
  FileUploadItem,
  handleMultipleUploads,
  truncateText,
  uploadToCloudinary,
} from 'src/utils/utilities';
import ErrorText from 'src/app/components/Text/ErrorText';
import VotingPoll from '../components/VotingPoll';
import {toast, Toasts, ToastPosition} from '@backpackapp-io/react-native-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import api from 'src/api/api';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from 'src/app/navigator/types/MainStackParamList';

type Props = NativeStackScreenProps<MainStackParamList, 'PlanYourParty'>;
const PlanYourParty: FunctionComponent<Props> = ({navigation, route}) => {
  const {partyType} = route.params;
  const GalleryThumbnailSvg = generalIcon.GalleryThumbnail;

  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const {tryPickImageFromDevice} = useImageService();

  const defaultValues: Party = {
    partyName: '',
    partyDesc: '',
    songs: [],
    albumPicture: '',
    date: '',
    guests: [],
    visibility: 'public',
    pollOptions: [],
    pollQuestion: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });
  const onSubmit = async (data: Party) => {
    try {
      await api.post({
        url: '/parties/create-party',
        data,
        requiresToken: true,
        authorization: true,
      });
      toast('Party created! 🎉 🎊', {
        duration: 4000,
        position: ToastPosition.TOP,
        styles: {
          view: tw``,
          pressable: tw`-top-20 justify-center items-center bg-purple4`,
          text: tw`text-white font-poppinsBold`,
        },
      });
      navigation.navigate('BottomNavigator', {
        screen: 'Home',
      });
    } catch (error: unknown) {
      const createPartyError = error as PartyError;
      console.log(createPartyError.response?.data);
      toast("Oops! Party didn't create🚨", {
        duration: 4000,
        position: ToastPosition.TOP,
        styles: {
          view: tw``,
          pressable: tw`-top-20 justify-center items-center bg-orange`,
          text: tw`text-white font-poppinsBold`,
        },
      });
    }
  };

  const {selectDocument} = useDocumentPicker();

  const handleSelectPhoto = async (action: 'openCamera' | 'openPicker') => {
    const data = await tryPickImageFromDevice({
      cropImage: true,
      includeBase64: true,
      action: action,
    });
    return data;
  };

  const handleSelectMusicFile = async () => {
    const data = await selectDocument();
    return data;
  };

  const uploadedSongs: Songs[] = watch('songs');
  const uploadedAlbumCover: string = watch('albumPicture');

  return (
    <ScreenContainer screenHeader="Plan your party" goBack>
      <KeyboardAwareScrollView style={tw`flex-1`}>
        <View style={tw`mx-4 flex-1 mt-4 mb-10`}>
          <View style={tw`  `}>
            <RowContainer style={tw`mb-2 justify-between`}>
              <CustomText>Title</CustomText>
              <ErrorText>{errors?.partyName?.message}</ErrorText>
            </RowContainer>
            <Controller
              control={control}
              rules={{
                required: 'Title is required',
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInput
                  placeholder="I am on Onvail"
                  backgroundColor="transparent"
                  borderColor={'#717171'}
                  borderWidth="1"
                  style={tw`text-white w-full`}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                />
              )}
              name="partyName"
            />
          </View>
          <View style={tw``}>
            <RowContainer style={tw`mb-2 justify-between`}>
              <CustomText>About your party</CustomText>
              <ErrorText>{errors?.partyDesc?.message}</ErrorText>
            </RowContainer>
            <Controller
              control={control}
              rules={{
                required: 'Description is required',
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <CustomTextInput
                  placeholder="I am on Onvail"
                  backgroundColor="transparent"
                  borderColor={'#717171'}
                  borderWidth="1"
                  height={120}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  multiline={true}
                  textAlignVertical="top"
                  style={tw`h-11/12 w-full text-white`}
                />
              )}
              name="partyDesc"
            />
          </View>
          <View style={tw``}>
            <ErrorText>{errors?.albumPicture?.message}</ErrorText>
            <Controller
              control={control}
              rules={{
                required: 'Album image is required',
              }}
              render={({field: {onChange}}) => (
                <Pressable
                  onPress={async () => {
                    const image = await handleSelectPhoto('openPicker');
                    const response = await uploadToCloudinary({
                      uri: image?.file?.uri ?? '',
                      type: image?.file?.type ?? '',
                      name: image?.file?.name ?? '',
                    });
                    onChange(response?.file_url);
                  }}
                  style={tw`border border-grey2 h-70  items-center justify-center rounded-md`}>
                  {uploadedAlbumCover.length > 1 ? (
                    <CustomImage
                      resizeMode="contain"
                      uri={uploadedAlbumCover}
                      style={tw`h-50 w-90 rounded-md`}
                    />
                  ) : (
                    <RowContainer>
                      <GalleryThumbnailSvg />
                      <CustomText style={tw`ml-3`}>Add an image</CustomText>
                    </RowContainer>
                  )}
                </Pressable>
              )}
              name="albumPicture"
            />
          </View>
          <View style={tw`mt-3`}>
            <ErrorText>{errors?.songs?.message}</ErrorText>
            <Controller
              control={control}
              rules={{
                required: 'Select a song',
              }}
              render={({field: {onChange}}) => (
                <>
                  <FormSelector
                    description="Add music file"
                    instruction="(max 500mb)"
                    icon="library-music"
                    onPress={async () => {
                      const data = await handleSelectMusicFile();
                      const itemsForCloudinaryUpload: FileUploadItem[] =
                        data?.map(uploadItem => ({
                          uri: uploadItem.uri ?? '',
                          name: uploadItem.name ?? '',
                          type: uploadItem.type ?? '',
                        })) ?? [];
                      const response = await handleMultipleUploads(
                        itemsForCloudinaryUpload,
                      );
                      onChange(response);
                    }}
                  />
                  {uploadedSongs?.map((item, _) => {
                    return (
                      <CustomText
                        style={tw`text-sm mt-1 text-purple`}
                        key={item.name}>
                        {truncateText(item.name!)}
                      </CustomText>
                    );
                  })}
                </>
              )}
              name="songs"
            />
          </View>
          <View style={tw``}>
            <ErrorText>{errors?.date?.message}</ErrorText>
            <Controller
              control={control}
              rules={{
                required: 'Date is required',
              }}
              render={({field: {value}}) => (
                <FormSelector
                  description="Fix a date"
                  instruction="Today"
                  icon="calendar-month"
                  onPress={() => {
                    setIsCalendarVisible(true);
                  }}
                  value={value}
                />
              )}
              name="date"
            />
          </View>

          <VotingPoll
            handlePollOptions={data => setValue('pollOptions', data)}
            handlePollQuestions={data => setValue('pollQuestion', data)}
            partyType={partyType}
          />

          <View style={tw`mt-4`}>
            <Controller
              control={control}
              rules={{
                required: 'Date is required',
              }}
              render={({field: {onChange}}) => (
                <SwitchSelector
                  description="Public"
                  optional
                  onValueChange={state =>
                    onChange(state ? 'public' : 'private')
                  }
                />
              )}
              name="visibility"
            />
          </View>
          <View style={tw`mt-8`}>
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={tw`bg-purple h-13 items-center justify-center rounded-full`}>
              <CustomText style={tw`text-base`}>Save</CustomText>
            </TouchableOpacity>
          </View>
          <Controller
            control={control}
            rules={{
              required: 'Date is required',
            }}
            render={({field: {onChange}}) => (
              <CustomCalendar
                isCalendarVisible={isCalendarVisible}
                onBackDropPress={() => setIsCalendarVisible(false)}
                onDateSelected={date => {
                  onChange(date);
                  setIsCalendarVisible(false);
                }}
              />
            )}
            name="date"
          />
        </View>
      </KeyboardAwareScrollView>
      <Toasts />
    </ScreenContainer>
  );
};

export default PlanYourParty;
