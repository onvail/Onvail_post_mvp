import DocumentPicker, {
  DocumentPickerOptions,
} from 'react-native-document-picker';
import {SupportedPlatforms} from 'react-native-document-picker/lib/typescript/fileTypes';

const useDocumentPicker = () => {
  const options: DocumentPickerOptions<SupportedPlatforms> | undefined = {
    allowMultiSelection: true,
  };
  const selectDocument = async () => {
    try {
      const response = await DocumentPicker.pick(options);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    selectDocument,
  };
};

export default useDocumentPicker;
