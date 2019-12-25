<template>
  <div class="postpublish">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章发布</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加卡片视图 -->
    <el-card class="box-card" style="margin-top:20px">
      <el-form ref="postForm" :model="postForm" label-width="80px">
        <el-form-item label="标题：">
          <el-input v-model="postForm.title"></el-input>
        </el-form-item>
        <el-form-item label="类型：">
          <el-radio-group v-model="postForm.type">
            <el-radio :label="1">文章</el-radio>
            <el-radio :label="2">视频</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容：">
          <VueEditor :config="config" v-if="postForm.type===1" ref='postContent'/>
          <!-- 文件上传
          :on-success：文件上传成功之后的钩子
          :before-upload:文件上传之前的钩子-->
          <el-upload
            v-if="postForm.type === 2"
            class="upload-demo"
            :headers="setToken()"
            :on-success="handlerSuccess"
            :before-upload="beforeUpload"
            action="http://127.0.0.1:3000/upload"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="栏目：">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedCate" @change="handleCheckedCateChange">
            <el-checkbox v-for="item in cateList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="封面：">
          <el-upload
            action="http://127.0.0.1:3000/upload"
            list-type="picture-card"
            :headers="setToken()"
            :on-success="coverSuccess"
            :on-remove="handleRemove"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
          @click="publishPost">发布文章</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 引入富文本框
import VueEditor from 'vue-word-editor'
import 'quill/dist/quill.snow.css'
import { publishPost } from '@/api/article.js'
import { getCateList } from '@/api/cate.js'

export default {
  data () {
    return {
      postForm: {
        title: '',
        content: '',
        categories: [],
        cover: [],
        type: 1
      },
      fileList: [],
      config: {
        // 上传图片的配置
        uploadImage: {
          url: 'http://localhost:3000/upload',
          name: 'file',
          // 添加请求头对token的设置
          headers: this.setToken(),
          // res是结果，insert方法会把内容注入到编辑器中，res.data.url是资源地址
          uploadSuccess (res, insert) {
            // console.log(res)
            insert('http://localhost:3000' + res.data.data.url)
            console.log(res)
          }
        },

        // 上传视频的配置
        uploadVideo: {
          url: 'http://localhost:3000/upload',
          name: 'file',
          headers: this.setToken(),
          uploadSuccess (res, insert) {
            insert('http://localhost:3000' + res.data.data.url)
          }
        }
      },
      checkAll: false,
      checkedCate: [],
      // 栏目列表
      cateList: [],
      isIndeterminate: false,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  components: {
    VueEditor
  },
  methods: {
    //   全选和 全不选
    handleCheckAllChange (val) {
      this.checkedCate = val ? this.cateList.map(value => { return value.id }) : []
      this.isIndeterminate = false
    },
    // 单击某个复选框(不包含全选)所触发的操作
    handleCheckedCateChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cateList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cateList.length
    },
    handleRemove (file, fileList) {
    //   console.log(file, fileList)
      let id = file.response.data.id
      for (let i = 0; i < this.postForm.cover.length; i++) {
        if (this.postForm.cover[i].id === id) {
          this.postForm.cover.splice(i, 1)
          break
        }
      }
    },
    // 上传封面成功后的函数
    coverSuccess (response) {
      // 如果文件上传成功，将本次上传成功的id号存储到postForm的cover属性中
      if (response.message === '文件上传成功') {
        // 生成后台接口所需要的数据格式
        this.postForm.cover.push({ id: response.data.id })
      }
    },
    // beforeUpload:文件上传之前的处理
    beforeUpload (file) {
      console.log(file)
      if (file.type.indexOf('video/') !== 0) {
        this.$message.warning('请选择视频文件')
        return false
      }
    },
    //   element-ui的文件上传组件，文件上传成功时的钩子
    handlerSuccess (response, file, fileList) {
      if (response.message === '文件上传成功') {
        this.postForm.content = response.data.url
      }
    },
    // 设置请求头的token
    setToken () {
      let token = localStorage.getItem('heima_40_back_token')
      return {
        Authorization: token
      }
    },
    // 发布文章
    async publishPost () {
      if (this.postForm.type === 1) {
        this.postForm.content = this.$refs.postContent.editor.root.innerHTML
      }
      // 获取栏目数据
      this.postForm.categories.length = 0
      this.checkedCate.forEach(value => {
        this.postForm.categories.push({
          id: value
        })
      })
      console.log(this.postForm)
      let res = await publishPost(this.postForm)
      console.log(res)
    }
  },
  async mounted () {
    let res = await getCateList()
    this.cateList = res.data.data.splice(2)
  }
}
</script>

<style>
</style>
