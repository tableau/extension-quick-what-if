<template>
  <div class="container" id="app">
    <InvalidConfig v-if="!validConfig" v-on:configure="configure" :mode="mode" />
    <div class="tip" v-if="selected.length === 0 && trigger === 0 && (location === 0 || (location === 1 && display === 1))">
      Select marks to update their value.
    </div>
    <div class="centerRow">
      <react-Button v-if="!(trigger === 0 || (display === 0 && location === 1))" @onClick="getSelectedMarks" data-test="button_select">
        {{ selectBtnLabel }}
      </react-Button>
    </div>
    <div class="unitLabel" v-if="location === 1 && (selected.length > 0 || display === 0)">
      {{ unitLabel }}
    </div>
    <div class="inputContainer" v-for="value in values" :key="value.name">
      <Input v-if="location === 1 && (selected.includes(value.name) || display === 0)" :label="value.name" :value="value.value" v-on:set-value="value.value = $event" />
    </div>
  </div>
</template>

<script>
/* global tableau */
import Input from './components/Input.vue';
import InvalidConfig from './components/InvalidConfig.vue';
import { ReactInVue } from 'vuera';
import { Button } from '@tableau/tableau-ui';

export default {
  name: 'Index',
  components: {
    Input,
    InvalidConfig,
    'react-Button': ReactInVue(Button),
  },
  data() {
    return {
      values: [],
      selected: [],
      validConfig: false,
      unregister: () => {},
      location: 0,
      trigger: 0,
      display: 0,
      mode: 'viewing',
      unitLabel: '##',
      selectBtnLabel: 'Select',
    };
  },
  computed: {
    baseURL: function() {
      return window.location.origin.includes('localhost:8080') ? window.location.origin : '.';
    },
  },
  methods: {
    // Opens configuration dialog and rebuilds inputs after closing.
    configure: async function() {
      await tableau.extensions.ui.displayDialogAsync(`${this.baseURL}/config.html`, '', {
        width: 350,
        height: 550,
      });
      this.getMembers();
    },
    // Handles regex for reading delimited values in parameter
    getRegex: function(label) {
      return new RegExp(label + '\\|(-?\\d*\\.?\\,?\\d*)');
    },
    // Event handler for marks selection.
    markSelected: async function(marksEvent) {
      let data = await marksEvent.getMarksAsync();
      this.displaySelected(data.data[0]);
    },
    // Event handler for button click
    getSelectedMarks: async function() {
      const settings = tableau.extensions.settings.getAll();
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      const worksheet = dashboard.worksheets.find((w) => w.name === settings.worksheet);
      const data = await worksheet.getSummaryDataAsync({ ignoreSelection: false });
      this.displaySelected(data);
    },
    // Displays inputs in either dashboard or pop-up
    displaySelected: async function(data) {
      const settings = tableau.extensions.settings.getAll();
      const field = data.columns.find((column) => column.fieldName === settings.field);
      let marks = data.data.map((m) => m[field.index].value);
      marks = [...new Set(marks)];
      const markCount = marks.length;
      if (markCount === 0) return (this.selected = []);
      this.selected = marks;

      let showAll = this.display === 0;
      if (this.location === 0) {
        let payload = JSON.stringify({ values: this.values, selected: this.selected, showAll, unitLabel: this.unitLabel });

        try {
          await tableau.extensions.ui.displayDialogAsync(`${this.baseURL}/popup.html`, payload, {
            width: 350,
            height: Math.min(350, (showAll ? this.values.length : markCount) * 30 + 25),
          });
          this.updateValues();
        } catch (error) {
          if (error.errorCode === tableau.ErrorCodes.DialogClosedByUser) this.updateValues();
        }
      }
    },
    // Get the list of input values from members of the dimension
    getMembers: async function() {
      // Reset values
      this.values = [];
      this.selected = [];

      // Update basic settings
      const settings = tableau.extensions.settings.getAll();
      this.location = settings.location ? parseInt(settings.location) : this.location;
      this.trigger = settings.trigger ? parseInt(settings.trigger) : this.trigger;
      this.display = settings.display ? parseInt(settings.display) : this.display;
      this.unitLabel = settings.unitLabel ? settings.unitLabel : this.unitLabel;
      this.selectBtnLabel = settings.selectBtnLabel ? settings.selectBtnLabel : this.selectBtnLabel;

      // Validate that what is in the settings still exists on the dashboard.
      if (!settings.parameter || !settings.worksheet || !settings.field) return (this.validConfig = false);
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      const parameter = await dashboard.findParameterAsync(settings.parameter);
      if (!parameter) return (this.validConfig = false);
      const worksheet = dashboard.worksheets.find((w) => w.name === settings.worksheet);
      if (!worksheet) return (this.validConfig = false);
      const data = await worksheet.getSummaryDataAsync({ ignoreSelection: true });
      const field = data.columns.find((column) => column.fieldName === settings.field);
      if (!field) return (this.validConfig = false);

      // Get unique list of dimension members
      const members = new Set();
      const marks = data.data;
      for (let mark of marks) {
        members.add(mark[field.index].value);
      }

      // Pull matching values from parameter that have already been set
      let currentValues = parameter.currentValue.value;
      this.values = [...members].map((member) => {
        const regex = this.getRegex(member);
        let value = currentValues.match(regex) ? currentValues.match(regex)[1] : '0';
        return { name: member, value };
      });

      // Add an event listener for mark selections
      this.unregister();
      if (this.trigger === 0 && (this.location === 1 && this.display === 0) === false) {
        this.unregister = worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, this.markSelected);
      }

      this.validConfig = true;
    },
    // Updates the values shown in the inputs from the parameter
    updateValues: async function() {
      const settings = tableau.extensions.settings.getAll();
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      const parameter = await dashboard.findParameterAsync(settings.parameter);
      if (!parameter) return (this.validConfig = false);
      let currentValues = parameter.currentValue.value;
      this.values = [...this.values].map((member) => {
        const regex = this.getRegex(member.name);
        let value = currentValues.match(regex) ? currentValues.match(regex)[1] : '0';
        return { name: member.name, value };
      });
    },
  },
  watch: {
    // Updates the Tableau parameter when new values are entered
    values: {
      handler: async function(items) {
        const settings = tableau.extensions.settings.getAll();
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        const parameter = await dashboard.findParameterAsync(settings.parameter);
        if (!parameter) return (this.validConfig = false);
        parameter.changeValueAsync(items.map((item) => `{${item.name}|${item.value}}`).join(''));
      },
      deep: true,
    },
  },
  // Initializes the extension and sets up the inputs
  created: async function() {
    await tableau.extensions.initializeAsync({ configure: this.configure });
    this.getMembers();
    this.mode = tableau.extensions.environment.mode;
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
  width: 100%;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.8);
}

.container {
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.inputContainer {
  width: 100%;
}

.unitLabel {
  min-width: 100px;
  text-align: center;
  padding-right: 5px;
  margin-left: auto;
}

.tip {
  width: 100%;
  display: flex;
  justify-content: center;
  font-style: italic;
}

.fullWidth {
  width: 100%;
}

.centerRow {
  width: 100%;
  display: flex;
  justify-content: center;
}

.band {
  background-color: #f1f3f4;
}
</style>
