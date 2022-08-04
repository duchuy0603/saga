import React from 'react';
import {
  AuditOutlined, CarOutlined,
  CheckCircleOutlined,
  DropboxOutlined,
  ExceptionOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import {toInt} from "../util/Helper";

export const formWrap = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 18},
  },
  labelAlign: 'left',
}
export const WH_TYPE_VALID = 'valid';
export const WH_TYPE_EXCHANGE = 'exchange';
export const WH_TYPE_MAIN = 'main';

export const CUSTOMER_TYPE_CUSTOMER = 'customer';
export const CUSTOMER_TYPE_VENDOR = 'vendor';
export const CUSTOMER_TYPE_MANUFACTURE = 'manufacture';

export const STATUS = {
  WAREHOUSE: {
    ACTIVE: 'active',
    DE_ACTIVE: 'de-active',
    DRAFT: 'draft'
  }
};

export const CUSTOMER_TYPE = [
  {label: 'Khách hàng', key: CUSTOMER_TYPE_CUSTOMER},
  {label: 'Nhà sản xuất', key: CUSTOMER_TYPE_MANUFACTURE},
  {label: 'Nhà cung cấp', key: CUSTOMER_TYPE_VENDOR},
];
export const formMsg = {
  require: '${label} bắt buộc',
  type: {
    email: '&{label} không hợp lệ',
    number: '&{label} không hợp lệ',
  }
}

export const SERVICE_PRODUCT = 'product';
export const SERVICE_INVENTORY = 'inventory';
export const SERVICE_CUSTOMER = 'customer';
export const SERVICE_ORDER = 'order';
export const SERVICE_AUTH = 'auth';

export const TRANSACTION_IMPORT = 'import';

export const selectFilterSort = (optionA, optionB) => {
  return optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase());
}

export const selectFilterOption = (input, option) => {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export const GATE_WAYCODE = [
  {
    name: "COD",
    code: 'cod',
  },
  {
    name: "Ngân hàng",
    code: 'bankdeposit',
  },
];

export const ORDER_STATUS_CONFIRM = 'confirmed';
export const ORDER_STATUS_UNCLOSED = 'unclosed';
export const ORDER_STATUS_CLOSED = 'closed';
export const ORDER_STATUS_UNCANCELLED = 'uncancelled';
export const ORDER_STATUS_CANCELLED = 'cancelled';
export const ORDER_STATUS_DELETED = 'deleted';

export const HARAVAN_FINANCE_PAID = 'paid';
export const HARAVAN_FINANCE_REFUNDED = 'refunded';
export const HARAVAN_FINANCE_PENDING = 'pending';
export const HARAVAN_ORDER_FINANCE_STATUS = [
  {
    name: "Đã thanh toán",
    code: HARAVAN_FINANCE_PAID,
    color: "green",
    stepProcess: 'finish',
  },
  {
    name: "Hoàn trả",
    code: HARAVAN_FINANCE_REFUNDED,
    color: "red",
    stepProcess: 'finish',
  },
  {
    name: "Chờ xử lý",
    code: HARAVAN_FINANCE_PENDING,
    color: "cyan",
    stepProcess: 'wait',
  },
];

export const HARAVAN_FF_NOT_FULFILL = 'not_fulfilled';
export const HARAVAN_FF_PARTIAL = 'partial';
export const HARAVAN_FF_FULFILLED = 'fulfilled';
export const HARAVAN_FF_STATUS = [
  {
    name: "Chưa hoàn thành",
    code: HARAVAN_FF_NOT_FULFILL,
    color: "green",
    stepProcess: 'finish',
  },
  {
    name: "1 phần",
    code: HARAVAN_FF_PARTIAL,
    color: "red",
    stepProcess: 'finish',
  },
  {
    name: "Hoàn thành",
    code: HARAVAN_FF_FULFILLED,
    color: "cyan",
    stepProcess: 'wait',
  },
];

export const FULFILL_STATUS_UN_FULFILL = '0_unfulfill';
export const FULFILL_STATUS_FULFILLED = '1_fulfilled';
export const FULFILL_STATUS_DELIVERING = '2_delivering';
export const FULFILL_STATUS_DELIVERED = '3_delivered';
export const FULFILL_STATUS_END = '4_end';

export const FULFILLMENT_STATUS = [
  {
    name: "Đang giao",
    code: FULFILL_STATUS_DELIVERING,
    color: "cyan",
    stepProcess: 'process',
  },
  {
    name: "Đã giao đến nơi",
    code: FULFILL_STATUS_DELIVERED,
    color: "cyan",
    stepProcess: 'process',
  },
  {
    name: "Đang xử lý",
    code: FULFILL_STATUS_FULFILLED,
    color: "yellow",
    stepProcess: 'process',
  },
  {
    name: "Chưa xử lý",
    code: FULFILL_STATUS_UN_FULFILL,
    color: "red",
    stepProcess: 'wait',
  },
  {
    name: "Đã giao đến nơi",
    code: FULFILL_STATUS_DELIVERED,
    color: "green",
    stepProcess: 'wait',
  },
  {
    name: "Kết thúc",
    code: FULFILL_STATUS_END,
    color: "grey",
    stepProcess: 'finish',
  }
];

export const ORDER_SOURCE_STATUS = [
  {
    name: "Facebook",
    code: 'fb',
  },
  {
    name: "Lazada",
    code: 'lazada',
  },
  {
    name: "zalo",
    code: 'Zalo',
  },
  {
    name: "Web",
    code: 'web',
  },
  {
    name: "pos",
    code: 'Pos',
  }
];

//Order Transaction
export const PAYMENT_STATUS_PENDING = '1_ip';
export const PAYMENT_STATUS_PARTIAL = '2_partial';
export const PAYMENT_STATUS_SUCCESS = '3_success';
export const PAYMENT_STATUS_CANCEL = '4_cancelled';
export const PAYMENT_STATUS = [
  {
    name: "Chờ xử lý",
    code: PAYMENT_STATUS_PENDING,
    color: "cyan"
  },
  {
    name: "Trả 1 phần",
    code: PAYMENT_STATUS_PARTIAL,
    color: "cyan"
  },
  {
    name: "Hoàn thành",
    code: PAYMENT_STATUS_SUCCESS,
    color: "green"
  },
  {
    name: "Hủy",
    code: PAYMENT_STATUS_CANCEL,
    color: "red"
  },
];

export const PLATFORM_DEFAULT = 'default';
export const PLATFORM_HARAVAN = 'haravan';
export const PLATFORM_SHOPEE = 'shopee';
export const PAYMENT_SOURCE = [
  {
    name: 'Mặc định',
    code: PLATFORM_DEFAULT
  },
  {
    name: 'Haravan',
    code: PLATFORM_HARAVAN
  },
  {
    name: 'Shopee',
    code: PLATFORM_SHOPEE
  }
];

export const PO_STT_WAIT_CONFIRM = '1_w_cf';
// export const PO_STT_CONFIRM = '2_confirm';
// export const PO_STT_INPOGRESS = 'inprogress';
export const PO_STT_WAIT_FULFILLMENT = "2_w_ff";
export const PO_STT_WAIT_TRACKING = '3_w_tr';
export const PO_STT_WAIT_PICKUP = '4_w_pickup';
export const PO_STT_DELIVERING = '5_d_ing';
export const PO_STT_DELIVERED = '6_d_ed';
export const PO_STT_SUCCESS = '7_success';
export const PO_STT_CANCEL = '8_cancel';

export const PO_STT_LIST = [
  {key: PO_STT_WAIT_CONFIRM, label: 'Wait confirm'},
  {key: PO_STT_WAIT_FULFILLMENT, label: 'Wait fulfillment'},
  {key: PO_STT_WAIT_TRACKING, label: 'Wait tracking'},
  {key: PO_STT_WAIT_PICKUP, label: 'Wait pickup'},
  {key: PO_STT_DELIVERED, label: 'Delivered'},
  {key: PO_STT_SUCCESS, label: 'Success'},
  {key: PO_STT_CANCEL, label: 'Cancel'},
];


export const PO_STATUS = [
  {
    name: "Chờ xác nhận",
    code: PO_STT_WAIT_CONFIRM,
    color: "yellow"
  },
  {
    name: "Chờ ĐVVC",
    code: PO_STT_WAIT_FULFILLMENT,
    color: "orange"
  },
  {
    name: "Chờ mã vận đơn",
    code: PO_STT_WAIT_TRACKING,
    color: "orange"
  },
  {
    name: "Chờ giao cho ĐVVC",
    code: PO_STT_WAIT_PICKUP,
    color: "orange"
  },
  // {
  //   name: "Đang xử lý",
  //   code: PO_STT_INPOGRESS,
  //   color: "cyan"
  // },
  {
    name: "Đang vận chuyển",
    code: PO_STT_DELIVERING,
    color: "blue"
  },
  {
    name: "Đã nhận hàng",
    code: PO_STT_DELIVERED,
    color: "geekblue"
  },
  {
    name: "Hủy",
    code: PO_STT_CANCEL,
    color: "red"
  },
  {
    name: "Thành công",
    code: PO_STT_SUCCESS,
    color: "green"
  },
];

export const STOCK_CHECK_STT_DRAFT = "0_draft";
export const STOCK_CHECK_STT_CANCEL = "2_cancel";
export const STOCK_CHECK_STT_CONFIRM = "1_confirm";
export const STOCK_CHECK_STATUS = [
  {name: 'Nháp', code: STOCK_CHECK_STT_DRAFT, color: 'yellow'},
  {name: 'Xác nhận', code: STOCK_CHECK_STT_CONFIRM, color: 'green'},
  {name: 'Hủy', code: STOCK_CHECK_STT_CANCEL, color: 'red'},
];

export const PO_ST_C_UN_CHECK = '1_un_check';
export const PO_ST_C_IN_PROGRESS = '2_inprogress';
export const PO_ST_C_DONE = '3_done';
export const PO_ST_C_STATUS = [
  {name: 'Chưa kiểm', code: PO_ST_C_UN_CHECK, color: 'red'},
  {name: 'Đang kiểm', code: PO_ST_C_IN_PROGRESS, color: 'yellow'},
  {name: 'Hoàn thành', code: PO_ST_C_DONE, color: 'green'},
];

export const PO_UN_PACKED = '1_un_packed';
export const PO_PACKING = '2_packing';
export const PO_PACKING_DONE = '3_done';
export const PO_PACKING_STATUS = [
  {name: 'Chưa đóng gói', code: PO_UN_PACKED, color: 'red'},
  {name: 'Đang đóng gói', code: PO_PACKING, color: 'yellow'},
  {name: 'Đã đóng gói', code: PO_PACKING_DONE, color: 'green'},
];

export const PO_WAIT_DELIVER = 'wait_deliver';
export const PO_DELIVERED = 'delivered';
export const PO_DELIVERING = 'delivering';
export const PO_DELIVER_STATUS = [
  {name: 'Chờ giao hàng', code: PO_WAIT_DELIVER, color: 'red'},
  {name: 'Đang giao hàng', code: PO_DELIVERING, color: 'yellow'},
  {name: 'Đã giao', code: PO_DELIVERED, color: 'green'},
];

export const ORDER_TRANS_TYPE_PAID = 'paid';
export const ORDER_TRANS_TYPE_DEPOSIT = 'deposit';
export const ORDER_TRANS_TYPE_REFUND = 'refund';
export const ORDER_TRANS_TYPE = [
  {
    name: "Thanh toán",
    code: ORDER_TRANS_TYPE_PAID,
    color: 'cyan'
  },
  {
    name: "Đặt cọc",
    code: ORDER_TRANS_TYPE_DEPOSIT,
    color: 'cyan'
  },
  {
    name: "Hoàn tiền",
    code: ORDER_TRANS_TYPE_REFUND,
    color: 'red'
  }
];


export const PO_TYPE_IMPORT = 'import';
export const PO_TYPE_EXPORT = 'export';
export const PO_TYPE_REFUND = 'refund';
export const PO_TYPE_TRANSFER = 'transfer';

export const PO_TYPES = [
  {
    name: "Xuất",
    code: PO_TYPE_EXPORT,
    color: 'gold'
  },
  {
    name: "Nhập",
    code: PO_TYPE_IMPORT,
    color: 'green'
  },
  {
    name: "Hoàn trả",
    code: PO_TYPE_REFUND,
    color: 'red'
  },
  {
    name: "Điều chuyển",
    code: PO_TYPE_TRANSFER,
    color: 'blue'
  }
];

export const MANUAL_CARRIER_LIST = ["other"];
export const CARRIER_TYPE_MANUAL = 0;
export const CARRIER_TYPE_AUTO = 1;
export const CARRIER_TYPES = [
  {title: 'Thủ công', code: CARRIER_TYPE_MANUAL},
  {title: 'Tự động', code: CARRIER_TYPE_AUTO},
];
export const PRODUCT_SINGLE = 'single';
export const PRODUCT_HAS_CHILDREN = 'has_children';

export const PRODUCT_STT_ACTIVE = "active";
export const PRODUCT_STT_DE_ACTIVE = "de-active";
export const PRODUCT_STT_DRAFT = "draft";
export const PRODUCT_STT_DELETED = 'deleted';
export const PRODUCT_STATUS = [
  {
    name: 'Kích hoạt',
    code: PRODUCT_STT_ACTIVE
  },
  {
    name: 'Chưa kích hoạt',
    code: PRODUCT_STT_DE_ACTIVE
  },
  {
    name: 'Nháp',
    code: PRODUCT_STT_DRAFT
  },
  {
    name: 'Đã xóa',
    code: PRODUCT_STT_DELETED
  }
];

export const PRO_CAT_TYPE_BRAND = 'brand';
export const PRO_CAT_TYPE_STYLE = 'style';
export const PRO_CAT_TYPE_GROUP = 'group';
export const PRO_CAT_TYPE_ARCHIVE = 'category';
export const PRO_CAT_TYPE_VARIANT = 'variant';


export const PRODUCT_UNIT_ITEM = "Chiếc";
export const PRODUCT_UNIT_BAG = "Túi";
export const PRODUCT_UNIT_BOTTLE = "Chai";
export const PRODUCT_UNIT_BOX = 'Hộp';
export const PRODUCT_UNITS = [
  {
    name: 'Chiếc',
    code: PRODUCT_UNIT_ITEM
  },
  {
    name: 'Túi',
    code: PRODUCT_UNIT_BAG
  },
  {
    name: 'Chai',
    code: PRODUCT_UNIT_BOTTLE
  },
  {
    name: 'Hộp',
    code: PRODUCT_UNIT_BOX
  }
];

export const PRODUCT_GROUP_PARENT = "has_children";
export const PRODUCT_GROUP_SINGLE = "single";
export const PRODUCT_GROUPS = [
  {
    name: 'Nhóm',
    code: PRODUCT_GROUP_PARENT
  },
  {
    name: 'Đơn',
    code: PRODUCT_GROUP_SINGLE
  },
];


export const PO_TRANS_TYPE_IMPORT = 'import';
export const PO_TRANS_TYPE_EXPORT = 'export';
export const PO_TRANS_TYPES = [
  {
    name: 'Nhập',
    code: PO_TRANS_TYPE_IMPORT
  },
  {
    name: 'Xuất',
    code: PO_TRANS_TYPE_EXPORT
  },
];

export const TAG_TYPE_DEFAULT = 0;
export const TAG_TYPE_FB_PAGE = 1;

export const TAG_TYPES = [
  {
    code: TAG_TYPE_DEFAULT,
    name: 'Default'
  },
  {
    code: TAG_TYPE_FB_PAGE,
    name: 'Facebook page'
  }

];
export const ADJUSTMENT_DRAFT = '1_draft';
export const ADJUSTMENT_CONFIRM = '2_confirm';
export const ADJUSTMENT_CANCEL = '3_cancel';
export const ADJUSTMENT_STT = [
  {
    name: 'Nháp',
    code: ADJUSTMENT_DRAFT,
    color: 'orange'
  },
  {
    name: 'Nháp',
    code: ADJUSTMENT_CONFIRM,
    color: 'green'
  },
  {
    name: 'Hủy',
    code: ADJUSTMENT_CANCEL,
    color: 'red'
  }
];

export const PAYMENT_COD = 1;
export const PAYMENT_NOT_COD = 0;

export const PAYMENT_COD_CONFIRM_UC = "0_uc";
export const PAYMENT_COD_CONFIRM_C = "1_c";

export const PAYMENT_DEPOSIT_CONFIRM_UC = "0_uc";
export const PAYMENT_DEPOSIT_CONFIRM_C = "1_c";

export const MUTED_COLOR = '#CCC';
export const ACTIVE_COLOR = '#1890ff';
export const ERROR_COLOR = '#ff4d4f';
export const PENDING_COLOR = '#d48806';

export const findTextImport = (stt = '', descriptions = []) => {
  if (descriptions.length === 0) {
    return '';
  }
  let text = descriptions[0].title;
  const comp = toInt(stt);

  for (const i in descriptions) {
    if (comp === descriptions[i].key) {
      return descriptions[i].title;
    } else if (comp > descriptions[i].key) {
      text = descriptions[i].title
    }
  }
  return text;
}
export const stepImport = [
  {
    title: 'Xác nhận đơn',
    stt: 'status',
    icon: function (stt = '') {
      return <CheckCircleOutlined style={{color: stt === 0 ? MUTED_COLOR : ACTIVE_COLOR}}/>
    },
    description: [
      {
        title: 'Chưa xác nhận',
        key: 0,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Đã xác nhận',
        key: 0,
        stt: 'finish',
        color: ACTIVE_COLOR
      },
    ]
  },
  {
    title: 'Đã nhận hàng',
    stt: 'status',
    icon: function (stt = '') {
      return <FileDoneOutlined style={{color: stt <= 4 ? MUTED_COLOR : ACTIVE_COLOR}}/>
    },
    description: [
      {
        title: 'Chưa nhận',
        key: 5,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Đã giao',
        key: 6,
        stt: 'finish',
        color: ACTIVE_COLOR
      },
    ]
  },
  {
    title: 'Hoàn thành kiểm',
    icon: function (stt = '') {
      return <ExceptionOutlined style={{color: stt === 1 || stt === 2 ? MUTED_COLOR : ACTIVE_COLOR}}/>
    },
    stt: 'stock_check_status',
    description: [
      {
        title: 'Chưa kiểm',
        key: 1,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Đang kiểm',
        key: 2,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Đã kiểm',
        key: 3,
        stt: 'finish',
        color: ACTIVE_COLOR
      },
    ]
  },
  {
    title: 'Hoàn thành | Hủy',
    stt: 'status',
    icon: function (stt = '') {
      return <FileDoneOutlined
        style={{color: stt <= 5 ? MUTED_COLOR : stt === 7 ? ACTIVE_COLOR : stt === 8 && ERROR_COLOR}}/>
    },
    description: [
      {
        title: '',
        key: 6,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Hoàn thành',
        key: 7,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Đã hủy',
        key: 8,
        stt: 'finish',
        color: ERROR_COLOR
      },
    ]
  },
]


export const findTexExport = (stt = '', descriptions = []) => {
  if (descriptions.length === 0) {
    return '';
  }
  let text = descriptions[0].title;
  const comp = toInt(stt);
  for (const i in descriptions) {
    if (comp < descriptions[i].key) {
      text = descriptions[i].title;
    }
    if (comp === descriptions[i].key) {
      return descriptions[i].title;
    }
    if (comp > descriptions[i].key) {
      text = descriptions[i].title;
    }
  }
  return text;
}
export const stepExport = [
  {
    title: 'Xác nhận đơn',
    stt: 'confirm',
    icon: function (stt = '') {
      return <CheckCircleOutlined style={{color: stt === 0 ? MUTED_COLOR : ACTIVE_COLOR}}/>
    },
    description: [
      {
        title: 'Chưa xác nhận',
        key: 0,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Đã xác nhận',
        key: 2,
        stt: 'finish',
        color: ACTIVE_COLOR
      },
    ]
  },
  {
    title: 'ĐVVC',
    stt: 'status',
    icon: function (stt = '') {
      return <AuditOutlined
        style={{
          color: stt === 0 ? MUTED_COLOR : stt === 1 ?
            PENDING_COLOR : stt === 2 ? PENDING_COLOR : stt > 2 && ACTIVE_COLOR
        }}/>
    },
    description: [
      {
        title: 'Chờ duyệt',
        key: 1,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Chưa chọn ĐVVC',
        key: 2,
        stt: 'finish',
        color: PENDING_COLOR
      },
      {
        title: 'Chờ xác nhận vận đơn',
        key: 3,
        stt: 'finish',
        color: PENDING_COLOR
      },
      {
        title: 'Đã xác nhận vận đơn',
        key: 4,
        stt: 'finish',
        color: ACTIVE_COLOR
      },
    ]
  },
  {
    title: 'Đóng gói',
    stt: 'packing_status',
    icon: function (stt = '') {
      return <DropboxOutlined
        style={{color: stt === 1 ? MUTED_COLOR : stt === 2 ? PENDING_COLOR : stt === 3 && ACTIVE_COLOR}}/>
    },
    description: [
      {
        title: 'Chờ đóng gói',
        key: 1,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Đang đóng gói',
        key: 2,
        stt: 'finish',
        color: PENDING_COLOR
      },
      {
        title: 'Hoàn thành',
        key: 3,
        stt: 'finish',
        color: ACTIVE_COLOR
      }
    ]
  },
  {
    title: 'Vận chuyển',
    stt: 'status',
    icon: function (stt = '') {
      return <CarOutlined style={{color: stt <= 3 ? MUTED_COLOR : ACTIVE_COLOR}}/>
    },
    description: [
      {
        title: 'Đang vận chuyển',
        key: 5,
        stt: 'finish',
        color: PENDING_COLOR
      },
      {
        title: 'Đã giao',
        key: 6,
        stt: 'finish',
        color: ACTIVE_COLOR
      },
      {
        title: 'Chờ gửi',
        key: 4,
        stt: 'waiting',
        color: MUTED_COLOR
      },
    ]
  },
  {
    title: 'Hoàn thành | Hủy',
    stt: 'status',
    icon: function (stt = '') {
      return <FileDoneOutlined
        style={{color: stt <= 5 ? MUTED_COLOR : stt === 7 ? ACTIVE_COLOR : stt === 8 && ERROR_COLOR}}/>
    },
    description: [
      {
        title: 'Hoàn thành',
        key: 7,
        stt: 'waiting',
        color: MUTED_COLOR
      },
      {
        title: 'Đã hủy',
        key: 8,
        stt: 'finish',
        color: ERROR_COLOR
      },
      {
        title: '',
        key: 6,
        stt: 'waiting',
        color: MUTED_COLOR
      },
    ]
  },
];

export const USER_ACTIVE = '1_active';
export const USER_DEACTIVE = '0_unactive';

export const USER_ROLES = [
  {
    key: 'sadmin',
    title: 'Supper admin'
  },
  {
    key: 'sale',
    title: 'Sale'
  },
  {
    key: 'vendor',
    title: 'Kho vận'
  },
  {
    key: 'accountant',
    title: 'Kế toán'
  }
]

export const REFUND_REASON_NSX_ERROR = 'nsx_error';
export const REFUND_REASON_WRONG_PRO = 'wrong_pro';
export const REFUND_REASON_NO_CHANGE = 'no_change';

export const REFUND_REASON = [
  {
    key: REFUND_REASON_NSX_ERROR,
    label: 'Sản phẩm lỗi do nhà sản xuất'
  },
  {
    key: REFUND_REASON_WRONG_PRO,
    label: 'Gửi nhầm/Thiếu sản phẩm'
  },
  {
    key: REFUND_REASON_NO_CHANGE,
    label: 'Nhầm sản phẩn, khách hàng không yêu cầu đổi'
  },

]
