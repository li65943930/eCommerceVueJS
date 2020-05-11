<template>
  <!-- Cart content-->
  <div id="cart">
    <!-- Container for elements -->
    <b-container>

        <b-container v-if="typeof products !== 'undefined' && products.length > 0">
        <!-- Title --> 
        <h4 class="text-center mb-3 mt-3">Shopping Cart</h4>

        <!-- Content Grid -->
        <b-row>

            <!-- Left column: Cart Items-->
            <b-col cols="8">

                <!-- Cart Item -->
                <b-row>
                    <b-col>

                        <b-overlay :show="showItemsRemove" rounded="sm">
                        <b-card no-body v-for="(product, index) in products" :key="product._id" class="overflow-hidden mb-3 shadow pt-1 pb-1">

                            <!-- Cart Grid -->
                            <b-row no-gutters align-v="center">

                                <!-- Image column -->
                                <b-col md="4">
                                    <b-card-img :src="`http://localhost:8081/api/images/${$store.getters.getProduct(product.ProductId).ImagePath}`" fluid :alt="product.Model" class="rounded-0"></b-card-img>
                                </b-col>

                                <!-- Product info column -->
                                <b-col md="3">
                                    <b-card-body class="text-center">
                                        <b-card-title>
                                            {{product.Make}}
                                        </b-card-title>
                                        <b-card-text>
                                            {{product.Model}}
                                        </b-card-text>
                                    </b-card-body>
                                </b-col>

                                <!-- Product quantity column -->
                                <b-col md="2">
                                    <b-form-select v-on:change="quantityChanged(product._id, index)" v-model="product.Quantity" :options="quantityOptions"></b-form-select>  
                                </b-col>

                                <!-- Product price column -->
                                <b-col md="2">
                                    <b-card-text class="text-center h4">${{($store.getters.getProduct(product.ProductId).Price * product.Quantity).toFixed(2)}}</b-card-text>
                                </b-col>
                                
                                <b-col md="1" class="pt-3 pl-2" align-self="start">
                                    <b-card-text> <b-icon-x style="cursor: pointer" @click="removeProduct(product._id)" font-scale="1.5"></b-icon-x> </b-card-text>
                                </b-col>

                            </b-row>

                        </b-card>
                        </b-overlay>
                    </b-col>
                </b-row>

            </b-col>

            <!-- Right column: Cart Total-->
            <b-col>

                <!-- Summary -->
                <b-row>
                    <b-col>

                        <b-overlay :show="showQuantityRecalculation" rounded="sm">
                        <b-card header="Summary" header-class="h4 text-center" class="h5 shadow">
                            <b-card-body>
                                
                                <b-card-text>

                                    <b-row class="mb-3">
                                        <b-col class="text-left">Subtotal</b-col>
                                        <b-col class="text-right">${{subtotal}}</b-col>
                                    </b-row>

                                    <hr>

                                    <b-row class="mb-3">
                                        <b-col class="text-left">Shipping</b-col>
                                        <b-col class="text-right">${{shipping}}</b-col>
                                    </b-row>


                                    <b-row>
                                        <b-col class="text-left">Taxes (13%)</b-col>
                                        <b-col class="text-right">${{taxes}}</b-col>
                                    </b-row>

                                    <hr>
                                    <b-row>
                                        <b-col class="text-left">Total</b-col>
                                        <b-col class="text-right">${{total}}</b-col>
                                    </b-row>

                                    

                                    <b-row align-v="center" class="mt-4">
                                        <b-col>
                                            <google-autocomplete 
                                            ref="autocomplete-shipping"
                                            v-bind:initialValue="shippingAddress"
                                            v-on:shippingAddressChange="shippingAddressChanged">
                                            </google-autocomplete>
                                        </b-col>
                                    </b-row>

                                    <b-row>
                                        <b-col>
                                            <b-button class="mt-3" variant="outline-primary" block @click="finalizePurchase">Purchase</b-button>
                                        </b-col>
                                    </b-row>

                                </b-card-text>

                            </b-card-body>

                        </b-card>
                        </b-overlay>
                    </b-col>
                </b-row>

            </b-col>

        </b-row>
        </b-container>

        <b-container v-else>
            <b-row>
                <b-col>
                    <h4 class="text-center mt-3">Your cart is empty</h4>
                    <h6 class="text-center mb-3 mt-1 text-secondary">Continue shopping</h6>
                </b-col>
            </b-row>
        </b-container>
        
    </b-container>

    <b-modal id="modal-purchase" title="Your order is placed" button-size="sm">
        <p class="my-2">Thank you for your order!</p>
    </b-modal>

  </div>
</template>

<script>

import GoogleAutocomplete from "../components/GoogleAutocomplete";
import store from "../store/index";
import axios from "axios";

export default {
  name: "Cart",
  components: {
      'google-autocomplete': GoogleAutocomplete
  },
  data() {
    return {
        shoppingCartId: 0,
        shippingAddress: "Asddgfg",
        showItemsRemove: false,
        showQuantityRecalculation: false,
        quantityOptions: [
            { text: '1', value: 1},
            { text: '2', value: 2},
            { text: '3', value: 3},
            { text: '4', value: 4},
            { text: '5', value: 5},
            { text: '6', value: 6},
            { text: '7', value: 7},
            { text: '8', value: 8},
            { text: '9', value: 9},
            { text: '10', value: 10}
        ],
        products: [],
        total: 0, 
        subtotal: 0,
        shipping: 0,
        taxes: 0
    };
  },
  created() {
    this.getProducts();
    this.getShippingAddress();
  },
  watch: {
      subtotal: function() {
        this.showQuantityRecalculation = true;
        setTimeout(() => {
            this.showQuantityRecalculation = false;
        }, 500);
      },
    $store () {
      console.log("I am here");
    }
  },
  methods: {
      getShippingAddress() {
        if(store.state.isLoggedIn) {
            axios.get("http://localhost:8081/api/accounts/"+ store.state.username, {withCredentials: true})
            .then(response => {
                let data = response.data; 
                let content = data.Content;
                console.log(data);
                if (data.Success) {
                    const vm = this;
                    vm.$refs["autocomplete-shipping"].update(content.ShippingAddress);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
      },
      getProducts() {
        axios
            .get("http://localhost:8081/api/shoppingCarts/" + store.state.shoppingCartId + "/productItems")
            .then(response => {
                let data = response.data;
                if(data.Success) {
                    this.products = data.Content.productItems;
                    this.subtotal = data.Content.subtotal;
                    this.total = data.Content.total;
                    this.shipping = data.Content.shipping;
                    this.taxes = data.Content.taxes;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
      },
      removeProduct(id) {
        this.showItemsRemove = true;
        axios
            .delete("http://localhost:8081/api/productItems/" + id)
            .then(response => {
                if(response.data.Success) {
                    this.getProducts();
                }
            })
            .catch(function(error) {
                console.log(error);
            });
        this.showItemsRemove = false;
      },
      finalizePurchase: async function() {
        let shippingResult = await this.$refs["autocomplete-shipping"].validate();
        if(shippingResult.valid) {
        axios
            .put("http://localhost:8081/api/shoppingCarts/" + store.state.shoppingCartId, {
                Purchased: "true",
                ShippingAddress: this.shippingAddress
            },
            {withCredentials: true})
            .then(response => {
                let data = response.data;
                if(data.Success) {
                    this.products = [];
                    this.subtotal = 0;
                    this.total = 0;
                    this.shipping = 0;
                    store.commit('shoppingCartId', "");
                    this.$bvModal.show('modal-purchase');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
      },
      shippingAddressChanged(newAddress) {
          this.shippingAddress = newAddress;
      },
      quantityChanged(id, index) {
          axios
            .put("http://localhost:8081/api/productItems/" + id, {
                Quantity: this.products[index].Quantity
            }, 
            {withCredentials: true})
            .then(response => {
                let data = response.data;
                if(data.Success) {
                    this.getProducts();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
      }
  },
};
</script>