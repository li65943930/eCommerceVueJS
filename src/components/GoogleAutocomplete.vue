<template>
    <ValidationProvider
        rules="required"
        name="signup-shipping"
        ref="signup-shipping"
        :skipIfEmpty="false"
        v-slot="{ valid, errors }"
        >
        <b-form-group
            id="form-signup-shipping"
            label="SHIPPING ADDRESS:*"
            label-size="sm"
            label-for="input-signup-shipping"
        >
            <b-form-input
                ref="autocomplete"
                type="text"
                id="input-signup-shipping"
                :state="errors[0] ? false : valid ? true : null"
                v-model="shippingAddress"
                trim
            ></b-form-input>
            <b-form-invalid-feedback id="signup-shipping-feedback">
            {{ errors[0] }}
            </b-form-invalid-feedback>
        </b-form-group>
    </ValidationProvider>
</template>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4LCVfCeVuSp08tHemydM2ufO4_yfxtrU&libraries=places&language=en"></script>
<script>
import { ValidationProvider } from "vee-validate";

export default {
    name: "google-autocomplete",
    components: {
        ValidationProvider
    },
    data() {
        return {
            shippingAddress: ""
        }
    },
    mounted: function() {
        this.autocomplete = new google.maps.places.Autocomplete( this.$refs.autocomplete.$el, {types: ["geocode"]} );
        this.autocomplete.addListener('place_changed', () => {
            this.shippingAddress = this.autocomplete.getPlace().formatted_address;
        });
    },
    methods: {
        validate: async function() {
            return await this.$refs["signup-shipping"].validate();
        },
        update: function(newAddress) {
            this.shippingAddress = newAddress;
        }
    },
    watch: {
        shippingAddress: function() {
            this.$emit('shippingAddressChange', this.shippingAddress);
        }
    }
}
</script>