import React, { Component } from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

class App extends Component {
  render() {
   return (
     <BrowserRouter>
      <Switch>
            <Route path="/profile">
              <ProfilePage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </BrowserRouter>
   );
  }
}

export default App;
