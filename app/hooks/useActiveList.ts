import { create } from "zustand";

interface activeListStore {
  members: string[]
  add: (id: string) => void
  remove: (id: string) => void
  set: (ids: string[]) => void
}

const useActiveList = create<activeListStore>((set) => ({
  members: [],
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  remove: (id) => set((state) => ({ members: state.members.filter((el) => el !== id) })),
  set: (ids) => set({ members: ids })
}
));

export default useActiveList;
