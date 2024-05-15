import React, { useEffect } from 'react';
import queryString from 'query-string';
import request from '../../request';
import { host, prefix, patientId } from '../../config';
import View from './View';
// import MeasureTool from '../MeasureTool'
const Wrap = (props) => {
  const [stack, setStack] = React.useState( );
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
    const seriesInfos = []
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
      const response = await request(`/patient/${patientId}/all`);
      console.log(response);

      const seriesUrls = getDicomUlr(response.data);
      console.log(seriesUrls);
      setStack({
        currentImageIdIndex: 0,
        // 暂时是单序列数据
        imageIds: seriesUrls[0],
      })
      console.log(seriesUrls, 111111, 'ddddd')
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  useEffect(() => {
    fetchData()
  }, []);
  return <div>
    <View {...stack} />
  </div>
}

export default Wrap;