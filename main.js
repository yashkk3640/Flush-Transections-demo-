var UPDATE_COUNT = 800;

const columnDefs = [
  // these are the row groups, so they are all hidden (they are show in the group column)
  {
    headerName: "Unit",
    field: "product",
    enableRowGroup: true,
    enablePivot: true,
    width: 200,
    // rowGroupIndex: 0,
    // hide: true,
  },
  // {
  //   headerName: "Portfolio",
  //   field: "portfolio",
  //   enableRowGroup: true,
  //   enablePivot: true,
  //   rowGroupIndex: 1,
  //   hide: true,
  // },
  {
    headerName: "Date Sysdate",
    field: "book",
    width: 200,
    enableRowGroup: true,
    // enablePivot: true,
    // rowGroupIndex: 1,
    // hide: true,
  },
  { headerName: "Trade", field: "trade", width: 150 },

  // all the other columns (visible and not grouped)
  {
    headerName: "Current LMP",
    field: "current",
    width: 200,
    aggFunc: "sum",
    enableValue: true,
    cellClass: "number",
    valueFormatter: numberCellFormatter,
    cellRenderer: "agAnimateShowChangeCellRenderer",
  },
  {
    headerName: "Prev. LMP",
    field: "previous",
    width: 200,
    aggFunc: "sum",
    enableValue: true,
    cellClass: "number",
    valueFormatter: numberCellFormatter,
    cellRenderer: "agAnimateShowChangeCellRenderer",
  },
  {
    headerName: "Current Output",
    field: "dealType",
    width: 200,
    enableRowGroup: true,
    enablePivot: true,
  },
  // {
  //   headerName: 'Bid',
  //   field: 'bidFlag',
  //   enableRowGroup: true,
  //   enablePivot: true,
  //   width: 100,
  // },
  {
    headerName: "PL 1",
    field: "pl1",
    width: 150,
    aggFunc: "sum",
    enableValue: true,
    cellClass: "number",
    valueFormatter: numberCellFormatter,
    cellRenderer: "agAnimateShowChangeCellRenderer",
  },
  {
    headerName: "PL 2",
    field: "pl2",
    width: 150,
    aggFunc: "sum",
    enableValue: true,
    cellClass: "number",
    valueFormatter: numberCellFormatter,
    cellRenderer: "agAnimateShowChangeCellRenderer",
  },
  // {
  //   headerName: 'Gain-DX',
  //   field: 'gainDx',
  //   width: 200,
  //   aggFunc: 'sum',
  //   enableValue: true,
  //   cellClass: 'number',
  //   valueFormatter: numberCellFormatter,
  //   cellRenderer: 'agAnimateShowChangeCellRenderer',
  // },
  // {
  //   headerName: 'SX / PX',
  //   field: 'sxPx',
  //   width: 200,
  //   aggFunc: 'sum',
  //   enableValue: true,
  //   cellClass: 'number',
  //   valueFormatter: numberCellFormatter,
  //   cellRenderer: 'agAnimateShowChangeCellRenderer',
  // },
  // {
  //   headerName: '99 Out',
  //   field: '_99Out',
  //   width: 200,
  //   aggFunc: 'sum',
  //   enableValue: true,
  //   cellClass: 'number',
  //   valueFormatter: numberCellFormatter,
  //   cellRenderer: 'agAnimateShowChangeCellRenderer',
  // },
  // {
  //   headerName: 'Submitter ID',
  //   field: 'submitterID',
  //   width: 200,
  //   aggFunc: 'sum',
  //   enableValue: true,
  //   cellClass: 'number',
  //   valueFormatter: numberCellFormatter,
  //   cellRenderer: 'agAnimateShowChangeCellRenderer',
  // },
  // {
  //   headerName: 'Submitted Deal ID',
  //   field: 'submitterDealID',
  //   width: 200,
  //   aggFunc: 'sum',
  //   enableValue: true,
  //   cellClass: 'number',
  //   valueFormatter: numberCellFormatter,
  //   cellRenderer: 'agAnimateShowChangeCellRenderer',
  // },
];

function numberCellFormatter(params) {
  // return params.value?.toPrecision("2") || "";
  return Number(params.value || 0)?.toFixed(2);
  // return Math.floor(params.value)
  // .toString()
  // .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

const gridOptions = {
  columnDefs: columnDefs,
  suppressAggFuncInHeader: true,
  animateRows: true,
  rowGroupPanelShow: "always",
  pivotPanelShow: "always",
  asyncTransactionWaitMillis: 1000,
  getRowId: (params) => {
    // return params.data.book + params.data.trade;
    return "" + params.data.product + params.data.book + params.data.trade;
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
      "========== onAsyncTransactionsFlushed: applied " +
        e.results.length +
        " transactions"
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
      var random = Math.random() * (26 - 14 + 1) + 14 - 20;
      if (newItem.current + random > 70) {
        random = -1 * Math.abs(random);
      } else if (newItem.current + random < 50) {
        random = Math.abs(random);
      }
      newItem.current = newItem.current + +Number(random).toFixed(2);
      // newItem.current = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
      newItems.push(newItem);
      updatedIndexes[index] = newItem;
      // update in global
      globalRowData[index].previous = newItem.previous;
      globalRowData[index].current = newItem.current;
    }
    var resultCallback = function () {
      console.log("transactionApplied() - " + thisCount);
    };
    api.applyTransactionAsync({ update: newItems }, resultCallback);
    updatedIndexes = {};
    newItems = [];
    console.log("applyTransactionAsync() - " + thisCount);
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
document.addEventListener("DOMContentLoaded", function () {
  var eGridDiv = document.querySelector("#myGrid");
  new agGrid.Grid(eGridDiv, gridOptions);
});
