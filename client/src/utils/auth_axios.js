import Axios from "axios";

const auth_axios = Axios.create();

function refreshToken(auth_axios) {
  auth_axios.defaults.headers.common = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}
export default auth_axios;
