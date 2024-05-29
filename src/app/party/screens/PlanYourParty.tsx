import React, {FunctionComponent, useCallback, useRef, useState} from 'react';
import {Pressable, View} from 'react-native';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import CustomText from 'src/app/components/Text/CustomText';
import CustomTextInput from 'src/app/components/TextInput/CustomTextInput';
import RowContainer from 'src/app/components/View/RowContainer';
import tw from 'src/lib/tailwind';
import FormSelector from '../components/FormSelector';
import SwitchSelector from '../components/SwitchSelector';
import CustomCalendar from 'src/app/components/Calendar/CustomCalendar';
import {Party, PartyError} from 'src/types/partyTypes';
import {useForm, Controller} from 'react-hook-form';
import useImageService, {ImageFromDevice} from 'src/app/hooks/useImageService';
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
import DefaultImages from '../components/DefaultImages';
import {DocumentPickerResponse} from 'react-native-document-picker';
import ViewShot, {captureRef} from 'react-native-view-shot';
import ProceedBtn from 'src/app/components/Buttons/ProceedBtn';
import CustomTimePicker from 'src/app/components/Calendar/CustomTimePicker';
import Modal from 'react-native-modal/dist/modal';
import useUser from 'src/app/hooks/useUserInfo';

type Props = NativeStackScreenProps<MainStackParamList, 'PlanYourParty'>;
const PlanYourParty: FunctionComponent<Props> = ({navigation, route}) => {
  const {partyType} = route.params;

  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<ImageColors>('purple');

  const [
    isApplicationClosingDatePickerVisible,
    setIsApplicationClosingDatePickerVisible,
  ] = useState<boolean>(false);

  const [selectedImageOption, setSelectedImageOption] = useState<
    'uploadedImage' | 'default-purple' | 'default-orange'
  >('default-purple');
  const [selectedImage, setSelectedImage] = useState<ImageFromDevice | null>(
    null,
  );
  const [musicFiles, setMusicFiles] = useState<DocumentPickerResponse[]>([]);
  const [isCreatingParty, setIsCreatingParty] = useState<boolean>(false);
  const {tryPickImageFromDevice} = useImageService();

  const defaultValues: Party = {
    partyName: '',
    partyDesc: '',
    songs: [],
    albumPicture: '',
    date: new Date().toISOString(),
    visibility: 'public',
    guests: ['example@gmail.com'],
    pollOptions: [],
    pollQuestion: '',
    partyApplicationClosingDate: new Date().toLocaleDateString(),
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });
  const onSubmit = async (data: Party) => {
    setIsCreatingParty(true);
    const imageUri = await getImageUrl();
    const musicUrl = await getMusicUrl();
    const formData = {
      partyType,
      ...data,
      songs: musicUrl,
      albumPicture: imageUri,
    };
    if (partyType === 'cozy_jam_session') {
      delete formData.guests; // Explicitly delete guests if the array is empty
      delete formData.pollQuestion;
      delete formData.partyApplicationClosingDate;
    }

    try {
      await api.post({
        url: '/parties/create-party',
        data: formData,
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
      navigation.navigate('PartySuccessScreen');
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
    } finally {
      setIsCreatingParty(false);
    }
  };

  const {selectDocument} = useDocumentPicker();

  type ImageColors = 'purple' | 'orange';

  const defaultImageColors: ImageColors[] = ['purple', 'orange'];

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

  const ref = useRef<any>();
  const captureDefaultImage = async () => {
    const response = await captureRef(ref, {
      format: 'jpg',
      quality: 0.8,
    });
    return response;
  };

  const getImageUrl = async () => {
    let fileUri;
    if (selectedImageOption === 'uploadedImage') {
      fileUri = selectedImage?.file.uri;
    } else {
      fileUri = await captureDefaultImage();
    }
    const response = await uploadToCloudinary({
      uri: fileUri ?? '',
      type: 'jpeg',
      name: 'album-image',
    });
    return response?.file_url;
  };

  const getMusicUrl = async () => {
    const itemsForCloudinaryUpload: FileUploadItem[] =
      musicFiles?.map(uploadItem => ({
        uri: uploadItem.uri ?? '',
        name: uploadItem.name ?? '',
        type: uploadItem.type ?? '',
      })) ?? [];
    try {
      const response = await handleMultipleUploads(itemsForCloudinaryUpload);
      if (response?.[0] !== undefined) {
        return response.map(item => ({
          name: item?.name,
          file_url: item?.file_url,
        }));
      }
      console.log('response', response);
    } catch (error) {
      console.log('error', error);
    }
  };

  const onCapture = useCallback((uri: string) => {
    console.log('do something with ', uri);
  }, []);

  const {user} = useUser();

  return (
    <ScreenContainer screenHeader="Plan your party" goBack>
      <KeyboardAwareScrollView style={tw``}>
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
              render={({field: {}}) => (
                <View>
                  <Pressable
                    style={tw`  items-center justify-center rounded-md`}>
                    {selectedImageOption === 'uploadedImage' &&
                      selectedImage && (
                        <CustomImage
                          resizeMode="cover"
                          uri={selectedImage?.file.uri!}
                          style={tw`h-70 w-full rounded-md`}
                        />
                      )}
                    {(selectedImageOption === 'default-orange' ||
                      selectedImageOption === 'default-purple') && (
                      <ViewShot
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{height: 290, width: 360}}
                        onCapture={onCapture}
                        ref={ref}
                        options={{format: 'jpg', quality: 0.9}}>
                        <View style={tw`h-[100%] w-[100%]`}>
                          <DefaultImages
                            color={selectedColor}
                            artist={user.name}
                            imageUrl={
                              user?.image ??
                              'https://img.icons8.com/nolan/64/user-default.png'
                            }
                          />
                        </View>
                      </ViewShot>
                    )}
                  </Pressable>
                  <RowContainer style={tw`mt-2 justify-between`}>
                    <RowContainer>
                      <Pressable
                        onPress={async () => {
                          try {
                            const image = await handleSelectPhoto('openPicker');
                            setSelectedImage(image);
                            setSelectedImageOption('uploadedImage');
                          } catch (error) {}
                        }}>
                        <CustomText style={tw``}>Upload image</CustomText>
                      </Pressable>
                      {selectedImage && (
                        <Pressable
                          onPress={() =>
                            setSelectedImageOption('uploadedImage')
                          }>
                          <CustomImage
                            resizeMode="cover"
                            uri={selectedImage?.file?.uri!}
                            style={tw`h-6 w-6 rounded-full ml-2 ${
                              selectedImageOption === 'uploadedImage'
                                ? 'border border-white'
                                : ''
                            }`}
                          />
                        </Pressable>
                      )}
                    </RowContainer>
                    <RowContainer>
                      {defaultImageColors.map((item, _) => (
                        <Pressable
                          key={item}
                          onPress={() => {
                            setSelectedColor(item);
                            setSelectedImageOption(
                              item === 'orange'
                                ? 'default-orange'
                                : 'default-purple',
                            );
                          }}
                          style={tw`h-5  ${
                            selectedImageOption.includes(item)
                              ? 'border border-white'
                              : ''
                          } w-5 ml-2 rounded-full bg-${item}`}
                        />
                      ))}
                    </RowContainer>
                  </RowContainer>
                </View>
              )}
              name="albumPicture"
            />
          </View>
          <View style={tw``}>
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
                      const file = data as DocumentPickerResponse[];
                      setMusicFiles(file);
                      onChange(file);
                    }}
                  />

                  {musicFiles?.map((item, _) => {
                    return (
                      <CustomText
                        style={tw`text-sm mt-1 text-purple`}
                        key={item.name}>
                        {item.name ? truncateText(item?.name) : ''}
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
                  value={new Date(value).toLocaleString()}
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
              rules={{}}
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
          {partyType === 'artist_show_down' && (
            <View style={tw``}>
              <ErrorText>
                {errors?.partyApplicationClosingDate?.message}
              </ErrorText>
              <Controller
                control={control}
                rules={{
                  required: 'Application closing date required',
                }}
                render={({field: {value}}) => (
                  <FormSelector
                    description="Application closes by (Date)"
                    instruction="Today"
                    icon="calendar-month"
                    onPress={() => {
                      setIsApplicationClosingDatePickerVisible(true);
                    }}
                    value={value}
                  />
                )}
                name="partyApplicationClosingDate"
              />
            </View>
          )}
          <View style={tw`mt-8`}>
            <ProceedBtn
              onPress={handleSubmit(onSubmit)}
              title="Save"
              isLoading={isCreatingParty}
              containerStyle={tw`bg-purple h-13 items-center justify-center rounded-full`}
            />
          </View>
          <Controller
            control={control}
            rules={{
              required: 'Date is required',
            }}
            render={({field: {onChange}}) => (
              <Modal
                isVisible={isCalendarVisible}
                onBackdropPress={() => setIsCalendarVisible(false)}>
                <View style={tw`bg-white rounded-md`}>
                  <CustomTimePicker
                    showTimePicker={isCalendarVisible}
                    onChangeTime={date => {
                      onChange(date);
                    }}
                  />
                </View>
              </Modal>
            )}
            name="date"
          />

          <Controller
            control={control}
            rules={{
              required: 'Application closing Date is required',
            }}
            render={({field: {onChange}}) => (
              <CustomCalendar
                isCalendarVisible={isApplicationClosingDatePickerVisible}
                onBackDropPress={() =>
                  setIsApplicationClosingDatePickerVisible(false)
                }
                onDateSelected={date => {
                  onChange(date);
                  setIsApplicationClosingDatePickerVisible(false);
                }}
              />
            )}
            name="partyApplicationClosingDate"
          />
        </View>
      </KeyboardAwareScrollView>
      <Toasts />
    </ScreenContainer>
  );
};

export default PlanYourParty;
