import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';

import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { updatePhoneNumber } from '@/lib/appwrite';
import useAuthStore from '@/store/auth.store';
import { User } from '@/type';

interface UpdatePhoneProps {
  visible: boolean;
  onClose: () => void;
}

const UpdatePhoneModal = ({ visible, onClose }: UpdatePhoneProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, fetchAuthenticatedUser } = useAuthStore();

  useEffect(() => {
    if (user?.phone_number) {
      setPhoneNumber(user.phone_number);
    }
  }, [user]);

  const handleUpdatePhone = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Hata', 'Lütfen geçerli bir telefon numarası girin.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updatePhoneNumber({
        phoneNumber: phoneNumber.trim(),
      });
      setUser(updatedUser as User);
      Alert.alert('Başarılı', 'Telefon numaranız başarıyla güncellendi.');
      onClose();
    } catch (error) {
      Alert.alert('Hata', 'Telefon numarası güncellenirken bir hata oluştu.');
      console.error('Phone update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPhoneNumber(user?.phone_number || '');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={handleClose}
    >
      <View className='flex-1 items-center justify-end bg-black/50'>
        <View className='w-full bg-white rounded-t-3xl px-6 py-8'>
          <View className='flex-row items-center justify-between mb-6'>
            <Text className='text-xl font-bold text-gray-900'>
              Telefon Numarası {user?.phone_number ? 'Güncelle' : 'Ekle'}
            </Text>
            <TouchableOpacity onPress={handleClose} className='p-2'>
              <Text className='text-gray-500 text-lg'>✕</Text>
            </TouchableOpacity>
          </View>

          <CustomInput
            label='Telefon Numarası'
            placeholder='+90 (5XX) XXX XX XX'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType='phone-pad'
          />

          <View className='flex-row gap-3 mt-6'>
            <CustomButton
              title='İptal'
              onPress={handleClose}
              style='flex-1 bg-white border border-gray-300'
              textStyle='text-black'
            />
            <CustomButton
              title={user?.phone_number ? 'Güncelle' : 'Ekle'}
              onPress={handleUpdatePhone}
              style='flex-1'
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdatePhoneModal;
