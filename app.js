(function () {
  "use strict";

  var MIN_ELO = 1400;
  var MAX_ELO = 2400;
  var N_VALUES = [];
  for (var n = 4; n <= 20; n += 2) N_VALUES.push(n);

  var state = {
    seed: "",
    elos: [],
    round: 1,
    totalRounds: 1,
    selected: new Set(),
    locked: new Set(),
    optimal: new Set(),
    revealed: false,
    isFinal: false,
    inspectedRound: 1,
    history: []
  };

  var els = {
    playerCount: document.getElementById("playerCount"),
    newGameButton: document.getElementById("newGameButton"),
    statusText: document.getElementById("statusText"),
    roundSummary: document.getElementById("roundSummary"),
    roundText: document.getElementById("roundText"),
    selectedTotal: document.getElementById("selectedTotal"),
    optimalTotal: document.getElementById("optimalTotal"),
    finalResults: document.getElementById("finalResults"),
    roundResults: document.getElementById("roundResults"),
    prevRoundButton: document.getElementById("prevRoundButton"),
    nextRoundButton: document.getElementById("nextRoundButton"),
    inspectRoundText: document.getElementById("inspectRoundText"),
    matrix: document.getElementById("matrix"),
    clearButton: document.getElementById("clearButton"),
    nextButton: document.getElementById("nextButton")
  };

  function pairKey(a, b) {
    return a < b ? a + "-" + b : b + "-" + a;
  }

  function parsePairKey(key) {
    return key.split("-").map(Number);
  }

  function diff(a, b) {
    return Math.abs(state.elos[a] - state.elos[b]);
  }

  function weightedDiff(a, b) {
    return Math.pow(diff(a, b), 1.01);
  }

  function totalFor(keys) {
    var total = 0;
    keys.forEach(function (key) {
      var pair = parsePairKey(key);
      total += diff(pair[0], pair[1]);
    });
    return total;
  }

  function copySet(values) {
    return new Set(Array.from(values));
  }

  function inspectedHistory() {
    return state.history[state.inspectedRound - 1] || null;
  }

  function isInspectedChoice(key) {
    var round = inspectedHistory();
    return Boolean(round && round.selected.has(key));
  }

  function isInspectedOptimal(key) {
    var round = inspectedHistory();
    return Boolean(round && round.optimal.has(key));
  }

  function seedToNumber(seed) {
    var hash = 2166136261;
    for (var i = 0; i < seed.length; i++) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function seededRandom(seed) {
    var value = seedToNumber(seed);
    return function () {
      value += 0x6D2B79F5;
      var t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function newSeed() {
    return Math.floor(Date.now() + Math.random() * 0xFFFFFFFF).toString(36);
  }

  function randomNormal(rng) {
    var u = 0;
    var v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function generateElos(count, seed) {
    var rng = seededRandom(seed);
    var mean = (MIN_ELO + MAX_ELO) / 2;
    var sd = 170;
    var elos = [];
    for (var i = 0; i < count; i++) {
      var elo = Math.round(mean + randomNormal(rng) * sd);
      elos.push(Math.max(MIN_ELO, Math.min(MAX_ELO, elo)));
    }
    return elos.sort(function (a, b) {
      return b - a;
    });
  }

  function roundsFor(count) {
    return Math.max(1, Math.round(Math.log(count) / Math.log(2)));
  }

  function saveUrl() {
    var params = new URLSearchParams();
    params.set("n", String(state.elos.length));
    params.set("seed", state.seed);
    window.history.replaceState(null, "", "?" + params.toString());
  }

  function readUrlConfig() {
    var params = new URLSearchParams(window.location.search);
    var count = Number(params.get("n"));
    var seed = params.get("seed");
    if (N_VALUES.indexOf(count) !== -1 && seed) {
      return { count: count, seed: seed };
    }
    return null;
  }

  function computeOptimal() {
    var maxWeightedDiff = Math.pow(MAX_ELO - MIN_ELO, 1.01);
    var edges = [];
    for (var i = 0; i < state.elos.length; i++) {
      for (var j = i + 1; j < state.elos.length; j++) {
        if (!state.locked.has(pairKey(i, j))) {
          edges.push([i, j, maxWeightedDiff - weightedDiff(i, j)]);
        }
      }
    }

    var matching = new globalThis.Edmonds(edges, true).maxWeightMatching();
    var optimal = new Set();
    for (var v = 0; v < matching.length; v++) {
      if (matching[v] > v) optimal.add(pairKey(v, matching[v]));
    }
    return optimal;
  }

  function initializeSelect() {
    N_VALUES.forEach(function (value) {
      var option = document.createElement("option");
      option.value = String(value);
      option.textContent = String(value);
      els.playerCount.appendChild(option);
    });
  }

  function startGame(count, seedOrElos) {
    state.seed = seedOrElos || newSeed();
    state.elos = generateElos(count, state.seed);
    state.round = 1;
    state.totalRounds = roundsFor(state.elos.length);
    state.selected = new Set();
    state.locked = new Set();
    state.optimal = new Set();
    state.revealed = false;
    state.isFinal = false;
    state.inspectedRound = 1;
    state.history = [];
    els.playerCount.value = String(state.elos.length);
    saveUrl();
    render();
  }

  function togglePair(a, b) {
    if (state.revealed || a === b) return;
    var key = pairKey(a, b);
    if (state.locked.has(key)) return;
    if (state.selected.has(key)) {
      state.selected.delete(key);
    } else {
      Array.from(state.selected).forEach(function (selectedKey) {
        var pair = parsePairKey(selectedKey);
        if (pair[0] === a || pair[0] === b || pair[1] === a || pair[1] === b) {
          state.selected.delete(selectedKey);
        }
      });
      state.selected.add(key);
    }
    render();
  }

  function reveal() {
    state.optimal = computeOptimal();
    state.revealed = true;
    render();
  }

  function recordRound() {
    state.history[state.round - 1] = {
      round: state.round,
      selected: copySet(state.selected),
      optimal: copySet(state.optimal),
      selectedTotal: totalFor(state.selected),
      optimalTotal: totalFor(state.optimal)
    };
  }

  function nextRound() {
    recordRound();
    state.selected.forEach(function (key) {
      state.locked.add(key);
    });
    state.round += 1;
    state.selected = new Set();
    state.optimal = new Set();
    state.revealed = false;
    render();
  }

  function showFinal() {
    recordRound();
    state.isFinal = true;
    state.revealed = false;
    state.inspectedRound = state.totalRounds;
    render();
  }

  function statusMessage() {
    if (state.isFinal) {
      return "Resultat efter alla ronder.";
    }
    if (state.revealed) {
      if (state.round >= state.totalRounds) {
        return "Rödmarkerade par ska bort. Gröna par ingår i optimal lösning.";
      }
      return "Rödmarkerade par ska bort. Gröna par ingår i optimal lösning inför nästa rond.";
    }
    return "Målet är att para ihop alla spelare så jämnt som möjligt. Välj par i matrisen tills alla spelare ingår en gång.";
  }

  function cellClass(key, isDiagonal, isLocked) {
    var classes = ["cell"];
    if (isDiagonal) classes.push("diagonal");
    if (isLocked) classes.push("locked");
    if (!isDiagonal && !isLocked && !state.revealed && !state.isFinal) classes.push("clickable");
    if (!state.isFinal && state.selected.has(key)) classes.push("selected");
    if (!state.isFinal && state.revealed && state.selected.has(key) && state.optimal.has(key)) classes.push("unchanged");
    if (!state.isFinal && state.revealed && state.selected.has(key) && !state.optimal.has(key)) classes.push("wrong");
    if (!state.isFinal && state.revealed && !state.selected.has(key) && state.optimal.has(key)) classes.push("missing");
    if (state.isFinal && isInspectedChoice(key) && isInspectedOptimal(key)) classes.push("unchanged");
    if (state.isFinal && isInspectedChoice(key) && !isInspectedOptimal(key)) classes.push("wrong");
    if (state.isFinal && !isInspectedChoice(key) && isInspectedOptimal(key)) classes.push("missing");
    return classes.join(" ");
  }

  function renderCellContent(button, r, c, isDiagonal, isLocked) {
    button.textContent = "";
    if (isDiagonal) return;
    if (!state.isFinal) {
      button.textContent = isLocked ? "·" : String(diff(r, c));
      return;
    }
    button.textContent = String(diff(r, c));
  }

  function renderMatrix() {
    var count = state.elos.length;
    els.matrix.innerHTML = "";
    els.matrix.style.setProperty("--players", count);

    els.matrix.appendChild(div("corner", ""));
    for (var c = 0; c < count; c++) {
      els.matrix.appendChild(div("axis", String((c + 1) % 10)));
    }
    els.matrix.appendChild(div("axis", "Elo"));

    for (var r = 0; r < count; r++) {
      els.matrix.appendChild(div("axis rowAxis", String((r + 1) % 10)));
      for (c = 0; c < count; c++) {
        var key = pairKey(r, c);
        var isDiagonal = r === c;
        var isLocked = !isDiagonal && state.locked.has(key);
        var button = document.createElement("button");
        button.type = "button";
        button.className = cellClass(key, isDiagonal, isLocked);
        button.disabled = isDiagonal || isLocked || state.revealed || state.isFinal;
        renderCellContent(button, r, c, isDiagonal, isLocked);
        button.setAttribute("aria-label", "Spelare " + (r + 1) + " mot " + (c + 1));
        button.dataset.a = String(r);
        button.dataset.b = String(c);
        els.matrix.appendChild(button);
      }
      els.matrix.appendChild(div("elo", String(state.elos[r])));
    }
  }

  function render() {
    var selectedComplete = state.selected.size === state.elos.length / 2;
    var inspected = inspectedHistory();
    els.statusText.textContent = statusMessage();
    els.roundText.textContent = state.isFinal ? state.inspectedRound + "/" + state.totalRounds : state.round + "/" + state.totalRounds;
    els.selectedTotal.textContent = state.isFinal && inspected ? String(inspected.selectedTotal) : String(totalFor(state.selected));
    els.optimalTotal.textContent = state.isFinal && inspected ? String(inspected.optimalTotal) : state.revealed ? String(totalFor(state.optimal)) : "-";
    els.roundSummary.hidden = state.isFinal;
    els.finalResults.hidden = !state.isFinal;
    renderFinalResults();
    els.clearButton.disabled = state.isFinal || state.revealed || state.selected.size === 0;
    els.nextButton.textContent = state.revealed && state.round < state.totalRounds ? "Nästa rond" : "Nästa";
    els.nextButton.disabled = state.isFinal ? true : state.revealed ? false : !selectedComplete;
    if (state.revealed && state.round >= state.totalRounds) {
      els.nextButton.disabled = false;
      els.nextButton.textContent = "Resultat";
    }
    if (state.isFinal) {
      els.nextButton.disabled = true;
      els.nextButton.textContent = "Klart";
    }
    renderMatrix();
  }

  function renderFinalResults() {
    if (!state.isFinal) return;
    var ownTotal = 0;
    var optimalTotal = 0;
    var header = ["<th></th>"];
    var player = ["<th>Mina val</th>"];
    var optimum = ["<th>Optimum</th>"];
    state.history.forEach(function (round) {
      ownTotal += round.selectedTotal;
      optimalTotal += round.optimalTotal;
      var inspected = round.round === state.inspectedRound ? " class=\"inspected\"" : "";
      header.push("<th" + inspected + ">rond " + round.round + "</th>");
      player.push("<td" + inspected + ">" + round.selectedTotal + "</td>");
      optimum.push("<td" + inspected + ">" + round.optimalTotal + "</td>");
    });
    header.push("<th>total</th>");
    player.push("<td>" + ownTotal + "</td>");
    optimum.push("<td>" + optimalTotal + "</td>");
    els.roundResults.innerHTML = "<table class=\"statsTable\"><thead><tr>" +
      header.join("") + "</tr></thead><tbody><tr>" +
      player.join("") + "</tr><tr>" +
      optimum.join("") + "</tr></tbody></table>";
    els.inspectRoundText.textContent = "Rond " + state.inspectedRound;
    els.prevRoundButton.disabled = state.inspectedRound <= 1;
    els.nextRoundButton.disabled = state.inspectedRound >= state.totalRounds;
  }

  function div(className, text) {
    var element = document.createElement("div");
    element.className = className;
    element.textContent = text;
    return element;
  }

  function bindEvents() {
    els.matrix.addEventListener("click", function (event) {
      var target = event.target.closest(".cell");
      if (!target || target.disabled) return;
      togglePair(Number(target.dataset.a), Number(target.dataset.b));
    });

    els.playerCount.addEventListener("change", function () {
      startGame(Number(els.playerCount.value), newSeed());
    });

    els.newGameButton.addEventListener("click", function () {
      startGame(Number(els.playerCount.value), newSeed());
    });

    els.clearButton.addEventListener("click", function () {
      state.selected = new Set();
      render();
    });

    els.prevRoundButton.addEventListener("click", function () {
      if (!state.isFinal || state.inspectedRound <= 1) return;
      state.inspectedRound -= 1;
      render();
    });

    els.nextRoundButton.addEventListener("click", function () {
      if (!state.isFinal || state.inspectedRound >= state.totalRounds) return;
      state.inspectedRound += 1;
      render();
    });

    els.nextButton.addEventListener("click", function () {
      if (!state.revealed) {
        reveal();
      } else if (state.round < state.totalRounds) {
        nextRound();
      } else {
        showFinal();
      }
    });
  }

  initializeSelect();
  bindEvents();
  var urlConfig = readUrlConfig();
  if (urlConfig) {
    startGame(urlConfig.count, urlConfig.seed);
  } else {
    startGame(10, newSeed());
  }
}());
