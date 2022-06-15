const imageForRole = () => {
  let roleId = localStorage.getItem("role_id");
  if (roleId === "2") {
    return require("assets/img/theme/admin.jpg").default;
  } else if (roleId === "3") {
    return require("assets/img/theme/super-admin.jpg").default;
  } else {
    return require("assets/img/theme/dashboard-user.jpg").default;
  }
};

export default imageForRole;
