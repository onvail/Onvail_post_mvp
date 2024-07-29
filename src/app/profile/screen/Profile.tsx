import { FlashList } from "@shopify/flash-list";
import React, { FunctionComponent, useCallback } from "react";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import SociaMediaIcons from "src/app/components/Buttons/SociaMediaIcons";
import CustomImage from "src/app/components/Image/CustomImage";
import CustomText from "src/app/components/Text/CustomText";
import RowContainer from "src/app/components/View/RowContainer";
import tw from "src/lib/tailwind";

const Profile: FunctionComponent = () => {
     const isMember = false;
     const text =
          "Sleeping with the fishes made the meats run dry in her episconic sagacious vibe. Listen and be blessed Sleeping with the fishes madethe meats run dry in her episconic sagacious vibe. Listen and beblessed Sleeping with the fishes made the meats run dry in herepisconic sagacious vibe. Listen and be blessed Sleeping with thefishes made the meats run dry in her episconic sagacious vibe. Listenand be blessed Sleeping with the fishes made the meats run dry in herepisconic sagacious vibe. Listen and be blessed Sleeping with thefishes made the meats run dry in her episconic sagacious vibe. Listenand be blessed";

     const handleCharacterLength = useCallback((string: string) => {
          if (string.length > 120) {
               return `${string.slice(0, 450).trim()}...`;
          } else {
               return string;
          }
     }, []);

     const previousListeningParties = [
          "https://greenday.fm/wp-content/uploads/2024/01/saviorslisteningparty.jpg",
          "https://www.sxsw.com/wp-content/uploads/2018/09/SXSW-Songs-2018-Photo-by-Chloe-Bertrand-640x360.png",
     ];

     return (
          <View style={tw`bg-primary flex-1`}>
               <View style={tw`relative`}>
                    <View style={tw`h-90 w-100`}>
                         <CustomImage
                              style={tw`h-[100%] w-[100%]`}
                              resizeMode="cover"
                              uri={
                                   "https://www.billboard.com/wp-content/uploads/2024/03/a-Ariana-Grande-cr-Katia-Temkin-02-press-2024-billboard-1548.jpg?w=942&h=623&crop=1"
                              }
                         />
                    </View>
                    <RowContainer style={tw`mt-4 mx-4 justify-between`}>
                         <View style={tw``}>
                              <CustomText style={tw`font-poppinsBold text-lg`}>1.57M</CustomText>
                              <CustomText style={tw`text-purple font-poppinsBold`}>
                                   community members
                              </CustomText>
                         </View>
                         <View style={tw`absolute bottom-20 right-0`}>
                              <TouchableOpacity style={tw`bg-white px-3  py-2 mr-2 rounded-full`}>
                                   <CustomText style={tw`text-primary`}>
                                        {isMember ? "Join community" : "Leave community"}
                                   </CustomText>
                              </TouchableOpacity>
                         </View>
                    </RowContainer>
               </View>
               <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1 mx-4 mt-3`}>
                    <CustomText style={tw`font-poppinsBold text-lg `}>About</CustomText>
                    <CustomText style={tw`text-justify`} numberOfLines={20}>
                         {handleCharacterLength(text)}
                    </CustomText>
                    {text.length > 120 && (
                         <TouchableOpacity>
                              <CustomText style={tw`font-poppinsMedium text-grey2`}>
                                   Read more
                              </CustomText>
                         </TouchableOpacity>
                    )}
                    <View style={tw`mt-3`}>
                         <CustomText style={tw`font-poppinsBold`}>
                              Previous Listening parties
                         </CustomText>
                         <FlashList
                              data={previousListeningParties}
                              estimatedItemSize={10}
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              renderItem={(item) => {
                                   return (
                                        <Pressable style={tw`h-40 mt-4 mr-5 w-70`}>
                                             <CustomImage
                                                  uri={item.item}
                                                  resizeMode="cover"
                                                  style={tw`h-[100%] w-[100%] rounded-lg`}
                                             />
                                        </Pressable>
                                   );
                              }}
                         />
                         <View>
                              <CustomText style={tw`mt-4`}>
                                   Listen to more of Sabrina’s music on stores
                              </CustomText>
                         </View>
                         <SociaMediaIcons />
                    </View>
                    <View style={tw`h-25`} />
               </ScrollView>
          </View>
     );
};

export default Profile;
