import toast from "react-hot-toast";

export const notify = {
  success: (message: string) =>
    toast.success(message, { duration: 4000 }),

  error: (message: string) =>
    toast.error(message, { duration: 5000 }),

  warning: (message: string) =>
    toast(message, {
      duration: 4000,
      icon: "⚠️",
      style: {
        borderLeft: "4px solid #c5a059",
      },
    }),

  info: (message: string) =>
    toast(message, { duration: 4000 }),
};
