export default {
  data: () => ({
    rules: {
      required: v => (v || "").length > 0 || 'required',
      passwordMin: v => v.length >= 6 || 'at least 6 characters'
    }
  }),

  computed: {
    requiredRule() {
      return [ v => (v || "").length > 0 || 'required'];
    }
  }
}