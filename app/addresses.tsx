import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CustomHeader from '@/components/CustomHeader';
import { router } from 'expo-router';
import useAppwrite from '@/lib/useAppwrite';
import { getUserAddresses } from '@/lib/appwrite';
import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import AddressCard from '@/components/AddressCard';

const Addresses = () => {
  const { data, error, loading, refetch } = useAppwrite({
    fn: getUserAddresses,
  });

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  const handleAddAddress = () => {
    router.push('/address-form?mode=add' as any);
  };

  const addAddressButton = (
    <TouchableOpacity onPress={handleAddAddress}>
      <Ionicons name='add' size={24} color='#181C2E' />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className='flex-1 items-center justify-center'>
      <Image
        source={images.emptyState}
        className='w-32 h-32 mb-6'
        resizeMode='contain'
      />
      <Text className='h3-bold text-dark-100 text-center mb-2'>
        No Addresses Found
      </Text>
      <Text className='paragraph-medium text-gray-500 text-center mb-8 px-8'>
        You haven&apos;t added any addresses yet. Start by adding a new address.
      </Text>
      <CustomButton
        title='Add Address'
        onPress={handleAddAddress}
        style='bg-primary border border-primary max-w-xs'
        textStyle='!text-white'
      />
    </View>
  );

  const renderErrorState = () => (
    <View className='flex-1 items-center justify-center'>
      <Image
        source={images.emptyState}
        className='w-32 h-32 mb-6'
        resizeMode='contain'
      />
      <Text className='h3-bold text-dark-100 text-center mb-2'>
        Profile Could Not Be Loaded
      </Text>
      <Text className='paragraph-medium text-gray-500 text-center mb-8 px-8'>
        We couldn&apos;t load your address information. Please try again later.
      </Text>
      <CustomButton
        title='Retry'
        onPress={() => refetch()}
        style='bg-primary border border-primary max-w-xs'
        textStyle='!text-white'
      />
    </View>
  );

  const renderAddressList = () => (
    <ScrollView
      className='flex-1'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {data!.map((address) => (
        <AddressCard
          key={address.$id}
          address={address}
          onEdit={(address) => {
            router.push({
              pathname: '/address-form',
              params: {
                mode: 'edit',
                id: address.$id,
                addressData: JSON.stringify(address),
              },
            } as any);
          }}
          onDelete={(address) => {
            // TODO: Silme onayı ve işlemi
            console.log('Delete address:', address.$id);
          }}
        />
      ))}
    </ScrollView>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' />
        </View>
      );
    }

    if (error) {
      return renderErrorState();
    }

    return data!.length === 0 ? renderEmptyState() : renderAddressList();
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='flex-1 px-5'>
        <CustomHeader
          title='Adreslerim'
          rightButton={!loading ? addAddressButton : undefined}
        />
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

export default Addresses;
