import {RouteProp} from '@react-navigation/native';
import React, {FC, FunctionComponent} from 'react';
import {View} from 'react-native';
import {BottomTabParamList} from 'src/app/navigator/types/BottomTabParamList';
import tw from 'src/lib/tailwind';

import {SvgProps} from 'react-native-svg';
import {generalIcon} from './generalIcons';

interface Props {
  route: RouteProp<BottomTabParamList>;
  focused: boolean;
}

const TabBarIcon: FunctionComponent<Props> = ({route, focused}: Props) => {
  const HomeSvg = generalIcon.Home;
  const ProfileSvg = generalIcon.Profile;
  type IconMapType = {
    [key in keyof BottomTabParamList]: {
      true: FC<SvgProps>;
      false: FC<SvgProps>;
    };
  };

  const ICON_MAP: IconMapType = {
    Home: {
      true: HomeSvg,
      false: HomeSvg,
    },
    Profile: {
      true: ProfileSvg,
      false: ProfileSvg,
    },
  };

  const focusedKey = (isfocused: boolean) => (isfocused ? 'true' : 'false');

  const Icon = ICON_MAP[route.name][focusedKey(focused)];

  return (
    <View style={tw`items-center`}>
      <Icon />
    </View>
  );
};

export default TabBarIcon;
