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


export const Registration = ({
  userName,
  password,
  firstName,
  lastName,
  email,
  phone
}) => {
  const data = {
    'userName': userName,
    'password': password,
    'firstName': firstName,
    'lastName': lastName,
    'email': email,
    'phone': phone
  };

  return axios.request({
    url:'/admin/userRegistration',
    method: 'post',
    data: data
  });
};