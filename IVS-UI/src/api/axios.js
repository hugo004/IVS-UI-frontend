import axios from "axios";
import qs from "qs";


class HttpRequest
{
    constructor() {}
    
    config()
    {
        return {
          baseURL: "http://localhost:8081/api",
          timeout: 30000,
          headers:{
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
    }

    errorHandle(error) {
        const statusModel = {
          400: "錯誤請求",
          401: "未授權，請重新登錄",
          403: "拒絕訪問",
          404: "請求錯誤,未找到該資源",
          405: "請求方法未允許",
          408: "請求超時",
          500: "服務器端出錯",
          501: "網絡未實現",
          502: "網絡錯誤",
          503: "服務不可用",
          504: "網絡超時",
          505: "http版本不支持該請求",
          default: "連接錯誤",
          other: "連接到服務器失敗"
        };
    
        if (error && error.response) {
          switch (error.response.status) {
            case 400:
              break;
            case 401:
              localStorage.clear();
              location.href = '/';
              break;
            case 403:
              break;
            case 404:
              break;
            case 405:
              break;
            case 408:
              break;
            case 500:
              break;
            case 501:
              break;
            case 502:
              break;
            case 503:
              break;
            case 504:
              break;
            case 505:
              break;
            default:
          }
        }
    
        return Promise.reject(error);
      }

    optionConfig(options) 
    {
        options.data = options.data || {};
        options.params = options.params || {};
    

        if (options.method === "post" || options.method === "put") {
    
          // post,put請求需要將傳遞的數據掛載在data項上
          // 後台需要傳遞參數urlcode化/參數序列化時,使用qs
          // options.data = qs.stringify(options.data)
    
        } else {
          // get等請求的數據掛在params項上,當然params項上也可以掛post等請求的參數,
          // 但是不嚴謹,且參數拼接到地址欄上也不安全,有長度限制
          // options.params = options.data;
        }
    
        return options;
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
                return response.data.result;
            }, this.errorHandle);
    }

    request(option)
    {
        option = Object.assign(this.config(), option);

        if (localStorage.getItem("token"))
        {
            option.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
        }

        const instance = axios.create();
        this.interceptors(instance);

        
        return instance(option);

    }

}

export default HttpRequest;
