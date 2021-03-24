import { tableau } from '../mocks/tableau';

describe('Configure the extension for the first time', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
    });
  });

  it('Loads parameters and worksheets', () => {
    cy.visit('/config.html');
    cy.get("[data-test='input_parameter']")
      .children("option[value='Goals']")
      .should('exist');
    cy.get("[data-test='input_parameter']")
      .children("option[value='Select Category']")
      .should('not.exist');
    cy.get("[data-test='input_worksheet']")
      .children("option[value='Sheet 1']")
      .should('exist');
    cy.get("[data-test='input_field']").should('have.value', '');
    cy.get("[data-test='saveButton']").should('be.disabled');
  });

  it('Selects a parameter, worksheet and field', () => {
    cy.get("[data-test='input_parameter']").select('Goals');
    cy.get("[data-test='input_parameter']").should('have.value', 'Goals');
    cy.get("[data-test='saveButton']").should('be.disabled');

    cy.get("[data-test='input_worksheet']").select('Sheet 1');
    cy.get("[data-test='input_worksheet']").should('have.value', 'Sheet 1');
    cy.get("[data-test='saveButton']").should('be.disabled');

    cy.get("[data-test='input_field']").select('Sub-Category');
    cy.get("[data-test='input_field']").should('have.value', 'Sub-Category');
    cy.get("[data-test='saveButton']").should('not.be.disabled');
  });

  it('Disables submit if missing fields', () => {
    cy.get("[data-test='input_parameter']").select('');
    cy.get("[data-test='saveButton']").should('be.disabled');
    cy.get("[data-test='input_parameter']").select('Goals');
    cy.get("[data-test='saveButton']").should('not.be.disabled');
  });

  it('Resets fields when worksheet changes', () => {
    cy.get("[data-test='input_worksheet']").select('Sheet 2');
    cy.get("[data-test='input_field']").should('have.value', '');
    cy.get("[data-test='saveButton']").should('be.disabled');
    cy.get("[data-test='input_worksheet']").select('Sheet 1');
    cy.get("[data-test='input_field']").select('Sub-Category');
    cy.get("[data-test='saveButton']").should('not.be.disabled');
  });

  it('Selects options', () => {
    cy.get("[data-test='button_location1']").click();
    cy.get("[data-test='button_location1']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='button_trigger1']").should('be.disabled');
    cy.get("[data-test='button_trigger0']").should('be.disabled');
    cy.get("[data-test='button_location0']").click();
    cy.get("[data-test='button_location0']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='button_display1']").click();
    cy.get("[data-test='button_display1']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='button_display0']").click();
    cy.get("[data-test='button_display0']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='button_trigger1']").click();
    cy.get("[data-test='button_trigger1']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='button_trigger0']").click();
    cy.get("[data-test='button_trigger0']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='selectBtnLabel']").should('be.disabled');
    cy.get("[data-test='button_trigger1']").click();
    cy.get("[data-test='selectBtnLabel']").should('not.be.disabled');
    cy.get("[data-test='selectBtnLabel']").type('{selectall}Show Inputs');
    cy.get("[data-test='selectBtnLabel']").should('have.value', 'Show Inputs');
    cy.get("[data-test='unitLabel']").type('{selectall}%');
    cy.get("[data-test='unitLabel']").should('have.value', '%');
  });
  it('Saves settings correctly', () => {
    cy.get("[data-test='saveButton']").click();
    cy.window().then((win) => {
      const goalSettings = {
        display: 0,
        field: 'Sub-Category',
        location: 0,
        parameter: 'Goals',
        selectBtnLabel: 'Show Inputs',
        trigger: 1,
        unitLabel: '%',
        worksheet: 'Sheet 1',
      };
      const settings = win.tableau.extensions.settings.getAll();
      const goalKeys = Object.keys(goalSettings);
      const actualKeys = Object.keys(settings);
      cy.wrap(goalKeys.length === actualKeys.length).should('be.true');

      for (const key of goalKeys) {
        cy.wrap(goalSettings[key] === settings[key]).should('be.true');
      }
    });
  });
});

describe('Configure the extension a subsequent time', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 0,
        field: 'Sub-Category',
        location: 0,
        parameter: 'Goals',
        selectBtnLabel: 'Show Inputs',
        trigger: 1,
        unitLabel: '%',
        worksheet: 'Sheet 1',
      };
      win.tableau._testSetup(setSettings);
    });
  });

  it('Keeps all settings when valid', () => {
    cy.visit('/config.html');
    cy.get("[data-test='input_parameter']").should('have.value', 'Goals');
    cy.get("[data-test='input_worksheet']").should('have.value', 'Sheet 1');
    cy.get("[data-test='input_field']").should('have.value', 'Sub-Category');
    cy.get("[data-test='saveButton']").should('not.be.disabled');
    cy.get("[data-test='button_location0']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='button_display0']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='button_trigger1']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='unitLabel']").should('have.value', '%');
    cy.get("[data-test='selectBtnLabel']").should('have.value', 'Show Inputs');
  });

  it('Saves settings correctly', () => {
    cy.get("[data-test='saveButton']").click();
    cy.window().then((win) => {
      const goalSettings = {
        display: 0,
        field: 'Sub-Category',
        location: 0,
        parameter: 'Goals',
        selectBtnLabel: 'Show Inputs',
        trigger: 1,
        unitLabel: '%',
        worksheet: 'Sheet 1',
      };
      const settings = win.tableau.extensions.settings.getAll();
      const goalKeys = Object.keys(goalSettings);
      const actualKeys = Object.keys(settings);
      cy.wrap(goalKeys.length === actualKeys.length).should('be.true');

      for (const key of goalKeys) {
        cy.wrap(goalSettings[key] === settings[key]).should('be.true');
      }
    });
  });
});

describe('Load config when inputs are not valid', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 0,
        field: 'Sub-Category',
        location: 0,
        parameter: 'GoalsX',
        selectBtnLabel: 'Show Inputs',
        trigger: 1,
        unitLabel: '%',
        worksheet: 'Sheet 10',
      };
      win.tableau._testSetup(setSettings);
    });
  });

  it('Disables submit button if not valid', () => {
    cy.visit('/config.html');
    cy.get("[data-test='input_parameter']").should('have.value', '');
    cy.get("[data-test='input_worksheet']").should('have.value', '');
    cy.get("[data-test='input_field']").should('have.value', '');
    cy.get("[data-test='saveButton']").should('be.disabled');
  });
});

describe('Load config when settings are missing', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 0,
        field: 'Sub-Category',
        location: 0,
        parameter: 'Goals',
        worksheet: 'Sheet 1',
      };
      win.tableau._testSetup(setSettings);
    });
  });

  it('Sets options to default if missing', () => {
    cy.visit('/config.html');
    cy.get("[data-test='input_parameter']").should('have.value', 'Goals');
    cy.get("[data-test='input_worksheet']").should('have.value', 'Sheet 1');
    cy.get("[data-test='input_field']").should('have.value', 'Sub-Category');
    cy.get("[data-test='button_trigger0']")
      .parent()
      .should('have.class', 'active');
    cy.get("[data-test='unitLabel']").should('have.value', '##');
    cy.get("[data-test='selectBtnLabel']").should('have.value', 'Select');
  });
});
