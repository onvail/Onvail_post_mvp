import React, {
  FunctionComponent,
  useCallback,
  useEffect,
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
import {State, Track} from 'react-native-track-player';
import CustomImage from 'src/app/components/Image/CustomImage';
import {Song} from 'src/types/partyTypes';

type Props = NativeStackScreenProps<MainStackParamList, 'PartyScreen'>;

const PartyScreen: FunctionComponent<Props> = ({navigation, route}) => {
  const {party} = route.params;
  const HighLightLeft = generalIcon.HighLightLeft;
  const HighLightRight = generalIcon.HighLightRight;
  const PauseIcon = generalIcon.PauseIcon;
  const PlayIcon = generalIcon.PlayIcon;
  const SendIcon = generalIcon.SendIcon;
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);

  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const songs: Song[] = party?.songs;

  const allTracks = useMemo(() => {
    let tracks: Track[] = [];
    for (let i = 0; i < songs.length; i++) {
      const track = {
        url: songs?.[i]?.file_url,
        title: songs?.[i]?.name,
        artist: party?.artist?.name,
        album: '',
        genre: '',
        date: party?.date,
        artwork: party?.albumPicture,
        duration: 30,
        id: songs?.[i]?._id, // Ensure ID is a string if Track type expects it
      };
      tracks.push(track); // Correctly push each track into the tracks array
    }
    return tracks;
  }, [party?.artist?.name, party?.date, songs, party?.albumPicture]);

  const {handlePauseAndPlayTrack, currentTrack, playerState} = useMusicPlayer({
    track: allTracks,
  });

  const volumeHandler = useCallback(async () => {
    await VolumeManager.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    volumeHandler();
  }, [volume, volumeHandler]);

  const renderItem: ListRenderItem<Track> = ({item, index}) => {
    const {artist, title, duration, url} = item;
    return (
      <MusicList
        duration={duration}
        title={title}
        index={index}
        artist={artist}
        url={url}
        id={item?.id}
      />
    );
  };

  const currentItem = useMemo(() => {
    return allTracks.some(item => currentTrack?.id === item.id) &&
      playerState === State.Playing
      ? true
      : false;
  }, [allTracks, currentTrack, playerState]);

  return (
    <LinearGradient style={tw`h-full p-4`} colors={['#0E0E0E', '#087352']}>
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`items-end`}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon icon="close-circle-outline" color="white" size={35} />
          </Pressable>
        </View>
        <View style={tw`mt-8 mb-3 items-center`}>
          <CustomImage
            uri={party.albumPicture}
            style={tw`h-70 w-70  rounded-lg`}
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
              {currentItem ? <PauseIcon /> : <PlayIcon />}
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
