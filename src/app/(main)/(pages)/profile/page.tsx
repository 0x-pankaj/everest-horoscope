import Profile from "@/components/Profile";

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <Profile />
    </div>
  );
};

export default ProfilePage;