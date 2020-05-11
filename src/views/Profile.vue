<template>
  <div class="profile">
    <h1 class="mt-3">Settings</h1>
    <registration-form edit action="Update"></registration-form>
    <b-button class="mt-3 float-right" variant="primary" v-b-modal.modal-prevent-closing>Change Password</b-button>
    <b-button class="mt-3 mr-3 float-right" variant="danger" @click="showDeleteConfirmation">Delete Account</b-button>

    <!-- Password Change Modal -->
    <b-modal
      id="modal-prevent-closing"
      ref="modal-password"
      title="Password change"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    > 
        <form ref="form" @submit.stop.prevent="handleSubmit">
            <ValidationObserver>
                <b-row>
                    <b-col>
                        <ValidationProvider
                            rules="required|min:6"
                            name="password"
                            ref="password"
                            :skipIfEmpty="false"
                            v-slot="{ valid, errors }"
                        >
                        <b-form-group
                            id="form-password"
                            label="PASSWORD:*"
                            label-size="sm"
                            label-for="input-password"
                        >
                            <b-form-input
                                type="password"
                                id="input-password"
                                :state="errors[0] ? false : valid ? true : null"
                                v-model="password"
                                trim
                            ></b-form-input>
                            <b-form-invalid-feedback id="password-feedback">
                            {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col>
                        <ValidationProvider
                            rules="required|min:6|password:@password"
                            name="cpassword"
                            ref="cpassword"
                            :skipIfEmpty="false"
                            v-slot="{ valid, errors }"
                        >
                        <b-form-group
                            id="form-cpassword"
                            label="CONFIRM:*"
                            label-size="sm"
                            label-for="input-cpassword"
                        >
                            <b-form-input
                                type="password"
                                id="input-cpassword"
                                :state="errors[0] ? false : valid ? true : null"
                                v-model="confirmPassword"
                                trim
                            ></b-form-input>
                            <b-form-invalid-feedback id="cpassword-feedback">
                            {{ errors[0] }}
                            </b-form-invalid-feedback>
                        </b-form-group>
                        </ValidationProvider>
                    </b-col>
                </b-row>
            </ValidationObserver>
        </form>
    </b-modal>
  </div>
</template>

<script>
import RegistrationForm from "../components/Registration";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import axios from "axios";

export default {
    name: "Profile",
    components: {
        'registration-form': RegistrationForm,
        ValidationObserver,
        ValidationProvider
    },
    data() {
      return {
        password: '',
        confirmPassword: '',
        confirmDelete: false
      }
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
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        showDeleteConfirmation() {
            
            this.confirmDelete = false
            this.$bvModal.msgBoxConfirm('Are you sure?')
            .then(value => {
                if (value) {
                    const vm = this;
                    axios.delete(`http://localhost:8081/api/accounts`, {withCredentials: true})
                    .then(function (response) {
                        let data = response.data;
                        if (data.Success) {
                            vm.logout();
                            vm.$router.push({name: 'Home' });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        checkFormValidity: async function() {
            // call validate on the target fields
            let passwordResult = await this.$refs["password"].validate();
            let confirmPasswordResult = await this.$refs["cpassword"].validate();
          
            // return validity 
            return passwordResult.valid && confirmPasswordResult.valid;
        },
        resetModal() {
            this.password = '';
            this.confirmPassword = '';
        },
        handleOk: async function(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault();
            // Trigger submit handler
            await this.handleSubmit();
        },
        handleSubmit: async function() {
            // Exit when the form isn't valid
            if (!await this.checkFormValidity()) {
                return;
            }
            await this.changePassword();
        },
        changePassword: async function() {
            let vm = this;
            axios.put(`http://localhost:8081/api/accounts/${this.$store.state.username}/password`, {
                Password: this.password
            }, {withCredentials: true})
            .then(function (response) {
                let data = response.data;
                if (data.Success) {
                    vm.$refs["modal-password"].hide();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
    }
}
</script>

<style scoped>
    .profile {
        margin: auto;
        max-width: 30rem;
    }
</style>