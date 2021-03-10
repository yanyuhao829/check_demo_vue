<template>
  <div class="login">
    <div class="login-nav"></div>
    <div class="login-main">
      <div class="login-page">
        <div class="login-page-left"></div>
        <div class="login-page-right">
          <div class="login-page-body">
            <div>
              <div class="fs20 login-title">
                账号登录
              </div>
            </div>
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              class="demo-ruleForm"
            >
              <el-form-item prop="userName">
                <el-input
                  v-model="ruleForm.userName"
                  placeholder="手机号/身份证/用户名"
                  style="width:328px;margin-top:25px;"
                  prefix-icon="el-icon-user"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="ruleForm.password"
                  placeholder="请输入密码"
                  style="width:328px;"
                  show-password
                  prefix-icon="el-icon-goods"
                ></el-input>
              </el-form-item>
              <div class="flex" style="justify-content:space-between;">
                <el-checkbox v-model="rememberPsw">记住密码</el-checkbox>
                <span class="f14-blue hand" style="text-align:right;"
                  >忘记密码?</span
                >
              </div>
              <el-form-item>
                <el-button
                  style="width:328px;background:#2681FF;margin-top:25px;"
                  type="primary"
                  @click="login('ruleForm')"
                  >登录</el-button
                >
              </el-form-item>
              <el-divider class="f14-grey">其他方式登陆</el-divider>
              <div style="text-align:center">
                <i class="el-icon-s-promotion"></i>
              </div>
              <div class="flex mt25" style="justify-content: center">
                <span class="f16-blue hand" @click="toRegister">注册账号</span
                ><span class="f16-grey" style="padding:0px 8px 0px 8px">|</span
                ><span class="f16-blue hand">激活账号</span>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userLogin } from "@/api/api";
export default {
  data() {
    return {
      ruleForm: {
        userName: "",
        password: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      rememberPsw: false,
    };
  },
  methods: {
    //登录
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let p = {
            username: this.ruleForm.userName,
            password: this.ruleForm.password,
          };
          userLogin(p).then((res) => {
            if (res.status === 200) {
              this.$router.push("/school_manage");
              localStorage.setItem("isAdmin", res.data.isAdmin);
              localStorage.setItem("token", res.data.token);
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    //去注册
    toRegister() {
      this.$router.push("/register");
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  .login-nav {
    height: 64px;
    width: 100%;
    background: #102652;
  }
  .login-main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin-top: 64px;
    .login-page {
      width: 1120px;
      height: 720px;
      margin: 0 auto;
      display: flex;
      .login-page-left {
        width: 560px;
        height: 100%;
        background: #f0f9ff;
      }
      .login-page-right {
        height: 100%;
        width: 560px;
        background: white;
        position: relative;
        .login-page-body {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 328px;
          .login-title {
            width: 80px;
            color: #2681ff;
            border-bottom: 4px solid #2681ff;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
}
/deep/.el-divider__text {
  color: rgb(144, 144, 144);
}
/deep/.el-divider--horizontal {
  margin: 40px 0;
}
</style>
