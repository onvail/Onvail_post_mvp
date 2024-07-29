import React, {
     useRef,
     useImperativeHandle,
     ForwardRefRenderFunction,
     useMemo,
     useEffect,
} from "react";
import BottomSheet, { BottomSheetFooterProps } from "@gorhom/bottom-sheet";
import tw from "src/lib/tailwind";
import { Colors } from "src/app/styles/colors";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Pressable, Text } from "react-native";

interface Props {
     children: React.ReactNode;
     visibilityHandler: (isVisbile: boolean) => void;
     customSnapPoints?: number[] | string[];
     backgroundColor?: string;
     onChange: (index: any) => void;
     footerComponent?: React.FC<BottomSheetFooterProps | undefined>;
     ref?: React.RefObject<BottomSheetMethods>;
     snapIndex?: number | null;
     setSnapIndex?: (state: any) => void;
}

export type CustomBottomSheetRef = {
     open: () => void;
     close: () => void;
};

const CustomBottomSheetInner: ForwardRefRenderFunction<CustomBottomSheetRef, Props> = (
     {
          children,
          onChange,
          visibilityHandler,
          backgroundColor,
          footerComponent,
          customSnapPoints = ["5%"],
          snapIndex,
          setSnapIndex,
     },
     ref,
) =>
     // ref,
     {
          const bottomSheetRef = useRef<BottomSheet>(null);
          const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

          useEffect(() => {
               if (typeof snapIndex === "number") {
                    bottomSheetRef?.current?.snapToIndex(snapIndex);
               }
               return () => setSnapIndex?.(null);
          }, [snapIndex, setSnapIndex]);

          const handleClosePress = () => {
               visibilityHandler(false);
               bottomSheetRef.current?.close();
          };
          const handleOpenPress = () => {
               visibilityHandler(true);
               bottomSheetRef.current?.close();
          };

          useImperativeHandle(ref, () => ({
               open: handleOpenPress,
               close: handleClosePress,
          }));

          return (
               <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    onChange={onChange}
                    topInset={80}
                    keyboardBehavior={"extend"}
                    footerComponent={footerComponent}
                    enableOverDrag
                    enableHandlePanningGesture
                    backgroundStyle={[
                         tw``,
                         {
                              backgroundColor: backgroundColor ?? Colors.darkGreen,
                         },
                    ]}
                    handleIndicatorStyle={tw`bg-white h-1.8 w-15`}
               >
                    {children}
               </BottomSheet>
          );
     };

const CustomBottomSheet = React.forwardRef(CustomBottomSheetInner);

export default CustomBottomSheet;
