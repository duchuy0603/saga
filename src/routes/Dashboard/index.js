import React, {Component} from "react";
import {connect} from "react-redux";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h2 className="title gx-mb-4">Home page</h2>

        <div className="gx-d-flex justify-content-center">
          <h4>Start building your app. Happy Coding!</h4>
        </div>

      </div>
    )
  }
}

export default connect(null, null)(Dashboard);
