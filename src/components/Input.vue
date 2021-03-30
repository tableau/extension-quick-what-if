<template>
  <div class="inputRow">
    {{ label }}
    <react-TextField kind="outline" className="input" :defaultValue="value" @onChange="emitValue" @onFocus="selectAll" :data-test="'input_' + label"></react-TextField>
  </div>
</template>

<script>
import { ReactInVue } from 'vuera';
import { TextField } from '@tableau/tableau-ui';

export default {
  name: 'Input',
  components: { 'react-TextField': ReactInVue(TextField) },
  props: {
    label: String,
    value: String,
  },
  methods: {
    selectAll: function(event) {
      event.target.select();
    },
    emitValue: function(event) {
      const input = event.target.value;
      const cleaned = input.replace(/[^0-9.-]/g, '') || 0;
      event.target.value = cleaned;
      this.$emit('set-value', cleaned);
    },
  },
};
</script>

<style scoped>
.inputRow {
  margin: 0;
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inputRow:hover {
  font-weight: bold;
  background-color: #f5f5f5;
}

div >>> div > div > input {
  min-width: 40px;
  max-width: 100px;
  height: 20px;
  text-align: end;
}

div >>> .input {
  background-color: #fff;
}
</style>
