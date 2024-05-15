/*
 * @Author: Chris
 * @Date: 2023-08-03 15:56:07
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-15 14:20:48
 * @Descripttion: **
 */
import React, { useContext, useState } from 'react';
import SharedStateContext from '../SharedStateContext'
const Panel = () => {
  const [num, setNum] = useState(0)
  const { sharedState, setSharedState } = useContext(SharedStateContext);

  console.log(sharedState)
  return <div>
   <button onClick={() => setSharedState(sharedState+1)}>changeContext</button>
   <br />
   this is a childComponent
  <br />
  <button onClick={() => setNum(num+1)}>click</button>
  {num}</div>
}

export default Panel