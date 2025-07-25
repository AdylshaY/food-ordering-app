import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';

const MenuDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='flex-1 px-5 py-5'>
        <CustomHeader title="Menu Detail" />


        <View className='flex-1 justify-center items-center'>
          <Text className='text-2xl font-bold mb-4'>Menu Item Details</Text>
          <Text className='text-lg text-gray-600'>
            Menu ID: <Text className='font-bold text-black'>{id}</Text>
          </Text>
          <Text className='text-sm text-gray-400 mt-4 text-center'>
            This is a placeholder screen.{'\n'}
            The detailed menu information will be displayed here.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MenuDetail;
