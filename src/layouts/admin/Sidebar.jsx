import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import menuData from "../../data/menuData.json";
import apiClient from "../../api/axios";

const Sidebar = () => {
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const response = await apiClient.get("/admin/products/reviews/count"); // Cambia por tu endpoint que devuelva la cantidad
        setReviewCount(response.data.count);
      } catch (error) {
        console.error("Error al obtener la cantidad de reviews", error);
      }
    };
    fetchReviewCount();
  }, []);

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
              <MenuItem key={item.link || itemIndex} {...item} reviewCount={reviewCount} />
            ))}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  );
};

const MenuItem = ({ text, link, available, icon, submenu, reviewCount }) => {
  const location = useLocation();
  const hasSubmenu = submenu && submenu.length > 0;

  // Verifica si la URL actual comienza con el `link` en lugar de exigir una coincidencia exacta
  const isActive = location.pathname.startsWith(link);
  const isSubmenuActive = hasSubmenu && submenu.some((subitem) => location.pathname.startsWith(subitem.link));

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
        {text === "Calificación de Productos" && reviewCount > 0 && (
          <div className="badge bg-primary fs-tiny rounded-pill ms-auto">{reviewCount}</div>
        )}
      </NavLink>
      {submenu && (
        <ul className="menu-sub">
          {submenu.map((submenuItem, index) => (
            <MenuItem key={submenuItem.link || index} {...submenuItem} reviewCount={reviewCount} />
          ))}
        </ul>
      )}
    </li>
  );
};


export default Sidebar;
