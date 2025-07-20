import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from 'react-native-appwrite';

import {
  CreateUserParams,
  GetMenuParams,
  SignInParams,
  UpdatePhoneNumberParams,
} from '../type';

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: process.env.EXPO_PUBLIC_PLATFORM!,
  databaseId: process.env.EXPO_PUBLIC_DATABASE_ID!,
  userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID!,
  categoryCollectionId: process.env.EXPO_PUBLIC_CATEGORY_COLLECTION_ID!,
  menuCollectionId: process.env.EXPO_PUBLIC_MENU_COLLECTION_ID!,
  customizationCollectionId:
    process.env.EXPO_PUBLIC_CUSTOMIZATION_COLLECTION_ID!,
  menuCustomizationCollectionId:
    process.env.EXPO_PUBLIC_MENU_CUSTOMIZATION_COLLECTION_ID!,
  addressCollectionId: process.env.EXPO_PUBLIC_ADDRESS_COLLECTION_ID!,
  bucketId: process.env.EXPO_PUBLIC_BUCKET_ID!,
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);

    if (!newAccount) throw new Error('Failed to create user account');

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    if (!session) throw new Error('Failed to sign in');
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAcount = await account.get();
    if (!currentAcount) throw new Error('No user is currently signed in');

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAcount.$id)]
    );
    if (!currentUser) throw new Error('User not found in database');

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error as string);
  }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
  try {
    const queries: string[] = [];

    if (category) queries.push(Query.equal('categories', category));
    if (query) queries.push(Query.search('name', query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    );

    return menus.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCategories = async () => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoryCollectionId
    );

    return categories.documents;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const updatePhoneNumber = async ({
  phoneNumber,
}: UpdatePhoneNumberParams) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error('No user found');

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      currentUser.$id,
      {
        phone_number: phoneNumber,
      }
    );

    return updatedUser;
  } catch (error) {
    throw new Error(error as string);
  }
};
