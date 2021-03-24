import { tableau, parameters } from '../mocks/tableau';

describe('Popup from selecting marks or button click, all inputs', () => {
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

  it('Shows correct inputs', () => {
    cy.visit('/popup.html');
    tableau.testpayload = '{"values":[{"name":"Tables","value":"0"},{"name":"Furnishings","value":"0"},{"name":"Chairs","value":"0"},{"name":"Bookcases","value":"0"},{"name":"Supplies","value":"0"},{"name":"Storage","value":"0"},{"name":"Paper","value":"0"},{"name":"Labels","value":"0"},{"name":"Fasteners","value":"0"},{"name":"Envelopes","value":"0"},{"name":"Binders","value":"0"},{"name":"Art","value":"0"},{"name":"Appliances","value":"0"},{"name":"Phones","value":"0"},{"name":"Machines","value":"0"},{"name":"Copiers","value":"0"},{"name":"Accessories","value":"0"}],"selected":["Appliances","Binders","Storage"],"showAll":true,"unitLabel":"%"}';
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

describe('Popup from selecting marks or button click, only selected inputs', () => {
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

  it('Shows correct inputs', () => {
    cy.visit('/popup.html');
    tableau.testpayload = '{"values":[{"name":"Tables","value":"0"},{"name":"Furnishings","value":"0"},{"name":"Chairs","value":"0"},{"name":"Bookcases","value":"0"},{"name":"Supplies","value":"0"},{"name":"Storage","value":"0"},{"name":"Paper","value":"0"},{"name":"Labels","value":"0"},{"name":"Fasteners","value":"0"},{"name":"Envelopes","value":"0"},{"name":"Binders","value":"0"},{"name":"Art","value":"0"},{"name":"Appliances","value":"0"},{"name":"Phones","value":"0"},{"name":"Machines","value":"0"},{"name":"Copiers","value":"0"},{"name":"Accessories","value":"0"}],"selected":["Appliances","Binders","Storage"],"showAll":false,"unitLabel":"%"}';
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
