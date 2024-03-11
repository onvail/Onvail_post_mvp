import React, {FunctionComponent} from 'react';
import {SafeAreaView} from 'react-native';
import tw from 'lib/tailwind';

interface Props {
  children: React.ReactNode;
}

const ScreenContainer: FunctionComponent<Props> = ({children}: Props) => {
  return <SafeAreaView style={tw`bg-primary flex-1`}>{children}</SafeAreaView>;
};

export default ScreenContainer;
