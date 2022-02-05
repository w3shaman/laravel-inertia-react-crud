// require('./bootstrap');

import React from 'react';
import { render } from 'react-dom';
import { InertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';

import 'bulma/css/bulma.min.css';

InertiaProgress.init();

const app = document.getElementById('app');

render(
  <InertiaApp
    initialPage={JSON.parse(app.dataset.page)}
    resolveComponent={name =>
      import(`./Pages/${name}`).then(module => module.default)
    }
  />,
  app
);
