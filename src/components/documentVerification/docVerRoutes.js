import FileManager from "./tabs/fileManager/FileManager";

export const docVerRoutes = [
  {
    path: "/fManager",
    name: "File Manager",
    icon: "fas fa-file",
    component: FileManager,
    layout: "/admin/document-verification",
  },
];
