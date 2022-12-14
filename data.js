var MIN_BOOK_COUNT = 10;
var MAX_BOOK_COUNT = 20;

var MIN_TRADE_COUNT = 1;
var MAX_TRADE_COUNT = 10;

var products = [
  "Amos",
  "Arsenal Hill",
  "Balls Gap",
  "Beckjord",
  "Beech Ridge Wind Farm",
  "Berrien Springs",
  "Big Sandy",
  "Blue Canyon",
  "Buchanan",
  "Buck Byllesby",
  "Buck Total",
  "Camp Grove AEP",
  "Canadian Hills",
  "Cardinal",
  "Ceredo",
  "Claytor",
  "Clinch River",
  "Comanche",
  "Conesville",
  "Constantine",
  "Cook",
  "Covanta",
  "Darby",
];

// var portfolios = ["Aggressive", "Defensive", "Income", "Speculative", "Hybrid"];

// start the book id's and trade id's at some future random number,
// looks more realistic than starting them at 0
var currBookId = "09/01/2022";
var nextTradeId = "00:00";

// a list of the data, that we modify as we go. if you are using an immutable
// data store (such as Redux) then this would be similar to your store of data.
var globalRowData;

// build up the test data
function getData() {
  globalRowData = [];
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    // for (var j = 0; j < portfolios.length; j++) {
    // var portfolio = portfolios[j];

    var bookCount = randomBetween(MAX_BOOK_COUNT, MIN_BOOK_COUNT);

    for (var k = 0; k < bookCount; k++) {
      var book = createBookName();
      var tradeCount = randomBetween(MAX_TRADE_COUNT, MIN_TRADE_COUNT);
      for (var l = 0; l < tradeCount; l++) {
        var trade = createTradeRecord(product, null, book); // null = portfolio
        globalRowData.push(trade);
      }
    }
    // }
  }
}

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createTradeRecord(product, portfolio, book) {
  // 50 to 70 current and  previous both
  var current = randomBetween(50, 70);
  var previous = current + randomBetween(14, 26) - 20;
  var trade = {
    product: product,
    // portfolio: portfolio,
    book: book,
    trade: createTradeId(),
    // submitterID: randomBetween(10, 1000),
    // submitterDealID: randomBetween(10, 1000),
    dealType: Math.random() < 0.2 ? "Physical" : "Financial",
    // bidFlag: Math.random() < 0.5 ? "Buy" : "Sell",
    current: current,
    previous: previous,
    pl1: randomBetween(100, 1000),
    pl2: randomBetween(100, 1000),
    // gainDx: randomBetween(100, 1000),
    // sxPx: randomBetween(100, 1000),
    // _99Out: randomBetween(100, 1000),
  };
  return trade;
}

function createBookName() {
  // currBookId++;
  return currBookId;
}

function createTradeId() {
  const currTradeId = nextTradeId;

  var [h, m] = nextTradeId.split(":");

  var min = +m + 5;
  if (min === 60) {
    h = +h + 1;
    min = 0;
  }
  if (+h === 24) {
    currBookId = currBookId
      .split("/")
      .map((v, i) => (i === 1 ? fixNum(+v + 1) : v))
      .join("/");
    h = "00";
    min = "00";
  }
  nextTradeId = [fixNum(h), fixNum(min)].join(":");

  return currTradeId;
}

function fixNum(n) {
  return +n > 9 ? "" + +n : "0" + +n;
}
