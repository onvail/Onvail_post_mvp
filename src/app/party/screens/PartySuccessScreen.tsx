import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import ProceedBtn from 'src/app/components/Buttons/ProceedBtn';
import Icon from 'src/app/components/Icons/Icon';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import CustomText from 'src/app/components/Text/CustomText';
import {MainStackParamList} from 'src/app/navigator/types/MainStackParamList';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';

type Props = NativeStackScreenProps<MainStackParamList, 'PartySuccessScreen'>;
const PartySuccessScreen: FunctionComponent<Props> = ({navigation}) => {
  const UploadIcon = generalIcon.UploadIcon;
  return (
    <ScreenContainer>
      <View style={tw`justify-center items-center flex-1`}>
        <View>
          <Icon
            icon={'check-circle'}
            iconProvider={'MaterialIcon'}
            color={Colors.purple}
            size={90}
          />
          <View
            style={tw`bg-white items-center left-4 top-4 rounded-full h-16 w-16 absolute -z-10`}
          />
        </View>
        <UploadIcon style={tw`mt-5`} />
        <CustomText style={tw`mt-3 text-lg`}>
          Showdown party successfully created
        </CustomText>
        <CustomText style={tw`text-grey2 w-[80%] text-xs mt-3 text-center`}>
          Share party to get participants to register and join the party
        </CustomText>
      </View>
      <View style={tw`mx-3 mb-18`}>
        <ProceedBtn
          title="continue"
          onPress={() =>
            navigation.navigate('BottomNavigator', {
              screen: 'Home',
            })
          }
        />
      </View>
    </ScreenContainer>
  );
};

export default PartySuccessScreen;
