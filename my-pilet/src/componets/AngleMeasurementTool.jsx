import React, { useEffect, useRef, memo } from 'react';
// import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
const toolName = 'Angle';
function AngleMeasurementTool(props) {
  const element = props.element;

  useEffect(() => {
        // cornerstone.enable(element);
    console.log('AngleMeasurementTool mounted')

    // cornerstone.enable(element);
    if (!cornerstoneTools.getToolForElement(element, toolName)) {
    // Add the Angle tool to the enabled element
    cornerstoneTools.addTool(cornerstoneTools.AngleTool);

    // Set the angle tool as the active tool
    cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 2 });
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
      cornerstoneTools.setToolDisabled(toolName); // 不可拖，不可画（还可能隐藏（右键的时候））

    } else {
      // 启用Length工具
      cornerstoneTools.setToolActive(toolName, { mouseButtonMask: 1 });
      // cornerstoneTools.setToolEnabled(toolName, { mouseButtonMask: 1 }); // 显示不能操作
    }
  }
  console.log('AngleMeasurementTool render')

  return (
    <div>
      角度测量工具<button onClick={onClick}>激活/禁用（右键）</button>
    </div>
  );
}

export default memo(AngleMeasurementTool);
