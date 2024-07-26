import { createStackNavigator } from "@react-navigation/stack";
import React, { FunctionComponent } from "react";
import { MainStackParamList } from "./types/MainStackParamList";
import { mainNavigatorScreens } from "./types/mainscreens";

const Stack = createStackNavigator<MainStackParamList>();

const MainNavigator: FunctionComponent = () => {
     return (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
               {mainNavigatorScreens.map(({ name, screen, options }) => (
                    <Stack.Screen key={name} name={name} component={screen} options={options} />
               ))}
          </Stack.Navigator>
     );
};

export default MainNavigator;
