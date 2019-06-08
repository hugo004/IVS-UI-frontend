export default {
  computed: {
    requiredRule() {
      return [ v => (v || "").length > 0 || 'required'];
    }
  }
}