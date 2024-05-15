import React, { useState, memo, useEffect } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

const toolName = "Wwwc";

function WindowLevelTool(props) {
  const element = props.element;
  const [windowWidth, setWindowWidth] = useState(1500);
  const [windowCenter, setWindowCenter] = useState(500);

  useEffect(() => {


    console.log(cornerstoneTools.getToolForElement(element, toolName), 999999)
    if (!cornerstoneTools.getToolForElement(element, toolName)) {
      cornerstoneTools.addTool(cornerstoneTools[`${toolName}Tool`]);
      /**
       * options 配置如下：
       * mouseButtonMask 指定鼠标按键：1-鼠标左键、2-鼠标右键、4-鼠标滚轮
       */
      const options = {
        mouseButtonMask: 1
      };
      // cornerstoneTools.setToolActiveForElement(element, toolName, options);
      cornerstoneTools.setToolActive(toolName, options); // 可拖可画
    }

  }, [])

  const handleWindowWidthChange = (event) => {
    setWindowWidth(parseInt(event.target.value));
    console.log(event.target.value, windowCenter)
    updateViewport(parseInt(event.target.value), windowCenter);
  };

  const handleWindowCenterChange = (event) => {
    setWindowCenter(parseInt(event.target.value));
    console.log(event.target.value, windowCenter)
    updateViewport(windowWidth, parseInt(event.target.value));
  };

  const updateViewport = (windowWidth, windowCenter) => {
    if (props.element) {
      const viewport = cornerstone.getViewport(props.element);
      console.log(viewport.voi.windowWidth)
      console.log(viewport.voi.windowCenter)
      viewport.voi.windowWidth = windowWidth;
      viewport.voi.windowCenter = windowCenter;
      cornerstone.setViewport(props.element, viewport);
      cornerstone.updateImage(props.element);
    }
  };
  console.log('WindowLevelTool render')
  return (
    <div>
      <button onClick={() => {console.log(cornerstone.getViewport(props.element))}}>获取当前窗宽窗位</button>
      <label>Window Width:</label>
      <input type="number" value={windowWidth} onChange={handleWindowWidthChange} />
      <br />
      <label>Window Center:</label>
      <input type="number" value={windowCenter} onChange={handleWindowCenterChange} />
    </div>
  );
}

export default memo(WindowLevelTool);
