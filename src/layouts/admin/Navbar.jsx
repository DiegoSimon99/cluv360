import useLogout from '../../hooks/useLogout';
import getGreetingMessage from '../../utils/greetingHandler';
import { useEffect, useState } from "react";

const Navbar = () => {
  const logout = useLogout();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData)); // Convertir a objeto y guardar en el estado
    }
  }, []);

  if (!userData) {
    return <p className='text-center pt-4'>Cargando...</p>; // Mostrar un indicador de carga mientras se obtienen los datos
  }

  const handleSidebarToggle = () => {
    // Llamar a la función predefinida de la plantilla para alternar el Sidebar
    if (window.Helpers && typeof window.Helpers.toggleCollapsed === 'function') {
      window.Helpers.toggleCollapsed();
    }
  };

  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar">
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a
          aria-label='toggle for sidebar'
          className="nav-item nav-link px-0 me-xl-4"
          onClick={handleSidebarToggle}
        >
          <i className="bx bx-menu bx-sm"></i>
        </a>
      </div>

      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
        {getGreetingMessage(userData.username || "Usuario")}
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a aria-label='dropdown profile avatar' className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
              <div className="avatar avatar-online">
                <img src={userData.avatar_original || "../assets/img/avatars/1.png"} className="w-px-40 h-auto rounded-circle" alt="avatar-image" aria-label='Avatar Image' />
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a aria-label='go to profile' className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img src={userData.avatar_original || "../assets/img/avatars/1.png"} className="w-px-40 h-auto rounded-circle" alt='avatar-image' aria-label='Avatar Image' />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-medium d-block">
                        {userData && userData.username && userData.surname
                          ? `${userData.username} ${userData.surname}`
                          : "Usuario"}
                      </span>
                      <small className="text-muted">{userData.user_type || "Rol no definido"}</small>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <a aria-label='go to profile' className="dropdown-item" href="#">
                  <i className="bx bx-user me-2"></i>
                  <span className="align-middle">My Profile</span>
                </a>
              </li>
              <li>
                <a aria-label='go to setting' className="dropdown-item" href="#">
                  <i className="bx bx-cog me-2"></i>
                  <span className="align-middle">Settings</span>
                </a>
              </li>
              <li>
                <a aria-label='go to billing' className="dropdown-item" href="#">
                  <span className="d-flex align-items-center align-middle">
                    <i className="flex-shrink-0 bx bx-credit-card me-2"></i>
                    <span className="flex-grow-1 align-middle ms-1">Billing</span>
                    <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">4</span>
                  </span>
                </a>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              <li>
                <a aria-label='click to log out' className="dropdown-item" href="#" onClick={logout}>
                  <i className="bx bx-power-off me-2"></i>
                  <span className="align-middle">Cerrar Sesión</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;