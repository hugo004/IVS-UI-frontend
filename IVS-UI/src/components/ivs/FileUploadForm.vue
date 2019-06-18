<template>
  <v-form
    lazy-validation
    v-model="isValid"
    ref="form"
  >
    <iframe 
      v-if="preview" 
      ref="preview" 
      :src="fileUrl"
      height="500px"
      width="100%"
      />
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
      :rules="fileUploadRule(fileSize)"
      :hint="`File Size: ${formatFileSize(fileSize)} (< 1MB)`"
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
    fileUrl: '',
    fileSize: 0,
    preview: false,
    isValid: true
  }),

  methods: {
    formatFileSize(bytes,decimalPoint) {
      if(bytes == 0) return '0 Bytes';
      let k = 1000,
          dm = decimalPoint || 2,
          sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },

    pickFile() {
      this.$refs.file.click();
    },

    onFilePick(e) {
      const {files} = e.target;
      if (files[0]) {
        this.preview = true;
        this.fileUrl = `${URL.createObjectURL(files[0])}#toolbar=0&navpanes=0&scrollbar=0`;
        this.fileSize = files[0].size;

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
