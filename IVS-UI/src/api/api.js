import axiso from "@/api/httpRequest.js";

export const GetUsers = () => {
    return axiso.request({
        url: '/User',
        method: "get"
    });
}