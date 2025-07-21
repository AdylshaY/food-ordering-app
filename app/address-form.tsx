import { View, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import CustomHeader from '@/components/CustomHeader';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { createAddress, updateAddress } from '@/lib/appwrite';

interface AddressFormData {
  label: string;
  street: string;
  building_number: string;
  apartment_number: string;
  city: string;
  postal_code: string;
  delivery_note: string;
}

const AddressForm = () => {
  const { mode, id, addressData } = useLocalSearchParams();
  const isEditing = mode === 'edit';

  const [formData, setFormData] = useState<AddressFormData>({
    label: '',
    street: '',
    building_number: '',
    apartment_number: '',
    city: '',
    postal_code: '',
    delivery_note: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && addressData) {
      try {
        const existingAddress = JSON.parse(addressData as string);
        setFormData({
          label: existingAddress.label || '',
          street: existingAddress.street || '',
          building_number: existingAddress.building_number || '',
          apartment_number: existingAddress.apartment_number || '',
          city: existingAddress.city || '',
          postal_code: existingAddress.postal_code || '',
          delivery_note: existingAddress.delivery_note || '',
        });
      } catch (error) {
        console.error('Error parsing address data:', error);
      }
    }
  }, [isEditing, addressData]); 

  const validateForm = (): boolean => {
    if (!formData.label.trim()) {
      alert('Address label is required');
      return false;
    }
    if (!formData.street.trim()) {
      alert('Street address is required');
      return false;
    }
    if (!formData.building_number.trim()) {
      alert('Building number is required');
      return false;
    }
    if (!formData.city.trim()) {
      alert('City is required');
      return false;
    }
    if (!formData.postal_code.trim()) {
      alert('Postal code is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateAddress(id as string, formData);
      } else {
        await createAddress(formData);
      }
      router.back();
    } catch (error) {
      console.error('Address save error:', error);
      alert('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='flex-1 px-5'>
        <CustomHeader title={isEditing ? 'Adres Düzenle' : 'Yeni Adres'} />

        <ScrollView
          className='flex-1'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className='mt-5'>
            <CustomInput
              label='Address Label'
              placeholder='e.g., Home, Work, etc.'
              value={formData.label}
              onChangeText={(value) => handleInputChange('label', value)}
            />

            <CustomInput
              label='Street Address'
              placeholder='Enter street name'
              value={formData.street}
              onChangeText={(value) => handleInputChange('street', value)}
            />

            <View className='flex-row gap-3'>
              <View className='flex-1'>
                <CustomInput
                  label='Building Number'
                  placeholder='123'
                  value={formData.building_number}
                  onChangeText={(value) =>
                    handleInputChange('building_number', value)
                  }
                />
              </View>

              <View className='flex-1'>
                <CustomInput
                  label='Apartment Number'
                  placeholder='4A (Optional)'
                  value={formData.apartment_number}
                  onChangeText={(value) =>
                    handleInputChange('apartment_number', value)
                  }
                />
              </View>
            </View>

            <View className='flex-row gap-3'>
              <View className='flex-1'>
                <CustomInput
                  label='City'
                  placeholder='Enter city'
                  value={formData.city}
                  onChangeText={(value) => handleInputChange('city', value)}
                />
              </View>

              <View className='flex-1'>
                <CustomInput
                  label='Postal Code'
                  placeholder='12345'
                  value={formData.postal_code}
                  onChangeText={(value) =>
                    handleInputChange('postal_code', value)
                  }
                />
              </View>
            </View>

            <CustomInput
              label='Delivery Note'
              placeholder='Special delivery instructions (Optional)'
              value={formData.delivery_note}
              onChangeText={(value) =>
                handleInputChange('delivery_note', value)
              }
            />
          </View>
        </ScrollView>

        <View className='absolute bottom-0 left-0 right-0 bg-gray-50 px-5 py-4'>
          <CustomButton
            title={isEditing ? 'Update Address' : 'Save Address'}
            onPress={handleSubmit}
            isLoading={isSubmitting}
            style='bg-primary border border-primary'
            textStyle='!text-white'
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddressForm;
