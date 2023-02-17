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
        label-width="120px"
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
                    placeholder="请输入问题"
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
              <div class="renewal" v-if="isvip">续费套餐</div>
            </div>
          </div>

          <div class="open" v-if="!isvip" style="color: white">开通vip</div>
          <div class="logout" @click="logout">退出</div>
        </div>
        <div class="title" v-if="!islogin"></div>
        <div class="chatlist">
          <div class="nologin" v-if="!islogin">
            <div class="prompt">
              <div class="announcement">用户公告</div>
              <div class="an1">体验ChatGPT Plus</div>
              <div class="an2">未登录用户仅有5次查询机会!</div>
              <div class="line"></div>
              <div class="an3">
                ChatGPT Plus 与ChatGPT最大的区别在于让用户在多人使用 ChatGPT
                时也可有优先使用权，即使在高峰时段也能够正常使用比免费版本更快的回答响应时间优先使用最新功能和改进。
              </div>

              <div>
                剩余体验次数 <span>{{ RemainingTimes }}</span>
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
                    chooseSessionS == i.sessionId ? 'lists_item_active' : ''
                  "
                  v-for="(i, index) in snum"
                  :key="i"
                  @click="chooseSession(i.sessionId, index)"
                >
                  {{ i.title }}
                  <div
                    class="editor"
                    v-if="chooseSessionS == i.sessionId"
                    @click="editor(i)"
                  >
                    <img src="./image/editor.png" alt="" />
                  </div>
                  <div
                    class="del"
                    v-if="chooseSessionS == i.sessionId"
                    @click="del(i.sessionId)"
                  >
                    <img src="./image/del.png" alt="" />
                  </div>
                </div>
              </div>

              <div class="lists_item_bottom" v-if="!isvip">
                您还不是vip,剩余访问次数{{ RemainingTimes }}次数
              </div>
              <div v-if="isvip" style="color: white">
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
    delSession({ sessionId: chooseSessionS.value }).then((res) => {
      chatmsg.value = null;
      dialogCustomize({ content: "删除成功" });
      snum.splice(chooseSessionB.value, 1);
    });
  }
  // 编辑会话标题
  if (e.button == "修改" && iseditorTitle) {
    editorTitle({
      sessionId: chooseSessionS.value,
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
          userName: ruleForm.name,
          password: ruleForm.pass,
        }).then((res) => {
          if (res.code != -1) {
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
          userName: ruleForm.name,
          password: ruleForm.pass,
          repeatPassword: ruleForm.checkPass,
        }).then((res) => {
          // 注册成功之后进行登录
          if (res) {
            login({
              userName: ruleForm.name,
              password: ruleForm.pass,
            }).then((res) => {
              if (res.code != -1) {
                loading.value = false;
                localStorage.setItem("userToken", res.data.token);
                getSessionIdsFun();
                islogin.value = true;
                RemainingTimes.value = res.data.experienceTimes;
                Cancel();
              } else {
                loading.value = false;
                // 提示 登录失败
                dialogCustomize({ content: res.msg });
              }
            });
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
  console.log("snum", snum.value);
  getSessionIds().then((res) => {
    for (let i = 0; i < res.data.length; i++) {
      snum.push(res.data[i]);
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
  divOverlay.style.top = "0px";
  divOverlay.style.height = "60px";
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
      chatmsg.value.push(textarea2.value);
      chatmsg.value.push("");
      isLoading.value = true;
      toBottom();
      chat({
        message: textarea2.value,
        sessionId: sessionid.value,
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

              textarea2.value = "";
              dialogCustomize({ title: "提示", content: "体验次数完毕" });
              isLoading.value = false;
              clearInputHeight();
              return;
            } else {
              RemainingTimes.value = res.data.experienceTimes;
              chatmsg.value.splice(chatmsg.value.length - 1, 1);
              chatmsg.value.push(res.data.reply);
              textarea2.value = "";
              isLoading.value = false;
              clearInputHeight();
              toBottom();
              return;
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
          clearInputHeight();
          toBottom();
          chat({
            message: textarea2.value,
            sessionId: chooseSessionS.value,
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
                  chatmsg.value.push(res.data.reply);
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
  chatmsg.value = [];
  chooseSessionS.value = e;
  chooseSessionB.value = e1;
  msgLoading.value = true;

  getmsg({
    sessionId: e,
  }).then((res) => {
    if (res.data != null) {
      const length = res.data.requestList.length;
      msgLoading.value = false;
      const arr = reactive([]);
      for (let i = 0; i < length; i++) {
        res.data.requestList[i];
        arr.push(res.data.requestList[i]);
        arr.push(res.data.replyList[i]);
      }
      chatmsg.value = arr;

      toBottom();
    } else {
      msgLoading.value = false;
      return;
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
      const sessionId = new Date().getTime();
      // 创建会话
      createsession({ sessionId: sessionId, title: "new Chat" }).then((res) => {
        if (res.code != -1) {
          snum.unshift({ sessionId: res.data, title: "new chat" });
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
      const sessionId = new Date().getTime();
      // 创建会话
      createsession({ sessionId: sessionId, title: "new Chat" }).then((res) => {
        if (res.code != -1) {
          snum.unshift({ sessionId: res.data, title: "new chat" });
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
  ResiduaVisitorExperience().then((res) => {
    RemainingTimes.value = res.data;
  });

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
  padding-bottom: 80px;
  background-color: #000;
  .Content {
    flex: 5;
    display: flex;
    background-color: #40414f;
    .Header {
      width: 100%;
      display: flex;
      height: 100px;
      align-items: center;
      justify-content: space-between;
      background-color: #202123;
      div {
        font-size: 32px;
        color: white;
      }
    }
    .Main {
      border: 2px solid white;

      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      border-radius: 10px;
      margin: 30px;
      box-sizing: border-box;
      overflow: hidden;
      .el-scrollbar {
        width: 100%;
        .scrollbar-demo-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 20px;
          margin: 10px;
          padding: 20px 10px;
          border-radius: 4px;
          background: #7e72f2;
          background: linear-gradient(
            to right,
            rgba(126, 114, 242, 1),
            rgb(150, 140, 235)
          );
          color: white;
          img {
            width: 50px;
          }
          .image {
            margin: 0 15px;
            .user {
              border-radius: 50%;
              height: 50px;
            }
          }
          .loading,
          .loading > div {
            position: relative;
            top: 10px;
            left: -15px;
            box-sizing: border-box;
          }

          .loading {
            display: block;
            font-size: 0;
            color: white;
            margin-left: 1.25rem;
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
            width: 7.5rem;
            height: 0.625rem;
            font-size: 0;
            text-align: center;
            margin-left: 3.125rem;
            margin-top: -1.875rem;
          }

          .loading > div {
            display: inline-block;
            width: 0.625rem;
            height: 0.625rem;
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
        border-radius: 10px;
        padding: 0;
        bottom: 0;
        left: 0;
        height: 60px;
        #warpper {
          width: 100%;
          flex: 8;
          max-height: 150px;
          #app-warpper {
            position: absolute;
            cursor: move;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            resize: both;
            box-sizing: border-box;
            border-radius: 5px;
            #drag {
              // 这里可能还有bug
              width: 100%;
              height: 50px;
              position: absolute;
              z-index: 10;
              cursor: ns-resize;
              margin-top: -35px;
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
              font-size: 18px;
              padding: 10px;
              border-radius: 5px;
              box-sizing: border-box;
            }
          }

          .SendLogo {
            background-color: #7e72f2;
            color: white;
            border-radius: 20px;
            height: 30px;
            width: 80px;
            position: absolute;
            right: 20px;
            bottom: 15px;
          }
        }

        .msg_scroll {
          flex: 6;
        }
        .input_msg {
          border-radius: 5px;
          font-size: 18px;
          position: relative;
        }
        .input_msg textarea {
          font-size: 12px;
        }

        .input_msg_active {
          position: relative;
        }
        .input_msg ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .input_msg ::-webkit-scrollbar-thumb {
          border-radius: 3px;
          -moz-border-radius: 3px;
          -webkit-border-radius: 3px;
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
    flex: 3;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #40414f;
    overflow: hidden;

    .title {
      background-color: #202123;
      box-sizing: border-box;
      width: 100%;
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .HeadPicture {
        display: flex;
        align-items: center;
        cursor: pointer;
        .user {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .Vip {
          display: flex;
          .vip {
            width: 20px;
            height: 20px;
          }
        }
      }
      .vipinfo {
        font-size: 12px;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        .topUp {
          display: flex;
          div {
            cursor: pointer;
            font-size: 12px;
          }
        }
      }
      .logout {
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 16px;
        padding-left: 10px;
        cursor: pointer;
        color: white;
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
        margin: 30px;
        border-radius: 10px;
        border: 2px solid white;
        .prompt {
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 350px;

          .line {
            width: 100%;
            height: 2px;
            background-color: white;
          }
          div {
            margin: 15px;
          }
          .announcement {
            font-size: 42px;
            margin-top: 50px;
          }
          .an1 {
            font-size: 20px;
          }
          .an2 {
            font-size: 20px;
          }
          .an3 {
            font-size: 16px;
          }
        }
        .bottom {
          width: 100%;
        }
      }
      .islogin {
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        margin: 30px;
        border-radius: 10px;
        border: 2px solid white;
        overflow: hidden;
        .lists {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          flex-direction: column;
          overflow: hidden;
          .lists_item {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            width: 100%;
            min-width: 200px;
            padding: 20px;
            // background-color: #79bbff;
            background: linear-gradient(
              to right,
              rgba(126, 114, 242, 1),
              rgb(150, 140, 235)
            );
            cursor: pointer;
            overflow: hidden;
            max-width: 200px;
            color: white;
            box-sizing: border-box;
            margin-bottom: 10px;
            .fill_content {
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .editor {
              margin: 0 10px;
              img {
                width: 20px;
                height: 20px;
              }
            }
            .del {
              img {
                width: 20px;
                height: 20px;
              }
            }
          }
          .lists_item_bottom {
            color: white;
            margin-top: 10px;
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
            border: 1px solid #ccc;
          }
        }
      }
      .bottom {
        height: 10vh;
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
            border-radius: 20px;
            padding: 10px 30px;
            cursor: pointer;
            border: none;
          }
        }
      }
    }
  }
}
</style>
