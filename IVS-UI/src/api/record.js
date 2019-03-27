import axios from "@/api/httpRequest.js";

export const GetRecords = () => {
    return axios.request({
        url: "/Record",
        method: "get"
    });
};

export const CreateRecord = ({
    recordId,
    createTime,
    qualification,
    workExperience,
    workSkills
}) => {
    const data = {
        "recordId": recordId,
        "createTime": createTime,
        "qualification": qualification,
        "workExperience": workExperience,
        "workSkills": workSkills

    };

    return axios.request({
        url: "/Record",
        method: "post",
        data
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