/*
 * @Author: Chris
 * @Date: 2023-08-03 15:55:55
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-16 15:56:45
 * @Descripttion: **
 */
import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import SharedStateContext from '../SharedStateContext'
// import ReactDOMClient from "react-dom/client"
// import useRender from './useRender';

const ChildCom = (props) => {
  const { num, a } = props
  console.log(num, a)
  useEffect(() =>{
    console.log('mounted')
    return () => {
    console.log('unmounted')
    }
  }, [])
  return <div>
  this is a childComponent
  <div>num: {num}</div>
</div>
}

// const Portal = (props) => {
//   console.log(props)
//   const ele = document.getElementById('panel');
//   if(ele) {
//       return ReactDOM.createPortal(
//         props.children,
//         document.getElementById('panel')
//       );
//   }
//   return null;
// };

const PortalWrapper = ({children}) => {
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
      setLoaded(true);
    }, [])
    return loaded && ReactDOM.createPortal(
      children,
      document.getElementById('panel')
    )
}

const Index = ({loaded, visible, name, setActive}) => {
  const [num, setNum] = useState(0)
  const { sharedState, setSharedState } = useContext(SharedStateContext);
  const ref = useRef(null)

  // useEffect(() => {
  //   const ele = document.getElementById('panel');
  //   // if(ele) {
  //     // return ReactDOM.createPortal(
  //     //   ChildCom,
  //     //   document.getElementById('panel')
  //     // );
  //   // }
  //   const root = ReactDOMClient.createRoot(ele)
  //   root.render(<ChildCom a={1}  visible={visible}  num={num} />)
  // },[visible, num])
  // const Child = useRender(ChildCom, visible)

  // const renderChild = () => {
  //   return ReactDOM.createPortal(
  //     <ChildCom a={1}  visible={visible}  num={num} />,
  //     document.getElementById('panel')
  //     // document.body,
  //   )
  // }

  useEffect(()=>{

  }, [])

  return <div ref={ref}>
    {name}
    <button onClick={()=>setNum(num + 1)}>{num}</button>
    <button onClick={()=>setActive('')}>收起面板</button>
    <button onClick={()=>{setSharedState(sharedState-1)}}>修改顶层共享数据{sharedState}</button>
    {/* <button onClick={()=>setVisible(!visible)}>toggle</button> */}
    {/* {visible &&
      <Modal visible={visible}>
        <div>这是插入的哦哦哦哦哦哦</div>
        <ChildCom a={1}  visible={visible}  num={num} />
      </Modal>
    } */}
    {/* {visible && <Portal>
      <ChildCom a={1}  visible={visible}  num={num} />
    </Portal>} */}
    {
      visible && <PortalWrapper>
        <ChildCom a={1}  num={num} />
      </PortalWrapper>
    }
    </div>
}

export default Index;