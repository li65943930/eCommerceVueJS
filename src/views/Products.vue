<template>
  <div class="wrapper">

    <b-container>

      <hr class="mb-0">

      <b-row align-v="center" align-h="between" class="m-0">

        <b-col cols="2" class="ml-0">
            {{products.length}} items
        </b-col>

        <b-col cols="2" class="text-right">
          <b-dropdown right text="Sort by" variant="outline-dark" class="mt-2 mb-2">
            <b-dropdown-item @click="sortByAlphabet">Alphabet</b-dropdown-item>
            <b-dropdown-item @click="sortByPrice">Price</b-dropdown-item>
          </b-dropdown>
        </b-col>

      </b-row>

      <hr class="mt-0 mb-4">

      <b-row>

        <b-col cols="4 mb-3" v-for="product in products" :key="product._id">

          <b-link :to="{ name: 'ProductDetail', params: { productId: product._id }}" class="withoutDecor">
            <b-card class="cardHover h-100 shadow" align="center"> 

              <b-card-img class="intern" :src="`http://localhost:8081/api/images/${product.ImagePath}`" :alt="product.Name" top></b-card-img>

              <b-card-text class="h5 mt-3 intern">
                {{product.Make}} {{product.Model}}
              </b-card-text>

              <b-card-text class="h5 intern">
                ${{product.Price}}
              </b-card-text>

            </b-card>
          </b-link>

        </b-col>

      </b-row>

    </b-container>

  </div>

</template>

<script>
import store from "../store/index";

export default {
  //Return the data result
  data() {
    return {
      products: []
    }
  },
  mounted: function() {
    this.getData();
  },
  watch:{
    $route () {
      this.getData();
    }
  },
  methods: {
    sortByAlphabet: function() {
      function compare(a, b) {
        const makeA = a.Make;
        const makeB = b.Make;

        let comparison = 0;
        if(makeA > makeB) return 1;
        else if(makeA < makeB) return -1;
        return comparison;
      }
      this.products.sort(compare);
    },
    sortByPrice: function() {
      function compare(a, b) {
        const priceA = a.Price;
        const priceB = b.Price;

        let comparison = 0;
        if(priceA > priceB) return 1;
        else if(priceA < priceB) return -1;
        return comparison;
      }
      this.products.sort(compare);
    },
    getData() {
      switch (this.$route.name) {
        case "Smartphone":
          this.products = store.getters.getList(1);
          break;
        case "Laptop":
          this.products = store.getters.getList(2);
          break;
        case "Headphone":
          this.products = store.getters.getList(3);
          break;
        default:
          this.products = store.state.products;
      }
      this.sortByAlphabet();
    }
  }
};
</script>

<style scoped>
  .withoutDecor {
    text-decoration: none !important
  }

  .cardHover :hover{
    box-shadow: 0px 0px 2px 2px green;
    color: green;
  }

  .intern {
    box-shadow: none !important;
  }

</style>