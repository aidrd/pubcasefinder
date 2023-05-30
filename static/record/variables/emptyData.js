let newData = { 'PCFNo': null, 'medical_body_info': [{}] }

let notIncludedInNewData = ['CASE_INFO', 'MEDICAL_INFO', 'MEDICAL_BODY_INFO', 'MEDICAL_BODY_INFO_DATE', 'PHENOTYPE_INFO', 'GENOTYPE_INFO', 'FAMILY_INFO']

let bodyInfoKeys = ['MEDICAL_BODY_INFO_DATE', 'MEDICAL_BODY_WEIGHT', 'MEDICAL_BODY_HEIGHT', 'MEDICAL_HEAD_CIRCUMFERENCE']

for (let key in columnKeys) {
    if (notIncludedInNewData.includes(key) || bodyInfoKeys.includes(key)) continue

    if (key.split('_')[0] === 'PHENOTYPE' || key.split('_')[0] === 'GENOTYPE') {
        newData[columnKeys[key]] = []
    } else {
        newData[columnKeys[key]] = null
    }
}

bodyInfoKeys.forEach(k => {
    newData.medical_body_info[0][k.toLocaleLowerCase()] = null
})

let newData_ = {
    "PCFNo": null,
    "p001": null,
    "p002": null,
    "p003": null,
    "p004": null,
    "p00a": null,
    "p005": null,
    "p006": null,
    "p007": null,
    "p008": null,
    "p00b": null,
    "p009": null,
    "p010": null,
    "m001": null,
    "m002": null,
    "m003": null,
    "m004": null,
    "m005": null,
    "m006": null,
    "m007": null,
    "m008": null,
    "m009": null,
    "m010": null,
    "m011": null,
    "m012": null,
    "m013": [
        {
            "m013_1": null,
            "m013_2": null,
            "m013_3": null,
            "m013_4": null
        }
    ],
    "m014": null,
    "m015": null,
    "m016": null,
    "m017": null,
    "m018": null,
    "m019": null,
//modified by hzhang@bits start
    "pi001": [],
    "pi002": [],
    "pi003": [],
    "pi004": [],
    "pi005": [],
    "pi006": [],
    "pi007": [],
    "pi008": [],
    "pi009": [],
    "pi010": [],
    "pi011": [],
    "pi012": [],
    "pi013": [],
    "pi014": [],
    "pi015": [],
//modified by hzhang@bits end
    "g001": [],
    "g002": [],
    "g003": [],
    "g004": [],
    "g005": [],
    "g006": [],
    "g007": [],
    "g008": [],
    "g009": [],
    "g010": [],
    "g011": [],
    "g012": [],
    "g013": [],
    "g014": [],
    "f001": null,
    "f002": null,
    "f003": null,
    "f004": null,
    "f005": null,
    "f006": null,
    "f007": null
}