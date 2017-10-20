/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var board = new Board({n:n});
  var solution = [];
  var findSolution = function (row, combo) {
    if (row === n) {
      // solution.push(combo);
      return;
    }
    // for loop over the possible combinations
    for (var i = 0; i < n; i++) {
      board.togglePiece(row, i);
      if (!board.hasAnyRooksConflicts()) {
        // debugger;
        solution.push(board.rows()[row]);
        findSolution(row + 1, board.rows()[row]); // board.rows()[row]
      }
      // board.togglePiece(row, i);
    }
      // Toggle a piece like in the countNRooksSolutions
      // if doesn't have any conflict then recurse
        // Recursion
      // Toggle again maybe?
  };
  findSolution(0, []);

  // I think we have to find the single best solution, console log below was provided and says single solution.
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var board = new Board({n:n});

  var solutionCount = 0; //fixme
  var search = function(row) {
    if(row === n) {
      solutionCount++;
      return;
    }
    for (var i = 0; i < n; i++) {
      board.togglePiece(row, i);
      if(!board.hasAnyRooksConflicts()) {
        search(row + 1);
      }
      board.togglePiece(row, i);
    }
  };
  search(0);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var board = new Board({n:n});

  var solutionCount = 0; //fixme
  var search = function(row) {
    if(row === n) {
      solutionCount++;
      return;
    }
    for (var i = 0; i < n; i++) {
      board.togglePiece(row, i);
      if(!board.hasAnyQueensConflicts()) {
        search(row + 1);
      }
      board.togglePiece(row, i);
    }
  };
  search(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
