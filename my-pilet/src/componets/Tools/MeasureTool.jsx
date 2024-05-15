import React, { useEffect, useRef, memo, useState } from 'react';
// import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
const toolName = 'Length';

function MeasurementTool(props) {
  const element = props.element;
  const [active, setActive] = useState(false);

  useEffect(() => {
    // cornerstone.enable(element);
    console.log('MeasurementTool mounted')
    console.log(cornerstoneTools.getToolForElement(element, toolName))
    if (!cornerstoneTools.getToolForElement(element, toolName)) {
      console.log('MeasurementTool add')
      // Add the Length tool to the enabled element
      cornerstoneTools.addTool(cornerstoneTools.LengthTool);

      // Set the length tool as the active tool
      // cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 }); // 可拖可画
    }

    return () => {
      // cornerstone.disable(element);
      cornerstoneTools.removeTool(toolName);
    };
  }, []);

  const onClick = () => {
    const tool = cornerstoneTools.getToolForElement(element, toolName);
    console.log(tool)
    console.log(cornerstoneTools.setToolEnabled)
    if (tool && tool.mode === 'active') {
      // 停用Length工具
      // cornerstoneTools.setToolDisabled(toolName); // 不可拖，不可画
      // cornerstoneTools.setToolPassive(toolName); //可以拖不可以画
      cornerstoneTools.setToolDisabled(toolName, {updateOnMouseMove: true}); // 不可拖，不可画（还可能隐藏（右键的时候））
      setActive(false);

    } else {
      // 启用Length工具
      cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
      // cornerstoneTools.setToolEnabled(toolName, { mouseButtonMask: 1 }); // 显示不能操作
      setActive(true);
    }
  }

  console.log('MeasurementTool render')
  return (
    <div>
      长度测量工具<button onClick={onClick}>{!active ? '激活' : '禁用'}（左键）</button>
      <div>当前: {active ? '激活' : '禁用'}</div>
      <hr />
    </div>
  );
}

export default memo(MeasurementTool);
