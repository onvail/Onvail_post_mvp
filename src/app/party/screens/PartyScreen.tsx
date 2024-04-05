import React, {FunctionComponent, useRef, useState} from 'react';
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
import {SongsProps, sampleSongs} from 'src/utils/data';
import MusicList from '../components/MusicList';
import useMusicPlayer from 'src/app/hooks/useMusicPlayer';
import {VolumeManager} from 'react-native-volume-manager';

type Props = NativeStackScreenProps<MainStackParamList, 'PartyScreen'>;

const PartyScreen: FunctionComponent<Props> = ({navigation}) => {
  const StormzyCover = generalIcon.StormzyCover;
  const HighLightLeft = generalIcon.HighLightLeft;
  const HighLightRight = generalIcon.HighLightRight;
  const PauseIcon = generalIcon.PauseIcon;
  const PlayIcon = generalIcon.PlayIcon;
  const SendIcon = generalIcon.SendIcon;
  const bottomSheetRef = useRef<CustomBottomSheetRef>(null);

  const [isMuted, setIsMuted] = useState<boolean>(false);

  const openBottomSheet = () => {
    bottomSheetRef.current?.open();
  };

  const {play, pause, isPlaying} = useMusicPlayer();

  const renderItem: ListRenderItem<SongsProps> = ({item, index}) => {
    const {artist, title, duration, songUrl} = item;
    return (
      <MusicList
        duration={duration}
        title={title}
        index={index + 1}
        artist={artist}
        songUrl={songUrl}
      />
    );
  };

  return (
    <LinearGradient style={tw`h-full p-4`} colors={['#0E0E0E', '#087352']}>
      <SafeAreaView style={tw`flex-1`}>
        <View style={tw`items-end`}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon icon="close-circle-outline" color="white" size={35} />
          </Pressable>
        </View>
        <View style={tw`mt-8 mb-3 items-center`}>
          <StormzyCover />
          <View style={tw` mt-8 flex-row items-center justify-between`}>
            <HighLightLeft />
            <CustomText style={tw`font-poppinsBold w-10`}>LIVE</CustomText>
            <Pressable onPress={() => openBottomSheet()}>
              <HighLightRight />
            </Pressable>
          </View>
          <View style={tw`mt-6 w-[90%]  justify-center  items-center`}>
            <Pressable
              onPress={() => (isPlaying ? pause() : play())}
              style={tw`w-10 items-center `}>
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
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
            />
            <Icon icon={'volume-medium'} color="white" />
          </View>
        </View>
        <FlashList
          data={sampleSongs}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.title + index}
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
