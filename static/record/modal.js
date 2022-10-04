function openModal(patientId) {
    $('body').append('<div class="modal_bg"></div>');
    $('.modal_bg').fadeIn();

    var modal = '#modal-karte';
    modalReset()

    modalResize();
    populateOptions('group_options')
    populateOptions('family_options')

    document.querySelector(`.tab-wrap *[name="groupID"]`).onclick = function () {
        document.getElementById('group_options').style.display = 'block'
    }

    // populateOptions('related_to')
    inputValues()

    $(modal).fadeIn();

    // $('.modal_bg, .modal-close, .modal-save').off().click(function (e) {
    $('.modal-close, .modal-copy').off().click(function (e) {
        editTable($(this).hasClass('modal-close'))

        if ($(this).hasClass('modal-copy')) copyPatient()

        $('.modal_box').fadeOut();
        $('.modal_bg').fadeOut('slow', function () {
            $('.modal_bg').remove();
        });

        bodyData = {}
        bodyTable()
    });

    $('.modal-phenopackets').off().click(function (e) {
        generatePhenopackets()
    });

    $(window).on('resize', function () {
        modalResize();
    });


    function modalResize() {
        var w = $(window).width();
        var h = $(window).height();

        var x = (w - $(modal).outerWidth(true)) / 2;
        var y = (h - $(modal).outerHeight(true)) / 2;

        $(modal).css({ 'left': x + 'px', 'top': y + 'px' });
    }

    function modalReset() {
        $(`.tab-wrap input[type="text"], .tab-wrap textarea, .tab-wrap select`).val('')
        $('.tab-wrap input:radio').prop('checked', false)
        $('#death').parent().hide()
        $('input[name="allergies-list"]').hide()
        $('input[name="drinking-list"]').hide()
        $('input[name="smoking-list"]').hide()
        document.querySelector('.tab-btn').click()
        dateOptions('birth')
        dateOptions('death')
    }

    function dateOptions(type) {
        var optionLoop, this_month, this_year, today
        today = new Date()
        this_year = today.getFullYear()
        this_month = today.getMonth() + 1

        optionLoop = function (start, end, id) {
            let opt = `<option value="0" hidden>- ${end === 12 ? '月' : '年'}を選択 -</option>`
 
            if (end === 12) {
                for (let i = start; i <= end; i++) {
                    let display = i
                    let value = i
                    let temp = i
    
                    if (temp % 10 === 0 && end !== 12) display = `${i}s`
    
                    opt += `<option value="${value.toString().padStart(2, '0')}">${display}</option>`
                }
            } else {
                for (let i = end; i >= start; i--) {
                    let display = i
                    let value = i
                    let temp = i
    
                    opt += `<option value="${value.toString().padStart(2, '0')}" ${temp % 10 === 0 ? 'disabled' : ''}>${display}</option>`

                    if (temp % 10 === 0) opt += `<option value="${value.toString().padStart(2, '0')}">${display}s</option>`
                }
            }

            return document.querySelector(`.tab-wrap *[name="${id}"]`).innerHTML = opt
        }

        optionLoop(1900, this_year, `${type}_year`)
        optionLoop(1, 12, `${type}_month`)
    }

    function populateOptions(element) {
        let parent = document.getElementById(element)
        if (!parent) return

        parent.innerHTML = ''

        // let data = element === 'group_options' ? structuredClone(groupOptions) : structuredClone(patientOptions)
        let data = element === 'group_options' ? JSON.parse(JSON.stringify(groupOptions)) : JSON.parse(JSON.stringify(familyOptions))

        let firstOption = element === 'group_options' ? '- 登録済みグループ名 -' : '- 登録済み家族ID -'
        // data.unshift('- 登録済みグループ名 -')
        data.unshift(firstOption)

        data.forEach(d => {
            let option = document.createElement('option')
            option.value = d
            option.innerText = d
            parent.appendChild(option)
        })

        // parent.onchange = function() {
        //     console.log('changed')
        //     if (element === 'group_options') {
        //         document.querySelector(`.tab-wrap *[name="groupID"]`).value = parent.options[parent.selectedIndex].value
        //     } else {
        //         document.querySelector(`.tab-wrap *[name="FamilyID"]`).value = parent.options[parent.selectedIndex].value
        //     }
        //     parent.style.display = 'none'
        // }
    }

    function inputValues() {
        let patientData = {}
        let PCFNo = ''
        if (patientId) {
            patientData = contentData.filter(d => { return d.PCFNo == patientId })[0]
            currentPatient = patientData['PCFNo']
            PCFNo = patientData['PCFNo']
        } else {
            let d = new Date()
            PCFNo = `P${d.getFullYear()}${d.getMonth()+1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`
            let num = hot.countRows() + 1
            document.querySelector(`.tab-wrap *[name="patientID"]`).value = `P${num.toString().padStart(7, 0)}`        
        }

        document.getElementById('PCFNo').nextElementSibling.innerHTML = PCFNo

        for (let [key, value] of Object.entries(columns)) {
            value.forEach(v => {
                let dataKey, value
                switch (v.dataKey) {
                    case 'birth':
                        dataKey = 'birth_year'
                        value = patientData['生年月']
                        break
                    case 'death':
                        dataKey = 'death_year'
                        value = patientData['没年月']
                        break
                    default:
                        dataKey = v.dataKey
                        value = patientData[v.columnName]
                        break
                }

                let element = document.querySelector(`.tab-wrap *[name="${dataKey}"]`)
                if (!element) return

                let radioInput = $(`.tab-wrap input[name="${dataKey}"]`)

                if (dataKey === 'lifestatus') {
                    let parent = $('#death').parent()
                    if (value === '故人') {
                        parent.show()
                    } else {
                        parent.hide()
                    }

                    radioInput.on('click change', () => {
                        let radioValue = radioInput.filter(':checked').val()
                        if (radioValue === '故人') {
                            parent.show()
                        } else {
                            parent.hide()
                            onchange('没年月', '')
                        }
                    })
                } else if (dataKey === 'birth_year' || dataKey === 'death_year') {
                    let monthKey = dataKey === 'birth_year' ? 'birth_month' : 'death_month'
                    let date = value ? value.split('/') : ['']
                    let yearValue = date[0]
                    if (yearValue) element.value = yearValue
                    element.onchange = function () {
                        onchange(dataKey === 'birth_year' ? '生年月' : '没年月')

                        if (dataKey === 'birth_year') {
                            let age = getAge()
                            document.querySelector(`.tab-wrap *[name="age"]`).value = age
                            onchange('年齢', age)
                        }
                    }

                    let monthElement = document.querySelector(`.tab-wrap *[name="${monthKey}"]`)
                    let monthValue = date[1]
                    if (monthValue) monthElement.value = monthValue
                    monthElement.onchange = function () {
                        onchange(dataKey === 'birth_year' ? '生年月' : '没年月')

                        if (dataKey === 'birth_year') {
                            let age = getAge()
                            document.querySelector(`.tab-wrap *[name="age"]`).value = age
                            onchange('年齢', age)
                        }
                    }

                    function getAge() {
                        let d = new Date()
                        let age
                        let year = document.querySelector(`.tab-wrap *[name="birth_year"]`).value
                        let month = document.querySelector(`.tab-wrap *[name="birth_month"]`).value

                        if (!month) {
                            age = d.getFullYear() - year
                        } else if (month && year) {
                            if (d.getMonth() >= month) {
                                age = d.getFullYear() - year
                            } else {
                                age = d.getFullYear() - year - 1
                            }
                        }

                        return age || ''
                    }

                    return
                } else if (dataKey === 'groupID') {
                    document.getElementById('group_options').onchange = function(e) {
                        onchange('グループ名', e.target.value)
                    }
                } else if (dataKey === 'FamilyID') {
                    document.getElementById('family_options').onchange = function(e) {
                        onchange('家族ID', e.target.value)
                    }
                }

                if (['allergies', 'drinking', 'smoking'].includes(dataKey)) {
                    $(`.tab-wrap input[name="${dataKey}"][value="${value ? '有' : '無'}"]`).prop('checked', true)

                    let textInput = $(`.tab-wrap input[name="${dataKey}-list"]`)

                    if (value) {
                        textInput.show()
                        textInput.val(value)
                    }

                    radioInput.on('click change', () => {
                        let radioValue = radioInput.filter(':checked').val()
                        if (radioValue === '無') {
                            textInput.hide()
                            onchange(v.columnName, '')
                        } else {
                            textInput.show()
                            textInput.on('change', () => {
                                onchange(v.columnName, textInput.val())
                            })
                        }
                    })

                    return
                }

                element.onchange = function (e) {
                    onchange(v.columnName, e.target.value)
                }

                let type = element.type
                if (type === 'radio') {
                    $(`.tab-wrap input[name="${dataKey}"]`).on('click change', (e) => {
                        onchange(v.columnName, $(`.tab-wrap input[name="${dataKey}"]:checked`).val())
                    })
                }

                if (!value) return

                if (type === 'radio') {
                    $(`.tab-wrap input[name="${dataKey}"][value="${value}"]`).prop('checked', true)
                } else {
                    element.value = value
                }
            })
        }

        let dateKey = ['生年月', '没年月']

        function onchange (key, value, element) {
            if (dateKey.includes(key)) {
                let pre = key === '生年月' ? 'birth' : 'death'
                if (value === '') {
                    value = ''
                } else {
                    value = `${document.querySelector(`.tab-wrap *[name="${pre}_year"]`).value}/${document.querySelector(`.tab-wrap *[name="${pre}_month"]`).value}`
                }
            }
            changedData[key] = value
        }
    }
}

function populateGroups() {
    let gCount = document.getElementById('group-count')
    gCount.innerHTML = `${groupOptions.length} Groups`

    let table = document.getElementById('content-groups-table')
    table.innerHTML = ''
    
    const groups = contentData.reduce((groups, item) => {
        const group = (groups[item['グループID']] || [])
        group.push(item)
        groups[item['グループID']] = group
        return groups
    }, {})

    for (let [key, value] of Object.entries(groups)) {
        let tr = document.createElement('tr')
        table.appendChild(tr)

        let th = document.createElement('th')
        th.innerHTML = `<h5>${key}<span>[${value.length}]</span></h5>`
        tr.appendChild(th)

        value.forEach(v => {
            let td = document.createElement('td')
            td.id = v.PCFNo
            td.innerHTML =
                `<i class="material-icons-outlined">drive_file_rename_outline</i>
                <i class="material-icons-outlined">delete</i>
                <span>${v['患者ID']}</span>`
            tr.appendChild(td)
        })
    }
}

function generatePhenopackets() {
    let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]    
    if (!patientData) return

    let vitalStatus = {
        status: translate(patientData['状態'])
    }

    if (patientData['状態'] === '故人') {
        vitalStatus.timeOfDeath = {
            timestamp: patientData['没年月']
        }
    }

    let phenopacket = {
        phenopacket: {
            id: patientData['グループ名'] || '',
            subject: {
                id: currentPatient,
                sex: translate(patientData['性別']),
                dateOfBirth: patientData['生年月'],
                vitalStatus: vitalStatus
            }
        }
    }

    jsonToYaml()

    function jsonToYaml() {
        let jsonString = JSON.stringify(phenopacket)
        exportFile('yaml', YAML.parse(jsonString))
    }

    function exportFile(type, file) {
        let a = document.createElement('a')
        a.download = `patients_${Date.now()}.${type}`
        a.style.visibility = 'hidden'
    
        let data = `text/yaml;charset=utf-8,` +
            `${encodeURIComponent(YAML.stringify(file, 10))}`
        a.href = `data:${data}`
    
        document.body.appendChild(a)
        a.click()
        a.remove()
    }
}

let dictionary = {
    '男性': 'MALE',
    '女性': 'FEMALE',
    '不明': 'UNKNOWN_STATUS',
    '生存': 'ALIVE',
    '故人': 'DECEASED'
}

function translate(word) {
    if (!word) return ''
    return dictionary[word]
}

function copyPatient() {
    let patientId = document.getElementById('PCFNo').nextElementSibling.innerHTML
    let patientData = contentData.filter(d => { return d.PCFNo == patientId })[0]
    if (!patientData) return

    let temp = JSON.parse(JSON.stringify(patientData))
    delete temp.PCFNo

    addRow(temp)
}