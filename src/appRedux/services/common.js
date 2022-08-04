import {axiosCatch, getApiURL} from '../../util/Helper';
import axios from 'axios';
import React from 'react';
import {ROLE_SUPPER_ADMIN} from "../../constants/ActionTypes";
import Axios from "axios";
import {axiosAuth} from "../../util/Api";

export const getCityList = async () => {
  return await axios.get('/hanh-chinh/tinh_tp.json').catch(axiosCatch);
};

export const getDistrictList = async (city) => {
  return await axios.get(`/hanh-chinh/quan-huyen/${city}.json`).catch(axiosCatch);
};

export const getWardList = async (district) => {
  return await axios.get(`/hanh-chinh/xa-phuong/${district}.json`).catch(axiosCatch);
};

export const getVersion = () => {
  if (!process.env.REACT_APP_CLIENT_VERSION) {
    return 'v0.0';
  }
  return process.env.REACT_APP_CLIENT_VERSION;
};

export const reqImportExcel = async (formData, config = {}) => {
  return await axiosAuth({
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    }
  }).post(`${getApiURL()}/import`, formData, config).catch(axiosCatch)
}
export const handleUploadMedia = (file, successCallback, errorCallBack, onUploadProgress) => {
  let formData = new FormData();
  formData.append('imageFile', file);
  formData.append('fileType', 'image');
  axios.create({
    baseURL: '/uploadurl',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: event => onUploadProgress(event)
  }).post('uploadpath', formData)
    .then((res) => {
      if (successCallback) {
        successCallback(res.data);
      }
    }).catch((e) => {
    if (errorCallBack) {
      errorCallBack(e);
    }
  });
};


export const callGetMenu = async (role) => {
  switch (role) {
    case ROLE_SUPPER_ADMIN:
    default:
      return [
        {
          key: 'home',
          path: 'home',
          icon: 'icon-data-display',
          displayName: 'Tổng quan',
        },
        {
          key: 'inventory',
          path: 'inventory',
          icon: 'icon-wysiwyg',
          displayName: 'Tồn kho',
        },
        {
          key: 'product/import-warehouse',
          path: 'product/import-warehouse',
          icon: 'icon-wysiwyg',
          displayName: 'Nhập kho',
        },
        {
          key: 'inventory/po-all',
          path: 'inventory/po-all',
          icon: 'icon-geo-location',
          displayName: 'Vận chuyển',
        },
        {
          key: 'order',
          path: 'order',
          icon: 'icon-shopping-cart',
          displayName: 'Đơn hàng',
        },
        {
          key: 'reconcile',
          path: 'reconcile',
          icon: 'icon-feedback',
          displayName: 'Đối soát',
        },
        {
          key: 'product',
          path: 'product',
          icon: 'icon-wysiwyg',
          displayName: 'Sản phẩm',
          items: [
            {
              key: 'product-brand',
              path: 'product/brand',
              icon: 'icon-wysiwyg',
              displayName: 'Thương hiệu',
            },
            {
              key: 'product-group',
              path: 'product/group',
              icon: 'icon-wysiwyg',
              displayName: 'Nhóm sản phẩm',
            },
            {
              key: 'product-archive',
              path: 'product/archive',
              icon: 'icon-wysiwyg',
              displayName: 'Danh mục sản phẩm',
            },
            {
              key: 'product-variant',
              path: 'product/variant',
              icon: 'icon-wysiwyg',
              displayName: 'Mẫu biến thể',
            },
            {
              key: 'product-style',
              path: 'product/style',
              icon: 'icon-wysiwyg',
              displayName: 'Loại sản phẩm',
            },
            {
              key: 'product',
              path: 'product',
              icon: 'icon-wysiwyg',
              displayName: 'Sản phẩm',
            },
          ]
        },
        {
          key: 'customer',
          path: 'customer',
          icon: 'icon-profile',
          displayName: 'Khách hàng',
        },
        {
          key: 'manage-parent',
          icon: 'icon-widgets',
          displayName: 'Quản lý',
          items: [
            {
              key: 'warehouse',
              path: 'warehouse',
              icon: 'icon-wysiwyg',
              displayName: 'Kho',
            },
            {
              key: 'adjustment',
              path: 'adjustment',
              icon: 'icon-wysiwyg',
              displayName: 'Điều chỉnh kho',
            },
            {
              key: 'account',
              path: 'account',
              displayName: 'Tài khoản',
            },
            {
              key: 'brand',
              path: 'brand',
              icon: 'icon-tag',
              displayName: 'Nhãn hàng',
            },
            {
              key: 'tag',
              path: 'tag',
              displayName: 'Tag',
            },
            {
              key: 'carrier',
              path: 'carrier',
              displayName: 'Đơn vị vận chuyển',
            },
            {
              key: 'manufacture',
              path: 'manufacture',
              icon: 'icon-wysiwyg',
              displayName: 'Nhà sản xuất',
            },

            {
              key: 'vendor',
              path: 'vendor',
              icon: 'icon-wysiwyg',
              displayName: 'Nhà cung cấp',
            },
            {
              key: 'setting',
              path: 'setting',
              displayName: 'Cấu hình',
            },
          ],
        }
      ];
  }
};
