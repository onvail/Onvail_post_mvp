import React, { useEffect, useState } from "react";
import { View } from "react-native";
import tw from "src/lib/tailwind";
import { Audio } from "expo-av";

const SoundTracker: React.FC<{ isMuted: boolean; soundInstance: Audio.Sound }> = ({
     isMuted,
     soundInstance,
}) => {
     const [soundLevel, setSoundLevel] = useState(0);

     console.log({ soundLevel });
     useEffect(() => {
          const startTracking = async () => {
               try {
                    await soundInstance.setOnPlaybackStatusUpdate((status) => {
                         setSoundLevel(status.metering ?? 0);
                    });
               } catch (error) {
                    console.error("Failed to start tracking", error);
               }
          };

          if (!isMuted) {
               startTracking();
          } else {
               setSoundLevel(0);
          }
     }, [isMuted, soundInstance]);

     return !isMuted ? (
          <View
               style={[tw`absolute bottom-0 h-1 bg-green-500`, { width: `${soundLevel * 100}%` }]}
          />
     ) : null;
};

export default SoundTracker;
