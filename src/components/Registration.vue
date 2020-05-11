<template>
    <b-card>
        <h5 class="mb-4">{{edit ? "Profile" : "New Customer"}}</h5>
        <ValidationProvider
            rules="required|min:4"
            name="signup-username"
            ref="signup-username"
            :skipIfEmpty="false"
            v-slot="{ valid, errors }"
        >
        <b-form-group
            id="form-signup-username"
            label="USERNAME:*"
            label-size="sm"
            label-for="input-signup-username"
        >
        <b-form-input 
            type="text" 
            id="input-signup-username"
            :disabled="edit"
            :state="errors[0] ? false : valid ? true : null"
            v-model="signupUsername" trim
        ></b-form-input>
        <b-form-invalid-feedback id="signup-username-feedback">
            {{ errors[0] }}
        </b-form-invalid-feedback>
        </b-form-group>
        </ValidationProvider>
        <ValidationProvider
            rules="required|email"
            name="signup-email"
            ref="signup-email"
            :skipIfEmpty="false"
            v-slot="{ valid, errors }"
        >
        <b-form-group
            id="form-signup-email"
            label="EMAIL ADDRESS:*"
            label-size="sm"
            label-for="input-signup-email"
        >
            <b-form-input 
                type="email" 
                id="input-signup-email"
                :disabled="edit"
                :state="errors[0] ? false : valid ? true : null" 
                v-model="signupEmail" trim
            ></b-form-input>
            <b-form-invalid-feedback id="signup-email-feedback">
            {{ errors[0] }}
            </b-form-invalid-feedback>
        </b-form-group>
        </ValidationProvider>
        <ValidationObserver v-if="!edit">
            <b-row>
                <b-col>
                    <ValidationProvider
                        rules="required|min:6"
                        name="signup-password"
                        ref="signup-password"
                        :skipIfEmpty="false"
                        v-slot="{ valid, errors }"
                    >
                    <b-form-group
                        id="form-signup-password"
                        label="PASSWORD:*"
                        label-size="sm"
                        label-for="input-signup-password"
                    >
                        <b-form-input
                            type="password"
                            id="input-signup-password"
                            :state="errors[0] ? false : valid ? true : null"
                            v-model="signupPassword"
                            trim
                        ></b-form-input>
                        <b-form-invalid-feedback id="signup-password-feedback">
                        {{ errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                    </ValidationProvider>
                </b-col>
                <b-col>
                    <ValidationProvider
                        rules="required|min:6|password:@signup-password"
                        name="signup-cpassword"
                        ref="signup-cpassword"
                        :skipIfEmpty="false"
                        v-slot="{ valid, errors }"
                    >
                    <b-form-group
                        id="form-signup-cpassword"
                        label="CONFIRM:*"
                        label-size="sm"
                        label-for="input-signup-cpassword"
                    >
                        <b-form-input
                            type="password"
                            id="input-signup-cpassword"
                            :state="errors[0] ? false : valid ? true : null"
                            v-model="signupConfirmPassword"
                            trim
                        ></b-form-input>
                        <b-form-invalid-feedback id="signup-cpassword-feedback">
                        {{ errors[0] }}
                        </b-form-invalid-feedback>
                    </b-form-group>
                    </ValidationProvider>
                </b-col>
            </b-row>
        </ValidationObserver>
        <google-autocomplete 
            ref="autocomplete-shipping"
            v-bind:initialValue="signupShippingAddress"
            v-on:shippingAddressChange="shippingAddressChanged">
        </google-autocomplete>     
        <b-alert class="mt-3" v-model="showRegisterFailedAlert" variant="danger" dismissible>
        Register failed!
        </b-alert>
        <b-alert class="mt-3" v-model="showRegisterSucceededAlert" variant="success" dismissible>
        Updated successfully!
        </b-alert>
        <b-button class="mt-3" variant="outline-primary" block v-on="{ click: edit ? update : signup}">{{action}}</b-button>
    </b-card>
</template>

<script>
import GoogleAutocomplete from "../components/GoogleAutocomplete";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import axios from "axios";

export default {
    name: "registration-form",
    props: {
        edit: Boolean,
        action: String
    },
    components: {
        'google-autocomplete': GoogleAutocomplete,
        ValidationObserver,
        ValidationProvider
    },
    data() {
        return {
            signupUsername: "",
            signupEmail: "",
            signupPassword: "",
            signupConfirmPassword: "",
            signupShippingAddress: "",
            showRegisterFailedAlert: false,
            showRegisterSucceededAlert: false,
            changePassword: false
        };
    },
    created: function() {
        if (this.edit) {
            const vm = this;
            axios.get(`http://localhost:8081/api/accounts/${this.$store.state.username}`, {withCredentials: true})
            .then(function (response) {
                let data = response.data; 
                let content = data.Content;
                if (data.Success) {
                    vm.signupUsername = content.Username;
                    vm.signupEmail = content.Email;
                    vm.$refs["autocomplete-shipping"].update(content.ShippingAddress);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },
    mounted: function() {
        this.showRegisterFailedAlert = false;
        this.showRegisterSucceededAlert = false;
    },
    methods: {
        signup: async function() {
            // call validate on the target fields
            let usernameResult = await this.$refs["signup-username"].validate();
            let emailResult = await this.$refs["signup-email"].validate();
            let passwordResult = await this.$refs["signup-password"].validate();
            let confirmPasswordResult = await this.$refs["signup-cpassword"].validate();
            let shippingResult = await this.$refs["autocomplete-shipping"].validate();
          
            // call api just if it's valid 
            if (usernameResult.valid && emailResult.valid && passwordResult.valid 
                && confirmPasswordResult.valid && shippingResult.valid) {
                const vm = this;
                axios.post("http://localhost:8081/api/accounts", {
                    Email: this.signupEmail,
                    Password: this.signupPassword,
                    Username: this.signupUsername, 
                    ShippingAddress: this.signupShippingAddress
                }, {withCredentials: true})
                .then(function (response) {
                    let data = response.data; 
                    if (data.Success) {
                        vm.login();
                    }
                    else {
                        vm.showRegisterFailedAlert = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
        update: async function() {
            // call validate on the target fields
            let shippingResult = await this.$refs["autocomplete-shipping"].validate();
          
            // call api just if it's valid 
            if (shippingResult.valid) {
                const vm = this;
                axios.put(`http://localhost:8081/api/accounts/${this.$store.state.username}`, {
                    ShippingAddress: this.signupShippingAddress
                }, {withCredentials: true})
                .then(function (response) {
                    let data = response.data; 
                    if (data.Success) {
                        vm.showRegisterSucceededAlert = true;
                    }
                    else {
                        vm.showRegisterFailedAlert = true;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
        login: function() {
            const vm = this;
            axios.post("http://localhost:8081/api/login", {
                Email: this.signupEmail,
                Password: this.signupPassword
            }, {withCredentials: true})
            .then(function (response) {
                let data = response.data; 
                if (data.Success) {
                    vm.$store.commit("isLoggedIn", true);
                    vm.$store.commit("username", data.Content.Username);
                }
                vm.$emit('succeeded');
            })
            .catch(function (error) {
                console.log(error);
                vm.$emit('succeeded');
            });
        },
        shippingAddressChanged(newAddress) {
            this.signupShippingAddress = newAddress;
        }
    }
};
</script>