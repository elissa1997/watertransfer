<template>
  <div id="realTimeStation">
    <loading v-if="loading"/>
    <template v-else>
      <div class="gateList">
        <div class="title">
          <div class="text">
            闸站
            <a-button type="primary" @click="exportGateXLSX" style="margin-left: 5px;">导出</a-button>
            <a-button @click="getStationList" style="margin-left: 5px;">刷新</a-button>
          </div>

          <div class="legend">
            <a-badge status="processing" text="闸门开启" />
            <a-badge status="warning" text="闸门全关" />
            <a-badge status="default" text="无数据" />

          </div>
        </div>
        <a-table class="table" :columns="gateStationList.columns" :data-source="gateStationList.data" rowKey="name" size="small" :pagination="false" :rowClassName="rowClassName">
          <div slot="gateH" slot-scope="text, record">
            <a-badge status="default" v-if="record.gateH === ''"/>
            <template v-else>

              <a-tooltip v-if="typeof(record.gateH) === 'string' && record.gateH.indexOf('全关') !== -1">
                <template slot="title">
                  <div style="width: 100px; text-align:center;">{{record.gateH}}</div>
                </template>
                <a-badge status="warning" />
              </a-tooltip>

              <a-tooltip v-else-if="typeof(record.gateH) === 'object'">
                <template slot="title">
                  <div style="width: 100px; text-align:center;" v-for="(item,index) in record.gateH" :key="index">{{item}}</div>
                </template>
                <a-badge status="processing" />
              </a-tooltip>

              <a-tooltip v-else-if="typeof(record.gateH) === 'string'">
                <template slot="title">
                  <div style="width: 100px; text-align:center;">{{record.gateH}}</div>
                </template>
                <a-badge status="processing" />
              </a-tooltip>
              <!-- {{typeof(record.gateH)}} -->
              <!-- <a-badge status="processing" /> -->
            </template>
          </div>
        </a-table>
      </div>

      <div class="pumpList">
        <div class="title">
          <div class="text">
            泵站
            <a-button type="primary" @click="exportPumpXLSX" style="margin-left: 5px;">导出</a-button>
            <a-button @click="getStationList" style="margin-left: 5px;">刷新</a-button>
          </div>
        </div>
        <a-table class="table" :scroll="{ x: 500 }" :columns="pumpStationList.columns" :data-source="pumpStationList.data" rowKey="name" size="small" :pagination="false" :rowClassName="rowClassName"/>
      </div>


    </template>
  </div>
</template>

<script>
import { Badge, Table, Tooltip, Button } from 'ant-design-vue';

import {transferApi} from "@/network/liveData.js";
import loading from "@/components/public/loading.vue";

import * as XLSX from "xlsx";

export default {
  name: "realTimeStation",
  props: {},
  components: {
    ABadge:Badge,
    ATable:Table,
    ATooltip:Tooltip,
    AButton:Button,
    loading
  },
  data() {
    return {
      loading: false,
      gateStationList: {
        columns: [
          { title: '测站名称', dataIndex: 'name', width: 87 },
          { title: '采集时间', dataIndex: 'tm', width: 89 },
          { title: '闸上水位', dataIndex: 'z', width: 72 },
          { title: '闸下水位', dataIndex: 'dwz', width: 72 },
          { title: '流量', dataIndex: 'q', width: 78 },
          { title: '闸门', dataIndex: 'gateH', scopedSlots: { customRender: 'gateH' }, width: 44, align: 'center'},
        ],
        data: []
      },
      pumpStationList: {
        columns: [
          { title: '测站名称', dataIndex: 'name', width: 87 ,fixed: 'left'},
          { title: '采集时间', dataIndex: 'tm', width: 89 },
          { title: '上游水位', dataIndex: 'z', width: 72 },
          { title: '下游水位', dataIndex: 'dwz', width: 72 },
          { title: '流量', dataIndex: 'mpQi', width: 85 },
          { title: '水量', dataIndex: 'mpQacc', width: 115 },
          { title: '开机台数', dataIndex: 'omcn', width: 72 },
          { title: '开机功率', dataIndex: 'omPwr', width: 78 },
        ],
        data: []
      },
    }
  },
  methods: {
    async getStationList() {
      let params = {
        action: undefined,
        line_cd: "7f73d92fd9bc4d6fad84f2311d96fbaf"
      }
      this.loading = true;

      // 获取闸站数据
      params.action = "getAllJsonS4";
      this.gateStationList.data = [];
      params['level'] = "30";
      transferApi(params).then(res => {
        res.source.forEach(element => {
          this.gateStationList.data.push(element.attributes)
        });
        this.formatGateStationList();
        this.resortGateStationList();
      })

      // 获取泵站数据
      params.action = "getAllJsonB4";
      this.pumpStationList.data = [];
      transferApi(params).then(res => {
        res.source.forEach(element => {
          this.pumpStationList.data.push(element.attributes);
        });
        this.formatPumpStationList();
        this.resortPumpStationList();
      })

      this.loading = false;
    },

    // 格式化闸站数据
    formatGateStationList() {
      this.gateStationList.data.map(ele => {
        ele.tm = this.$dayjs(ele.tm).format("MM-DD HH:mm");
        ele.z = parseFloat(ele.z).toFixed(2) + "m";
        ele.dwz = parseFloat(ele.dwz).toFixed(2) + "m";
        ele.q = parseFloat(ele.q).toFixed(2) + "m³/s";
        if (ele.gateH.indexOf(",") !== -1) {
          ele.gateH = ele.gateH.split(",");
        }
        return ele;
      })
    },

    // 手动指定闸站顺序
    resortGateStationList() {
      let manual = ["何巷闸","新胡洼闸","西坝口闸"].reverse();
      manual.forEach(name => {
        this.gateStationList.data.map((item,index) => {
          if(item.name == name){
              this.gateStationList.data.unshift(this.gateStationList.data.splice(index , 1)[0]);
          }
        })
      })
    },

    // 格式化泵站数据
    formatPumpStationList() {
      this.pumpStationList.data.map(ele => {
        ele.tm = (ele.tm !== "-")?this.$dayjs(ele.tm).format("MM-DD HH:mm"):"-";
        ele.z = (ele.z !== "-")?parseFloat(ele.z).toFixed(2) + "m":"-";
        ele.dwz = (ele.dwz !== "-")?parseFloat(ele.dwz).toFixed(2) + "m":"-";
        ele.mpQi = (ele.mpQi !== "-")?parseFloat(ele.mpQi).toFixed(2) + "m³/s":"-";
        ele.mpQacc = (ele.mpQacc !== "-")?(parseFloat(ele.mpQacc)/10000).toFixed(2)+'万m3':"-";
        ele.omcn = (ele.omcn !== "-")?ele.omcn + "台":"-";
        ele.omPwr = (ele.omPwr !== "-")?ele.omPwr + "kW":"-";
        return ele;
      })
    },

      // 手动指定泵站顺序
    resortPumpStationList() {
      // this.pumpStationList.data.sort((a,b)=>{
      //   let t1 = this.$dayjs(a.tm, 'MM-DD HH:mm');
      //   let t2 = this.$dayjs(b.tm, 'MM-DD HH:mm');
      //   return t2-t1;
      // })
      let manual = ["固镇泵站","娄宋泵站","宿州泵站","四铺泵站","侯王泵站","贾窝泵站","岱山口泵站"].reverse();
      manual.forEach(name => {
        this.pumpStationList.data.map((item,index) => {
          if(item.name == name){
              this.pumpStationList.data.unshift(this.pumpStationList.data.splice(index , 1)[0]);
          }
        })
      })
    },

    // 表格根据奇偶行匹配class
    rowClassName(record, index) {
      let className = 'light';
      if (index % 2 === 1) className = 'dark';
      return className;
    },

    // 导出闸站
    exportGateXLSX() {
      let excelData = this.gateStationList.data.map(ele => {
        let gateH = (typeof(ele.gateH) === "object")? ele.gateH.join(",") : ele.gateH;
        return {
          "测站名称": ele.name,
          "采集时间": ele.tm,
          "闸上水位": ele.z,
          "闸下水位": ele.dwz,
          "流量": ele.q,
          "闸门": gateH,
          "测站名称": ele.name,
          "测站名称": ele.name
        }
      })

      const data = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, data, 'sheet1')
      XLSX.writeFile(wb,'大型闸站信息.xlsx')
    },

    // 导出泵站
    exportPumpXLSX() {
      let excelData = this.pumpStationList.data.map(ele => {
        return {
          "测站名称": ele.name,
          "采集时间": ele.tm,
          "上游水位": ele.z,
          "下游水位": ele.dwz,
          "流量": ele.mpQi,
          "水量": ele.mpQacc,
          "开机台数": ele.omcn,
          "开机功率": ele.number,
        }
      })

      const data = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, data, 'sheet1')
      XLSX.writeFile(wb,'大型泵站信息.xlsx')
    }
  },
  mounted() {
    this.getStationList();
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
#realTimeStation{
  padding: 10px;
  height: calc($infoPanelHeight - 46px);
  overflow-y: auto;


  ::v-deep .ant-table .light{
    background-color: #ffffff;
  }
  ::v-deep .ant-table .dark{
    background-color: #f8f8f8;
  }

  ::v-deep .ant-table-thead {
    background-color: #0b996e;
    font-weight: 700;
    th {
      color: #fff !important;  
    }
  }

  ::v-deep .ant-table-tbody > tr:hover>td { background-color:transparent!important }
}

.gateList{
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .text {
      font-size: 16px;
      line-height: 24px;
      color: #099e07;
    }

    .legend {
      background-color: #ffffffbd;
      padding: 5px 10px;
      border-radius: 5px;

      ::v-deep .ant-badge:not(:first-child){
        margin-left: 10px;
      }
    }
  }
}

.pumpList {
  margin-top: 20px;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .text {
      font-size: 16px;
      line-height: 24px;
      color: #099e07;
    }
  }
}

.table {
  margin-top: 10px;

  ::v-deep .ant-table-small {
    border: 0px;
    > .ant-table-content > .ant-table-body {
      border-radius: 5px;
      margin: 0px !important;
      background-color: #fff;
    }
  }

  .gatehTip {
    width: 100px;
    text-align: center;
  }
}



</style>