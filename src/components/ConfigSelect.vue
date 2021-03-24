<template>
  <div class="row">
    <react-DropdownSelect kind="line" className="fullWidth" :label="labelText" :value="value" @onChange="$emit('set-value', $event.target.value)" :data-test="'input_' + id"></react-DropdownSelect>
  </div>
</template>

<script>
import { ReactInVue } from 'vuera';
import { DropdownSelect } from '@tableau/tableau-ui';

export default {
  name: 'ConfigSelect',
  components: { 'react-DropdownSelect': ReactInVue(DropdownSelect) },
  props: {
    id: String,
    labelText: String,
    items: Array,
    value: String,
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
