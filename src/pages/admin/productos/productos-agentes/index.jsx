import { useEffect, useState } from "react";
import apiClient from "../../../../api/axios";
import { showNotification } from "../../../../utils/greetingHandler";
import LoaderTable from "../../../../components/admin/LoaderTable";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { confirmAlert } from "react-confirm-alert";
import { useAdmin } from "../../../../layouts/contexts/AdminContext";
import NumberFormatter from "../../../../components/NumberFormatter";

export const Index = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [currentPageTable, setCurrentPageTable] = useState(1);
  const [search, setSearch] = useState("");
  const [paginate, setPaginate] = useState(10);
  const { showLoading, hideLoading } = useAdmin();
  const [types, setTypes] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterSeller, setFilterSeller] = useState("");
  const navigate = useNavigate();

  const listProductos = () => {
    setProductos([]);
    setLoading(true);
    const data = {
      search: search,
      paginate: paginate,
      type: filterType,
      user_id: filterSeller || null,
    };
    apiClient
      .post(`admin/products/seller/lista?page=${currentPage}`, data)
      .then((response) => {
        setProductos(response.data.data);
        setTotalPages(response.data.last_page);
        setPerPage(response.data.per_page);
        setCurrentPageTable(response.data.current_page);
      })
      .catch((error) => {
        showNotification(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadOptionsSellers = async (inputValue) => {
    try {
      const response = await apiClient.get(`/admin/products/seller/users?search=${inputValue}`);
      return response.data.map((item) => ({
        value: item.user_id,
        label: item.user.shop.name + " (" + item.user.name + ")",
      }));
    } catch (error) {
      showNotification("Ocurrio un error al obtener lista de vendedores", "error");
      return [];
    }
  };

  useEffect(() => {
    const dataType = [
      { value: "current_stock,asc", name: "Stock (Agotándose)" },
      { value: "rating,desc", name: "Rating (Alto > Bajo)" },
      { value: "rating,asc", name: "Rating (Bajo > Alto)" },
      { value: "num_of_sale,desc", name: "Num ventas (Alto > Bajo)" },
      { value: "num_of_sale,asc", name: "Num ventas (Bajo > Alto)" },
      { value: "unit_price,desc", name: "Precio (Alto > Bajo)" },
      { value: "unit_price,asc", name: "Precio (Bajo > Alto)" },
    ];
    setTypes(dataType);
  }, []);

  useEffect(() => {
    listProductos();
  }, [currentPage, search, paginate, filterType, filterSeller]);

  const getPagination = () => {
    const pages = [];
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);

    // Aseguramos que haya solo 4 botones más el "..."
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleFilterSubmit = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterKeyup = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const handleEntradaChange = (e) => {
    setPaginate(e.target.value);
    setCurrentPage(1);
  };

  const editProducto = (id) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const deleteProducto = (id) => {
    confirmAlert({
      title: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar este producto?",
      buttons: [
        {
          label: "Sí, eliminar",
          onClick: async () => {
            try {
              showLoading();
              const response = await apiClient.delete(`/admin/products/${id}`);
              if (response.data.success) {
                showNotification(response.data.message, "success");
                listProductos();
              } else {
                showNotification(response.data.message, "error");
              }
            } catch (error) {
              showNotification(error.response?.data?.message || "Error al eliminar producto", "error");
            } finally {
              hideLoading();
            }
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
  };

  const duplicateProducto = (id) => {
    confirmAlert({
      title: "Confirmar duplicidad",
      message: "¿Estás seguro de que deseas duplicar este producto?",
      buttons: [
        {
          label: "Sí, duplicar",
          onClick: async () => {
            try {
              showLoading();
              const response = await apiClient.get(`/admin/products/duplicate/${id}`);
              if (response.data.success) {
                showNotification(response.data.message, "success");
                listProductos();
              } else {
                showNotification(response.data.message, "error");
              }
            } catch (error) {
              showNotification(error.response?.data?.message || "Error al duplicar producto", "error");
            } finally {
              hideLoading();
            }
          },
        },
        {
          label: "Cancelar",
        },
      ],
    });
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleCheckboxChange = async (e, id) => {
    const { name } = e.target;
    const newStatus = e.target.checked ? 1 : 0;
    const data = {
      id: id,
      status: newStatus,
    };
    if (name === "todays_deal") {
      setProductos((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, todays_deal: newStatus } : item))
      );
      try {
        const response = await apiClient.post("/admin/products/updateTodaysDeal", data);
        if (response.data.success) {
          showNotification(response.data.message, "success");
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Ocurrio un error al actualizar estado", "error");
      }
    } else if (name === "published") {
      setProductos((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, published: newStatus } : item)));
      try {
        const response = await apiClient.post("/admin/products/updatePublished", data);
        if (response.data.success) {
          showNotification(response.data.message, "success");
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Ocurrio un error al actualizar estado", "error");
      }
    } else if (name === "featured") {
      setProductos((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, featured: newStatus } : item)));
      try {
        const response = await apiClient.post("/admin/products/updateFeatured", data);
        if (response.data.success) {
          showNotification(response.data.message, "success");
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Ocurrio un error al actualizar estado", "error");
      }
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header align-items-center row">
          <div className="col-12 pt-0 pt-md-2 mb-4">
            <h5 className="mb-0 text-md-start text-center">Productos Agentes</h5>
          </div>
          <div className="col-12 col-md-2 mb-1">
            <label>Entradas</label>
            <select className="form-select" onChange={handleEntradaChange} value={paginate}>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="col-12 col-md-5 mb-2">
            <br />
            <AsyncSelect
              loadOptions={loadOptionsSellers}
              isClearable
              defaultOptions
              value={filterSeller} // Mantiene la opción seleccionada
              onChange={(selectedOption) => setFilterSeller(selectedOption)}
            />
          </div>
          <div className="col-12 col-md-3 mb-2">
            <br />
            <select className="form-select" onChange={handleFilterTypeChange} value={filterType}>
              <option value="">Ordenar por</option>
              {types.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-2 mb-1">
            <br />
            <div className="input-group input-group-merge">
              <span className="input-group-text" id="basic-addon-search31">
                <i className="bx bx-search"></i>
              </span>
              <input
                type="search"
                placeholder="Buscar.."
                className="form-control"
                value={search}
                onChange={handleFilterSubmit}
                onKeyUp={handleFilterKeyup}
              />
            </div>
          </div>
        </div>
        <div className="table-responsive text-nowrap pt-2 ps-4 pe-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Vendedor</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Puntos</th>
                <th>Oferta</th>
                <th>Rating</th>
                <th>Publicado</th>
                <th>Destacado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className={`table-border-bottom-0 ${loading ? "position-relative" : ""}`}>
              <LoaderTable loading={loading} cantidad={productos.length}></LoaderTable>
              {productos.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1 + (currentPageTable - 1) * perPage}</td>
                  <td>
                    {item.thumbnail_img && (
                      <img src={item.thumbnail_img} className="img-md me-2" alt="not-found" height={50} />
                    )}
                    {item.name}
                  </td>
                  <td>{item.user.name}</td>
                  <td>{item.total_stock}</td>
                  <td>
                    <NumberFormatter value={item.unit_price}></NumberFormatter>
                  </td>
                  <td>
                    <NumberFormatter value={item.earn_point}></NumberFormatter>
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="todays_deal"
                        checked={item.todays_deal === 1}
                        onChange={(e) => handleCheckboxChange(e, item.id)}
                      />
                    </div>
                  </td>
                  <td>{item.rating}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="published"
                        checked={item.published === 1}
                        onChange={(e) => handleCheckboxChange(e, item.id)}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="featured"
                        checked={item.featured === 1}
                        onChange={(e) => handleCheckboxChange(e, item.id)}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="dropdown">
                      <button
                        aria-label="Click me"
                        type="button"
                        className="btn p-0 dropdown-toggle hide-arrow"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bx bx-dots-vertical-rounded"></i>
                      </button>
                      <div className="dropdown-menu">
                        <button
                          aria-label="dropdown action option"
                          className="dropdown-item"
                          href="#"
                          onClick={() => editProducto(item.id)}
                        >
                          <i className="bx bx-edit-alt me-1"></i> Editar
                        </button>
                        <button
                          aria-label="dropdown action option"
                          className="dropdown-item"
                          onClick={() => deleteProducto(item.id)}
                        >
                          <i className="bx bx-trash me-1"></i> Eliminar
                        </button>
                        <button
                          aria-label="dropdown action option"
                          className="dropdown-item"
                          onClick={() => duplicateProducto(item.id)}
                        >
                          <i className="bx bx-copy me-1"></i> Duplicar
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center mt-4">
              {/* Botón de primera página */}
              <li className="page-item first">
                <a aria-label="pagination link" className="page-link" href="#" onClick={() => handlePageChange(1)}>
                  <i className="tf-icon bx bx-chevrons-left"></i>
                </a>
              </li>

              {/* Botón de página anterior */}
              <li className="page-item prev">
                <a
                  aria-label="pagination link"
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <i className="tf-icon bx bx-chevron-left"></i>
                </a>
              </li>

              {/* Botones de páginas numéricas */}
              {getPagination().map((page, index) =>
                page === "..." ? (
                  <li key={index} className="page-item">
                    <span className="page-link">...</span>
                  </li>
                ) : (
                  <li key={index} className={`page-item ${currentPage === page ? "active" : ""}`}>
                    <a
                      aria-label="pagination link"
                      className="page-link"
                      href="#"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </a>
                  </li>
                )
              )}

              {/* Botón de página siguiente */}
              <li className="page-item next">
                <a
                  aria-label="pagination link"
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <i className="tf-icon bx bx-chevron-right"></i>
                </a>
              </li>

              {/* Botón de última página */}
              <li className="page-item last">
                <a
                  aria-label="pagination link"
                  className="page-link"
                  href="#"
                  onClick={() => handlePageChange(totalPages)}
                >
                  <i className="tf-icon bx bx-chevrons-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
