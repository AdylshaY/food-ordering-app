export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    platform: process.env.PLATFORM,
    databaseId: process.env.DATABASE_ID,
    userCollectionId: process.env.USER_COLLECTION_ID
}