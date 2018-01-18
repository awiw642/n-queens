// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*`--fix`
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/
    hasRowConflictAt: function(rowIndex) {
      const currentRow = this.get(rowIndex);
      let counter = 0;
      for (let i = 0; i < currentRow.length; i++) {
        if (currentRow[i] === 1) {
          counter++;
        }
      }
      if (counter > 1) {
        return true;
      } else {
        return false;
      }
    },

    hasAnyRowConflicts: function() {
      const boardRows = this.rows();
      for (let i = 0; i < boardRows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    hasColConflictAt: function(colIndex) {
      let sum = 0;
      for (let i = 0; i < this.get('n'); i++) {
        sum += this.get(i)[colIndex];
      }
      return sum > 1 ? true : false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      const boardRows = this.rows();
      for (let i = 0; i < boardRows.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(index) {
      const board = this.rows();
      let sum = 0;
      let x, y, block;
      if (index < 0) {
        x = 0;
        y = index * -1;
      } else {
        x = index;
        y = 0;
      }
      block = board[y][x];
      while (block !== undefined ) {
        sum += block;
        x += 1;
        y += 1;
        if (y < this.get('n') && x < this.get('n')) {
          block = board[y][x];
        } else {
          block = undefined;
        }
      }
      return sum > 1 ? true : false;
    },


    hasAnyMajorDiagonalConflicts: function() {
      for (let i = (this.get('n') - 1) * -1; i < this.get('n'); i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      var size = this.get('n');
      var count = 0;
      var rowIdx = 0;
      var colIdx = minorDiagonalColumnIndexAtFirstRow;

      for ( ; rowIdx < size && colIdx >= 0; rowIdx++, colIdx-- ) {
        if ( colIdx < size ) {
          var row = this.get(rowIdx);
          count += row[colIdx];
        }
      }

      return count > 1;

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {

      var size = this.get('n');

      for ( var i = (size * 2) - 1; i >= 0; i-- ) {
        if ( this.hasMinorDiagonalConflictAt(i) ) {
          return true;
        }
      }

      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
