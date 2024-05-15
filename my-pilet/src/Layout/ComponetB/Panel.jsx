/*
 * @Author: Chris
 * @Date: 2023-08-03 15:56:07
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-10 14:56:48
 * @Descripttion: **
 */
import React, { useContext, useState } from 'react';
import SharedStateContext from '../SharedStateContext'
const Panel = () => {
  const [num, setNum] = useState(0)
  const { sharedState, setSharedState } = useContext(SharedStateContext);

  console.log(sharedState)
  return <div onClick={() => setSharedState(123)}>aPanelaPanelaPanelaPanel
  <button onClick={() => setNum(num+1)}>click</button>
  {num}</div>
}

export default Panel