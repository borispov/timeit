// UTILS 
const isZero            = i => i === 0 ? true : false
const isEq              = a => b => a === b
const addDayToDate      = date => date.setDate(date.getDate() + 1)
const formatToDDMMYY    = date => date.toLocaleString('he-il').split(',')[0]
const formatToDDMM      = date => date.toLocaleString('he-il').split(',')[0]
const stripYear         = dateStr => dateStr.split('.').slice(0, -1).join('/')
const extractDay        = date => dayNames[new Date(date).getDay()]
const dayNames          = ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳", "שבת"]
const monthNames        = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const isNumkey = code => code >= 48 && code <= 57 || code === 8
const isNOE             = v => v === '' || v === "" || v === null || v === 'undefined' || v === undefined
const addClass          = el => style   => el.classList.add(style)
const addClasses        = styles => el  => styles.map(style => addClass(el)(style))
const addAttributes     = el => atts    => atts.map(att => el.setAttribute(att[0], att[1]))
const createEl          = node => document.createElement(node)
const createDiv         = () => createEl('div')
const setHTML           = v => el => el.innerHTML = v
const getSel            = sel => document.querySelector(sel)
const addYearToDate     = dateStr => dateStr + '/' + new Date().getFullYear()


// SELECTORS
const monthEl           = document.getElementById('view-month')
const root              = document.getElementById('root')
const submitBtn         = document.querySelector("[data-type='submit-btn']")
const preSubmitBtn      = document.querySelector("[data-type='pre-submit-btn']")
const beforeSubDiv      = document.querySelector("[data-type='before-sub']")
const patientName       = document.querySelector("#patientName")
const employeeName      = document.querySelector("#employeeName")

// VARIABLES - CONSTANTS
const localhost     = 'http://localhost:3030'
const API           = 'https://nathan.borisky.me'
let monthElValue    = monthEl.value


//  -- METHODS! --
const deleteEl = sel => getSel(sel) && getSel(sel).remove()

const addWarningDiv = appendTo => {
  const warning = createDiv()
  setHTML("יש להזין שם העובד ושם המטופל!")(warning)
  addClasses(['alert', 'lead', 'alert-warning'])(warning)
  warning.setAttribute('role', 'alert')
  appendTo.prepend(warning)
  setTimeout(() => warning.remove(), 9000)
}



// Generate Dates For Requested Month -- recursive
const generateDateRange = date => month => initialList => {
  if (!isEq (month) (date.getMonth())) return initialList 
  const pair = [ stripYear(formatToDDMMYY(date)), extractDay(date) ]
  const newDateList = [ ...initialList, pair ]
  const nextDate = new Date(addDayToDate(date))
  return generateDateRange(nextDate)(month)(newDateList)
}

const createDatesList = month => year => generateDateRange(new Date(year, month, 1))(month)([])
const getDatesInMonth = (monthToShow = monthElValue) => {
  const monthToFill = monthNames.indexOf(monthToShow)
  return createDatesList(monthToFill)(2020)
}

// Delete a table before drawing new table for different MONTH
function clearTable() {
  const t = document.getElementById('initTable')
  patientName.value = ''
  root.removeChild(t)
}

// combine creating a table and seeding it with data. 
function drawTable(dates) {
  createTable()
  dates.map(date => createRow(date))
  setTimeout(
    () => {
      const tableSelects = document.querySelectorAll('select')
      tableSelects.forEach(a => a.classList.add('custom-select'))
      setTimeout( () => { addTimeListeners() }, 100)
    }, 0)
}


// Table Headers
// exlucded Notes Column For Now
const arrHead = ["יום", "התחלה", "סיום", "הערות"]

// Create Empty Table
function createTable() {
  const initTable = document.createElement('table')
  initTable.setAttribute('id', 'initTable')
  addClasses(["table", "table-dark", "table-striped", "table-bordered", "mt-5"])(initTable)
  const tr = initTable.insertRow(-1)

  // can transform this to something declarative??
  for (var h = 0; h < arrHead.length; h++) {
      var th = document.createElement('th')
      addClass(th)('table-th')
      th.innerHTML = arrHead[h]
      tr.appendChild(th)
  }
  root.appendChild(initTable)
}

function createRow(date) {
  const table = document.getElementById('initTable')
  const len = table.rows.length
  let tr = table.insertRow(len)
  tr = table.insertRow(len)

  arrHead.map((cell, i) => {
    let td = document.createElement('bg-gradient-secondary')
    td.classList.add('table-td')
    td = tr.insertCell(i)
    const [ddmm, weekday] = date
    if (i === 0) {
      // td.innerHTML = `${stripYear(ddmm)}<br>${weekday}`
      td.innerHTML = `${ddmm}<br>${weekday}`
    } 
    else if ( i === arrHead.length - 1) {
        td.textContent = ""
        td.setAttribute('contenteditable', 'true')
    } 
    else {
      const inputAttributes = [ 
          ["name", "datetime"], 
          ["placeholder", "__:__"], 
          ["autocomplete", "off"], 
          ["type", "text"], 
          ["data-format", "HH:mm"], 
          ["data-template", "HH : mm"]
      ]
      if (weekday === 'שבת') return
      const inputEl = document.createElement('input')
      addAttributes(inputEl)(inputAttributes)
      addClasses(['timeInput', 'form-control'])(inputEl)
      // Some jQMagic.. Eww.
      $(function(){
        $('.timeInput').combodate({
          firstItem: 'name', //show 'hour' and 'minute' string at first item of dropdown
          minuteStep: 5
        });  
      });
      inputEl.addEventListener('onfocus', () => this.setSelectionRange(0, this.value.length))
      if ( i === 1 ) { inputEl.setAttribute('data-name', 'Start') }
      if ( i === 2 ) { inputEl.setAttribute('data-name', 'End') }
      td.appendChild(inputEl)
    }
  })

}

// POPULATE DATA
function extractTd(col, i) {
  if (i === 0) { 
    return addYearToDate(col.innerText.split('\n')[0])
  }
  if (col.childElementCount) {
    let value = col.firstChild && col.firstChild.textContent
    return value === "שעה" || value === "דקות" ? "" : col.firstChild.value
  } else {
    return col.textContent
  }
}

// The Core Is Taken from Stackoverflow. Would like to change it to more declarative code. but, not a priority right now.
function getTableData(selector) {
  const tableData = []
  const rows = document.querySelectorAll(selector)

  for (const row of rows) {
    const rowData = [];
    for (const [index, column] of row.querySelectorAll("th, td").entries()) {
      rowData.push(extractTd(column, index));
    }
    tableData.push(rowData.join(","));
  }
  return "" + tableData.join("\n")
}

// Submit Helpers
const fetchRequest = url => async (data) => await axios.post(url, data)
const requestToMailService = fetchRequest(API)

const getNames = () => [employeeName.value, patientName.value]

function preSubmit() {
  const [employeeName, patientName] = getNames()

  if (isNOE(employeeName) || isNOE(patientName)) {
    deleteEl("[role='alert']")
    addWarningDiv(beforeSubDiv)
    return
  }

  $("#submitModal").modal()

}


async function handleSubmit() {
  const filedata = getTableData("table tr")
  const trimmed = filedata.split("\n").filter(s=>s.length).join("\n")

  const [employeeName, patientName] = getNames()
  const filename = `${employeeName}--${patientName} month-${monthEl.value}.csv`

  if (isNOE(employeeName) || isNOE(patientName)) {
    deleteEl("[role='alert']")
    addWarningDiv(beforeSubDiv)
    return
  }

  const jsonData = { 
    filedata: trimmed,
    filename,
    employeeName,
    patientName
  }

  const response = await requestToMailService(jsonData)

  if (response.status === 200) {
    let dates = getDatesInMonth()
    clearTable()
    drawTable(dates)
    $("#submitModal").modal("hide")
    $("#successModal").modal()
    return
  }
  // POPUP THE ERROR MODAL
  // DOES NOT WORK.
  $("#submitModal").modal("hide")
  $("#errorModal").modal()
 
}



// _______ EVENT LISTENERS ________
function addTimeListeners() {
  document.querySelectorAll('.hour')
    .forEach(a => a.addEventListener('change', () => {
      if (!a.value) return a.parentElement.lastChild.value = a.value
      a.parentElement.lastChild.value = 0
    }))
}


document.addEventListener("DOMContentLoaded", function() {
  let dates = getDatesInMonth()
  drawTable(dates)
})

monthEl.addEventListener('change', e => {
  let dates = getDatesInMonth(monthElValue)
  clearTable()
  drawTable(dates)
})

submitBtn.addEventListener("click", handleSubmit)
preSubmitBtn.addEventListener("click", preSubmit)
