<template>
  <v-layout justify-center class="full-height">
    <v-divider vertical class="mr-2"></v-divider>
    <v-flex xs12 sm9 md6 class="pa-4">
      <app-textarea />
    </v-flex>
    <v-divider vertical class="ml-2"></v-divider>
  </v-layout>
</template>

<script>
import vuetifyMixins from '@/mixins/Vuetify'
export default {
  components: {
    AppTextarea: () => import('@/components/app-components/AppTextarea.vue')
  },
  mixins: [vuetifyMixins]
}
</script>
