let settings = {};
export let parameters = [
  { name: 'Profit Bin Size', dataType: 'int', currentValue: { value: '200', nativeValue: 200, formattedValue: '200' }, allowableValues: { type: 'range', minValue: { value: '50', nativeValue: 50, formattedValue: '50' }, maxValue: { value: '200', nativeValue: 200, formattedValue: '200' }, stepSize: 50 }, changeValueAsync },
  { name: 'Top Customers', dataType: 'int', currentValue: { value: '5', nativeValue: 5, formattedValue: '5' }, allowableValues: { type: 'range', minValue: { value: '5', nativeValue: 5, formattedValue: '5' }, maxValue: { value: '20', nativeValue: 20, formattedValue: '20' }, stepSize: 5 }, changeValueAsync },
  { name: 'Goals', dataType: 'string', currentValue: { value: 'Hello', formattedValue: 'Hello', nativeValue: 'Hello' }, allowableValues: { type: 'all' }, changeValueAsync },
  { name: 'Something Else', dataType: 'string', currentValue: { value: 'Hola', formattedValue: 'Hola', nativeValue: 'Hola' }, allowableValues: { type: 'all' }, changeValueAsync },
  {
    name: 'Select Category',
    dataType: 'string',
    currentValue: { value: 'Furniture', formattedValue: 'Furniture', nativeValue: 'Furniture' },
    allowableValues: {
      type: 'list',
      allowableValues: [
        { value: 'Furniture', formattedValue: 'Furniture', nativeValue: 'Furniture' },
        { value: 'Office Supplies', formattedValue: 'Office Supplies', nativeValue: 'Office Supplies' },
        { value: 'Technology', formattedValue: 'Technology', nativeValue: 'Technology' },
      ],
    },
    changeValueAsync,
  },
];
const MarkSelectionChanged = new Event('mark-selection-changed');
MarkSelectionChanged.getMarksAsync = () => {
  return new Promise((resolve) => {
    const data = {
      data: [
        {
          columns: [
            { fieldName: 'Category', dataType: 'string', isReferenced: true, index: 0 },
            { fieldName: 'Sub-Category', dataType: 'string', isReferenced: true, index: 1 },
            { fieldName: 'SUM(Sales)', dataType: 'float', isReferenced: true, index: 2 },
          ],
          data: [
            [
              { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
              { value: 'Appliances', nativeValue: 'Appliances', formattedValue: 'Appliances' },
              { value: 107532.1610000001, nativeValue: 107532.1610000001, formattedValue: '107532.1610000001' },
            ],
            [
              { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
              { value: 'Binders', nativeValue: 'Binders', formattedValue: 'Binders' },
              { value: 203412.73300000015, nativeValue: 203412.73300000015, formattedValue: '203412.73300000015' },
            ],
            [
              { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
              { value: 'Storage', nativeValue: 'Storage', formattedValue: 'Storage' },
              { value: 223843.6080000001, nativeValue: 223843.6080000001, formattedValue: '223843.6080000001' },
            ],
          ],
          isSummaryData: true,
          isTotalRowCountLimited: false,
          marksInfo: [
            { type: 'bar', color: 'red', tupleId: 11 },
            { type: 'bar', color: 'red', tupleId: 12 },
            { type: 'bar', color: 'red', tupleId: 13 },
          ],
          name: 'Summary Data Table',
          totalRowCount: 3,
        },
      ],
    };
    resolve(data);
  });
};

export let tableau = {
  _testSetup: (testSettings) => {
    settings = testSettings;
  },
  extensions: {
    initializeAsync: (configure) => {
      return new Promise((resolve) => {
        resolve(configure);
      });
    },
    initializeDialogAsync: () => {
      return new Promise((resolve) => {
        resolve(tableau.testpayload || '');
      });
    },
    environment: {
      mode: 'viewer',
    },
    ui: {
      closeDialog: () => {},
      displayDialogAsync: () => {},
    },
    settings: {
      get: (name) => {
        return settings[name];
      },
      set: (name, value) => {
        settings[name] = value;
      },
      getAll: () => {
        return settings;
      },
      saveAsync: () => {
        return new Promise((resolve) => {
          resolve();
        });
      },
    },
    dashboardContent: {
      dashboard: {
        worksheets: [
          {
            name: 'Sheet 1',
            getSummaryDataAsync,
            addEventListener,
          },
          {
            name: 'Sheet 2',
            getSummaryDataAsync,
            addEventListener,
          },
        ],
        findParameterAsync: (paramName) => {
          return new Promise((resolve) => {
            const parameter = parameters.find((p) => p.name === paramName);
            resolve(parameter);
          });
        },
        getParametersAsync: () => {
          return new Promise((resolve) => {
            resolve(parameters);
          });
        },
      },
    },
  },
  TableauEventType: {
    FilterChanged: new Event('filter-changed'),
    MarkSelectionChanged,
    ParameterChanged: new Event('parameter-changed'),
    SettingsChanged: new Event('settings-changed'),
  },
};

function changeValueAsync(value) {
  return new Promise((resolve) => {
    this.currentValue.value = value.toString();
    this.currentValue.formattedValue = value.toString();
    this.currentValue.nativeValue = value;
    resolve();
  });
}

function getSummaryDataAsync({ ignoreSelection } = { ignoreSelection: true }) {
  return new Promise((resolve) => {
    let DataTable = {
      columns: [
        { fieldName: 'Category', dataType: 'string', isReferenced: true, index: 0 },
        { fieldName: 'Sub-Category', dataType: 'string', isReferenced: true, index: 1 },
        { fieldName: 'SUM(Sales)', dataType: 'float', isReferenced: true, index: 2 },
      ],
      data: [
        [
          { value: 'Furniture', nativeValue: 'Furniture', formattedValue: 'Furniture' },
          { value: 'Tables', nativeValue: 'Tables', formattedValue: 'Tables' },
          { value: 206965.5320000001, nativeValue: 206965.5320000001, formattedValue: '206,965.53' },
        ],
        [
          { value: 'Furniture', nativeValue: 'Furniture', formattedValue: 'Furniture' },
          { value: 'Furnishings', nativeValue: 'Furnishings', formattedValue: 'Furnishings' },
          { value: 91705.16400000005, nativeValue: 91705.16400000005, formattedValue: '91,705.16' },
        ],
        [
          { value: 'Furniture', nativeValue: 'Furniture', formattedValue: 'Furniture' },
          { value: 'Chairs', nativeValue: 'Chairs', formattedValue: 'Chairs' },
          { value: 328449.1030000007, nativeValue: 328449.1030000007, formattedValue: '328,449.10' },
        ],
        [
          { value: 'Furniture', nativeValue: 'Furniture', formattedValue: 'Furniture' },
          { value: 'Bookcases', nativeValue: 'Bookcases', formattedValue: 'Bookcases' },
          { value: 114879.99629999998, nativeValue: 114879.99629999998, formattedValue: '114,880.00' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Supplies', nativeValue: 'Supplies', formattedValue: 'Supplies' },
          { value: 46673.538000000015, nativeValue: 46673.538000000015, formattedValue: '46,673.54' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Storage', nativeValue: 'Storage', formattedValue: 'Storage' },
          { value: 223843.60800000012, nativeValue: 223843.60800000012, formattedValue: '223,843.61' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Paper', nativeValue: 'Paper', formattedValue: 'Paper' },
          { value: 78479.20600000002, nativeValue: 78479.20600000002, formattedValue: '78,479.21' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Labels', nativeValue: 'Labels', formattedValue: 'Labels' },
          { value: 12486.312, nativeValue: 12486.312, formattedValue: '12,486.31' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Fasteners', nativeValue: 'Fasteners', formattedValue: 'Fasteners' },
          { value: 3024.2799999999997, nativeValue: 3024.2799999999997, formattedValue: '3,024.28' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Envelopes', nativeValue: 'Envelopes', formattedValue: 'Envelopes' },
          { value: 16476.402, nativeValue: 16476.402, formattedValue: '16,476.40' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Binders', nativeValue: 'Binders', formattedValue: 'Binders' },
          { value: 203412.7330000001, nativeValue: 203412.7330000001, formattedValue: '203,412.73' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Art', nativeValue: 'Art', formattedValue: 'Art' },
          { value: 27118.791999999954, nativeValue: 27118.791999999954, formattedValue: '27,118.79' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Appliances', nativeValue: 'Appliances', formattedValue: 'Appliances' },
          { value: 107532.161, nativeValue: 107532.161, formattedValue: '107,532.16' },
        ],
        [
          { value: 'Technology', nativeValue: 'Technology', formattedValue: 'Technology' },
          { value: 'Phones', nativeValue: 'Phones', formattedValue: 'Phones' },
          { value: 330007.0540000001, nativeValue: 330007.0540000001, formattedValue: '330,007.05' },
        ],
        [
          { value: 'Technology', nativeValue: 'Technology', formattedValue: 'Technology' },
          { value: 'Machines', nativeValue: 'Machines', formattedValue: 'Machines' },
          { value: 189238.631, nativeValue: 189238.631, formattedValue: '189,238.63' },
        ],
        [
          { value: 'Technology', nativeValue: 'Technology', formattedValue: 'Technology' },
          { value: 'Copiers', nativeValue: 'Copiers', formattedValue: 'Copiers' },
          { value: 149528.02999999994, nativeValue: 149528.02999999994, formattedValue: '149,528.03' },
        ],
        [
          { value: 'Technology', nativeValue: 'Technology', formattedValue: 'Technology' },
          { value: 'Accessories', nativeValue: 'Accessories', formattedValue: 'Accessories' },
          { value: 167380.3180000001, nativeValue: 167380.3180000001, formattedValue: '167,380.32' },
        ],
      ],
      isSummaryData: true,
      isTotalRowCountLimited: false,
      marksInfo: undefined,
      name: 'Summary Data Table',
      totalRowCount: 17,
    };
    let SelectionDataTable = {
      columns: [
        { fieldName: 'Category', dataType: 'string', isReferenced: true, index: 0 },
        { fieldName: 'Sub-Category', dataType: 'string', isReferenced: true, index: 1 },
        { fieldName: 'SUM(Sales)', dataType: 'float', isReferenced: true, index: 2 },
      ],
      data: [
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Appliances', nativeValue: 'Appliances', formattedValue: 'Appliances' },
          { value: 107532.161, nativeValue: 107532.161, formattedValue: '107,532.16' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Binders', nativeValue: 'Binders', formattedValue: 'Binders' },
          { value: 203412.7330000001, nativeValue: 203412.7330000001, formattedValue: '203,412.73' },
        ],
        [
          { value: 'Office Supplies', nativeValue: 'Office Supplies', formattedValue: 'Office Supplies' },
          { value: 'Storage', nativeValue: 'Storage', formattedValue: 'Storage' },
          { value: 223843.60800000012, nativeValue: 223843.60800000012, formattedValue: '223,843.61' },
        ],
      ],
      isSummaryData: true,
      isTotalRowCountLimited: false,
      marksInfo: undefined,
      name: 'Summary Data Table',
      totalRowCount: 3,
    };
    resolve(ignoreSelection ? DataTable : SelectionDataTable);
  });
}

function addEventListener(event, handler) {
  window.addEventListener(event.type, handler);
}

export const dispatchEvent = (event) => {
  window.dispatchEvent(event);
};
