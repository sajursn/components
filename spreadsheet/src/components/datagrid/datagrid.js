import React, { Component } from "react";
import reactDOM from 'react-dom';
import ReactDataGrid from "react-data-grid";
import { Toolbar, Data, Filters } from "react-data-grid-addons";
import { range } from "lodash";
import { basicCalculation } from "../../utilities/utils";
import { Navbar, Nav, Form, FormControl } from "react-bootstrap";
import { faFilter, faSortAmountDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const defaultColumnProperties = {
  sortable: true,
  resizable: true,
  filterable: true,
  width: 120,
};

const defaultParsePaste = (str) =>
  str.split(/\r\n|\n|\r/).map((row) => row.split("\t"));

let newFilters = {};

const selectors = Data.Selectors;
const {
  NumericFilter,
  AutoCompleteFilter,
  MultiSelectFilter,
  SingleSelectFilter,
} = Filters;
const columns = [
  {
    key: "flightno",
    name: "Flight #",
    editable: true,
    filterRenderer: SingleSelectFilter,
  },
  {
    key: "date",
    name: "Date",
    editable: true,
    filterRenderer: SingleSelectFilter,
  },
  {
    key: "segmentfrom",
    name: "Segment From",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "revenue",
    name: "Revenue",
    editable: true,
    filterRenderer: SingleSelectFilter,
  },
  {
    key: "yeild",
    name: "Yeild",
    editable: true,
    filterRenderer: SingleSelectFilter,
  },
  {
    key: "segmentto",
    name: "Segment To",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "flightModel",
    name: "Flight Model",
    editable: true,
    filterRenderer:SingleSelectFilter ,
  },
  {
    key: "bodyType",
    name: "Body Type",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "type",
    name: "Type",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "startTime",
    name: "Start Time",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "endTime",
    name: "End Time",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "status",
    name: "Status",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "additionalStatus",
    name: "Additional Status",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "timeStatus",
    name: "Time Status",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "weightpercentage",
    name: "Weight Percentage",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "weightvalue",
    name: "Weight Value",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "volumepercentage",
    name: "Volume Percentage",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "volumevalue",
    name: "Volume Value",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "uldposition1",
    name: "uldposition1",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "uldvalue1",
    name: "uldvalue1",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "uldposition2",
    name: "uldposition2",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "uldvalue2",
    name: "uldvalue2",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "uldposition3",
    name: "uldposition3",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "uldvalue3",
    name: "uldvalue3",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "uldposition4",
    name: "uldposition4",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "uldvalue4",
    name: "uldvalue4",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },

  { key: "sr", name: "SR", editable: true, filterRenderer: AutoCompleteFilter },
  {
    key: "queuedBookingSR",
    name: "Queued Booking SR",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
  {
    key: "queuedBookingvolume",
    name: "Queued Booking Volume",
    editable: true,
    filterRenderer: AutoCompleteFilter,
  },
].map((c) => ({ ...c, ...defaultColumnProperties }));

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filter:{},rows: this.props.rows, selectedIndexes: [], junk:{},  topLeft: {},
      botRight: {} };
    document.addEventListener("copy", this.handleCopy);
    document.addEventListener("paste", this.handlePaste);
  }

  componentWillUnmount() {
    this.removeAllListeners();
  }

  updateRows = (startIdx, newRows) => {
    this.setState((state) => {
      const rows = state.rows.slice();
      for (let i = 0; i < newRows.length; i++) {
        if (startIdx + i < rows.length) {
          rows[startIdx + i] = { ...rows[startIdx + i], ...newRows[i] };
        }
      }
      return { rows };
    });
  };

  rowGetter = (i) => {
    const { rows } = this.state;
    return rows[i];
  };

  handleCopy = (e) => {
    e.preventDefault();
    const { topLeft, botRight } = this.state;
    const text = range(topLeft.rowIdx, botRight.rowIdx + 1)
      .map((rowIdx) =>
        columns
          .slice(topLeft.colIdx, botRight.colIdx + 1)
          .map((col) => this.rowGetter(rowIdx)[col.key])
          .join("\t")
      )
      .join("\n");
    e.clipboardData.setData("text/plain", text);
  };

  handlePaste = (e) => {
    e.preventDefault();
    const { topLeft } = this.state;
    const newRows = [];
    const pasteData = defaultParsePaste(e.clipboardData.getData("text/plain"));
    pasteData.forEach((row) => {
      const rowData = {};
      // Merge the values from pasting and the keys from the columns
      columns
        .slice(topLeft.colIdx, topLeft.colIdx + row.length)
        .forEach((col, j) => {
          // Create the key-value pair for the row
          rowData[col.key] = row[j];
        });
      // Push the new row to the changes
      newRows.push(rowData);
    });
    this.updateRows(topLeft.rowIdx, newRows);
  };

  setSelection = (args) => {
    this.setState({
      topLeft: {
        rowIdx: args.topLeft.rowIdx,
        colIdx: args.topLeft.idx,
      },
      botRight: {
        rowIdx: args.bottomRight.rowIdx,
        colIdx: args.bottomRight.idx,
      },
    });
  };

  sortRows = (data, sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    this.setState({ rows: [...this.state.rows].sort(comparer) });
    return sortDirection === "NONE" ? data : this.state.rows;
  };

  componentWillReceiveProps(props) {
    this.state = { rows: props.rows };
  }
  onGridRowsUpdated = ({ fromRow, toRow, updated, action }) => {
    updated.yeild = basicCalculation("=sum", 1, 2);
    if (action !== "COPY_PASTE") {
      this.setState((state) => {
        const rows = state.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
          rows[i] = { ...rows[i], ...updated };
        }
        return { rows };
      });
    }
  };

  onRowsSelected = (rows) => {
    this.setState({
      selectedIndexes: this.state.selectedIndexes.concat(
        rows.map((r) => r.rowIdx)
      ),
    });
  };

  onRowsDeselected = (rows) => {
    let rowIndexes = rows.map((r) => r.rowIdx);
    this.setState({
      selectedIndexes: this.state.selectedIndexes.filter(
        (i) => rowIndexes.indexOf(i) === -1
      ),
    });
  };

  handleFilterChange =(value)=>{
    newFilters = { ...value };
    let {junk} = this.state
    if (!(value.filterTerm==null)&& !(value.filterTerm.length<=0)) {
      newFilters[value.column.key] = value;
      junk[value.column.key]=value
    } else if(value.filterTerm==null||value.filterTerm.length<=0) {
      delete newFilters[value.column.key];
      delete junk[value.column.key];
    }
    this.setState({filter:newFilters,junk});
    const data=this.getrows(this.props.rows,junk);
    this.setState({rows:data})
  };
  getrows=(rows, junk)=>{
    if(Object.keys(junk).length<=0){
      junk={}
    }
    const data= selectors.getRows({
      rows: rows,
      filters: junk
    });
    return data;
  }
  getValidFilterValues(rows, columnId) {
    return rows.map(r => r[columnId])
      .filter((item, i, a) => {
        return i === a.indexOf(item);
      });
  }
  sortRows = (data, sortColumn, sortDirection) => {
    const comparer = (a, b) => {
      if (sortDirection === "ASC") {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      } else if (sortDirection === "DESC") {
        return a[sortColumn] < b[sortColumn] ? 1 : -1;
      }
    };
    this.setState({ rows: [...data].sort(comparer) })
    return sortDirection === "NONE" ? data : this.state.rows;
  };

  render() {
    const { rows } = this.state;
    return (
      <div>
        <div
          style={{
            display: "flex",
            margin: "15px 135px 15px 15px",
            alignItems: "center",
            float: "right",
          }}
        >
          <FormControl
            type="text"
            placeholder="Search a screen"
            className="mr-sm-2"
            onChange={this.props.handleChange}
          />
          <FontAwesomeIcon
            style={{
              fontSize: "28px",
              margin: "0px 10px",
              border: "1px solid #ddd",
              padding: "0px 4px",
              color: "#566a81",
            }}
            icon={faFilter}
          />
          <FontAwesomeIcon
            style={{
              fontSize: "28px",
              margin: "0px 10px",
              border: "1px solid #ddd",
              padding: "0px 4px",
              color: "#566a81",
            }}
            icon={faSortAmountDown}
          />
        </div>
        <ReactDataGrid
          style={{fontWeight:"bold"}}
          minHeight={650}
          columns={columns}
          rowGetter={i=>this.state.rows[i]}
          rowsCount={this.state.rows.length}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
          onColumnResize={(idx, width) =>
            console.log(`Column ${idx} has been resized to ${width}`)
          }
          toolbar={<Toolbar enableFilter={true} />}
          onAddFilter={filter => this.handleFilterChange(filter)}
          getValidFilterValues={(columnKey) =>
            getValidFilterValues(this.props.rows, columnKey)
          }
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              indexes: this.state.selectedIndexes,
            },
          }}
          onGridSort={(sortColumn, sortDirection) =>
            this.sortRows(this.props.rows, sortColumn, sortDirection)
          }
          cellRangeSelection={{
            onComplete: this.setSelection,
          }}
        />
      </div>
    );
  }
}
export default Grid;
