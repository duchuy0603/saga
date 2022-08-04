import {all} from "redux-saga/effects";
import authSagas from "./Auth";
import notesSagas from "./Notes";
import commonSagas from './Common';
import productSagas from './Product';
import inventorySagas from './Inventory';
import customerSagas from './Customer';
import manufactureSagas from './Manufacture';
import vendorSagas from './Vendor';
import OrderSagas from './Order';
import BrandSagas from './Brand';
import TagSagas from './Tag';
import CarrierSagas from './Carrier';
import AccountSagas from './Account';
import AdjustmentSagas from './Adjustment';


export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    notesSagas(),
    commonSagas(),
    productSagas(),
    inventorySagas(),
    customerSagas(),
    manufactureSagas(),
    vendorSagas(),
    OrderSagas(),
    BrandSagas(),
    TagSagas(),
    AccountSagas(),
    CarrierSagas(),
    AdjustmentSagas()
  ]);
}
