import axios from "./axios_init";

// 文案文本
export const uploadFile = (data) => {
  return axios.request({
    url: "/gpt/Upload",
    method: "post",
    data: data,
  });
};

// 登录
export const login = (data) => {
  const token = localStorage.getItem("userToken");
  console.log(token);
  return axios.request({
    url: "/gpt/Login",
    method: "post",
    data: data,
    headers: {
      "access-token": token,
    },
  });
};
// 注册
export const register = (data) => {
  return axios.request({
    url: "/gpt/Register",
    method: "post",
    data: data,
  });
};
// 游客剩余体验此处接口
export const ResiduaVisitorExperience = (data) => {
  return axios.request({
    url: "/gpt/getUsageCount",
    method: "post",
    data: data,
  });
};

// 发送信息
export const chat = (data) => {
  console.log("发送参数", data);
  const token = localStorage.getItem("userToken");
  return axios.request({
    url: "/gpt/sendQuest",
    method: "post",
    data: data,
    headers: {
      "access-token": token,
    },
  });
};

// 获取聊天内容
export const getmsg = (data) => {
  const token = localStorage.getItem("userToken");
  return axios.request({
    url: "/gpt/getHistoryDialog",
    method: "post",
    data: data,
    headers: {
      "access-token": token,
    },
  });
};
// 创建会话列表
export const createsession = (data) => {
  const token = localStorage.getItem("userToken");
  return axios.request({
    url: "/gpt/createSessionID",
    method: "post",
    data: data,
    headers: {
      "access-token": token,
    },
  });
};

// 获取会话列表
export const getSessionIds = (data) => {
  const token = localStorage.getItem("userToken");
  return axios.request({
    url: "/gpt/getSessionID",
    method: "post",
    data: data,
    headers: {
      "access-token": token,
    },
  });
};

// 删除会话
export const delSession = (data) => {
  const token = localStorage.getItem("userToken");
  return axios.request({
    url: "/gpt/delUserSession",
    method: "post",
    data: data,
    headers: {
      "access-token": token,
    },
  });
};
// 修改会话标题
export const editorTitle = (data) => {
  console.log("测试触发接口", data);
  const token = localStorage.getItem("userToken");
  return axios.request({
    url: "/gpt/updateTitle",
    method: "post",
    data: data,
    headers: {
      "access-token": token,
    },
  });
};

// mock.test
export const mocktest = (data) => {
  return axios.request({
    url: "/home/getData",
    method: "post",
    data: data,
  });
};
