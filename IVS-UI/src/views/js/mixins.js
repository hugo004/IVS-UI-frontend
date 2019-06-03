export default {
  computed: {
    requiredRule() {
      return [ v => !!v || 'required'];
    }
  }
}