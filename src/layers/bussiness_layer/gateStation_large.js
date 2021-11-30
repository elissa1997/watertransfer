// 八级泵站图层设置
import {pumpStationList} from "@/network/pumpStation.js"

const axios_params = {
  action: "getAllJsonS4",
  level: "30",
  line_cd: "7f73d92fd9bc4d6fad84f2311d96fbaf"
}

export async function featureLayer() {
  let template = {
    id: "businessLayer_03",
    title: "大型闸站",
    visible: true,
    labelingInfo: {
      "labelExpressionInfo": {
        expression: "$feature.name"
      },
      "labelPlacement": "below-center",
        "symbol": {
        "type": "text",
        "color": "black",
        "haloSize": 1,
        "haloColor": "#ffffff",
        "font": {"size": 12}
      }
    },
    renderer: {
      "type": "simple",
      "symbol": {
        "type": "picture-marker",
        "url": "/dist/icon/waterGate_red_128.svg",
        "width": 20,
        "height": 20
      },
      "visualVariables": [
        {
        "type": "rotation",
        "field": "angle",
        "rotationType": "geographic"
        }
      ]
    },
    labelsVisible: true,
    fields: [
      {"name": "FID", "type": "oid"},
      {"name": "name", "type": "string"},
      {"name": "x_coord", "type": "string"},
      {"name": "y_coord", "type": "string"},
      {"name": "height", "type": "integer"},
      {"name": "desc", "type": "string"},
      {"name": "stcd", "type": "string"},
      {"name": "angle", "type": "string"},
      {"name": "desc", "type": "string"},
    ],
    outFields: ["*"],
    geometryType: "point",
    spatialReference: {
      "wkid": 102100
    },
    objectIdField: "FID",
    source: []
  }

  await pumpStationList(axios_params).then(res => {
    template.source = res.source;
  })

  return template;
}