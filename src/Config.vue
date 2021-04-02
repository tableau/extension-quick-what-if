<template>
  <div class="container" id="app">
    <div class="titleRow">
      <span class="sectionTitle">Configuration</span>
      <ConfigInfoTip />
    </div>
    <ConfigSelect id="parameter" labelText="Select a storage parameter" :items="parameters" v-model="parameter" v-on:set-value="parameter = $event" />
    <ConfigSelect id="worksheet" labelText="Select a source worksheet" :items="worksheets" v-model="worksheet" v-on:set-value="worksheet = $event" />
    <ConfigSelect id="field" labelText="Select a field" :items="fields" v-model="field" v-on:set-value="field = $event" />
    <div class="titleRow">
      <span class="sectionTitle">Options</span>
    </div>
    <ButtonGroup id="location" labelText="Location of inputs" :items="locations" v-model="location" v-on:set-value="location = $event" />
    <ButtonGroup id="display" labelText="Inputs to display" :items="displays" v-model="display" v-on:set-value="display = $event" />
    <ButtonGroup id="trigger" labelText="Trigger" :items="triggers" v-model="trigger" v-on:set-value="trigger = $event" :disabled="display === 0 && location === 1" />
    <div class="spreadRow" v-if="labelsSet">
      <react-TextField kind="line" label="Unit label" className="fullWidth" maxlength="30" :defaultValue="unitLabel" @onChange="unitLabel = $event.target.value" data-test="unitLabel"></react-TextField>
      <react-TextField kind="line" label="Button text" className="fullWidth" maxlength="30" :defaultValue="selectBtnLabel" @onChange="selectBtnLabel = $event.target.value" :disabled="trigger === 0 || (display === 0 && location === 1)" data-test="selectBtnLabel"></react-TextField>
    </div>
    <div class="saveButton">
      <react-Button kind="primary" :disabled="!validConfig" @onClick="save" data-test="saveButton">Save Settings</react-Button>
    </div>
  </div>
</template>

<script>
/* global tableau */
import { ReactInVue } from 'vuera';
import { Button, TextField } from '@tableau/tableau-ui';
import ConfigSelect from './components/ConfigSelect.vue';
import ConfigInfoTip from './components/ConfigInfoTip.vue';
import ButtonGroup from './components/ButtonGroup.vue';
import { locations, triggers, displays } from './components/variables.js';

export default {
  name: 'Config',
  components: {
    ConfigSelect,
    ConfigInfoTip,
    ButtonGroup,
    'react-Button': ReactInVue(Button),
    'react-TextField': ReactInVue(TextField),
  },
  data() {
    return {
      parameter: '',
      parameters: [],
      worksheet: '',
      worksheets: [],
      field: '',
      fields: [],
      location: 0,
      locations,
      trigger: 0,
      triggers,
      display: 0,
      displays,
      unitLabel: '',
      selectBtnLabel: '',
      labelsSet: false,
    };
  },
  computed: {
    validConfig: function() {
      if (this.parameter === '') return false;
      if (this.worksheet === '') return false;
      if (this.field === '') return false;
      return true;
    },
  },
  methods: {
    // List all valid parameters
    getParameters: async function() {
      const dashboard = tableau.extensions.dashboardContent.dashboard;
      let parameters = await dashboard.getParametersAsync();
      parameters = parameters.filter((p) => p.dataType === 'string' && p.allowableValues.type === 'all');
      this.parameters = parameters.map((p) => p.name);

      const settings = tableau.extensions.settings.getAll();
      this.parameter = settings.parameter && parameters.find((p) => p.name === settings.parameter) ? settings.parameter : '';
    },
    // List all present worksheets
    getWorksheets: function() {
      const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
      this.worksheets = worksheets.map((w) => w.name);
      const settings = tableau.extensions.settings.getAll();
      let worksheetSetting = settings.worksheet && worksheets.find((w) => w.name === settings.worksheet);
      if (worksheetSetting) this.worksheet = settings.worksheet;
    },
    // Get fields on selected worksheet
    getFields: async function(worksheetName) {
      if (!worksheetName) return (this.fields = []);
      const worksheets = tableau.extensions.dashboardContent.dashboard.worksheets;
      const worksheet = worksheets.find((w) => w.name === worksheetName);
      const data = await worksheet.getSummaryDataAsync();
      let fields = data.columns.filter((column) => column.dataType === 'string');
      this.fields = fields.map((f) => f.fieldName);
      const settings = tableau.extensions.settings.getAll();
      this.field = settings.field && fields.find((f) => f.fieldName === settings.field) ? settings.field : '';
    },
    // Save the configuration to settings
    save: async function() {
      const settings = tableau.extensions.settings.getAll();
      let deletionAlert = (settings.parameter && settings.parameter !== this.parameter) || (settings.field && settings.field !== this.field);
      let reconfirm = true;
      if (deletionAlert) {
        reconfirm = confirm('Changing these settings will delete your current input values, are you sure?');
      }
      if (reconfirm) {
        tableau.extensions.settings.set('parameter', this.parameter);
        tableau.extensions.settings.set('worksheet', this.worksheet);
        tableau.extensions.settings.set('field', this.field);
        tableau.extensions.settings.set('location', this.location);
        tableau.extensions.settings.set('trigger', this.trigger);
        tableau.extensions.settings.set('display', this.display);
        tableau.extensions.settings.set('unitLabel', this.unitLabel);
        tableau.extensions.settings.set('selectBtnLabel', this.selectBtnLabel);
        await tableau.extensions.settings.saveAsync();
        tableau.extensions.ui.closeDialog('');
      }
    },
  },
  watch: {
    // Update the list of fields when the workhseet changes
    worksheet: function(worksheetName) {
      this.getFields(worksheetName);
    },
  },
  // Initialize the extension and set values from settings
  created: async function() {
    await tableau.extensions.initializeDialogAsync();
    const settings = tableau.extensions.settings.getAll();
    this.location = settings.location ? parseInt(settings.location) : this.location;
    this.trigger = settings.trigger ? parseInt(settings.trigger) : this.trigger;
    this.display = settings.display ? parseInt(settings.display) : this.display;
    this.unitLabel = settings.unitLabel ? settings.unitLabel : '##';
    this.selectBtnLabel = settings.selectBtnLabel ? settings.selectBtnLabel : 'Select';
    this.labelsSet = true;
    this.getParameters();
    this.getWorksheets();
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
  height: 100%;
  padding: 0px 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
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

.spreadRow {
  width: 100%;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sectionTitle {
  margin: 18px 0px;
  font-family: 'Benton Sans Medium', Helvetica, Arial, sans-serif;
  font-size: 12px;
}

.fullWidth {
  width: 100%;
}

input {
  width: 100%;
}

.label {
  font-size: 12px;
  line-height: 21px;
}

.buttonGroup {
  width: 100%;
  display: flex;
  justify-content: center;
}

.buttonGroup div button {
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
