import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  SafeAreaView,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
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
import CommentCards from 'src/app/components/Cards/CommentCards';
import RowContainer from 'src/app/components/View/RowContainer';
import {FlashList, ListRenderItem} from '@shopify/flash-list';
import MusicList from '../components/MusicList';
import useMusicPlayer from 'src/app/hooks/useMusicPlayer';
import {VolumeManager} from 'react-native-volume-manager';
import {Track} from 'react-native-track-player';
import CustomImage from 'src/app/components/Image/CustomImage';
import {Song} from 'src/types/partyTypes';
import {Audio} from 'expo-av';
import {AVPlaybackStatusSuccess} from 'expo-av';

type Props = NativeStackScreenProps<MainStackParamList, 'PartyScreen'>;

const PartyScreen: FunctionComponent<Props> = ({navigation, route}) => {
  const {party, partyBackgroundColor} = route.params;
  const HighLightLeft = generalIcon.HighLightLeft;
  const HighLightRight = generalIcon.HighLightRight;
  const PauseIcon = generalIcon.PauseIcon;
  const PlayIcon = generalIcon.PlayIcon;
  const SendIcon = generalIcon.SendIcon;
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);
  const [isSameQueue, setIsSameQueue] = useState<boolean>(false);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>(
    {},
  );

  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const songs: Song[] = party?.songs;

  const allTracks = useMemo(() => {
    return songs.map(song => ({
      genre: '',
      album: '',
      artwork: party?.albumPicture,
      duration: 30,
      url: song?.file_url,
      id: song?._id,
      date: party?.date,
      title: song?.name,
      artist: party?.artist?.name,
    }));
  }, [party?.artist?.name, party?.date, songs, party?.albumPicture]);

  const fetchDuration = useCallback(async (uri: string) => {
    const sound = new Audio.Sound();

    try {
      const response = await sound.loadAsync({
        uri,
      });
      const trackDetails: AVPlaybackStatusSuccess =
        response as AVPlaybackStatusSuccess;
      const duration = trackDetails?.durationMillis ?? 0;
      return duration;
    } catch (error) {
      return 0;
    } finally {
      await sound.unloadAsync();
    }
  }, []);

  useEffect(() => {
    const fetchAllDurations = async () => {
      const durations: Record<string, number> = {};

      try {
        await Promise.all(
          allTracks.map(async track => {
            try {
              const duration = await fetchDuration(track.url);
              durations[track.id] = duration;
            } catch (error) {
              console.error(error);
            }
          }),
        );
        setTrackDurations(durations);
      } catch (error) {}
    };

    if (allTracks.length > 0) {
      fetchAllDurations();
    }
  }, [allTracks, fetchDuration]);

  const {handlePauseAndPlayTrack, playerState, checkIfTrackQueueIsDifferent} =
    useMusicPlayer({
      track: allTracks,
    });

  const volumeHandler = useCallback(async () => {
    await VolumeManager.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    volumeHandler();
  }, [volume, volumeHandler]);

  const renderItem: ListRenderItem<Track> = ({item, index}) => {
    const {artist, title, url, id} = item;
    const trackDuration = trackDurations[id] ?? 0;
    return (
      <MusicList
        duration={trackDuration}
        title={title}
        index={index}
        artist={artist}
        url={url}
        id={item?.id}
      />
    );
  };

  const buffering = isSameQueue && playerState === 'buffering';

  const handleSameQueueItemState = useCallback(async () => {
    const sameQueue = await checkIfTrackQueueIsDifferent();
    setIsSameQueue(sameQueue);
    return sameQueue;
  }, [checkIfTrackQueueIsDifferent]);

  useLayoutEffect(() => {
    handleSameQueueItemState();
  }, [handleSameQueueItemState]);

  let IconComponent;

  if (isSameQueue && playerState === 'playing') {
    IconComponent = <PauseIcon />;
  } else if (buffering) {
    IconComponent = <ActivityIndicator />;
  } else {
    IconComponent = <PlayIcon />;
  }

  return (
    <LinearGradient
      style={tw`h-full p-4`}
      colors={[
        partyBackgroundColor?.background ?? '#0E0E0E',
        partyBackgroundColor?.detail ?? '#087352',
      ]}>
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`items-end`}>
          <Pressable
            onPress={() =>
              navigation.navigate('BottomNavigator', {
                screen: 'Home',
              })
            }>
            <Icon
              icon="close-circle-outline"
              color={partyBackgroundColor?.secondary ?? 'white'}
              size={35}
            />
          </Pressable>
        </View>
        <View style={tw`mt-8 mb-3 items-center`}>
          <CustomImage
            uri={party.albumPicture}
            resizeMode="cover"
            style={tw`h-60 w-60 rounded-lg`}
          />
          <View style={tw` mt-8 flex-row items-center justify-between`}>
            <HighLightLeft />
            <CustomText style={tw`font-poppinsBold w-10`}>LIVE</CustomText>
            <Pressable onPress={() => openBottomSheet()}>
              <HighLightRight />
            </Pressable>
          </View>
          <View style={tw`mt-6 w-[90%]  justify-center  items-center`}>
            <Pressable
              onPress={handlePauseAndPlayTrack}
              style={tw`w-10 items-center `}>
              {IconComponent}
            </Pressable>
          </View>
          <View style={tw`flex-row w-[90%] mt-6 items-center`}>
            <Icon icon={'volume-low'} color="white" />
            <Slider
              style={tw`w-70`}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FFFF"
              onValueChange={value => setVolume(value)}
            />
            <Icon icon={'volume-medium'} color="white" />
          </View>
        </View>
        <FlashList
          data={allTracks}
          renderItem={renderItem}
          extraData={trackDurations}
          keyExtractor={item => item?.id}
          estimatedItemSize={20}
          estimatedListSize={{
            height: 200,
            width: 300,
          }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
      <CustomBottomSheet
        ref={bottomSheetRef}
        customSnapPoints={[30, 300, 500, 700]}
        backgroundColor={partyBackgroundColor?.background}
        visibilityHandler={() => {}}>
        <View style={tw`flex-1 py-3  pb-7`}>
          <ScrollView style={tw`flex-1 mb-4`}>
            {Array.from({length: 20}).map((_, index) => (
              <CommentCards key={index} />
            ))}
          </ScrollView>
          <RowContainer style={tw` px-6  justify-between `}>
            <View
              style={tw`border flex-row items-center mr-3 justify-between px-3 h-10 rounded-lg border-grey4`}>
              <TextInput
                placeholder="Add comment"
                style={tw`text-white text-sm w-[90%] font-poppinsItalic h-10`}
                placeholderTextColor={'#A2A2A2'}
              />
              <Pressable>
                <SendIcon />
              </Pressable>
            </View>
            <Pressable onPress={() => setIsMuted(!isMuted)} style={tw``}>
              <Icon
                icon={isMuted ? 'microphone' : 'microphone-off'}
                color="white"
                size={25}
              />
            </Pressable>
          </RowContainer>
        </View>
      </CustomBottomSheet>
    </LinearGradient>
  );
};

export default PartyScreen;
