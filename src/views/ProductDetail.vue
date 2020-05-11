<template>
  <div>
    <section class="wrapper">

      <b-container>

        <!-- Product Details -->
        <b-row class="mt-3" align-v="center">

          <!-- Left column -->
          <b-col>
            <b-card class="shadow" border-variant="secondary">
              <b-card-img :src="`http://localhost:8081/api/images/${product.ImagePath}`" :alt="product.Model"></b-card-img>
            </b-card>
          </b-col>

          <!-- Right column -->
          <b-col class="text-center">

            <b-row>
              <b-col><h3>{{ product.Make}}</h3></b-col>
            </b-row>

            <b-row>
              <b-col><h5>{{ product.Model}}</h5></b-col>
            </b-row>

            <b-row>
              <b-col><h5>${{ product.Price}}</h5></b-col>
            </b-row>

            <hr class="m-0 mt-2"/>

            <b-row>
              <b-col class="mt-3"><h4>Product Description</h4></b-col>
            </b-row>

            <b-row>
              <b-col class="mb-2"><h6>{{product.Description}}</h6></b-col>
            </b-row>

            <hr class="m-0"/>

            <b-row>
              <b-col class="mt-4"><b-button variant="outline-primary" @click="addProductToCart()">Add to Cart</b-button></b-col>
            </b-row>

          </b-col>

        </b-row>

        <!-- Comments -->
        <h3 class="mt-5 ml-3">Customer Reviews</h3>

        <!-- Print comments if we have any -->
        <b-container v-if="typeof reviews !== 'undefined' && reviews.length > 0">
          <b-row  v-for="review in reviews" :key="review.id">
            <b-col>

              <b-card class="mb-4">

                <template v-slot:header>
                  <b-row align-v="center">
                    <b-col cols-4>Customer: {{review.Username}}</b-col>
                    <b-col cols-4><b-form-rating v-model="review.Rating" variant="warning" readonly></b-form-rating></b-col>
                    <b-col cols-4 class="text-right">{{review.Date}}</b-col>
                  </b-row>
                </template>

                <b-card-body>
                  <b-card-text class="text-justify">{{review.Text}}</b-card-text>
                </b-card-body>

                <template v-if="typeof review.Images !== 'undefined' && review.Images.length > 0" v-slot:footer>
                  <b-row>
                    <b-col v-for="image in review.Images" :key="image._id">
                      <b-card-img :src="`http://localhost:8081/api/images/${image.ImagePath}`" @click="selectedImagePath=image.ImagePath; $bvModal.show('bigImage')" 
                                  class="border p-2" style="cursor: pointer;"></b-card-img>
                    </b-col>
                  </b-row>
                </template>
              </b-card>

            </b-col>
          </b-row>
          
        </b-container>

        <!-- If no reviews, print message-->
        <b-row v-else>
          <b-col>
            <h6 class="mb-3 mt-1 ml-3 text-secondary">There are no reviews yet.</h6>
          </b-col>
        </b-row>
        
        <!-- Add review block-->
        <b-container class="pb-4 ml-0  pl-0 pt-3 pr-0">
          
          <!-- User is not logged in -->
          <b-row v-if="!$store.state.isLoggedIn" align-v="center">

            <b-col align-self="center" class="ml-3">
              <h5>Only authorized users can leave comments.</h5>
            </b-col>

            <b-col class="text-right">
              <b-button variant="outline-primary" @click="$bvModal.show('modal-login')" class="pl-5 pr-5">Log In</b-button>
            </b-col>

          </b-row>

          <!-- User has not bought the product --> 
          <b-row v-else-if="!didBuy">
            <b-col>
              <h5>Only people who bought product can leave comments.</h5>
            </b-col>
          </b-row>

          <!-- Everything is ok, render form for review -->
          <b-row v-else class="ml-0">
            <b-col>
              <h4>Add Review</h4>
              <star @review-submitted="updateReviews"></star>
            </b-col>
          </b-row>

        </b-container>

      </b-container>

    </section>

    <!-- Modals -->

    <b-modal id="bigImage" size="bg" centered hide-footer hide-header>
      <b-img :src="`http://localhost:8081/api/images/${selectedImagePath}`" fluid></b-img>
    </b-modal>

    <b-modal id="repeatedProduct" v-model="repeatedProduct">This product is already in your cart.</b-modal>

  </div>
</template>

<script>
import store from "../store/index";
import StarRating from "../components/StarRating";
import axios from "axios";
import router from "../router/index";

export default {
  data() {
    return {
      selectedImagePath: '',
      repeatedProduct: false,
      didBuy: true,
      reviews: []
    };
  },
  components: {
    star: StarRating
  },
  created() {
    axios.get(`http://localhost:8081/api/products/${this.$route.params.productId}/comments`).then(res => {
      this.reviews = res.data.Content;
    });
    if (this.$store.state.username) {
      let vm = this;
      axios.get(`http://localhost:8081/api/accounts/${this.$store.state.username}/products`, {withCredentials: true})
      .then(res => {
        let products = res.data.Content;
        this.didBuy = products.find(product => {
          return product.ProductId == vm.$route.params.productId;
        });
      });
    }
  },
  computed: {
    product() {
      return store.getters.getProduct(this.$route.params.productId);
    }
  },
  methods: {
    updateReviews() {
      axios.get(`http://localhost:8081/api/products/${this.$route.params.productId}/comments`).then(res => {
        this.reviews = res.data.Content;
      });
    },
    addProductToCart: async function() {
      axios.post("http://localhost:8081/api/productItems", {
        Quantity: 1,
        ProductId: this.$route.params.productId
      }, {withCredentials: true})
      .then(response => {
        let data = response.data;
        let success = data.Success;
        if(success) {
          store.commit('shoppingCartId', data.Content.ops[0].ShoppingCartId);
          this.$nextTick( function() {
            router.push("/cart");
          });
        }
        else {
          this.repeatedProduct = true;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
};
</script>

<style scoped>
  .card-footer {
    background-color: white;
  }
</style>