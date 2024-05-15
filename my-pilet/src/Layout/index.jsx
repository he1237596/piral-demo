/*
 * @Author: Chris
 * @Date: 2023-07-20 17:42:20
 * @LastEditors: Chris
 * @LastEditTime: 2023-08-16 16:52:38
 * @Descripttion: **
 */
// import logo from './logo.svg';
// import './App.css';

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import { SharedStateProvider } from "./SharedStateContext";
import ComponetA from "./ComponetA";
import ComponetB from "./ComponetB";
import "./index.css";

function App() {
  const ref = useRef(null);
  const [active, setActive] = useState("a");
  const [loaded, setLoaded] = useState(false);
  const [num, setNum] = useState(0);

  const [elements, setElements] = useState([
    {
      name: "a",
      componet: (props) => <ComponetA {...props} name='a' />
    },
    { name: "b", componet: (props) => <ComponetB name='b' /> },
    { name: "c", componet: (props) => <ComponetB name='c' /> },
    { name: "d", componet: (props) => <ComponetB name='d' /> },
    { name: "e", componet: (props) => <ComponetA {...props} name='e' /> },
    { name: "f", componet: (props) => <ComponetB name='f' /> },
    { name: "g", componet: (props) => <ComponetB name='g' /> },
    {
      name: "h",
      componet: (props) => <ComponetB name='g' />
    },
    {
      name: "i",
      componet: (props) => <ComponetA {...props} name='i' />
    },
  ]);

  const btns = useMemo(() => {
    const temp = elements.filter((item) => !item.active);
    if (active === '') {
      return temp
    }
    const activeIndex = temp.findIndex((item) => item.name === active)
    const targetIndex = Math.floor(activeIndex / 3 + 1) * 3;
    if (temp[activeIndex]) {
      temp.splice(targetIndex, 0, {
        isPanel: true,
        activeIndex,
        componet: () => temp[activeIndex].childComponet,
        name: "active",
      });
    }
    return temp;
  }, [active, elements]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="App">
      <div>{num}</div>
      <div>
        <button onClick={()=>setNum(num+1)}>点击修改num</button>
      </div>
      <div className="container">
        <SharedStateProvider>
          {btns.map((item, index) =>
            item.isPanel ? (
              <div
                id="panel"
                className={`containerItem panel`}
                key={item.name}
              ></div>
            ) : (
              <div
                className={`containerItem ${
                  item.name === active ? "active" : ""
                }`}
                onClick={() => {
                  if (item.name !== active)
                  setActive(item.name)
                }}
                key={item.name}
              >
                {item.componet({ loaded, visible: active === item.name, setActive })}
              </div>
            )
          )}
        </SharedStateProvider>
      </div>
    </div>
  );
}

export default App;
