/*
 * @Author: Chris
 * @Date: 2023-08-03 15:55:55
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-15 14:14:40
 * @Descripttion: **
 */
import React, { useContext, useState, useEffect } from 'react';

// const ChildCom = (props) => {
//   const { visible } = props
//   return <div>
//     childCom
//     <div>visible: {visible}</div>
//   </div>
// }

// const Modal = ({ children }) => {
//   return ReactDOM.createPortal(
//     children,
//     document.getElementById('dd')
//   );
// };
const Index = ({name}) => {
  const [num, setNum] = useState(0)
  return (
    <div>{name}
      <div>{num}</div>
      <button onClick={()=>setNum(num+1)}>click</button>
    </div>
  )
}

export default Index;