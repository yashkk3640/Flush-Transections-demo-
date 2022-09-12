var UPDATE_COUNT = 20;

const columnDefs = [
  // these are the row groups, so they are all hidden (they are show in the group column)
  {
    headerName: 'Product',
    field: 'product',
    enableRowGroup: true,
    enablePivot: true,
    rowGroupIndex: 0,
    hide: true,
  },
  {
    headerName: 'Portfolio',
    field: 'portfolio',
    enableRowGroup: true,
    enablePivot: true,
    rowGroupIndex: 1,
    hide: true,
  },
  {
    headerName: 'Book',
    field: 'book',
    enableRowGroup: true,
    enablePivot: true,
    rowGroupIndex: 2,
    hide: true,
  },
  { headerName: 'Trade', field: 'trade', width: 100 },

  // all the other columns (visible and not grouped)
  {
    headerName: 'Current',
    field: 'current',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'Previous',
    field: 'previous',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'Deal Type',
    field: 'dealType',
    enableRowGroup: true,
    enablePivot: true,
  },
  {
    headerName: 'Bid',
    field: 'bidFlag',
    enableRowGroup: true,
    enablePivot: true,
    width: 100,
  },
  {
    headerName: 'PL 1',
    field: 'pl1',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'PL 2',
    field: 'pl2',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'Gain-DX',
    field: 'gainDx',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'SX / PX',
    field: 'sxPx',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: '99 Out',
    field: '_99Out',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'Submitter ID',
    field: 'submitterID',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
  {
    headerName: 'Submitted Deal ID',
    field: 'submitterDealID',
    width: 200,
    aggFunc: 'sum',
    enableValue: true,
    cellClass: 'number',
    valueFormatter: numberCellFormatter,
    cellRenderer: 'agAnimateShowChangeCellRenderer',
  },
];

function numberCellFormatter(params) {
  return Math.floor(params.value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const gridOptions = {
  columnDefs: columnDefs,
  suppressAggFuncInHeader: true,
  animateRows: true,
  rowGroupPanelShow: 'always',
  pivotPanelShow: 'always',
  asyncTransactionWaitMillis: 4000,
  getRowId: (params) => {
    return params.data.trade;
  },
  defaultColDef: {
    width: 120,
    sortable: true,
    resizable: true,
  },
  autoGroupColumnDef: {
    width: 250,
  },
  onGridReady: (params) => {
    getData();
    params.api.setRowData(globalRowData);
    startFeed(params.api);
  },
  onAsyncTransactionsFlushed: (e) => {
    console.log(
      '========== onAsyncTransactionsFlushed: applied ' +
        e.results.length +
        ' transactions'
    );
  },
};

function onFlushTransactions() {
  gridOptions.api.flushAsyncTransactions();
}

function startFeed(api) {
  var count = 1;

  setInterval(function () {
    var thisCount = count++;
    var updatedIndexes = {};
    var newItems = [];
    for (var i = 0; i < UPDATE_COUNT; i++) {
      // pick one index at random
      var index = Math.floor(Math.random() * globalRowData.length);
      // dont do same index twice, otherwise two updates for same row in one transaction
      if (updatedIndexes[index]) {
        continue;
      }
      var itemToUpdate = globalRowData[index];
      var newItem = copyObject(itemToUpdate);
      // copy previous to current value
      newItem.previous = newItem.current;
      // then create new current value
      // newItem.current = Math.floor(Math.random() * 10) + 10;
      newItem.current = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
      newItems.push(newItem);
    }
    var resultCallback = function () {
      console.log('transactionApplied() - ' + thisCount);
    };
    api.applyTransactionAsync({ update: newItems }, resultCallback);
    console.log('applyTransactionAsync() - ' + thisCount);
  }, 500);
}

// makes a copy of the original and merges in the new values
function copyObject(object) {
  // start with new object
  var newObject = {};

  // copy in the old values
  Object.keys(object).forEach(function (key) {
    newObject[key] = object[key];
  });

  return newObject;
}

// after page is loaded, create the grid.
document.addEventListener('DOMContentLoaded', function () {
  var eGridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(eGridDiv, gridOptions);
});
