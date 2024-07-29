import React, { FunctionComponent, useCallback, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Controller, useForm } from "react-hook-form";
import ViewShot, { captureRef } from "react-native-view-shot";
import DatePicker from "react-native-date-picker";
import { DocumentPickerResponse } from "react-native-document-picker";
import {
     heightPercentageToDP as hp,
     widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

import ScreenContainer from "src/app/components/Screens/ScreenContainer";
import CustomText from "src/app/components/Text/CustomText";
import CustomTextInput from "src/app/components/TextInput/CustomTextInput";
import RowContainer from "src/app/components/View/RowContainer";
import FormSelector from "../components/FormSelector";
import SwitchSelector from "../components/SwitchSelector";
import CustomCalendar from "src/app/components/Calendar/CustomCalendar";
import CustomImage from "src/app/components/Image/CustomImage";
import ErrorText from "src/app/components/Text/ErrorText";
import VotingPoll from "../components/VotingPoll";
import DefaultImages from "../components/DefaultImages";
import ProceedBtn from "src/app/components/Buttons/ProceedBtn";
import { toast, Toasts, ToastPosition } from "@backpackapp-io/react-native-toast";
import { createFireStoreParties } from "src/actions/parties";
import { S3ImageUpload, S3FileUpload } from "src/utils/aws";
import { truncateText } from "src/utils/utilities";
import tw from "src/lib/tailwind";
import api from "src/api/api";
import useImageService, { ImageFromDevice } from "src/app/hooks/useImageService";
import useDocumentPicker from "src/app/hooks/useDocumentPicker";
import useUser from "src/app/hooks/useUserInfo";
import { MainStackParamList } from "src/app/navigator/types/MainStackParamList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Party, PartyError } from "src/types/partyTypes";

type Props = NativeStackScreenProps<MainStackParamList, "PlanYourParty">;
type ImageColors = "purple" | "orange";

const defaultImageColors: ImageColors[] = ["purple", "orange"];

const PlanYourParty: FunctionComponent<Props> = ({ navigation, route }) => {
     const { partyType } = route.params;
     const { user } = useUser();
     const ref = useRef<any>();

     const [isCalendarVisible, setIsCalendarVisible] = useState(false);
     const [selectedColor, setSelectedColor] = useState<ImageColors>("purple");
     const [isApplicationClosingDatePickerVisible, setIsApplicationClosingDatePickerVisible] =
          useState(false);
     const [selectedImageOption, setSelectedImageOption] = useState<
          "uploadedImage" | "default-purple" | "default-orange"
     >("default-purple");
     const [selectedImage, setSelectedImage] = useState<ImageFromDevice | null>(null);
     const [musicFiles, setMusicFiles] = useState<DocumentPickerResponse[]>([]);
     const [isCreatingParty, setIsCreatingParty] = useState(false);
     const [partyDate, setPartyDate] = useState(new Date());

     const { tryPickImageFromDevice } = useImageService();
     const { selectDocument } = useDocumentPicker();

     const defaultValues: Party = {
          partyName: "",
          partyDesc: "",
          songs: [],
          albumPicture: "",
          date: new Date().toISOString(),
          visibility: "public",
          guests: ["example@gmail.com"],
          pollOptions: [],
          pollQuestion: "",
          partyApplicationClosingDate: new Date().toLocaleDateString(),
     };

     const {
          control,
          handleSubmit,
          formState: { errors },
          setValue,
     } = useForm({
          defaultValues,
          mode: "all",
     });

     const onSubmit = async (data: Party) => {
          // setIsCreatingParty(true);
          // try {
          //      const [imageUri, musicUrl] = await Promise.all([getImageUrl(), getMusicUrl()]);
          //      const formData = {
          //           partyType,
          //           ...data,
          //           songs: musicUrl,
          //           albumPicture: imageUri,
          //      };

          //      if (partyType === "cozy_jam_session") {
          //           delete formData.guests;
          //           delete formData.pollQuestion;
          //           delete formData.partyApplicationClosingDate;
          //      }

          //      const response = await api.post({
          //           url: "/parties/create-party",
          //           data: formData,
          //           requiresToken: true,
          //           authorization: true,
          //      });

          //      const firestoreData = {
          //           partyId: response?.data?.party?._id,
          //           artist: response?.data?.party?.artist,
          //           partyName: response?.data?.party?.artist,
          //           partyType: response?.data?.party?.partyType,
          //      };

          //      await createFireStoreParties(firestoreData);

          //      toast("Party created! 🎉 🎊", {
          //           duration: 4000,
          //           position: ToastPosition.TOP,
          //           styles: {
          //                view: tw``,
          //                pressable: tw`-top-20 justify-center items-center bg-purple4`,
          //                text: tw`text-white font-poppinsBold`,
          //           },
          //      });

          //      navigation.navigate("PartySuccessScreen");
          // } catch (error) {
          //      console.log((error as PartyError).response?.data);
          //      toast("Oops! Party didn't create🚨", {
          //           duration: 4000,
          //           position: ToastPosition.TOP,
          //           styles: {
          //                view: tw``,
          //                pressable: tw`-top-20 justify-center items-center bg-orange`,
          //                text: tw`text-white font-poppinsBold`,
          //           },
          //      });
          // } finally {
          //      setIsCreatingParty(false);
          // }
          navigation.navigate("PartySuccessScreen");
     };

     const handleSelectPhoto = async (action: "openCamera" | "openPicker") => {
          const data = await tryPickImageFromDevice({
               cropImage: true,
               includeBase64: true,
               action,
          });
          return data;
     };

     const handleSelectMusicFile = async () => {
          const data = await selectDocument();
          return data;
     };

     const captureDefaultImage = async () => {
          const response = await captureRef(ref, {
               format: "jpg",
               quality: 0.8,
          });
          return response;
     };

     const getImageUrl = async () => {
          try {
               let fileUri: string;
               if (selectedImageOption === "uploadedImage") {
                    fileUri = selectedImage?.file.uri!;
                    setValue("albumPicture", fileUri);
               } else {
                    fileUri = await captureDefaultImage();
                    setValue("albumPicture", fileUri);
               }
               const response = await S3ImageUpload(fileUri);
               return response?.Location;
          } catch (error) {
               console.log("error", error);
          }
     };

     const getMusicUrl = async () => {
          try {
               const response = await S3FileUpload(musicFiles);
               return response.map((item) => ({
                    name: item?.fileName,
                    file_url: item?.Location,
               }));
          } catch (error) {
               console.log("error", error);
          }
     };

     const onCapture = useCallback((uri: string) => {
          console.log("do something with ", uri);
     }, []);

     const animationValue = useSharedValue(1);
     const animatedStyle = useAnimatedStyle(() => {
          return {
               transform: [{ scale: withSpring(animationValue.value) }],
          };
     });

     return (
          <ScreenContainer screenHeader="Plan your party" goBack>
               <KeyboardAwareScrollView style={tw``}>
                    <View style={tw`mx-4 flex-1 mt-4 mb-10`}>
                         <Animated.View style={[tw`mb-4`, animatedStyle]}>
                              <RowContainer style={tw`mb-2 justify-between`}>
                                   <CustomText>Title</CustomText>
                                   <ErrorText>{errors?.partyName?.message}</ErrorText>
                              </RowContainer>
                              <Controller
                                   control={control}
                                   rules={{ required: "Title is required" }}
                                   render={({ field: { onChange, onBlur, value } }) => (
                                        <CustomTextInput
                                             placeholder="I am on Onvail"
                                             backgroundColor="transparent"
                                             borderColor="#717171"
                                             borderWidth="1"
                                             onChangeText={onChange}
                                             onBlur={onBlur}
                                             value={value}
                                             style={tw`text-white w-full font-poppinsRegular`}
                                        />
                                   )}
                                   name="partyName"
                              />
                         </Animated.View>
                         <Animated.View style={[tw`mb-4`, animatedStyle]}>
                              <RowContainer style={tw`mb-2 justify-between`}>
                                   <CustomText>About your party</CustomText>
                                   <ErrorText>{errors?.partyDesc?.message}</ErrorText>
                              </RowContainer>
                              <Controller
                                   control={control}
                                   rules={{ required: "Description is required" }}
                                   render={({ field: { onChange, onBlur, value } }) => (
                                        <CustomTextInput
                                             placeholder="Describe your party"
                                             backgroundColor="transparent"
                                             borderColor="#717171"
                                             borderWidth="1"
                                             height={120}
                                             onChangeText={onChange}
                                             onBlur={onBlur}
                                             value={value}
                                             multiline={true}
                                             textAlignVertical="top"
                                             style={tw`h-11/12 w-full font-poppinsRegular text-white`}
                                        />
                                   )}
                                   name="partyDesc"
                              />
                         </Animated.View>
                         <Animated.View style={[tw`mb-4`, animatedStyle]}>
                              <ErrorText>{errors?.albumPicture?.message}</ErrorText>
                              <Controller
                                   control={control}
                                   rules={{ required: "Album picture is required" }}
                                   render={({ field: { onChange } }) => (
                                        <View>
                                             <Pressable
                                                  style={tw`items-center justify-center rounded-md`}
                                             >
                                                  {selectedImageOption === "uploadedImage" &&
                                                       selectedImage && (
                                                            <CustomImage
                                                                 resizeMode="cover"
                                                                 uri={selectedImage?.file.uri!}
                                                                 style={tw`h-70 w-full rounded-md`}
                                                            />
                                                       )}
                                                  {(selectedImageOption === "default-orange" ||
                                                       selectedImageOption ===
                                                            "default-purple") && (
                                                       <ViewShot
                                                            style={{
                                                                 height: hp("40%"),
                                                                 width: wp("90%"),
                                                            }}
                                                            onCapture={onCapture}
                                                            ref={ref}
                                                            options={{
                                                                 format: "jpg",
                                                                 quality: 1.0,
                                                            }}
                                                       >
                                                            <View style={tw`h-[100%] w-[100%]`}>
                                                                 <DefaultImages
                                                                      color={selectedColor}
                                                                      artist={user.name}
                                                                      imageUrl={user?.image}
                                                                 />
                                                            </View>
                                                       </ViewShot>
                                                  )}
                                             </Pressable>
                                             <RowContainer style={tw`mt-2 justify-between`}>
                                                  <RowContainer>
                                                       <Pressable
                                                            onPress={async () => {
                                                                 try {
                                                                      const image =
                                                                           await handleSelectPhoto(
                                                                                "openPicker",
                                                                           );
                                                                      setSelectedImage(image);
                                                                      setSelectedImageOption(
                                                                           "uploadedImage",
                                                                      );
                                                                      onChange(image?.file.uri!);
                                                                 } catch (error) {}
                                                            }}
                                                       >
                                                            <CustomText style={tw``}>
                                                                 Upload image
                                                            </CustomText>
                                                       </Pressable>
                                                       {selectedImage && (
                                                            <Pressable
                                                                 onPress={() =>
                                                                      setSelectedImageOption(
                                                                           "uploadedImage",
                                                                      )
                                                                 }
                                                            >
                                                                 <CustomImage
                                                                      resizeMode="cover"
                                                                      uri={
                                                                           selectedImage?.file?.uri!
                                                                      }
                                                                      style={tw`h-6 w-6 rounded-full ml-2 ${
                                                                           selectedImageOption ===
                                                                           "uploadedImage"
                                                                                ? "border border-white"
                                                                                : ""
                                                                      }`}
                                                                 />
                                                            </Pressable>
                                                       )}
                                                  </RowContainer>
                                                  <RowContainer>
                                                       {defaultImageColors.map((item) => (
                                                            <Pressable
                                                                 key={item}
                                                                 onPress={() => {
                                                                      setSelectedColor(item);
                                                                      setSelectedImageOption(
                                                                           item === "orange"
                                                                                ? "default-orange"
                                                                                : "default-purple",
                                                                      );
                                                                      onChange(
                                                                           item === "orange"
                                                                                ? "default-orange"
                                                                                : "default-purple",
                                                                      );
                                                                 }}
                                                                 style={tw`h-5 ${
                                                                      selectedImageOption.includes(
                                                                           item,
                                                                      )
                                                                           ? "border border-white"
                                                                           : ""
                                                                 } w-5 ml-2 rounded-full bg-${item}`}
                                                            />
                                                       ))}
                                                  </RowContainer>
                                             </RowContainer>
                                        </View>
                                   )}
                                   name="albumPicture"
                              />
                         </Animated.View>
                         <Animated.View style={[tw`mb-4`, animatedStyle]}>
                              <ErrorText>{errors?.songs?.message}</ErrorText>
                              <Controller
                                   control={control}
                                   rules={{ required: "Select a song" }}
                                   render={({ field: { onChange } }) => (
                                        <>
                                             <FormSelector
                                                  description="Add music file"
                                                  instruction="(max 500mb)"
                                                  icon="library-music"
                                                  onPress={async () => {
                                                       const data = await handleSelectMusicFile();
                                                       setMusicFiles(
                                                            data as DocumentPickerResponse[],
                                                       );
                                                       onChange(data);
                                                  }}
                                             />
                                             {musicFiles?.map((item, _) => (
                                                  <CustomText
                                                       key={item.name}
                                                       style={tw`text-sm mt-1 text-purple`}
                                                  >
                                                       {item.name ? truncateText(item?.name) : ""}
                                                  </CustomText>
                                             ))}
                                        </>
                                   )}
                                   name="songs"
                              />
                         </Animated.View>
                         <Animated.View style={[tw`mb-4`, animatedStyle]}>
                              <ErrorText>{errors?.date?.message}</ErrorText>
                              <Controller
                                   control={control}
                                   rules={{ required: "Date is required" }}
                                   render={({ field: { value } }) => (
                                        <FormSelector
                                             description="Fix a date"
                                             instruction="Today"
                                             icon="calendar-month"
                                             onPress={() => {
                                                  setIsCalendarVisible(true);
                                             }}
                                             value={new Date(value).toLocaleString()}
                                        />
                                   )}
                                   name="date"
                              />
                         </Animated.View>

                         <VotingPoll
                              handlePollOptions={(data) => setValue("pollOptions", data)}
                              handlePollQuestions={(data) => setValue("pollQuestion", data)}
                              partyType={partyType}
                         />

                         <Animated.View style={[tw`mt-4`, animatedStyle]}>
                              <Controller
                                   control={control}
                                   rules={{}}
                                   render={({ field: { onChange } }) => (
                                        <SwitchSelector
                                             description="Public"
                                             optional
                                             onValueChange={(state) =>
                                                  onChange(state ? "public" : "private")
                                             }
                                        />
                                   )}
                                   name="visibility"
                              />
                         </Animated.View>
                         {partyType === "artist_show_down" && (
                              <Animated.View style={[tw`mb-4`, animatedStyle]}>
                                   <ErrorText>
                                        {errors?.partyApplicationClosingDate?.message}
                                   </ErrorText>
                                   <Controller
                                        control={control}
                                        rules={{ required: "Application closing date required" }}
                                        render={({ field: { value } }) => (
                                             <FormSelector
                                                  description="Application closes by (Date)"
                                                  instruction="Today"
                                                  icon="calendar-month"
                                                  onPress={() => {
                                                       setIsApplicationClosingDatePickerVisible(
                                                            true,
                                                       );
                                                  }}
                                                  value={value}
                                             />
                                        )}
                                        name="partyApplicationClosingDate"
                                   />
                              </Animated.View>
                         )}
                         <Animated.View style={[tw`mt-8`, animatedStyle]}>
                              <ProceedBtn
                                   onPress={handleSubmit(onSubmit)}
                                   title="Save"
                                   isLoading={isCreatingParty}
                                   containerStyle={tw`bg-purple h-13 items-center justify-center rounded-full`}
                              />
                         </Animated.View>
                         <Controller
                              control={control}
                              rules={{ required: "Date is required" }}
                              render={({ field: { onChange } }) => (
                                   <DatePicker
                                        modal
                                        theme="dark"
                                        mode="datetime"
                                        open={isCalendarVisible}
                                        title="Date and Time of Party"
                                        date={partyDate}
                                        onConfirm={(calendarDate) => {
                                             setIsCalendarVisible(false);
                                             setPartyDate(calendarDate);
                                             onChange(calendarDate);
                                        }}
                                        onCancel={() => {
                                             setIsCalendarVisible(false);
                                        }}
                                   />
                              )}
                              name="date"
                         />

                         <Controller
                              control={control}
                              rules={{ required: "Application closing Date is required" }}
                              render={({ field: { onChange } }) => (
                                   <CustomCalendar
                                        isCalendarVisible={isApplicationClosingDatePickerVisible}
                                        onBackDropPress={() =>
                                             setIsApplicationClosingDatePickerVisible(false)
                                        }
                                        onDateSelected={(date) => {
                                             onChange(date);
                                             setIsApplicationClosingDatePickerVisible(false);
                                        }}
                                   />
                              )}
                              name="partyApplicationClosingDate"
                         />
                    </View>
               </KeyboardAwareScrollView>
               <Toasts />
          </ScreenContainer>
     );
};

export default PlanYourParty;
