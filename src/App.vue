<template>
  <div id="app">
    <navigation></navigation>
  </div>
</template>

<script>
import TheNavigation from "./components/TheNavigation";

export default {
  name: "App",
  created() {
    this.$store.dispatch("getProducts");
  },
  components: {
    navigation: TheNavigation
  }
};
</script>