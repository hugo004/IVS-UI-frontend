// import axios from "@/api/httpRequest.js";
import axios from "axios"

export const GetRecords = () => {
    return axios.request({
        url: "/Record",
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


return axios({
    method: 'post',
    url: 'http://localhost:3000/api/Record',
    data: data
  });

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