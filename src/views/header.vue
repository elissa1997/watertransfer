<template>
  <div id="headerBar">
    <div class="logoAndTitle">
      <div class="logo">
        <img src="../assets/logo.png">
      </div>
      <div class="title">
        <img src="../assets/title.png">
      </div>
    </div>

    <div class="logout">
      <div class="logoutBtn">
        <!-- <a-button ghost @click="logout">退出</a-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { Button, Tag, Divider } from 'ant-design-vue';

export default {
  name: "headerBar",
  props: {},
  components: {
    AButton:Button,
    ATag:Tag,
    ADivider:Divider
  },
  data() {
    return {}
  },
  methods: {
    logout() {
      window.location.href = "/login"
    }
  },
  mounted() {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#headerBar{
  height: 70px;
  width: 100%;
  background-image: url('../assets/headerBarBG.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  // box-shadow: 0px 1px 10px #000;
  z-index: 20;

  .logoAndTitle {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    float: left;
    .logo img{
      height: 35px;
      width: auto;
      object-fit: cover;
      margin: 0 20px;
    }

    .title img{
      height: 35px;
      width: auto;
      object-fit: cover;

    }
  }

  .divider {
    width: 1px;
    height: 50%;
    background-color: #ffffff9a;
    margin: 0 10px;
  }

  .logout{
    color: #ffffffd7;
    float: right;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0px 10px;
    backdrop-filter: blur(7px);
    .userInfo {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .userName {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
}
</style>