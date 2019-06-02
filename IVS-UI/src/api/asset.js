import axios from "@/api/httpRequest.js";

export const GetAccessRequestList = (status='ALL') => {
  const param = {
    status: status
  };

  return axios.request({
    url: '/GetAccessRequestList',
    method: 'get',
    params: param
  });
}

export const GetSentRequestList = () => {
  return axios.request({
    url: '/GetSentRequestList',
    method: 'get'
  });
}

export const UpdateRequestStatus = ({
  requestId,
  newStatus,
  senderId,
  assetName,
  authorizeList
}) => {
  const data = {
    'requestId': requestId,
    'newStatus': newStatus,
    'senderId': senderId,
    'assetName': assetName,
    'authorizeList': authorizeList
  };

  return axios.request({
    url: '/UpdateRequestStatus',
    method: 'put',
    data: data
  });
}

export const GetAllRegistryAsset = () => {
  return axios.request({
    url: '/admin/getAllRegistryAsset',
    method: 'get'
  });
}

export const GetAsset = ({
  assetName,
  assetIds
}) => {
  const params = {
    assetName: assetName,
    assetIds: assetIds
  };

  return axios.request({
    url: '/getAsset',
    method: 'get',
    params: params
  });
}