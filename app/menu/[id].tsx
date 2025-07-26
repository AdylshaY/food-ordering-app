import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';
import useAppwrite from '@/lib/useAppwrite';
import {
  getMenuById,
  getMenuCustomizations,
  appwriteConfig,
} from '@/lib/appwrite';
import { MenuItem, Customization } from '@/type';
import { images } from '@/constants';
import { useState } from 'react';
import { useCartStore } from '@/store/cart.store';

const MenuDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);

  const { addItem } = useCartStore();

  const {
    data: menuItem,
    loading,
    error,
  } = useAppwrite({
    fn: getMenuById,
    params: { id: id as string },
  });

  const { data: customizations, loading: customizationsLoading } = useAppwrite({
    fn: getMenuCustomizations,
    params: { menuId: id as string },
  });

  if (loading || customizationsLoading) {
    return (
      <SafeAreaView className='bg-white h-full'>
        <View className='flex-1 px-5 py-5'>
          <CustomHeader title='Menu Detail' />
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
          <CustomHeader title='Menu Detail' />
          <View className='flex-1 justify-center items-center'>
            <Text className='text-lg text-red-500'>
              Error loading menu item
            </Text>
            <Text className='text-sm text-gray-400 mt-2'>
              {error || 'Menu item not found'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  const menu = menuItem as MenuItem;
  const imageUrl = `${menu.image_url}?project=${appwriteConfig.projectId}`;

  const menuCustomizations = (customizations as {
    toppings: Customization[];
    sides: Customization[];
  }) || { toppings: [], sides: [] };
  const toppings = menuCustomizations.toppings;
  const sides = menuCustomizations.sides;

  const calculateTotalPrice = () => {
    const basePrice = menu.price;
    const toppingsPrice = toppings
      .filter((topping) => selectedToppings.includes(topping.name))
      .reduce((total, topping) => total + topping.price, 0);
    const sidesPrice = sides
      .filter((side) => selectedSides.includes(side.name))
      .reduce((total, side) => total + side.price, 0);

    return (basePrice + toppingsPrice + sidesPrice) * quantity;
  };

  const handleAddToCart = () => {
    const selectedCustomizations = [
      ...toppings
        .filter((topping) => selectedToppings.includes(topping.name))
        .map((topping) => ({
          id: topping.$id,
          name: topping.name,
          price: topping.price,
          type: topping.type,
        })),
      ...sides
        .filter((side) => selectedSides.includes(side.name))
        .map((side) => ({
          id: side.$id,
          name: side.name,
          price: side.price,
          type: side.type,
        })),
    ];

    const cartItem = {
      id: menu.$id,
      name: menu.name,
      price: menu.price,
      image_url: menu.image_url,
      customizations: selectedCustomizations,
    };

    for (let i = 0; i < quantity; i++) {
      addItem(cartItem);
    }

    setQuantity(1);
    setSelectedToppings([]);
    setSelectedSides([]);
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='flex-1'>
        <View className='px-5 py-5'>
          <CustomHeader title={menu.name} />
        </View>

        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className='flex-1 flex-row px-5'>
            {/* Left side - Menu info */}
            <View className='flex-1 pr-4'>
              {/* Title and subtitle */}
              <View className='mb-4'>
                <Text className='text-2xl font-bold text-black mb-1'>
                  {menu.name}
                </Text>
                <Text className='text-base text-gray-500'>
                  {menu.categories?.name || 'Category'}
                </Text>
              </View>

              {/* Rating */}
              <View className='flex-row items-center mb-4'>
                <View className='flex-row mr-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Image
                      key={star}
                      source={images.star}
                      className='w-4 h-4 mr-1'
                      style={{ tintColor: '#fb923c' }}
                    />
                  ))}
                </View>
                <Text className='text-gray-500 text-base'>{menu.rating}/5</Text>
              </View>

              {/* Price */}
              <Text className='text-3xl font-bold text-orange-500 mb-6'>
                ${menu.price}
              </Text>

              {/* Nutrition info */}
              <View className='flex-row mb-6'>
                <View className='mr-8'>
                  <Text className='text-gray-500 text-sm mb-1'>Calories</Text>
                  <Text className='font-bold text-base'>
                    {menu.calories} Cal
                  </Text>
                </View>
                <View>
                  <Text className='text-gray-500 text-sm mb-1'>Protein</Text>
                  <Text className='font-bold text-base'>{menu.protein}g</Text>
                </View>
              </View>

              {/* Bun Type */}
              <View className='mb-6'>
                <Text className='text-gray-500 text-sm mb-1'>Bun Type</Text>
                <Text className='font-bold text-base'>Whole Wheat</Text>
              </View>
            </View>

            {/* Right side - Product image */}
            <View className='flex-1 justify-center items-center'>
              <Image
                source={{ uri: imageUrl }}
                className='w-full h-64'
                resizeMode='contain'
              />
            </View>
          </View>

          {/* Bottom info badges */}
          <View className='flex-row justify-between items-center px-5 py-4 bg-primary/10 mx-5 rounded-lg mb-5'>
            <View className='flex-row items-center'>
              <Image
                source={images.dollar}
                className='w-4 h-4 mr-2'
                style={{ tintColor: '#fb923c' }}
              />
              <Text className='text-gray-700 font-medium'>Free Delivery</Text>
            </View>

            <View className='flex-row items-center'>
              <Image
                source={images.clock}
                className='w-4 h-4 mr-2'
                style={{ tintColor: '#fb923c' }}
              />
              <Text className='text-gray-700 font-medium'>20 - 30 mins</Text>
            </View>

            <View className='flex-row items-center'>
              <Image
                source={images.star}
                className='w-4 h-4 mr-2'
                style={{ tintColor: '#fb923c' }}
              />
              <Text className='text-gray-700 font-medium'>{menu.rating}</Text>
            </View>
          </View>

          {/* Customizations */}
          <View className='px-5 mb-6'>
            {/* Toppings */}
            <View className='mb-6'>
              <Text className='text-lg font-bold text-black mb-3'>
                Toppings
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row gap-3'>
                  {toppings.map((topping: Customization, index: number) => {
                    const isSelected = selectedToppings.includes(topping.name);
                    const toppingImageUrl = topping.image_url
                      ? `${topping.image_url}?project=${appwriteConfig.projectId}`
                      : null;

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          if (isSelected) {
                            setSelectedToppings(
                              selectedToppings.filter((t) => t !== topping.name)
                            );
                          } else {
                            setSelectedToppings([
                              ...selectedToppings,
                              topping.name,
                            ]);
                          }
                        }}
                        className='items-center'
                      >
                        <View className='relative'>
                          <View className='w-20 h-20 bg-gray-100 rounded-2xl items-center justify-center mb-2'>
                            {toppingImageUrl ? (
                              <Image
                                source={{ uri: toppingImageUrl }}
                                className='w-12 h-12'
                                resizeMode='contain'
                              />
                            ) : (
                              <View className='w-12 h-12 bg-gray-300 rounded-lg' />
                            )}
                          </View>
                          {isSelected && (
                            <View className='absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center'>
                              <Image
                                source={images.plus}
                                className='w-3 h-3'
                                style={{ tintColor: 'white' }}
                              />
                            </View>
                          )}
                        </View>
                        <View className='bg-gray-800 px-3 py-1 rounded-full'>
                          <Text className='text-white text-xs font-medium'>
                            {topping.name}{' '}
                            {topping.price > 0 && `(+$${topping.price})`}
                          </Text>
                        </View>
                        {!isSelected && (
                          <View className='absolute top-16 right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center'>
                            <Image
                              source={images.plus}
                              className='w-3 h-3'
                              style={{ tintColor: 'white' }}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>

            {/* Side Options */}
            <View className='mb-6'>
              <Text className='text-lg font-bold text-black mb-3'>
                Side options
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className='flex-row gap-3'>
                  {sides.map((side: Customization, index: number) => {
                    const isSelected = selectedSides.includes(side.name);
                    const sideImageUrl = side.image_url
                      ? `${side.image_url}?project=${appwriteConfig.projectId}`
                      : null;

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          if (isSelected) {
                            setSelectedSides(
                              selectedSides.filter((s) => s !== side.name)
                            );
                          } else {
                            setSelectedSides([...selectedSides, side.name]);
                          }
                        }}
                        className='items-center'
                      >
                        <View className='relative'>
                          <View className='w-20 h-20 bg-gray-100 rounded-2xl items-center justify-center mb-2'>
                            {sideImageUrl ? (
                              <Image
                                source={{ uri: sideImageUrl }}
                                className='w-12 h-12'
                                resizeMode='contain'
                              />
                            ) : (
                              <View className='w-12 h-12 bg-gray-300 rounded-lg' />
                            )}
                          </View>
                          {isSelected && (
                            <View className='absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full items-center justify-center'>
                              <Image
                                source={images.plus}
                                className='w-3 h-3'
                                style={{ tintColor: 'white' }}
                              />
                            </View>
                          )}
                        </View>
                        <View className='bg-gray-800 px-3 py-1 rounded-full'>
                          <Text className='text-white text-xs font-medium'>
                            {side.name} {side.price > 0 && `(+$${side.price})`}
                          </Text>
                        </View>
                        {!isSelected && (
                          <View className='absolute top-16 right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center'>
                            <Image
                              source={images.plus}
                              className='w-3 h-3'
                              style={{ tintColor: 'white' }}
                            />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>

        {/* Quantity and Add to Cart - Fixed at bottom */}
        <View className='flex-row items-center justify-between px-5 py-5 mx-2 bg-white shadow-dark-100/10 shadow-sm rounded-3xl'>
          <View className='flex-row items-center'>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className='w-10 h-10 rounded-lg items-center justify-center bg-primary/10'
            >
              <Image
                source={images.minus}
                className='w-4 h-4'
                resizeMode='contain'
              />
            </TouchableOpacity>
            <Text className='mx-4 text-xl font-bold'>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              className='w-10 h-10 rounded-lg items-center justify-center bg-primary/10'
            >
              <Image
                source={images.plus}
                className='w-4 h-4'
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            className='flex-1 ml-6 bg-orange-500 py-4 rounded-2xl flex-row items-center justify-center'
          >
            <Image
              source={images.bag}
              className='w-5 h-5 mr-2'
              style={{ tintColor: 'white' }}
            />
            <Text className='text-white font-bold text-lg'>
              Add to cart (${calculateTotalPrice().toFixed(2)})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MenuDetail;
