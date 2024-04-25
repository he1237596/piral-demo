import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";
import * as cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import Hammer from "hammerjs";
import queryString from 'query-string';
import request from '../request';

const host = 'http://192.168.18.196:16600';
const prefix = '/api/main'

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser
cornerstoneWADOImageLoader.configure({
  beforeSend: function(xhr) {
    xhr.setRequestHeader("pv-token", localStorage.getItem('token'))
  }
})
cornerstoneTools.external.Hammer = Hammer;
cornerstoneTools.init({
  // 当元素被启用时，是否监听鼠标事件
  mouseEnabled: true,
  // 当元素被启用时，是否监听触摸事件
  touchEnabled: true,
  // 全局工具同步
  globalToolSyncEnabled: true,
  // 显示svg光标
  showSVGCursors: true,
  // 自动调整视口大小
  autoResizeViewports: true,
  // 虚线样式
  lineDash: [4, 4]
});

function CornerstoneElement(props) {
  const [viewport, setViewport] = useState(cornerstone.getDefaultViewport(null, undefined));
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    const element = elementRef.current;

    const onImageRendered = () => {
      const newViewport = cornerstone.getViewport(elementRef.current);
      setViewport(newViewport);
    };
    element.addEventListener("cornerstoneimagerendered", onImageRendered);
    const fetchToken = async () => {
      try {
        const response = await request(`/user/sign_in`,{
          method: 'post',
          data:  {
            password: "35cf7482ea7d2f8645bd3dcbef3f7be3d3f18282be881f8a7e7f4466a471ab99",
            username: "Sadmin"
          }
        });
        localStorage.setItem('token', response.data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    const getDicomUlr = (patient = {}) => {
      const seriesInfos = [

      ]
      const seriesDicomUrls = []
      if(patient.cases.length > 0) {
        patient.cases.forEach(caseItem => {
          caseItem.series.forEach(seriesItem => {
            const Info = [];
            const dicomUrls = [];
            console.log(seriesItem.sop_instance_list)
            const list = seriesItem.sop_instance_list;
            if (Object.keys(seriesItem.sop_instance_list).length > 0) {
              Object.keys(seriesItem.sop_instance_list).forEach((key) => {
                const instanceItem = list[key]
                const dicom= {
                    requestType: "WADO",
                    studyUID: caseItem.study_instance_uid,
                    seriesUID: seriesItem.series_instance_uid,
                    objectUID: instanceItem.sop_UID ,
                    type: "application/dicom",
                    collectionId: seriesItem.fk_collection_id,
                    patientId: seriesItem.fk_patient_id,
                    contentType: "dcm-jpeg",
                    index: parseInt(key)
                }
                // console.log(dicom)
                Info.push(dicom)
                dicomUrls.push(`wadouri:${host}${prefix}/wado?${queryString.stringify(dicom)}`)
              })
              seriesInfos.push(Info)
              seriesDicomUrls.push(dicomUrls)
            }
          })
        })
      }
      return seriesDicomUrls
    }

    const fetchData = async () => {
      try {
        await fetchToken();
        const response = await request(`/patient/37317ff0-47c2-4372-b4d4-43b35018df3c/all`);
        console.log(response);
        const seriesUrls = getDicomUlr(response.data);
        console.log(seriesUrls);
        renderNextImage(seriesUrls[0]);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };


    const renderNextImage = (imageIds) => {
      let currentIndex = 0;
      console.log(imageIds[currentIndex])
      const renderNextFrame = () => {
        cornerstone.loadImage(imageIds[currentIndex]).then(image => {
          cornerstone.displayImage(element, image);
        });
        currentIndex = (currentIndex + 1) % imageIds.length;
        // requestAnimationFrame(renderNextFrame);
      };
      renderNextFrame();
    };

    cornerstone.enable(element);
    fetchData();
    return () => {
      cornerstone.disable(element);
      element.removeEventListener("cornerstoneimagerendered", onImageRendered);
    };
  }, []);

  useLayoutEffect(() => {


  }, [])

  return (
    <div>
      <div
        className="viewportElement"
        style={{
          width: "512px",
          height: "512px",
          position: "relative",
          color: "white"
        }}
        ref={elementRef}
      >
        <canvas className="cornerstone-canvas" />
        <div style={{ bottom: "5px", left: "5px", position: "absolute", color: "white" }}>Zoom: {viewport.scale}</div>
        <div style={{ bottom: "5px", right: "5px", position: "absolute", color: "white" }}>WW/WC: {viewport.voi.windowWidth} / {viewport.voi.windowCenter}</div>
      </div>
    </div>
  );
}

export default CornerstoneElement;
