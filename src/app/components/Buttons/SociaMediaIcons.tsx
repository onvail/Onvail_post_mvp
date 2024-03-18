import React, {FunctionComponent} from 'react';
import {generalIcon} from 'components/Icons/generalIcons';
import RowContainer from 'components/View/RowContainer';
import {Pressable} from 'react-native';
import CustomText from 'components/Text/CustomText';
import tw from 'src/lib/tailwind';

const SociaMediaIcons: FunctionComponent = () => {
  const SpotifySvg = generalIcon.Spotify;
  const DeezerSvg = generalIcon.Deezer;
  const XSvg = generalIcon.X;
  const GoogleSvg = generalIcon.Google;
  const StripeSvg = generalIcon.Stripe;
  return (
    <RowContainer style={tw`mt-4`}>
      <Pressable style={tw`items-center mr-3`}>
        <SpotifySvg />
        <CustomText style={tw`text-xs mt-1`}>Spotify</CustomText>
      </Pressable>
      <Pressable style={tw`items-center mr-3`}>
        <DeezerSvg />
        <CustomText style={tw`text-xs mt-1`}>Deezer</CustomText>
      </Pressable>
      <Pressable style={tw`items-center mr-3`}>
        <XSvg />
        <CustomText style={tw`text-xs mt-1`}>X</CustomText>
      </Pressable>
      <Pressable style={tw`items-center mr-3`}>
        <GoogleSvg />
        <CustomText style={tw`text-xs mt-1`}>Google</CustomText>
      </Pressable>
      <Pressable style={tw`items-center`}>
        <StripeSvg />
        <CustomText style={tw`text-xs mt-1`}>Stripe</CustomText>
      </Pressable>
    </RowContainer>
  );
};

export default SociaMediaIcons;
