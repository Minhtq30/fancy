import AuthService from "./auth.service";
import CustomerService from "./customer.service";
import AddressService from "./address.service";
import MyShopService from "./myShop.service";
import ProductService from "./product.service";
import PackageService from "./package.service";
import ThunderService from "./thunder.service";
import MapService from "./map.servive";
import ReviewService from "./review.service.js";

const services = {
  $auth: new AuthService(),
  $customer: new CustomerService(),
  $address: new AddressService(),
  $shop: new MyShopService(),
  $product: new ProductService(),
  $package: new PackageService(),
  $thunder: new ThunderService(),
  $map: new MapService(),
  $review: new ReviewService(),
};

export default services;
