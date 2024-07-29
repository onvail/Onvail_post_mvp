import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { FunctionComponent } from "react";
import { View } from "react-native";
import ProceedBtn from "src/app/components/Buttons/ProceedBtn";
import LottieView from "lottie-react-native";
import ScreenContainer from "src/app/components/Screens/ScreenContainer";
import CustomText from "src/app/components/Text/CustomText";
import { MainStackParamList } from "src/app/navigator/types/MainStackParamList";
import tw from "src/lib/tailwind";
import successLottie from "src/assets/lotties/success.json";

type Props = NativeStackScreenProps<MainStackParamList, "PartySuccessScreen">;

const PartySuccessScreen: FunctionComponent<Props> = ({ navigation }) => {
     return (
          <ScreenContainer>
               <View style={tw`justify-center items-center flex-1`}>
                    <LottieView
                         source={successLottie}
                         autoPlay
                         loop={false}
                         style={tw`h-40 w-40 mb-10`}
                    />
                    <CustomText style={tw`mt-3 text-lg`}>
                         Showdown party successfully created
                    </CustomText>
                    <CustomText style={tw`text-grey2 w-[80%] text-xs mt-3 text-center`}>
                         Share party to get participants to register and join the party
                    </CustomText>
               </View>
               <View style={tw`mx-3 mb-18`}>
                    <ProceedBtn
                         title="Continue"
                         onPress={() =>
                              navigation.navigate("BottomNavigator", {
                                   screen: "Home",
                              })
                         }
                    />
               </View>
          </ScreenContainer>
     );
};

export default PartySuccessScreen;
