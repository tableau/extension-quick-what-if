import { tableau, dispatchEvent, parameters } from '../mocks/tableau';

const baseURL = window.location.origin;

describe('Load extension for the first time', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
    });
  });

  it('Shows "Needs config" text', () => {
    cy.visit('/index.html');
    cy.get('.error').should('be.visible');
  });
});

describe('Load extension with invalid settings', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 0,
        field: 'Sub-Category222',
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

  it('Shows "Needs config" text', () => {
    cy.visit('/index.html');
    cy.get('.error').should('be.visible');
  });
});

describe('Load extension with missing settings', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 0,
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

  it('Shows "Needs config" text', () => {
    cy.visit('/index.html');
    cy.get('.error').should('be.visible');
  });
});

describe('Load extension with valid settings', () => {
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

  it('Shows "Needs config" text', () => {
    cy.visit('/index.html');
    cy.get('.error').should('not.be.visible');
  });
});

describe('Scenario #1: In pop-up, all inputs, mark selection', () => {
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
        trigger: 0,
        unitLabel: '%',
        worksheet: 'Sheet 1',
      };
      win.tableau._testSetup(setSettings);
    });
  });

  it('Shows help text', () => {
    cy.visit('/index.html');
    cy.get('.error').should('not.be.visible');
    cy.get('[data-test="button_select"]').should('not.be.visible');
    cy.get('.tip').should('be.visible');
  });

  it('Pops open pop-up on mark selection with correct arguments', () => {
    const spy = cy.spy(tableau.extensions.ui, 'displayDialogAsync').as('calledAtAll');
    const withFoo = spy.withArgs(`${baseURL}/popup.html`, '{"values":[{"name":"Tables","value":"0"},{"name":"Furnishings","value":"0"},{"name":"Chairs","value":"0"},{"name":"Bookcases","value":"0"},{"name":"Supplies","value":"0"},{"name":"Storage","value":"0"},{"name":"Paper","value":"0"},{"name":"Labels","value":"0"},{"name":"Fasteners","value":"0"},{"name":"Envelopes","value":"0"},{"name":"Binders","value":"0"},{"name":"Art","value":"0"},{"name":"Appliances","value":"0"},{"name":"Phones","value":"0"},{"name":"Machines","value":"0"},{"name":"Copiers","value":"0"},{"name":"Accessories","value":"0"}],"selected":["Appliances","Binders","Storage"],"showAll":true,"unitLabel":"%"}', { width: 350, height: 350 }).as('calledWithArgs');
    dispatchEvent(tableau.TableauEventType.MarkSelectionChanged); // Mock selects three marks
    cy.wait(0).then(() => {
      expect(spy).to.be.called;
      expect(withFoo).to.be.called;
    });
  });
});

describe('Scenario #2: In pop-up, all inputs, button click', () => {
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

  it('Shows button', () => {
    cy.visit('/index.html');
    cy.get('.error').should('not.be.visible');
    cy.get('.tip').should('not.be.visible');
    cy.get('[data-test="button_select"]').should('be.visible');
    cy.get('[data-test="button_select"]').contains('Show Inputs');
  });

  it('Pops open pop-up on button click with correct arguments', () => {
    const spy = cy.spy(tableau.extensions.ui, 'displayDialogAsync').as('calledAtAll');
    const withFoo = spy.withArgs(`${baseURL}/popup.html`, '{"values":[{"name":"Tables","value":"0"},{"name":"Furnishings","value":"0"},{"name":"Chairs","value":"0"},{"name":"Bookcases","value":"0"},{"name":"Supplies","value":"0"},{"name":"Storage","value":"0"},{"name":"Paper","value":"0"},{"name":"Labels","value":"0"},{"name":"Fasteners","value":"0"},{"name":"Envelopes","value":"0"},{"name":"Binders","value":"0"},{"name":"Art","value":"0"},{"name":"Appliances","value":"0"},{"name":"Phones","value":"0"},{"name":"Machines","value":"0"},{"name":"Copiers","value":"0"},{"name":"Accessories","value":"0"}],"selected":["Appliances","Binders","Storage"],"showAll":true,"unitLabel":"%"}', { width: 350, height: 350 }).as('calledWithArgs');
    cy.get('[data-test="button_select"]').click();
    cy.wait(0).then(() => {
      expect(spy).to.be.called;
      expect(withFoo).to.be.called;
    });
  });
});

describe('Scenario #3: In pop-up, only selected inputs, mark selection', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 1,
        field: 'Sub-Category',
        location: 0,
        parameter: 'Goals',
        selectBtnLabel: 'Show Inputs',
        trigger: 0,
        unitLabel: '%',
        worksheet: 'Sheet 1',
      };
      win.tableau._testSetup(setSettings);
    });
  });

  it('Shows help text', () => {
    cy.visit('/index.html');
    cy.get('.error').should('not.be.visible');
    cy.get('[data-test="button_select"]').should('not.be.visible');
    cy.get('.tip').should('be.visible');
  });

  it('Pops open pop-up on mark selection with correct arguments', () => {
    const spy = cy.spy(tableau.extensions.ui, 'displayDialogAsync').as('calledAtAll');
    const withFoo = spy.withArgs(`${baseURL}/popup.html`, '{"values":[{"name":"Tables","value":"0"},{"name":"Furnishings","value":"0"},{"name":"Chairs","value":"0"},{"name":"Bookcases","value":"0"},{"name":"Supplies","value":"0"},{"name":"Storage","value":"0"},{"name":"Paper","value":"0"},{"name":"Labels","value":"0"},{"name":"Fasteners","value":"0"},{"name":"Envelopes","value":"0"},{"name":"Binders","value":"0"},{"name":"Art","value":"0"},{"name":"Appliances","value":"0"},{"name":"Phones","value":"0"},{"name":"Machines","value":"0"},{"name":"Copiers","value":"0"},{"name":"Accessories","value":"0"}],"selected":["Appliances","Binders","Storage"],"showAll":false,"unitLabel":"%"}', { width: 350, height: 115 }).as('calledWithArgs');
    dispatchEvent(tableau.TableauEventType.MarkSelectionChanged); // Mock selects three marks
    cy.wait(0).then(() => {
      expect(spy).to.be.called;
      expect(withFoo).to.be.called;
    });
  });
});

describe('Scenario #4: In pop-up, only selected inputs, button click', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 1,
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

  it('Shows button', () => {
    cy.visit('/index.html');
    cy.get('.error').should('not.be.visible');
    cy.get('.tip').should('not.be.visible');
    cy.get('[data-test="button_select"]').should('be.visible');
    cy.get('[data-test="button_select"]').contains('Show Inputs');
  });

  it('Pops open pop-up on button click with correct arguments', () => {
    const spy = cy.spy(tableau.extensions.ui, 'displayDialogAsync').as('calledAtAll');
    const withFoo = spy.withArgs(`${baseURL}/popup.html`, '{"values":[{"name":"Tables","value":"0"},{"name":"Furnishings","value":"0"},{"name":"Chairs","value":"0"},{"name":"Bookcases","value":"0"},{"name":"Supplies","value":"0"},{"name":"Storage","value":"0"},{"name":"Paper","value":"0"},{"name":"Labels","value":"0"},{"name":"Fasteners","value":"0"},{"name":"Envelopes","value":"0"},{"name":"Binders","value":"0"},{"name":"Art","value":"0"},{"name":"Appliances","value":"0"},{"name":"Phones","value":"0"},{"name":"Machines","value":"0"},{"name":"Copiers","value":"0"},{"name":"Accessories","value":"0"}],"selected":["Appliances","Binders","Storage"],"showAll":false,"unitLabel":"%"}', { width: 350, height: 115 }).as('calledWithArgs');
    cy.get('[data-test="button_select"]').click();
    cy.wait(0).then(() => {
      expect(spy).to.be.called;
      expect(withFoo).to.be.called;
    });
  });
});

describe('Scenario #5: On dashboard, all inputs, --ignore trigger--', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 0,
        field: 'Sub-Category',
        location: 1,
        parameter: 'Goals',
        selectBtnLabel: 'Show Inputs',
        trigger: 0,
        unitLabel: '%',
        worksheet: 'Sheet 1',
      };
      win.tableau._testSetup(setSettings);
    });
  });

  it('Shows all inputs and label', () => {
    cy.visit('/index.html');
    cy.get('.error').should('not.be.visible');
    cy.get('.tip').should('not.be.visible');
    cy.get('[data-test="button_select"]').should('not.be.visible');
    cy.get('.unitLabel').should('be.visible');
    cy.get('.unitLabel').contains('%');
    cy.get('.inputRow').should('have.length', 17);
  });

  it('Updates the parameter when input value is updated', () => {
    const selectedParameter = parameters[2];
    cy.spy(selectedParameter, 'changeValueAsync');
    cy.get('[data-test="input_Tables"]').type('{selectall}50');
    cy.wait(0).then(() => {
      expect(selectedParameter.changeValueAsync).to.be.called;
      const regex = new RegExp('Tables' + '\\|(-?\\d*\\.?\\,?\\d*)');
      let value = selectedParameter.currentValue.value.match(regex)[1];
      cy.wrap(value).should('eq', '50');
    });
  });
});

describe('Scenario #6: On dashboard, only selected inputs, mark selection', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 1,
        field: 'Sub-Category',
        location: 1,
        parameter: 'Goals',
        selectBtnLabel: 'Show Inputs',
        trigger: 0,
        unitLabel: '%',
        worksheet: 'Sheet 1',
      };
      win.tableau._testSetup(setSettings);
    });
  });

  it('Shows help tip and no inputs', () => {
    cy.visit('/index.html');
    cy.get('.error').should('not.be.visible');
    cy.get('.tip').should('be.visible');
    cy.get('[data-test="button_select"]').should('not.be.visible');
    cy.get('.unitLabel').should('not.be.visible');
  });

  it('Shows select inputs when marks are selected', () => {
    dispatchEvent(tableau.TableauEventType.MarkSelectionChanged); // Mock selects three marks
    cy.get('.tip').should('not.be.visible');
    cy.get('.unitLabel').should('be.visible');
    cy.get('.unitLabel').contains('%');
    cy.get('.inputRow').should('have.length', 3);
  });

  it('Updates the parameter when input value is updated', () => {
    const selectedParameter = parameters[2];
    cy.spy(selectedParameter, 'changeValueAsync');
    cy.get('[data-test="input_Storage"]').type('{selectall}50');
    cy.wait(0).then(() => {
      expect(selectedParameter.changeValueAsync).to.be.called;
      const regex = new RegExp('Storage' + '\\|(-?\\d*\\.?\\,?\\d*)');
      let value = selectedParameter.currentValue.value.match(regex)[1];
      cy.wrap(value).should('eq', '50');
    });
  });
});

describe('Scenario #7: On dashboard, only selected inputs, button click', () => {
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      Object.defineProperty(win, 'tableau', {
        value: tableau,
      });
      const setSettings = {
        display: 1,
        field: 'Sub-Category',
        location: 1,
        parameter: 'Goals',
        selectBtnLabel: 'Show Inputs',
        trigger: 1,
        unitLabel: '%',
        worksheet: 'Sheet 1',
      };
      win.tableau._testSetup(setSettings);
    });
  });

  it('Shows help tip and no inputs', () => {
    cy.visit('/index.html');
    cy.get('.error').should('not.be.visible');
    cy.get('.tip').should('not.be.visible');
    cy.get('[data-test="button_select"]').should('be.visible');
    cy.get('[data-test="button_select"]').contains('Show Inputs');
    cy.get('.unitLabel').should('not.be.visible');
  });

  it('Shows select inputs when marks are selected', () => {
    cy.get('[data-test="button_select"]').click();
    cy.get('.unitLabel').should('be.visible');
    cy.get('.unitLabel').contains('%');
    cy.get('.inputRow').should('have.length', 3);
  });

  it('Updates the parameter when input value is updated', () => {
    const selectedParameter = parameters[2];
    cy.spy(selectedParameter, 'changeValueAsync');
    cy.get('[data-test="input_Storage"]').type('{selectall}50');
    cy.wait(0).then(() => {
      expect(selectedParameter.changeValueAsync).to.be.called;
      const regex = new RegExp('Storage' + '\\|(-?\\d*\\.?\\,?\\d*)');
      let value = selectedParameter.currentValue.value.match(regex)[1];
      cy.wrap(value).should('eq', '50');
    });
  });
});
