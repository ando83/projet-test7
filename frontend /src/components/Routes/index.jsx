import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from '../../pages/Login';
import Signup from '../../pages/Signup';
import Message from '../../pages/Message';
import Profile from '../../pages/Profile';

function Index() {
  return (
    <Router>
      <Switch>
       <Route path="/" exact component={Login} />
       <Route path="/signup" exact component={Signup} />
       <Route path="/message" exact component={Message} />
       <Route path="/profile" exact component={Profile} />
      </Switch>
    </Router>
  );
};

export default Index;