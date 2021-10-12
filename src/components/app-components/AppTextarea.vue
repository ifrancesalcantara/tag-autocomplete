<template>
  <mentionable
    :keys="['#']"
    :items="availableTags"
    @search="listTags($event)"
    @open="onOpen"
    insert-space>
    <div
      class="editor show-spaces"
      :id="elementId"
      :ref="elementId"
      contenteditable
      @input="(e) => textValue = e.srcElement.innerText"
      :placeholder="placeholder || $t('default_content.textarea_placeholder')"
    />
    <template #no-result>
      <div class="dim empty-tag-menu">
        {{ loading ? $t('default_content.loading_with_dots') : $t('default_content.no_results') }}
      </div>
    </template>
    <template #item="{ item }">
      <div class="mention-item">
        <span class="dim">
          {{ item.label }}
        </span>
      </div>
    </template>
  </mentionable>
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
    elementId: null,
    textValue: '',
    loading: false
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
      const html = this.textValue.split('\n').map((p) => {
        return p.split(' ').map((w) => {
          return w.startsWith('#') && w !== '#'
            ? `<span class="active-tag" contentEditable="false">${w}</span>`
            : w
          }).join(' ')
      })
        .filter((p, i) => p || this.textValue.split('\n')[i + 1])
        .join('\n')
      this.$refs[this.elementId].innerHTML = html
      setCaretPosition({ el: this.$refs[this.elementId], childNum: this.$refs[this.elementId].childNodes.length - 1, charNum: 1 })
    },
    listTags (search) {
      this.loading = true
      this.$store.dispatch('tags/list', { search, save: true }).finally(() => {
        this.loading = false
      })
    },
    onOpen () {
      this.$store.commit('tags/resetList')
    }
  },
  watch: {
    textValue (newValue, oldValue) {
      this.$emit('change', newValue)
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
  },
  mixins: [vuetifyMixins]
}
</script>

<style lang="scss">
  .vue-popover-theme {
    background-color: white;
    position: absolute;
    left: 200px !important;
    top: 10px !important;
    min-width: 250px !important;
    transform: translate(50%, 50%);
    box-shadow: rgb(101 119 134 / 20%) 0px 0px 15px, rgb(101 119 134 / 15%) 0px 0px 3px 1px
  }
</style>
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
.preview {
  font-family: monospace;
  white-space: pre-wrap;
  margin-top: 12px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 6px;
}
.empty-tag-menu, .mention-item {
  padding: 16px 24px 16px 12px;
  border-radius: 4px;
}
.mention-item {
  cursor: pointer;
}
.mention-selected .mention-item {
  background-color: rgb(247, 249, 249);
}
</style>