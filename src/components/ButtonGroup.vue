<template>
  <div class="row">
    <span class="label">{{ labelText }}</span>
    <div class="buttonGroup">
      <react-Button v-for="item of items" :key="item.id" :kind="value === item.id ? 'primary' : 'outline'" :disabled="disabled || false" :class="[{ active: value === item.id }, item.id === 0 ? 'left' : 'right']" @onClick="$emit('set-value', item.id)" :data-test="'button_' + id + item.id">{{ item.name }}</react-Button>
    </div>
  </div>
</template>

<script>
import { ReactInVue } from 'vuera';
import { Button } from '@tableau/tableau-ui';

export default {
  name: 'ConfigSelect',
  components: { 'react-Button': ReactInVue(Button) },
  props: {
    id: String,
    labelText: String,
    items: Array,
    value: Number,
    disabled: Boolean,
  },
  methods: {
    updateItems: function() {
      const select = document.querySelector(`[data-test='input_${this.id}']`);
      if (!select) return;
      select.innerHTML = ['', ...this.items].map((item) => `<option value="${item}">${item}</option>`).join('');
      this.noValuesCheck();
    },
    noValuesCheck: function() {
      if (this.items.length === 0) {
        const select = document.querySelector(`[data-test='input_${this.id}']`);
        if (!select) return;
        let option = document.createElement('option');
        option.style = 'font-style:italic;color:#CCC';
        option.text = 'None found';
        option.disabled = true;
        select.add(option);
      }
    },
  },
  watch: {
    items: function() {
      this.updateItems();
    },
  },
  mounted: function() {
    this.$nextTick(this.updateItems);
  },
};
</script>
