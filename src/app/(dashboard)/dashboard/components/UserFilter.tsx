// // src/components/UserManagement/UserFilters.tsx
// 'use client'
// import React from 'react';
// import { UserFilters } from '@/types/user';

// interface UserFiltersProps {
//   filters: UserFilters;
//   onFilterChange: (filters: UserFilters) => void;
// }

// const UserFilters: React.FC<UserFiltersProps> = ({ filters, onFilterChange }) => {
//   const handleLabelChange = (label: string) => {
//     const newLabels = filters.labels?.includes(label)
//       ? filters.labels.filter((l) => l !== label)
//       : [...(filters.labels || []), label];
//     onFilterChange({ ...filters, labels: newLabels });
//   };

//   return (
//     <div className="mb-4">
//       <h3 className="text-lg font-semibold mb-2">Filter Users</h3>
//       <div>
//         <label className="mr-2">Labels:</label>
//         {['admin', 'astro', 'user', 'translator'].map((label) => (
//           <label key={label} className="mr-2">
//             <input
//               type="checkbox"
//               checked={filters.labels?.includes(label) || false}
//               onChange={() => handleLabelChange(label)}
//               className="mr-1"
//             />
//             {label}
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserFilters;

export default function UserFilters() {
  return (
    <div>
      Usrfltr
    </div>
  )
}