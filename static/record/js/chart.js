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

    let sexAgeData = filterData(contentData)
    createMultipleBarChart(document.getElementById('pie-chart-sex-age'), sexAgeData, translate('chart-title-age'))

    let sexData = contentData.map(d => d[columnKeys.CASE_SEX])
    createPieChart(document.getElementById('pie-chart-sex'), sexData, translate('chart-title-sex'))

    let groupData = contentData.map(d => d[columnKeys.CASE_GROUP])
    createBarChart(document.getElementById('bar-chart-group'), groupData, translate('chart-title-group'))

    function createPieChart(container, data, title) {
        let ctx = container.getContext('2d')
        let dataObject = {}

        for (let key of data) {
            let displayKey = key || translate('chart-title-null')
            dataObject[displayKey] = dataObject[displayKey] ? dataObject[displayKey] + 1 : 1
        }

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
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title,
                        position: 'top',
                        align: 'start'
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
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: translate('chart-multiple-age-sex-y'),
                            align: 'end'
                        },
                        ticks: {
                            display: true,
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title,
                        position: 'top',
                        align: 'start'
                    }
                }
            }
        })

        charts.push(chart)
    }

    function createMultipleBarChart(container, data, title) {
        let ctx = container.getContext('2d')

        let category = categories.filter(c => c.categoryId === columnKeys.CASE_INFO)
        let column = category[0].columns.filter(c => c.columnId === columnKeys.CASE_SEX)
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
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title,
                        position: 'top',
                        align: 'start'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: translate('chart-multiple-age-sex-x'),
                            align: 'end'
                        },
                        ticks: {
                            display: true,
                            precision: 0
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: translate('chart-multiple-age-sex-y'),
                            align: 'end'
                        },
                        ticks: {
                            display: true,
                            precision: 0
                        }
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
            if (d[columnKeys.CASE_SEX] === 'Male' || d[columnKeys.CASE_SEX] === 'male' || d[columnKeys.CASE_SEX] === '男性' || d[columnKeys.CASE_SEX] === '남성') {
                sex = 'male'
            } else if (d[columnKeys.CASE_SEX] === 'Female' || d[columnKeys.CASE_SEX] === 'female' || d[columnKeys.CASE_SEX] === '女性' || d[columnKeys.CASE_SEX] === '여성') {
                sex = 'female'
            } else if (d[columnKeys.CASE_SEX] === 'Other' || d[columnKeys.CASE_SEX] === 'other' || d[columnKeys.CASE_SEX] === 'その他' || d[columnKeys.CASE_SEX] === '기타') {
                sex = 'other'
            } else if (d[columnKeys.CASE_SEX] === 'Unknown' || d[columnKeys.CASE_SEX] === 'unknown' || d[columnKeys.CASE_SEX] === '不明' || d[columnKeys.CASE_SEX] === '불명') {
                sex = 'unknown'
            }

            let age = d[columnKeys.CASE_AGE]
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