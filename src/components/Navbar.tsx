"use client";

import Image from "next/legacy/image";
import logo from "@/../public/astro_logo_f.png";
import Link from "next/link";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import { FaUserCircle } from "react-icons/fa";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { Query } from "appwrite";
import ClearStorageButton from "./ClearStorageButton";

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
      { label: "MY SIGN", link: "#" },
    ],
  },
  {
    label: "ASTROLOGY",
    link: "#",
    children: [
      { label: "ASTROLOGY", link: "#" },
      { label: "TAROT", link: "#" },
      { label: "LOVE + COMPATIBILITY", link: "#" },
      { label: "NUMEROLOGY", link: "#" },
      { label: "PARENTING", link: "#" },
    ],
  },
  { label: "BOOK A POOJA", link: "#" },
  { label: "CONTACT", link: "/contact" },
  { label: "ABOUT", link: "/about" },
];

export default function Navbar() {
  const [isSideMenuOpen, setSideMenu] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileModalRef = useRef<HTMLDivElement>(null);
  const { user, logout, verifySession } = useAuthStore();


  const toggleSideMenu = () => setSideMenu(!isSideMenuOpen);
  const toggleProfileModal = () => setProfileModalOpen(!isProfileModalOpen);

    useEffect(() => {
        const checkAndUpdateUserState = async () => {
            if (user) {
                await verifySession();
            }
        };

        checkAndUpdateUserState();
    }, [user, verifySession, router]);

  const handleLogout = async () => {
    await logout();
    setProfileModalOpen(false);
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    setSideMenu(false);
    router.push(path);
  };

  console.log("user: ", user);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-800 shadow-md text-white">
      <div className="mx-auto flex w-full max-w-7xl justify-between px-4 py-3 text-sm items-center">
        {/* Logo */}
        <Image
          onClick={() => handleNavigation("/")}
          src={logo}
          alt="Astrology Logo"
          width={80}
          height={80}
          priority={true}
          className="cursor-pointer hover:opacity-90 transition-opacity"
        />
          {/* {user && <ClearStorageButton />} */}

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <DesktopNavItem key={index} item={item} />
          ))}
        </div>

        {/* Profile Button / Auth Buttons */}
        <section className="hidden md:flex items-center gap-8">
          {user ? (
            <div className="relative">
              <div className="flex items-center cursor-pointer" onClick={toggleProfileModal}>
                <p className="font-bold py-2 px-4">{user.name}</p>
                <FaUserCircle className="text-3xl text-yellow-300 hover:text-yellow-400 transition-all" />
              </div>
              {isProfileModalOpen && (
                <ProfileModal
                  onClose={() => setProfileModalOpen(false)}
                  onLogout={handleLogout}
                />
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => handleNavigation("/login")}
                className="text-yellow-300 hover:text-yellow-400 transition-all"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigation("/signup")}
                className="rounded-xl border-2 border-yellow-300 px-4 py-2 text-yellow-300 transition-all hover:border-yellow-400 hover:text-yellow-400"
              >
                Register
              </button>
            </>
          )}
        </section>

        {/* Mobile Menu Button */}
        <FiMenu
          onClick={toggleSideMenu}
          className="cursor-pointer text-4xl md:hidden text-yellow-300 hover:text-yellow-400 transition-all"
        />
      </div>

      {/* Mobile Sidebar */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50">
          <div
            ref={sidebarRef}
            className="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-purple-900 to-indigo-900 shadow-lg overflow-y-auto"
          >
            <MobileNav
              closeSideMenu={() => setSideMenu(false)}
              handleNavigation={handleNavigation}
            />
          </div>
        </div>
      )}
    </nav>
  );
}



interface DesktopNavItemProps {
  item: NavItem;
}

function DesktopNavItem({ item }: DesktopNavItemProps) {
  return (
    <div className="relative group px-2 py-3 transition-all">
      <p className="flex items-center gap-2 text-yellow-300 group-hover:text-yellow-400 cursor-pointer">
        <Link href={item.link ?? "#"}>{item.label}</Link>
        {item.children && (
          <RiArrowDropDownLine className="text-2xl group-hover:rotate-0 transition-transform" />
        )}
      </p>
      {item.children && (
        <div className="absolute right-0 top-10 hidden flex-col gap-1 rounded-lg bg-yellow-50 py-3 shadow-lg transition-all group-hover:block">
          {item.children.map((child, index) => (
            <Link
              key={index}
              href={child.link ?? "#"}
              className="flex items-center py-2 px-4 text-neutral-800 hover:bg-yellow-100 hover:text-yellow-900"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
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
