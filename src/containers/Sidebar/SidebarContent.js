import React from "react";
import {Menu} from "antd";
import {Link} from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import AppsNavigation from "./AppsNavigation";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import {useSelector} from "react-redux";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SidebarContent = ({sidebarCollapsed, setSidebarCollapsed}) => {


  let {navStyle, themeType} = useSelector(({settings}) => settings);
  let {pathname, menu} = useSelector(({common}) => common);

  const getNoHeaderClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };
  const selectedKeys = pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split('/')[1];

  return (
    <>
      <SidebarLogo sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} />
      <div className="gx-sidebar-content">
        <div className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}>
          <AppsNavigation />
        </div>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
            mode="inline">
            {menu && menu.map((value) => {
              return (
                !value.items ?
                  <Menu.Item key={value.key}>
                    <Link to={`/${value.path}`}>
                      <i className={`icon ${value.icon}`} />
                      <span>{value.displayName}</span>
                    </Link>
                  </Menu.Item>
                  : (
                    <SubMenu key={value.key} popupClassName={getNavStyleSubMenuClass(navStyle)}
                             title={<span> <i className={`icon ${value.icon}`} />
                                <span>{value.displayName}</span>
                               </span>}>
                      {value.items.map(item => {
                        return (
                          <Menu.Item key={value.key + item.key}>
                            <Link to={`/${item.path}`}>
                              <span>{item.displayName}</span>
                            </Link>
                          </Menu.Item>
                        )
                      })}
                    </SubMenu>
                  )
              );
            })}
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
};

SidebarContent.propTypes = {};
export default SidebarContent;

