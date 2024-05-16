import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import Hammer from "hammerjs";
import WindowLevelTool from '../Tools/WindowLevelTool';
import MeasureTool from '../Tools/MeasureTool';
import AngleMeasurementTool from '../Tools/AngleMeasurementTool';
import StackScollTool from '../Tools/StackScollTool';

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
// cornerstoneTools.external.Hammer = Hammer;
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
  const { currentImageIdIndex, imageIds } = props;
  const [viewport, setViewport] = useState(cornerstone.getDefaultViewport(null, undefined));
  const elementRef = useRef(null);


  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });
    }
    if (!element.hasAttribute('data-enabled')) {
      cornerstone.enable(element);
      element.setAttribute('data-enabled', 'true');
    }
    if (imageIds && imageIds.length > 0) {
      console.log('enable------------')
      const StackScrollTool = cornerstoneTools.StackScrollTool;
      const StackScrollMouseWheelTool = cornerstoneTools.StackScrollMouseWheelTool;
      const renderNextFrame = (imageIds, currentIndex) => {
        cornerstone.loadImage(imageIds[currentIndex]).then(image => {
          cornerstone.displayImage(element, image);
          cornerstoneTools.addStackStateManager(element, ["stack"]);
          cornerstoneTools.addToolState(element, "stack", { currentImageIdIndex, imageIds });
      //     cornerstoneTools.addTool(StackScrollTool, {
      //       configuration: {
      //         loop: true,
      //         allowSkipping: true
      //       }
      //     });
      //     cornerstoneTools.addTool(StackScrollMouseWheelTool, {
      //       configuration: {
      //         loop: true,
      //         allowSkipping: true,
      //         invert: false
      //       }
      //     });
      // // console.log(cornerstoneTools.getToolForElement(element, 'StackScrollMouseWheel'), 4444444444)

      //     cornerstoneTools.setToolActive("StackScroll", { mouseButtonMask: 1 });
      //     cornerstoneTools.setToolActive("StackScrollMouseWheel", {
      //       mouseButtonMask: 4
      //     });
          // const toolName = "Wwwc";
          // cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
          // /**
          //  * options 配置如下：
          //  * mouseButtonMask 指定鼠标按键：1-鼠标左键、2-鼠标右键、4-鼠标滚轮
          //  */
          // const options = {
          //   mouseButtonMask: 1
          // };

          // // 给指定启用元素激活指定工具
          // cornerstoneTools.setToolActiveForElement(element, toolName, options);
          // // 或者，直接激活全部启用元素的指定工具
          // cornerstoneTools.setToolActive(toolName, options);

          // console.log(cornerstoneTools.getToolForElement(element, toolName), 2222)
          // console.log(cornerstoneTools.getToolState(element, "stack"), 2222)
          console.log(cornerstoneTools.getToolForElement(element, "StackScroll"), 99999)
          // cornerstoneTools.removeToolForElement(element, "StackScroll");
          // cornerstoneTools.removeToolForElement(element, "StackScrollMouseWheel");

          // 或者，直接清除全部启用元素的指定工具
          // cornerstoneTools.removeTool('StackScroll');
          // cornerstoneTools.removeTool('StackScrollMouseWheel');
        });
      };
      renderNextFrame(imageIds, currentImageIdIndex)
    }

  }, [imageIds, currentImageIdIndex])

  useEffect(() => {
    console.log('addEventListener------------')
    const element = elementRef.current;
    console.log(element, 'element')
    const onImageRendered = () => {
      console.log('cornerstoneimagerendered')
      const newViewport = cornerstone.getViewport(elementRef.current);
      setViewport(newViewport);
    };

    const handleStackScroll = (event) => {
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

    element.addEventListener("cornerstoneimagerendered", onImageRendered);
      // 添加监听器，监听滚动事件
    element.addEventListener('cornerstonetoolsstackscroll', (event) => {
        const eventData = event.detail;
        console.log('Mouse wheel scrolled:', eventData);
        handleStackScroll(event)
    });
    return () => {
      cornerstone.disable(element);
      element.removeEventListener("cornerstoneimagerendered", onImageRendered);
      element.removeEventListener("cornerstonetoolsstackscroll", handleStackScroll);
    };
  }, []);

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
      {elementRef.current && elementRef.current.hasAttribute('data-enabled') && <WindowLevelTool element={elementRef.current} />}
      {elementRef.current && elementRef.current.hasAttribute('data-enabled') && <MeasureTool element={elementRef.current} />}
      {elementRef.current && elementRef.current.hasAttribute('data-enabled') && <AngleMeasurementTool element={elementRef.current} />}
      {elementRef.current && elementRef.current.hasAttribute('data-enabled') && <StackScollTool currentImageIdIndex={currentImageIdIndex} imageIds={imageIds} element={elementRef.current} />}
    </div>
  );
}

export default CornerstoneElement;
