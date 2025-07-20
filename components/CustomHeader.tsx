import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { CustomHeaderProps } from '@/type';
import { images } from '@/constants';

const CustomHeader = ({
  title,
  onRightButtonPress,
  rightButton,
}: CustomHeaderProps) => {
  const router = useRouter();

  return (
    <View className='custom-header'>
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={images.arrowBack}
          className='size-5'
          resizeMode='contain'
        />
      </TouchableOpacity>

      {title && <Text className='base-semibold text-dark-100'>{title}</Text>}

      {rightButton ? (
        <TouchableOpacity onPress={onRightButtonPress}>
          {rightButton}
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
};

export default CustomHeader;
