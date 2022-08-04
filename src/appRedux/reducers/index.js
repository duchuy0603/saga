import {combineReducers} from "redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Common from "./Common";
import Product from "./Product";
import {connectRouter} from 'connected-react-router'
import Inventory from "./Inventory";
import Warehouse from "./Warehouse";
import Customer from "./Customer";
import Vendor from "./Vendor";
import Manufacture from "./Manufacture";
import Shipping from "./Shipping";
import Order from "./Order";
import poPayment from "./PoPayment";
import Brand from "./Brand";
import Tag from "./Tag";
import Carrier from "./Carrier";
import Account from "./Account";
import Adjustment from "./Adjustment";

export default (history) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  auth: Auth,
  common: Common,
  product: Product,
  warehouse: Warehouse,
  inventory: Inventory,
  customer: Customer,
  vendor: Vendor,
  manufacture: Manufacture,
  shipping: Shipping,
  order: Order,
  brand: Brand,
  poPayment: poPayment,
  account: Account,
  tag: Tag,
  carrier: Carrier,
  adjustment: Adjustment
});
