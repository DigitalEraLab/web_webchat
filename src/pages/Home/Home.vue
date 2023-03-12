<template>
  <div class="common-layout">
    <!-- 登录注册弹出框 -->
    <el-dialog
      v-model="isToLogin"
      title="欢迎使用智慧聊天系统"
      @closed="closeDialog(ruleFormRef)"
      style="width: 30%"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="7.5rem"
        class="demo-ruleForm"
        v-loading="loading"
        :label-position="labelPosition"
      >
        <el-form-item label="用户名" prop="name" style="width: 90%">
          <el-input v-model.number="ruleForm.name" />
        </el-form-item>
        <el-form-item label="密码" prop="pass" style="width: 90%">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            autocomplete="off"
            show-password="true"
          />
        </el-form-item>
        <el-form-item
          label="再次输入密码"
          prop="checkPass"
          v-if="isToLogin_1 == '注册'"
          style="width: 90%"
        >
          <el-input
            v-model="ruleForm.checkPass"
            type="password"
            autocomplete="off"
            show-password="true"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm(ruleFormRef)">清空</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 登录注册弹出框 -->

    <!-- 其它提示 -->
    <el-dialog
      center
      v-model="dialogVisible"
      :title="PopUpPrompt.title"
      width="30%"
    >
      <span class="PopUpPrompt">{{ PopUpPrompt.content }}</span>
      <el-input
        v-model="newSessionTitle"
        maxlength="10"
        placeholder="请输入新的标题"
        show-word-limit
        type="text"
        v-if="iseditorTitle"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogSubmit(PopUpPrompt)">
            {{ PopUpPrompt.button }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 其它提示 -->

    <el-container>
      <el-container class="Content">
        <el-header class="Header">
          <div class="logo">
            <img src="./image/chatLogo.png" alt="" />
          </div>
          <div></div>
          <div class="Occupy space"></div>
        </el-header>
        <div class="Main">
          <el-scrollbar
            class="el-scrollbar"
            v-loading="msgLoading"
            ref="scrollbarRef"
          >
            <div
              v-for="(item, index) in chatmsg"
              :key="item"
              :class="index % 2 != 0 ? 'request' : ''"
              class="scrollbar-demo-item"
            >
              <!-- {{ index % 2 != 0 && isLoading ? "...." : "" }} -->

              <div class="image" v-if="index % 2 != 0">
                <img src="./image/robot.png" alt="" />
              </div>

              <div
                class="loading"
                v-if="
                  index % 2 != 0 && isLoading && index == chatmsg.length - 1
                "
              >
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>

              <div class="msg">
                <!-- {{ index % 2 == 0 ? "问题:" : "" }}  -->
                {{ item }}
              </div>
              <div class="image" v-if="index % 2 == 0">
                <img src="./image/visitor.png" alt="" v-if="!islogin" />
                <img
                  class="user"
                  src="./image/user.jpg"
                  alt=""
                  v-if="islogin"
                />
              </div>
            </div>
          </el-scrollbar>

          <el-footer class="Footer">
            <div id="warpper">
              <div id="app-warpper">
                <div id="drag"></div>
                <div class="content">
                  <textarea
                    v-model="textarea2"
                    placeholder="请输入您的问题"
                    class="content_msg"
                  ></textarea>
                </div>
              </div>
              <el-button
                :disabled="isLoading"
                v-loading="loading"
                @click="sendmsg"
                class="SendLogo"
                >发送</el-button
              >
            </div>
          </el-footer>
        </div>
      </el-container>
      <el-aside class="Aside">
        <div class="title" v-if="islogin">
          <div
            class="HeadPicture"
            @mouseenter="shouUserInfo"
            @mouseleave="hideUserinfo"
          >
            <img src="./image/user.jpg" alt="" class="user" />
            <div class="Vip">
              <img src="./image/novip.png" alt="" class="vip" v-if="!isvip" />
              <img src="./image/vip.png" alt="" class="vip" v-if="isvip" />
            </div>
          </div>
          <div class="vipinfo" v-if="isvip" style="color: white">
            会员:2023.1.1-2099.1.1
            <div class="topUp">
              <!-- <div class="renewal" v-if="isvip">续费套餐</div> -->
            </div>
          </div>
          <div class="logout" @click="logout">退出</div>

          <div class="open" v-if="!isvip" style="color: white">开通vip</div>
        </div>
        <div class="title" v-if="!islogin"></div>
        <div class="chatlist">
          <div class="nologin" v-if="!islogin">
            <div class="prompt">
              <div class="announcement">用户公告</div>
              <div class="an1">体验ChatGPT Plus</div>
              <!-- <div class="an2">未登录用户仅有5次查询机会!</div> -->
              <div class="line"></div>
              <div class="an3">
                ChatGPT Plus 与ChatGPT最大的区别在于让用户在多人使用 ChatGPT
                时也可有优先使用权，即使在高峰时段也能够正常使用比免费版本更快的回答响应时间优先使用最新功能和改进。
              </div>

              <div>
                <!-- 剩余体验次数 <span>{{ RemainingTimes }}</span> -->
                <span @click="toAssistant" class="toAssistant"
                  >前往文案提炼助手 ></span
                >
              </div>
            </div>
            <div class="bottom">
              <div class="nologin_button">
                <button type="warning" plain @click="dialogFormVisible('登录')">
                  登录
                </button>
                <button type="success" plain @click="dialogFormVisible('注册')">
                  注册
                </button>
              </div>
            </div>
          </div>
          <div class="islogin" v-if="islogin">
            <div class="lists">
              <div class="lists_item" @click="addsession">创建新的会话记录</div>
              <div v-loading="loading" class="fill_content">
                <div
                  class="lists_item"
                  :class="
                    chooseSessionS == i.sessionID ? 'lists_item_active' : ''
                  "
                  v-for="(i, index) in snum"
                  :key="i"
                  @click="chooseSession(i.sessionID, index)"
                >
                  {{ i.title }}
                  <div
                    class="editor"
                    v-if="chooseSessionS == i.sessionID"
                    @click="editor(i.sessionID)"
                  >
                    <img src="./image/editor.png" alt="" />
                  </div>
                  <div
                    class="del"
                    v-if="chooseSessionS == i.sessionID"
                    @click="del(i.sessionID)"
                  >
                    <img src="./image/del.png" alt="" />
                  </div>
                </div>
              </div>

              <div class="lists_item_bottom" v-if="!isvip">
                您还不是vip,剩余访问次数{{ RemainingTimes }}次数
              </div>
              <div v-if="isvip" class="lists_item_bottom">
                尊贵的vip,欢迎使用智慧聊天系统
              </div>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import {
  login,
  chat,
  getmsg,
  register,
  mocktest,
  createsession,
  getSessionIds,
  delSession,
  editorTitle,
  ResiduaVisitorExperience,
} from "@/api/Allrequest";
import FormInstance from "element-plus";
import FormRules from "element-plus";
// 表单数据
const ruleForm = reactive({
  pass: "",
  checkPass: "",
  name: "",
});
// 弹出提示的内容

const PopUpPrompt = reactive({
  title: "",
  content: "",
  button: "",
});
// 表单内容
const form = reactive({
  userName: "",
  password: "",
  passwordagain: "",
  type: [],
});
// 文本消息内容
const textarea2 = ref("");
// 右侧会话列表
const snum = reactive([]);
// 弹出提示框的boolean
const dialogVisible = ref(false);
// 注册登录的loading
const loading = ref(false);
// 发送消息之后等待消息的loading
const isLoading = ref(false);
// 选择会话列表之后，消息内容的loading
const msgLoading = ref(false);
// 是否登录
const islogin = ref(false);
// 聊天内容
const chatmsg = ref([]);
// 聊天内容全部--新格式

const newchatMsg = ref([]);

// 是否是vip
const isvip = ref(false);
// 登录注册的弹出框
const isToLogin = ref(false);
// 按钮是登录或者是注册
const isToLogin_1 = ref("");
// dialog取消
const Cancel = () => {
  isToLogin.value = false;
};
// 当前选择的session会话
const chooseSessionS = ref(0);
// 当前选择的session会话下表
const chooseSessionB = ref(0);
// 剩余访问次数
const RemainingTimes = ref(0);
// 是否修改标题
const iseditorTitle = ref(false);
// 新的表单title
const newSessionTitle = ref("");

// 弹出框 布局
const labelPosition = ref("top");
// 会话列表的sessionid
const sessionid = ref("");

// 鼠标是否移动到头像上

const isHoverUser = ref(false);

// 获取信息dom
const scrollbarRef = ref();

// 前往文案助手

const toAssistant = () => {
  window.open("http://test.totrygpt.com", "_blank");
};

//   定位到底部
const toBottom = () => {
  nextTick(() => {
    const height = document.querySelector(".el-scrollbar__view").scrollHeight;
    scrollbarRef.value.setScrollTop(height);
  });
};

// 显示用户信息

const shouUserInfo = () => {
  isHoverUser.value = true;
  console.log(isHoverUser.value);
};
const hideUserinfo = () => {
  isHoverUser.value = false;
  console.log(isHoverUser.value);
};

// 清空上一个用户所留下的所有信息
const clearBoth = () => {
  chooseSessionS.value = 0;
  chatmsg.value = null;
  snum.value = null;
  RemainingTimes.value = 0;
};
// 删除会话
const del = (e) => {
  iseditorTitle.value = false;
  dialogCustomize({ content: "确定要删除吗", button: "删除" });
};
// 编辑会话标题
const editor = (e) => {
  iseditorTitle.value = true;
  newSessionTitle.value = e.title;
  dialogCustomize({ title: "请输入标题", content: "", button: "修改" });
};

// 弹出框按钮下一步操纵
const dialogSubmit = (e) => {
  // 删除会话
  if (e.button == "删除") {
    delSession({ session_id: chooseSessionS.value }).then((res) => {
      chatmsg.value = null;
      dialogCustomize({ content: "删除成功" });
      snum.splice(chooseSessionB.value, 1);
    });
  }
  // 修改会话标题
  if (e.button == "修改" && iseditorTitle) {
    editorTitle({
      session_id: chooseSessionS.value,
      title: newSessionTitle.value,
    }).then((res) => {
      iseditorTitle.value = false;
      snum.splice(chooseSessionB.value, 1, {
        sessionId: chooseSessionS.value,
        title: newSessionTitle.value,
      });
    });
  }
  dialogVisible.value = false;
};

// 表单校验
const ruleFormRef = ref(FormInstance);
// 用户名
const checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入用户名"));
  }
  setTimeout(() => {
    if (value.toString().length < 5 || value.toString().length > 10) {
      callback(new Error("5~10个字符"));
    } else {
      callback();
    }
  }, 500);
};
// 密码
const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    const res1 = new RegExp(
      /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_.]+)$)^[\w~!@#$%^&*()_.]{8,16}$/
    );
    const res2 = res1.exec(value);
    if (res2) {
      console.log(1);
      callback();
    } else {
      callback(
        new Error(
          "密码应为字母，数字，特殊符号(~!@#$%^&*()_.)，两种及以上组合，8-16位字符串，如：xiao123456"
        )
      );
      console.log(2);
    }
  }
};
// 再次密码
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("不能为空"));
  } else if (value !== ruleForm.pass) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
};
// 自定义校验规则
const rules = reactive({
  pass: [{ validator: validatePass, trigger: "blur" }],
  checkPass: [{ validator: validatePass2, trigger: "blur" }],
  name: [{ validator: checkName, trigger: "blur" }],
});

// 注册登录
const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      // 用户登录
      if (isToLogin_1.value == "登录") {
        loading.value = true;
        login({
          username: ruleForm.name,
          password: ruleForm.pass,
        }).then((res) => {
          if (res.code != 403) {
            loading.value = false;
            localStorage.setItem("userToken", res.data.token);
            getSessionIdsFun();
            islogin.value = true;
            RemainingTimes.value = res.data.experienceTimes;
            // vip用户
            console.log("身份", res.data.identity);
            if (res.data.identity == 2) {
              isvip.value = true;
              localStorage.setItem("isvip", 2);
            }
            Cancel();
          } else {
            loading.value = false;
            // 提示 登录失败
            dialogCustomize({ content: res.msg });
          }
        });
      } else {
        // 用户注册
        register({
          username: ruleForm.name,
          password: ruleForm.pass,
          repassword: ruleForm.checkPass,
        }).then((res) => {
          // 注册成功之后进行登录
          if (res.code == 200) {
            loading.value = true;
            login({
              username: ruleForm.name,
              password: ruleForm.pass,
            }).then((res) => {
              if (res.code != 403) {
                loading.value = false;
                localStorage.setItem("userToken", res.data.token);
                getSessionIdsFun();
                islogin.value = true;
                RemainingTimes.value = res.data.experienceTimes;
                // vip用户
                console.log("身份", res.data.identity);
                if (res.data.identity == 2) {
                  isvip.value = true;
                  localStorage.setItem("isvip", 2);
                }
                Cancel();
              } else {
                loading.value = false;
                // 提示 登录失败
                dialogCustomize({ content: res.msg });
              }
            });
          } else {
            loading.value = false;
            // 提示
            dialogCustomize({ content: res.msg });
          }
        });
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
// 清空表单
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
// 表单校验

// 关闭注册登录的弹出框
const closeDialog = (formEl) => {
  resetForm(formEl);
};

// 退出登录
const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("isvip");
  islogin.value = false;
  location.reload();
  this.$router.go(0);
};

// 获取会话列表
const getSessionIdsFun = () => {
  // console.log("snum", snum.value);
  getSessionIds({
    index: 0, //获取从第0条开始的5条sessionID的数据
    size: 5,
  }).then((res) => {
    for (let i = 0; i < res.data.sessionList.length; i++) {
      snum.push(res.data.sessionList[i]);
    }
    loading.value = false;
  });
};

// 弹出框消息自定义

const dialogCustomize = (data) => {
  if (
    PopUpPrompt.content != "" ||
    PopUpPrompt.content != null ||
    PopUpPrompt.title != null ||
    PopUpPrompt.title != "" ||
    PopUpPrompt.title != null
  ) {
    PopUpPrompt.content = data.content;
    PopUpPrompt.title = data.title;
    PopUpPrompt.button = data.button;
  } else {
    PopUpPrompt.content = "";
    PopUpPrompt.title = "";
  }
  if (!data.button) {
    PopUpPrompt.button = "知道了";
  }

  dialogVisible.value = true;
};

// 清除输入框元素的高度
const clearInputHeight = async () => {
  await nextTick();
  const divOverlay = document.getElementById("app-warpper");
  const dargDom = document.getElementById("drag");
  divOverlay.style.top = "0rem";
  divOverlay.style.height = "3.75rem";
};

// 发送消息
const sendmsg = () => {
  const token = localStorage.getItem("userToken");
  // 检测输入框内容
  if (textarea2.value == "") {
    dialogCustomize({ content: "请输入文本信息" });
    return;
  } else {
    if (!token) {
      // 游客
      // chatmsg.value.push(textarea2.value);
      // chatmsg.value.push("");
      // isLoading.value = true;
      // toBottom();
      // chat({
      //   message: textarea2.value,
      //   sessionId: sessionid.value,
      // })
      //   .then((res) => {
      //     // 发送失败，再次发送
      //     console.log("消息", res);
      //     if (res.code == 500) {
      //       chatmsg.value.splice(
      //         chatmsg.value.length - 1,
      //         1,
      //         "发送失败,请重试"
      //       );
      //       isLoading.value = false;
      //       clearInputHeight();
      //       toBottom();
      //       return;
      //     } else {
      //       if (res.code == -1) {
      //         chatmsg.value.splice(chatmsg.value.length - 1, 1);
      //         chatmsg.value.splice(chatmsg.value.length - 1, 1);

      //         textarea2.value = "";
      //         dialogCustomize({ title: "提示", content: "体验次数完毕" });
      //         isLoading.value = false;
      //         clearInputHeight();
      //         return;
      //       } else {
      //         RemainingTimes.value = res.data.times + 1;
      //         chatmsg.value.splice(chatmsg.value.length - 1, 1);
      //         chatmsg.value.push(res.data.reply);
      //         textarea2.value = "";
      //         isLoading.value = false;
      //         clearInputHeight();
      //         toBottom();
      //         return;
      //       }
      //     }
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      dialogCustomize({ content: "请先登录" });
      textarea2.value = "";
      return;
    } else {
      if (snum == 0) {
        dialogCustomize({ content: "请先创建会话列表" });
        textarea2.value = "";
        return;
      } else {
        // 判断是否选择了会话列表
        if (chooseSessionS.value == 0) {
          dialogCustomize({ content: "选择会话列表进行交谈" });
          textarea2.value = "";
          return;
        } else {
          if (textarea2 == "") {
            dialogCustomize({ content: "请输入文本信息" });
            return;
          }
          chatmsg.value.push(textarea2.value);
          chatmsg.value.push("");
          isLoading.value = true;
          newchatMsg.value.push({
            role: "user", //用户发送的问题都固定为user
            content: textarea2.value,
          });
          clearInputHeight();
          toBottom();
          chat({
            messages: newchatMsg.value,
            session_id: chooseSessionS.value,
          })
            .then((res) => {
              // 发送失败，再次发送
              console.log("消息", res);
              if (res.code == 500) {
                chatmsg.value.splice(
                  chatmsg.value.length - 1,
                  1,
                  "发送失败,请重试"
                );
                isLoading.value = false;
                clearInputHeight();
                toBottom();
                return;
              } else {
                if (res.code == -1) {
                  chatmsg.value.splice(chatmsg.value.length - 1, 1);
                  chatmsg.value.splice(chatmsg.value.length - 1, 1);
                  isLoading.value = false;
                  textarea2.value = "";
                  dialogCustomize({ title: "提示", content: "体验次数完毕" });
                  return;
                } else {
                  RemainingTimes.value = res.data.times;
                  chatmsg.value.splice(chatmsg.value.length - 1, 1);
                  chatmsg.value.push(res.data.message);
                  newchatMsg.value.push({
                    role: "assistant", //用户发送的问题都固定为user
                    content: res.data.message,
                  });
                  isLoading.value = false;
                  textarea2.value = "";
                  toBottom();
                  return;
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  }
};
// 获取聊天记录
const chooseSession = (e, e1) => {
  console.log("当前选择会话", e);
  chatmsg.value = [];
  chooseSessionS.value = e;
  chooseSessionB.value = e1;
  msgLoading.value = true;
  getmsg({
    session_id: e,
  }).then((res) => {
    console.log("测试", res);
    if (res.code == 200) {
      if (res.data.message.length != 0) {
        // 返回的会话列表
        // console.log("返回的会话列表", res.data.message);
        const length = res.data.message.length;
        msgLoading.value = false;
        const arr = reactive([]);
        for (let i = 0; i < length; i++) {
          arr.push(res.data.message[i].content);
          // res.data.requestList[i];
          // arr.push(res.data.requestList[i]);
          // arr.push(res.data.replyList[i]);
        }
        // 渲染的列表
        chatmsg.value = arr;
        // 总的消息列表
        newchatMsg.value = res.data.message;

        toBottom();
      } else {
        msgLoading.value = false;
        return;
      }
    }
  });
};
// 获取当前点击按钮是登录还是注册按钮
const dialogFormVisible = (e) => {
  if (e == "注册") {
    isToLogin_1.value = "注册";
  } else {
    isToLogin_1.value = "登录";
  }
  isToLogin.value = true;
};

// 创建新的会话
const addsession = () => {
  console.log("身份", isvip.value);
  if (isvip.value) {
    if (snum.length == 5) {
      dialogVisible.value = true;
      dialogCustomize({ content: "目前VIP用户仅提供5次会话记录" });
      return;
    } else {
      const sessionId = new Date().getTime().toString();
      // 创建会话
      createsession({ session_id: sessionId }).then((res) => {
        if (res.code == 200) {
          console.log("12312312", sessionId);
          snum.unshift({ sessionID: sessionId, title: "New Chat" });
          console.log("测的是", snum);
        }
      });
      return;
    }
  } else {
    if (snum.length == 1) {
      dialogVisible.value = true;
      dialogCustomize({ content: "目前非VIP用户仅提供1次会话记录" });
      return;
    } else {
      const sessionId = new Date().getTime().toString;
      // 创建会话
      createsession({ sessionId: sessionId, title: "new Chat" }).then((res) => {
        if (res.code != -1) {
          snum.unshift({ sessionId: sessionId, title: "new chat" });
        }
      });
      return;
    }
  }
};

// input输入框的样式bolean
const isFocus = ref(false);
// 点击发送消息的输入框
const clickInput = () => {
  isFocus.value = true;
};
// 输入框失去焦点
const outclickInput = () => {
  isFocus.value = false;
};

// 页面渲染后
onMounted(() => {
  const token = localStorage.getItem("userToken");
  const localisvip = localStorage.getItem("isvip");
  if (localisvip == 2) {
    isvip.value = true;
  }
  // 获取剩余次数
  // ResiduaVisitorExperience().then((res) => {
  //   RemainingTimes.value = res.data.usageCount;
  // });

  if (token) {
    islogin.value = true;
    loading.value = true;
    // 获取会话列表
    getSessionIdsFun();
  } else {
    islogin.value = false;
  }
  // mock 模拟
  // mocktest({
  //   test: "test",
  // }).then((res) => {
  //   console.log(res);
  // });
  //
  // 拖拽textarea
  const divOverlay = document.getElementById("app-warpper");
  const dargDom = document.getElementById("drag");
  let isDown = false;
  let isDrag = false;
  let offsetX;
  let offsetY;

  dargDom.addEventListener(
    "mousedown",
    function (event) {
      isDrag = true;
      isDown = false;
      offsetX = event.clientX;
      offsetY = event.clientY;
    },
    true
  );
  document.addEventListener(
    "mouseup",
    function () {
      isDown = false;
      isDrag = false;
      offsetX = 0;
      offsetY = 0;
    },
    true
  );
  dargDom.addEventListener(
    "mousemove",
    function (event) {
      event.preventDefault();
      let deltaX = event.clientX - offsetX;
      // 当前点击元素的所在Y   鼠标的y-元素的y
      let deltaY = event.clientY - offsetY;
      if (isDrag) {
        // 元素的本身高度 减去元素的当前y
        const height = divOverlay.offsetHeight - deltaY;
        const top = divOverlay.offsetTop + deltaY;
        if (top > 7) {
          top = 6;
        }
        if (top < -697) {
          top = -697;
        }
        divOverlay.style.top = top + "px";
        divOverlay.style.height = height + "px";
        offsetX = event.clientX;
        offsetY = event.clientY;
      }
    },
    true
  );
});
</script>

<style lang="scss" scoped>
// 弹出提示框内容样式
.PopUpPrompt {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
// 注册登录弹出框样式
.demo-ruleForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.common-layout {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  padding-bottom: 5rem;
  background-color: #000;
  .Content {
    flex: 8;
    display: flex;
    background-color: #40414f;
    justify-content: center;
    overflow: hidden;

    .Header {
      width: 100%;
      display: flex;
      height: 6.25rem;
      align-items: center;
      justify-content: space-between;
      background-color: #202123;
      overflow: hidden;

      div {
        font-size: 2rem;
        color: white;
      }
    }
    .Main {
      border: 0.125rem solid white;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      border-radius: 0.625rem 0 0 0.625rem;
      box-sizing: border-box;
      overflow: hidden;
      margin-left: 1.25rem;
      .el-scrollbar {
        width: 100%;
        .scrollbar-demo-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 1.25rem;
          margin: 0.625rem;
          padding: 1.25rem 0.625rem;
          border-radius: 0.25rem;
          background: #7e72f2;
          background: linear-gradient(
            to right,
            rgba(126, 114, 242, 1),
            rgb(150, 140, 235)
          );
          color: white;
          img {
            width: 3.125rem;
          }
          .image {
            margin: 0 0.9375rem;
            .user {
              border-radius: 50%;
              height: 3.125rem;
            }
          }
          .loading,
          .loading > div {
            position: relative;
            top: 0.625rem;
            left: -0.9375rem;
            box-sizing: border-box;
          }

          .loading {
            display: block;
            font-size: 0;
            color: white;
            margin-left: 20px;
          }

          .loading.la-dark {
            color: #333;
          }

          .loading > div {
            display: inline-block;
            float: none;
            background-color: currentColor;
            border: 0 solid currentColor;
          }

          .loading {
            width: 120px;
            height: 10px;
            font-size: 0;
            text-align: center;
            margin-left: 50px;
            margin-top: -30px;
          }

          .loading > div {
            display: inline-block;
            width: 10px;
            height: 10px;
            white-space: nowrap;
            border-radius: 100%;
            animation: ball-elastic-dots-anim 1s infinite;
          }

          @keyframes ball-elastic-dots-anim {
            0%,
            100% {
              margin: 0;
              transform: scale(1);
            }

            50% {
              margin: 0 5%;
              transform: scale(0.65);
            }
          }
        }
        .request {
          background: #2c3350;
          display: flex;
          justify-content: flex-start;
        }
      }
      .Footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        border-radius: 0.625rem;
        padding: 0;
        bottom: 0;
        left: 0;
        height: 3.75rem;
        #warpper {
          width: 100%;
          flex: 8;
          max-height: 9.375rem;

          #app-warpper {
            position: absolute;
            cursor: move;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            resize: both;
            box-sizing: border-box;

            #drag {
              // 这里可能还有bug
              width: 100%;
              height: 3.125rem;
              position: absolute;
              z-index: 10;
              cursor: ns-resize;
              margin-top: -2.1875rem;
            }
            .content {
              width: 100%;
              height: 100%;
            }
            .content_msg {
              width: 100%;
              height: 100%;
              resize: none;
              outline: none;
              border: none;
              font-size: 1.125rem;
              padding: 0.625rem;
              border-radius: 0.3125rem 0.3125rem 0 0;
            }
          }

          .SendLogo {
            background-color: #7e72f2;
            color: white;
            border-radius: 1.25rem;
            height: 1.875rem;
            width: 5rem;
            position: absolute;
            right: 1.25rem;
            bottom: 0.9375rem;
          }
        }

        .msg_scroll {
          flex: 6;
        }
        .input_msg {
          border-radius: 0.3125rem;
          font-size: 1.125rem;
          position: relative;
        }
        .input_msg textarea {
          font-size: 0.75rem;
        }

        .input_msg_active {
          position: relative;
        }
        .input_msg ::-webkit-scrollbar {
          width: 0.375rem;
          height: 0.375rem;
        }
        .input_msg ::-webkit-scrollbar-thumb {
          border-radius: 0.1875rem;
          -moz-border-radius: 0.1875rem;
          -webkit-border-radius: 0.1875rem;
          background-color: #c3c3c3;
        }
        .input_msg ::-webkit-scrollbar-track {
          background-color: transparent;
        }
      }
    }
  }
  .Aside {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #40414f;
    overflow: hidden;
    width: 15.25rem;
    .title {
      background-color: #202123;
      box-sizing: border-box;
      width: 100%;
      min-height: 6.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 1.25rem;
      overflow: hidden;
      .HeadPicture {
        display: flex;
        align-items: center;
        cursor: pointer;
        .user {
          width: 3.125rem;
          height: 3.125rem;
          border-radius: 50%;
        }
        .Vip {
          display: flex;
          .vip {
            width: 1.25rem;
            height: 1.25rem;
          }
        }
      }
      .vipinfo {
        font-size: 0.75rem;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 0.9375rem;
        .topUp {
          display: flex;
          div {
            cursor: pointer;
          }
        }
      }
      .logout {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: white;
        min-width: 2.5rem;
        font-size: 1rem;
      }
    }
    .chatlist {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      justify-content: center;
      height: 100%;
      overflow: hidden;
      .nologin {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-radius: 0 0.625rem 0.625rem 0;
        border: 0.125rem solid white;
        margin-right: 1.25rem;
        .prompt {
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          .line {
            width: 100%;
            height: 0.125rem;
            background-color: white;
          }
          div {
            margin: 0.9375rem;
          }
          .announcement {
            font-size: 2.625rem;
            margin-top: 3.125rem;
          }
          .an1 {
            font-size: 1.25rem;
          }
          .an2 {
            font-size: 0.875rem;
          }
          .an3 {
            font-size: 1rem;
          }
          .toAssistant {
            border-bottom: 1px solid #ccc;
            cursor: pointer;
          }
        }
        .bottom {
          width: 100%;
        }
      }
      .islogin {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 0 0.625rem 0.625rem 0;
        border: 0.125rem solid white;
        border-left: none;
        margin-right: 1.25rem;
        .lists {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          flex-direction: column;
          margin-top: 0.625rem;
          .lists_item {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.3125rem;
            width: 100%;
            min-width: 12.5rem;
            padding: 1.25rem;
            // background-color: #79bbff;
            background: linear-gradient(
              to right,
              rgba(126, 114, 242, 1),
              rgb(150, 140, 235)
            );
            cursor: pointer;
            overflow: hidden;
            max-width: 12.5rem;
            color: white;
            box-sizing: border-box;
            margin-bottom: 0.625rem;
            .fill_content {
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .editor {
              margin: 0 0.625rem;
              img {
                width: 1.25rem;
                height: 1.25rem;
              }
            }
            .del {
              img {
                width: 1.25rem;
                height: 1.25rem;
              }
            }
          }
          .lists_item_bottom {
            color: white;
            margin-top: 0.625rem;
            padding: 0 0.625rem;
            font-size: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .lists_item:hover {
            background: linear-gradient(
              to right,
              rgba(126, 114, 242, 1),
              rgb(207, 205, 221)
            );
          }
          .lists_item_active {
            background: rgb(139, 95, 226);
            // border: .0625rem solid #ccc;
          }
        }
      }
      .bottom {
        color: white;
        display: flex;
        justify-content: space-around;
        .nologin_button {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-around;
          button {
            background-color: #7e72f2;
            color: white;
            border-radius: 1.25rem;
            padding: 0.625rem 1.875rem;
            cursor: pointer;
            border: none;
          }
        }
      }
    }
  }
}
</style>
