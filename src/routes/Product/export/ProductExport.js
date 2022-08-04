import React, {useEffect} from 'react';
import ReactExport from "react-export-excel";
import {Button} from "antd";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const ProductExport = ({data, page}) => {
  const newData = [];

  useEffect(() => {
    if (data) {
      data.map(item => {
        newData.push(item);
        if (item?.childrens !== null && item?.childrens?.length > 0) {
          item.childrens.map(children => {
            newData.push(children);
          });
        }
      });
    }
  }, [newData]);
  return (
    <ExcelFile filename={`Uoa_product_page_${page}`}
               element={<Button size={`small`} danger type={`dashed`}>Xuất excel</Button>}>
      <ExcelSheet data={newData} name={'Sản phẩm'}>
        <ExcelColumn label={'Sản phẩm'} value={`name`}/>
        <ExcelColumn label={'Hình ảnh'} value={`image_url`}/>
        <ExcelColumn label={'Sku'} value={`sku`}/>
        <ExcelColumn label={'Khối lượng'} value={`weight`}/>
        <ExcelColumn label={'Platform'} value={`platform`}/>
        <ExcelColumn label={'Barcode'} value={`barcode`}/>
        <ExcelColumn label={'Nhà sản xuất'} value={`manufacture_name`}/>
        <ExcelColumn label={'Đơn vị'} value={`unit`}/>
        <ExcelColumn label={'Cảnh báo tồn tổng'} value={`stock_warn`}/>
        <ExcelColumn label={'Giá'} value={`price`}/>
        <ExcelColumn label={'UPC'} value={`upc`}/>
        <ExcelColumn label={'USBN'} value={`usbn`}/>
        <ExcelColumn label={'EAN'} value={`ean`}/>
        <ExcelColumn label={'MPN'} value={`mpn`}/>
      </ExcelSheet>
    </ExcelFile>
  )
}
export default ProductExport;
