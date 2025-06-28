import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import menuData from "../../data/menuData.json";
import apiClient from "../../api/axios";
import { useAdmin } from "../contexts/AdminContext";

const Sidebar = () => {
  const {
    reviewCount,
    setReviewCount,
    reviewCountOrder,
    setReviewCountOrder,
    refreshOrdersCount,
    reviewCountTicket,
    setReviewCountTicket,
    refreshTicketsCount,
  } = useAdmin();

  const userPermissions = JSON.parse(localStorage.getItem("user_data"))?.permissions || [];

  useEffect(() => {
    const fetchReviewCountProducts = async () => {
      try {
        const response = await apiClient.get("/admin/products/reviews/count");
        setReviewCount(response.data.count);
      } catch (error) {
        console.error("Error al obtener la cantidad de reviews", error);
      }
    };

    fetchReviewCountProducts();
  }, []);

  useEffect(() => {
    const fetchReviewCountOrders = async () => {
      try {
        const response = await apiClient.get("/admin/orders/countNewOrders");
        setReviewCountOrder(response.data.count);
      } catch (error) {
        console.error("Error al obtener la cantidad de pedidos", error);
      }
    };

    fetchReviewCountOrders();
  }, [refreshOrdersCount]);

  useEffect(() => {
    const fetchReviewCountTickets = async () => {
      try {
        const response = await apiClient.get("/admin/support_ticket/reviews/count");
        setReviewCountTicket(response.data.count);
      } catch (error) {
        console.error("Error al obtener la cantidad de tickets", error);
      }
    };

    fetchReviewCountTickets();
  }, [refreshTicketsCount]);

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo justify-content-center">
        <Link aria-label="Navigate to sneat homepage" to="/" className="app-brand-link">
          <span className="app-brand-logo demo">
            <img src="/assets/img/admin/logo-360.png" alt="sneat-logo" height={30} />
          </span>
        </Link>
        <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
          <i className="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {menuData.map((section, index) => (
          <React.Fragment key={section.header || index}>
            {section.header && (
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">{section.header}</span>
              </li>
            )}
            {section.items.map((item, itemIndex) => (
              <MenuItem
                key={item.link || itemIndex}
                {...item}
                userPermissions={userPermissions}
                reviewCount={reviewCount}
                reviewCountOrder={reviewCountOrder}
                reviewCountTicket={reviewCountTicket}
              />
            ))}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  );
};

const MenuItem = ({
  text,
  link,
  available,
  icon,
  submenu,
  reviewCount,
  reviewCountOrder,
  reviewCountTicket,
  userPermissions,
  requiredPermissions,
}) => {
  const location = useLocation();
  const hasSubmenu = submenu && submenu.length > 0;

  // Verifica si la URL actual comienza con el `link` en lugar de exigir una coincidencia exacta
  const isActive = location.pathname.startsWith(link);
  const isSubmenuActive = hasSubmenu && submenu.some((subitem) => location.pathname.startsWith(subitem.link));

  const user = JSON.parse(localStorage.getItem("user_data"));
  const isAdmin = user?.user_type === "admin";
  const hasFullAccess = userPermissions.includes("*");
  const isDashboard = text === "Dashboard";

  if (
    !available ||
    (!isDashboard &&
      !isAdmin &&
      !hasFullAccess &&
      requiredPermissions &&
      !requiredPermissions.some((p) => userPermissions.includes(p.toString())))
  ) {
    return null;
  }

  return (
    <li
      className={`menu-item ${isActive || isSubmenuActive ? "active" : ""} ${
        hasSubmenu && isSubmenuActive ? "open" : ""
      }`}
    >
      <NavLink
        to={link}
        className={`menu-link ${submenu ? "menu-toggle" : ""}`}
        target={link.includes("http") ? "_blank" : undefined}
      >
        {icon && icon !== "undefined" && <i className={`menu-icon tf-icons ${icon}`}></i>}
        <div>{text}</div>
        {text === "Ventas GoMarket360" && reviewCountOrder > 0 && (
          <div className="badge bg-primary fs-tiny rounded-pill ms-auto">{reviewCountOrder}</div>
        )}
        {text === "Calificación de Productos" && reviewCount > 0 && (
          <div className="badge bg-primary fs-tiny rounded-pill ms-auto">{reviewCount}</div>
        )}
        {link === "/admin/support_ticket" && reviewCountTicket > 0 && (
          <div className="badge bg-primary fs-tiny rounded-pill ms-auto">{reviewCountTicket}</div>
        )}
      </NavLink>
      {submenu && (
        <ul className="menu-sub">
          {submenu.map((submenuItem, index) => (
            <MenuItem
              key={submenuItem.link || index}
              {...submenuItem}
              userPermissions={userPermissions}
              reviewCount={reviewCount}
              reviewCountOrder={reviewCountOrder}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Sidebar;
