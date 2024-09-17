// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Connect } from '@stacks/connect-react';
import { UserSession, AppConfig } from '@stacks/auth';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Stake from './pages/Stake';
import Challenges from './pages/Challenges';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

function App() {
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'FlexSTX',
          icon: '/logo.png',
        },
        redirectTo: '/',
        userSession,
      }}
    >
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/stake" component={Stake} />
            <Route path="/challenges" component={Challenges} />
          </Switch>
        </div>
      </Router>
    </Connect>
  );
}

export default App;