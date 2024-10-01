import { useAuthStore } from "@/store/Auth";


type RoleChecker = () => boolean;

interface UseRoleReturn {
  isAdmin: RoleChecker;
  isTranslator: RoleChecker;
  isUser: RoleChecker;
  isAstrologer: RoleChecker;
  hasRole: (role: string) => boolean;
}

export const useRole = (): UseRoleReturn => {
  const roles = useAuthStore(state => state.roles);

  const hasRole = (role: string): boolean => roles.includes(role);

  return {
    isAdmin: () => hasRole('admin'),
    isTranslator: () => hasRole('translator'),
    isUser: () => hasRole('user'),
    isAstrologer: () => hasRole('astrologer'),
    hasRole,
  };
};

/*
const MyComponent = () => {
  const { isAdmin, isTranslator, isUser, isAstrologer, hasRole } = useRole();

  return (
    <div>
      {isAdmin() && <AdminPanel />}
      {isTranslator() && <TranslatorTools />}
      {isUser() && <UserDashboard />}
      {isAstrologer() && <AstrologerConsole />}
      {hasRole('moderator') && <ModeratorControls />}
    </div>
  );
};

*/