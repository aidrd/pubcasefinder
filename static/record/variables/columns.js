let categories = [
    {
        dataKey: 'patientInfo',
        displayName: {
            en: 'Patient Information',
            ja: '患者基本情報',
            ko: ''
        },
        columns: [
            {
                columnID: 'p001',
                dataKey: 'patientId',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Patient ID',
                    ja: '患者ID',
                    ko: ''
                }
            },
            {
                columnID: 'p002',
                dataKey: 'familyId',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Family ID',
                    ja: '家族ID',
                    ko: ''
                }
            },
            {
                columnID: 'p003',
                dataKey: 'relationship',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Relationship',
                    ja: '続柄',
                    ko: ''
                },
                options: {
                    dataValue: ['Proband', 'Father', 'Mother', 'Sibling', 'Other'],
                    en: ['Proband', 'Father', 'Mother', 'Sibling', 'Other'],
                    ja: ['発端者', '父親', '母親', '兄弟姉妹', 'その他'],
                    ko: []
                }
            },
            {
                columnID: 'p004',
                dataKey: 'group',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Group',
                    ja: 'グループ名',
                    ko: ''
                }
            },
            {
                columnID: 'p005',
                dataKey: 'lifeStatus',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Life Status',
                    ja: '状態',
                    ko: ''
                },
                options: {
                    dataValue: ['Alive', 'Deceased'],
                    en: ['Alive', 'Deceased'],
                    ja: ['生存', '故人'],
                    ko: []
                }
            },
            {
                columnID: 'p006',
                dataKey: 'birth',
                phenoKey: '',
                type: 'date',
                table: true,
                displayName: {
                    en: 'Birth',
                    ja: '生年月',
                    ko: ''
                }
            },
            {
                columnID: 'p007',
                dataKey: 'age',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Age',
                    ja: '年齢',
                    ko: ''
                }
            },
            {
                columnID: 'p008',
                dataKey: 'death',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Death',
                    ja: '没年月',
                    ko: ''
                }
            },
            {
                columnID: 'p009',
                dataKey: 'sex',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Sex',
                    ja: '性別',
                    ko: ''
                },
                options: {
                    dataValue: ['Male', 'Female', 'Other', 'Unknown'],
                    en: ['Male', 'Female', 'Other', 'Unknown'],
                    ja: ['男性', '女性', 'その他', '不明'],
                    ko: []
                }
            },
            {
                columnID: 'p010',
                dataKey: 'note',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Note',
                    ja: '概要',
                    ko: ''
                }
            },
        ]
    },
    {
        dataKey: 'medicalInfo',
        displayName: {
            en: 'Medical Information',
            ja: '診療情報',
            ko: ''
        },
        columns: [
            {
                columnID: 'm001',
                dataKey: 'clinicalDiagnosis',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Clinical Diagnosis',
                    ja: '臨床診断',
                    ko: ''
                }
            },
            {
                columnID: 'm002',
                dataKey: 'finalDiagnosis',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Final Diagnosis',
                    ja: '確定診断',
                    ko: ''
                }
            },
            {
                columnID: 'm003',
                dataKey: 'chiefComplaint',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Chief Complaint',
                    ja: '主訴',
                    ko: ''
                }
            },
            {
                columnID: 'm004',
                dataKey: 'caseSolved',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Case Solved',
                    ja: '診断状況',
                    ko: ''
                },
                options: {
                    dataValue: ['Solved', 'Candidate', 'VUS', 'Unresolved'],
                    en: ['Solved', 'Candidate', 'VUS', 'Unresolved'],
                    ja: ['解決', '新規候補', 'VUS', '未解決'],
                    ko: []
                }
            },
            {
                columnID: 'm005',
                dataKey: 'currentMedicalHistory',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Current Medical History',
                    ja: '現病歴',
                    ko: ''
                }
            },
            {
                columnID: 'm006',
                dataKey: 'previousMedicalHistory',
                phenoKey: '',
                type: 'date',
                table: true,
                displayName: {
                    en: 'Previous Medical History',
                    ja: '既往歴',
                    ko: ''
                }
            },
            {
                columnID: 'm007',
                dataKey: 'prenatalPerinatalHistory',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Prenatal Perinatal History',
                    ja: '出生前および周産期の病歴',
                    ko: ''
                }
            },
            {
                columnID: 'm008',
                dataKey: 'earlyDevelopmentalAndSchoolingHistory',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Early Developmental and Schooling History',
                    ja: '生育歴および教育歴',
                    ko: ''
                }
            },
            {
                columnID: 'm009',
                dataKey: 'process',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Process',
                    ja: '経過',
                    ko: ''
                }
            },
            {
                columnID: 'm010',
                dataKey: 'ageOnset',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Age of Onset',
                    ja: '発症年齢',
                    ko: ''
                },
                options: {
                    dataValue: ['Unknown', 'Congenital Onset', 'Antenatal Onset - Embryonal', 'Antenatal Onset - Fetal', 'Neonatal Onset', 'Infantile Onset', 'Childhood Onset', 'Juvenile Onset', 'Adult Onset - Young Adult', 'Adult Onset - Middle Age', 'Adult Onset - Late'],
                    en: ['Unknown', 'Congenital Onset', 'Antenatal Onset - Embryonal', 'Antenatal Onset - Fetal', 'Neonatal Onset', 'Infantile Onset', 'Childhood Onset', 'Juvenile Onset', 'Adult Onset - Young Adult', 'Adult Onset - Middle Age', 'Adult Onset - Late'],
                    ja: ['不明', '先天性の発症', '出生前発症 - 胎生期発症', '出生前発症- 胎児期発症', '新生児期発症', '幼児期発症', '小児期発症', '若年性発症（思春期発症）', '成人発症', '成人発症- 前期発症（青年期発症）', '成人発症- 中年期発症（壮年期発症）', '成人発症- 後期発症'],
                    ko: []
                }
            },
            {
                columnID: 'm011',
                dataKey: 'examinationFinding',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Examination Finding',
                    ja: '検査所見',
                    ko: ''
                }
            },
            {
                columnID: 'm012',
                dataKey: 'allergies',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Allergies',
                    ja: 'アレルギー',
                    ko: ''
                }
            },
            {
                columnID: 'm013',
                dataKey: 'bodyWeight',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Body Weight',
                    ja: '体重',
                    ko: ''
                }
            },
            {
                columnID: 'm014',
                dataKey: 'bodyHeight',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Body Height',
                    ja: '身長',
                    ko: ''
                }
            },
            {
                columnID: 'm015',
                dataKey: 'headCircumference',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'headCircumference',
                    ja: '頭囲',
                    ko: ''
                }
            },
            {
                columnID: 'm016',
                dataKey: 'socialHistory',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Social History',
                    ja: '社会歴',
                    ko: ''
                }
            },
            {
                columnID: 'm017',
                dataKey: 'drinking',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Drinking',
                    ja: '飲酒量',
                    ko: ''
                }
            },
            {
                columnID: 'm018',
                dataKey: 'smoking',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Smoking',
                    ja: '喫煙',
                    ko: ''
                }
            },
            {
                columnID: 'm019',
                dataKey: 'medications',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Medications',
                    ja: '内服薬',
                    ko: ''
                }
            },
            {
                columnID: 'm020',
                dataKey: 'travelHistory',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Travel History',
                    ja: '渡航歴',
                    ko: ''
                }
            },
            {
                columnID: 'm021',
                dataKey: 'vaccinationHistory',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Vaccination History',
                    ja: '予防接種歴',
                    ko: ''
                }
            }
        ]
    },
    {
        dataKey: 'geneInfo',
        displayName: {
            en: 'Genotype Information',
            ja: '遺伝子型情報',
            ko: ''
        },
        columns: [
            {
                columnID: 'g001',
                dataKey: 'gene',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Gene',
                    ja: 'Gene',
                    ko: ''
                }
            },
            {
                columnID: 'g002',
                dataKey: 'status',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Status',
                    ja: 'Status',
                    ko: ''
                },
                options: {
                    dataValue: ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
                    en: ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
                    ja: ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
                    ko: []
                }
            },
            {
                columnID: 'g003',
                dataKey: 'strategy',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Strategy',
                    ja: 'Strategy',
                    ko: ''
                },
                options: {
                    dataValue: ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
                    en: ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
                    ja: ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
                    ko: []
                }
            },
            {
                columnID: 'g004',
                dataKey: 'reference',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Reference',
                    ja: 'Reference',
                    ko: ''
                },
                options: {
                    dataValue: ['GRCh37 (hg19)', 'GRCh38 (hg38)', 'GRCh36 (hg18)'],
                    en: ['GRCh37 (hg19)', 'GRCh38 (hg38)', 'GRCh36 (hg18)'],
                    ja: ['GRCh37 (hg19)', 'GRCh38 (hg38)', 'GRCh36 (hg18)'],
                    ko: []
                }
            },
            {
                columnID: 'g005',
                dataKey: 'chrPosition',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Chr:Position',
                    ja: 'Chr:Position',
                    ko: ''
                }
            },
            {
                columnID: 'g006',
                dataKey: 'cDNAChange',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'cDNA Change',
                    ja: 'cDNA Change',
                    ko: ''
                }
            },
            {
                columnID: 'g007',
                dataKey: 'pathogenicity',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Pathogenicity',
                    ja: 'Pathogenicity',
                    ko: ''
                },
                options: {
                    dataValue: ['Pathogenic', 'Likely Pathogenic', 'Varitant of Unknown Significance', 'Likely Benign', 'Benign', 'Investigation Needed'],
                    en: ['Pathogenic', 'Likely Pathogenic', 'Varitant of Unknown Significance', 'Likely Benign', 'Benign', 'Investigation Needed'],
                    ja:['Pathogenic', 'Likely Pathogenic', 'Varitant of Unknown Significance', 'Likely Benign', 'Benign', 'Investigation Needed'],
                    ko: []
                }
            },
            {
                columnID: 'g008',
                dataKey: 'genotype',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Genotype',
                    ja: 'Genotype',
                    ko: ''
                },
                options: {
                    dataValue: ['heterozygous', 'homozygous', 'hemizygous'],
                    en: ['heterozygous', 'homozygous', 'hemizygous'],
                    ja: ['heterozygous', 'homozygous', 'hemizygous'],
                    ko: []
                }
            },
            {
                columnID: 'g009',
                dataKey: 'transcript',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Transcript',
                    ja: 'Transcript',
                    ko: ''
                }
            },
            {
                columnID: 'g010',
                dataKey: 'proteinCharge',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Protein Charge',
                    ja: 'Protein Charge',
                    ko: ''
                }
            },
            {
                columnID: 'g011',
                dataKey: 'annotations',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Annotations',
                    ja: 'Annotations',
                    ko: ''
                },
                options: {
                    dataValue: ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
                    en: ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
                    ja: ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
                    ko: []
                }
            },
            {
                columnID: 'g012',
                dataKey: 'inheritance',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Inheritance',
                    ja: 'Inheritance',
                    ko: ''
                },
                options: {
                    dataValue: ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
                    en: ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
                    ja: ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
                    ko: []
                }
            },
            {
                columnID: 'g013',
                dataKey: 'evidence',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Evidence',
                    ja: 'Evidence',
                    ko: ''
                },
                options: {
                    dataValue: ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals'],
                    en: ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals'],
                    ja: ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals'],
                    ko: []
                }
            },
            {
                columnID: 'g014',
                dataKey: 'comments',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Comments',
                    ja: 'Comments',
                    ko: ''
                }
            }
        ]
    },
    {
        dataKey: 'familyInfo',
        displayName: {
            en: 'Family Information',
            ja: '家族歴',
            ko: ''
        },
        columns: [
            {
                columnID: 'f001',
                dataKey: 'familyInfo',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Family Info',
                    ja: '家族歴',
                    ko: ''
                }
            },
            {
                columnID: 'f002',
                dataKey: 'geneticList',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Genetic List',
                    ja: '遺伝形式',
                    ko: ''
                },
                options: {
                    dataValue: ['Sporadic', 'Autosomal dominant inheritance', 'Sex-limited autosomal dominant', 'Autosomal dominant somatic cell mutation', 'Autosomal dominant contiguous gene syndrome', 'Autosomal recessive inheritance', 'Gonosomal inheritance', 'X-linked inheritance', 'X-linked dominant inheritance', 'X-linked recessive inheritance', 'Y-linked inheritance', 'Multifactorial inheritance', 'Digenic inheritance', 'Oligogenic inheritance', 'Polygenic inheritance', 'Mitochondrial inheritance'],
                    en: ['Sporadic', 'Autosomal dominant inheritance', 'Sex-limited autosomal dominant', 'Autosomal dominant somatic cell mutation', 'Autosomal dominant contiguous gene syndrome', 'Autosomal recessive inheritance', 'Gonosomal inheritance', 'X-linked inheritance', 'X-linked dominant inheritance', 'X-linked recessive inheritance', 'Y-linked inheritance', 'Multifactorial inheritance', 'Digenic inheritance', 'Oligogenic inheritance', 'Polygenic inheritance', 'Mitochondrial inheritance'],
                    ja: ['Sporadic', 'Autosomal dominant inheritance', 'Sex-limited autosomal dominant', 'Autosomal dominant somatic cell mutation', 'Autosomal dominant contiguous gene syndrome', 'Autosomal recessive inheritance', 'Gonosomal inheritance', 'X-linked inheritance', 'X-linked dominant inheritance', 'X-linked recessive inheritance', 'Y-linked inheritance', 'Multifactorial inheritance', 'Digenic inheritance', 'Oligogenic inheritance', 'Polygenic inheritance', 'Mitochondrial inheritance'],
                    ko: []
                }
            },
            {
                columnID: 'f003',
                dataKey: 'otherAffectedRelatives',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Other Affected Relatives',
                    ja: 'その他の罹患近親者',
                    ko: ''
                },
                options: {
                    dataValue: ['Unknown', 'Yes', 'No'],
                    en: ['Unknown', 'Yes', 'No'],
                    ja: ['不明', 'はい', 'いいえ'],
                    ko: []
                }
            },
            {
                columnID: 'f004',
                dataKey: 'consanguineMarriage',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Consanguine Marriage',
                    ja: '近親婚',
                    ko: ''
                },
                options: {
                    dataValue: ['Unknown', 'Yes', 'No'],
                    en: ['Unknown', 'Yes', 'No'],
                    ja: ['不明', 'はい', 'いいえ'],
                    ko: []
                }
            },
            {
                columnID: 'f005',
                dataKey: 'miscarriage',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: '3 or more miscarriage',
                    ja: '流産が3回以上ある両親',
                    ko: ''
                },
                options: {
                    dataValue: ['Unknown', 'Yes', 'No'],
                    en: ['Unknown', 'Yes', 'No'],
                    ja: ['不明', 'はい', 'いいえ'],
                    ko: []
                }
            },
            {
                columnID: 'f006',
                dataKey: 'paternalEthnicity',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Paternal Ethnicity',
                    ja: '父方の民族',
                    ko: ''
                }
            },
            {
                columnID: 'f007',
                dataKey: 'maternalEthnicity',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Maternal Ethnicity',
                    ja: '母性の民族',
                    ko: ''
                }
            }
        ]
    }
]