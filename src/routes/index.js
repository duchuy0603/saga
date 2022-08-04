import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";
import NotFoundPage from "./NotFoundPage";
import {getRoutes} from "./routes";

const App = ({match}) => {

  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        {getRoutes().map((value, index) => {
          return (
            !value.items ?
              <Route
                exact={value.exact ? true : false}
                key={`ridx_${index}`}
                path={`${match.url}${value.path}`}
                component={asyncComponent(() => value.component)}
              />
              : value.items.map((item, key) => {
                return (
                  <Route
                    exact={item.exact ? true : false}
                    key={`ridx_${index}_${key}`}
                    path={`${match.url}${item.path}`}
                    component={asyncComponent(() => item.component)}
                  />
                )
              })
          )
        })}
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
};

export default App;
