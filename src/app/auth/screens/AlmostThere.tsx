import React, {FunctionComponent} from 'react';
import {TouchableOpacity, View} from 'react-native';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const AlmostThere: FunctionComponent<Props> = ({navigation}) => {
  return (
    <AuthScreenContainer>
      <View style={tw`mt-12 px-3`}>
        <RowContainer style={tw`mb-4 mt-3 items-center`}>
          <Icon
            onPress={() => navigation.goBack()}
            icon={'chevron-left'}
            color="white"
            size={30}
          />
          <CustomText style={tw`text-lg ml-24`}>Create account</CustomText>
        </RowContainer>
        <View style={tw`w-full h-[85%] items-center justify-center`}>
          <CustomText
            style={tw`text-2xl font-bold text-white w-[75%] text-center mx-auto`}>
            Almost there! Just a few beats away from the fun!
          </CustomText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('LocationInput')}
            style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-5 py-4.5`}>
            <CustomText style={tw`text-white text-center font-bold text-lg`}>
              Next
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </AuthScreenContainer>
  );
};

export default AlmostThere;
