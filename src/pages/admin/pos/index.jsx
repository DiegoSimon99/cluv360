import { useEffect, useState } from "react";
import apiClient from "../../../api/axios";
import { showNotification } from "../../../utils/greetingHandler";
import AsyncSelect from "react-select/async";
import NumberFormatter from "../../../components/NumberFormatter";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";

export const Index = () => {
  const [products, setProducts] = useState([]);
  const [address, setAddress] = useState([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [isLoadingPickupPoints, setIsLoadingPickupPoints] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategorie, setFilterCategorie] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userDiscount, setUserDiscount] = useState(0);
  const [totalBruto, setTotalBruto] = useState(0);
  const [selectedPickupPoints, setSelectedPickupPoints] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState("pending");
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [paymentType, setPaymentType] = useState("wallet");
  const [shippingType, setShippingType] = useState("home_delivery");
  const [showChangeOrder, setshowChangeOrder] = useState(false);
  const handleCloseChangeOrder = () => setshowChangeOrder(false);
  const handleShowChangeOrder = () => setshowChangeOrder(true);
  const [balanceData, setBalanceData] = useState(null);
  const [granTotal, setGranTotal] = useState(0);
  const [totalDelivery, setTotalDelivery] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchPickupPoints = async () => {
      setIsLoadingPickupPoints(true);
      try {
        const response = await apiClient.get("/yala/lista_locales");
        if (response.data.result) {
          const formattedPickupPoints = response.data.data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          setPickupPoints(formattedPickupPoints);
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification("Ocurrio un error al cargar locales", "error");
        console.error("Error al cargar locales:", error);
      } finally {
        setIsLoadingPickupPoints(false);
      }
    };
    fetchPickupPoints();
  }, []);

  const addToCart = (product) => {
    if (product.stock > 0) {
      setCart((prev) => {
        const found = prev.find((item) => item.uid === product.uid);
        if (found) {
          return prev.map((item) => (item.uid === product.uid ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
    }
  };

  const removeFromCart = (uid) => {
    setCart((prev) => prev.filter((item) => item.uid !== uid));
  };

  const updateQuantity = (uid, quantity) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.uid !== uid) return item;

        // Permitir campo vacío para escritura manual
        if (quantity === "") return { ...item, quantity: "" };

        const safeQty = Math.max(parseInt(quantity), 1);

        // Validación de stock
        if (safeQty > item.stock) {
          showNotification("Stock insuficiente", "warning");
          return item;
        }

        return { ...item, quantity: safeQty };
      })
    );
  };

  const clearCart = () => setCart([]);

  useEffect(() => {
    const totalBrutoTemp = cart.reduce((total, item) => {
      const qty = parseInt(item.quantity || "0");
      return total + item.price * qty;
    }, 0);

    setTotalBruto(totalBrutoTemp);
  }, [cart]);

  const calculateCartTotals = (cart) => {
    return cart.reduce(
      (totals, item) => {
        const qty = parseInt(item.quantity || "0");
        let itemTotal = item.price * qty;

        if (item.exclusivo_gm360 == 1 && userDiscount == 1) {
          itemTotal = itemTotal / 2;
        }

        return {
          subtotal: totals.subtotal + itemTotal,
          puntos: totals.puntos + item.puntos * qty,
        };
      },
      { subtotal: 0, puntos: 0 }
    );
  };

  const { subtotal, puntos } = calculateCartTotals(cart);

  useEffect(() => {
    setGranTotal(subtotal + totalDelivery);
  }, [subtotal, totalDelivery]);

  const loadOptionsCategories = async (inputValue) => {
    try {
      const response = await apiClient.get(`/admin/pos/categories?search=${inputValue}`);
      return response.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    } catch (error) {
      showNotification("Ocurrio un error al obtener lista de categorías", "error");
      return [];
    }
  };

  const loadOptionsBrands = async (inputValue) => {
    try {
      const response = await apiClient.get(`/admin/products/brand/select?search=${inputValue}`);
      return response.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    } catch (error) {
      showNotification("Ocurrio un error al obtener lista de marcas", "error");
      return [];
    }
  };

  const fetchCustomers = async (inputValue) => {
    try {
      const response = await apiClient.get(`admin/pos/customers?search=${inputValue}`);
      if (response.data.success) {
        return response.data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
      }
    } catch (error) {
      showNotification("Ocurrio un error al cargar usuarios", "error");
      console.error("Error al cargar usuario:", error);
    }
  };

  const fetchProducts = async (page = 1, append = false) => {
    setLoading(true);
    try {
      const data = {
        category_id: filterCategorie?.value || null,
        brand_id: filterBrand?.value || null,
        search: search || null,
        page: page,
      };
      const response = await apiClient.post("/admin/pos/products", data);

      const newProducts = response.data.data.map((p) => ({
        ...p,
        uid: `${p.id}-${p.variant}`,
      }));

      setProducts((prev) => (append ? [...prev, ...newProducts] : newProducts));

      setLastPage(response.data.last_page);
    } catch (error) {
      showNotification("Ocurrio un error al cargar productos", "error");
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, currentPage !== 1);
  }, [currentPage, search, filterCategorie, filterBrand]);

  const handleFilterSubmit = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterKeyup = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
    }
  };

  const openModalOrder = () => {
    if (!selectedUser) {
      showNotification("Seleccione un cliente.", "error");
      return;
    }

    if (cart.length == 0) {
      showNotification("No hay productos agregados", "error");
      return;
    }

    const isValidCart = cart.every((item) => Number.isInteger(item.quantity) && item.quantity > 0);

    if (!isValidCart) {
      showNotification("Hay productos con cantidades vacías o inválidas.", "error");
      return;
    }

    handleShowChangeOrder();
  };

  const handleUserChange = async (selectedOption) => {
    const userId = selectedOption ? selectedOption.value : null;
    setSelectedUser(selectedOption);
    setUserDiscount(0);

    if (userId) {
      setIsLoadingAddress(true);
      setBalanceData(null);
      setAddress([]);
      setSelectedAddress(null);
      try {
        const balanceRes = await apiClient.get(`/admin/filter_balance/${userId}`);
        if (balanceRes.data.success) {
          setBalanceData(balanceRes.data.data);
        } else {
          showNotification(balanceRes.data.message, "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Ocurrio un error al seleccionar cliente", "error");
      }

      try {
        const response = await apiClient.get(`/admin/pos/customer_select/${userId}`);
        if (response.data.success) {
          const formattedAddresses = response.data.data.address.map((address) => ({
            value: address.id,
            label: address.address,
          }));
          setAddress(formattedAddresses);
          if (response.data.data.user.customer_package_id != 6) {
            setUserDiscount(1);
          } else {
            setUserDiscount(0);
          }
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification(
          error.response?.data?.message || "Ocurrio un error al consultar dirección del cliente",
          "error"
        );
      } finally {
        setIsLoadingAddress(false);
      }
    } else {
      setBalanceData(null);
      setAddress([]);
      setSelectedAddress(null);
    }
  };

  useEffect(() => {
    const fetchCalculateDelivery = async () => {
      try {
        const response = await apiClient.get(`/yala/calcular_delivery/${selectedAddress}`);
        if (response.data.result) {
          setTotalDelivery(parseFloat(response.data.data.precio));
        } else {
          showNotification(response.data.message, "error");
        }
      } catch (error) {
        showNotification(error.response?.data?.message || "Ocurrio un error al calcular precio de envío", "error");
        setSelectedAddress(null);
      }
    };
    if (selectedAddress) {
      fetchCalculateDelivery();
    } else {
      setTotalDelivery(0);
    }
  }, [selectedAddress]);

  const orderConfirmation = async (e) => {
    e.preventDefault();

    if (shippingType === "home_delivery" && !selectedAddress) {
      showNotification("Debe seleccionar una dirección", "error");
      return;
    } else if (shippingType === "pickup_point" && !selectedPickupPoints) {
      showNotification("Debe seleccionar un local", "error");
      return;
    }

    const data = {
      user_id: selectedUser.value,
      payment_type: paymentType,
      shipping_type: shippingType,
      cart_products: cart,
      subtotal: subtotal,
      coupon_discount: totalBruto-subtotal,
      address_id: selectedAddress,
      pickup_point_id: selectedPickupPoints,
      delivery_status: deliveryStatus,
    };

    try {
      setIsLoading(true);
      const response = await apiClient.post("/admin/pos/order", data);
      if (response.data.success) {
        showNotification(response.data.message, "success");
        setSelectedUser(null);
        setSelectedAddress(null);
        setSelectedPickupPoints(null);
        clearCart();
        handleCloseChangeOrder();
        fetchProducts();
      } else {
        showNotification(response.data.message, "error");
      }
    } catch (error) {
      showNotification(error.response?.data?.message || "Ocurrio un error en la transacción", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="row gutters-5">
        <div className="col-md-7">
          <div className="row gutters-5 mb-3">
            <div className="col-12 col-md-4 mb-1">
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
            <div className="col-12 col-md-4 mb-2">
              <AsyncSelect
                loadOptions={loadOptionsCategories}
                isClearable
                defaultOptions
                value={filterCategorie}
                placeholder="Todas las Categorias"
                onChange={(selectedOption) => {
                  setFilterCategorie(selectedOption);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-12 col-md-4 mb-2">
              <AsyncSelect
                loadOptions={loadOptionsBrands}
                isClearable
                defaultOptions
                value={filterBrand}
                placeholder="Todas las Marcas"
                onChange={(selectedOption) => {
                  setFilterBrand(selectedOption);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          {products.length === 0 && !loading ? (
            <div className="text-center mt-5 no-products">
              <div style={{ fontSize: "48px" }}>🙁</div>
              <h5 className="mt-3 fw-bold">No encontramos productos</h5>
              <p className="text-muted">Intenta con otro término o ajusta tus filtros para ver más resultados.</p>
            </div>
          ) : (
            <div className="aiz-pos-product-list c-scrollbar-light">
              <div className="d-flex flex-wrap justify-content-center">
                {products.map((item, index) => (
                  <div className="w-150px w-xl-180px w-xxl-210px mx-2 mb-4" key={index}>
                    <div className="card bg-white c-pointer product-card hov-container" onClick={() => addToCart(item)}>
                      <div className="position-relative">
                        <span className="absolute-top-left mt-1 ms-1 me-0">
                          <span className={`badge badge-inline badge-${item.stock > 0 ? "success" : "danger"} fs-10`}>
                            {(item.stock > 0 ? "En Stock: " : "Agotado: ") + item.stock}
                          </span>
                        </span>
                        {item.variant && (
                          <span className="badge badge-inline badge-warning absolute-bottom-left mb-1 ms-1 me-1 fs-9 text-variant">
                            {item.variant}
                          </span>
                        )}
                        <img
                          src={item.thumbnail_image}
                          className="card-img-top img-fit h-120px h-xl-180px h-xxl-210px mw-100 mx-auto"
                        />
                      </div>
                      <div className="card-body p-2 p-xl-3 h-95">
                        <div className="fw-600 fs-12 mb-2 h-line">{item.name}</div>
                        <div className="">
                          <span className="fs-12">
                            S/<NumberFormatter value={item.price}></NumberFormatter>
                          </span>
                        </div>
                      </div>
                      <div
                        className={`add-plus absolute-full rounded overflow-hidden hov-box ${
                          item.stock <= 0 ? "c-not-allowed" : ""
                        }`}
                        data-stock-id="791"
                      >
                        <div className="absolute-full bg-dark opacity-50"></div>
                        <i className="bx bx-plus absolute-center la-6x text-white"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {currentPage < lastPage && (
                <div className="text-center mt-3 mb-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={loading}
                  >
                    {loading ? "Cargando..." : "Cargar más"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="col-md-5 w-md-350px w-lg-400px w-xl-500px">
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex border-bottom pb-3">
                <div className="flex-grow-1">
                  <AsyncSelect
                    loadOptions={fetchCustomers}
                    isClearable
                    defaultOptions
                    placeholder="Seleccione un cliente"
                    value={selectedUser}
                    onChange={handleUserChange}
                  />
                </div>
              </div>
              <div id="cart-detail">
                <div className="aiz-pos-cart-list mb-4 mt-3 c-scrollbar-light">
                  <ul className="list-group list-group-flush">
                    {cart.map((item, index) => (
                      <li className="list-group-item py-0 ps-0 pe-0" key={index}>
                        <div className="row gutters-5 align-items-center">
                          <div className="col-auto w-60px">
                            <div className="row no-gutters align-items-center flex-column aiz-plus-minus">
                              <button
                                className="btn col-auto btn-icon btn-sm fs-15"
                                type="button"
                                onClick={() => updateQuantity(item.uid, item.quantity + 1)}
                              >
                                <i className="bx bx-plus"></i>
                              </button>
                              <input
                                type="text"
                                className="col border-0 text-center flex-grow-1 fs-16 input-number"
                                placeholder="0"
                                value={item.quantity}
                                min="1"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    updateQuantity(item.uid, value === "" ? "" : parseInt(value));
                                  }
                                }}
                              />
                              <button
                                className="btn col-auto btn-icon btn-sm fs-15"
                                type="button"
                                onClick={() => updateQuantity(item.uid, item.quantity - 1)}
                              >
                                <i className="bx bx-minus"></i>
                              </button>
                            </div>
                          </div>
                          <div className="col">
                            <div className="text-black fs-12">
                              {item.name} {item.variant && " - " + item.variant}
                            </div>
                            <span className="span badge badge-inline fs-12 badge-soft-secondary"></span>
                          </div>
                          <div className="col-auto">
                            <div className="fs-12 opacity-60">
                              S/<NumberFormatter value={item.price}></NumberFormatter>{" "}
                              {" x " + parseInt(item.quantity || "0")}
                            </div>
                            {item.exclusivo_gm360 == 1 && userDiscount == 1 ? (
                              <>
                                <div className="fs-12 opacity-60">
                                  <del>
                                    S/
                                    <NumberFormatter
                                      value={item.price * parseInt(item.quantity || "0")}
                                    ></NumberFormatter>
                                  </del>
                                </div>
                                <div className="fs-15 fw-600 text-black">
                                  S/
                                  <NumberFormatter
                                    value={(item.price * parseInt(item.quantity || "0")) / 2}
                                  ></NumberFormatter>
                                </div>
                              </>
                            ) : (
                              <div className="fs-15 fw-600 text-black">
                                S/
                                <NumberFormatter value={item.price * parseInt(item.quantity || "0")}></NumberFormatter>
                              </div>
                            )}
                            <div className="fs-12 opacity-60">
                              Puntos: {item.puntos * parseInt(item.quantity || "0")}
                            </div>
                          </div>
                          <div className="col-auto">
                            <button
                              type="button"
                              className="btn btn-circle btn-icon btn-sm btn-soft-danger ms-2 mr-0"
                              onClick={() => removeFromCart(item.uid)}
                            >
                              <i className="bx bx-trash-alt fs-13"></i>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="d-flex justify-content-between fw-600 mb-2 opacity-70 fs-12">
                    <span>Total Bruto</span>
                    <span>
                      S/<NumberFormatter value={totalBruto}></NumberFormatter>
                    </span>
                  </div>
                  {totalBruto > subtotal && (
                    <div className="d-flex justify-content-between fw-600 mb-2 opacity-70 fs-12">
                      <span>Descuento</span>
                      <span>
                        S/<NumberFormatter value={totalBruto - subtotal}></NumberFormatter>
                      </span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between fw-600 mb-2 opacity-70 fs-12">
                    <span>Total Neto</span>
                    <span>
                      S/<NumberFormatter value={subtotal}></NumberFormatter>
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fw-600 mb-2 opacity-70 fs-12">
                    <span>Puntos</span>
                    <span>{puntos}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-600 fs-17 border-top pt-2 text-black">
                    <span>Sub Total</span>
                    <span>
                      S/<NumberFormatter value={subtotal}></NumberFormatter>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pos-footer mar-btm">
            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-outline-primary" onClick={clearCart}>
                Limpiar Carrito
              </button>
              <button type="button" className="btn btn-primary btn-block" onClick={openModalOrder}>
                Realizar Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showChangeOrder} onHide={handleCloseChangeOrder} centered size="lg">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="pt-0">
          <form onSubmit={orderConfirmation}>
            <div className="row">
              <div className="col-12">
                <h5>Tipo de Envío</h5>
              </div>
              <div className="col-12 col-md-6 mb-2 mb-md-3">
                <div
                  className={`form-check custom-option custom-option-basic ${
                    shippingType === "home_delivery" ? "checked" : ""
                  }`}
                  onClick={() => {
                    setShippingType("home_delivery");
                    setSelectedPickupPoints(null);
                  }}
                >
                  <label
                    className="form-check-label custom-option-content form-check-input-payment d-flex gap-4 align-items-center"
                    htmlFor="customHomeDelivery"
                  >
                    <input
                      name="customShippingType"
                      className="form-check-input"
                      type="radio"
                      value="credit-card"
                      id="customHomeDelivery"
                      checked={shippingType === "home_delivery" ? true : false}
                    />
                    <span className="custom-option-body">
                      <span className="fw-medium text-heading">Entrega a Domicilio</span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2 mb-md-3">
                <div
                  className={`form-check custom-option custom-option-basic ${
                    shippingType === "pickup_point" ? "checked" : ""
                  }`}
                  onClick={() => {
                    setShippingType("pickup_point");
                    setSelectedAddress(null);
                    setTotalDelivery(0);
                  }}
                >
                  <label
                    className="form-check-label custom-option-content form-check-input-payment d-flex gap-4 align-items-center"
                    htmlFor="customPickupPoint"
                  >
                    <input
                      name="customShippingType"
                      className="form-check-input"
                      type="radio"
                      value="credit-card"
                      id="customPickupPoint"
                      checked={shippingType === "pickup_point" ? true : false}
                    />
                    <span className="custom-option-body">
                      <span className="fw-medium text-heading">Recoger en Local</span>
                    </span>
                  </label>
                </div>
              </div>
              {shippingType === "home_delivery" ? (
                <div className="col-12 mb-4">
                  <Select
                    options={address}
                    isSearchable
                    isClearable
                    isLoading={isLoadingAddress}
                    placeholder={isLoadingAddress ? "Cargando..." : "Seleccione una dirección"}
                    value={address.find((option) => option.value === selectedAddress) || null}
                    onChange={(selectedOption) => {
                      setSelectedAddress(selectedOption ? selectedOption.value : null);
                    }}
                  />
                </div>
              ) : (
                <div className="col-12 mb-4">
                  <Select
                    options={pickupPoints}
                    isSearchable
                    isClearable
                    isLoading={isLoadingPickupPoints}
                    placeholder={isLoadingPickupPoints ? "Cargando..." : "Seleccione un local"}
                    value={pickupPoints.find((option) => option.value === selectedPickupPoints) || null}
                    onChange={(selectedOption) => {
                      setSelectedPickupPoints(selectedOption ? selectedOption.value : null);
                    }}
                  />
                </div>
              )}
              <div className="col-12">
                <h5>Estado de Envío</h5>
              </div>
              <div className="col-12 col-md-6 mb-2 mb-md-4">
                <div
                  className={`form-check custom-option custom-option-basic ${
                    deliveryStatus === "pending" ? "checked" : ""
                  }`}
                  onClick={() => setDeliveryStatus("pending")}
                >
                  <label
                    className="form-check-label custom-option-content form-check-input-payment d-flex gap-4 align-items-center"
                    htmlFor="customPending"
                  >
                    <input
                      name="customDeliveryStatus"
                      className="form-check-input"
                      type="radio"
                      id="customPending"
                      checked={deliveryStatus === "pending" ? true : false}
                    />
                    <span className="custom-option-body">
                      <span className="fw-medium text-heading">Pendiente</span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-2 mb-md-4">
                <div
                  className={`form-check custom-option custom-option-basic ${
                    deliveryStatus === "delivered" ? "checked" : ""
                  }`}
                  onClick={() => setDeliveryStatus("delivered")}
                >
                  <label
                    className="form-check-label custom-option-content form-check-input-payment d-flex gap-4 align-items-center"
                    htmlFor="customDelivered"
                  >
                    <input
                      name="customDeliveryStatus"
                      className="form-check-input"
                      type="radio"
                      id="customDelivered"
                      checked={deliveryStatus === "delivered" ? true : false}
                    />
                    <span className="custom-option-body">
                      <span className="fw-medium text-heading">Entregado</span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-12">
                <h5>Método de Pago</h5>
              </div>
              {balanceData ? (
                <>
                  <div className="col-12 col-md-6 mb-2 mb-md-4">
                    <div
                      className={`form-check custom-option custom-option-basic ${
                        paymentType === "wallet" ? "checked" : ""
                      }`}
                      onClick={() => setPaymentType("wallet")}
                    >
                      <label
                        className="form-check-label custom-option-content form-check-input-payment d-flex gap-4 align-items-center"
                        htmlFor="customWallet"
                      >
                        <input
                          name="customPaymentType"
                          className="form-check-input"
                          type="radio"
                          value="credit-card"
                          id="customWallet"
                          checked={paymentType === "wallet" ? true : false}
                        />
                        <span className="custom-option-body">
                          <span className="fw-medium text-heading">
                            Mi billetera virtual: {balanceData.balance.symbol}
                            <NumberFormatter value={balanceData.balance.amount}></NumberFormatter>
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-2 mb-md-4">
                    <div
                      className={`form-check custom-option custom-option-basic ${
                        paymentType === "cash" ? "checked" : ""
                      }`}
                      onClick={() => setPaymentType("cash")}
                    >
                      <label
                        className="form-check-label custom-option-content form-check-input-payment d-flex gap-4 align-items-center"
                        htmlFor="customCash"
                      >
                        <input
                          name="customPaymentType"
                          className="form-check-input"
                          type="radio"
                          value="credit-card"
                          id="customCash"
                          checked={paymentType === "cash" ? true : false}
                        />
                        <span className="custom-option-body">
                          <span className="fw-medium text-heading">Pago en Efectivo</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p>Cargando Información...</p>
                </div>
              )}
              <div className="col-12">
                <div className="border rounded p-3 mb-4">
                  <h6>
                    <font className="v-align">
                      <font className="v-align">Resumen de compra</font>
                    </font>
                  </h6>
                  <dl className="row mb-0 text-heading">
                    <dt className="col-6 fw-normal">
                      <font className="v-align">
                        <font className="v-align">Puntos</font>
                      </font>
                    </dt>
                    <dd className="col-6 text-end">
                      <font className="v-align">
                        <font className="v-align">{puntos}</font>
                      </font>
                    </dd>
                    <dt className="col-6 fw-normal">
                      <font className="v-align">
                        <font className="v-align">Total Bruto</font>
                      </font>
                    </dt>
                    <dd className="col-6 text-end">
                      <font className="v-align">
                        <font className="v-align">
                          S/<NumberFormatter value={totalBruto}></NumberFormatter>
                        </font>
                      </font>
                    </dd>
                    {totalBruto > subtotal && (
                      <>
                        <dt className="col-6 fw-normal">
                          <font className="v-align">
                            <font className="v-align">Descuento</font>
                          </font>
                        </dt>
                        <dd className="col-6 text-end">
                          <font className="v-align">
                            <font className="v-align">
                              S/<NumberFormatter value={totalBruto - subtotal}></NumberFormatter>
                            </font>
                          </font>
                        </dd>
                      </>
                    )}
                    <dt className="col-6 fw-normal">
                      <font className="v-align">
                        <font className="v-align">Total neto</font>
                      </font>
                    </dt>
                    <dd className="col-6 text-end">
                      <font className="v-align">
                        <font className="v-align">
                          S/<NumberFormatter value={subtotal}></NumberFormatter>
                        </font>
                      </font>
                    </dd>

                    <dt className="col-6 fw-normal">
                      <font className="v-align">
                        <font className="v-align">Total por Envío</font>
                      </font>
                    </dt>
                    <dd className="col-6 text-end">
                      <font className="v-align">
                        <font className="v-align">
                          S/<NumberFormatter value={totalDelivery}></NumberFormatter>
                        </font>
                      </font>
                      {/* <span className="badge bg-label-success ms-2">
                        <font className="v-align">
                          <font className="v-align">Gratis</font>
                        </font>
                      </span> */}
                    </dd>
                  </dl>
                  <hr className="mx-n6 my-6" />
                  <dl className="row mb-0">
                    <dt className="col-6 text-heading">
                      <font className="v-align">
                        <font className="v-align">Gran Total</font>
                      </font>
                    </dt>
                    <dd className="col-6 fw-medium text-end text-heading mb-0">
                      <font className="v-align">
                        <font className="v-align">
                          S/<NumberFormatter value={granTotal}></NumberFormatter>
                        </font>
                      </font>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="col-12 mt-4 text-end">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading && (
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                  Confirmar
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};
