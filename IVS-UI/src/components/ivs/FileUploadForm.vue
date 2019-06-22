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
      append-icon='attach_file'
      :rules="fileUploadRule(fileSize)"
      :hint="`File Size: ${formatFileSize(fileSize)} (< 1MB)`"
    ></v-text-field>

    <v-select 
      v-model="localRecordType"
      :items="recordTypeList"
      :rules="requiredRule"
      label="*Record Type"
      class="mt-4"
      @change="onRecordTypeChange"
    />

    <v-combobox 
      v-if="showVerifier"
      ref="verifierList"
      v-model="selectedVerifier"
      :rules="requiredRule"
      :items="verifierList"
      item-text="name"
      item-value="vid"
      :loading="verifierLoading"
      chips
      label="Select organization"
      @change="onVerifierChange"
    >
      <span slot="no-data" class="ma-3">
        no available verifier
      </span>
    </v-combobox>

  </v-form>
</template>

<script>
import mixin from '../mixin.js';
import {
  GetVerifierList
} from '@/api/record.js'

export default {
  name: 'FileUploadForm',
  mixins: [mixin],

  props: {
    recordType: {
      type: String,
      default: 'Other'
    },
    
    verifier: String,
    showVerifier: {
      type: Boolean,
      default: true
    }
  },
  
  data: () => ({
    fileName: '',
    fileUrl: '',
    fileSize: 0,
    preview: false,
    isValid: true,
    localRecordType: 'Other',

    //verifier
    recordTypeList: [
      'Education',
      'WorkExp',
      'Volunteer',
      'Other'
    ],
    selectedVerifier: '',
    verifierList: [],
    verifierLoading: false
  }),

  watch: {
    localRecordType(val, old) {
      if (val == old) return;
      
      this.$emit('update:recordType', val);
    }
  },

  methods: {
    onVerifierChange(val) {
      this.selectedVerifier = val.name;
      this.$emit('update:verifier', val.vid);
    },

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
    },

    async onRecordTypeChange(type) {
      if (!this.showVerifier) return;
      
      try {
        console.log('GetVerifierList');
        this.selectedVerifier = '';
        this.verifierLoading = true;
        this.verifierList = await GetVerifierList(type);
        this.verifierLoading = false;

        this.$refs.verifierList.focus();
        this.$refs.verifierList.activateMenu();
      }
      catch (error) {
        this.$store.commit('showError', error);
        this.verifierLoading = false;
      }
    }
  },

}
</script>

<style>

</style>
