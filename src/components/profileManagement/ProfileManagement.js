import React from 'react'
import { profileManagRoutes } from './profileManagRoutes'


import CommonManagement from 'views/CommonManagement'

const ProfileManagement = () => {
  return (
    <CommonManagement routes={profileManagRoutes} defaultRoute={'/admin/profile-management/user-profile'}/>
  )
}

export default ProfileManagement
