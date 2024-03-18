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
      true: FC<SvgProps> | null;
      false: FC<SvgProps> | null;
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
    MainAppNavigator: {
      true: null,
      false: null,
    },
  };

  const focusedKey = (isFocused: boolean) => (isFocused ? 'true' : 'false');

  const Icon = ICON_MAP[route.name][focusedKey(focused)];

  const focusedIconOpacity = focused ? 'opacity-100' : 'opacity-40';

  return (
    <>
      {Icon ? (
        <View style={tw`items-center`}>
          <View style={tw`${focusedIconOpacity}`}>
            <Icon />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default TabBarIcon;
