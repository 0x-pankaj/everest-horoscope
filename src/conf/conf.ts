
const conf = {
    appwriteUrl: String(process.env.NEXT_PUBLIC_APPWRITE_URL),
    appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    appwriteApiKey: String(process.env.NEXT_PUBLIC_APPWRITE_API_KEY),
    appwriteHoroscopeDatabaseId: String(process.env.NEXT_PUBLIC_HOROSCOPE_DATABASE_ID),
    appwriteAstroCollectionId: String(process.env.NEXT_PUBLIC_ASTRO_COLLECTION_ID),
    appwriteMessageCollectionId: String(process.env.NEXT_PUBLIC_MESSAGE_COLLECTION_ID),
    appwroteAdminCollectionId: String(process.env.NEXT_PUBLIC_ADMIN_COLLECTION_ID),
    appwriteTeamMemberCollectionId: String(process.env.NEXT_PUBLIC_TEAM_MEMBER_ID),
    appwriteMessageWithTeamCollectionId: String(process.env.NEXT_PUBLIC_MESSAGE_WITH_TEAM_COLLECTION_ID),
    appwriteBlogCollectionId: String(process.env.NEXT_PUBLIC_BLOG_COLLECTION_ID),
    appwriteMessageWithTranslatorCollectionId: String(process.env.NEXT_PUBLIC_MESSAGE_WITH_TRANSLATOR),
    appwriteHoroscopeBucket: String(process.env.NEXT_PUBLIC_HOROSCOPE_BUCKET),
    appwriteTranslatorCollectionId: String(process.env.NEXT_PUBLIC_TRANSLATOR_COLLECTION_ID),
    appwriteZodiacCollectionId: String(process.env.NEXT_PUBLIC_ZODIAC_COLLECTION_ID),
    appwriteUserCollectionId: String(process.env.NEXT_PUBLIC_USER_COLLECTION_ID),
    weatherApiKey: String(process.env.NEXT_PUBLIC_WEATHER_API_KEY),

    appwritePanchangDetails: String(process.env.NEXT_PUBLIC_PANCHANG_DETAILS),

    appwriteQuestionCollectionId: String(process.env.NEXT_PUBLIC_QUESTIONS_COLLECTION_ID),
    appwriteServicesCollectionId: String(process.env.NEXT_PUBLIC_SERVICES_COLLECTION_ID),
    tinymceApiKey: String(process.env.NEXT_PUBLIC_TINYMCE_API_KEY),
    appwriteCrouselCollectionId: String(process.env.NEXT_PUBLIC_CROUSEL_COLLECTION_ID),
    appwriteTestimonialCollectionId: String(process.env.NEXT_PUBLIC_APPWRITE_TESTIMONIALS_COLLECTION_ID),
    appwriteTransactionHistoryCollectionId: String(process.env.NEXT_PUBLIC_TRANSACTIONS_HISTROY_COLLECTION_ID)
}

export default conf;  