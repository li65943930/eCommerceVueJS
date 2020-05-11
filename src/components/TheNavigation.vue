<template>
  <div id="content">
    <!-- Top navigation bar -->
    <b-navbar class="shadow-sm" fixed="top" toggleable="lg" type="light" variant="white">
      <b-navbar-brand class="mx-auto brand-socket" to="/">Socket</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" class="mr-4" is-nav>
        <!-- if not logged in, show this -->
        <b-navbar-nav v-if="!$store.state.isLoggedIn" class="ml-auto mr-4">
          <b-nav-item class="mr-2" right href="#" style="cursor: pointer" @click="$bvModal.show('modal-login')">
            <font-awesome-icon icon="user" />
          </b-nav-item>
          <b-nav-item to="/cart">
            <font-awesome-icon icon="shopping-cart" />
          </b-nav-item>
        </b-navbar-nav>
        <!-- if logged in, show this -->
        <b-navbar-nav v-else class="ml-auto mr-4">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>{{$store.state.username}}</em>
            </template>
            <b-dropdown-item to="/profile">Profile</b-dropdown-item>
            <b-dropdown-item href="#" style="cursor: pointer" @click="logout()"><span class="text-danger">Sign Out</span></b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item to="/cart">
            <font-awesome-icon icon="shopping-cart" />
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- Categories -->
    <b-nav v-if="showCategories" class="categories h5 mb-3" align="center">
      <b-nav-item to="/smartphone" exact exact-active-class="active">Smartphones</b-nav-item>
      <b-nav-item to="/laptop" exact exact-active-class="active">Laptops</b-nav-item>
      <b-nav-item to="/headphone" exact exact-active-class="active">Headphones</b-nav-item>
    </b-nav>

    <!-- Page content -->
    <router-view ref="view"/>

    <!-- Footer -->
    <b-navbar type="dark" variant="primary" class="footer">
      <b-navbar-nav class="mx-auto">
        <b-nav-item to="/about" class="mr-4">About Socket</b-nav-item>
        <b-nav-item to="/contact">Contact Us</b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <!-- Login modal -->
    <b-modal
      centered
      size="lg"
      id="modal-login"
      ref="modal-login"
      :hide-header="true"
      :hide-footer="true"
      body-bg-variant="light"
      header-bg-variant="light"
    >
      <h4 class="ml-3">SIGN IN</h4>
      <b-container>
        <b-row>
          <b-col>
            <b-card>
              <h5 class="mb-4">Returning Customer</h5>
              <ValidationProvider
                rules="required|email"
                name="login-email"
                ref="login-email"
                :skipIfEmpty="false"
                v-slot="{ valid, errors }"
              >
                <b-form-group
                  id="form-login-email"
                  label="EMAIL ADDRESS:*"
                  label-size="sm"
                  label-for="input-login-email"
                >
                  <b-form-input
                    type="email" 
                    id="input-login-email"
                    :state="errors[0] ? false : valid ? true : null" 
                    v-model="loginEmail" trim
                  ></b-form-input>
                  <b-form-invalid-feedback id="login-email-feedback">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <ValidationProvider
                rules="required"
                name="login-password"
                ref="login-password"
                :skipIfEmpty="false"
                v-slot="{ valid, errors }"
              >
                <b-form-group
                  id="login-password"
                  label="PASSWORD:*"
                  label-size="sm"
                  label-for="input-login-password"
                >
                  <b-form-input
                    type="password"
                    id="input-login-password"
                    :state="errors[0] ? false : valid ? true : null" 
                    v-model="loginPassword"
                    trim
                  ></b-form-input>
                  <b-form-invalid-feedback id="login-password-feedback">
                    {{ errors[0] }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>
              <b-alert class="mt-3" v-model="showLoginFailedAlert" variant="danger" dismissible>
                Login failed!
              </b-alert>
              <b-button class="mt-3" variant="outline-primary" block @click="login">Log in</b-button>
            </b-card>
          </b-col>
          <b-col>
            <registration-form v-on:succeeded="signupSucceeded" action="Register"></registration-form>
          </b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer></template>
    </b-modal>
  </div>
</template>

<script>
import RegistrationForm from "../components/Registration";
import { ValidationProvider } from "vee-validate";
import axios from "axios";

export default {
  name: "TheNavigation",
  components: {
    'registration-form': RegistrationForm,
    ValidationProvider
  },
  data() {
    return {
      loginEmail: "",
      loginPassword: "",
      signupUsername: "",
      signupEmail: "",
      signupPassword: "",
      signupConfirmPassword: "",
      signupShippingAddress: "",
      showLoginFailedAlert: false,
      showRegisterFailedAlert: false
    };
  },
  methods: {
    // provide a mechanism for logging out
    logout: function() {
      const vm = this;
      axios.delete("http://localhost:8081/api/login", {withCredentials: true})
      .then(function (response) {
        if (response.data.Success) {
          vm.$store.commit("isLoggedIn", false);
          vm.$store.commit("username", "");
          if (vm.$route.matched.some(({ name }) => name === 'Profile')) {
            vm.$router.push({name: 'Home' });
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    login: async function() {
      this.showLoginFailedAlert = false;
      // call validate on the target fields
      let emailResult = await this.$refs["login-email"].validate();
      let passwordResult = await this.$refs["login-password"].validate();
      if (emailResult.valid && passwordResult.valid) {
        const vm = this;
        axios.post("http://localhost:8081/api/login", {
          Email: this.loginEmail,
          Password: this.loginPassword
        }, {withCredentials: true})
        .then(function (response) {
          let data = response.data; 
          if (data.Success) {
            vm.$store.commit("isLoggedIn", true);
            vm.$store.commit("username", data.Content.Username);
            vm.loginEmail = "";
            vm.loginPassword = "";
            vm.$refs["modal-login"].hide();
          }
          else {
            vm.showLoginFailedAlert = true;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },
    signupSucceeded() {
      this.$refs["modal-login"].hide();    
    }
  },
  computed: {
    // Hide categories bar when route is a value from the array
    showCategories: function() {
      const routesWithoutCategories = ['Cart', 'ProductDetail', 'Profile', 'About', 'Contact'];
      return routesWithoutCategories.indexOf(this.$route.name) == -1;
    }
  }
};
</script>

<style>
  /* .pac-container is a class that represents a dropdown list from google places, overriding z-index to show it on the first plane (z-index of modal = 1050) */
  .pac-container 
  { 
    z-index: 1051; 
  }

  .categories .nav-link.active {
    text-decoration: underline;
  }

  .categories a:hover {
    color:grey;
  }

</style>