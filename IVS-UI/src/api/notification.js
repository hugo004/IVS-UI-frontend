import axios from "@/api/httpRequest.js";

export const GetAccessRequestList = (status='ALL') => {
  const param = {
    status: status
  };

  return axios.request({
    url: '/GetAccessRequestList',
    method: 'get',
    param: param
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