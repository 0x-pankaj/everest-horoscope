import { FiHome, FiUsers, FiStar } from 'react-icons/fi'
import { ImBlog } from "react-icons/im";
import { FaPhotoVideo, FaQuestion, FaStroopwafel } from "react-icons/fa";
import { TbZodiacVirgo } from "react-icons/tb";
import { RiCustomerServiceLine } from "react-icons/ri";


import Home from "../components/Home";
import AstroManagement from "../components/AstroManagement";
import BlogManagement from "../components/BlogManagement";
import AdminPanchangForm from '../components/AdminPanchangForm';
import SubmitHoroscope from '../components/Zodiac';
import UserManagementPage from '../components/UserManagementPage';
import ServicesManagement from '../components/ServiceManagmet';
import AdminQuestionsComponent from '../components/QuestionManagement';
import AdminCarouselPage from '../components/AdminCrouselPage';


export const sidebarItems = [
  { name: 'Home', icon: FiHome, component: Home },
  { name: 'User Management', icon: FiUsers, component: UserManagementPage },
  { name: 'Astro Management', icon: FiStar, component: AstroManagement },
  { name: 'Blog Managemet', icon: ImBlog, component: BlogManagement },
  { name:  "Panchang Form", icon: FaStroopwafel , component: AdminPanchangForm},
  { name: "Zodiac Addition", icon: TbZodiacVirgo, component: SubmitHoroscope },
  { name: "Service Management", icon: RiCustomerServiceLine, component: ServicesManagement},
  { name: "Question Management", icon: FaQuestion, component: AdminQuestionsComponent},
  { name: "Crousel Management", icon: FaPhotoVideo , component: AdminCarouselPage}
]