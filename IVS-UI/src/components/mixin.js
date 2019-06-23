export default {
  data: () => ({
    rules: {
      required: v => (v || "").length > 0 || 'required',
      passwordMin: v => v.length >= 6 || 'at least 6 characters',
      less1MB: v => v < 1000000 || 'file size must < 1 MB'
    }
  }),
  

  computed: {
    requiredRule() {
      return [ v => (v || "").length > 0 || 'required'];
    }
  },

  methods: {
    fileUploadRule(size=0) {
      let rules = [];
      rules.push(this.rules.required);
      rules.push(this.rules.less1MB(size));
      return rules;
    }
  },
}