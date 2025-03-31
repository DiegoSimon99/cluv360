import { Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/admin/authentication/LoginPage";
import { RegisterPage } from "../pages/admin/authentication/RegisterPage";
import { ForgotPasswordPage } from "../pages/admin/authentication/ForgotPasswordPage";
import { ErrorPage } from "../pages/misc/ErrorPage";
import { DashboardPage } from "../pages/DashboardPage";
import { UserDashboard } from "../pages/web/UserDashboard";

import { Inicio } from "../pages/web/Inicio";
import { Login } from "../pages/web/authentication/Login";
import AdminRoutes from "./AdminRoutes";
import CustomerRoutes from "./CustomerRoutes";
import { ListaMovimientos as AdminListaMovimientos } from "../pages/admin/movimientos/ListaMovimientos";
import { ListaCustomers as AdminListaCustomers } from "../pages/admin/customers/ListaCustomers";
import { Index as CierrePremium } from "../pages/admin/cierre-premium";
import { Solicitudes as SolicitudesCustomers } from "../pages/admin/customers/Solicitudes";
import { Index as VentaDirecta } from "../pages/admin/venta-directa";
import { Index as AdminListaProyectos } from "../pages/admin/proyectos";
import { Create as AdminCreateProyectos } from "../pages/admin/proyectos/create";
import { Edit as AdminEditProyectos } from "../pages/admin/proyectos/edit";
import { Index as AdminListaDescuento } from "../pages/admin/descuento";
import { Index as AdminListaPosts } from "../pages/admin/posts";
import { Reported } from "../pages/admin/posts/reported";
import { Conceptos as AdminDenunciaConceptos } from "../pages/admin/posts/conceptos";
import { General } from "../pages/admin/configuracion-mlm/general";
import { Index as AdminListaRed } from "../pages/admin/red";
import { Index as AdminListaRangos } from "../pages/admin/configuracion-mlm/rangos";
import { Create as AdminCreateRangos } from "../pages/admin/configuracion-mlm/rangos/create";
import { Edit as AdminEditRangos } from "../pages/admin/configuracion-mlm/rangos/edit";
import { Ciclo } from "../pages/admin/configuracion-mlm/ciclo";
import { Index as AdminListaCierreCiclo } from "../pages/admin/configuracion-mlm/cerrar-ciclo";
import { Create as AdminCreateCierreCiclo } from "../pages/admin/configuracion-mlm/cerrar-ciclo/create";
import { Index as AdminListaTareas } from "../pages/admin/configuracion-mlm/tareas";
import { Create as AdminCreateTarea } from "../pages/admin/configuracion-mlm/tareas/create";
import { Edit as AdminEditTarea } from "../pages/admin/configuracion-mlm/tareas/edit";
import { Index as AdminListaEventos } from "../pages/admin/configuracion-mlm/eventos";
import { Create as AdminCreateEvento } from "../pages/admin/configuracion-mlm/eventos/create";
import { Edit as AdminEditEvento } from "../pages/admin/configuracion-mlm/eventos/edit";
import { Index as AdminListaNoticias } from "../pages/admin/configuracion-mlm/noticias";
import { Create as AdminCreateNoticias } from "../pages/admin/configuracion-mlm/noticias/create";
import { Edit as AdminEditNoticia } from "../pages/admin/configuracion-mlm/noticias/edit";
import { Index as AdminListaViajes } from "../pages/admin/configuracion-mlm/viajes";
import { Create as AdminCreateViajes } from "../pages/admin/configuracion-mlm/viajes/create";
import { Edit as AdminEditViaje } from "../pages/admin/configuracion-mlm/viajes/edit";
import { Index as AdminListaTestimonios } from "../pages/admin/configuracion-mlm/testimonios";
import { Create as AdminCreateTestimonios } from "../pages/admin/configuracion-mlm/testimonios/create";
import { Edit as AdminEditTestimonio } from "../pages/admin/configuracion-mlm/testimonios/edit";
import { Red } from "../pages/admin/configuracion-mlm/red";
import { Index as AdminListaProyectosConfig } from "../pages/admin/configuracion-mlm/proyectos";
import { Create as AdminCreateProyectosConfig } from "../pages/admin/configuracion-mlm/proyectos/create";
import { Edit as AdminEditProyecto } from "../pages/admin/configuracion-mlm/proyectos/edit";
import { Index as AdminTerminosCondicionesYala } from "../pages/admin/configuracion-mlm/terminos-condiciones-yala";
import { Index as AdminListaMarcas } from "../pages/admin/productos/marcas";
import { Create as AdminCreateMarcas } from "../pages/admin/productos/marcas/create";
import { Edit as AdminEditMarcas } from "../pages/admin/productos/marcas/edit";
import { Index as AdminListaCategorias } from "../pages/admin/productos/categorias";
import { Create as AdminCreateCategorias } from "../pages/admin/productos/categorias/create";
import { Edit as AdminEditCategorias } from "../pages/admin/productos/categorias/edit";
import { Index as AdminListaSubCategorias } from "../pages/admin/productos/subcategorias";
import { Create as AdminCreateSubCategorias } from "../pages/admin/productos/subcategorias/create";
import { Edit as AdminEditSubCategorias } from "../pages/admin/productos/subcategorias/edit";
import { Index as AdminListaSubSubCategorias } from "../pages/admin/productos/subsubcategorias";
import { Create as AdminCreateSubSubCategorias } from "../pages/admin/productos/subsubcategorias/create";
import { Edit as AdminEditSubSubCategorias } from "../pages/admin/productos/subsubcategorias/edit";
import { Index as AdminListaProductos } from "../pages/admin/productos/productos";
import { Create as AdminCreateProductos } from "../pages/admin/productos/productos/create";
import { Edit as AdminEditProductos } from "../pages/admin/productos/productos/edit";
import { Index as AdminListaProductosSeller } from "../pages/admin/productos/productos-agentes";
import { Index as AdminListaCalificacionProductos } from "../pages/admin/productos/calificacion-productos";
import { Index as AdminListaPublicaciones } from "../pages/admin/publicaciones";
import { Create as AdminCreatePublicacion } from "../pages/admin/publicaciones/create";
import { Edit as AdminEditPublicacion } from "../pages/admin/publicaciones/edit";
import { Index as AdminListaPedidos } from "../pages/admin/ventas-gomarket360";
import { Detail as AdminDetailPedido } from "../pages/admin/ventas-gomarket360/detail";
import { Index as AdminListaComisiones } from "../pages/admin/retirar-comisiones";
import { Index as AdminListaSellers } from "../pages/admin/vendedores";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Inicio />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />


            <Route path="/login" element={<Login />} />

            {/* Ruta protegida para administradores */}
            <Route path="/admin" element={<AdminRoutes />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="movements" element={<AdminListaMovimientos />} />
                <Route path="customers/list" element={<AdminListaCustomers />} />
                <Route path="customers/delete-request" element={<SolicitudesCustomers />} />
                <Route path="cierre-premium" element={<CierrePremium />} />
                <Route path="direct-sale" element={<VentaDirecta />} />
                <Route path="proyectos" element={<AdminListaProyectos />} />
                <Route path="proyectos/create" element={<AdminCreateProyectos />} />
                <Route path="proyectos/edit/:id" element={<AdminEditProyectos />} />
                <Route path="discount" element={<AdminListaDescuento />} />
                <Route path="posts" element={<AdminListaPosts />} />
                <Route path="denuncias/posts" element={<Reported />} />
                <Route path="conceptos/denuncias" element={<AdminDenunciaConceptos />} />
                <Route path="affiliate/user" element={<AdminListaRed />} />
                <Route path="config/general" element={<General />} />
                <Route path="config/rangos" element={<AdminListaRangos />} />
                <Route path="config/rangos/create" element={<AdminCreateRangos />} />
                <Route path="config/rangos/edit/:id" element={<AdminEditRangos />} />
                <Route path="config/ciclo" element={<Ciclo />} />
                <Route path="config/cerrar-ciclo" element={<AdminListaCierreCiclo />} />
                <Route path="config/cerrar-ciclo/create" element={<AdminCreateCierreCiclo />} />
                <Route path="config/cron-job-settings" element={<AdminListaTareas />} />
                <Route path="config/cron-job-settings/create" element={<AdminCreateTarea />} />
                <Route path="config/cron-job-settings/edit/:id" element={<AdminEditTarea />} />
                <Route path="config/eventos" element={<AdminListaEventos />} />
                <Route path="config/eventos/create" element={<AdminCreateEvento />} />
                <Route path="config/eventos/edit/:id" element={<AdminEditEvento />} />
                <Route path="config/noticias" element={<AdminListaNoticias />} />
                <Route path="config/noticias/create" element={<AdminCreateNoticias />} />
                <Route path="config/noticias/edit/:id" element={<AdminEditNoticia />} />
                <Route path="config/viajes" element={<AdminListaViajes />} />
                <Route path="config/viajes/create" element={<AdminCreateViajes />} />
                <Route path="config/viajes/edit/:id" element={<AdminEditViaje />} />
                <Route path="config/testimonios" element={<AdminListaTestimonios />} />
                <Route path="config/testimonios/create" element={<AdminCreateTestimonios />} />
                <Route path="config/testimonios/edit/:id" element={<AdminEditTestimonio />} />
                <Route path="config/red" element={<Red />} />
                <Route path="config/proyectos/create" element={<AdminCreateProyectosConfig />} />
                <Route path="config/proyectos" element={<AdminListaProyectosConfig />} />
                <Route path="config/proyectos/edit/:id" element={<AdminEditProyecto />} />
                <Route path="config/terminos-condiciones-yala" element={<AdminTerminosCondicionesYala />} />
                <Route path="brands" element={<AdminListaMarcas />} />
                <Route path="brands/create" element={<AdminCreateMarcas />} />
                <Route path="brands/edit/:id" element={<AdminEditMarcas />} />
                <Route path="categories" element={<AdminListaCategorias />} />
                <Route path="categories/create" element={<AdminCreateCategorias />} />
                <Route path="categories/edit/:id" element={<AdminEditCategorias />} />
                <Route path="subcategories" element={<AdminListaSubCategorias />} />
                <Route path="subcategories/create" element={<AdminCreateSubCategorias />} />
                <Route path="subcategories/edit/:id" element={<AdminEditSubCategorias />} />
                <Route path="subsubcategories" element={<AdminListaSubSubCategorias />} />
                <Route path="subsubcategories/create" element={<AdminCreateSubSubCategorias />} />
                <Route path="subsubcategories/edit/:id" element={<AdminEditSubSubCategorias />} />
                <Route path="products" element={<AdminListaProductos />} />
                <Route path="products/create" element={<AdminCreateProductos />} />
                <Route path="products/edit/:id" element={<AdminEditProductos />} />
                <Route path="seller/products" element={<AdminListaProductosSeller />} />
                <Route path="reviews/products" element={<AdminListaCalificacionProductos />} />
                <Route path="publications" element={<AdminListaPublicaciones />} />
                <Route path="publications/create" element={<AdminCreatePublicacion />} />
                <Route path="publications/edit/:id" element={<AdminEditPublicacion />} />
                <Route path="orders" element={<AdminListaPedidos />} />
                <Route path="orders/:id" element={<AdminDetailPedido />} />
                <Route path="commissions" element={<AdminListaComisiones />} />
                <Route path="sellers" element={<AdminListaSellers />} />
            </Route>

            {/* Rutas protegidas para customers y sellers */}
            <Route path="/" element={<CustomerRoutes />}>
                <Route path="/dashboard" element={<UserDashboard />} />
            </Route>

            <Route path="*" element={<ErrorPage />} />

        </Routes>
    )
}
export default AppRoutes;