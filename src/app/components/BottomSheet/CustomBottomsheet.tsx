import React, {
  useRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
  useMemo,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import tw from 'src/lib/tailwind';

interface Props {
  children: React.ReactNode;
  visibilityHandler: (isVisbile: boolean) => void;
  customSnapPoints?: number[];
  initialSnapIndex?: number;
  id: string;
  heading?: string;
}

export type CustomBottomSheetRef = {
  open: () => void;
  close: () => void;
};

const CustomBottomSheetInner: ForwardRefRenderFunction<
  CustomBottomSheetRef,
  Props
> = ({children, visibilityHandler, customSnapPoints = ['5%']}, ref) => {
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
      backgroundStyle={tw`bg-black`}
      handleIndicatorStyle={tw`bg-white w-15`}
      containerStyle={tw`mt-4 rounded-t-xl`}>
      {children}
    </BottomSheet>
  );
};

const CustomBottomSheet = React.forwardRef(CustomBottomSheetInner);

export default CustomBottomSheet;