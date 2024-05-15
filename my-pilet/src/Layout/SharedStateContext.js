/*
 * @Author: Chris
 * @Date: 2023-08-03 15:49:48
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-09 17:06:56
 * @Descripttion: **
 */
import React, { createContext, useState } from 'react';

const SharedStateContext = createContext();

export const SharedStateProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState('1');
  // React.Children.map(children, child=>{
  //   console.log(child,1111,child.type)
  //   React.Children.map(child.props.children, c => {
  //     if(typeof c.type === 'function') {
  //       console.log(c.type)
  //     }
  //     // console.log(c.type())
  //   })
  // })

  return (
    <SharedStateContext.Provider value={{ sharedState, setSharedState }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export default SharedStateContext;