export default {
  computed: {
    xsOnly () {
      return this.$vuetify.breakpoint.xsOnly
    },
    smOnly () {
      return this.$vuetify.breakpoint.smOnly
    },
    mdOnly () {
      return this.$vuetify.breakpoint.mdOnly
    },
    xlOnly () {
      return this.$vuetify.breakpoint.xlOnly
    },
    smAndDown () {
      return this.$vuetify.breakpoint.smAndDown
    },
    mdAndDown () {
      return this.$vuetify.breakpoint.mdAndDown
    },
    lgAndDown () {
      return this.$vuetify.breakpoint.lgAndDown
    },
    xlAndDown () {
      return this.$vuetify.breakpoint.xlAndDown
    },
    smAndUp () {
      return this.$vuetify.breakpoint.smAndUp
    },
    mdAndUp () {
      return this.$vuetify.breakpoint.mdAndUp
    },
    xlAndUp () {
      return this.$vuetify.breakpoint.xlAndUp
    }
  }
}
