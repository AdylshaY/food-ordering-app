import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Models } from 'react-native-appwrite';
import { Ionicons } from '@expo/vector-icons';

interface AddressCardProps {
  address: Models.Document;
  onEdit?: (address: Models.Document) => void;
  onDelete?: (address: Models.Document) => void;
}

const AddressCard = ({ address, onEdit, onDelete }: AddressCardProps) => {
  const handleEdit = () => {
    onEdit?.(address);
  };

  const handleDelete = () => {
    onDelete?.(address);
  };

  return (
    <View className='bg-white rounded-xl mx-4 my-2 p-4 shadow-md shadow-black/10'>
      <View className='flex-row justify-between items-start'>
        <View className='flex-1 mr-3'>
          <Text className='paragraph-bold text-dark-100 mb-1'>
            {address.label}
          </Text>
          <Text className='body-medium text-gray-100 mb-1'>
            {address.street} {address.building_number}
            {address.apartment_number && `, Apt ${address.apartment_number}`}
          </Text>
          <Text className='body-medium text-gray-100 mb-1'>
            {address.city}, {address.postal_code}
          </Text>
          {address.delivery_note && (
            <Text className='small-bold text-gray-200 italic'>
              {address.delivery_note}
            </Text>
          )}
        </View>

        <View className='flex-row gap-2'>
          <TouchableOpacity
            className='p-2 rounded-lg bg-primary/10'
            onPress={handleEdit}
          >
            <Ionicons name='pencil' size={18} color='#FE8C00' />
          </TouchableOpacity>

          <TouchableOpacity
            className='p-2 rounded-lg bg-error/10'
            onPress={handleDelete}
          >
            <Ionicons name='trash-outline' size={18} color='#F14141' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddressCard;
