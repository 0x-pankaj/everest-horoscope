import { FiHome, FiUsers, FiStar } from 'react-icons/fi'
import { ImBlog } from "react-icons/im";

import Home from "../components/Home"; 
import UserManagement from '../components/UserManagement';
import AstroManagement from "../components/AstroManagement";
import BlogManagement from "../components/BlogManagement";

export const sidebarItems = [
  { name: 'Home', icon: FiHome, component: Home },
  { name: 'User Management', icon: FiUsers, component: UserManagement },
  { name: 'Astro Management', icon: FiStar, component: AstroManagement },
  { name: 'Blog Managemet', icon: ImBlog, component: BlogManagement }
]