import React, {FunctionComponent} from 'react';
import {ImageBackground, StatusBar} from 'react-native';
import tw from 'src/lib/tailwind';

interface Props {
  children: React.ReactNode;
}

const AuthScreenContainer: FunctionComponent<Props> = ({children}) => {
  return (
    <ImageBackground
      source={require('../../../assets/passwordbg.png')}
      resizeMode="cover"
      style={tw`w-full h-full`}>
      <StatusBar barStyle={'light-content'} translucent={true} />
      {children}
    </ImageBackground>
  );
};

export default AuthScreenContainer;
