import React, { useEffect } from "react";
import { StyleSheet, RefreshControl } from "react-native";
import Animated, {
     Easing,
     useAnimatedStyle,
     useSharedValue,
     withRepeat,
     withTiming,
     interpolate,
     Extrapolate,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomRefreshControl = ({ refreshing, pullDistance }) => {
     const rotateValue = useSharedValue(0);

     useEffect(() => {
          if (refreshing) {
               rotateValue.value = withRepeat(
                    withTiming(360, {
                         duration: 5000,
                         easing: Easing.linear,
                    }),
                    -1,
               );
          } else {
               rotateValue.value = withTiming(0, {
                    duration: 500,
                    easing: Easing.linear,
               });
          }
     }, [refreshing, rotateValue]);

     const animatedStyle = useAnimatedStyle(() => {
          const rotation = interpolate(pullDistance.value, [0, 50], [0, 360], Extrapolate.CLAMP);
          return {
               transform: [{ rotate: `${rotation}deg` }],
          };
     });

     return pullDistance.value > 0 ? (
          <Animated.View style={[styles.iconContainer, animatedStyle]}>
               <Icon name="refresh" size={30} color={"#ebebeb"} />
          </Animated.View>
     ) : null;
};

const styles = StyleSheet.create({
     iconContainer: {
          alignItems: "center",
          justifyContent: "center",
     },
});

export default CustomRefreshControl;
