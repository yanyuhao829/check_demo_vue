import axios from "axios";
import qs from "qs";
// import store from "../store/index";
var instance = axios.create({
  baseURL: "http://localhost:5000",
});
// 拦截器  请求之前做点啥
instance.interceptors.request.use(
  (config) => {
    // 判断store是否有token 有就加入请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//登录
export const userLogin = (params) => {
  return instance.post("/user/login", qs.stringify(params));
};
//注册
export const userRegister = (params) => {
  return instance.post("/user/register", qs.stringify(params));
};
//新增
export const add_student_list = (params) => {
  return instance.post("/item/add_student_list", qs.stringify(params));
};
//删除
export const del_student_list = (params) => {
  return instance.post("/item/del_student_list", qs.stringify(params));
};
//编辑
export const edit_student_list = (params) => {
  return instance.post("/item/edit_student_list", qs.stringify(params));
};
//查询
export const search_student_list = (params) => {
  return instance.post("/item/search_student_list", qs.stringify(params));
};
// 列表
export const student_list = (params) => {
  return instance.get("/item/student_list", { params });
};
