import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React, { FunctionComponent, memo, useEffect, useState } from "react";
import { View, ImageSourcePropType, Text, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import tw from "src/lib/tailwind";
import { sampleStatus } from "src/utils/data";
import CustomImage from "components/Image/CustomImage";
import { generalIcon } from "../Icons/generalIcons";
import Animated, {
     useAnimatedStyle,
     useSharedValue,
     withSpring,
     withTiming,
     Easing,
} from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";

type StatusItem = {
     name: string;
     imageUrl: string;
};

const StatusItemComponent: FunctionComponent<{
     item: StatusItem;
     index: number;
}> = memo(({ item, index }) => {
     const imageSource: ImageSourcePropType = { uri: item.imageUrl };
     const opacity = useSharedValue(0);
     const translateY = useSharedValue(50);
     const scaleItem = useSharedValue(1);
     const rotate = useSharedValue(0);
     const [isLoading, setLoading] = useState<boolean>(false);

     console.log("isLoading", isLoading);

     useEffect(() => {
          // Delay each item's animation based on its index
          const delay = index * index * index * 200;
          opacity.value = withTiming(1, { duration: 400, delay } as SpringConfig);
          translateY.value = withSpring(0, { delay } as SpringConfig);
     }, [index, opacity, translateY]);

     const animatedItemStyle = useAnimatedStyle(() => {
          return {
               transform: [{ scale: scaleItem.value }, { translateY: translateY.value }],
          };
     });
     const animatedLoadingStyle = useAnimatedStyle(() => {
          return {
               transform: [{ translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
          };
     });

     const handleItemPress = () => {
          opacity.value = withTiming(0.5, { duration: 400 });
          rotate.value = withTiming(360, { duration: 2000, easing: Easing.linear });
          scaleItem.value = withSpring(1.1, {}, () => {
               scaleItem.value = withSpring(1);
          });
          setLoading(true);
          setTimeout(() => {
               rotate.value = 0;
               opacity.value = 1;
               setLoading(false);
          }, 1050); // Reset rotation after 1 second
     };

     return (
          <Animated.View style={[tw`items-center mr-2`, animatedItemStyle, { zIndex: 100 }]}>
               <TouchableOpacity
                    onPress={handleItemPress}
                    activeOpacity={0.9}
                    style={[tw`items-center`, { zIndex: 100 }]}
               >
                    <View
                         style={tw`rounded-[${
                              isLoading ? "50px" : "17px"
                         }] border-2 border-[#8E8E8E]`}
                    >
                         <CustomImage
                              resizeMode="cover"
                              uri={imageSource.uri!}
                              style={tw`rounded-[${
                                   isLoading ? "50px" : "15px"
                              }] h-[63px] w-[63px] border-2 border-[#8E8E8E]`}
                         />
                    </View>
                    {!isLoading && (
                         <Text style={tw`text-white mt-2 font-poppinsMedium text-[8px]`}>
                              {item.name}
                         </Text>
                    )}
                    {isLoading && (
                         <Animated.View
                              style={[
                                   tw`rounded-[50px] absolute top-0 left-0 right-0 bottom-0 items-center justify-center border-dotted border-4 border-[#fff]`,
                                   animatedLoadingStyle,
                              ]}
                         >
                              {/* <Text style={tw`text-white`}>Loading...</Text> */}
                         </Animated.View>
                    )}
               </TouchableOpacity>
          </Animated.View>
     );
});

const Status: FunctionComponent = () => {
     const AddIcon = generalIcon.AddIcon;
     const scale = useSharedValue(1);
     const [loading, setLoading] = useState(true);

     const animatedStyle = useAnimatedStyle(() => {
          return {
               transform: [{ scale: scale.value }],
          };
     });

     const handlePressIn = () => {
          scale.value = withSpring(1.2);
     };

     const handlePressOut = () => {
          scale.value = withSpring(1);
     };

     useEffect(() => {
          handlePressIn();

          setTimeout(() => {
               handlePressOut();
          }, 500);

          setTimeout(() => {
               scale.value = withSpring(1.24);
          }, 1000);

          // Simulate API call
          setTimeout(() => {
               handlePressOut();
               setLoading(false);
          }, 2000);
     }, []);

     const renderItem: ListRenderItem<StatusItem> = ({ item, index }) => (
          <StatusItemComponent item={item} index={index} />
     );

     return (
          <View style={tw`flex-row items-center gap-2`}>
               <Animated.View style={[tw`items-center`, animatedStyle]}>
                    <TouchableOpacity
                         activeOpacity={0.9}
                         onPressIn={handlePressIn}
                         onPressOut={handlePressOut}
                         style={tw`items-center`}
                    >
                         <View
                              style={tw`items-center justify-center rounded-[17px] border-2 border-dotted border-grey5`}
                         >
                              <View
                                   style={tw`items-center justify-center rounded-[17px] bg-[#7C1AFC] h-[65px] w-[65px] border-2`}
                              >
                                   <AddIcon />
                              </View>
                         </View>
                         <Text
                              style={tw`text-white mt-2 text-center font-poppinsMedium text-[9px]`}
                         >
                              Your Story
                         </Text>
                    </TouchableOpacity>
               </Animated.View>
               <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={tw`flex-row gap-2 py-2`}
                    contentOffset={{ y: 0, x: 0 }}
               >
                    <FlashList
                         data={sampleStatus}
                         renderItem={renderItem}
                         estimatedItemSize={100}
                         horizontal
                         keyExtractor={(item) => item.name}
                         showsHorizontalScrollIndicator={false}
                         style={{ backgroundColor: "transparent" }}
                    />
               </ScrollView>
          </View>
     );
};

export default Status;
