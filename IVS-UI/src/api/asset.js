import axios from "@/api/httpRequest.js";
import qs from "qs";

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
  const assets = new URLSearchParams();
  assets.append('assetName', assetName);
  assetIds.forEach(id => {
    assets.append('assetIds', id);
  });

  const params = assets;

  return axios.request({
    url: '/getAsset',
    method: 'get',
    params: params
  });
}

export const RequestAccessAsset = ({
  receiverId,
  receiverName,
  eventName,
  remarks,
  assetId,
  assetName
}) => {
  const data = {
    receiverId: receiverId,
    receiverName: receiverName,
    eventName: eventName,
    remarks: remarks,
    assetId: assetId,
    assetName: assetName
  };

  return axios.request({
    url: '/requestAccessAsset',
    method: 'post',
    data: data
  });
}

export const GetChannelMemberAssets = (memberIds) => {

  //get with array param
  const params = new URLSearchParams();
  memberIds.forEach(id => {
    params.append('memberIds', id);
  });

  return axios.request({
    url: '/admin/getChannelMembersAssets',
    method: 'get',
    params: params
  });
}

export const SendChannelInvitation = ({
  channelId,
  newMemberIds,
  remarks
}) => {

  const data = {
    'channelId': channelId,
    'newMembers': newMemberIds,
    'remarks': remarks
  };

  return axios.request({
    url: '/admin/sendChannelInvitation',
    method: 'post',
    data: data
  });
}

export const UpdateChannelInvitationStatus = ({
  channelId,
  requestId,
  status
}) => {

  const data = {
    'channelId': channelId,
    'requestId': requestId,
    'status': status
  };

  return axios.request({
    url: '/admin/updateChannelInvitationStatus',
    method: 'put',
    data: data
  });
}

export const ExitChannel = (channelId) => {
  
  const data = {
    'channelId': channelId
  };

  return axios.request({
    url: '/admin/exitChannel',
    method: 'put',
    data: data
  });
}


export const RevokeAccessAsset = ({
  assetName,
  assetIds,
  revokeUser,
  requestId
}) => {
  const data = {
    'assetName': assetName,
    'assetIds': assetIds,
    'revokeUser': revokeUser,
    'requestId': requestId
  };

  return axios.request({
    url: '/revokeAccessAsset',
    method: 'post',
    data: data
  });
}


export const UploadAsset = ({
  educations,
  workExps,
  volunteerRecords
}) => {
  const data = {
    'educations': educations,
    'workExps': workExps,
    'volunteerRecords': volunteerRecords
  };

  return axios.request({
    url: '/uploadRecord',
    method: 'post',
    data: data
  });
}

export const GetHistoryData = () => {
  return axios.request({
    url: '/getHistory',
    method: 'get'
  });
}