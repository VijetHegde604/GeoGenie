// hooks/useImagePicker.ts
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = () => {
  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    return result.assets?.[0]?.uri ?? null;
  };

  const take = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    return result.assets?.[0]?.uri ?? null;
  };

  return { pick, take };
};