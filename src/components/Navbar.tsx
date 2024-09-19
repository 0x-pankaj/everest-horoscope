"use client"

import Image from "next/image"
import logo from "@/assets/images/everest-logo.png"
import Link from "next/link"
import { RiArrowDropDownLine } from "react-icons/ri"
import { FiMenu } from "react-icons/fi"
import { MdClose } from "react-icons/md"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/Auth"
import { FaUserCircle } from "react-icons/fa"
import { database } from "@/appwrite/clientConfig"
import conf from "@/conf/conf"
import { Query } from "appwrite"

interface NavChild {
    label: string;
    link: string;
}

interface NavItem {
    label: string;
    link: string;
    children?: NavChild[];
}
const navItems: NavItem[] = [
    {
        label: "HOROSCOPES",
        link: "#",
        children: [
            { label: "DAILY", link: "#" },
            { label: "WEEKLY", link: "#" },
            { label: "MONTHLY", link: "#" },
            { label: "2024 YEARLY", link: "#" },
            { label: "MY SIGN", link: "#" }
        ]
    },
    {
        label: "ASTROLOGY",
        link: "#",
        children: [
            { label: "ASTROLOGY", link: "#" },
            { label: "TAROT", link: "#" },
            { label: "LOVE + COMPATIBILITY", link: "#" },
            { label: "NUMEROLOGY", link: "#" },
            { label: "PARENTING", link: "#" }
        ]
    },
    { label: "BOOK A POOJA", link: "#" },
    { label: "CONTACT", link: "/contact" },
    { label: 'ABOUT', link: "/about" }
]

const languages = ["english", "hindi", "spanish", "french", "german"]

export default function Navbar() {
    const [isSideMenuOpen, setSideMenu] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
    const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);
    const router = useRouter()
    const sidebarRef = useRef<HTMLDivElement>(null);
    const profileModalRef = useRef<HTMLDivElement>(null);
    const languageModalRef = useRef<HTMLDivElement>(null);
    const {user, logout} = useAuthStore();
/*
    useEffect(() => {
        if (user) {
            fetchUserLanguages();
        }
    }, [user]);
        if (!user ) return;
    const fetchUserLanguages = async () => {
        try {
            const response = await database.listDocuments(
                conf.appwriteHoroscopeDatabaseId,
                conf.appwriteUserCollectionId,
                [
                    Query.equal("email", [user?.email])
                ]
                
            );
            setPreferredLanguages(response.languages || []);
        } catch (error) {
            console.error("Error fetching user languages:", error);
        }
    };
*/
    const toggleSideMenu = () => setSideMenu(!isSideMenuOpen)
    const toggleProfileModal = () => setProfileModalOpen(!isProfileModalOpen);
    // const toggleLanguageModal = () => setLanguageModalOpen(!isLanguageModalOpen);

    const handleLogout = async() => {
        await logout();
        setProfileModalOpen(false);
        router.push("/");
    }

    const handleNavigation = (path: string) => {
        setSideMenu(false)
        router.push(path)
    }
/*
    const handleLanguageToggle = async (language: string) => {
        const updatedLanguages = preferredLanguages.includes(language)
            ? preferredLanguages.filter(lang => lang !== language)
            : [...preferredLanguages, language];
        
        setPreferredLanguages(updatedLanguages);

        try {
            await database.updateDocument(
                conf.appwriteHoroscopeDatabaseId,
                conf.appwriteUserCollectionId,
                user?.$id as string,
                { languages: updatedLanguages }
            );
        } catch (error) {
            console.error("Error updating user languages:", error);
        }
    };
*/
    return (
        <nav className="sticky top-0 z-50 bg-yellow-100 shadow-md">
            <div className="mx-auto flex w-full max-w-7xl justify-between px-4 py-2 text-sm">
                <section className="flex items-center gap-10">
                    <Image onClick={() => handleNavigation("/")} src={logo} alt="logo" width={80} height={80} priority={true} className="cursor-pointer" />
                    
                    <div className="hidden md:flex items-center gap-4 transition-all">
                        {navItems.map((item, index) => (
                            <DesktopNavItem key={index} item={item} />
                        ))}
                    </div>
{/*                     
                    <div>
                        <button onClick={toggleLanguageModal} className="text-yellow-800 hover:text-yellow-900">
                            Language: {preferredLanguages[0] || "Select"}
                        </button>
                        {isLanguageModalOpen && (
                            <LanguageModal 
                                languages={languages}
                                preferredLanguages={preferredLanguages}
                                onToggle={handleLanguageToggle}
                                onClose={() => setLanguageModalOpen(false)}
                            />
                        )}
                    </div> */}
                    
                </section>

                <section className="hidden md:flex items-center gap-8">
                {user ? (
                    <div className="relative">
                        <div className="flex items-center">
                            <p className="font-bold py-2 px-4 text-yellow-800">{user.name}</p>
                            <FaUserCircle 
                                onClick={toggleProfileModal} 
                                className="cursor-pointer text-5xl text-yellow-600 hover:text-yellow-700"
                            />
                        </div>
                        {isProfileModalOpen && (
                            <div ref={profileModalRef}>
                                <ProfileModal 
                                    onClose={() => setProfileModalOpen(false)}
                                    onLogout={handleLogout}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button onClick={() => handleNavigation("/login")} className="h-fit text-yellow-700 transition-all hover:text-yellow-800">
                            Login
                        </button>
                        <button onClick={() => handleNavigation("/signup")} className="h-fit rounded-xl border-2 border-yellow-600 px-4 py-2 text-yellow-700 transition-all hover:border-yellow-700 hover:text-yellow-800">
                            Register
                        </button>
                    </>
                )}
            </section>

                <FiMenu onClick={toggleSideMenu} className="cursor-pointer text-4xl my-7 mx-3 md:hidden text-yellow-800" />
            </div>

            {isSideMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div ref={sidebarRef} className="fixed right-0 top-0 h-full w-64 bg-yellow-50 shadow-lg overflow-y-auto">
                        <MobileNav closeSideMenu={() => setSideMenu(false)} handleNavigation={handleNavigation} />
                    </div>
                </div>
            )}
        </nav>
    )
}

interface DesktopNavItemProps {
    item: NavItem;
}

function DesktopNavItem({ item }: DesktopNavItemProps) {
    return (
        <div className="relative group px-2 py-3 transition-all">
            <p className="flex cursor-pointer items-center gap-2 text-neutral-400 group-hover:text-black">
                <Link href={item.link ?? "#"}>{item.label}</Link>
                {item.children && <RiArrowDropDownLine className=" rotate-180 transition-all group-hover:rotate-0" />}
            </p>
            {item.children && (
                <div className="absolute right-0 top-10 hidden w-auto flex-col gap-1 rounded-lg bg-white py-3 shadow-md transition-all group-hover:block">
                    {item.children.map((child, index) => (
                        <Link 
                            key={index}
                            href={child.link ?? "#"}
                            className="flex cursor-pointer items-center py-1 pl-6 pr-8 text-neutral-400 hover:text-black"
                        >
                            <span className="whitespace-nowrap pl-3">{child.label}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

interface MobileNavProps {
    closeSideMenu: () => void;
    handleNavigation: (path: string) => void;
}

function MobileNav({ closeSideMenu, handleNavigation }: MobileNavProps) {
    const router = useRouter();

    const {user, logout} = useAuthStore();

    const handleLogout = async() => {
        await logout();
        closeSideMenu();
        handleNavigation("/");
    }

    return (
        <div className="p-4">
            <section className="flex justify-end mb-4">
                <MdClose onClick={closeSideMenu} className="cursor-pointer my-3 text-5xl" />
            </section>
            <div className="flex flex-col items-start text-base gap-2 transition-all">
                {navItems.map((item, index) => (
                    <MobileNavItem key={index} item={item} handleNavigation={handleNavigation} />
                ))}
            </div>
            <section className="flex flex-col items-start gap-4 mt-8">
                {user ? (
                    <>
                        <div>{user.name}</div>
                        <button onClick={()=> {
                            router.push(`/chat/${user.$id}`)
                            closeSideMenu();
                        }} >Get All Messages</button>
                        <button onClick={() => handleNavigation("/manage-profile")} className="text-neutral-400 transition-all hover:text-black/90">
                            Manage Profile
                        </button>
                        <button onClick={() => handleNavigation("/dashboard")} className="text-neutral-400 transition-all hover:text-black/90">
                            Dashboard
                        </button>
                        <button onClick={handleLogout} className="text-neutral-400 transition-all hover:text-black/90">
                            Logout
                        </button>
                        <button onClick={() => {
                            // Implement logout from all sessions
                            handleLogout();
                        }} className="text-neutral-400 transition-all hover:text-black/90">
                            Logout from all sessions
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => handleNavigation("/login")} className="text-neutral-400 transition-all hover:text-black/90">
                            Login
                        </button>
                        <button onClick={() => handleNavigation("/signup")} className="rounded-xl border-2 border-neutral-400 px-4 py-2 text-neutral-400 transition-all hover:border-black hover:text-black/90">
                            Register
                        </button>
                    </>
                )}
            </section>
        </div>
    )
}

interface MobileNavItemProps {
    item: NavItem;
    handleNavigation: (path: string) => void;
}

function MobileNavItem({ item, handleNavigation }: MobileNavItemProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [animateParent] = useAutoAnimate<HTMLDivElement>()

    const toggleItem = () => setIsOpen(!isOpen)

    return (
        <div ref={animateParent} className="w-full">
            <div
                onClick={item.children ? toggleItem : () => handleNavigation(item.link)}
                className="flex justify-between items-center cursor-pointer py-2 text-neutral-400 hover:text-black"
            >
                <span>{item.label}</span>
                {item.children && (
                    <RiArrowDropDownLine className={`text-2xl transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </div>
            {isOpen && item.children && (
                <div className="pl-4">
                    {item.children.map((child, index) => (
                        <div
                            key={index}
                            onClick={() => handleNavigation(child.link)}
                            className="py-2 cursor-pointer text-neutral-400 hover:text-black"
                        >
                            {child.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}


interface ProfileModalProps {
    onClose: () => void;
    onLogout: () => void;
}

function ProfileModal({ onLogout }: ProfileModalProps) {
    const router = useRouter();
    const {user} = useAuthStore();
    return (
        <div className="absolute right-0 top-10 w-48 flex-col gap-1 rounded-lg bg-yellow-50 py-3 shadow-md">
            <button onClick={()=> {
                router.push(`/chat/${user?.$id}`)
            }} 
            className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-800">
                Get All Messages
            </button>
            <button
            onClick={()=> router.push("/dashboard")}
            className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-800">
                Dashboard
            </button>
            <button 
                onClick={() => router.push('/profile')}
                className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-800"
            >
                Manage Profile
            </button>
            <button 
                onClick={onLogout}
                className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-800"
            >
                Logout
            </button>
            <button   
                onClick={()=> {
                    router.push(`/translator/${user?.$id}`)
                }}
                className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-800"
            >
                Translator
            </button>
            <button 
                onClick={() => {
                    // Implement logout from all sessions
                    console.log("logout from all devices");
                }}
                className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-800"
            >
                Logout from all sessions
            </button>
        </div>
    );
}
/*
interface LanguageModalProps {
    languages: string[];
    preferredLanguages: string[];
    onToggle: (language: string) => void;
    onClose: () => void;
}

function LanguageModal({ languages, preferredLanguages, onToggle, onClose }: LanguageModalProps) {
    return (
        <div className="absolute left-0 top-10 w-48 flex-col gap-1 rounded-lg bg-yellow-50 py-3 shadow-md">
            {languages.map(language => (
                <button
                    key={language}
                    onClick={() => onToggle(language)}
                    className={`w-full text-left px-4 py-2 hover:bg-yellow-100 ${
                        preferredLanguages.includes(language) ? 'text-yellow-800 font-bold' : 'text-yellow-700'
                    }`}
                >
                    {language}
                </button>
            ))}
            <button
                onClick={onClose}
                className="w-full text-left px-4 py-2 hover:bg-yellow-100 text-yellow-800 font-bold"
            >
                Close
            </button>
        </div>
    );
}
    */