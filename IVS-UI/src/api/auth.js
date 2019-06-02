import axios from "@/api/httpRequest.js";

export const LoginIVS = ({
  userName,
  password
}) => {
  const data =  {
    "userName": userName,
    "password": password
  }
    return axios.request({
        url: "/login",
        method: "post",
        data: data
    });
};


export const LogoutIVS = () => {
  return axios.request({
    url: '/logout',
    method: 'post'
  });
};