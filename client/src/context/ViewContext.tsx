import { createContext, useContext, useState, ReactNode } from "react";
import { MemberDto } from "@/types/user";

export type MainView =
  | "discover"
  | "chat"
  | "detail"
  | "editProfile"
  | "managePhotos";

interface ViewContextType {
  mainView: MainView;
  setMainView: (view: MainView) => void;
  selectedUser: MemberDto | null;
  setSelectedUser: (user: MemberDto | null) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [mainView, setMainView] = useState<MainView>("discover");
  const [selectedUser, setSelectedUser] = useState<MemberDto | null>(null);

  return (
    <ViewContext.Provider
      value={{ mainView, setMainView, selectedUser, setSelectedUser }}
    >
      {children}
    </ViewContext.Provider>
  );
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};
