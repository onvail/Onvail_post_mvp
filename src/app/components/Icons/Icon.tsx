import React, {FC, ComponentType} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

export type IconProviders =
  | 'MaterialCommunity'
  | 'AntDesign'
  | 'Octicons'
  | 'MaterialIcon';

interface Props {
  iconProvider?: IconProviders;
  name: string;
  color: string;
  size?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ICON_MAP: Record<IconProviders, ComponentType<any>> = {
  AntDesign: AntDesignIcon,
  MaterialCommunity: MaterialCommunityIcon,
  Octicons: Octicons,
  MaterialIcon: MaterialIcons,
};

const Icon: FC<Props> = ({
  iconProvider = 'MaterialCommunity',
  name,
  color,
  onPress,
  size = 20,
  style,
}) => {
  const IconComponent = ICON_MAP[iconProvider];
  return (
    <IconComponent
      name={name}
      color={color}
      size={size}
      onPress={onPress}
      style={style}
    />
  );
};

export default Icon;
