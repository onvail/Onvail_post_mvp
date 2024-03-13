import React, {FunctionComponent} from 'react';
import {View, ViewStyle} from 'react-native';
import tw from 'lib/tailwind';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

const RowContainer: FunctionComponent<Props> = ({children, style}) => {
  const rowContainerStyle = tw`flex-row items-center`;
  return <View style={[rowContainerStyle, style]}>{children}</View>;
};

export default RowContainer;
