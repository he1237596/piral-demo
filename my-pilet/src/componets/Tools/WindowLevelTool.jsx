import React, { useState, memo, useEffect } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

const toolName = "Wwwc";

function WindowLevelTool(props) {
  const element = props.element;
  const [windowWidth, setWindowWidth] = useState(1500);
  const [windowCenter, setWindowCenter] = useState(500);
  const [active, setActive] = useState(false);
  useEffect(() => {
    console.log('WindowLevelTool mounted')
    console.log(cornerstoneTools.getToolForElement(element, toolName), 999999)
    if (!cornerstoneTools.getToolForElement(element, toolName)) {
      console.log('WindowLevelTool add')
      cornerstoneTools.addTool(cornerstoneTools[`${toolName}Tool`]);
      /**
       * options 配置如下：
       * mouseButtonMask 指定鼠标按键：1-鼠标左键、2-鼠标右键、4-鼠标滚轮
       */
      const options = {
        mouseButtonMask: 1
      };
      // cornerstoneTools.setToolActiveForElement(element, toolName, options);
      // cornerstoneTools.setToolActive(toolName, options); // 可拖可画
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

  const onClick = () => {
    const tool = cornerstoneTools.getToolForElement(element, toolName);
    console.log(tool)
    console.log(cornerstoneTools.setToolEnabled)
    if (tool && tool.mode === 'active') {
      // 停用Length工具
      // cornerstoneTools.setToolDisabled(toolName); // 不可拖，不可画
      // cornerstoneTools.setToolPassive(toolName); //可以拖不可以画
      cornerstoneTools.setToolDisabled(toolName); // 不可拖，不可画（还可能隐藏（右键的时候））
      setActive(false);

    } else {
      // 启用Length工具
      cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1, updateOnMouseMove: true });
      // cornerstoneTools.setToolEnabled(toolName, { mouseButtonMask: 1 }); // 显示不能操作
      setActive(true);
    }
  }

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
      <div>窗宽窗位工具<button onClick={onClick}>{!active ? '激活' : '禁用'}（左键）</button>
      <div>当前: {active ? '激活' : '禁用'}</div></div>
      <div>
        <label>Window Width:</label>
        <input type="number" value={windowWidth} onChange={handleWindowWidthChange} />
        <br />
        <label>Window Center:</label>
        <input type="number" value={windowCenter} onChange={handleWindowCenterChange} />
      </div>

      <hr />
    </div>
  );
}

export default memo(WindowLevelTool);
