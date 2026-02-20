import { version as platformVersion } from 'zapier-platform-core';
import authentication from './authentication';
import validateEmail from './actions/validateEmail';
import newValidation from './triggers/newValidation';

const App = {
  version: require('../package.json').version,
  platformVersion,
  authentication,
  triggers: {
    [newValidation.key]: newValidation,
  },
  actions: {
    [validateEmail.key]: validateEmail,
  },
  searches: {},
  creates: {
    [validateEmail.key]: validateEmail,
  },
};

export default App;
