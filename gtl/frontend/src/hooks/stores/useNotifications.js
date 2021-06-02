import create from 'zustand';

const useNotification = create((set) => ({
  notification: null,
  setNotification: (notification) =>
    set((state) => ({
      ...state,
      notification,
    })),
}));

export { useNotification };
