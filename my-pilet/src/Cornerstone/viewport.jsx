import * as React from 'react';
import { render } from "react-dom";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import * as dicomParser from "dicom-parser";
import axios from "axios";
import queryString from 'query-string';

const host = 'http://192.168.18.196:16600';
const prefix = '/api/main'
async function request(url, options) {
  const defaults = {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      "pv-token": localStorage.getItem('token')
    }
  }
  try {
    const response = await axios({
      url: host + prefix + url,
      ...defaults,
      ...options
    });;
    console.log(response);
    if (response.status !== 200) {
      console.error("NETWORK ERROR:", response);
      throw response;
    }
    if (response.data.code !== 200) {
      console.error("Error fetching data:", response);
      // 异常状态码处理
      return null;
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
/*     {
      "message": "Network Error",
      "name": "AxiosError",
      "stack": "AxiosError: Network Error\n    at XMLHttpRequest.handleError (http://localhost:1234/$pilet-api/0/a2d6c2e9.js:42833:14)\n    at Axios.request (http://localhost:1234/$pilet-api/0/a2d6c2e9.js:43319:41)",
      "config": {
         ...CornerstoneElement.
      },
      "code": "ERR_NETWORK",
      "status": null
  } */
    return null;
  }
}

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser
cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr) {
    xhr.setRequestHeader("pv-token", localStorage.getItem('token'))
  }
})
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.init({
  // 当元素被启用时，是否监听鼠标事件
  mouseEnabled: true,
  // 当元素被启用时，是否监听触摸事件
  touchEnabled: true,
  // 全局工具同步
  globalToolSyncEnabled: true,
  // 显示svg光标
  showSVGCursors: true,
  // 自动调整视口大小
  autoResizeViewports: true,
  // 虚线样式
  lineDash: [4, 4]
});

// var config = {
//   maxWebWorkers: navigator.hardwareConcurrency || 1,
//   startWebWorkersOnDemand: true,
// };
// cornerstoneWADOImageLoader.webWorkerManager.initialize(config);

const divStyle = {
  width: "512px",
  height: "512px",
  position: "relative",
  color: "white"
};

const bottomLeftStyle = {
  bottom: "5px",
  left: "5px",
  position: "absolute",
  color: "white"
};

const bottomRightStyle = {
  bottom: "5px",
  right: "5px",
  position: "absolute",
  color: "white"
};
function renderNextImage(imageIds) {
  // 渲染当前索引处的图像
  cornerstone.loadAndCacheImage(imageIds[currentIndex]).then(image => {
    const element = document.getElementById('yourElementId');
    cornerstone.displayImage(element, image);
  });

  // 更新索引以准备渲染下一帧
  currentIndex = (currentIndex + 1) % imageIds.length;

  // 请求下一帧动画
  requestAnimationFrame(renderNextImage);
}

const getDicomUlr = (patient = {}) => {
  const seriesInfos = [

  ]
  const seriesDicomUrls = []
  if(patient.cases.length > 0) {
    patient.cases.forEach(caseItem => {
      caseItem.series.forEach(seriesItem => {
        const Info = [];
        const dicomUrls = [];
        console.log(seriesItem.sop_instance_list)
        const list = seriesItem.sop_instance_list;
        if (Object.keys(seriesItem.sop_instance_list).length > 0) {
          Object.keys(seriesItem.sop_instance_list).forEach((key) => {
            const instanceItem = list[key]
            const dicom= {
                requestType: "WADO",
                studyUID: caseItem.study_instance_uid,
                seriesUID: seriesItem.series_instance_uid,
                objectUID: instanceItem.sop_UID ,
                type: "application/dicom",
                collectionId: seriesItem.fk_collection_id,
                patientId: seriesItem.fk_patient_id,
                contentType: "dcm-jpeg",
                index: parseInt(key)
            }
            // console.log(dicom)
            Info.push(dicom)
            dicomUrls.push(`wadouri:${host}${prefix}/wado?${queryString.stringify(dicom)}`)
          })
          seriesInfos.push(Info)
          seriesDicomUrls.push(dicomUrls)
        }
      })
    })
  }
  return seriesDicomUrls
}

class CornerstoneElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stack: props.stack,
      viewport: cornerstone.getDefaultViewport(null, undefined),
      imageId: props.stack.imageIds[0]
    };
    this.onImageRendered = this.onImageRendered.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  render() {
    return (
      <div>
        <div
          className="viewportElement"
          style={divStyle}
          ref={input => {
            this.element = input;
          }}
        >
          <canvas className="cornerstone-canvas" />
          <div style={bottomLeftStyle}>Zoom: {this.state.viewport.scale}</div>
          <div style={bottomRightStyle}>
            WW/WC: {this.state.viewport.voi.windowWidth} /{" "}
            {this.state.viewport.voi.windowCenter}
          </div>
        </div>
      </div>
    );
  }

  onWindowResize() {
    console.log("onWindowResize");
    cornerstone.resize(this.element);
  }

  onImageRendered() {
    const viewport = cornerstone.getViewport(this.element);
    console.log(viewport);

    this.setState({
      viewport
    });

    console.log(this.state.viewport);
  }

  onNewImage() {
    const enabledElement = cornerstone.getEnabledElement(this.element);

    this.setState({
      imageId: enabledElement.image.imageId
    });
  }

  async componentDidMount() {
    const element = this.element;
    const res = await request('/user/sign_in',
    {
      method: 'post',
      data: {
        password: "35cf7482ea7d2f8645bd3dcbef3f7be3d3f18282be881f8a7e7f4466a471ab99",
        username: "Sadmin"
      }
    })
    // console.log(res, 88888)
    localStorage.setItem('token', res.data.token)

    const res1 = await request('/patient/37317ff0-47c2-4372-b4d4-43b35018df3c/all')
    console.log('patientData:', res1.data)
    const allSeresUrls = getDicomUlr(res1.data)
    // Enable the DOM Element for use with Cornerstone
    cornerstone.enable(element);
    console.log(element)
    const wadoImg = 'wadouri:http://192.168.18.196:16600/api/main/wado?requestType=WADO&studyUID=1.2.840.113619.2.55.3.112996.891698212&seriesUID=1.3.12.2.1107.5.1.4.65911.30000021053023473600200005147&objectUID=1.3.12.2.1107.5.1.4.65911.30000021053023473600200005155&type=application%2Fdicom&collectionId=b4c1e4af-c61f-40e1-ab24-915a0c18a197&patientId=5077a94e-9eba-45fe-a0fe-d67e3c639dcd&contentType=dcm-jpeg&index=8'
    // Load the first image in the stack
    let currentIndex = 0;
    const imageIds = allSeresUrls[0]
    renderNextImage()
      // const stack = this.props.stack;
      // cornerstoneTools.addStackStateManager(element, ["stack"]);
      // cornerstoneTools.addToolState(element, "stack", stack);
      // console.log(cornerstoneTools)
      // cornerstoneTools.mouseInput.enable(element);
      // cornerstoneTools.mouseWheelInput.enable(element);
      // cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
      // cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
      // cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
      // cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel

      // cornerstoneTools.touchInput.enable(element);
      // cornerstoneTools.panTouchDrag.activate(element);
      // cornerstoneTools.zoomTouchPinch.activate(element);

      // element.addEventListener(
      //   "cornerstoneimagerendered",
      //   this.onImageRendered
      // );
      // element.addEventListener("cornerstonenewimage", this.onNewImage);
      // window.addEventListener("resize", this.onWindowResize);
      // console.log(wadoImg)
      // console.log(imageIds[currentIndex])
    function renderNextImage() {
      // 渲染当前索引处的图像
      cornerstone.loadAndCacheImage(imageIds[currentIndex]).then(image => {
        cornerstone.displayImage(element, image);
      // Add the stack tool state to the enabled element
      // const stack = this.props.stack;
      // cornerstoneTools.addStackStateManager(element, ["stack"]);
      // cornerstoneTools.addToolState(element, "stack", stack);
      // console.log(cornerstoneTools)
      // cornerstoneTools.mouseInput.enable(element);
      // cornerstoneTools.mouseWheelInput.enable(element);
      // cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
      // cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
      // cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
      // cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel

      // cornerstoneTools.touchInput.enable(element);
      // cornerstoneTools.panTouchDrag.activate(element);
      // cornerstoneTools.zoomTouchPinch.activate(element);

      // element.addEventListener(
      //   "cornerstoneimagerendered",
      //   this.onImageRendered
      // );
      // element.addEventListener("cornerstonenewimage", this.onNewImage);
      // window.addEventListener("resize", this.onWindowResize);
      });

      // 更新索引以准备渲染下一帧
      currentIndex = (currentIndex + 1) % imageIds.length;

      // 请求下一帧动画
      requestAnimationFrame(renderNextImage);
    }
    // cornerstone.loadAndCacheImage(wadoImg).then(image => {
    //   // Display the first image
    //   console.log(image, 99999);
    //   cornerstone.displayImage(element, image);

    //   // Add the stack tool state to the enabled element
    //   // const stack = this.props.stack;
    //   // cornerstoneTools.addStackStateManager(element, ["stack"]);
    //   // cornerstoneTools.addToolState(element, "stack", stack);
    //   // console.log(cornerstoneTools)
    //   // cornerstoneTools.mouseInput.enable(element);
    //   // cornerstoneTools.mouseWheelInput.enable(element);
    //   // cornerstoneTools.wwwc.activate(element, 1); // ww/wc is the default tool for left mouse button
    //   // cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
    //   // cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
    //   // cornerstoneTools.zoomWheel.activate(element); // zoom is the default tool for middle mouse wheel

    //   // cornerstoneTools.touchInput.enable(element);
    //   // cornerstoneTools.panTouchDrag.activate(element);
    //   // cornerstoneTools.zoomTouchPinch.activate(element);

    //   // element.addEventListener(
    //   //   "cornerstoneimagerendered",
    //   //   this.onImageRendered
    //   // );
    //   // element.addEventListener("cornerstonenewimage", this.onNewImage);
    //   // window.addEventListener("resize", this.onWindowResize);
    // });
  }

  componentWillUnmount() {
    const element = this.element;
    element.removeEventListener(
      "cornerstoneimagerendered",
      this.onImageRendered
    );

    element.removeEventListener("cornerstonenewimage", this.onNewImage);

    window.removeEventListener("resize", this.onWindowResize);

    cornerstone.disable(element);
  }

  componentDidUpdate(prevProps, prevState) {
    const stackData = cornerstoneTools.getToolState(this.element, "stack");
    const stack = stackData.data[0];
    stack.currentImageIdIndex = this.state.stack.currentImageIdIndex;
    stack.imageIds = this.state.stack.imageIds;
    cornerstoneTools.addToolState(this.element, "stack", stack);

    //const imageId = stack.imageIds[stack.currentImageIdIndex];
    //cornerstoneTools.scrollToIndex(this.element, stack.currentImageIdIndex);
  }
}

export default CornerstoneElement;
1