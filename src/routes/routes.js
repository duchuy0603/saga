export const getRoutes = (role = null) => {
  switch (role) {
    default:
      return routes;
  }
};

const routes = [
  {
    path: 'home',
    component: import('../routes/Dashboard/index'),
  },
  {
    path: 'inventory',
    component: import('../routes/Inventory/index'),
    exact: true,
  },
  {
    path: 'inventory/po-all',
    component: import('../routes/Inventory/index'),
    exact: true,
  },

  {
    path: 'warehouse',
    displayName: 'Danh sách kho',
    component: import('../routes/Warehouse/index'),
    exact: true
  },
  {
    path: 'warehouse/:whId',
    displayName: 'Chi tiết kho',
    component: import('../routes/Warehouse/WarehouseDetail'),
  },
  {
    path: 'inventory/po/:poId',
    exact: true,
    component: import('../routes/Inventory/po-detail'),
  },
  {
    path: 'inventory',
    exact: true,
    component: import('../routes/Inventory/index'),
  },
  {
    path: 'inventory/po-import',
    component: import('../routes/Inventory/index'),
  },
  {
    path: 'inventory/po-export',
    component: import('../routes/Inventory/index'),
  },
  {
    path: 'inventory/po-return',
    component: import('../routes/Inventory/index'),
  },
  {
    path: 'inventory/po-transfer',
    component: import('../routes/Inventory/index'),
  },
  {
    path: 'order',
    component: import('../routes/Order/index'),
    exact: true,
  },
  {
    path: 'order/:orderId',
    component: import('../routes/Order/detail/detail'),
  },
  {
    path: 'reconcile',
    component: import('../routes/Order/reconciliation'),
    exact: true
  },
  {
    path: 'reconcile-by-order',
    component: import('../routes/Order/reconcileByOrder'),
    exact: true
  },
  {
    path: 'product/brand',
    component: import('../routes/Product/attributes/product-brand')
  },
  {
    path: 'product/group',
    component: import('../routes/Product/attributes/product-group')
  },
  {
    path: 'product/archive',
    component: import('../routes/Product/attributes/product-archive')
  },
  {
    path: 'product/style',
    exact: true,
    component: import('../routes/Product/attributes/product-style')
  },
  {
    path: 'product/variant',
    exact: true,
    component: import('../routes/Product/attributes/product-variant')
  },
  {
    path: 'product/style-create/:id?',
    component: import('../routes/Product/attributes/product-style-detail')
  },
  {
    path: 'product/create',
    component: import('../routes/Product/product-create'),
  },
  {
    path: 'product/import-warehouse',
    component: import('../routes/Product/ImportWarehouse'),
  },
  {
    path: 'product/update/:productId',
    component: import('../routes/Product/product-update'),
  },
  {
    path: 'product/:productId',
    component: import('../routes/Product/product-detail'),
  },
  {
    path: 'product',
    component: import('../routes/Product/index'),
    exact: true,
  },
  {
    path: 'manufacture',
    component: import('../routes/Manufacture/index'),
    icon: 'icon-wysiwyg',
    exact: true,
  },
  {
    path: 'manufacture/create',
    component: import('../routes/Manufacture/create'),
    isMenu: false,
  },
  {
    path: 'manufacture/update/:mId',
    component: import('../routes/Manufacture/update'),
    isMenu: false,
  },
  {
    path: 'manufacture/:mId',
    component: import('../routes/Manufacture/detail'),
    isMenu: false,
  },
  {
    path: 'brand',
    component: import('../routes/Brand/index'),
    exact: true
  },
  {
    path: 'tag',
    component: import('../routes/Tag/index'),
    exact: true
  },
  {
    path: 'vendor',
    component: import('../routes/Vendor/index'),
    exact: true
  },
  //vendor
  {
    path: 'vendor/create',
    component: import('../routes/Vendor/create'),
  },
  {
    path: 'vendor/update/:customerId',
    component: import('../routes/Vendor/update'),
  },
  {
    path: 'vendor/:vendorId',
    component: import('../routes/Vendor/detail'),
  },

  {
    path: 'customer/create',
    component: import('../routes/Customer/customer-create'),
  },
  {
    path: 'customer/update/:customerId',
    component: import('../routes/Customer/customer-update'),
  },
  {
    path: 'customer',
    component: import('../routes/Customer/index'),
    exact: true
  },
  {
    path: 'account',
    component: import('../routes/Account/index'),
    exact: true,
  },
  {
    path: 'customer/create',
    component: import('../routes/Customer/customer-create'),
  },
  {
    path: 'customer/:customerId',
    component: import('../routes/Customer/detail'),
  },
  {
    path: 'setting',
    component: import('../routes/Setting/index'),
    icon: 'icon-components',
  },
  {
    path: 'carrier',
    component: import('../routes/Carrier/index'),
    icon: 'icon-components',
  },
  {
    path: 'adjustment',
    component: import('./Warehouse/adjustment'),
    exact: true,
  },
];
