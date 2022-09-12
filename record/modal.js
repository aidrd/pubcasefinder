function openModal(isNew) {
    $('body').append('<div class="modal_bg"></div>');
    $('.modal_bg').fadeIn();

    var modal = '#modal-karte';
    $(`.tab-wrap input[type="text"], .tab-wrap textarea, .tab-wrap select`).val('')
    $('.tab-wrap input:radio').prop('checked', false)
    document.querySelector('.tab-btn').click()

    let d = new Date()
    let pcfNo = `P${d.getFullYear()}${d.getMonth()+1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`
    if (isNew) document.getElementById('PCFNo').nextElementSibling.innerHTML = pcfNo

    document.querySelector(`.tab-wrap *[name="patientID"]`).value = `P${count.toString().padStart(7, 0)}`

    modalResize();
    populateOptions('group_options')

    document.querySelector(`.tab-wrap *[name="groupID"]`).onclick = function () {
        document.getElementById('group_options').style.display = 'block'
    }

    // populateOptions('related_to')

    $(modal).fadeIn();


    $('.modal_bg, .modal-close, .modal-save').off().click(function (e) {
        editTable($(this).hasClass('modal-save'))

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

    function populateOptions(element) {
        let parent = document.getElementById(element)
        if (!parent) return

        parent.innerHTML = ''

        // let data = element === 'group_options' ? structuredClone(groupOptions) : structuredClone(patientOptions)
        let data = element === 'group_options' ? JSON.parse(JSON.stringify(groupOptions)) : JSON.parse(JSON.stringify(patientOptions))

        data.unshift('なし')

        data.forEach(d => {
            let option = document.createElement('option')
            option.value = d
            option.innerText = d
            parent.appendChild(option)
        })

        parent.onchange = function() {
            document.querySelector(`.tab-wrap *[name="groupID"]`).value = parent.options[parent.selectedIndex].value
            parent.style.display = 'none'
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

    console.log('phenopacket', phenopacket)
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