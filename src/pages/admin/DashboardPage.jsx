import { useEffect, useState } from "react";
import { showNotification } from "../../utils/greetingHandler";
import apiClient from "../../api/axios";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const [datos, setDatos] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const noti = localStorage.getItem("notification");

    if (noti) {
      const { type, message } = JSON.parse(noti);
      showNotification(message, type); // tu función personalizada
      localStorage.removeItem("notification"); // eliminar para no volver a mostrarla
    }
    
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`admin/dashboard`);
        setDatos(response.data.data);
      } catch (error) {
        showNotification(error.response?.data?.message || "Error al consultar reportes", "error");
      }
    };

    fetchData();
  }, []);

  const goTo = (url) => {
    navigate(url);
  };

  return (
    <>
      {datos ? (
        <div className="row">
          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-package"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/products")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Productos publicados</span>
                <h3 className="card-title mb-2">{datos.published_products}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-success">
                      <i className="bx bx-package"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/products")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Total Productos</span>
                <h3 className="card-title mb-2">{datos.count_products}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-info">
                      <i className="bx bx-package"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/seller/products")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Productos de Agentes</span>
                <h3 className="card-title mb-2">{datos.agent_products}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-danger">
                      <i className="bx bx-package"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/products")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Productos de GoMarket360</span>
                <h3 className="card-title mb-2">{datos.goMarket360_products}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-warning">
                      <i className="bx bx-sitemap"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/categories")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Categorías</span>
                <h3 className="card-title mb-2">{datos.count_categories}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-primary">
                      <i className="bx bx-sitemap"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/subcategories")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Sub Categorías</span>
                <h3 className="card-title mb-2">{datos.count_subcategories}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-secondary">
                      <i className="bx bx-sitemap"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/subsubcategories")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Sub SubCategorías</span>
                <h3 className="card-title mb-2">{datos.count_subsubcategories}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-success">
                      <i className="bx bx-bookmark"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/brands")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Marcas</span>
                <h3 className="card-title mb-2">{datos.count_brands}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-info">
                      <i className="bx bx-store"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/sellers")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Total de vendedores</span>
                <h3 className="card-title mb-2">{datos.total_sellers}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-danger">
                      <i className="bx bx-store"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/sellers")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Total de vendedores aprobados</span>
                <h3 className="card-title mb-2">{datos.total_approved_sellers}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-warning">
                      <i className="bx bx-store"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/sellers")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Total de vendedores pendientes</span>
                <h3 className="card-title mb-2">{datos.total_pending_sellers}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-4 col-12 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="card-title d-flex align-items-start justify-content-between">
                  <div className="avatar flex-shrink-0">
                    <span className="avatar-initial rounded bg-label-primary">
                      <i className="bx bx-user"></i>
                    </span>
                  </div>
                  <div className="dropdown">
                    <button
                      aria-label="Click me"
                      className="btn p-0"
                      type="button"
                      id="cardOpt3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                      <a
                        aria-label="view more"
                        className="dropdown-item"
                        href="#"
                        onClick={() => goTo("/admin/customers/list")}
                      >
                        Ver más
                      </a>
                    </div>
                  </div>
                </div>
                <span className="fw-medium d-block mb-1">Total de asociados</span>
                <h3 className="card-title mb-2">{datos.count_users}</h3>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-12 mb-4">
            <div className="card">
              <div className="card-header align-items-center row">
                <div className="col-12 pt-0 pt-md-2 mb-4">
                  <h5 className="mb-0 text-md-start text-center">Ventas de productos por categoría</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive text-nowrap pt-2">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre de la categoría</th>
                        <th>Ventas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datos.product_sales_category.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.total_sales}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-12 mb-4">
            <div className="card">
              <div className="card-header align-items-center row">
                <div className="col-12 pt-0 pt-md-2 mb-4">
                  <h5 className="mb-0 text-md-start text-center">Stock de productos por categoría</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive text-nowrap pt-2">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre de la categoría</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datos.product_stock_category.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.total_stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Cargando Información...</p>
        </div>
      )}
    </>
  );
};
