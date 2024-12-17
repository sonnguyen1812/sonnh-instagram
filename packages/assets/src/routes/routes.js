import React, {Suspense} from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from '@assets/loadables/Home/Home';
import NotFound from '@assets/loadables/NotFound/NotFound';
import Samples from '@assets/loadables/Samples/Samples';
import {routePrefix} from '@assets/config/app';
import Loading from '@assets/components/Loading';

// eslint-disable-next-line react/prop-types
const Routes = ({prefix = routePrefix}) => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path={prefix + '/'} component={Home} />
      <Route exact path={prefix + '/samples'} component={Samples} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Suspense>
);

export default Routes;
