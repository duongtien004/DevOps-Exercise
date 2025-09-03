// router/admin/routes.js
import SigninView from "@/views/admin/Authentication/SigninView.vue";
import ECommerceView from "@/views/admin/Dashboard/ECommerceView.vue";
import OrderView from "@/views/admin/OrderView.vue";
import ListProductView from "@/views/admin/Products/ListProductView.vue";
import AddProductView from "@/views/admin/Products/AddProductView.vue";
import CategoryProductView from "@/views/admin/Products/CategoryProductView.vue";
import CustomerView from "@/views/admin/Customer/CustomerView.vue";

export const adminRoutes = [

  // Admin routes
  {
    path: "/admin/",
    meta: { requiresAuth: false },
    children: [
      {
        path: "",
        name: "eCommerce",
        component: ECommerceView,
        meta: { title: "eCommerce Dashboard" },
      },
      {
        path: "order",
        name: "order",
        component: OrderView,
        meta: { title: "Order" },
      },
      {
        path: "auth",
        children: [
          {
            path: "signin",
            name: "signin",
            component: SigninView,
            meta: { title: "Signin" },
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            path: "import",
            name: "importproduct",
            component: AddProductView,
            meta: { title: "Import Products" },
          },
          {
            path: "list",
            name: "listproduct",
            component: ListProductView,
            meta: { title: "Products" },
          },
          {
            path: "categories",
            name: "categoryproduct",
            component: CategoryProductView,
            meta: { title: "Product Categories" },
          },
        ],
      },
    
      {
        path: "customers",
        name: "customer",
        component: CustomerView,
        meta: { title: "Customers Management" },
      },
     
    ],
  },
];
