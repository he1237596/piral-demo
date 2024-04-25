import axios from "axios";

const request = axios.create({
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  // 其他配置项...


})

export default request;