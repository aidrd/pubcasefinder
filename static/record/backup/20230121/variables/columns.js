let categories = [
    {
        categoryID: 'p000',
        dataKey: 'patientInfo',
        iconClass: 'bxt icon material-icons-outlined',
        iconName: 'person',
        displayName: {
            en: 'Patient Information',
            ja: '患者基本情報',
            ko: '환자 기본 정보',
            zh: '',
            zhcht: ''
        },
        columns: [
            {
                columnID: 'p001',
                dataKey: 'patientId',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Patient ID',
                    ja: '患者ID',
                    ko: '환자 ID',
                    zh: '患者ID',
                    zhcht: '患者ID'
                }
            },
            {
                columnID: 'p002',
                dataKey: 'familyId',
                inputType: 'input-select',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Family ID',
                    ja: '家族ID',
                    ko: '가족 ID',
                    zh: '家人ID',
                    zhcht: '家人ID'
                }
            },
            {
                columnID: 'p003',
                dataKey: 'relationship',
                inputType: 'select',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Relationship',
                    ja: '続柄',
                    ko: '관계',
                    zh: '关系',
                    zhcht: '關係'
                },
                options: {
                    dataValue: ['proband', 'father', 'mother', 'sibling', 'child', 'grandfather', 'grandmother', 'other'],
                    en: ['Proband', 'Father', 'Mother', 'Sibling', 'Child', 'Grandfather', 'Grandmother', 'Other'],
                    ja: ['発端者', '父親', '母親', '兄弟姉妹', '子供', '祖父', '祖母', 'その他'],
                    ko: ['본인', '부', '모', '형제자매', '아이', '조부', '할머니', '기타'],
                    zh: ['发病者', '父亲', '母亲', '兄弟姐妹', '孩子', '祖父', '祖母', '其他'],
                    zhcht: ['發病者', '父親', '母親', '兄弟姐妹', '孩子', '祖父', '祖母', '其他']
                }
            },
            {
                columnID: 'p004',
                dataKey: 'group',
                inputType: 'input-select',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Group',
                    ja: 'グループ名',
                    ko: '그룹 이름',
                    zh: '集团名称',
                    zhcht: '集團名稱'
                }
            },
            {
                columnID: 'p005',
                dataKey: 'lifeStatus',
                inputType: 'radio',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Life Status',
                    ja: '状態',
                    ko: '상태',
                    zh: '生活状态',
                    zhcht: '生活狀態'
                },
                options: {
                    dataValue: ['alive', 'deceased'],
                    en: ['Alive', 'Deceased'],
                    ja: ['生存', '故人'],
                    ko: ['생', '사'],
                    zh: ['活着的', '已故的'],
                    zhcht: ['活着的', '已故的']
                }
            },
            {
                columnID: 'p006',
                dataKey: 'birth',
                inputType: 'select-date',
                phenoKey: '',
                type: 'date',
                table: true,
                displayName: {
                    en: 'Birth',
                    ja: '生年月',
                    ko: '생년월',
                    zh: '出生日期',
                    zhcht: '出生日期'
                }
            },
            {
                columnID: 'p007',
                dataKey: 'age',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Age',
                    ja: '年齢',
                    ko: '연령',
                    zh: '年龄',
                    zhcht: '年齢'
                }
            },
            {
                columnID: 'p008',
                dataKey: 'death',
                inputType: 'select-date',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Death',
                    ja: '没年月',
                    ko: '사망일',
                    zh: '已故日期',
                    zhcht: '已故日期'
                }
            },
            {
                columnID: 'p009',
                dataKey: 'sex',
                inputType: 'select',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Sex',
                    ja: '性別',
                    ko: '성별',
                    zh: '性别',
                    zhcht: '性别'
                },
                options: {
                    dataValue: ['male', 'female', 'other', 'unknown'],
                    en: ['Male', 'Female', 'Other', 'Unknown'],
                    ja: ['男性', '女性', 'その他', '不明'],
                    ko: ['남성', '여성', '기타', '불명'],
                    zh: ['男性', '女性', '其他', '未知'],
                    zhcht: ['男性', '女性', '其他', '未知']
                }
            },
            {
                columnID: 'p010',
                dataKey: 'note',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Note',
                    ja: '概要',
                    ko: '비고',
                    zh: '备注',
                    zhcht: '備註'
                }
            },
        ]
    },
    {
        categoryID: 'm000',
        dataKey: 'medicalInfo',
        iconClass: 'material-symbols-outlined',
        iconName: 'medical_information',
        displayName: {
            en: 'Medical Information',
            ja: '診療情報',
            ko: '찰 정보',
            zh: '',
            zhcht: ''
        },
        columns: [
            {
                columnID: 'm001',
                dataKey: 'clinicalDiagnosis',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Clinical Diagnosis',
                    ja: '臨床診断',
                    ko: '임상진단',
                    zh: '临床诊断',
                    zhcht: '臨床診斷'
                }
            },
            {
                columnID: 'm002',
                dataKey: 'finalDiagnosis',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Final Diagnosis',
                    ja: '確定診断',
                    ko: '최종진단',
                    zh: '确诊诊断',
                    zhcht: '確診診斷'
                }
            },
            {
                columnID: 'm003',
                dataKey: 'chiefComplaint',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Chief Complaint',
                    ja: '主訴',
                    ko: '주요호소증상',
                    zh: '主訴',
                    zhcht: '主訴'
                }
            },
            {
                columnID: 'm004',
                dataKey: 'caseSolved',
                inputType: 'select',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Case Solved',
                    ja: '診断状況',
                    ko: '진단상황',
                    zh: '诊断情况',
                    zhcht: '診斷情況'
                },
                options: {
                    dataValue: ['solved', 'candidate', 'VUS', 'unresolved'],
                    en: ['Solved', 'Candidate', 'VUS', 'Unresolved'],
                    ja: ['解決', '新規候補', 'VUS', '未解決'],
                    ko: ['해결', '후보자', 'VUS', '미해결'],
                    zh: ['解决了', '新候補者', 'VUS', '未解决'],
                    zhcht: ['解決了', '新候選人', 'VUS', '未解決']
                }
            },
            {
                columnID: 'm005',
                dataKey: 'currentMedicalHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Current Medical History',
                    ja: '現病歴',
                    ko: '현재 병력',
                    zh: '现病史',
                    zhcht: '現病史'
                }
            },
            {
                columnID: 'm006',
                dataKey: 'previousMedicalHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'date',
                table: true,
                displayName: {
                    en: 'Previous Medical History',
                    ja: '既往歴',
                    ko: '과거 병력',
                    zh: '既往病史',
                    zhcht: '既往病史'
                }
            },
            {
                columnID: 'm007',
                dataKey: 'prenatalPerinatalHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Prenatal Perinatal History',
                    ja: '出生前および周産期の病歴',
                    ko: '출산 및 주산기 병력',
                    zh: '产前和围产史',
                    zhcht: '產前和圍產史'
                }
            },
            {
                columnID: 'm008',
                dataKey: 'earlyDevelopmentalAndSchoolingHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Early Developmental and Schooling History',
                    ja: '生育歴および教育歴',
                    ko: '초기 발달사와 학교 생활사',
                    zh: '早期发展和教育历史',
                    zhcht: '早期發展和教育歷史'
                }
            },
            {
                columnID: 'm009',
                dataKey: 'process',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Process',
                    ja: '経過',
                    ko: '경과',
                    zh: '进程',
                    zhcht: '進程'
                }
            },
            {
                columnID: 'm010',
                dataKey: 'ageOnset',
                inputType: 'select',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Age of Onset',
                    ja: '発症年齢',
                    ko: '발병연령',
                    zh: '发病年龄',
                    zhcht: '發病年齡'
                },
                options: {
                    dataValue: ['unknown', 'congenitalOnset', 'antenatalOnsetEmbryonal', 'antenatalOnsetFetal', 'neonatalOnset', 'infantileOnset', 'childhoodOnset', 'juvenileOnset', 'adultOnsetYoungAdult', 'AaultOnsetMiddleAge', 'adultOnsetLate'],
                    en: ['Unknown', 'Congenital Onset', 'Antenatal Onset - Embryonal', 'Antenatal Onset - Fetal', 'Neonatal Onset', 'Infantile Onset', 'Childhood Onset', 'Juvenile Onset', 'Adult Onset - Young Adult', 'Adult Onset - Middle Age', 'Adult Onset - Late'],
                    ja: ['不明', '先天性の発症', '出生前発症 - 胎生期発症', '出生前発症- 胎児期発症', '新生児期発症', '幼児期発症', '小児期発症', '若年性発症（思春期発症）', '成人発症', '成人発症- 前期発症（青年期発症）', '成人発症- 中年期発症（壮年期発症）', '成人発症- 後期発症'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnID: 'm011',
                dataKey: 'examinationFinding',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Examination Finding',
                    ja: '検査所見',
                    ko: '검사 소견',
                    zh: '检查结果',
                    zhcht: '檢查結果'
                }
            },
            {
                columnID: 'm012',
                dataKey: 'allergies',
                inputType: 'radio-input',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Allergies',
                    ja: 'アレルギー',
                    ko: '알레르기',
                    zh: '过敏症',
                    zhcht: '過敏症'
                },
                options: {
                    dataValue: ['yes', 'no'],
                    en: ['Yes', 'No'],
                    ja: ['有', '無'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnID: 'm013',
                dataKey: 'bodyWeight',
                inputType: 'hot',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Body Weight',
                    ja: '体重',
                    ko: '체중',
                    zh: '体重',
                    zhcht: '體重'
                }
            },
            {
                columnID: 'm014',
                dataKey: 'bodyHeight',
                inputType: 'hot',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Body Height',
                    ja: '身長',
                    ko: '신장',
                    zh: '身高',
                    zhcht: '身高'
                }
            },
            {
                columnID: 'm015',
                dataKey: 'headCircumference',
                inputType: 'hot',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Head Circumference',
                    ja: '頭囲',
                    ko: '머리둘레',
                    zh: '头围',
                    zhcht: '頭圍'
                }
            },
            {
                columnID: 'm016',
                dataKey: 'socialHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Social History',
                    ja: '社会歴',
                    ko: '사회생활력',
                    zh: '社会历史',
                    zhcht: '社會歷史'
                }
            },
            {
                columnID: 'm017',
                dataKey: 'drinking',
                inputType: 'radio-input',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Drinking',
                    ja: '飲酒量',
                    ko: '음주량',
                    zh: '饮酒量',
                    zhcht: '飲酒量'
                },
                options: {
                    dataValue: ['yes', 'no'],
                    en: ['Yes', 'No'],
                    ja: ['有', '無'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnID: 'm018',
                dataKey: 'smoking',
                inputType: 'radio-input',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Smoking',
                    ja: '喫煙',
                    ko: '흡연',
                    zh: '吸烟',
                    zhcht: '吸菸'
                },
                options: {
                    dataValue: ['yes', 'no'],
                    en: ['Yes', 'No'],
                    ja: ['有', '無'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnID: 'm019',
                dataKey: 'medications',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Medications',
                    ja: '内服薬',
                    ko: '상용약',
                    zh: '正规药',
                    zhcht: '正規藥'
                }
            },
            {
                columnID: 'm020',
                dataKey: 'travelHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Travel History',
                    ja: '渡航歴',
                    ko: '여행 이력',
                    zh: '旅行历史',
                    zhcht: '旅行歷史'
                }
            },
            {
                columnID: 'm021',
                dataKey: 'vaccinationHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Vaccination History',
                    ja: '予防接種歴',
                    ko: '예방 접종 이력',
                    zh: '疫苗接种史',
                    zhcht: '疫苗接種史'
                }
            }
        ]
    },
    {
        categoryID: 'pi000',
        dataKey: 'phenotypicInfo',
        iconClass: 'material-symbols-outlined',
        iconName: 'dns',
        displayName: {
            en: 'Phenotype Information',
            ja: '表現型情報',
            ko: '표현형 정보',
            zh: '',
            zhcht: ''
        }
    },
    {
        categoryID: 'g000',
        dataKey: 'geneInfo',
        iconClass: 'icon-omim2',
        iconName: '',
        displayName: {
            en: 'Genotype Information',
            ja: '遺伝子型情報',
            ko: '유전자형 정보',
            zh: '',
            zhcht: ''
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
                    ko: '',
                    zh: '',
                    zhcht: ''
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
                    en: ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
                    ja: ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
                    ko: [],
                    zh: [],
                    zhcht: []
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
                    en: ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
                    ja: ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
                    ko: [],
                    zh: '',
                    zhcht: ''
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['GRCh37 (hg19)', 'GRCh38 (hg38)', 'GRCh36 (hg18)'],
                    en: ['GRCh37 (hg19)', 'GRCh38 (hg38)', 'GRCh36 (hg18)'],
                    ja: ['GRCh37 (hg19)', 'GRCh38 (hg38)', 'GRCh36 (hg18)'],
                    ko: [],
                    zh: [],
                    zhcht: []
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
                    ko: '',
                    zh: '',
                    zhcht: ''
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
                    ko: '',
                    zh: '',
                    zhcht: ''
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['Pathogenic', 'Likely Pathogenic', 'Varitant of Unknown Significance', 'Likely Benign', 'Benign', 'Investigation Needed'],
                    en: ['Pathogenic', 'Likely Pathogenic', 'Varitant of Unknown Significance', 'Likely Benign', 'Benign', 'Investigation Needed'],
                    ja:['Pathogenic', 'Likely Pathogenic', 'Varitant of Unknown Significance', 'Likely Benign', 'Benign', 'Investigation Needed'],
                    ko: [],
                    zh: [],
                    zhcht: []
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['heterozygous', 'homozygous', 'hemizygous'],
                    en: ['heterozygous', 'homozygous', 'hemizygous'],
                    ja: ['heterozygous', 'homozygous', 'hemizygous'],
                    ko: [],
                    zh: [],
                    zhcht: []
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
                    ko: '',
                    zh: '',
                    zhcht: ''
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
                    ko: '',
                    zh: '',
                    zhcht: ''
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
                    en: ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
                    ja: ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
                    ko: [],
                    zh: [],
                    zhcht: []
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
                    en: ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
                    ja: ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
                    ko: [],
                    zh: [],
                    zhcht: []
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals'],
                    en: ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals'],
                    ja: ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals'],
                    ko: [],
                    zh: [],
                    zhcht: []
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
                    ko: '',
                    zh: '',
                    zhcht: ''
                }
            }
        ]
    },
    {
        categoryID: 'f000',
        dataKey: 'familyInfo',
        iconClass: 'material-symbols-outlined',
        iconName: 'diversity_3',
        displayName: {
            en: 'Family Information',
            ja: '家系情報',
            ko: '가계 정보',
            zh: '',
            zhcht: ''
        },
        columns: [
            {
                columnID: 'f001',
                dataKey: 'familyHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Family History',
                    ja: '家族歴',
                    ko: '가족력',
                    zh: '家族史',
                    zhcht: '家族史'
                }
            },
            {
                columnID: 'f002',
                dataKey: 'geneticList',
                inputType: 'multiple-radio',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Genetic List',
                    ja: '遺伝形式',
                    ko: '유전자 목록',
                    zh: '遗传列表',
                    zhcht: '遺傳列表'
                },
                options: {
                    dataValue: ['Sporadic', 'Autosomal dominant inheritance', 'Sex-limited autosomal dominant', 'Autosomal dominant somatic cell mutation', 'Autosomal dominant contiguous gene syndrome', 'Autosomal recessive inheritance', 'Gonosomal inheritance', 'X-linked inheritance', 'X-linked dominant inheritance', 'X-linked recessive inheritance', 'Y-linked inheritance', 'Multifactorial inheritance', 'Digenic inheritance', 'Oligogenic inheritance', 'Polygenic inheritance', 'Mitochondrial inheritance'],
                    en: ['Sporadic', 'Autosomal dominant inheritance', 'Sex-limited autosomal dominant', 'Autosomal dominant somatic cell mutation', 'Autosomal dominant contiguous gene syndrome', 'Autosomal recessive inheritance', 'Gonosomal inheritance', 'X-linked inheritance', 'X-linked dominant inheritance', 'X-linked recessive inheritance', 'Y-linked inheritance', 'Multifactorial inheritance', 'Digenic inheritance', 'Oligogenic inheritance', 'Polygenic inheritance', 'Mitochondrial inheritance'],
                    ja: ['Sporadic', 'Autosomal dominant inheritance', 'Sex-limited autosomal dominant', 'Autosomal dominant somatic cell mutation', 'Autosomal dominant contiguous gene syndrome', 'Autosomal recessive inheritance', 'Gonosomal inheritance', 'X-linked inheritance', 'X-linked dominant inheritance', 'X-linked recessive inheritance', 'Y-linked inheritance', 'Multifactorial inheritance', 'Digenic inheritance', 'Oligogenic inheritance', 'Polygenic inheritance', 'Mitochondrial inheritance'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnID: 'f003',
                dataKey: 'otherAffectedRelatives',
                inputType: 'radio',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Other Affected Relatives',
                    ja: 'その他の罹患近親者',
                    ko: '영향을 받는 다른 친척',
                    zh: '其他受影响亲属',
                    zhcht: '其他受影響親屬'
                },
                options: {
                    dataValue: ['unknown', 'yes', 'no'],
                    en: ['Unknown', 'Yes', 'No'],
                    ja: ['不明', 'はい', 'いいえ'],
                    ko: [],
                    zh: '',
                    zhcht: ''
                }
            },
            {
                columnID: 'f004',
                dataKey: 'consanguineMarriage',
                inputType: 'radio',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Consanguine Marriage',
                    ja: '近親婚',
                    ko: '근친혼',
                    zh: '近亲婚姻',
                    zhcht: '近親婚姻'
                },
                options: {
                    dataValue: ['unknown', 'yes', 'no'],
                    en: ['Unknown', 'Yes', 'No'],
                    ja: ['不明', 'はい', 'いいえ'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnID: 'f005',
                dataKey: 'miscarriage',
                inputType: 'radio',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: '3 or more miscarriage',
                    ja: '流産が3回以上ある両親',
                    ko: '유산이 세 번 이상 있는 양친',
                    zh: '3次或以上流产',
                    zhcht: '3次或以上流產'
                },
                options: {
                    dataValue: ['unknown', 'yes', 'no'],
                    en: ['Unknown', 'Yes', 'No'],
                    ja: ['不明', 'はい', 'いいえ'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnID: 'f006',
                dataKey: 'paternalEthnicity',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Paternal Ethnicity',
                    ja: '父方の民族',
                    ko: '부계 민족성',
                    zh: '父亲种族',
                    zhcht: '父親種族'
                }
            },
            {
                columnID: 'f007',
                dataKey: 'maternalEthnicity',
                inputType: 'text',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Maternal Ethnicity',
                    ja: '母性の民族',
                    ko: '모계 민족성',
                    zh: '母亲种族',
                    zhcht: '母親種族'
                }
            }
        ]
    }
]