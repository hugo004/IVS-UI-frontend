import axios from "@/api/httpRequest.js";

export const GetUserChannel = () => {
  return axios.request({
    url: '/getUserChannel',
    method: 'get'
  });
};

export const CreateChannel = ({
  name,
  members
}) => {
  const data = {
    'name': name,
    'members': members
  };

  return axios.request({
    url: '/admin/createChannel',
    method: 'post',
    data: data
  });
}
