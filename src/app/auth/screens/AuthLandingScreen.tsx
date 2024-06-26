import React, {FunctionComponent} from 'react';
import {View, ViewStyle} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import tw from 'lib/tailwind';
import RoundedBtn from 'app/components/Buttons/RoundedBtn';
import CustomText from 'app/components/Text/CustomText';
import RowContainer from 'app/components/View/RowContainer';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import ScreenContainer from 'app/components/Screens/ScreenContainer';

interface DividerProps {
  width: string;
}

const DotDivider = ({width}: DividerProps) => {
  const style: ViewStyle = tw`bg-white h-0.5 w-${width} mr-1 rounded-md`;
  return <View style={style} />;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'AuthLandingScreen'>;

const AuthLandingScreen: FunctionComponent<Props> = ({navigation}) => {
  return (
    <ScreenContainer>
      <View style={tw`flex-1 justify-center px-4 items-center`}>
        <CustomText style={tw`font-poppinsBold text-2xl w-1/2`}>
          Blast into the music scenes
        </CustomText>
        <View style={tw`mx-6 mt-8`}>
          <CustomText style={tw`text-center`}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin dui
            enim, imperdiet non dictum vitae, aliquam quis dui. Morbi velit
            turpis, dapibus mattis malesuada et, rhoncus vitae eros.
          </CustomText>
        </View>
        <RowContainer style={tw`mt-6`}>
          <DotDivider width="5" />
          <DotDivider width="4" />
          <DotDivider width="3" />
          <DotDivider width="2" />
        </RowContainer>
        <RowContainer style={tw`mt-8 justify-between w-3/4`}>
          <RoundedBtn
            title="Login"
            onPress={() => navigation.navigate('Login')}
            borderColor="white"
          />
          <RoundedBtn
            title="Signup"
            onPress={() => navigation.navigate('EmailInput')}
            borderColor="purple"
          />
        </RowContainer>
      </View>
    </ScreenContainer>
  );
};

export default AuthLandingScreen;
