import React from "react";
import Barcode from 'react-barcode';
import {getWindowDimensions, zeroText} from "../util/Helper";

class PoStampPrintContent extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Barcode
        width={1}
        height={50}
        marginTop={15}
        marginBottom={10}
        marginLeft={10}
        marginRight={10}
        fontSize={5}
        displayValue={this.props.showText}
        key={this.props.key}
        text={this.props.barcode}
        value={`${this.props.barcode}`}
      />
    )
  }
}


export default PoStampPrintContent;
