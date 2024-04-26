import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Camera} from 'react-native-vision-camera';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomImage from 'src/app/components/Image/CustomImage';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import useCamera, {CameraType} from 'src/app/hooks/useCamera';
import tw from 'src/lib/tailwind';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import Icon from 'src/app/components/Icons/Icon';
import {Colors} from 'src/app/styles/colors';
import useDocumentPicker from 'src/app/hooks/useDocumentPicker';
import {MediaType, launchImageLibrary} from 'react-native-image-picker';
import {FileUploadItem, uploadToCloudinary} from 'src/utils/utilities';
import api from 'src/api/api';
import {DocumentPickerResponse} from 'react-native-document-picker';
import {MainStackParamList} from 'src/app/navigator/types/MainStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMutation, useQueryClient} from '@tanstack/react-query';

type PostOptions = 'Post' | 'Story';
const postOptions: PostOptions[] = ['Post', 'Story'];
type Props = NativeStackScreenProps<MainStackParamList, 'CreateNewPost'>;

const CreateNewPosts: FunctionComponent<Props> = ({navigation}) => {
  const [selectedPostOptions, setSelectedPostOptions] =
    useState<PostOptions>('Post');
  const [selectedCamera, setSelectedCamera] = useState<CameraType>('back');
  const {hasPermission, requestPermission, device} = useCamera({
    camera: selectedCamera,
  });
  const [lastImage, setLastImage] = useState<string | undefined>(undefined);
  const [displayLastTakenImage, setDisplayLastTakenImage] =
    useState<boolean>(false);
  const [postText, setPostText] = useState<string>('');
  const [multiMediaFiles, setMultiMediaFiles] = useState<string[]>([]);

  const camera = useRef<Camera>(null);
  const {selectDocument} = useDocumentPicker({
    pickSingle: true,
  });
  const queryClient = useQueryClient();

  const GallerSvg = generalIcon.Gallery;
  const VideoSvg = generalIcon.VideoIcon;
  const MusicSvg = generalIcon.MusicSquareIcon;
  const SendSvg = generalIcon.SendIcon;
  const CameraSwitchSvg = generalIcon.CameraSwitch;

  const handleCamera = useCallback(async () => {
    if (hasPermission) {
      return;
    } else {
      await requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const handleCameraSwitch = () => {
    setSelectedCamera(selectedCamera === 'back' ? 'front' : 'back');
  };

  const handleSelectMediaFromGallery = async (mediaType: MediaType) => {
    try {
      const result = await launchImageLibrary({
        mediaType: mediaType,
      });
      const file: FileUploadItem = {
        name: result?.assets?.[0]?.fileName!,
        type: result?.assets?.[0]?.fileName!,
        uri: result?.assets?.[0]?.uri!,
      };
      const response = await uploadToCloudinary(file);
      setMultiMediaFiles(prev => [...prev, response?.file_url]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCapture = async () => {
    try {
      const file = await camera?.current?.takePhoto({
        flash: 'auto', // 'auto' | 'off' | 'on'
      });
      const asset = await CameraRoll.saveAsset(`file://${file?.path}`, {
        type: 'photo',
        album: 'photo',
      });
      setLastImage(asset?.node?.image?.uri);
      setDisplayLastTakenImage(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSongsSelection = async () => {
    try {
      const songresponse = await selectDocument();
      const song = songresponse as DocumentPickerResponse;
      const songFile: FileUploadItem = {
        name: song?.name!,
        type: 'audio/mp4',
        uri: song?.uri,
      };
      const response = await uploadToCloudinary(songFile);

      setMultiMediaFiles(prev => [...prev, response?.file_url]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await api.post({
          url: '/users/post',
          data: {
            text: postText,
            mediaFiles: multiMediaFiles,
          },
          requiresToken: true,
          authorization: true,
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.refetchQueries({queryKey: ['posts']});
    },
  });

  useEffect(() => {
    handleCamera();
  }, [handleCamera]);

  return (
    <ScreenContainer goBack>
      <View style={tw` flex-1 mt-4`}>
        {selectedPostOptions === 'Post' && (
          <View style={tw`bg-purple min-h-[70%] mx-5 text-sm rounded-lg p-3 `}>
            <TextInput
              placeholder="wanna say something?"
              placeholderTextColor={'white'}
              multiline
              textAlignVertical="top"
              onChangeText={text => setPostText(text)}
              style={tw` h-9/12 text-sm rounded-lg mt-2 font-poppinsRegular text-white`}
            />
            <RowContainer style={tw`mt-2 items-end flex-1 justify-between`}>
              <RowContainer style={tw`w-2/5 justify-between`}>
                <Pressable
                  onPress={() => handleSelectMediaFromGallery('photo')}>
                  <GallerSvg />
                </Pressable>
                <Pressable
                  onPress={() => handleSelectMediaFromGallery('video')}>
                  <VideoSvg />
                </Pressable>
                <Pressable onPress={() => handleSongsSelection()}>
                  <MusicSvg />
                </Pressable>
              </RowContainer>
              <Pressable onPress={() => handleFollowMutation.mutate()}>
                <SendSvg />
              </Pressable>
            </RowContainer>
          </View>
        )}
        {selectedPostOptions === 'Story' &&
          device &&
          !displayLastTakenImage && (
            <View style={tw`relative h-[90%]`}>
              <Camera
                style={[StyleSheet.absoluteFill, tw`h-[95%] rounded`]}
                device={device}
                ref={camera}
                photo={true}
                isActive={true}
              />
              <View
                style={tw`self-end m-4 p-1 items-center justify-center rounded-full bg-black `}>
                <CameraSwitchSvg onPress={handleCameraSwitch} />
              </View>
              <LinearGradient
                style={tw`h-20 w-20 rounded-full absolute bottom-15 left-35 justify-center items-center`}
                colors={['#6F00FF', '#1A76E7']}>
                <Pressable
                  onPress={() => handleCapture()}
                  style={tw`h-16 w-16  bg-white   rounded-full`}
                />
              </LinearGradient>
            </View>
          )}
        {displayLastTakenImage && lastImage && (
          <View style={tw`w-100 relative h-150`}>
            <Pressable
              onPress={() => setDisplayLastTakenImage(false)}
              style={tw`absolute bg-black top-12 left-4 rounded-full opacity-60 z-100`}>
              <Icon icon={'close'} color={Colors.grey} size={30} />
            </Pressable>
            <CustomImage uri={lastImage} style={tw`h-[100%] w-[100%]`} />
          </View>
        )}

        <RowContainer style={tw`mb-6 mx-5 mt-5 items-end  justify-center`}>
          {lastImage && selectedPostOptions === 'Story' && (
            <Pressable onPress={() => setDisplayLastTakenImage(true)}>
              <CustomImage uri={lastImage} style={tw`h-16 w-16 rounded-lg`} />
            </Pressable>
          )}
          {postOptions.map((post, _) => {
            const activeBackground =
              post === selectedPostOptions ? 'border-b border-purple' : '';
            return (
              <Pressable
                onPress={() => {
                  setSelectedPostOptions(post);
                  setDisplayLastTakenImage(false);
                }}
                style={tw` w-15 justify-center items-center ${activeBackground}`}
                key={post}>
                <CustomText style={tw`text-white`}>{post}</CustomText>
              </Pressable>
            );
          })}
        </RowContainer>
      </View>
    </ScreenContainer>
  );
};

export default CreateNewPosts;
