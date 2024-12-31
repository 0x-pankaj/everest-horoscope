// src/app/(dashboard)/data/SidebarItems.ts

import { FiHome, FiUsers, FiStar } from "react-icons/fi";
import { ImBlog } from "react-icons/im";
import {
  FaPhotoVideo,
  FaQuestion,
  FaStreetView,
  FaStroopwafel,
} from "react-icons/fa";
import { TbZodiacVirgo } from "react-icons/tb";
import { RiCustomerServiceLine } from "react-icons/ri";
import { Md5G, MdGTranslate } from "react-icons/md";
import { FaMessage } from "react-icons/fa6";

export const sidebarItems = [
  {
    name: "Home",
    icon: FiHome,
    path: "", // Empty string for root dashboard path
  },
  {
    name: "User Management",
    icon: FiUsers,
    path: "user-management",
  },
  {
    name: "Astro Management",
    icon: FiStar,
    path: "astro-management",
  },
  {
    name: "Blog Management",
    icon: ImBlog,
    path: "blog-management",
  },
  {
    name: "Panchang Form",
    icon: FaStroopwafel,
    path: "panchang-form",
  },
  {
    name: "Zodiac Addition",
    icon: TbZodiacVirgo,
    path: "zodiac-addition",
  },
  {
    name: "Service Management",
    icon: RiCustomerServiceLine,
    path: "service-management",
  },
  {
    name: "Question Management",
    icon: FaQuestion,
    path: "question-management",
  },
  {
    name: "Carousel Management",
    icon: FaPhotoVideo,
    path: "carousel-management",
  },
  {
    name: "Testimonial Management",
    icon: FaStreetView,
    path: "testimonial-management",
  },
  {
    name: "Translator Management",
    icon: MdGTranslate,
    path: "translator-management",
  },
  {
    name: "Translator Chat Management",
    icon: FaMessage,
    path: "translator-chat-management",
  },
  {
    name: "Astro Chat Management",
    icon: FaMessage,
    path: "astro-chat-management",
  },
];
