import React, {FC, FunctionComponent, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import CustomText from 'src/app/components/Text/CustomText';
import Modal from 'react-native-modal';
import {generalIcon} from 'components/Icons/generalIcons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList} from 'src/app/navigator/types/BottomTabParamList';
import tw from 'src/lib/tailwind';
import {SvgProps} from 'react-native-svg';
import {MainStackParamList} from 'src/app/navigator/types/MainStackParamList';

type NavigationProps = {
  navigation: NativeStackNavigationProp<BottomTabParamList, 'Home'>;
};

const OnvailSvg = generalIcon.FloatingIcon;
const BeatIconSvg = generalIcon.BeatIcon;
const EditIconSvg = generalIcon.EditIcon;

interface OnvailBtnProps {
  title: string;
  icon: FC<SvgProps>;
  route: keyof MainStackParamList;
}

const onvailBtnOptions: OnvailBtnProps[] = [
  {
    title: 'Create a post',
    icon: EditIconSvg,
    route: 'CreateNewPost',
  },
  {
    title: 'Plan a party',
    icon: BeatIconSvg,
    route: 'PartyOptions',
  },
];

const CustomOnvailButton: FunctionComponent<NavigationProps> = ({
  navigation,
}) => {
  const [showNavOptions, setShowNavOptions] = useState<boolean>(false);
  return (
    <View style={tw`relative  items-center `}>
      <Modal
        isVisible={showNavOptions}
        backdropOpacity={0.87}
        animationIn={'zoomIn'}
        animationOut={'zoomOut'}
        onBackdropPress={() => setShowNavOptions(false)}
        style={tw`absolute items-center justify-center left-20 right-20 bottom-20`}>
        <View style={tw`flex-1 self-center items-center justify-center`}>
          {onvailBtnOptions.map((item, _) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.title}
                onPress={() => {
                  navigation.navigate('MainAppNavigator', {
                    screen: item.route,
                  });
                  setShowNavOptions(false);
                }}
                style={tw`bg-white flex-row items-center rounded-full justify-between px-3   py-2 mb-3 w-50`}>
                <CustomText style={tw`text-primary text-base`}>
                  {item.title}
                </CustomText>
                <Icon height={21} width={21} />
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => setShowNavOptions(prev => !prev)}
        style={tw`justify-center items-center`}>
        <OnvailSvg height={60} width={60} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomOnvailButton;
