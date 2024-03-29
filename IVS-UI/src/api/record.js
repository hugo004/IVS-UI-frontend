import axios from "@/api/httpRequest.js";
import myAxios from "axios"

export const GetRecords = () => {
    return axios.request({
        url: "/getVerifyRecord",
        method: "get"
    });
};

export const CreateRecord = ({
    user,
    recordId,
    createTime,
    educations,
    workExps,
    workSkills
}) => {

    const data = {
        "user": user,
        "recordId": recordId,
        "createTime": createTime,
        "educations": educations,
        "workExps": workExps,
        "workSkills": workSkills

    };


    return axios.request({
        url: '/Record',
        method: 'post',
        data,
    })
};

export const UpdateRecord = (id, {
    "createTime": createTime,
    "qualification": qualification,
    "workExperience": workExperience,
    "workSkills": workSkills
}) => {

    const data = {
        "createTime": createTime,
        "qualification": qualification,
        "workExperience": workExperience,
        "workSkills": workSkills
    };

    const params = {
        "recordId": id
    }

    return axios.request({
        url: "/Record",
        method: "put",
        params,
        data
    });
};

export const DeleteRecord = (id) => {
    const params = {
        "recordId": id
    };

    return axios.request({
        url: "/Record",
        method: "delete",
        params
    });
}


export const UploadRecord = (files, recordType, verifier) => {

    let formData = new FormData();
    formData.append('recordType', recordType);
    formData.append('relateVerifier', verifier);
    for(let i = 0; i < files.length; i++) {
        console.log(files[i])
      formData.append('records', files[i]);
    }
    

    return axios.uploadFile('UploadRecordFiles', formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

}

export const VerifyRecord = ({
    isVerify,
    recordId,
    recordName,
    ownerId,
    ownerName
}) => {
    const data = {
        isVerify: isVerify,
        recordId: recordId,
        recordName: recordName,
        ownerId: ownerId,
        ownerName: ownerName
    };

    return axios.request({
        url: '/verifyRecord',
        method: 'put',
        data: data
    });
}

export const GetVerifierList = (verifierType) => {
    const params = {
        verifierType: verifierType
    };

    return axios.request({
        url: '/getVerifierList',
        method: 'get',
        params: params
    });
}