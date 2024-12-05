// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
// import { Users, Star, BookOpen, Calendar } from 'lucide-react'

// const data = [
//   { name: 'Jan', users: 400, consultations: 240 },
//   { name: 'Feb', users: 300, consultations: 139 },
//   { name: 'Mar', users: 200, consultations: 980 },
//   { name: 'Apr', users: 278, consultations: 390 },
//   { name: 'May', users: 189, consultations: 480 },
// ]

// const statsCards = [
//   {
//     title: "Total Users",
//     value: "1,234",
//     description: "↗️ 12% from last month",
//     icon: Users
//   },
//   {
//     title: "Active Astrologers",
//     value: "45",
//     description: "↗️ 4 new this month",
//     icon: Star
//   },
//   {
//     title: "Blog Posts",
//     value: "89",
//     description: "↗️ 8 new posts",
//     icon: BookOpen
//   },
//   {
//     title: "Consultations",
//     value: "432",
//     description: "↗️ 24% increase",
//     icon: Calendar
//   }
// ]

// export default function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-semibold mb-2">Dashboard Overview</h1>
//         <p className="text-gray-500">Welcome to your admin dashboard</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {statsCards.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 {stat.title}
//               </CardTitle>
//               <stat.icon className="h-4 w-4 text-gray-500" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <p className="text-xs text-gray-500">{stat.description}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>User Growth</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={data}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line 
//                     type="monotone" 
//                     dataKey="users" 
//                     stroke="#8884d8" 
//                     name="Users"
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="consultations" 
//                     stroke="#82ca9d" 
//                     name="Consultations"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activities</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {[
//                 "New astrologer registration: John Doe",
//                 "Blog post published: 'Understanding Your Moon Sign'",
//                 "New service added: 'Vedic Consultation'",
//                 "User feedback received: 5★ rating",
//                 "New zodiac predictions updated"
//               ].map((activity, i) => (
//                 <div key={i} className="flex items-center space-x-4">
//                   <div className="h-2 w-2 bg-blue-500 rounded-full" />
//                   <p className="text-sm text-gray-600">{activity}</p>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

export default function DashboardHome() {
  return (
    <div>
      Home
    </div>
  )
}