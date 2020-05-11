<template>
  <!-- Landing Page content-->
  <div id="landingPage">

    <!-- Container for elements-->
    <b-container>

      <!-- Table -->
      <b-row>

        <!-- Left column -->
        <b-col>
          <b-link :to="{ name: 'ProductDetail', params: { productId: headphones._id } }" class="withoutDecor" @mouseover="isOverLeft=true" @mouseout="isOverLeft=false">
            <b-card class="shadow h-100" :class="{ 'border-success': isOverLeft }"> 
              <b-card-img :src="`http://localhost:8081/api/images/${headphones.ImagePath}`" :alt="headphones.Name" top></b-card-img>
              <b-card-text class="text-center h5" :class="{ 'text-success': isOverLeft }">
                {{headphones.Name}}
              </b-card-text>
            </b-card>
          </b-link>
        </b-col>

        <!-- Right column -->
        <b-col>
          <b-link :to="{ name: 'ProductDetail', params: { productId: smarthphone._id } }" class="withoutDecor" @mouseover="isOverRight=true" @mouseout="isOverRight=false">
            <b-card class="shadow h-100" :class="{ 'border-success': isOverRight }"> 
              <b-card-img :src="`http://localhost:8081/api/images/${smarthphone.ImagePath}`" :alt="smarthphone.Name" top></b-card-img>
              <b-card-text class="text-center h5" :class="{ 'text-success': isOverRight }">
                {{smarthphone.Name}}
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
  name: "Home",
  data() {
    return {
      isOverLeft: false,
      isOverRight: false,
      smarthphoneProduct: {},
      headphonesProduct: {}
    }
  },
  computed: {
    smarthphone() {
      return store.getters.getList(1)[0];
    },
    headphones() { 
      return store.getters.getList(3)[0];
    }
  },
};

</script>

<style>
  .withoutDecor {
    text-decoration: none !important
  }
</style>

