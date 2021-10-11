<template>
  <div>
    <div
      class="editor"
      :id="elementId"
      :ref="elementId"
      contenteditable
      @input="(e) => textValue = e.srcElement.innerText"
      :placeholder="placeholder || $t('default_content.textarea_placeholder')"
      v-html="displayHtml"
      @keypress="checkSelectTagByEnter"
    />
    <v-menu v-if="loading || tags.length" v-model="show" :position-x="positionX" :nudge-bottom="nudgeBottom">
      <v-list class="pt-1 pb-0" :class="{ 'full-width': xsOnly, 'min-width-300px': smAndUp, 'min-height-100px': loading }">
        <v-list-item v-for="tag in tags" :key="tag.id" @click="(e) => selectTag(tag, e)" :class="{ 'active-tag': addingTag && addingTag.text === tag.text }">
          <v-list-item-title>#{{ tag.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { getChangedWordOnInputData } from '@/lib/Text'
import { getCaretPosition, setCaretPosition } from '@/lib/Core'
import { generateUUID } from '@/lib/UUID'

import vuetifyMixins from '@/mixins/Vuetify'

export default {
  props: {
    placeholder: String,
    autoGrow: Boolean,
    autofocus: Boolean,
    rows: Number
  },
  data: () => ({
    elementId: null,
    addingTag: null,
    addingTagWordData: {
      text: '',
      startIndex: null,
      endIndex: null
    },
    displayHtml: '',
    textValue: '',
    loading: false,
    nudgeBottom: 0,
    positionX: 0,
    show: false
  }),
  computed: {
    ...mapState({
      tags: ({ tags }) => tags.list
    }),
    addingTagIndex () {
      return this.tags.findIndex((tag) => this.addingTag === tag)
    }
  },
  methods: {
    selectTag (tag, event) {
      let newTextValue = this.textValue.split('')

      // Find edited tag node element to place cursor at its end after adding it
      let editedTagElementIndex = 0
      let foundEditingTagElement = false
      let inTextElement = false
      this.textValue.split('\n').forEach((paragraph, i) => {
        if (i) editedTagElementIndex++
        paragraph.split(' ').forEach((word, j) => {
          if ((word.includes('#') && word !== '#')) {
            inTextElement = false
            if (word === this.addingTagWordData.text) foundEditingTagElement = true
            else if (!foundEditingTagElement) editedTagElementIndex++
          } else if (!inTextElement) {
            inTextElement = true
            editedTagElementIndex++
          }
        })
      })

      // Complete tag
      newTextValue.splice(this.addingTagWordData.startIndex, this.addingTagWordData.text.split('').length, '#' + tag.text)
      
      this.textValue = newTextValue.join('')

      // Add span style wrappers to tags
      this.displayHtml = newTextValue.join('').split('\n').map((paragraph) => {
        return paragraph.split(' ').map((word) => {
          return (word.includes('#') && word !== '#')
            ? `<span class="active-tag">${word}</span>`
            : word
        }).join(' ')
      }).join('<br>')

      // Set caret position
      this.$nextTick(() => {
        console.log(this.$refs[this.elementId].childNodes, editedChildNodeIndex)
        setCaretPosition({ el: this.$refs[this.elementId].childNodes[editedChildNodeIndex], offset: 1 })
        this.show = false
      })
    },
    checkSelectTagByEnter (e) {
      if (e.key === 'Enter' && this.show && this.addingTag) {
        e.preventDefault()
        this.selectTag(this.addingTag, e)
      }
    },
    checkChangeAddingTagByArrows (e) {
      if (this.show && ['ArrowDown', 'ArrowUp'].includes(e.key)) e.preventDefault()
      if (!this.show || this.loading) return
      const nextTag = this.tags[this.addingTagIndex + 1]
      const prevTag = this.tags[this.addingTagIndex - 1]
      if (e.key === 'ArrowDown') this.addingTag = nextTag || prevTag
      else if (e.key === 'ArrowUp') this.addingTag = prevTag || nextTag
    }
  },
  watch: {
    textValue (newValue, oldValue) {
      this.$emit('change', newValue)
      this.addingTagWordData = getChangedWordOnInputData({ newValue, oldValue })
      if (this.addingTagWordData.text.startsWith('#') && this.addingTagWordData.text !== '#') {
        if (!this.show) this.show = true
        this.positionX = this.$refs[this.elementId].offsetLeft + 12
        this.nudgeBottom = this.$refs[this.elementId].offsetTop + this.$refs[this.elementId].clientHeight

        this.loading = true
        this.$store.dispatch('tags/list', { search: this.addingTagWordData.text.replace('#', ''), save: true })
          .then(tags => {
            this.addingTag = tags[0]
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
        this.addingTag = null
        this.addingTagWordData = {
          text: '',
          startIndex: null,
          endIndex: null
        }
        this.$store.commit('tags/resetList')
      }
    }
  },
  created () {
    this.elementId = generateUUID()
    window.addEventListener('keydown', this.checkChangeAddingTagByArrows)
  },
  mixins: [vuetifyMixins],
  beforeDestroy () {
    window.removeEventListener('keydown', this.checkChangeAddingTagByArrows)
  }
}
</script>

<style lang="scss" scoped>
.editor {
  padding: 12px 0;
  outline: 0px solid transparent;
}
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
::v-deep {
  .display-tag {
    background-color: red;
  }
}
[contenteditable][placeholder]:empty:before {
  content: attr(placeholder);
  position: absolute;
  color: gray;
  background-color: transparent;
}
</style>