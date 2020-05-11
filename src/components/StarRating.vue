<template>
  <div class="mr-3">
    <b-card class="mb-3">
      <template v-slot:header>
        <b-row align-v="center">
          <b-col cols-4>Customer: {{$store.state.username}}</b-col>
          <b-col cols-8>
            <ValidationProvider
                rules="required"
                name="review-rating"
                ref="review-rating"
                :skipIfEmpty="false"
                v-slot="{ valid, errors }"
            >
                <b-form-rating
                  text-primary
                  class="" 
                  id="form-review-rating"
                  v-model="rating"
                  :state="errors[0] ? false : valid ? true : null"
                  :variant="errors[0] ? 'danger' : 'warning'"></b-form-rating>
            </ValidationProvider>
          </b-col>
        </b-row>
      </template>
      <b-card-body>
        <ValidationProvider
                rules="required"
                name="review-text"
                ref="review-text"
                :skipIfEmpty="false"
                v-slot="{ valid, errors }"
            >
            <b-form-textarea required
              id="textarea"
              v-model="text"
              placeholder="Type here..."
              rows="8"
              :state="errors[0] ? false : valid ? true : null"
            ></b-form-textarea>
        </ValidationProvider>
      </b-card-body>
      <template v-slot:footer>
        <b-form-file accept="image/jpeg, image/png" v-model="selectedFiles" ref="file-images" multiple>
        <template slot="file-name" slot-scope="{ names }">
          <b-badge variant="primary">{{ names[0] }}</b-badge>
          <b-badge v-if="names.length > 1" variant="primary" class="ml-1">
            + {{ names.length - 1 }} More files
          </b-badge>
        </template>
      </b-form-file>
      </template>
    </b-card>
    <b-button class="float-right" variant="primary" @click="onSubmit">Post Review</b-button>
  </div>
</template>

<script>
import axios from 'axios';
import { ValidationProvider } from "vee-validate";

export default {
  name: "star",
  components: {
        ValidationProvider
    },
  data() {
    return {
      text: '',
      rating: null,
      selectedFiles: []
    };
  },
  methods: {
    onSubmit: async function() {
      let ratingResult = await this.$refs["review-rating"].validate();
      let textResult = await this.$refs["review-text"].validate();
      //let selectedFiles = await this.$refs["signup-username"].validate();

      if (ratingResult.valid && textResult.valid) {
          axios.post('http://localhost:8081/api/comments', {
              Rating : this.rating,
              Text: this.text,
              ProductId : this.$route.params.productId
          }, {withCredentials: true})
          .then((response) => {
            let data = response.data;
            if (data.Success) {
              let commentId = data.Content.ops[0]._id;
              this.uploadImages(commentId);
              this.$nextTick( function() {
                this.$emit("review-submitted");
              });
            }
          })
          .catch((error) => {
              console.log(error);
          });
      }
    },
    uploadImages(commentId) {
      var formData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('image', this.selectedFiles[i]);
      }
      axios.post(`http://localhost:8081/api/commentImage/${commentId}`, formData, {withCredentials: true})
      .then((response) => {
          console.log(response);
      })
      .catch((error) => {
          console.log(error);
      });
    }
  }
};
</script>

<style scoped lang="css">
  .card-body {
      padding: 0.25rem !important;
  }
</style>