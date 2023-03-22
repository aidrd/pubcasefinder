let charts = []

function toggleTableChart(type) {
    $('.sidebar-selected').removeClass('sidebar-selected')
    if (type === 'table') {
        document.getElementById('content-patients').style.display = 'block'
        document.getElementById('charts-patients').style.display = 'none'
        document.getElementById('myGrid').click()
        $('.sidebar-patients').addClass('sidebar-selected')
    } else if (type === 'chart') {
        document.getElementById('content-patients').style.display = 'none'
        document.getElementById('charts-patients').style.display = 'block'
        $('.sidebar-analytics').addClass('sidebar-selected')
        createChart()
    }
}

function createChart() {
    charts.forEach(c => c.destroy())

    // let familyData = contentData.map(d => d['p002'])
    // createBarChart(document.getElementById('bar-chart-family'), familyData, '家族ID')

    // let sexData = contentData.map(d => d['p009'])
    // createPieChart(document.getElementById('pie-chart-sex'), sexData, translate('chart-title-sex'))
    let sexAgeData = filterData(contentData)
    createMultipleBarChart(document.getElementById('pie-chart-sex-age'), sexAgeData, translate('chart-title-sex'))

    let sexData = contentData.map(d => d['p009'])
    createPieChart(document.getElementById('pie-chart-sex'), sexData, translate('chart-title-sex'))

    // let ageData = contentData.map(d => d['p007'])
    // createPieChart(document.getElementById('pie-chart-age'), ageData, translate('chart-title-age'))

    let groupData = contentData.map(d => d['p004'])
    createBarChart(document.getElementById('bar-chart-group'), groupData, translate('chart-title-group'))

    function createPieChart(container, data, title) {
        let ctx = container.getContext('2d')
        let dataObject = {}

        for (let key of data) {
            let displayKey = key || translate('chart-title-null')
            dataObject[displayKey] = dataObject[displayKey] ? dataObject[displayKey] + 1 : 1
        }

        let category = categories.filter(c => c.categoryId === 'p000')
        let column = category[0].columns.filter(c => c.columnId === 'p009')

        let chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(dataObject),
                datasets: [{
                    data: Object.values(dataObject)
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        })

        charts.push(chart)
    }

    function createBarChart(container, data, title) {
        let ctx = container.getContext('2d')

        let dataObject = {}

        for (let key of data) {
            let displayKey = key || translate('chart-title-null')
            dataObject[displayKey] = dataObject[displayKey] ? dataObject[displayKey] + 1 : 1
        }

        let chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(dataObject),
                datasets: [{
                    data: Object.values(dataObject)
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        })

        charts.push(chart)
    }

    function createMultipleBarChart(container, data, title) {
        let ctx = container.getContext('2d')

        let category = categories.filter(c => c.categoryId === 'p000')
        let column = category[0].columns.filter(c => c.columnId === 'p009')
        let labels = column[0].options[lang]

        let dataSetsData = []
        let index = 0

        for (let [key, value] of Object.entries(data)) {
            if (index === 0) {
                dataSetsData.push([value.male])
                dataSetsData.push([value.female])
                dataSetsData.push([value.other])
                dataSetsData.push([value.unknown])
            } else {
                dataSetsData[0].push(value.male)
                dataSetsData[1].push(value.female)
                dataSetsData[2].push(value.other)
                dataSetsData[3].push(value.uknown)
            }

            index++
        }

        let dataSet = []
        for (let i = 0; i < 4; i++) {
            dataSet.push({
                label: labels[i],
                data: dataSetsData[i]
            })
        }

        let chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['0 ~ 9', '10 ~ 19', '20 ~ 29', '30 ~ 39', '40 ~ 49', '50 ~ 59', '60 ~'],
                datasets: dataSet
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        })

        charts.push(chart)
    }

    function filterData(data) {
        let ageGroup = {
            age00: {
                male: 0,
                female: 0,
                other: 0,
                unknown: 0
            },
            age10: {
                male: 0,
                female: 0,
                other: 0,
                unknown: 0
            },
            age20: {
                male: 0,
                female: 0,
                other: 0,
                unknown: 0
            },
            age30: {
                male: 0,
                female: 0,
                other: 0,
                unknown: 0
            },
            age40: {
                male: 0,
                female: 0,
                other: 0,
                unknown: 0
            },
            age50: {
                male: 0,
                female: 0,
                other: 0,
                unknown: 0
            },
            age60: {
                male: 0,
                female: 0,
                other: 0,
                unknown: 0
            }
        }

        data.forEach(d => {
            let sex
            if (d['p009'] === 'Male' || d['p009'] === 'male' || d['p009'] === '男性' || d['p009'] === '남성') {
                sex = 'male'
            } else if (d['p009'] === 'Female' || d['p009'] === 'female' || d['p009'] === '女性' || d['p009'] === '여성') {
                sex = 'female'
            } else if (d['p009'] === 'Other' || d['p009'] === 'other' || d['p009'] === 'その他' || d['p009'] === '기타') {
                sex = 'other'
            } else if (d['p009'] === 'Unknown' || d['p009'] === 'unknown' || d['p009'] === '不明' || d['p009'] === '불명') {
                sex = 'unknown'
            }

            let age = d['p007']
            if (age < 10) {
                ageGroup['age00'][sex] += 1
            } else if (age >= 60) {
                ageGroup['age60'][sex] += 1
            } else {
                let firstDigit = String(age)[0]
                ageGroup[`age${firstDigit}0`][sex] += 1
            }
        })


        return ageGroup

    }
}