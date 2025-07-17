import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { images } from '@/constants';
import CustomHeader from '@/components/CustomHeader';
import CustomButton from '@/components/CustomButton';
import useAuthStore from '@/store/auth.store';
import { account } from '@/lib/appwrite';

const Profile = () => {
  const { user, setIsAuthenticated, setUser } = useAuthStore();

  const handleEditProfile = () => {
    console.log('Edit Profile pressed');
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/sign-in');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (!user) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 px-5'>
          <CustomHeader title='Profile' />

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
              We couldn't load your profile information. Please try logging out
              and logging back in.
            </Text>

            <CustomButton
              title='Logout'
              onPress={handleLogout}
              style='bg-red-500/10 border border-red-500 max-w-xs'
              textStyle='!text-red-500'
              leftIcon={
                <Image
                  source={images.logout}
                  className='w-5 h-5 tint-red-500 mr-2'
                  resizeMode='contain'
                />
              }
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <ScrollView className='flex-1 px-5'>
        <CustomHeader title='Profile' />

        {/* Profile Avatar Section */}
        <View className='items-center mb-8'>
          <View className='profile-avatar'>
            <Image
              source={user?.avatar ? { uri: user.avatar } : images.avatar}
              className='w-full h-full rounded-full'
              resizeMode='cover'
            />
            <TouchableOpacity className='profile-edit'>
              <Image
                source={images.pencil}
                className='w-3 h-3 tint-white'
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Information */}
        <View className='mb-8 bg-white p-5 rounded-2xl'>
          {/* Full Name */}
          <View className='profile-field'>
            <View className='profile-field__icon'>
              <Image
                source={images.person}
                className='w-5 h-5 tint-primary'
                resizeMode='contain'
              />
            </View>
            <View className='flex-1'>
              <Text className='body-medium text-gray-500 mb-1'>Full Name</Text>
              <Text className='paragraph-semibold text-dark-100'>
                {user.name}
              </Text>
            </View>
          </View>

          {/* Email */}
          <View className='profile-field'>
            <View className='profile-field__icon'>
              <Image
                source={images.envelope}
                className='w-5 h-5 tint-primary'
                resizeMode='contain'
              />
            </View>
            <View className='flex-1'>
              <Text className='body-medium text-gray-500 mb-1'>Email</Text>
              <Text className='paragraph-semibold text-dark-100'>
                {user.email}
              </Text>
            </View>
          </View>

          {/* Phone Number - Only show if available */}
          {user?.phone && (
            <View className='profile-field'>
              <View className='profile-field__icon'>
                <Image
                  source={images.phone}
                  className='w-5 h-5 tint-primary'
                  resizeMode='contain'
                />
              </View>
              <View className='flex-1'>
                <Text className='body-medium text-gray-500 mb-1'>
                  Phone number
                </Text>
                <Text className='paragraph-semibold text-dark-100'>
                  {user.phone}
                </Text>
              </View>
            </View>
          )}

          {/* Home Address - Only show if available */}
          {user?.homeAddress && (
            <View className='profile-field'>
              <View className='profile-field__icon'>
                <Image
                  source={images.location}
                  className='w-5 h-5 tint-primary'
                  resizeMode='contain'
                />
              </View>
              <View className='flex-1'>
                <Text className='body-medium text-gray-500 mb-1'>
                  Address 1 - (Home)
                </Text>
                <Text className='paragraph-semibold text-dark-100'>
                  {user.homeAddress}
                </Text>
              </View>
            </View>
          )}

          {/* Work Address - Only show if available */}
          {user?.workAddress && (
            <View className='profile-field'>
              <View className='profile-field__icon'>
                <Image
                  source={images.location}
                  className='w-5 h-5 tint-primary'
                  resizeMode='contain'
                />
              </View>
              <View className='flex-1'>
                <Text className='body-medium text-gray-500 mb-1'>
                  Address 2 - (Work)
                </Text>
                <Text className='paragraph-semibold text-dark-100'>
                  {user.workAddress}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className='gap-4 mb-8'>
          <CustomButton
            title='Edit Profile'
            onPress={handleEditProfile}
            style='bg-primary/10 border border-primary'
            textStyle='!text-primary'
          />

          <CustomButton
            title='Logout'
            onPress={handleLogout}
            style='bg-red-500/10 border border-red-500'
            textStyle='!text-red-500'
            leftIcon={
              <Image
                source={images.logout}
                className='w-5 h-5 tint-red-500 mr-2'
                resizeMode='contain'
              />
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
