<template>
  <div id="overViewPic">
    
    <a-button type="primary" size="large" @click="openOverview">
      <icon-clue theme="outline" size="16" fill="#ffffff" :strokeWidth="3"/>
      调水概化图
    </a-button>
  </div>
</template>

<script>
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
import Vue from 'vue';
Vue.use(VueViewer);
import { Button } from 'ant-design-vue';


export default {
  name: "overViewPic",
  props: {},
  components: {
    AButton:Button
  },
  data() {
    return {
      images: [
        '/dist/images/Huai_NorthTransfer_overview.jpg'
      ],
      options: { "navbar": false, "title": false, "toolbar": false }
    }
  },
  methods: {
    openOverview() {
      const $viewer = this.$viewerApi({
        options:this.options,
        images: this.images
      })

      $viewer.zoom(5)
    },
  },
  mounted() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#overViewPic{
  position: absolute;
  bottom: 10px;
  right: 10px;

  ::v-deep .ant-btn{
    width: 135px;
    display: flex;
    align-items: center;
    background-color: #0bb408;
    border: 1px solid #0bb408;

    // padding: 0 8px;
  }
  
  ::v-deep .i-icon {
    margin-right: 8px;
  }
}
</style>