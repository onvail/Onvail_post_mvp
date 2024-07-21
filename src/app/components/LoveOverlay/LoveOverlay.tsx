import React from "react";
import Icon from "../Icons/Icon";
import Animated, {
     Easing,
     runOnJS,
     useAnimatedStyle,
     useSharedValue,
     withTiming,
} from "react-native-reanimated";
import tw from "src/lib/tailwind";

interface LoveOverlayProps {
     visible: boolean;
     onAnimationEnd: () => void;
}

const LoveOverlay: React.FC<LoveOverlayProps> = ({ visible, onAnimationEnd }) => {
     const opacity = useSharedValue(0);

     React.useEffect(() => {
          if (visible) {
               opacity.value = withTiming(1, { duration: 300, easing: Easing.ease }, (finished) => {
                    if (finished) {
                         opacity.value = withTiming(
                              0,
                              { duration: 300, easing: Easing.ease },
                              () => {
                                   runOnJS(onAnimationEnd)();
                              },
                         );
                    }
               });
          }
     }, [visible]);

     const animatedStyle = useAnimatedStyle(() => ({
          opacity: opacity.value,
     }));

     return (
          <Animated.View
               style={[
                    tw`absolute top-0 left-0 right-0 bottom-0 justify-center items-center`,
                    animatedStyle,
                    { zIndex: 10 },
               ]}
          >
               <Icon icon="heart" color="red" size={100} />
          </Animated.View>
     );
};

export default LoveOverlay;
