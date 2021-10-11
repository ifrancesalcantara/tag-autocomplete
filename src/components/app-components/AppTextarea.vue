<template>
  <div class="wrapper">
    <v-textarea
      :placeholder="placeholder || $t('default_content.textarea_placeholder')"
      @input="(v) => textValue = v"
      flat
      solo
      :autofocus="autofocus"
      hide-details
      ref="textarea"
      :rows="rows || 1"
      :auto-grow="autoGrow"
      @keypress="checkSelectTagByEnter"
    />
    <v-menu v-if="loading || tags.length" v-model="show" :position-x="positionX" :nudge-bottom="nudgeBottom">
      <v-list class="pt-1 pb-0" :class="{ 'full-width': xsOnly, 'min-width-300px': smAndUp, 'min-height-100px': loading }">
        <v-list-item v-for="tag in tags" :key="tag.id" @click="selectTag(tag)" :class="{ 'active-tag': selectedTag && selectedTag.text === tag.text }">
          <v-list-item-title>#{{ tag.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { findChangedWordOnInput } from '@/lib/Core'

import vuetifyMixins from '@/mixins/Vuetify'

export default {
  props: {
    placeholder: String,
    autoGrow: Boolean,
    autofocus: Boolean,
    rows: Number
  },
  data: () => ({
    selectedTag: null,
    loading: false,
    nudgeBottom: 0,
    positionX: 0,
    show: false,
    textValue: null
  }),
  computed: {
    ...mapState({
      tags: ({ tags }) => tags.list
    }),
    selectedTagIndex () {
      return this.tags.findIndex((tag) => this.selectedTag === tag)
    }
  },
  methods: {
    selectTag (tag) {
      this.show = false
      console.log(this.$refs.textarea)
    },
    checkSelectTagByEnter (e) {
      if (e.key === 'Enter' && this.show && this.selectedTag) {
        e.preventDefault()
        this.selectTag(this.selectedTag)
      }
    },
    checkChangeSelectedTagByArrows (e) {
      if (this.show && ['ArrowDown', 'ArrowUp'].includes(e.key)) e.preventDefault()
      if (!this.show || this.loading) return
      const nextTag = this.tags[this.selectedTagIndex + 1]
      const prevTag = this.tags[this.selectedTagIndex - 1]
      if (e.key === 'ArrowDown' && nextTag) this.selectedTag = nextTag
      else if (e.key === 'ArrowUp' && prevTag) this.selectedTag = prevTag
    }
  },
  watch: {
    textValue (newValue, oldValue) {
      this.$emit('change', newValue)
      const modifiedWord = findChangedWordOnInput({ newValue, oldValue })
      if (modifiedWord.startsWith('#') && modifiedWord !== '#') {
        if (!this.show) this.show = true
        this.positionX = this.$refs.textarea.$el.offsetLeft + 12
        this.nudgeBottom = this.$refs.textarea.$el.offsetTop + this.$refs.textarea.$el.clientHeight

        this.loading = true
        this.$store.dispatch('tags/list', { search: modifiedWord.replace('#', ''), save: true })
          .then(tags => {
            this.selectedTag = tags[0]
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.show = false
      }
    },
    show (v) {
      if (!v) {
        this.selectedTag = null
        this.$store.commit('tags/resetList')
      }
    }
  },
  created () {
    window.addEventListener('keydown', this.checkChangeSelectedTagByArrows)
  },
  mixins: [vuetifyMixins],
  beforeDestroy () {
    window.removeEventListener('keydown', this.checkChangeSelectedTagByArrows)
  }
}
</script>

<style lang="scss" scoped>
.v-menu__content {
  box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px;
}
.v-list {
  z-index: 5;
  .v-list-item {
    &.active-tag {
      background-color: rgb(247, 249, 249);
    }
  }
}
</style>