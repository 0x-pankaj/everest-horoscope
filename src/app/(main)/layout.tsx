
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingChatButton from '@/components/FloatingChatButton';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <FloatingChatButton />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}