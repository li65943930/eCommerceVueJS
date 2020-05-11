import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../views/Home.vue";
import Products from "../views/Products.vue";
import Cart from "../views/Cart.vue";
import ProductDetail from "../views/ProductDetail.vue";
import Profile from "../views/Profile.vue";
import About from "../views/About.vue";
import Contact from "../views/Contact.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart
  },
  {
    path: "/productDetail/:productId",
    name: "ProductDetail",
    component: ProductDetail
  },
  {
    path: "/smartphone",
    name: "Smartphone",
    component: Products
  },
  {
    path: "/laptop",
    name: "Laptop",
    component: Products
  },
  {
    path: "/headphone",
    name: "Headphone",
    component: Products
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/contact/",
    name: "Contact",
    component: Contact
  }
];

const router = new VueRouter({
  routes
});

export default router;
