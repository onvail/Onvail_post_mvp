import React, {
  useRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useMemo,
} from 'react';
import BottomSheet, {BottomSheetFooterProps} from '@gorhom/bottom-sheet';
import tw from 'src/lib/tailwind';
import {Colors} from 'src/app/styles/colors';

interface Props {
  children: React.ReactNode;
  visibilityHandler: (isVisbile: boolean) => void;
  customSnapPoints?: number[] | string[];
  backgroundColor?: string;
  footerComponent?: React.FC<BottomSheetFooterProps | undefined>;
}

export type CustomBottomSheetRef = {
  open: () => void;
  close: () => void;
};

const CustomBottomSheetInner: ForwardRefRenderFunction<
  CustomBottomSheetRef,
  Props
> = (
  {
    children,
    visibilityHandler,
    backgroundColor,
    footerComponent,
    customSnapPoints = ['5%'],
  },
  ref,
) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => customSnapPoints, [customSnapPoints]);

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
      footerComponent={footerComponent}
      backgroundStyle={[
        tw``,
        {
          backgroundColor: backgroundColor ?? Colors.darkGreen,
        },
      ]}
      handleIndicatorStyle={tw`bg-white h-1.8 w-15`}>
      {children}
    </BottomSheet>
  );
};

const CustomBottomSheet = React.forwardRef(CustomBottomSheetInner);

export default CustomBottomSheet;
