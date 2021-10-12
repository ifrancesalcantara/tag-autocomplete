<template>
  <v-app>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
/* GLOBAL STYLES*/
  /* Sizing */
  .full-height {
    height: 100%;
  }
  /* Spacing */
  .show-spaces {
    white-space: pre;
  }
</style>
