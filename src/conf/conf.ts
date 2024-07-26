
const conf = {
    appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
    appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    appwriteApiKey: String(process.env.EVEREST_HOROSCOPE),
    appwriteHoroscopeDatabaseId: String(process.env.NEXT_PUBLIC_HOROSCOPE_DATABASE_ID),
    appwriteAstroCollectionId: String(process.env.NEXT_PUBLIC_ASTRO_COLLECTION_ID)
}

export default conf;