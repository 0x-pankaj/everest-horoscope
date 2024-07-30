
const conf = {
    appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
    appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    appwriteApiKey: String(process.env.EVEREST_HOROSCOPE),
    appwriteHoroscopeDatabaseId: String(process.env.NEXT_PUBLIC_HOROSCOPE_DATABASE_ID),
    appwriteAstroCollectionId: String(process.env.NEXT_PUBLIC_ASTRO_COLLECTION_ID),
    appwriteMessageCollectionId: String(process.env.NEXT_PUBLIC_MESSAGE_COLLECTION_ID),
    appwroteAdminCollectionId: String(process.env.NEXT_PUBLIC_ADMIN_COLLECTION_ID),
    appwriteTeamMemberCollectionId: String(process.env.NEXT_PUBLIC_TEAM_MEMBER_ID),
    appwriteMessageWithTeamCollectionId: String(process.env.NEXT_PUBLIC_MESSAGE_WITH_TEAM_COLLECTION_ID)
}

export default conf;