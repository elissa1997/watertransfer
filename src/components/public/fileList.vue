<template>
  <div id="fileList">
    <template v-if="fileList.length != 0">
      <div class="fileItem" v-for="file in fileList" :key="file.file_cd">
        <div class="fileWarp" v-if="file.file_ext === '.jpg' || file.file_ext === '.png'" @click="openPreview(file)">
          <icon-pic theme="outline" size="20" :strokeWidth="3"/>
          <span class="fileTitle">{{file.file_titl}}</span>{{file.file_ext}}
        </div>

        <div class="fileWarp" v-if="file.file_ext === '.pdf'" @click="openPreview(file)">
          <icon-file-pdf theme="outline" size="20" :strokeWidth="3"/>
          <span class="fileTitle">{{file.file_titl}}</span>{{file.file_ext}}
        </div>
      </div>
      <!-- {{fileList}} -->

      <a-modal  v-model="preViewVisible" title="文件预览" :footer="null" width="1000px">
        <!-- <div class="preViewWarp" v-if="preViewType === 'img'">
          <img :src="preViewUrl" alt="">
        </div> -->
        <div class="preViewWarp">
          <embed class="content" :src="preViewUrl" />
        </div>
      </a-modal>

    </template>

    <div v-else>
      暂无附件
    </div>

  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
export default {
  name: "fileList",
  props: {
    fileList: {
      type: Array,
      default: []
    }
  },
  components: {
  },
  data() {
    return {
      preViewVisible: false,
      preViewType: undefined,
      preViewUrl: undefined,
      options: { "navbar": false, "title": false, "toolbar": false }
    }
  },
  methods: {
    openPreview(file) {
      if (file.file_ext === '.jpg' || file.file_ext === '.png') {
        const $viewer = this.$viewerApi({
          options:this.options,
          images: [this.getfileUrl(file)]
        })

        $viewer.zoom(5)
      }else if(file.file_ext === '.pdf'){
        this.preViewUrl = this.getfileUrl(file);
        this.preViewType = 'pdf';
        this.preViewVisible = true;
      }
    },

    getfileUrl(file) {
      return process.env.VUE_APP_API + "gateway/only.do?action=previewFile&file_cd="+file.file_cd;
    },
  },
  mounted() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#fileList{}

.fileWarp{
  display: flex;
  align-items: center;
  width: 100%;
  cursor: pointer;
  .fileTitle{
    max-width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 5px;
  }
  // justify-content: center;
  // height: 100%;
  // width: 100%;
  // padding: 10px;
  // border-radius: 5px;
  // background-color: #fff;
  // box-shadow: 0px 1px 10px #000;
  // cursor: pointer;

}

.fileWarp:hover{
    color: #1890ff;
}

.preViewWarp{
  // height: 60vh;
  // width: 100%;

  img{
    width: 100%;
    height: 80vh;
    object-fit: contain;
  }

  .content{
    width: 100%;
    height: 80vh;
  }
}
</style>