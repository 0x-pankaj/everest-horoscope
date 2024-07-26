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

export default function Navbar() {
    const [isSideMenuOpen, setSideMenu] = useState(false)
    const router = useRouter()
    const sidebarRef = useRef<HTMLDivElement>(null)

    const toggleSideMenu = () => setSideMenu(!isSideMenuOpen)

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSideMenu(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)
        return () => document.removeEventListener("mousedown", handleOutsideClick)
    }, [])

    const handleNavigation = (path: string) => {
        setSideMenu(false)
        router.push(path)
    }

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="mx-auto flex w-full max-w-7xl justify-between px-4 py-2 text-sm">
                <section className="flex items-center gap-10">
                    <Image onClick={() => handleNavigation("/")} src={logo} alt="logo" width={100} height={100} priority={true} className="cursor-pointer" />
                    
                    <div className="hidden md:flex items-center gap-4 transition-all">
                        {navItems.map((item, index) => (
                            <DesktopNavItem key={index} item={item} />
                        ))}
                    </div>
                </section>

                <section className="hidden md:flex items-center gap-8">
                    <button onClick={() => handleNavigation("/login")} className="h-fit text-neutral-400 transition-all hover:text-black/90">
                        Login
                    </button>
                    <button onClick={() => handleNavigation("/signup")} className="h-fit rounded-xl border-2 border-neutral-400 px-4 py-2 text-neutral-400 transition-all hover:border-black hover:text-black/90">
                        Register
                    </button>
                </section>

                <FiMenu onClick={toggleSideMenu} className="cursor-pointer text-4xl m-2 md:hidden" />
            </div>

            {isSideMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                    <div ref={sidebarRef} className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg overflow-y-auto">
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
                {item.children && <RiArrowDropDownLine className="rotate-180 transition-all group-hover:rotate-0" />}
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
    return (
        <div className="p-4">
            <section className="flex justify-end mb-4">
                <MdClose onClick={closeSideMenu} className="cursor-pointer text-4xl" />
            </section>
            <div className="flex flex-col items-start text-base gap-2 transition-all">
                {navItems.map((item, index) => (
                    <MobileNavItem key={index} item={item} handleNavigation={handleNavigation} />
                ))}
            </div>
            <section className="flex flex-col items-start gap-4 mt-8">
                <button onClick={() => handleNavigation("/login")} className="text-neutral-400 transition-all hover:text-black/90">
                    Login
                </button>
                <button onClick={() => handleNavigation("/signup")} className="rounded-xl border-2 border-neutral-400 px-4 py-2 text-neutral-400 transition-all hover:border-black hover:text-black/90">
                    Register
                </button>
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