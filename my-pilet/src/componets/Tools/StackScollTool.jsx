import React, { useEffect, useRef, memo, useState } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
const toolName = 'StackScroll';
// const StackScrollTool = cornerstoneTools.StackScrollTool;

function Index(props) {
  const { element, currentImageIdIndex, imageIds } = props;
  const [active, setActive] = useState(true);
  const ref = useRef(null)
  useEffect(() => {
    // cornerstone.enable(element);
    console.log('StackScrollTool mounted')
    console.log(cornerstoneTools.getToolForElement(element, toolName))
    if (!cornerstoneTools.getToolForElement(element, toolName)) {
      console.log('StackScrollTool add')
      // cornerstoneTools.addTool(cornerstoneTools[`${toolName}Tool`]);
      // cornerstoneTools.addStackStateManager(element, ["stack"]);
      // cornerstoneTools.addTool(cornerstoneTools.StackScrollTool, {
      //   configuration: {
      //     loop: true,
      //     allowSkipping: true
      //   }
      // });
      cornerstoneTools.addTool(cornerstoneTools.StackScrollMouseWheelTool, {
        configuration: {
          loop: true,
          allowSkipping: true,
          invert: false
        }
      });
  console.log(cornerstoneTools.getToolForElement(element, 'StackScrollMouseWheel'), 4444444444)

      // cornerstoneTools.setToolActive("StackScroll", { mouseButtonMask: 4 });
      cornerstoneTools.setToolActive("StackScrollMouseWheel", {
        mouseButtonMask: 4
      });
    }
    return () => {
      // cornerstone.disable(element);
      cornerstoneTools.removeTool(toolName);
    };
  }, []);

  const onClick = () => {
    const tool = cornerstoneTools.getToolForElement(element, 'StackScrollMouseWheel');
    console.log(tool)
    console.log(cornerstoneTools.setToolEnabled)
    if (tool && tool.mode === 'active') {
      // 停用Length工具
      // cornerstoneTools.setToolDisabled(toolName); // 不可拖，不可画
      // cornerstoneTools.setToolPassive(toolName); //可以拖不可以画
      cornerstoneTools.setToolDisabled('StackScrollMouseWheel'); // 不可拖，不可画（还可能隐藏（右键的时候））
      setActive(false);

    } else {
      // 启用Length工具
      cornerstoneTools.setToolActive('StackScrollMouseWheel', { mouseButtonMask: 4 });

      // cornerstoneTools.setToolEnabled(toolName, { mouseButtonMask: 1 }); // 显示不能操作
      setActive(true);
    }
  }

  const onClickSlider = (e) => {
      const imageIdIndex = parseInt(ref.current.value, 10);
      const stackToolData = cornerstoneTools.getToolState(element, 'stack');
      console.log(stackToolData)
      if (!stackToolData || !stackToolData.data || !stackToolData.data.length) {
          return;
      }
      const stack = stackToolData.data[0];

      // 处理滚动事件，例如更新当前图像索引
      stack.currentImageIdIndex = imageIdIndex;
      cornerstone.loadAndCacheImage(imageIds[imageIdIndex]).then(image => {
          cornerstone.displayImage(element, image);
      });
  };

  console.log('StackScrollTool render')
  return (
    <div>
      滚图工具<button onClick={onClick}>{!active ? '激活' : '禁用'}（滑轮）</button>
      <div>当前: {active ? '激活' : '禁用'}</div>
      <input type="range" onChange={onClickSlider} ref={ref} id="stackSlider" min="0" max="30" step="1" defaultValue='0' style={{ width: 512 }} />
      <hr />
    </div>
  );
}

export default memo(Index);
