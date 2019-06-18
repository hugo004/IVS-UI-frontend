<template>
  <v-form
    lazy-validation
    v-model="isValid"
    ref="form"
  >
    <input
      v-show="false"
      type="file" 
      ref="file"
      multiple
      @change="onFilePick"
      accept=".pdf,image/*"
    />
    <v-text-field 
      label="Choose file"
      @click='pickFile' 
      v-model='fileName' 
      prepend-icon='attach_file'
      :rules="requiredRule"
    ></v-text-field>
  </v-form>
</template>

<script>
import mixin from '../mixin.js';


export default {
  name: 'FileUploadForm',
  mixins: [mixin],
  
  data: () => ({
    fileName: '',
    isValid: true
  }),

  methods: {
    pickFile() {
      this.$refs.file.click();
    },

    onFilePick(e) {
      const {files} = e.target;
      if (files[0]) {
        this.fileName = files[0].name;
        this.$emit('fileChange', files);
      }
    },

    files() {
      return this.$refs.file.files;
    },

    validate() {
      return this.$refs.form.validate();
    }
  },

}
</script>

<style>

</style>
