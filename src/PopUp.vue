<template>
  <div class="container" id="app">
    <div class="unitLabel">{{ unitLabel }}</div>
    <div class="inputContainer" v-for="value in values" :key="value.name">
      <Input v-if="selected.includes(value.name) || showAll" :label="value.name" :value="value.value" v-on:set-value="value.value = $event" />
    </div>
  </div>
</template>

<script>
/* global tableau */
import Input from './components/Input.vue';

export default {
  name: 'PopUp',
  components: {
    Input,
  },
  data() {
    return {
      values: [],
      selected: [],
      showAll: false,
      unitLabel: '',
    };
  },
  methods: {},
  watch: {
    // Updates the Tableau parameter when new values are entered
    values: {
      handler: async function(items) {
        if (items.length === 0) return;
        const settings = tableau.extensions.settings.getAll();
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        const parameter = await dashboard.findParameterAsync(settings.parameter);
        parameter.changeValueAsync(items.map((item) => `{${item.name}|${item.value}}`).join(''));
      },
      deep: true,
    },
  },
  // Initialize the extension
  created: async function() {
    let payload = await tableau.extensions.initializeDialogAsync();
    payload = JSON.parse(payload);
    this.values = payload.values;
    this.selected = payload.selected;
    this.showAll = payload.showAll;
    this.unitLabel = payload.unitLabel;
  },
};
</script>

<style>
* {
  box-sizing: border-box;
  font-family: 'Benton Sans', Helvetica, Arial, sans-serif;
}

html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.8);
}

.container {
  /* height: 100%; */
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.inputContainer {
  width: 100%;
}

.titleRow {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row {
  width: 100%;
  margin-bottom: 12px;
}

.unitLabel {
  min-width: 100px;
  text-align: center;
  padding-right: 5px;
  margin-left: auto;
}

.sectionTitle {
  margin: 18px 0px;
  font-family: 'Benton Sans Medium', Helvetica, Arial, sans-serif;
  font-size: 12px;
}

.fullWidth {
  width: 100%;
}

.label {
  font-size: 12px;
  line-height: 21px;
}

.locationRow {
  width: 100%;
  display: flex;
  justify-content: center;
}

.locationRow div button {
  width: 100%;
  outline: none;
  border-color: #666666;
  box-shadow: none !important;
}

.left,
.right {
  width: 100%;
}

.left button {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  font-weight: 400;
}

.right button {
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  font-weight: 400;
}

.active button {
  border-color: #2a79af !important;
  background-color: #bedbf4;
  color: #1a699e;
  font-weight: 500;
}

.active button:hover:enabled {
  background-color: #bedbf4;
  color: #1a699e;
  font-weight: 500;
}

.saveButton {
  width: 100%;
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #e7e7e7;
}

::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 1px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b5b5b5;
}
</style>
