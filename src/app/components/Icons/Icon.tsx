import React, {FC, ComponentType} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

export type IconProviders =
  | 'MaterialCommunity'
  | 'AntDesign'
  | 'Octicons'
  | 'MaterialIcon'
  | 'FontAwesome';

interface Props {
  iconProvider?: IconProviders;
  icon: string | IconDefinition;
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
  FontAwesome: FontAwesomeIcon,
};

const Icon: FC<Props> = ({
  iconProvider = 'MaterialCommunity',
  icon,
  color,
  onPress,
  size = 20,
  style,
}) => {
  const IconComponent = ICON_MAP[iconProvider];
  return (
    <>
      {iconProvider === 'FontAwesome' ? (
        <IconComponent
          icon={icon}
          color={color}
          size={size}
          onPress={onPress}
          style={style}
        />
      ) : (
        <IconComponent
          name={icon}
          color={color}
          size={size}
          onPress={onPress}
          style={style}
        />
      )}
    </>
  );
};

export default Icon;
