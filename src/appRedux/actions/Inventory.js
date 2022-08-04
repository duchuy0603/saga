import {GET_PO_DETAIL, SET_STATE_ORDER} from "../../constants/ActionTypes";
import {message} from 'antd';
import {reqSavePrintCount} from "../services/inventory";

export const getDetailPo = (poId) => {
  return {
    type: GET_PO_DETAIL,
    payload: {
      poId
    }
  }
    ;
};
export const onCountPrint = async (purchaseOrders = []) => {
  try {
    if (purchaseOrders.length === 0) {
      message.error('Không có phiếu in!');
      return;
    }
    const ids = [];
    purchaseOrders.map((purchase) => ids.push(purchase.id));
    await reqSavePrintCount({
      poIds: ids
    })
  } catch (e) {
    console.log("Error count print: ", e.message);
  }
}
