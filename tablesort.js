/*
 * tabular.js
 *
 * A standalone library for sorting HTML tables
 *
 * Author: Paul Stuart
 * License: MIT
 *
 */


/*
 * Make a table sortable by clicking on the column header
 */

var sortable = function(id) {
    var table = document.getElementById(id);
    var fn = tableSort.bind(table);
    var head = table.tHead.rows[0]
    for (var i = 0; i < head.cells.length; i++) {
        head.cells[i].addEventListener("click", function() {
            fn(this.cellIndex);
        }, false);
    }
}

/*
 * Sort a table by the column specified
 * Sorting is currently either numeric or string based
 * (it could be easily extended to sort by date or others)
 *
 * applies class "sort_arrow" to span showing the sort direction
 * style as you see fit
 */

var tableSort = function(col) {
    var up = "&#x25B2;";
    var down = "&#x25BC;";
    var invert = false;

    // clear prior arrow
    if (typeof this.lastColumn != 'undefined') {
        var prior = this.tHead.rows[0].cells[this.lastColumn].innerHTML;
        this.tHead.rows[0].cells[this.lastColumn].innerHTML = prior.replace(/<span.*span>/, "");
    }

    if (this.lastColumn == col) {
        if (typeof this.inverted == 'undefined') {
            invert = (this.lastColumn == col);
        } else {
            invert = ! this.inverted;
        }
    }
    var arrow = invert ? up : down;
    this.tHead.rows[0].cells[col].innerHTML += '<span class="sort_arrow">&nbsp;' + arrow + "</span>";

    var intcomp = function(a, b) {
        var one = this.rows[a].cells[col].innerHTML;
        var two = this.rows[b].cells[col].innerHTML;
        return invert ? two - one : one - two ;
    }
    var strcomp = function(a, b) {
        var one = this.rows[a].cells[col].innerHTML;
        var two = this.rows[b].cells[col].innerHTML;
        return invert ? two.localeCompare(one) : one.localeCompare(two);
    }

    var headCount = this.tHead.rows.length;
    var kind = this.rows[headCount + 1].cells[col].innerHTML;
    var comp;
    if (Number(kind) === kind) {
        comp = intcomp.bind(this);
    } else {
        comp = strcomp.bind(this);
    }

    // create proxy array to sort table
    var proxy = new Array(this.rows.length - headCount);

    // adjust for offset by headCount rows
    for (var i = 0; i < proxy.length; i++) {
        proxy[i]=i + headCount;
    }
    proxy.sort(comp);

    // add new body to copy our rows to
    this.appendChild(document.createElement('tbody'))

    // copy rows in sorted order
    for (var i = 0; i < proxy.length; i++) {
        var n = this.rows[proxy[i]].cloneNode(true);
        this.tBodies[1].appendChild(n);
    }

    // delete original unsorted table
    this.tBodies[0].remove();

    // save settings to know if to invert sort order
    this.lastColumn = col;
    this.inverted = invert;
}

