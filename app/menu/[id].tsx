import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';
import useAppwrite from '@/lib/useAppwrite';
import { getMenuById } from '@/lib/appwrite';
import { MenuItem } from '@/type';

const MenuDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: menuItem, loading, error } = useAppwrite({
    fn: getMenuById,
    params: { id: id as string },
  });

  if (loading) {
    return (
      <SafeAreaView className='bg-white h-full'>
        <View className='flex-1 px-5 py-5'>
          <CustomHeader title="Menu Detail" />
          <View className='flex-1 justify-center items-center'>
            <Text className='text-lg text-gray-600'>Loading...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !menuItem) {
    return (
      <SafeAreaView className='bg-white h-full'>
        <View className='flex-1 px-5 py-5'>
          <CustomHeader title="Menu Detail" />
          <View className='flex-1 justify-center items-center'>
            <Text className='text-lg text-red-500'>Error loading menu item</Text>
            <Text className='text-sm text-gray-400 mt-2'>
              {error || 'Menu item not found'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const menu = menuItem as MenuItem;

  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='flex-1 px-5 py-5'>
        <CustomHeader title={menu.name} />

        <View className='flex-1 justify-center items-center'>
          <Text className='text-2xl font-bold mb-4'>{menu.name}</Text>
          <Text className='text-lg text-gray-600 mb-2'>
            Price: <Text className='font-bold text-green-600'>${menu.price}</Text>
          </Text>
          <Text className='text-lg text-gray-600 mb-2'>
            Rating: <Text className='font-bold text-yellow-600'>{menu.rating}⭐</Text>
          </Text>
          <Text className='text-lg text-gray-600 mb-2'>
            Calories: <Text className='font-bold'>{menu.calories} cal</Text>
          </Text>
          <Text className='text-lg text-gray-600 mb-4'>
            Protein: <Text className='font-bold'>{menu.protein}g</Text>
          </Text>
          <Text className='text-sm text-gray-600 text-center px-4'>
            {menu.description}
          </Text>
          <Text className='text-xs text-gray-400 mt-4'>
            ID: {menu.$id}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MenuDetail;
