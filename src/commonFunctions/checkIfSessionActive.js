import history from "./history";

const checkIfSessionActive = (res) => {
  if (res.data) {
    if (res.data.sessionExp) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role_id");
      localStorage.removeItem("avatar");
      localStorage.removeItem("client_id");
      // esriId.destroyCredentials();
      history.push("/auth/login");

      return res;
    } else {
      return res;
    }
  }
};

export default checkIfSessionActive;
