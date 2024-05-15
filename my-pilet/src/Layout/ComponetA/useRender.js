/*
 * @Author: Chris
 * @Date: 2023-08-11 11:46:40
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-14 18:22:01
 * @Descripttion: **
 */
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const useRender = (children, visible = true) => {
  console.log(children, visible,99999)
  const ref = useRef(null)
  useEffect(()=>{
    const ele = document.getElementById('panel');
    console.log(ele)
    if(ele){
      if(visible) {
        ReactDOM.unmountComponentAtNode(ele)
        ref.current = ReactDOM.createPortal(children, ele)
        // ReactDOM.render(children, document.getElementById('panel'))
      }
      // else {
      //   ReactDOM.unmountComponentAtNode(document.getElementById('panel'))
      // }
    }
    return ()=> {
      // ReactDOM.unmountComponentAtNode(document.getElementById('panel'))
    }
  },[children, visible])
  return ref.current
}

export default useRender