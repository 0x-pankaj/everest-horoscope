import React from 'react';
import AdminCarouselManager from './AdminCarouselManager';


const AdminCarouselPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin: Carousel Management</h1>
      <AdminCarouselManager />
    </div>
  );
};

export default AdminCarouselPage;