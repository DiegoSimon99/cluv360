import { Route, Routes } from "react-router-dom";

import { LoginPage } from "../pages/admin/authentication/LoginPage";
import { ErrorPage } from "../pages/misc/ErrorPage";
import { DashboardPage } from "../pages/admin/DashboardPage";
import AdminRoutes from "./AdminRoutes";
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
import { Index as AdminListaCustomerPackage } from "../pages/admin/paquetes";
import { Create as AdminCreateCustomerPackage } from "../pages/admin/paquetes/create";
import { Edit as AdminEditCustomerPackage } from "../pages/admin/paquetes/edit";
import { Activation as AdminConfigBusinessSettings } from "../pages/admin/business-settings/activation";
import { PaymentMethod as AdminConfigPaymentMethod } from "../pages/admin/business-settings/payment-method";
import { SmtSettings as AdminConfigSmtSettings } from "../pages/admin/business-settings/smtp-settings";
import { Index as AdminListaCurrency } from "../pages/admin/business-settings/currency";
import { Create as AdminCreateCurrency } from "../pages/admin/business-settings/currency/create";
import { Edit as AdminEditCurrency } from "../pages/admin/business-settings/currency/edit";
import { Index as AdminSellerPolicy } from "../pages/admin/frontend-settings/seller-policy";
import { Index as AdminReturnPolicy } from "../pages/admin/frontend-settings/return-policy";
import { Index as AdminSupportPolicy } from "../pages/admin/frontend-settings/support-policy";
import { Index as AdminTerms } from "../pages/admin/frontend-settings/terms";
import { Index as AdminPrivacyPolicy } from "../pages/admin/frontend-settings/privacy-policy";
import { Index as AdminPrivacyPolicyYala } from "../pages/admin/frontend-settings/privacy-policy-yala";
import { Index as AdminGeneralSettings } from "../pages/admin/frontend-settings/configuracion-general";
import { Logo as AdminLogoSettings } from "../pages/admin/frontend-settings/logo";
import { Index as AdminListaAttribute } from "../pages/admin/e-commerce-setup/atributos";
import { Create as AdminCreateAttribute } from "../pages/admin/e-commerce-setup/atributos/create";
import { Edit as AdminEditAttribute } from "../pages/admin/e-commerce-setup/atributos/edit";
import { Index as AdminListaPickUpPoint } from "../pages/admin/e-commerce-setup/punto-recogida";
import { Create as AdminCreatePickUpPoint } from "../pages/admin/e-commerce-setup/punto-recogida/create";
import { Edit as AdminEditPickUpPoint } from "../pages/admin/e-commerce-setup/punto-recogida/edit";
import { Index as AdminListaManualPaymentMethod } from "../pages/admin/sistema-pago/metodo-pago";
import { Create as AdminCreateManualPaymentMethod } from "../pages/admin/sistema-pago/metodo-pago/create";
import { Edit as AdminEditManualPaymentMethod } from "../pages/admin/sistema-pago/metodo-pago/edit";
import { Index as AdminListaWalletRecharge } from "../pages/admin/sistema-pago/solicitud-recarga";
import { Index as AdminOtpConfiguration } from "../pages/admin/otp-system/otp-configuration";
import { Index as AdminOtpCredentialsConfiguration } from "../pages/admin/otp-system/otp-credentials-configuration";
import { Index as AdminListaSupportTicket } from "../pages/admin/support-ticket";
import { Detail as AdminDetailSupportTicket } from "../pages/admin/support-ticket/detail";
import { Index as AdminListaStaff } from "../pages/admin/staff";
import { Create as AdminCreateStaff } from "../pages/admin/staff/create";
import { Edit as AdminEditStaff } from "../pages/admin/staff/edit";
import { Index as AdminListaRoles } from "../pages/admin/roles";
import { Create as AdminCreateRoles } from "../pages/admin/roles/create";
import { Edit as AdminEditRoles } from "../pages/admin/roles/edit";
import { Index as AdminTemplateBienvenida } from "../pages/admin/templates/bienvenida";
import { Index as AdminTemplateCompras } from "../pages/admin/templates/compras";
import { Index as AdminTemplateInversion } from "../pages/admin/templates/inversion";
import { Index as AdminTemplateComisiones } from "../pages/admin/templates/comisiones";
import { Index as AdminTemplateComentarios } from "../pages/admin/templates/comentarios";
import { Index as AdminTemplateCentrales } from "../pages/admin/templates/centrales";
import { Index as AdminTemplateSeguidor } from "../pages/admin/templates/nuevo-seguidor";
import { Index as AdminTemplateMembresia } from "../pages/admin/templates/membresia";
import { Index as AdminTemplateHappyBirthday } from "../pages/admin/templates/happy-birthday";
import { Index as AdminTemplateCodeVerification } from "../pages/admin/templates/code-verification";
import { Index as AdminTemplateResetAcount } from "../pages/admin/templates/reset-acount";
import { Index as AdminTemplateCodeTransaction } from "../pages/admin/templates/code-transaction";
import { Index as AdminListaPos } from "../pages/admin/pos";
import { Index as AdminEditInversiones } from "../pages/admin/configuracion-mlm/inversiones";
import { Index as AdminEditCentrales } from "../pages/admin/configuracion-mlm/centrales";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      {/* <Route path="/auth/register" element={<RegisterPage />} /> */}
      {/* <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} /> */}

      {/* <Route path="/login" element={<Login />} /> */}

      {/* Ruta protegida para administradores */}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route path="dashboard" element={<DashboardPage />} />

        <Route element={<ProtectedRoute requiredPermissions={[1]} />}>
          <Route path="pos" element={<AdminListaPos />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[2]} />}>
          <Route path="cierre-premium" element={<CierrePremium />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[3]} />}>
          <Route path="customers/list" element={<AdminListaCustomers />} />
          <Route path="customers/delete-request" element={<SolicitudesCustomers />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[4]} />}>
          <Route path="movements" element={<AdminListaMovimientos />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[5]} />}>
          <Route path="direct-sale" element={<VentaDirecta />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[6]} />}>
          <Route path="proyectos" element={<AdminListaProyectos />} />
          <Route path="proyectos/create" element={<AdminCreateProyectos />} />
          <Route path="proyectos/edit/:id" element={<AdminEditProyectos />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[7]} />}>
          <Route path="discount" element={<AdminListaDescuento />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[8]} />}>
          <Route path="affiliate/user" element={<AdminListaRed />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[9]} />}>
          <Route path="template/bienvenida" element={<AdminTemplateBienvenida />} />
          <Route path="template/compras" element={<AdminTemplateCompras />} />
          <Route path="template/inversion" element={<AdminTemplateInversion />} />
          <Route path="template/comisiones" element={<AdminTemplateComisiones />} />
          <Route path="template/comentarios" element={<AdminTemplateComentarios />} />
          <Route path="template/centrales" element={<AdminTemplateCentrales />} />
          <Route path="template/nuevo-seguidor" element={<AdminTemplateSeguidor />} />
          <Route path="template/membresia" element={<AdminTemplateMembresia />} />
          <Route path="template/happy-birthday" element={<AdminTemplateHappyBirthday />} />
          <Route path="template/code-verification" element={<AdminTemplateCodeVerification />} />
          <Route path="template/reset-acount" element={<AdminTemplateResetAcount />} />
          <Route path="template/code-transaction" element={<AdminTemplateCodeTransaction />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[10]} />}>
          <Route path="posts" element={<AdminListaPosts />} />
          <Route path="denuncias/posts" element={<Reported />} />
          <Route path="conceptos/denuncias" element={<AdminDenunciaConceptos />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[11]} />}>
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
          <Route path="config/inversiones" element={<AdminEditInversiones />} />
          <Route path="config/centrales" element={<AdminEditCentrales />} />
          <Route path="config/terminos-condiciones-yala" element={<AdminTerminosCondicionesYala />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[12]} />}>
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
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[13]} />}>
          <Route path="publications" element={<AdminListaPublicaciones />} />
          <Route path="publications/create" element={<AdminCreatePublicacion />} />
          <Route path="publications/edit/:id" element={<AdminEditPublicacion />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[14]} />}>
          <Route path="orders" element={<AdminListaPedidos />} />
          <Route path="orders/:id" element={<AdminDetailPedido />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[15]} />}>
          <Route path="commissions" element={<AdminListaComisiones />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[16]} />}>
          <Route path="sellers" element={<AdminListaSellers />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[17]} />}>
          <Route path="customer-packages" element={<AdminListaCustomerPackage />} />
          <Route path="customer-packages/create" element={<AdminCreateCustomerPackage />} />
          <Route path="customer-packages/edit/:id" element={<AdminEditCustomerPackage />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[18]} />}>
          <Route path="activation" element={<AdminConfigBusinessSettings />} />
          <Route path="payment-method" element={<AdminConfigPaymentMethod />} />
          <Route path="smtp-settings" element={<AdminConfigSmtSettings />} />
          <Route path="currency" element={<AdminListaCurrency />} />
          <Route path="currency/create" element={<AdminCreateCurrency />} />
          <Route path="currency/edit/:id" element={<AdminEditCurrency />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[19]} />}>
          <Route path="seller_policy" element={<AdminSellerPolicy />} />
          <Route path="return_policy" element={<AdminReturnPolicy />} />
          <Route path="support_policy" element={<AdminSupportPolicy />} />
          <Route path="terms" element={<AdminTerms />} />
          <Route path="privacy_policy" element={<AdminPrivacyPolicy />} />
          <Route path="yala_privacy_policy" element={<AdminPrivacyPolicyYala />} />
          <Route path="generalsettings" element={<AdminGeneralSettings />} />
          <Route path="logosettings" element={<AdminLogoSettings />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[20]} />}>
          <Route path="attributes" element={<AdminListaAttribute />} />
          <Route path="attributes/create" element={<AdminCreateAttribute />} />
          <Route path="attributes/edit/:id" element={<AdminEditAttribute />} />
          <Route path="pick_up_points" element={<AdminListaPickUpPoint />} />
          <Route path="pick_up_points/create" element={<AdminCreatePickUpPoint />} />
          <Route path="pick_up_points/edit/:id" element={<AdminEditPickUpPoint />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[21]} />}>
          <Route path="manual_payment_methods" element={<AdminListaManualPaymentMethod />} />
          <Route path="manual_payment_methods/create" element={<AdminCreateManualPaymentMethod />} />
          <Route path="manual_payment_methods/edit/:id" element={<AdminEditManualPaymentMethod />} />
          <Route path="offline-wallet-recharge-requests" element={<AdminListaWalletRecharge />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[22]} />}>
          <Route path="otp-configuration" element={<AdminOtpConfiguration />} />
          <Route path="otp-credentials-configuration" element={<AdminOtpCredentialsConfiguration />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[23]} />}>
          <Route path="support_ticket" element={<AdminListaSupportTicket />} />
          <Route path="support_ticket/details/:id" element={<AdminDetailSupportTicket />} />
        </Route>

        <Route element={<ProtectedRoute requiredPermissions={[24]} />}>
          <Route path="staffs" element={<AdminListaStaff />} />
          <Route path="staffs/create" element={<AdminCreateStaff />} />
          <Route path="staffs/edit/:id" element={<AdminEditStaff />} />
          <Route path="roles" element={<AdminListaRoles />} />
          <Route path="roles/create" element={<AdminCreateRoles />} />
          <Route path="roles/edit/:id" element={<AdminEditRoles />} />
        </Route>
      </Route>

      {/* Rutas protegidas para customers y sellers */}
      {/* <Route path="/" element={<CustomerRoutes />}>
        <Route path="/dashboard" element={<UserDashboard />} />
      </Route> */}

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};
export default AppRoutes;
