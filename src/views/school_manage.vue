<template>
  <div class="school-manage">
    <el-container>
      <el-aside width="256px">
        <div class="mt80 blue-tab">
          学生管理
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <el-dropdown class="hand" @command="dialogVisible = true">
            <span class="el-dropdown-link">
              {{ userName === 0 ? "管理员" : "普通用户"
              }}<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="outLogin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main>
          <div class="school-manage-main">
            <div class="main-title">
              <span class="fs20 fw500">学生管理</span>
              <ul class="f14-grey">
                <li
                  :class="select_grade === 1 ? 'select-default' : ''"
                  @click="select_grade = 1"
                >
                  初一年级
                </li>
                <li
                  :class="select_grade === 2 ? 'select-default' : ''"
                  @click="select_grade = 2"
                >
                  初二年级
                </li>
                <li
                  :class="select_grade === 3 ? 'select-default' : ''"
                  @click="select_grade = 3"
                >
                  初三年级
                </li>
              </ul>
            </div>
            <div style="padding:24px;">
              <!-- 统计栏 -->
              <div
                class="main-statistics"
                style="padding: 16px 108px 0px 115px;"
              >
                <ul class="flex">
                  <li>
                    <span>班级数</span>
                    <p>{{ selectClass.length || "-" }}</p>
                  </li>
                  <li>
                    <span>学生人数</span>
                    <p>{{ studentTableData.length || "-" }}</p>
                  </li>
                  <li>
                    <span>已录入人脸学生数</span>
                    <p>{{ studentTableData.length || "-" }}</p>
                  </li>
                  <li>
                    <span>家长人数</span>
                    <p>{{ parent_num || "-" }}</p>
                  </li>
                </ul>
              </div>
              <!-- 查询栏 -->
              <div class="main-query mt15">
                <div :class="more ? '' : 'flex-btn'">
                  <div class="flex">
                    <div class="flex" style="margin-right:102px;">
                      <span class="f14-grey">姓名：</span>
                      <el-input
                        v-model="studentQuery.studentName"
                        size="small"
                        style="width:224px;"
                        placeholder="请输入姓名"
                      ></el-input>
                    </div>
                    <div class="flex">
                      <span class="f14-grey">性别：</span>
                      <el-select
                        v-model="studentQuery.studentGender"
                        size="small"
                        style="width:224px;"
                        placeholder="请选择性别"
                      >
                        <el-option
                          v-for="item in selectGender"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <div class="flex" style="margin-left:74px;" v-if="more">
                      <span class="f14-grey">所属班级：</span>
                      <el-select
                        v-model="studentQuery.studentClass"
                        size="small"
                        style="width:224px;"
                        placeholder="请选择班级"
                      >
                        <el-option
                          v-for="item in selectClass"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="flex-btn" :class="more ? 'mt25' : ''">
                    <div class="flex " v-if="more">
                      <div>
                        <span class="f14-grey">学号：</span>
                        <el-input
                          v-model="studentQuery.studentNum"
                          size="small"
                          style="width:224px;"
                          placeholder="请输入学号"
                        ></el-input>
                      </div>
                      <div style="margin-left:74px;">
                        <span class="f14-grey">学籍状态：</span>
                        <el-select
                          v-model="studentQuery.studentStatus"
                          size="small"
                          style="width:224px;"
                          placeholder="请选择学籍状态"
                        >
                          <el-option
                            v-for="item in studentStatusData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                    <div>
                      <el-button
                        plain
                        size="small"
                        style="width:81px;"
                        @click="toReset"
                        >重置</el-button
                      >
                      <el-button
                        type="primary"
                        size="small"
                        style="width:81px;"
                        @click="searchQuery"
                        >查询</el-button
                      >
                      <span
                        v-if="!more"
                        class="f14-blue hand ml16"
                        @click="more = true"
                        >展开<i class="el-icon-arrow-down"></i
                      ></span>
                      <span
                        class="f14-blue hand ml16"
                        v-if="more"
                        @click="more = false"
                        >收起<i class="el-icon-arrow-up"></i
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 学生列表 -->
              <div class="main-student-list mt15">
                <div class="flex" style="justify-content: space-between;">
                  <span class="fs16 fw500">学生列表</span
                  ><el-button
                    type="primary"
                    size="small"
                    style="width:81px;"
                    @click="addOrEditList(1)"
                    >+ 新增</el-button
                  >
                </div>
                <div class="mt15">
                  <el-table
                    :header-cell-style="{
                      background: '#eef1f6',
                      color: '#000000',
                      fontWeight: 500,
                    }"
                    :cell-style="{
                      height: '72px',
                    }"
                    :data="studentTableData"
                    style="width: 100%;min-height:400px;"
                  >
                    <el-table-column prop="date" label="人脸照片">
                      <template slot-scope="scope">
                        <img
                          :src="scope.row.imgUrl"
                          alt=""
                          style="width: 48px;height: 48px;opacity: 1;background: #f0f3fa;border-radius: 25px;"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" label="姓名">
                    </el-table-column>
                    <el-table-column prop="gender" label="性别">
                      <template slot-scope="scope">
                        {{ scope.row.gender === "1" ? "男" : "女" }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="studentClass" label="所属班级">
                      <template slot-scope="scope">
                        {{
                          scope.row.studentClass === "1"
                            ? "初一 (1)班"
                            : "初一 (2)班"
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="student_num" label="学号">
                    </el-table-column>
                    <el-table-column prop="studentStatus" label="学籍">
                      <template slot-scope="scope">
                        {{
                          scope.row.studentStatus === "1" ? "在籍" : "不在籍"
                        }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="status_num"
                      label="学籍号"
                      width="200"
                    >
                    </el-table-column>
                    <el-table-column prop="parent" label="家长">
                      <template slot-scope="scope">
                        {{ scope.row.parent.length + "位" }}
                      </template>
                    </el-table-column>
                    <el-table-column prop="remarks" label="备注">
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <span
                          class="hand f14-blue"
                          @click="addOrEditList(2, scope.row)"
                          >编辑</span
                        >
                        <el-dropdown
                          @command="deleteData(scope.$index, scope.row)"
                        >
                          <span class="el-dropdown-link hand f14-blue ml16">
                            ···
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>删除</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </template>
                    </el-table-column>
                  </el-table>
                  <div
                    style="display: flex; justify-content: flex-end;padding:16px 0px 0px 0px; "
                  >
                    <div class="page-text">
                      第{{ beginMount }}-{{ finalMount }}条/总
                    </div>
                    <el-pagination
                      background
                      layout="total,prev, pager, next, sizes,jumper"
                      @current-change="handleCurrentChange"
                      @size-change="handleSizeChange"
                      :total="count"
                      :current-page="page"
                      :page-sizes="[5, 10, 20, 30]"
                      :page-size="per_page"
                    >
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 新增/编辑 -->
          <el-drawer
            title="编辑/新增学生"
            :visible.sync="studerDrawer"
            :before-close="beforeClose"
          >
            <el-form
              label-position="top"
              :model="studentForm"
              :rules="rules"
              ref="studentForm"
              label-width="100px"
              class="demo-studentForm"
            >
              <div style="padding: 0px 0px 100px 0px">
                <el-form-item label="人脸照片:">
                  <div class="img-style">
                    <el-upload
                      class="avatar-uploader"
                      action="http://fileup.kai12.cn/shard_upload"
                      :headers="headers"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img
                        v-if="studentForm.imgUrl"
                        :src="studentForm.imgUrl"
                        class="avatar"
                      />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                  <div class="f14-grey mt8">
                    图片支持png、jpg格式；建议大小不超过5M
                  </div>
                </el-form-item>
                <div class="flex" style="justify-content: space-between;">
                  <div>
                    <el-form-item label="姓名:" prop="name">
                      <el-input
                        v-model="studentForm.name"
                        size="small"
                        placeholder="请输入姓名"
                        style="width:288px;"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="所属年级:" prop="studentGrade">
                      <el-select
                        v-model="studentForm.studentGrade"
                        size="small"
                        style="width:288px;"
                        placeholder="请选择所属年级"
                      >
                        <el-option
                          v-for="item in selectGrade"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="学号:" prop="student_num">
                      <el-input
                        v-model="studentForm.student_num"
                        size="small"
                        style="width:288px;"
                        placeholder="请输入学号"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="学籍号:" prop="status_num">
                      <el-input
                        v-model="studentForm.status_num"
                        size="small"
                        style="width:288px;"
                        placeholder="请输入学籍号"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="性别:" prop="gender">
                      <el-select
                        v-model="studentForm.gender"
                        size="small"
                        style="width:288px;"
                        placeholder="请选择性别"
                      >
                        <el-option
                          v-for="item in selectGender"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="所属班级:" prop="studentClass">
                      <el-select
                        v-model="studentForm.studentClass"
                        size="small"
                        style="width:288px;"
                        placeholder="请选择所属班级"
                      >
                        <el-option
                          v-for="item in selectClass"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="学籍:" prop="studentStatus">
                      <el-select
                        v-model="studentForm.studentStatus"
                        size="small"
                        style="width:288px;"
                        placeholder="请选择学籍"
                      >
                        <el-option
                          v-for="item in studentStatusData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="备注:" prop="remarks">
                      <el-input
                        v-model="studentForm.remarks"
                        size="small"
                        style="width:288px;"
                        placeholder="请输入备注"
                      >
                      </el-input>
                    </el-form-item>
                  </div>
                </div>
                <p class="mt32 fs16 fw500">家长</p>
                <div class="mt15" style="margin-bottom: 6px;">
                  <span class="fs14"
                    ><span style="color:#F56C6C;">* </span>家人身份</span
                  ><span class="fs14" style="margin-left:102px;"
                    ><span style="color:#F56C6C;">* </span>手机号</span
                  >
                </div>
                <div
                  class="flex"
                  v-for="(element, index) in studentForm.parent"
                  :key="index"
                >
                  <div>
                    <el-form-item
                      :prop="'parent.' + index + '.parents'"
                      :rules="{
                        required: true,
                        message: '请选择家长身份',
                        trigger: 'blur',
                      }"
                    >
                      <el-select
                        v-model="element.parents"
                        size="small"
                        style="width:160px;"
                        placeholder="请选择家长身份"
                      >
                        <el-option
                          v-for="item in parenthoodData"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="ml8">
                    <el-form-item
                      :prop="'parent.' + index + '.phone'"
                      :rules="{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur',
                      }"
                    >
                      <el-input
                        v-model="element.phone"
                        size="small"
                        style="width:288px;"
                        placeholder="请输入手机号"
                      >
                      </el-input>
                    </el-form-item>
                  </div>
                  <div style="align-self:flex-start;margin-top:6px;">
                    <i
                      class="el-icon-circle-plus-outline font-icon-style"
                      @click="addItem()"
                    ></i
                    ><i
                      class="el-icon-remove-outline font-icon-style"
                      @click="delItem(element)"
                    ></i>
                  </div>
                </div>
              </div>
              <div class="demo-drawer__footer">
                <div class="fr" style="margin:12px 24px;">
                  <el-form-item>
                    <el-button
                      size="small"
                      @click="studerDrawer = false"
                      style="width:90px;font-size:14px;"
                      >取 消</el-button
                    >
                    <el-button
                      size="small"
                      type="primary"
                      @click="addConfirm('studentForm')"
                      style="width:90px;background:#1890FF;font-size:14px;"
                      >确 定</el-button
                    >
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </el-drawer>
        </el-main>
      </el-container>
    </el-container>
    <!-- 退出登录提示框 -->
    <div class="quit-model">
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>您确定要退出吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="outLogin()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  add_student_list,
  search_student_list,
  edit_student_list,
  del_student_list,
  student_list,
} from "@/api/api";
export default {
  data() {
    return {
      confirmtype: 0,
      //上传
      headers: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhdGlvbiI6InRvYiIsImNoaWxkX3VzZXJfaWQiOjU1Niwic2Nob29sX2NvZGUiOiJrMTJzY2hvb2xfMDJfdGVzdCIsInVzZXJfaWQiOjE2ODN9.pY6RCE0mcZGxqmi3UArtaeC0W2iwbRQ9Oo8vLw9CA7c",
      },
      studerDrawer: false,
      page: 1,
      per_page: 5,
      count: 0,
      pageLength: 0,
      studentQuery: {
        // 查找栏
        studentName: "", //学生姓名
        studentGender: "", //学生性别
        studentClass: "", //学生班级
        studentNum: "", //学号
        studentStatus: "", //学籍状态
      },
      selectGender: [
        {
          value: "1",
          label: "男",
        },
        {
          value: "2",
          label: "女",
        },
      ],

      selectClass: [
        {
          value: "1",
          label: "初一 (1)班",
        },
        {
          value: "2",
          label: "初一 (2)班",
        },
      ],

      studentStatusData: [
        {
          value: "1",
          label: "在籍",
        },
        {
          value: "2",
          label: "不在籍",
        },
      ],
      studentTableData: [],
      selectGrade: [
        {
          value: "1",
          label: "初一",
        },
        {
          value: "2",
          label: "初二",
        },
        {
          value: "3",
          label: "初三",
        },
      ],
      studentForm: {
        name: "",
        gender: "",
        student_num: "",
        parent: [{ parents: "", phone: "" }],
        status_num: "",
        remarks: "",
        studentStatus: "",
        imgUrl: "",
        studentClass: "",
        studentGrade: "",
      },
      parenthoodData: [
        {
          value: "1",
          label: "父亲",
        },
        {
          value: "2",
          label: "母亲",
        },
        {
          value: "3",
          label: "爷爷",
        },
        {
          value: "4",
          label: "奶奶",
        },
      ],
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        studentGrade: [
          { required: true, message: "请选择年级", trigger: "blur" },
        ],
        student_num: [
          { required: true, message: "请输入学号", trigger: "blur" },
        ],
        status_num: [
          { required: true, message: "请输入学籍号", trigger: "blur" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "blur" }],
        studentClass: [
          { required: true, message: "请选择所属班级", trigger: "blur" },
        ],
        studentStatus: [
          { required: true, message: "请选择学籍", trigger: "blur" },
        ],
      },
      more: false, //查询框 展开
      select_grade: 1, //选择年级
      dialogVisible: false, //退出登录提示框
      userName: " ",
    };
  },
  methods: {
    //查询
    searchQuery() {
      let p = {
        name: this.studentQuery.studentName, //学生姓名
        gender: this.studentQuery.studentGender,
        studentStatus: this.studentQuery.studentStatus,
        studentClass: this.studentQuery.studentClass,
        student_num: this.studentQuery.studentNum,
      };
      if (
        this.studentQuery.studentName === "" ||
        this.studentQuery.studentGender === "" ||
        this.studentQuery.studentStatus === "" ||
        this.studentQuery.studentClass === "" ||
        this.studentQuery.studentNum === ""
      ) {
        this.$message.error("请补全搜索信息");
      } else {
        search_student_list(p).then((res) => {
          if (res.status === 200) {
            this.studentTableData = res.data;
          } else {
            this.$message.error("查询失败");
          }
        });
      }
    },
    //重置
    toReset() {
      this.studentQuery.studentName = "";
      this.studentQuery.studentGender = "";
      this.studentQuery.studentStatus = "";
      this.studentQuery.studentClass = "";
      this.studentQuery.studentNum = "";
      this.getStudentList();
    },
    //上传成功
    handleAvatarSuccess(res) {
      this.studentForm.imgUrl = res.data.file_path;
    },
    //上传之前
    beforeAvatarUpload(file) {
      const isJPGorPNG = file.type === "image/jpeg" || "image/png";
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPGorPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPGorPNG && isLt5M;
    },
    //退出登录
    outLogin() {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("token");
      this.$router.push("/");
    },
    //学生列表
    getStudentList() {
      let p = {
        page: this.page,
        per_page: this.per_page,
      };
      student_list(p).then((res) => {
        if (res.status === 200) {
          this.studentTableData = res.data.list;
          this.count = res.data.count;
          this.pageLength = res.data.list.length;
        } else {
          this.studentTableData = [];
          this.count = 0;
          this.pageLength = 0;
        }
      });
    },
    //新增/编辑表格 1新增 2编辑
    addOrEditList(type, item) {
      if (type === 1) {
        this.studerDrawer = true;
        this.confirmtype = 1;
        this.studentForm.name = "";
        this.studentForm.gender = "";
        this.studentForm.student_num = "";
        this.studentForm.parent = [{ parents: "", phone: "" }];
        this.studentForm.status = "";
        this.studentForm.studentStatus = "";
        this.studentForm.status_num = "";
        this.studentForm.remarks = "";
        this.studentForm.imgUrl = "";
        this.studentForm.studentClass = "";
        this.studentForm.studentGrade = "";
      } else {
        this.studentForm = item;
        this.studerDrawer = true;
        this.confirmtype = 2;
      }
    },
    //确认新增/编辑
    addConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let p = {
            name: this.studentForm.name,
            gender: this.studentForm.gender,
            student_num: this.studentForm.student_num,
            parent: this.studentForm.parent,
            status: this.studentForm.status,
            studentStatus: this.studentForm.studentStatus,
            status_num: this.studentForm.status_num,
            remarks: this.studentForm.remarks,
            imgUrl: this.studentForm.imgUrl,
            studentClass: this.studentForm.studentClass,
            studentGrade: this.studentForm.studentGrade,
          };
          if (this.confirmtype === 1) {
            add_student_list(p).then((res) => {
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: res.data.msg,
                });
                // this.studentTableData.push()
                this.getStudentList();
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg,
                });
              }
            });
          } else {
            p._id = this.studentForm._id;
            edit_student_list(p).then((res) => {
              if (res.status === 200) {
                this.$message({
                  type: "success",
                  message: res.data.msg,
                });
                this.getStudentList();
              } else {
                this.$message({
                  type: "error",
                  message: res.data.msg,
                });
              }
            });
          }
        } else {
          return false;
        }
      });
      this.studerDrawer = false;
    },
    //删除表格
    deleteData(index, item) {
      this.$confirm("确认要删除这名学生吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let p = {
            _id: item._id,
          };
          del_student_list(p).then((res) => {
            if (res.status === 200) {
              this.studentTableData.splice(index, 1);
              this.$message({
                type: "success",
                message: res.data.msg,
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.msg,
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    addItem() {
      this.studentForm.parent.push({
        parents: "",
        phone: "",
      });
    },
    delItem(item) {
      if (this.studentForm.parent.length > 1) {
        let index = this.studentForm.parent.indexOf(item);
        if (index !== -1) {
          this.studentForm.parent.splice(index, 1);
        }
      }
    },
    beforeClose() {
      this.confirmtype = 0;
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getStudentList();
    },
    handleSizeChange(pageSize) {
      this.per_page = pageSize;
      this.getStudentList();
    },
  },
  created() {
    this.userName = +localStorage.getItem("isAdmin");
    this.getStudentList();
  },
  computed: {
    beginMount() {
      return this.per_page * (this.page - 1) + 1;
    },
    finalMount() {
      return this.per_page * (this.page - 1) + this.pageLength || 0;
    },
    parent_num() {
      let a = 0;
      this.studentTableData.map((ele) => {
        a += ele.parent.length;
      });
      return a;
    },
  },
};
</script>

<style lang="less" scoped>
.quit-model {
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #e3e8eb;
    height: 56px;
    font-size: 16px;
    font-weight: 500;
  }
  /deep/.el-dialog__body {
    padding: 24px 32px;
  }
  /deep/.el-input {
    width: 224px !important;
    height: 32px;
    border-radius: 2px;
  }
  .el-form-item {
    display: flex;
    justify-content: flex-end;
  }
  /deep/.el-dialog__footer {
    border-top: 1px solid #e3e8eb;
    height: 56px;
    /deep/ .el-button {
      width: 65px;
      height: 32px;
      padding: 0;
      text-align: center;
      border-radius: 2px;
    }
    /deep/.el-button .el-button--primary {
      background: #2681ff;
    }
  }
}
.school-manage {
  height: 100%;
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #001529;
    color: white;
    text-align: center;
    line-height: 200px;
    height: 100%;
    div {
      cursor: pointer;
      width: 256px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      margin-bottom: 8px;
    }
  }
  .el-header {
    background-color: #ffffff;
    color: #333;
    text-align: right;
    height: 64px;
    line-height: 64px;
    font-size: 14px;
    color: #000000;
    z-index: 2;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  }

  .el-main {
    background-color: #f0f2f5;
    color: #333;
    padding: 0px;
    .school-manage-main {
      .main-title {
        background: #fff;
        height: 90px;
        padding: 16px 0px 0px 24px;
        span {
          color: #1e2830;
        }
        ul {
          display: flex;
          li {
            width: 58px;
            height: 46px;
            line-height: 46px;
            margin-right: 32px;
          }
          li:hover {
            color: #1890ff;
            cursor: pointer;
            border-bottom: 2px solid #1890ff;
          }
        }
      }
      .main-statistics {
        height: 90px;
        background: #fff;
        ul {
          justify-content: space-between;
          li {
            text-align: center;
            span {
              font-size: 14px;
              color: rgb(144, 144, 144);
            }
            p {
              font-size: 24px;
              font-weight: 700;
            }
          }
        }
      }
      .main-query {
        background: #fff;
        padding: 24px 32px 24px 100px;
        .flex-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
      .main-student-list {
        padding: 21px 32px 15px 32px;
        background: #fff;
      }
    }
    /deep/.el-drawer {
      width: 704px !important;
      .el-drawer__header {
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        font-weight: 500;
        border-bottom: 1px solid rgb(144, 144, 144);
        padding: 20px 20px 15px;
        margin-bottom: 0px;
      }
      .el-drawer__body {
        position: relative;
        overflow: auto;
        /* overflow-x: auto; */
        padding: 32px 48px 10px 48px;
        .img-style {
          width: 88px;
          height: 88px;
          background: #f0f3fa;
          border-radius: 50%;
        }
        .demo-drawer__footer {
          position: fixed;
          right: 0;
          bottom: 0;
          background: white;
          border-top: 1px solid #ccc;
          height: 52px;
          line-height: 52px;
          width: 704px;
        }
      }
    }
  }
  .blue-tab {
    background: #1890ff;
  }
  .body-main {
    background-color: #f0f2f5;
    &_title {
      min-width: 1184px;
      background: #ffffff;
      justify-content: center;
      flex-direction: column;
      align-items: baseline;
    }
  }
  /deep/.black-title {
    span {
      color: black !important;
    }
  }
}
.select-default {
  color: #1890ff;
  border-bottom: 2px solid #1890ff;
}
/deep/.el-table th > .cell {
  text-align: center;
}

/deep/.el-table .cell {
  text-align: center;
}
.page-text {
  font-size: 13px;
  min-width: 35.5px;
  height: 28px;
  line-height: 32px;
  vertical-align: top;
  box-sizing: border-box;
}
/deep/.el-form-item__label {
  padding: 0px;
}
/deep/.el-form-item__content {
  line-height: 32px;
}
/deep/.font-icon-style[data-v-21091634] {
  margin-top: 0px;
}
// /deep/.el-drawer__container ::-webkit-scrollbar {
//   display: none;
// }
.font-icon-style {
  font-size: 20px;
  color: #2681ff;
  margin-left: 10px;
  cursor: pointer;
  margin-top: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 88px;
  height: 88px;
  line-height: 88px;
  text-align: center;
}
.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: block;
}
</style>
