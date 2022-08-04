import React from "react";
import ReactToPrint from "react-to-print";
import {Descriptions, Divider, Row, Col, Table, Space} from "antd";
import moment from "moment";
import {dateTimeFromString, getEmpty, renderNumberFormat} from "../util/Helper";
import {Link} from "react-router-dom";
import PoContentPage from "./PoContentPage";

class PoTrackingPrintContent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {po, multiple} = this.props;
    if (multiple && po) {
      return (
        <div>
          {po.map(item => <PoContentPage key={item.id} po={item}/>)}
        </div>
      )
    } else {
      return <PoContentPage po={po}/>
    }
  }
}


export default PoTrackingPrintContent;
