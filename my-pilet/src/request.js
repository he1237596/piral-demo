import axios from "axios";
import { host, prefix} from "./config";
async function request(url, options) {
  const defaults = {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "pv-token": localStorage.getItem('token')
    }
  }
  try {
    const response = await axios({
      url: host + prefix + url,
      ...defaults,
      ...options
    });;
    console.log(response);
    if (response.status !== 200) {
      console.error("NETWORK ERROR:", response);
      throw response;
    }
    if (response.data.code !== 200) {
      console.error("Error fetching data:", response);
      // 异常状态码处理
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
/*     {
      "message": "Network Error",
      "name": "AxiosError",
      "stack": "AxiosError: Network Error\n    at XMLHttpRequest.handleError (http://localhost:1234/$pilet-api/0/a2d6c2e9.js:42833:14)\n    at Axios.request (http://localhost:1234/$pilet-api/0/a2d6c2e9.js:43319:41)",
      "config": {
         ...CornerstoneElement.
      },
      "code": "ERR_NETWORK",
      "status": null
  } */
    return null;
  }
}

export default request;