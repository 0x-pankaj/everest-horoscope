"use client"
import Image from "next/image"
import logo from "@/assets/images/everest-logo.png"
import Link from "next/link"
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useAuth from "@/context/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navItems= [
    {
        label: "Features",
        link: "#",
        children: [
            {
                label: "Todo list",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            },
            {
                label: "Reminders",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            },
            {
                label: "Calendar",
                link: "#"
            }
        ]
    },
    {
        label: "Astro",
        link: "#",
        children: [
            {
                label: "Virgo",
                link: "#"
            },
            {
                label: "our team",
                link: "#"
            }
        ]
    },
    {
        label: "Contact",
        link: "#"
    },
    {
        label: 'About',
        link: "#"
    }
]




export default function Navbar() {
    const [isSideMenuOpen, setSideMenu] = useState(false);
    // const {authStatus} = useAuth();
    // console.log(authStatus)

    function openSideMenu() {
        setSideMenu(true);
    }

    function closeSideMenu() {
        setSideMenu(false)
    }
    const router = useRouter();
    return (
        <div className=" mx-auto flex w-full max-w-7xl justify-between px-4 py-5 text-sm" >
            {/* left section */}
            <section className="flex items-center gap-10" >
                {/* logo */}
                <Image onClick={()=> router.push("/")} src={logo} alt="logo" width={100} height={100}/>
                {isSideMenuOpen && <MobileNav closeSideMenu={closeSideMenu}  />}
                

                <div className="hidden md:flex items-center gap-4 transition-all">
                    <Link href={""} className="relative group px-2 py-3 transition-all" >
                        <p className="flex cursor-pointer items-center gap-2 text-neutral-400 group-hover:text-black" >
                            <span>
                                Features
                            </span>
                            <RiArrowDropDownLine className="rotate-180 transition-all group-hover:rotate-0" />
                        </p>
                        {/* dropdown  */}
                        <div className="absolute right-0 top-10 hidden w-auto flex-col gap-1 rounded-lg bg-white py-3 shadow-md transition-all group-hover:flex ">
                            <Link href={"#"} className="flex cursor-pointer items-center py-1 pl-6 pr-8 text-neutral-400 hover:text-black" >
                                <span className="whitespace-nowrap" >Virgo</span>
                            </Link>
                        </div>
                    </Link>
                </div>
            </section>
                <section className="hidden md:flex items-center gap-8" >
                    {/* right side data  */}
                    <button  onClick={()=> router.push("/login")} className=" h-fit text-neutral-400 transition-all hover:text-black/90">
                        Login
                    </button>
                     <button onClick={()=> router.push("/signup")} className="h-fit rounded-xl border-2 border-neutral-400 px-4 py-2 text-neutral-400 transition-all hover:border-black hover:text-black/90 ">
                        Register
                    </button>
                </section>

             
            <FiMenu onClick={openSideMenu} className="cursor-pointer text-4xl m-2 md:hidden" />
        </div>
    )
}

function MobileNav({closeSideMenu}: {closeSideMenu: ()=> {}}) {
        const router = useRouter();
    return (
        <div className= " fixed left-0 top-0 flex h-full min-h-screen w-full justify-end bg-black/60 md:hidden ">
            <div className="overflow-auto scroll-smooth h-full w-[75%] bg-white px-4 py-4">
                <section className="flex justify-end">
                    <MdClose onClick={closeSideMenu} className="cursor-pointer text-4xl"  />
                </section>
                <div className="flex flex-col items-center gap-4 transition-all">
                    {
                        navItems.map((d, i)=> (
                            <SingleNavItem key={i} d={d} />
                        ))
                    }
                </div>

                <section className="flex flex-col items-center gap-8 mt-4" >
                    {/* right side data  */}
                    <button onClick={()=> (router.push("/login") )} className=" h-fit text-neutral-400 transition-all hover:text-black/90">
                        Login
                    </button>
                     <button onClick={()=> ( router.push("/signup"))} className="h-fit rounded-xl border-2 border-neutral-400 px-4 py-2 text-neutral-400 transition-all hover:border-black hover:text-black/90 ">
                        Register
                    </button>
                </section>
            </div>
        </div>
    );
}

export function SingleNavItem({d}:{d: any}) {
    const [isItemOpen, setItemOpen] = useState(false);
    const [animateParent] = useAutoAnimate();

    function toggleItem() {
        return setItemOpen(!isItemOpen);
    }

    return (
        <Link
            ref={animateParent}
            onClick={toggleItem}
            href={d.link ?? "#"}
            className="relative group px-2 py-3 transition-all"
                >
                <p className="flex cursor-pointer items-center gap-2 text-neutral-400 group-hover:text-black">
                <span>{d.label} </span>
                    {
                        d.children && (
                            //rotate-180
                            <RiArrowDropDownLine
                            className= {`text-xs transition-all `}
                            />
                        )
                    }

                </p>

                {/* dropdown */}
                {
                    isItemOpen &&  d.children && (
                        //rotate-180
                        
                        <div className=" w-auto flex flex-col gap-1 rounded-lg bg-white py-3  transition-all ">
                            {
                                d.children.map((ch: any, i: any)=> (
                                    <Link
                                    key={i}
                                    href={ch.link ?? "#"}
                                    className="flex cursor-pointer items-center py-1 pl-6 pr-8 text-neutral-400 hover:text-black"
                                    >
                                        {/* image */}
                                        <span className="whitespace-nowrap pl-3 ">
                                            {ch.label}
                                        </span>
                                    </Link>
                                ))
                            }
                        </div>
                    )
                }
        </Link>
    )
}