import React, {useCallback} from 'react';
import {ImageColorsResult, getColors} from 'react-native-image-colors';

const useImageColors = ({url = 'https://i.imgur.com/68jyjZT.jpg'} = {}) => {
  const [colors, setColors] = React.useState<ImageColorsResult>(
    {} as ImageColorsResult,
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const computeColors = useCallback(() => {
    if (!url) {
      setError('No URL provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    getColors(url, {
      fallback: '#228B22',
      cache: true,
      key: url,
    })
      .then((item: ImageColorsResult) => {
        setColors(item);
        setLoading(false);
        return item;
      })
      .catch(e => {
        console.error(e);
        setError(e);
        setLoading(false);
      });
  }, [url]);

  React.useEffect(() => {
    computeColors();
  }, [computeColors]);

  return {colors, loading, error};
};

export default useImageColors;
