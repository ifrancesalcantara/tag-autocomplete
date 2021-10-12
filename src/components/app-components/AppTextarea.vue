<template>
  <div>
    <mentionable
      :keys="['#']"
      :items="availableTags"
      @search="listTags($event)"
      @open="onOpen"
      disabled
      insert-space
      ref=mentionable>
      <div
        class="editor show-spaces"
        :id="elementId"
        :ref="elementId"
        contenteditable
        @input="(e) => textValue = e.srcElement.innerText"
        :placeholder="placeholder || $t('default_content.textarea_placeholder')"
      />
    </mentionable>
    <v-menu v-if="loading || filteredTags.length" :value="!!addingTagText" :position-x="positionX" :nudge-bottom="nudgeBottom" :min-width="xsOnly ? '95%' : '300px'">
      <v-list class="pt-1 pb-0" :class="{ 'min-height-100px': loading }">
        <v-list-item v-for="(tag, i) in filteredTags" :key="i" @click="$refs.mentionable.applyMention(i)" :class="{ 'active-tag': $refs.mentionable.selectedIndex === i }">
          <v-list-item-title>{{ tag.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { Mentionable } from 'vue-mention'
import { mapState } from 'vuex'

import { sanitize } from '@/lib/Text'
import { setCaretPosition } from '@/lib/Core'
import { generateUUID } from '@/lib/UUID'

import vuetifyMixins from '@/mixins/Vuetify'

export default {
  props: {
    placeholder: String
  },
  data: () => ({
    addingTagText: '',
    filteredTags: [],
    elementId: null,
    nudgeBottom: 0,
    loading: false,
    textValue: '',
    positionX: 0
  }),
  computed: {
    ...mapState({
      tags: ({ tags }) => tags.list
    }),
    availableTags () {
      return this.tags.map(t => ({ value: t.text, label: '#' + t.text }))
    }
  },
  methods: {
    getInnerHTML () {
      this.addingTagText = ''
      const html = this.textValue.split('\n').map((p) => {
        return p.split(' ').map((w) => {
          return w.startsWith('#') && w !== '#'
            ? `<span class="active-tag" contentEditable="false">${w.trim()}</span>`
            : w.trim()
          }).join(' ')
      })
        .filter((p, i) => p || this.textValue.split('\n')[i + 1])
        .join('\n')
      this.$refs[this.elementId].innerHTML = html
      setCaretPosition({ el: this.$refs[this.elementId], childNum: this.$refs[this.elementId].childNodes.length - 1, charNum: 1 })
    },
    listTags (search) {
      const { top, height, left } = this.$refs[this.elementId].getBoundingClientRect()
      this.positionX = left
      this.nudgeBottom = top + height
      this.addingTagText = search
      this.loading = true
      this.$store.dispatch('tags/list', { search, save: true }).finally(() => {
        this.filteredTags = this.$refs.mentionable.displayedItems
        this.loading = false
      })
    },
    onOpen () {
      this.$store.commit('tags/resetList')
    },
    onKeyDown (e) {
      if (e.key === 'Enter' && this.$refs.mentionable.selectedIndex && this.filteredTags.length) {
        e.preventDefault()
        this.getInnerHTML()
        this.$refs.mentionable.applyMention(this.$refs.mentionable.selectedIndex)
      } else if (e.key === ' ' && this.addingTagText) {
        e.preventDefault()
        this.getInnerHTML()
      }
    }
  },
  watch: {
    textValue (newValue, oldValue) {
      this.$emit('change', newValue)
      this.filteredTags = []
      if (
        Math.abs(
          newValue.split('').filter(c => ![' ', '\n'].includes(c)).length -
          oldValue.split('').filter(c => ![' ', '\n'].includes(c)).length
        ) > 1
      ) {
        this.getInnerHTML()
      }
    }
  },
  components: {
    Mentionable
  },
  created () {
    this.elementId = generateUUID()
    window.addEventListener('keydown', this.onKeyDown)
  },
  mixins: [vuetifyMixins],
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyDown)
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .active-tag {
    color: rgb(29, 155, 240);
  }
}
[contenteditable][placeholder]:empty:before {
  background-color: transparent;
  content: attr(placeholder);
  position: absolute;
  color: gray;
}
.editor {
  outline: 0px solid transparent;
  padding: 12px 0;
  position: relative;
}
.active-tag {
  background-color: rgb(247, 249, 249);
}
</style>