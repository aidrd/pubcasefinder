let currentPatient
let changedData = {}

function checkBoxRenderer(instance, td) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)

    if (isAllChecked) {
        td.innerHTML = `<input type="checkbox" class="checkbox" checked>`
    }
    else {
        td.innerHTML = `<input type="checkbox" class="checkbox">`
    }

    return td
}

function editRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.innerHTML = `<div class="list-icon list-edit"></div>`
    td.onclick = function() {
        console.log('clicked')
        openModal(value)
    }
}

function removeRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)

    td.innerHTML = `<div class="list-icon list-delete"></div>`
    td.onclick = function() {
        if (confirm('削除してもよろしいでしょうか。')) {
            hot.alter('remove_row', row, 1)
            document.getElementById('row_count').innerHTML = hot.countRows()
        }
    }
}

function multipleRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    let displayValue = value
    if (value) {
        if (typeof value === 'string') {
            value = value.split(',')
        }

        displayValue = value.join('<br>')
    }

    if (prop !== columnKeys.MEDICAL_CHIEF_COMPLAINT) td.classList.add('htDimmed')
    td.innerHTML = displayValue
}

function weightRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    td.innerHTML = getLatest(columnKeys.MEDICAL_BODY_WEIGHT, value)
}

function heightRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    td.innerHTML = getLatest(columnKeys.MEDICAL_BODY_HEIGHT, value)
}

function headRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments)
    td.innerHTML = getLatest(columnKeys.MEDICAL_HEAD_CIRCUMFERENCE, value)
}

function getLatest(type, value) {
    if (!value || value.length < 1) return ''
    return value[value.length - 1][type] || ''
}

function customRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments)
    td.classList.add('custom-cell')
}

Handsontable.renderers.registerRenderer('removeRenderer', removeRenderer)
Handsontable.renderers.registerRenderer('editRenderer', editRenderer)
Handsontable.renderers.registerRenderer('multipleRenderer', multipleRenderer)
Handsontable.renderers.registerRenderer('heightRenderer', heightRenderer)
Handsontable.renderers.registerRenderer('weightRenderer', weightRenderer)
Handsontable.renderers.registerRenderer('headRenderer', headRenderer)
Handsontable.renderers.registerRenderer('customRenderer', customRenderer)