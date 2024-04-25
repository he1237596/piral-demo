import * as React from 'react';
import Viewport from './viewport';

const imageId =
  "https://rawgit.com/cornerstonejs/cornerstoneWebImageLoader/master/examples/Renal_Cell_Carcinoma.jpg";
const stack = {
  imageIds: [imageId],
  currentImageIdIndex: 0
};

const Container = () => (
  <div>
    <h2>Cornerstone React Component Example</h2>
    <Viewport stack={{ ...stack }} />
  </div>
);

export default Container;