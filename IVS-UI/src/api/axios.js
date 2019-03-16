import axios from "axios";


class HttpRequest
{
    constructor() {}
    
    config()
    {
        return {
            baseURL: "http://localhost:3000/api",
            timeout: 20000,
            headers:{}
        }
    }

    interceptors(instance)
    {
        instance.interceptors.request.use(
            config => {
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        instance.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                return Promise.reject(error);
            }
        );
    }

    request(option)
    {
        option = Object.assign(this.config(), option);
        
        const instance = axios.create(option);
        this.interceptors(instance);

        console.log(option)

        return instance(option);

    }

}

export default HttpRequest;
