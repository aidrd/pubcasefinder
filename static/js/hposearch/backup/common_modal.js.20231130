$('.modal_open').click(() => {
    console.log('hello')
    openModal(false)
})

$('#nav-info').click(() => {
    openInfo()
})

$('#nav-menu').click(() => {
    closeKarteModal()
    $('.common-menu').toggleClass('dropdown-menu-open')
})

$('#nav-service').click(() => {
    closeKarteModal()
    $('.common-service').toggleClass('dropdown-menu-open')
})

$('#nav-language').click(() => {
    closeKarteModal()
    $('#dropdown-language').toggleClass('dropdown-menu-open')
})

$('#menu-save').click((e) => {
    closeKarteModal();
    if (e.target.closest('.save-panel')) return;
    $('.save-panel').toggleClass('save-panel-open');
    $('#menu-save .popup-bg-cover').addClass('active');
});

$('#menu-save .popup-bg-cover').click(() => {
    $('.save-panel').removeClass('save-panel-open');
    $('#menu-save .popup-bg-cover').removeClass('active');
});

$(document).mouseup((e) => {
    //console.log('clicked', e.target)

    const container = $('.save-panel');
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass('save-panel-open');
        $('#menu-save .popup-bg-cover').removeClass('active');
    }
});


$('.nav-list a').on('click', closeKarteModal)

function openModal(patientId) {
    console.log('openModal')
    var modal = '#modal-karte'
    toReset = true
    const minimumYearOfBirth = 1800;
    modalReset()

    modalResize()
    populateGroupFamilyOptions('group_options')
    populateGroupFamilyOptions('family_options')

    inputValues()

    $(modal).fadeIn()


    geneTable()

    $('.modal-close, .modal-copy').off().click(function (e) {
        editTable($(this).hasClass('modal-close'))
        // Avoid bugs when modal-close is double clicked
        if ($(this).hasClass('modal-close'))
            $(this).off()

        if ($(this).hasClass('modal-copy')) copyPatient()

        $('.modal_box').fadeOut()

        bodyData = []
        bodyTable()
    })
    //This will be activated again when we go live.
    // $('.modal-phenopackets').off().click(function (e) {
    //     generatePhenopackets()
    // })

    $(window).on('resize', function () {
        modalResize()
    })


    function modalResize() {
        var w = $(window).width()
        var h = $(window).height()

        var x = (w - $(modal).outerWidth(true)) / 2
        var y = (h - $(modal).outerHeight(true)) / 2

        $(modal).css({ 'left': x + 'px', 'top': y + 'px' })
    }

    function modalReset() {
        $(`.tab-wrap input[type="text"], .tab-wrap input[type="number"], .tab-wrap textarea, .tab-wrap select`).val('')
        $('.tab-wrap input:radio').prop('checked', false)
        $(`#${columnKeys.CASE_DEATH}`).parent().hide()
        $(`input[name="${columnKeys.MEDICAL_ALLERGIES}-list"]`).hide() // allergies
        $(`input[name="${columnKeys.MEDICAL_DRINKING}-list"]`).hide() // drinking
        $(`input[name="${columnKeys.MEDICAL_SMOKING}-list"]`).hide() // smoking
        document.querySelector('.tab-btn').click()
        dateOptions(columnKeys.CASE_BIRTH)
        dateOptions(columnKeys.CASE_AGE, true, false)
        dateOptions(columnKeys.CASE_DEATH)
        dateOptions(columnKeys.CASE_EXAMINATION_DAY, true)
        dateOptions(columnKeys.MEDICAL_AGE_ONSET, true, false)

        // For age
        setOptionsForAge(columnKeys.CASE_AGE)
        setOptionsForAge(columnKeys.MEDICAL_AGE_ONSET)

        // add by hzhang@bits start
        phenotypeInfo_reset()
        // add by hzhang@bits end
    }

    function setOptionsForAge(columnId) {
        let parent = document.querySelector(`.tab-wrap`);
        // For month
        let options = `<option value="-">${translate('select-age-month')}</option>`;
        for (let i = 0; i <= 11; i++) {
            options += `<option value="${i}">${i}</option>`;
        }
        // parent.querySelector(`*[name="${columnKeys.CASE_AGE}_month"]`).innerHTML = options;
        parent.querySelector(`*[name="${columnId}_month"]`).innerHTML = options;

        // For day
        // parent.querySelector(`*[name="${columnKeys.CASE_AGE}_day"]`).innerHTML = createDayOptions();
        parent.querySelector(`*[name="${columnId}_day"]`).innerHTML = createDayOptions(false);
    }


    function dateOptions(type, includeDay = false, padZero = true) {
        let this_month, this_year, today
        today = new Date()
        this_year = today.getFullYear()
        this_month = today.getMonth() + 1

        createYearOptions(minimumYearOfBirth, this_year, `${type}_year`)
        createMonthOptions(1, 12, `${type}_month`, padZero)
        if (includeDay)
            document.querySelector(`.tab-wrap *[name="${type}_day"]`).innerHTML = createDayOptions(padZero);
    }

    function createYearOptions(startYear, endYear, id) {
        startYear = parseInt(startYear) || minimumYearOfBirth
        endYear = parseInt(endYear)
        let opt = `<option value="-">${translate('select-year')}</option>`

        for (let i = endYear; i >= startYear; i--) {
            opt += `<option value="${i.toString()}"}>${i}</option>`
        }

        return document.querySelector(`.tab-wrap *[name="${id}"]`).innerHTML = opt
    }

    function createMonthOptions(startMonth, endMonth, id, padZero = true) {
        startMonth = parseInt(startMonth) || 1
        endMonth = parseInt(endMonth)
        let opt = `<option value="-">${translate('select-month')}</option>`

        for (let i = startMonth; i <= endMonth; i++) {
            let display = i
            let temp = i

            // if (temp % 10 === 0 && end !== 12) display = `${i}s`

            opt += `<option value="${padZero ? i.toString().padStart(2, '0') : i}">${display}</option>`
        }

        return document.querySelector(`.tab-wrap *[name="${id}"]`).innerHTML = opt
    }

    function createDayOptions(padZero = true) {
        let options = `<option value="-">${translate('select-day')}</option>`;
        for (let i = 1; i <= 31; i++) {
            options += `<option value="${padZero ? i.toString().padStart(2, '0') : i.toString()}">${i}</option>`;
        }
        return options;
    }

    function populateGroupFamilyOptions(element) {
        let parent = document.getElementById(element)
        if (!parent) return

        parent.innerHTML = ''
        let data = element === 'group_options' ? JSON.parse(JSON.stringify(groupOptions)) : JSON.parse(JSON.stringify(familyOptions))

        let firstOption = element === 'group_options' ? translate('select-group') : translate('select-family')
        data.unshift(firstOption)

        data.forEach(d => {
            let option = document.createElement('option')
            option.value = d
            option.innerText = d
            parent.appendChild(option)
        })
    }

    function inputValues() {
        let patientData = {}
        let PCFNo = ''
        if (patientId) {
            patientData = contentData.filter(d => { return d.PCFNo == patientId })[0]
            currentPatient = patientData['PCFNo']
            PCFNo = patientData['PCFNo']
        } else {
            addRow()
            patientData = contentData[contentData.length - 1]
            currentPatient = patientData['PCFNo']
            PCFNo = patientData['PCFNo']
        }

        document.getElementById('PCFNo').nextElementSibling.innerHTML = PCFNo

        categories.forEach(category => {
            // modified by hzhang@bits start
            if (category.categoryId === columnKeys.PHENOTYPE_INFO) {
                phenotypeInfo_inputValues(patientData);
                return;
            }
            // modified by hzhang@bits end

            category.columns.forEach(c => {
                let value, colId = c.columnId
                switch (colId) {
                    case columnKeys.CASE_BIRTH:
                    case columnKeys.CASE_DEATH:
                    case columnKeys.CASE_EXAMINATION_DAY:
                    case columnKeys.CASE_AGE:
                    case columnKeys.MEDICAL_AGE_ONSET:
                        value = patientData[colId]
                        colId = `${colId}_year`
                        break
                    default:
                        value = patientData[colId]
                        if (c.options) {
                            value = getDataDisplayOption(c.options, value, 'dataValue')
                        }
                        break
                }

                let element = document.querySelector(`.tab-wrap *[name="${colId}"]`)
                if (!element) return

                if (colId === columnKeys.CASE_LIFE_STATUS) {
                    let parent = $(`#${columnKeys.CASE_DEATH}`).parent()
                    showHideDeathDate(parent, 'deceased')
                } else if (colId === `${columnKeys.CASE_EXAMINATION_DAY}_year` || colId === `${columnKeys.CASE_DEATH}_year`) {
                    let monthId = colId === `${columnKeys.CASE_EXAMINATION_DAY}_year` ? `${columnKeys.CASE_EXAMINATION_DAY}_month` : `${columnKeys.CASE_DEATH}_month`
                    let date = value ? value.toString().split('/') : ['']
                    let yearValue = date[0]
                    if (yearValue) element.value = yearValue
                    element.onchange = function () {
                        onchange(c.columnId)
                    }

                    let monthElement = document.querySelector(`.tab-wrap *[name="${monthId}"]`)
                    let monthValue = date[1]
                    if (monthValue) monthElement.value = monthValue
                    monthElement.onchange = function () {
                        onchange(c.columnId)
                    }
                    let dayElement = document.querySelector(`.tab-wrap *[name="${columnKeys.CASE_EXAMINATION_DAY}_day"]`)
                    let dayValue = date[2]
                    if (dayValue) dayElement.value = dayValue
                    dayElement.onchange = function () {
                        onchange(c.columnId)
                    }
                    return
                } else if (colId === `${columnKeys.CASE_BIRTH}_year` || colId === `${columnKeys.CASE_DEATH}_year`) {
                    let monthId = colId === `${columnKeys.CASE_BIRTH}_year` ? `${columnKeys.CASE_BIRTH}_month` : `${columnKeys.CASE_DEATH}_month`
                    let date = value ? value.split('/') : ['']
                    let yearValue = date[0]
                    if (yearValue) element.value = yearValue
                    element.onchange = function () {
                        onchange(colId === `${columnKeys.CASE_BIRTH}_year` ? columnKeys.CASE_BIRTH : columnKeys.CASE_DEATH)

                        if (colId === `${columnKeys.CASE_BIRTH}_year`) {
                            changeDeathOptions('year')
                        } else if (colId === `${columnKeys.CASE_DEATH}_year`) {
                            changeDeathOptions('month')
                        }
                    }

                    let monthElement = document.querySelector(`.tab-wrap *[name="${monthId}"]`)
                    let monthValue = date[1]
                    if (monthValue) monthElement.value = monthValue
                    monthElement.onchange = function () {
                        onchange(colId === `${columnKeys.CASE_BIRTH}_year` ? columnKeys.CASE_BIRTH : columnKeys.CASE_DEATH)
                        if (colId === `${columnKeys.CASE_BIRTH}_year`) {
                            changeDeathOptions('month')
                        }
                    }

                    changeDeathOptions('year')
                    changeDeathOptions('month')

                    function changeDeathOptions(type) {
                        let d = new Date()

                        let birthYear = document.querySelector(`.tab-wrap *[name="${columnKeys.CASE_BIRTH}_year"]`).value
                        let birthMonth = document.querySelector(`.tab-wrap *[name="${columnKeys.CASE_BIRTH}_month"]`).value

                        let deathYear = document.querySelector(`.tab-wrap *[name="${columnKeys.CASE_DEATH}_year"]`).value

                        if (type === 'year') {
                            createYearOptions(birthYear, d.getFullYear(), `${columnKeys.CASE_DEATH}_year`)
                        } else if (type === 'month') {
                            if (deathYear === birthYear) {
                                createMonthOptions(birthMonth, 12, `${columnKeys.CASE_DEATH}_month`)
                            }
                        }

                        document.querySelector(`.tab-wrap *[name="${columnKeys.CASE_DEATH}_year"]`).value = deathYear
                    }

                    return
                } else if (colId === `${columnKeys.CASE_AGE}_year` || colId === `${columnKeys.MEDICAL_AGE_ONSET}_year`) {
                    element = document.querySelector(`.tab-wrap *[name="${colId}"]`)
                    colId = colId === `${columnKeys.CASE_AGE}_year` ? columnKeys.CASE_AGE : columnKeys.MEDICAL_AGE_ONSET

                    let [year, month, day] = parseAgeString(value ? value.toString() : '');
                    if (year !== '') element.value = year

                    let monthElement = document.querySelector(`.tab-wrap *[name="${colId}_month"]`)
                    if (month !== '') monthElement.value = month
                    let dayElement = document.querySelector(`.tab-wrap *[name="${colId}_day"]`)
                    if (day !== '') dayElement.value = day
                    element.onchange = function () {
                        // onchange(columnKeys.CASE_AGE)
                        onchange(colId)
                    }
                    monthElement.onchange = function () {
                        // onchange(columnKeys.CASE_AGE)
                        onchange(colId)
                    }
                    dayElement.onchange = function () {
                        // onchange(columnKeys.CASE_AGE)
                        onchange(colId)
                    }
                    return
                } else if (colId === columnKeys.CASE_GROUP) {
                    document.getElementById('group_options').onchange = function (e) {
                        onchange(columnKeys.CASE_GROUP, e.target.value)
                        e.target.previousSibling.value = e.target.value
                        e.target.selectedIndex = 0
                    }
                } else if (colId === columnKeys.CASE_FAMILY_ID) {
                    document.getElementById('family_options').onchange = function (e) {
                        onchange(columnKeys.CASE_FAMILY_ID, e.target.value)
                        e.target.previousSibling.value = e.target.value
                        e.target.selectedIndex = 0
                    }
                }

                if ([columnKeys.MEDICAL_ALLERGIES, columnKeys.MEDICAL_DRINKING, columnKeys.MEDICAL_SMOKING].includes(colId)) {
                    $(`.tab-wrap input[name="${colId}"][value="${value ? 'yes' : 'no'}"]`).prop('checked', true)

                    let textInput = $(`.tab-wrap input[name="${colId}"]`)

                    if (value) {
                        textInput.show()
                        textInput.val(value)
                    }

                    textInput.on('change', () => {
                        onchange(colId, textInput.val())
                    })

                    return
                }

                let type = element.type
                if (type === 'radio') {
                    $(`.tab-wrap input[name="${colId}"]`).off().on('change', (e) => {
                        let targetValue = e.currentTarget.value

                        targetValue = getDataDisplayOption(c.options, targetValue, 'displayValue')
                        onchange(colId, targetValue)
                    })
                } else {
                    element.onchange = function (e) {
                        let targetValue = e.target.value
                        if (e.target.type === 'select-one' || colId === columnKeys.CASE_LIFE_STATUS) {
                            targetValue = getDataDisplayOption(c.options, targetValue, 'displayValue')
                        }
                        onchange(colId, targetValue)
                    }
                }

                if (!value) return

                if (type === 'radio') {
                    $(`.tab-wrap input[name="${colId}"][value="${value}"]`).prop('checked', true)
                } else {
                    element.value = value
                }
            })
        })

        function onchange(key, value, element) {
            let dateKey = [columnKeys.CASE_BIRTH, columnKeys.CASE_DEATH, columnKeys.CASE_EXAMINATION_DAY, columnKeys.CASE_AGE, columnKeys.MEDICAL_AGE_ONSET]
            if (dateKey.includes(key)) {
                const defaultValue = '-'
                let pre = key
                if (value === '') {
                    value = ''
                } else {
                    let year = document.querySelector(`.tab-wrap *[name="${pre}_year"]`).value || defaultValue
                    let month = document.querySelector(`.tab-wrap *[name="${pre}_month"]`).value
                    let day = document.querySelector(`.tab-wrap *[name="${pre}_day"]`)?.value
                    let forAge = pre === columnKeys.CASE_AGE || pre === columnKeys.MEDICAL_AGE_ONSET
                    if (forAge) {
                        value = ''
                        if (year !== defaultValue) {
                            value += forAge ? year + 'Y' : year
                        }
                        if (month !== defaultValue) {
                            value += forAge ? month + 'M' : (value.length === 0 ? month : '/' + month)
                        }
                        if (forAge && day && day !== defaultValue) {
                            value += forAge ? day + 'D' : (value.length === 0 ? day : '/' + day)
                        }
                    } else {
                        if (year === defaultValue && month === defaultValue && (!day || day === defaultValue)) { 
                            value = ''
                        } else {
                            if (day)
                                value = `${year}/${month}/${day}`
                            else
                                value = `${year}/${month}`
                        }
                    }
                }
            }

            let patientIdx = null
            contentData.forEach((p, i) => {
                if (p.PCFNo === currentPatient) {
                    patientIdx = i
                    p[key] = value
                }
            })

            let columnIdx = existingColumns.indexOf(key)

            if (columnIdx >= 0) {
                columnIdx += actions.length
                hot.setDataAtCell(patientIdx, columnIdx, value)
            }

            // changedData[key] = value
            // hot.render()
        }

        function showHideDeathDate(parent, value) {
            if (value === 'deceased') {
                parent.show()
            } else {
                parent.hide()
            }
        }

        function getDataDisplayOption(columnOptions, value, type) {
            let returnVal = value

            let options = columnOptions['dataValue']
            if (type === 'dataValue') {
                options = columnOptions[lang].length > 0 ? columnOptions[lang] : columnOptions['en']
            }

            let index = options.indexOf(value)
            if (index > -1) {
                returnVal = type === 'dataValue' ? columnOptions['dataValue'][index] : columnOptions[lang][index]
            }

            return returnVal
        }
    }
}

// TODO!! update
function generatePhenopackets() {
    let patientData = contentData.filter(d => { return d.PCFNo == currentPatient })[0]
    if (!patientData) return

    let status
    if (patientData[columnKeys.CASE_LIFE_STATUS] === 'alive' || patientData[columnKeys.CASE_LIFE_STATUS] === 'Alive' || patientData[columnKeys.CASE_LIFE_STATUS] === '生存') {
        status = 'ALIVE'
    } else {
        status = 'DECEASED'
    }

    let vitalStatus = {
        status: status
    }

    if (status === 'DECEASED') {
        vitalStatus.timeOfDeath = {
            timestamp: patientData[columnKeys.CASE_DEATH]
        }
    }

    let sex
    if (patientData[columnKeys.CASE_SEX] === '男性' || patientData[columnKeys.CASE_SEX] === 'male' || patientData[columnKeys.CASE_SEX] === 'Male') {
        sex = 'MALE'
    } else if (patientData[columnKeys.CASE_SEX] === '女性' || patientData[columnKeys.CASE_SEX] === 'female' || patientData[columnKeys.CASE_SEX] === 'Female') {
        sex = 'FEMALE'
    } else {
        sex = 'UNKNOWN_STATUS'
    }


    let phenopacket = {
        phenopacket: {
            id: patientData[columnKeys.CASE_GROUP] || '',
            subject: {
                id: currentPatient,
                sex: sex,
                dateOfBirth: patientData[columnKeys.CASE_BIRTH],
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

function openInfo() {
    closeKarteModal()

    $('body').append('<div class="modal_bg"></div>')
    $('.modal_bg').fadeIn()

    let modal = '#modal-info'
    $(modal).fadeIn()

    modalResize()

    $(window).on('resize', function () {
        modalResize()
    })

    function modalResize() {
        var w = $(window).width()
        var h = $(window).height()

        var x = (w - $(modal).outerWidth(true)) / 2
        var y = (h - $(modal).outerHeight(true)) / 2

        $(modal).css({ 'left': x + 'px', 'top': y + 'px' })
    }

    $('.info-modal-close, .modal_bg').off().click(function (e) {
        $('.modal_box').fadeOut()
        $('.modal_bg').fadeOut('slow', function () {
            $('.modal_bg').remove()
        })
    })

}

function closeKarteModal() {
    if ($('#modal-karte').css('display') === 'block') {
        $('#modal-karte').fadeOut()
    }
}




//resize handle
const modal = document.querySelector('#modal-karte');

let isResizing = false;
let lastX = 0;
if (modal) {
    const resizeHandle = modal.querySelector('.resize-handle');


    resizeHandle.addEventListener('mousedown', (event) => {
        isResizing = true;
        lastX = event.clientX;
    });
}

document.addEventListener('mousemove', (event) => {
    if (!isResizing) return;

    const delta = event.clientX - lastX;
    lastX = event.clientX;
    const modalWidth = parseInt(getComputedStyle(modal).getPropertyValue('width'));
    let newWidth = modalWidth - delta;
    if (newWidth < 400) newWidth = 400;
    if (newWidth < 520) {
        document.querySelectorAll("#modal-karte .tab-wrap ul .tab-btn span").forEach(elem => elem.style.display = "none");
    } else {
        document.querySelectorAll("#modal-karte .tab-wrap ul .tab-btn span").forEach(elem => elem.style.display = "block");
    }


    modal.style.width = newWidth + 'px';
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});



function translate2(word, variables = {}) {
    if (!elementTranslation[word]) return null
    let result = null;
    if (elementTranslation[word][lang]) {
        result = elementTranslation[word][lang]
    } else {
        result = elementTranslation[word]['en']
    }
    for(let [key, value] of Object.entries(variables)) {
        result = result.replace(`{${key}}`, value)
    }
    return result;
}
