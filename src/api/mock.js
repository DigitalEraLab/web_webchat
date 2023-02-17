// src/api/mock.js
import Mock from "mockjs";
import homeApi from "./mockData/home";
// 拦截请求
Mock.mock("http://localhost:8080/home/getData", homeApi.getHomeData);
