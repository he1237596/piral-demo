import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import Hammer from "hammerjs";
import queryString from 'query-string';
import request from '../request';

import { host, prefix} from "../config";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser

console.log(cornerstoneTools.version)

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
  touchEnabled: false,
  // 全局工具同步
  globalToolSyncEnabled: true,
  // 显示svg光标
  showSVGCursors: false,
  // 自动调整视口大小
  autoResizeViewports: true,
  // 虚线样式
  lineDash: [4, 4]
});

function CornerstoneElement(props) {
  const [viewport, setViewport] = useState(cornerstone.getDefaultViewport(null, undefined));
  const [stack, setStack] = useState(props.stack);
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    const onImageRendered = () => {
      const newViewport = cornerstone.getViewport(elementRef.current);
      setViewport(newViewport);
    };
    element.addEventListener("cornerstoneimagerendered", onImageRendered);


    const fetchToken = async () => {
      try {
        const response = await request(`/user/sign_in`,{
          method: 'post',
          data:  {
            password: "35cf7482ea7d2f8645bd3dcbef3f7be3d3f18282be881f8a7e7f4466a471ab99",
            username: "Sadmin"
          }
        });
        localStorage.setItem('token', response.data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

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

    const fetchData = async () => {
      try {
        await fetchToken();
        const response = await request(`/patient/37317ff0-47c2-4372-b4d4-43b35018df3c/all`);
        console.log(response);

        const seriesUrls = getDicomUlr(response.data);
        console.log(seriesUrls);
        // renderNextImage(seriesUrls[0]);
        setStack({
          currentImageIdIndex: 0,
          imageIds: seriesUrls[0],
        })
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    // fetchToken()
    fetchData();
    return () => {
      cornerstone.disable(element);
      element.removeEventListener("cornerstoneimagerendered", onImageRendered);
    };
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    console.log(stack && stack.imageIds && stack.imageIds.length > 0)
    if (stack && stack.imageIds && stack.imageIds.length > 0) {
      console.log(stack.imageIds[stack.currentImageIdIndex], 1111111)
      // renderNextImage(stack.imageIds, stack.currentImageIdIndex);
      cornerstone.enable(element);

      // 添加监听器，监听滚动事件
      element.addEventListener('cornerstonetoolsstackscroll', (event) => {
          const eventData = event.detail;
          console.log('Mouse wheel scrolled:', eventData);
          handleStackScroll(event)
      });

      const StackScrollTool = cornerstoneTools.StackScrollTool;
      const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
      const renderNextFrame = (imageIds, currentIndex) => {
        console.log(11111, imageIds[currentIndex])
        cornerstone.loadImage(imageIds[currentIndex]).then(image => {
          cornerstone.displayImage(element, image);
          cornerstoneTools.addStackStateManager(element, ["stack"]);
          console.log(stack)
          cornerstoneTools.addToolState(element, "stack", stack);
          cornerstoneTools.addTool(StackScrollTool, {
            configuration: {
              loop: true,
              allowSkipping: true
            }
          });
          cornerstoneTools.addTool(StackScrollMouseWheelTool, {
            configuration: {
              loop: true,
              allowSkipping: true,
              invert: false
            }
          });
          cornerstoneTools.setToolActive("StackScroll", { mouseButtonMask: 1 });
          cornerstoneTools.setToolActive("StackScrollMouseWheel", {
            mouseButtonMask: 4
          });
          const toolName = "Wwwc";
          cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
          /**
           * options 配置如下：
           * mouseButtonMask 指定鼠标按键：1-鼠标左键、2-鼠标右键、4-鼠标滚轮
           */
          const options = {
            mouseButtonMask: 1
          };

          // 给指定启用元素激活指定工具
          cornerstoneTools.setToolActiveForElement(element, toolName, options);
          // 或者，直接激活全部启用元素的指定工具
          cornerstoneTools.setToolActive(toolName, options);

          console.log(cornerstoneTools.getToolForElement(element, toolName), 2222)
          console.log(cornerstoneTools.getToolState(element, "stack"), 2222)
          console.log(cornerstoneTools.getToolForElement(element, "StackScroll"))
          // cornerstoneTools.removeToolForElement(element, "StackScroll");
          // cornerstoneTools.removeToolForElement(element, "StackScrollMouseWheel");

          // 或者，直接清除全部启用元素的指定工具
          // cornerstoneTools.removeTool('StackScroll');
          // cornerstoneTools.removeTool('StackScrollMouseWheel');
        });
      };

      renderNextFrame(stack.imageIds, stack.currentImageIdIndex)
    }
    // 在组件销毁时移除监听器
    return () => {
      element.removeEventListener("cornerstonestackscroll", handleStackScroll);
    };
  }, [stack])

  const handleStackScroll = (event) => {
    const element = elementRef.current;
    console.log('handleStackScroll', event)
    // 获取当前堆栈状态
    const stackToolData = cornerstoneTools.getToolState(element, 'stack');
    console.log(stackToolData)
    if (!stackToolData || !stackToolData.data || !stackToolData.data.length) {
        return;
    }
    const stack = stackToolData.data[0];

    // 处理滚动事件，例如更新当前图像索引
    const newImageIdIndex = stack.currentImageIdIndex;
    console.log('New Image ID Index:', newImageIdIndex);
  };

  return (
    <div>
      <div
        className="viewportElement"
        style={{
          width: "512px",
          height: "512px",
          position: "relative",
          color: "white"
        }}
        ref={elementRef}
      >
        <canvas className="cornerstone-canvas" />
        <div style={{ bottom: "5px", left: "5px", position: "absolute", color: "white" }}>Zoom: {viewport.scale}</div>
        <div style={{ bottom: "5px", right: "5px", position: "absolute", color: "white" }}>WW/WC: {viewport.voi.windowWidth} / {viewport.voi.windowCenter}</div>
      </div>
    </div>
  );
}

export default CornerstoneElement;
