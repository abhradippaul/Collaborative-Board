import { create } from "zustand";

interface CreateOrganizationStore {
  isCreateOrganizationOpen: boolean;
  closeCreateOrganization: () => void;
  openCreateOrganization: () => void;
  toggleCreateOrganization: () => void;
}

export const useCreateOrganizationStore = create<CreateOrganizationStore>(
  (set) => ({
    isCreateOrganizationOpen: false,
    closeCreateOrganization: () => {
      set({ isCreateOrganizationOpen: false });
    },
    openCreateOrganization: () => {
      set({ isCreateOrganizationOpen: true });
    },
    toggleCreateOrganization: () => {
      set((state) => ({
        isCreateOrganizationOpen: !state.isCreateOrganizationOpen,
      }));
    },
  })
);
