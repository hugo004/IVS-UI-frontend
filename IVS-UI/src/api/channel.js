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
    url: '/createChannel',
    method: 'post',
    data: data
  });
}


export const UploadChannelAsset = ({
  channelId,
  files
}) => {

  console.log(files);
  let formData = new FormData();
  formData.append('channelId', channelId);

  for(let i = 0; i < files.length; i++) {
      console.log(files[i])
    formData.append('records', files[i]);
  }
  

  return axios.uploadFile(
    '/admin/UploadChannelAsset', 
    formData,{
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  });
}

export const GetChannelAssets = (channelId) => {

  const params = {
    'channelId': channelId
  };

  return axios.request({
    url: '/admin/GetChannelAssets',
    method: 'get',
    params: params
  });
}