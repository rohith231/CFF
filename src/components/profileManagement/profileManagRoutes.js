import EditProfile from "./tabs/EditProfile";
import Profile from "./tabs/Profile";


export const profileManagRoutes=[
    
        {
            path: "/user-profile",
            name: "User Profile",
            icon: "ni ni-single-02 text-yellow",
            component: Profile,
            layout: "/admin/profile-management",
          },
          {
            path: "/edit-profile",
            name: "Edit Profile",
            icon: "ni ni-ruler-pencil text-info",
            component: EditProfile,
            layout: "/admin/profile-management",
          },
    
]