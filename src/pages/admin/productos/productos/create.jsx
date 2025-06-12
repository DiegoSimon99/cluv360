import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { showNotification } from "../../../../utils/greetingHandler";
import { useDropzone } from "react-dropzone";
import apiClient from "../../../../api/axios";
import ReactQuill from "react-quill";

export const Create = () => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [loadingAttributes, setLoadingAttributes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [loadingSubSubcategories, setLoadingSubSubcategories] = useState(false);
  const [colorEnabled, setColorEnabled] = useState(true);
  const [variations, setVariations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    exclusivo_gm360: 0,
    category_id: null,
    subcategory_id: null,
    subsubcategory_id: null,
    brand_id: null,
    unit: "",
    colors: [],
    attributes: [],
    choice_options: [],
    barcode: "",
    unit_price: 0,
    discount: 0,
    discount_type: "amount",
    earn_point: 0,
    current_stock: 0,
    video_provider: null,
    video_link: null,
    pdf: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoadingAttributes(true);
        const response = await apiClient.get("/admin/products/attributes");
        setAttributes(response.data);
      } catch (error) {
        showNotification("Ocurrio un error al listar los atributos.", "error");
      } finally {
        setLoadingAttributes(false);
      }
    };

    fetchAttributes();

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await apiClient.get("/admin/subcategories/categories");
        const categoryOptions = response.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setCategories(categoryOptions);
      } catch (error) {
        showNotification("Ocurrio un error al obtener lista de categorías", "error");
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!formData.category_id) return;

    const fetchSubcategories = async () => {
      try {
        setLoadingSubcategories(true);
        const response = await apiClient.get(`/admin/subsubcategories/subcategories/select/${formData.category_id}`);

        const subcategoryOptions = response.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));

        setSubcategories(subcategoryOptions);
      } catch (error) {
        showNotification("Ocurrio un error al obtener lista de subcategorías", "error");
        setSubcategories([]);
      } finally {
        setLoadingSubcategories(false);
      }
    };

    fetchSubcategories();
  }, [formData.category_id]);

  useEffect(() => {
    if (!formData.category_id) return;

    const fetchSubSubcategories = async () => {
      try {
        setLoadingSubSubcategories(true);
        const response = await apiClient.get(`/admin/subsubcategories/select/${formData.subcategory_id}`);

        const subSubcategoryOptions = response.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));

        setSubSubcategories(subSubcategoryOptions);
      } catch (error) {
        showNotification("Ocurrio un error al obtener lista de sub subcategorías", "error");
        setSubSubcategories([]);
      } finally {
        setLoadingSubSubcategories(false);
      }
    };

    fetchSubSubcategories();
  }, [formData.subcategory_id]);

  const onDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));

    if (filteredFiles.length < acceptedFiles.length) {
      showNotification("El archivo no es una imagen y fue descartado.", "error");
    }

    setFiles((prevFiles) =>
      prevFiles.concat(filteredFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })))
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const removeFile = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category_id) {
      showNotification("El campo categoría es obligatorio.", "error");
      return;
    }
    if (!formData.subcategory_id) {
      showNotification("El campo subcategoría es obligatorio.", "error");
      return;
    }

    if (files.length === 0) {
      showNotification("Es obligatorio subir al menos una imagen.", "error");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        if (Array.isArray(value)) {
          if (key === "colors") {
            const array = value.map((item) => item.color);
            data.append("colors", JSON.stringify(array));
          } else if (key === "attributes") {
            const array = value.map((item) => String(item));
            data.append("attributes", JSON.stringify(array));
          } else if (key === "tags") {
            const tagsValue = value.map((tag) => tag.value).join(",");
            data.append("tags", tagsValue);
          } else if (key === "choice_options") {
            data.append("choice_options", JSON.stringify(value));
          }
        } else if (key === "brand_id") {
          data.append("brand_id", String(value.value));
        } else if (key === "pdf" && value instanceof File) {
          data.append("pdf", value);
        } else {
          data.append(key, value);
        }
      }
    });

    data.append("variations", JSON.stringify(variations));

    files.forEach((file, index) => {
      if (file instanceof File) {
        data.append("photos[]", file); // Agregar el archivo al FormData
      } else {
        console.error(`Elemento no válido en files[${index}]:`, file);
      }
    });

    setLoading(true);
    apiClient
      .post(`/admin/products/store`, data)
      .then((response) => {
        if (response.data.success) {
          showNotification(response.data.message, "success");
          navigate("/admin/products");
        } else {
          showNotification(response.data.message, "error");
        }
      })
      .catch((error) => {
        showNotification(error.response?.data?.message || "Error al guardar producto", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, type, checked, value, files } = e.target;

    let newValue = value;

    if (name === "unit_price" || name === "discount") {
      // Permite solo números y un solo punto decimal
      newValue = newValue.replace(/[^0-9.]/g, "");

      // Evita múltiples puntos decimales
      const dotCount = (newValue.match(/\./g) || []).length;
      if (dotCount > 1) {
        newValue = newValue.slice(0, -1); // Elimina el último carácter si es un segundo punto
      }
    }

    if (type === "file" && name === "pdf") {
      const file = files[0]; // Obtiene el archivo seleccionado
      if (file) {
        if (file.type !== "application/pdf") {
          showNotification("Solo se permiten archivos en formato PDF.", "error");
          e.target.value = "";
          return;
        }
        newValue = file;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : newValue,
    }));
  };

  const loadOptions = async (inputValue) => {
    try {
      const response = await apiClient.get(`/admin/products/colores?search=${inputValue}`);
      return response.data.map((color) => ({
        value: color.id,
        label: color.name,
        color: color.code,
      }));
    } catch (error) {
      showNotification("Ocurrio un error al obtener lista de colores", "error");
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

  const handleChangeEditor = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setColorEnabled(!e.target.checked);
  };

  const generateVariations = (choice_options, colors, colorEnabled) => {
    let attributeValues = [];

    // Verificar si hay atributos seleccionados y extraer valores
    if (choice_options && choice_options.length > 0) {
      attributeValues = choice_options
        .map((option) => option.values || [])
        .filter((values) => Array.isArray(values) && values.length > 0);
    }

    // **Nueva lógica: Si no hay atributos, aún podemos generar variaciones con solo colores**
    if (attributeValues.length === 0 && colors.length === 0) {
      return [];
    }

    // Función para generar combinaciones de atributos
    const combine = (arrays, prefix = "") => {
      if (!arrays.length) return [prefix];
      const [first, ...rest] = arrays;
      if (!Array.isArray(first)) return [prefix];

      return first.flatMap((value) => combine(rest, prefix ? `${prefix}-${value}` : value));
    };

    // Obtener combinaciones de atributos (si existen)
    const attributeCombinations = attributeValues.length > 0 ? combine(attributeValues) : [""]; // Si no hay atributos, usar una cadena vacía para combinar con colores

    // Obtener iniciales de cada palabra en `formData.name`
    const getInitials = (name) => {
      return name
        ? name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("")
        : "";
    };

    const initials = getInitials(formData.name);

    let newVariations = [];

    // Si hay colores, generar combinaciones por color
    if (!colorEnabled && colors.length > 0) {
      colors.forEach((color) => {
        const colorLabel = color.label;
        attributeCombinations.forEach((combination) => {
          newVariations.push({
            combination: combination ? `${colorLabel}-${combination}` : colorLabel,
            price: formData.unit_price || 0,
            sku: combination ? `${initials}-${colorLabel}-${combination}` : `${initials}-${colorLabel}`,
            quantity: 10, // Siempre 10 por defecto
          });
        });
      });
    } else {
      // Si no hay colores seleccionados, usar solo atributos
      newVariations = attributeCombinations.map((combination) => ({
        combination,
        price: formData.unit_price || 0,
        sku: `${initials}-${combination}`,
        quantity: 10,
      }));
    }

    return newVariations;
  };

  useEffect(() => {
    if ((!formData.choice_options || formData.choice_options.length === 0) && formData.colors.length === 0) {
      setVariations([]);
      return;
    }

    const newVariations = generateVariations(formData.choice_options, formData.colors, colorEnabled);

    setVariations((prevVariations) =>
      newVariations.map((newVariation) => {
        const existingVariation = prevVariations.find((v) => v.combination === newVariation.combination);

        return {
          ...newVariation,
          price: formData.unit_price,
          sku: formData.name ? `${newVariation.sku}` : `${newVariation.combination}`,
          quantity: existingVariation ? existingVariation.quantity : 10,
        };
      })
    );
  }, [formData.choice_options, formData.colors, formData.name, formData.unit_price, colorEnabled]);

  const handlePriceChange = (index, newPrice) => {
    if (!/^\d*\.?\d*$/.test(newPrice)) return;
    setVariations((prevVariations) => {
      const updatedVariations = [...prevVariations];
      updatedVariations[index] = { ...updatedVariations[index], price: newPrice };
      return updatedVariations;
    });
  };

  const handleSkuChange = (index, newSku) => {
    setVariations((prevVariations) => {
      const updatedVariations = [...prevVariations];
      updatedVariations[index] = { ...updatedVariations[index], sku: newSku };
      return updatedVariations;
    });
  };

  const handleQuantityChange = (index, newQuantity) => {
    setVariations((prevVariations) => {
      const updatedVariations = [...prevVariations];
      updatedVariations[index] = { ...updatedVariations[index], quantity: newQuantity };
      return updatedVariations;
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="card-header align-items-center row">
            <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
              <h5 className="mb-0 text-md-start text-center">DATOS GENERALES DEL PRODUCTO</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Nombre del producto</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Exclusivo GM360</label>
              <div className="col-sm-10 d-flex align-items-center">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="exclusivo_gm360"
                    checked={formData.exclusivo_gm360 === 1}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Categoría</label>
              <div className="col-sm-10">
                <Select
                  options={categories}
                  isSearchable={true}
                  isClearable={true}
                  isLoading={loadingCategories}
                  placeholder={loadingCategories ? "Cargando..." : "Buscar categoría..."}
                  value={categories.find((option) => option.value === formData.category_id) || null} // Selección actual
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      category_id: selectedOption ? selectedOption.value : null,
                      subcategory_id: null, // Reinicia la subcategoría
                    }));
                    setSubcategories([]); // Borra las subcategorías hasta que se carguen las nuevas
                  }}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Subcategoría</label>
              <div className="col-sm-10">
                <Select
                  options={subcategories}
                  isSearchable={true}
                  isClearable={true}
                  isLoading={loadingSubcategories} // Muestra un loading si está cargando
                  placeholder={loadingSubcategories ? "Cargando..." : "Selecciona una subcategoría"}
                  value={subcategories.find((option) => option.value === formData.subcategory_id) || null}
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      subcategory_id: selectedOption ? selectedOption.value : null,
                      subsubcategory_id: null,
                    }));
                  }}
                  isDisabled={!formData.category_id} // Desactiva si no hay categoría seleccionada
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Sub subcategoría</label>
              <div className="col-sm-10">
                <Select
                  options={subSubcategories}
                  isSearchable={true}
                  isClearable={true}
                  isLoading={loadingSubSubcategories} // Muestra un loading si está cargando
                  placeholder={loadingSubSubcategories ? "Cargando..." : "Selecciona una sub subcategoría"}
                  value={subSubcategories.find((option) => option.value === formData.subsubcategory_id) || null}
                  onChange={(selectedOption) => {
                    setFormData((prev) => ({
                      ...prev,
                      subsubcategory_id: selectedOption ? selectedOption.value : null,
                    }));
                  }}
                  isDisabled={!formData.subcategory_id}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">MARCA DEL PRODUCTO</label>
              <div className="col-sm-10">
                <AsyncSelect
                  loadOptions={loadOptionsBrands}
                  defaultOptions
                  onChange={(selectedOption) => setFormData({ ...formData, brand_id: selectedOption })}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">NOMBRE UNITARIO</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">ETIQUETAS DE BÚSQUEDA</label>
              <div className="col-sm-10">
                <CreatableSelect
                  isMulti
                  placeholder="Escriba y presione enter"
                  onChange={(selectedTags) => setFormData({ ...formData, tags: selectedTags })}
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">CÓDIGO DE BARRAS DEL PRODUCTO</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">IMÁGENES PRINCIPALES</label>
              <div className="col-sm-10">
                <div
                  {...getRootProps()}
                  style={{
                    border: "2px dashed #cccccc",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                >
                  <input {...getInputProps()} />
                  <p className="m-0">Arrastra tus imágenes aquí o haz clic para seleccionarlas</p>
                </div>
                <div className="preview-container" style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
                  {files.map((file) => (
                    <div key={file.name} style={{ margin: "10px", position: "relative" }}>
                      <img
                        src={file.preview}
                        alt="preview"
                        style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-xs"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          width: "20px",
                          height: "20px",
                        }}
                        onClick={() => removeFile(file.name)}
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-header align-items-center row">
            <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
              <h5 className="mb-0 text-md-start text-center">DEFINA EL PRECIO DEL PRODUCTO Y AÑADE EL STOCK</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">COSTO DE VENTA</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">DESCUENTO</label>
              <div className="col-sm-7">
                <input
                  type="text"
                  className="form-control"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-sm-3">
                <select
                  className="form-select"
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  required
                >
                  <option value="amount">Monto</option>
                  <option value="percent">Porcentaje</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Puntos</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="earn_point"
                  value={formData.earn_point}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {(formData.colors.length > 0 && !colorEnabled) || formData.choice_options.length > 0 ? (
              <div className="row mt-4 mb-3">
                <div className="col-sm-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>VARIANTE</th>
                        <th>PRECIO PERSONALIZADO</th>
                        <th>SKU</th>
                        <th>CANTIDAD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.length > 0 ? (
                        variations.map((variation, index) => (
                          <tr key={index}>
                            {/* Variante */}
                            <td>{variation.combination}</td>

                            {/* Precio Personalizado */}
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                value={variation.price}
                                onChange={(e) => handlePriceChange(index, e.target.value)}
                              />
                            </td>

                            {/* SKU */}
                            <td>
                              <input
                                className="form-control"
                                type="text"
                                value={variation.sku}
                                onChange={(e) => handleSkuChange(index, e.target.value)}
                              />
                            </td>

                            {/* Cantidad */}
                            <td>
                              <input
                                className="form-control"
                                type="number"
                                value={variation.quantity}
                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No hay variaciones generadas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="row mb-3">
                <label className="col-sm-2 col-form-label">Cantidad de productos en stock</label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    className="form-control"
                    name="current_stock"
                    value={formData.current_stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-header align-items-center row">
            <div className="col-12 col-md-10 pt-0 pt-md-2 mb-4">
              <h5 className="mb-0 text-md-start text-center">PERSONALIZA LAS OPCIONES PARA EL CLIENTE</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Colores</label>
              <div className="col-sm-7">
                <AsyncSelect
                  loadOptions={loadOptions}
                  defaultOptions
                  isMulti
                  isDisabled={colorEnabled}
                  onChange={(selectedColors) => setFormData({ ...formData, colors: selectedColors })}
                  getOptionLabel={(e) => (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          backgroundColor: e.color,
                          marginRight: 10,
                        }}
                      />
                      {e.label}
                    </div>
                  )}
                />
              </div>
              <div className="col-sm-3 d-flex align-items-center">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="colors_active"
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Atributo</label>
              <div className="col-sm-7">
                <Select
                  options={attributes}
                  isLoading={loadingAttributes}
                  placeholder={loadingAttributes ? "Cargando..." : "Selecciona Atributo"}
                  isMulti
                  onChange={(selectedAttributes) => {
                    setFormData({
                      ...formData,
                      attributes: selectedAttributes.map((attr) => attr.value), // Guardar solo IDs en attributes
                      choice_options: selectedAttributes.map((attr) => ({
                        attribute_id: attr.value,
                        values: [],
                      })), // Inicializamos choice_options vacío
                    });
                  }}
                />
              </div>
            </div>
            {formData.choice_options.map((attribute, index) => (
              <div key={attribute.attribute_id} className="row mb-3">
                <label className="col-sm-2 col-form-label">
                  {attributes.find((attr) => attr.value === attribute.attribute_id)?.label}
                </label>
                <div className="col-sm-7">
                  <CreatableSelect
                    isMulti
                    placeholder="Escriba y presione enter"
                    value={attribute.values.map((value) => ({ value, label: value }))} // Muestra valores actuales
                    onChange={(selectedTags) => {
                      const updatedChoiceOptions = [...formData.choice_options];
                      updatedChoiceOptions[index] = {
                        ...attribute,
                        values: selectedTags.map((tag) => tag.value), // Asegurar que guarda correctamente
                      };
                      setFormData({ ...formData, choice_options: updatedChoiceOptions });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-header align-items-center row">
            <div className="col-12 col-md-10 pt-0 pt-md-2">
              <h5 className="mb-0 text-md-start text-center">DESCRIBE LOS DETALLES DEL PRODUCTO</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-5">
              <label className="col-sm-2 col-form-label">DESCRIPCIÓN</label>
              <div className="col-sm-10">
                <ReactQuill
                  value={formData.description}
                  onChange={handleChangeEditor}
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-header align-items-center row">
            <div className="col-12 col-md-10 pt-0 pt-md-2">
              <h5 className="mb-0 text-md-start text-center">MUESTRA UN VIDEO SOBRE EL PRODUCTO (OPCIONAL)</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Video desde</label>
              <div className="col-sm-10">
                <select
                  className="form-select"
                  name="video_provider"
                  value={formData.video_provider}
                  onChange={handleChange}
                >
                  <option value="youtube">Youtube</option>
                  <option value="dailymotion">Dailymotion</option>
                  <option value="vimeo">Vimeo</option>
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">URL del video</label>
              <div className="col-sm-10">
                <input
                  className="form-control"
                  type="text"
                  name="video_link"
                  value={formData.video_link}
                  placeholder="EJEMPLO: https://www.youtube.com/watch?v=Nqw0D3oCP0w"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-header align-items-center row">
            <div className="col-12 col-md-10 pt-0 pt-md-2">
              <h5 className="mb-0 text-md-start text-center">ESPECIFICACIONES EN PDF (OPCIONAL)</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">ADJUNTAR PDF</label>
              <div className="col-sm-10">
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  name="pdf"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-end pt-3 mt-md-0">
          <div className="col-sm-10 text-end">
            <button aria-label="Click me" type="submit" className="btn btn-primary" disabled={loading}>
              <div className="d-flex align-items-center">
                {loading && (
                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
                Guardar
              </div>
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
