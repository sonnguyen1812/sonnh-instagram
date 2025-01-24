// packages/assets/src/loadables/Samples/Samples.js
import React from 'react';

const SampleLoadable = React.lazy(() => import('../../pages/Samples/Samples'));

export default SampleLoadable;
