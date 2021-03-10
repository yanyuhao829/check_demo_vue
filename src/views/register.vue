<template>
  <div class="register">
    <div class="register-nav"></div>
    <div class="register-main">
      <div class="register-select" v-if="selectUserType === 1">
        <div style="text-align:center;">
          <p>请选择注册账号类型</p>
          <div class="btn-grey mt25 hand" @click="getSelectUserType(2, 0)">
            注册机构/学校用户账户
          </div>
          <div class="btn-grey mt25 hand" @click="getSelectUserType(2, 1)">
            注册家长/学生账号
          </div>
        </div>
      </div>
      <div
        class="register-page"
        style="margin-top: 64px;"
        v-if="selectUserType === 2"
      >
        <p class="fw500-title" style="text-align: center;">
          注册机构/学校用户账号
        </p>
        <div style="padding:32px 0px 0px 113px;">
          <el-form
            :model="ruleForm"
            :rules="registerRules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="姓名:" prop="name">
              <el-input
                v-model="ruleForm.name"
                style="width:328px;"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别:" prop="gender">
              <el-radio-group v-model="ruleForm.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件类型:" prop="certificates">
              <el-select
                style="width:328px;"
                v-model="ruleForm.certificates"
                placeholder="请选择证件类型"
              >
                <el-option label="中国大陆居民身份证" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="证件号码:" prop="number">
              <el-input
                v-model="ruleForm.number"
                style="width:328px;"
                placeholder="请输入证件号码"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号:" prop="phone">
              <el-input
                v-model="ruleForm.phone"
                style="width:328px;"
                placeholder="请输入手机号"
              ></el-input>
            </el-form-item>
            <el-form-item label="设置密码:" prop="password">
              <el-input
                show-password
                v-model="ruleForm.password"
                style="width:328px;"
                placeholder="8~20位含有数字、字母、符号三项的组合"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="confirmpsw">
              <el-input
                show-password
                v-model="ruleForm.confirmpsw"
                style="width:328px;"
                placeholder="8~20位含有数字、字母、符号三项的组合"
              ></el-input>
            </el-form-item>
            <el-form-item prop="readAndAgree">
              <div style="height:26px;">
                <el-checkbox v-model="ruleForm.readAndAgree"
                  >阅读并同意</el-checkbox
                >
                <span class="f14-blue">《xxx协议|隐私政策》</span>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                style="width:328px;background:#2681FF"
                @click="registerNow('ruleForm')"
                >立即注册</el-button
              >
            </el-form-item>
            <div class="fs14" style="margin-left:186px;">
              已有账号?<span class="f14-blue hand" @click="toLogin"
                >立即登录</span
              >
            </div>
          </el-form>
        </div>
      </div>
      <div class="margin successtips" v-if="selectUserType === 3">
        <div class="successtips-body">
          <div class="margin" style="width: 60px">
            <img src="../assets/finish.png" alt="" width="60px" height="60px" />
          </div>
          <div class="textstyle mt25">
            <span class="fw500 fs24">注册成功</span>
          </div>
          <div class="textstyle mt8">
            <span class="f14-grey">{{ countdown }}s...后自动返回本平台</span>
          </div>
          <div class="textstyle" style="margin-top:40px;">
            <el-button
              type="primary"
              @click="backToLogin()"
              style="width:128px;background:#2681FF"
              >立即登录</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userRegister } from "@/api/api";
export default {
  data() {
    return {
      isAdmin: 0, // 0管理 1用户
      cd: null,
      countdown: 0, //倒计时
      selectUserType: 1, //1选择类型 2注册 3成功页面
      ruleForm: {
        name: "",
        gender: "",
        certificates: "",
        number: "",
        phone: "",
        password: "",
        confirmpsw: "",
        readAndAgree: "",
      },
      registerRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        certificates: [
          { required: true, message: "请选择证件类型", trigger: "blur" },
        ],
        number: [{ required: true, message: "请输入证件号", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confirmpsw: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
        ],
        readAndAgree: [
          { required: true, message: "请勾选此协议", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getSelectUserType(val, isAdmin) {
      this.selectUserType = val;
      this.isAdmin = isAdmin;
    },
    //立即注册
    registerNow(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let p = {
            name: this.ruleForm.name,
            gender: this.ruleForm.gender,
            number: this.ruleForm.number,
            username: this.ruleForm.phone,
            isAdmin: this.isAdmin,
            password: this.ruleForm.password,
          };
          if (this.ruleForm.password === this.ruleForm.confirmpsw) {
            userRegister(p).then((res) => {
              if (res.status === 200) {
                this.selectUserType = 3;
                console.log(res);
                this.secondeNext(5);
              } else {
                this.$message.error(res.data);
              }
            });
          } else {
            this.$message.error("两次密码输入不一致");
          }
        } else {
          return false;
        }
      });
    },
    //倒计时
    secondeNext(val) {
      if (val) {
        this.countdown = 5;
        this.cd = setInterval(() => {
          if (this.countdown == 0) {
            clearInterval(this.cd);
            this.$router.push("/");
          } else {
            this.countdown--;
          }
        }, 1000);
      }
    },
    //返回登陆
    toLogin() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="less" scoped>
.register {
  width: 100%;
  height: 100%;
  .register-nav {
    width: 100%;
    height: 64px;
    background: #102652;
  }
  .register-main {
    width: 100%;
    height: 100%;
    .register-select {
      overflow: hidden;
      width: 440px;
      margin: 0 auto;
      height: 312px;
      background: white;
      opacity: 1;
      padding: 40px 56px 40px 56px;
      border-radius: 2px;
      box-shadow: 0px 4px 16px 0px rgba(38, 39, 41, 0.1);
      margin-top: 64px;
      .btn-grey {
        width: 328px;
        height: 76px;
        line-height: 76px;
        background: #fafafa;
        color: #000;
        font-size: 20px;
      }
    }
    .successtips {
      width: 680px;
      height: 596px;
      background: white;
      margin-top: 64px;
      position: relative;
      .successtips-body {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .register-page {
      overflow: hidden;
      width: 680px;
      height: 724px;
      background: white;
      border-radius: 2px;
      padding: 40px 0px 0px 0px;
      opacity: 1;
      margin: 0 auto;
      box-shadow: 0px 4px 16px 0px rgba(38, 39, 41, 0.1);
    }
  }
}
/deep/.el-form-item {
  margin-bottom: 0px;
  padding: 0px 0px 24px 0px;
}
</style>
