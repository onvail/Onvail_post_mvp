import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import RowContainer from '../View/RowContainer';
import CustomText from '../Text/CustomText';
import Icon from '../Icons/Icon';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';

interface Props {
  musicTitle: string;
  uri: string;
  artiste: string;
}

const MiniMusicPlayer: FunctionComponent<Props> = ({
  musicTitle,
  uri,
  artiste,
}) => {
  const track = {
    url: uri, // Load media from the network
    title: musicTitle,
    artist: artiste,
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
    artwork: 'http://example.com/cover.png', // Load artwork from the network
    duration: 402, // Duration in seconds
  };
  return (
    <View>
      <RowContainer>
        <View style={tw`mr-3`}>
          <CustomText style={tw`text-xs font-poppinsMedium`}>
            {musicTitle}
          </CustomText>
          <CustomText style={tw`text-grey2 text-right text-xs`}>
            {artiste}
          </CustomText>
        </View>
        <View style={tw`bg-white rounded-full`}>
          <Icon icon={'play'} color={Colors.primary} size={25} />
        </View>
        <View style={tw`border-[0.5px] h-9 mx-3 border-grey2`} />
        <TouchableOpacity style={tw`bg-white rounded-full  px-2 py-1`}>
          <CustomText style={tw`text-primary text-xs`}>Open</CustomText>
        </TouchableOpacity>
      </RowContainer>
    </View>
  );
};

export default MiniMusicPlayer;
