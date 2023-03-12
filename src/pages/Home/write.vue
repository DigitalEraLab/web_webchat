<template>
  <!-- 其它提示 -->
  <el-dialog
    center
    v-model="dialogVisible"
    :title="PopUpPrompt.title"
    width="30%"
  >
    <span class="PopUpPrompt">{{ PopUpPrompt.content }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit(PopUpPrompt)">
          {{ PopUpPrompt.button }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 其它提示 -->
  <div class="write">
    <div class="top">
      <div class="logo">
        <img src="./image/logo_write.svg" alt="" class="logo_fix" />
        <div class="title">
          <span class="deepl">DeepL </span> <span>Write</span>
          <span class="beta">BETA</span>
        </div>
      </div>
      <div class="login">
        <span>登录</span>
        <img src="./image/menu.png" alt="" />
      </div>
    </div>
    <div class="content">
      <div class="c1">
        <div class="c1_title">秒速优化你的写作</div>
        <div class="c1_title1">清晰、准确、从容地书写</div>
      </div>
      <div class="c2">
        <div class="c2_title">
          <el-dropdown>
            <span class="el-dropdown-link">
              文案风格
              <img src="./image/toBottom.png" alt="" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="chooseStyleFun('悬疑')"
                  >悬疑</el-dropdown-item
                >
                <el-dropdown-item @click="chooseStyleFun('惊悚')"
                  >惊悚</el-dropdown-item
                >
                <el-dropdown-item @click="chooseStyleFun('爱情')"
                  >爱情</el-dropdown-item
                >
                <el-dropdown-item @click="chooseStyleFun('搞笑')"
                  >搞笑</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <input
            v-model="chooseStyle"
            type="text"
            class="c2_input"
            placeholder="或者输入您自定义的风格"
          />
          <img
            src="./image/change.png"
            alt=""
            class="c2_change"
            @click="toModify"
          />
        </div>
        <div class="c2_content">
          <!-- <el-input
            v-model="input"
            placeholder="输入或粘贴文本以查看修改建议"
            show-word-limit="true"
            type="textarea"
            maxlength="10000"
            class="c2_content_t1"
            :rows="24"
            resize="none"
          /> -->
          <div class="c2_content_textarea line">
            <!-- <p v-if="!textarea1">请输入或粘贴文本查看修改后的文案</p> -->
            <textarea
              class="t1 ScrollBar"
              name=""
              id=""
              cols="30"
              rows="32"
              placeholder="输入或粘贴文本以查看修改后的文案。"
              v-model="textarea1"
              v-show="fileNum == 0"
            ></textarea>
            <div class="NumberOfWords">
              <span>{{ textarea1.length }}</span> 字
            </div>

            <el-upload
              ref="uploadRef"
              class="upload-demo"
              drag
              action=""
              :http-request="upload"
              multiple
              v-if="textarea1.length == 0"
              :auto-upload="false"
              :limit="1"
              :on-exceed="OutOfLimit"
              :on-change="FileUp"
              :multiple="false"
              :on-remove="removeFile"
              :on-success="fileUploadSuccess"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖入文本或者<em>点击这里上传文本</em>(一次只能上传一个文件)
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  <!-- jpg/png files with a size less than 500kb -->
                </div>
              </template>
            </el-upload>
          </div>

          <div class="c2_content_textarea">
            <img
              src="./image/Hourglass.gif"
              alt=""
              class="loginSvg"
              v-if="loading"
            />
            <textarea
              v-if="!loading"
              class="t2 ScrollBar"
              name=""
              id=""
              cols="30"
              rows="30"
              v-model="textarea2"
            ></textarea>
          </div>

          <!-- <el-input
            v-model="input"
            placeholder=""
            type="textarea"
            class="c2_content_t2"
            :rows="24"
            resize="none"
          /> -->
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom_center">
        <div class="b1"><img src="./image/bottom.svg" alt="" /></div>
        <div class="b2">
          <div class="b2_title">一键优化你的写作</div>
          <div class="b2_content">
            <div>
              <img src="./image/right.png" alt="" /><span
                >智能AI帮您开拓思路</span
              >
            </div>
            <div>
              <img src="./image/right.png" alt="" /><span
                >选择你的写作风格</span
              >
            </div>
            <div>
              <img src="./image/right.png" alt="" /><span
                >创造性地改写整个句子</span
              >
            </div>
            <div>
              <img src="./image/right.png" alt="" /><span
                >通过Write建议的改写方式获取准确的措辞</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { UploadFilled } from "@element-plus/icons-vue";
import UploadInstance from "element-plus";
import { login, uploadFile } from "@/api/Allrequest";
// 页面渲染
onMounted(() => {
  loginfun();
});
// 登录
const loginfun = () => {
  login({
    username: "aaaa1111",
    password: "aaaa1111",
  }).then((res) => {
    console.log("登录", res);
  });
};

const uploadRef = ref(UploadInstance);
// 超出文件限制
const OutOfLimit = (e) => {
  dialogCustomize({ content: "一次只能上传一个文件" });
  return;
};
// 文件个数
const fileNum = ref(0);
// 文件上传次数检测
const FileUp = (e) => {
  console.log(e);
  fileNum.value++;
  console.log(fileNum.value);
};
// 移出文件
const removeFile = (e) => {
  fileNum.value--;
  console.log(fileNum.value);
};

// 是否输入了文字
const isInputText = ref(false);

// 输入框  风格
const chooseStyle = ref("");
// 弹出框提示
const PopUpPrompt = reactive({
  title: "",
  content: "",
  button: "",
});

// 是否显示弹出框
const dialogVisible = ref(false);

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
    PopUpPrompt.button = "OK";
  }
  dialogVisible.value = true;
};

// 弹出框按钮下一步操纵
const dialogSubmit = (e) => {
  dialogVisible.value = false;
};

// 文本内容1
const textarea1 = ref("");
// 文本内容2
const textarea2 = ref("");
// 是否加载中
const loading = ref(false);
const chooseStyleFun = (e) => {
  chooseStyle.value = e;
};
const fileUploadSuccess = (res) => {
  console.log("文件上传成功", res);
};
const toModify = () => {
  // 检测内容是否为空 或者文件为空
  if (textarea1.value == "" && fileNum.value == 0) {
    dialogCustomize({ content: "文案不能为空,请输入文案或者上传文案" });
    return;
  } else if (chooseStyle.value == "") {
    dialogCustomize({ content: "请选择风格" });
    return;
  } else {
    loading.value = true;
    uploadRef.value.submit();
    fileUploadSuccess();
    // // 模拟数据
    // setTimeout(() => {
    //   // 清空原本的数据
    //   textarea2.value = "";
    //   loading.value = false;
    //   // 获取到数据，将数据放入
    //   textarea2.value = "修改的文案";
    // }, 2000);
  }
};
</script>

<style lang="scss" scoped>
// 提示框
.PopUpPrompt {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
// 下拉框样式
:deep(.el-dropdown-menu__item):hover {
  background-color: #006494;
  color: white;
}
:deep(.el-dropdown-menu__item) {
  width: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 弹出框样式
:deep(.el-button) {
  background-color: #006494;
  color: white;
  border: none;
}

// 拖拽框样式
:deep(.el-upload-dragger) {
  border: none !important;
  margin: 0 5px;
}

.write {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  align-items: center;
  .top {
    width: 100%;
    height: 3.75rem;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    max-width: 87.5rem;
    padding: 0.3125rem 0.625rem;
    .logo {
      display: flex;
      .logo_fix {
        position: relative;
        width: 3.25rem;
        height: 4.125rem;
      }
      .title {
        display: flex;
        align-items: center;
        font-size: 1rem;
        margin-left: 0.625rem;
        span {
          margin-right: 0.3125rem;
        }
        .deepl {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f2b46;
          font-weight: 800;
          font-size: 1.125rem;
        }
        .beta {
          width: 2.9375rem;
          height: 1.625rem;
          color: white;
          background-color: #037171;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          border-radius: 0.3125rem;
          margin-left: 0.3125rem;
        }
      }
    }
    .login {
      display: flex;
      align-items: center;
      span {
        margin: 0.625rem;
      }
      img {
        width: 2.25rem;
        height: 2rem;
      }
    }
  }
  .content {
    padding: 0 4.375rem 2.5rem 4.375rem;
    box-sizing: border-box;
    width: 100%;
    // flex: 1;
    background-color: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    .c1 {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
      padding: 1.25rem 0;
      max-width: 87.5rem;
      .c1_title {
        font-size: 1.75rem;
      }
      .c1_title1 {
        font-size: 1.125rem;
      }
    }
    .c2 {
      //   box-sizing: border-box;
      width: 100%;
      min-height: 6.25rem;
      border-radius: 0.625rem;
      box-shadow: #ccc 0rem 0rem 0.3125rem;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      max-width: 87.5rem;
      .c2_title {
        width: 100%;
        min-height: 3.4375rem;
        display: flex;
        align-items: center;
        border-bottom: 0.0625rem solid #dae1e8;
        box-sizing: border-box;
        padding: 0.5rem 1.25rem;

        .el-dropdown-link {
          display: flex;
          align-items: center;
          font-size: 1rem;
          cursor: pointer;
          img {
            width: 1.25rem;
            height: 1.25rem;
            margin-left: 0.625rem;
          }
        }
        .c2_input {
          outline: none;
          padding: 0.625rem;
          font-size: 0.875rem;
          border-radius: 0.3125rem;
          border: 0.0625rem solid #ccc;
          margin: 0 0.625rem;
          max-width: 12.5rem;
          min-width: 6.25rem;
        }
        .c2_input:focus {
          border: 0.0625rem solid #006494;
        }
        .el-input {
          max-width: 15.625rem !important;
          margin-left: 0.625rem;
          min-height: 0rem !important;
        }
        .c2_change {
          width: 1.5rem;
          height: 1.5rem;
          margin-left: 1.25rem;
          cursor: pointer;
        }
        .c2_change:hover {
          animation: rotation 0.5s ease;
        }

        @keyframes rotation {
          /*以百分比来规定改变发生的时间 也可以通过"from"和"to",等价于0% 和 100%*/
          0% {
            /*rotate(2D旋转) scale(放大或者缩小) translate(移动) skew(翻转)*/
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(180deg);
          }
        }
      }
      .c2_content {
        width: 100%;
        display: flex;
        box-sizing: border-box;
        min-height: 31.25rem;
        .c2_content_textarea {
          flex: 1;
          max-height: 31.25rem;
          position: relative;
          textarea {
            padding: 1.875rem;
            font-size: 1.625rem;
            border: 0.0625rem solid rgba($color: #ccc, $alpha: 0);
            flex: 1;
            outline: none;
            resize: none;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
          }
          .upload-demo {
            width: 100%;
            border: none;
            position: absolute;
            top: 100px;
            left: 0;
          }

          .NumberOfWords {
            font-size: 0.75rem;
            color: #ccc;
            position: absolute;
            right: 0.625rem;
            bottom: 0.625rem;

            span {
              color: #006494;
              font-size: 0.875rem;
            }
          }
          textarea:focus {
            border: 0.0625rem solid #006494;
          }
          .loginSvg {
            margin-top: 1.25rem;
            margin-left: 1.25rem;
          }
          .t1 {
            border-radius: 0 0 0 0.625rem;
          }
          .t2 {
            border-radius: 0 0 0.625rem 0;
          }
        }

        .line {
          border-right: 0.0625rem solid #ccc;
        }
        .ScrollBar::-webkit-scrollbar {
          width: 0.375rem;
          height: 0.375rem;
        }
        .ScrollBar::-webkit-scrollbar-thumb {
          border-radius: 0.1875rem;
          -moz-border-radius: 0.1875rem;
          -webkit-border-radius: 0.1875rem;
          background-color: #c3c3c3;
        }
        .ScrollBar::-webkit-scrollbar-track {
          background-color: transparent;
        }
      }
    }
  }
  .bottom {
    width: 100%;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 13.5625rem;
    flex-wrap: wrap;
    .bottom_center {
      display: flex;
      box-sizing: border-box;
      padding: 1.25rem;
      justify-content: space-around;
      // max-width: 100rem;
      .b1 {
        img {
          width: 14.0625rem;
          height: 13.5625rem;
        }
      }
      .b2 {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-around;
        box-sizing: border-box;
        max-width: 51.25rem;
        margin-left: 3.125rem;
        .b2_title {
          font-size: 1.5rem;
        }
        .b2_content {
          display: flex;
          flex-wrap: wrap;
          max-width: 56.25rem;
          justify-content: flex-start;
          div {
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            margin-bottom: 0.9375rem;
            margin-right: 0.9375rem;
            img {
              width: 1.375rem;
              height: 1.625rem;
              margin-top: -0.1875rem;
              margin-right: 0.3125rem;
            }
          }
        }
      }
    }
  }
}
</style>
