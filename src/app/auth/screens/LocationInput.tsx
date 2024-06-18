import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ErrorText from 'src/app/components/Text/ErrorText';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';
import CustomDropDown from 'src/app/components/Dropdown/CustomDropDown';
import {
  Country,
  City,
  State,
  ICountry,
  IState,
  ICity,
} from 'country-state-city';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

type InitialValue = {
  country: string;
  city: string;
  state: string;
};

const LocationInput: FunctionComponent<Props> = ({navigation}) => {
  const defaultValues: InitialValue = {
    country: '',
    city: '',
    state: '',
  };

  const [countriesAndStates, setCountriesAndStates] = useState<ICountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [states, setStates] = useState<IState[]>([]);
  const [selectedState, setSelectedState] = useState<IState | null>(null);
  const [cities, setCities] = useState<ICity[]>([]);
  const [_selectedCity, setSelectedCity] = useState<IState | null>(null);

  const fetchAllCountries = async () => {
    setCountriesAndStates(Country.getAllCountries());
  };

  const fetchStatesInCountry = useCallback(() => {
    if (!selectedCountry) {
      return;
    }
    try {
      const response = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(response);
    } catch (error) {
      console.log(error);
    }
  }, [selectedCountry]);

  const fetchCitiesInAState = useCallback(async () => {
    if (!selectedCountry || !selectedState) {
      return;
    }
    try {
      const response = City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode,
      );
      setCities(response);
    } catch (error) {
      console.log(error);
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    fetchStatesInCountry();
  }, [fetchStatesInCountry]);

  useEffect(() => {
    fetchAllCountries();
  }, []);

  useEffect(() => {
    fetchCitiesInAState();
  }, [fetchCitiesInAState, selectedState, setSelectedCountry]);

  const updateUserSignUpStore = useSignUpStore(
    (state: SignUpStoreState) => state.updateUserSignUpStore,
  );
  const storeUser = useSignUpStore((state: SignUpStoreState) => state.user);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });

  const onSubmit = async ({country, city, state}: InitialValue) => {
    updateUserSignUpStore({
      ...storeUser,
      country,
      state,
      city,
    });
    navigation.navigate('RoleInput');
  };

  return (
    <AuthScreenContainer>
      <View style={tw`mt-12 px-3`}>
        <RowContainer style={tw`mb-12 mt-3 items-center`}>
          <Icon
            onPress={() => navigation.goBack()}
            icon={'chevron-left'}
            color="white"
            size={30}
          />
          <CustomText style={tw`text-lg ml-24`}>Create account</CustomText>
        </RowContainer>
        <CustomText style={tw`text-white font-bold text-lg`}>
          What’s your location?
        </CustomText>
        <View>
          <ErrorText>{errors?.country?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'Country is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomDropDown
                data={countriesAndStates}
                onChange={item => {
                  onChange(item.name);
                  setSelectedCountry(item);
                }}
                labelField={'name'}
                valueField={'name'}
                maxHeight={250}
                value={value}
                onBlur={onBlur}
                placeholder="Select country"
              />
            )}
            name="country"
          />
        </View>
        <View>
          <ErrorText>{errors?.state?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'State/Province is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomDropDown
                data={states || []}
                onChange={item => {
                  onChange(item.name);
                  setSelectedState(item);
                }}
                labelField={'name'}
                valueField={'name'}
                maxHeight={250}
                value={value}
                onBlur={onBlur}
                placeholder="Select state/province"
              />
            )}
            name="state"
          />
        </View>
        <View>
          <ErrorText>{errors?.city?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'City is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomDropDown
                data={cities || []}
                onChange={item => {
                  onChange(item.name);
                  setSelectedCity(item.name);
                }}
                labelField={'name'}
                valueField={'name'}
                maxHeight={250}
                value={value}
                onBlur={onBlur}
                placeholder="City"
              />
            )}
            name="city"
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit(onSubmit)}
        style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-12 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </AuthScreenContainer>
  );
};

export default LocationInput;
