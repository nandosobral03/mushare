import { create } from "zustand";
import { useSession } from "./useSession";

interface SignUpModalStore {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const useSignUpModalStore = create<SignUpModalStore>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
}));

export const useSignUpModal = () => {
  const { isOpen, setIsOpen } = useSignUpModalStore();
  const { isAuthenticated } = useSession();

  const showSignUpModalIfNeeded = () => {
    if (!isAuthenticated) {
      setIsOpen(true);
      return true;
    }
    return false;
  };

  return {
    isOpen,
    onClose: () => setIsOpen(false),
    showSignUpModalIfNeeded,
  };
};
