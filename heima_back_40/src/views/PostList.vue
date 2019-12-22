<template>
  <div class="postlist">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="postList" border style="width: 100%;margin-top:20px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="标题" width="420"></el-table-column>
      <el-table-column prop="create_date" label="日期" width="180">
        <template slot-scope="scope">
          {{scope.row.create_date | dataFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
            {{scope.row.type===1?'文章':'视频'}}
        </template>
      </el-table-column>
      <el-table-column prop="user.nickname" label="作者" width="280"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分享" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { getPostList } from '@/api/article.js'
import { dataFormat } from '@/utils/myfilters.js'
export default {
  data () {
    return {
      pageIndex: 1,
      pageSize: 2,
      total: 0,
      postList: []
    }
  },
  filters: {
    dataFormat
  },
  mounted () {
    this.init()
  },
  methods: {
    async init () {
      let res = await getPostList({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      })
      // console.log(res)
      if (res.status === 200) {
        this.postList = res.data.data
        // console.log(this.postList)
        this.total = res.data.total
        // console.log(this.total)
      }
    },
    edit (row) {
      console.log(row)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.pageIndex = val
      this.init()
    }
  }
}
</script>

<style>
</style>
