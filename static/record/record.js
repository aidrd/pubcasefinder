let hot, exportPlugin

let defaultColumns = ['診断状況', '主訴', '確定診断', '臨床診断', '年齢', '性別', 'グループ名', '続柄', '家族ID', '患者ID']
let actions = ['REMOVE', 'EDIT']

// headers = columns (settings - type, options, renderer, etc) - COLUMNS!!
// colHeaders = headers
let colHeaders = [], columns = []
let exisitingColumns = [], hiddenColumns = [], customColumns = []

let dataSchema = {}, dataColumns = {}