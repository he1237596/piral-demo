import * as React from 'react';
import Viewport from './viewport';
import ViewportMpr from './viewportMpr';
import styles from './style.less'
// import { host, port } from '../config';
console.log(styles, 999999)
const imageId =
  "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg";
const stack = {
  imageIds: [imageId],
  currentImageIdIndex: 0
};

// const ddd1 = 'wadouri:http://192.168.18.231:16600/api/main/wado?seriesId=3f689dde-7043-457e-bc0c-0474bd86de0e&requestType=WADO&type=axial&contentType=dcm-jpeg'
// const ddd2 = 'wadouri:http://192.168.18.231:16600/api/main/wado?seriesId=3f689dde-7043-457e-bc0c-0474bd86de0e&requestType=WADO&type=coronal&contentType=dcm-jpeg'
// const ddd3 = 'wadouri:http://192.168.18.231:16600/api/main/wado?seriesId=3f689dde-7043-457e-bc0c-0474bd86de0e&requestType=WADO&type=sagittal&contentType=dcm-jpeg'
const ddd1 = 'wadouri:http://192.168.18.232:16600/api/main/wado?seriesId=c7a788ad-aef9-4a21-aee0-ad7ff8f84cb0&requestType=WADO&type=axial&contentType=dcm-jpeg&index=100'
const ddd2 = 'wadouri:http://192.168.18.232:16600/api/main/wado?seriesId=c7a788ad-aef9-4a21-aee0-ad7ff8f84cb0&requestType=WADO&type=coronal&contentType=dcm-jpeg&index=100'
const ddd3 = 'wadouri:http://192.168.18.232:16600/api/main/wado?seriesId=c7a788ad-aef9-4a21-aee0-ad7ff8f84cb0&requestType=WADO&type=sagittal&contentType=dcm-jpeg&index=100'

const stack1 = {
  imageIds: [ddd1],
  currentImageIdIndex: 0
};
const stack2 = {
  imageIds: [ddd2],
  currentImageIdIndex: 0
};
const stack3 = {
  imageIds: [ddd3],
  currentImageIdIndex: 0
};
const Container = () => (
  <div>
    <Viewport />
    {/* <div className={styles.container}>
      <div>
        <ViewportMpr stack={{ ...stack1 }} />
      </div>
      <div>
        <ViewportMpr stack={{ ...stack2 }} />
        <ViewportMpr stack={{ ...stack3 }} />
      </div>
    </div> */}

  </div>
);

export default Container;