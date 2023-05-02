let categories = [
    {
        categoryId: 'p000',
        dataKey: 'patientInfo',
        iconClass: 'modal-icon modal-patient',
        iconName: '',
        displayName: {
            en: 'Patient Info',
            ja: '患者基本情報',
            ko: '환자 기본 정보',
            zh: '患者基本信息',
            zhcht: '患者基本信息'
        },
        columns: [
            {
                columnId: 'p001',
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
                columnId: 'p002',
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
                columnId: 'p003',
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
                    // TODO: What should dataValue be?
                    dataValue: ['proband', 'father', 'mother', 'sibling', 'child', 'grandfather', 'grandmother', 'other'],
                    en: ['Proband (the individual)', 'Father', 'Mother', 'Parent (unknown details)', 'Siblings', 'Child',
                        'Grandparents (paternal)', 'Grandparents (maternal)', 'Grandparents (unknown details)',
                        'Uncle (paternal)', 'Uncle (maternal)', 'Aunt (paternal)', 'Aunt (maternal)', 'Nephew/Niece',
                        'Grandchild', 'Cousin', 'Unknown', 'Other (paternal)', 'Other (maternal)',
                    ],
                    ja: ['発端者（本人）', '父', '母', '親（詳細不明）', '兄弟姉妹', '子ども', '祖父母（父方）', '祖父母（母方）', '祖父母（詳細不明）',
                            'おじ（父方）', 'おじ（母方）', 'おば（父方）',
                            'おば（母方）', '甥姪', '孫', 'いとこ', '不明', 'その他（父方）', 'その他（母方）', ],
                    ko: ['발단자(본인)', '아버지', '어머니', '부모(상세 불명)', '형제자매', '자식', '조부모(아버지 쪽)', '조부모(어머니 쪽)',
                        '조부모(상세 불명)', '삼촌(아버지 쪽)', '삼촌(어머니 쪽)', '고모(아버지 쪽)', '이모(어머니 쪽)', '조카', '손자녀',
                        '사촌', '불명', '기타(아버지 쪽)', '기타(어머니 쪽)',],
                    zh: ['发端者（本人）','父亲','母亲','父母（详细不明）','兄弟姐妹','孩子','祖父母（父方）','祖父母（母方）','祖父母（详细不明）',
                        '叔叔（父方）','叔叔（母方）','姑姑（父方）','姨妈（母方）','侄子侄女','孙子孙女','表亲','不明','其他（父方）','其他（母方）',],
                    zhcht: ['發端者（本人）', '父親', '母親', '父母（詳細不明）', '兄弟姊妹', '孩子', '祖父母（父方）', '祖父母（母方）',
                        '祖父母（詳細不明）', '叔叔（父方）', '叔叔（母方）', '姑姑（父方）', '姨媽（母方）',
                        '侄子侄女', '孫子孫女', '表親', '不明', '其他（父方）', '其他（母方）', ]
                }
            },
            {
                columnId: 'p004',
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
                // TODO: What should columnId be?
                columnId: 'p004-2',
                dataKey: 'presenceOrAbsenceOfOnset',
                inputType: 'select',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Presence or absence of onset',
                    ja: '発症の有無',
                    ko: '발병의 유무',
                    zh: '发病的有无',
                    zhcht: '發病的有無'
                },
                options: {
                    dataValue: ['alive', 'deceased'],
                    // TODO: What should choices be?
                    en: [],
                    ja: ['発症', '未発症', '不明'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnId: 'p005',
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
                columnId: 'p006',
                dataKey: 'birth',
                inputType: 'select-date',
                phenoKey: '',
                type: 'date',
                table: true,
                displayName: {
                    en: 'Birth (yyyy/mm)',
                    ja: '生年月 (yyyy/mm)',
                    ko: '생년월 (yyyy/mm)',
                    zh: '出生日期 (yyyy/mm)',
                    zhcht: '出生日期 (yyyy/mm)'
                }
            },
            {
                columnId: 'p007',
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
                columnId: 'p008',
                dataKey: 'death',
                inputType: 'select-date',
                phenoKey: '',
                type: 'date',
                table: true,
                displayName: {
                    en: 'Death (yyyy/mm)',
                    ja: '没年月 (yyyy/mm)',
                    ko: '사망일 (yyyy/mm)',
                    zh: '已故日期 (yyyy/mm)',
                    zhcht: '已故日期 (yyyy/mm)'
                }
            },
            {
                // TODO: What should columnId be?
                columnId: 'p008-2',
                dataKey: 'examinationDay',
                inputType: 'select-date',
                phenoKey: '',
                type: 'date',
                table: true,
                displayName: {
                    en: 'Examination day',
                    ja: '診察日 (yyyy/mm/dd)',
                    ko: '진찰 날짜 (yyyy/mm/dd)',
                    zh: '诊察日 (yyyy/mm/dd)',
                    zhcht: '診察日 (yyyy/mm/dd)'
                }
            },
            {
                columnId: 'p009',
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
                columnId: 'p010',
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
        categoryId: 'm000',
        dataKey: 'medicalInfo',
        iconClass: 'modal-icon modal-medical',
        iconName: '',
        displayName: {
            en: 'Medical Info',
            ja: '診療情報',
            ko: '찰 정보',
            zh: '诊察信息',
            zhcht: '診察信息'
        },
        columns: [
            {
                columnId: 'm001',
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
                columnId: 'm002',
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
                columnId: 'm003',
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
                columnId: 'm004',
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
                columnId: 'm005',
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
                columnId: 'm006',
                dataKey: 'previousMedicalHistory',
                inputType: 'textarea',
                phenoKey: '',
                type: 'text',
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
                columnId: 'm007',
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
                columnId: 'm008',
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
                columnId: 'm009',
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
                columnId: 'm010',
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
                columnId: 'm011',
                dataKey: 'examinationFinding',
                inputType: 'textarea',
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
                columnId: 'm012',
                dataKey: 'allergies',
                inputType: 'text',
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
                // options: {
                //     dataValue: ['yes', 'no'],
                //     en: ['Yes', 'No'],
                //     ja: ['有', '無'],
                //     ko: [],
                //     zh: [],
                //     zhcht: []
                // }
            },
            {
                columnId: 'm013_2',
                dataKey: 'bodyWeight',
                inputType: 'hot',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Body Weight (kg)',
                    ja: '体重 (kg)',
                    ko: '체중 (kg)',
                    zh: '体重 (kg)',
                    zhcht: '體重 (kg)'
                }
            },
            {
                columnId: 'm013_3',
                dataKey: 'bodyHeight',
                inputType: 'hot',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Body Height (cm)',
                    ja: '身長 (cm)',
                    ko: '신장 (cm)',
                    zh: '身高 (cm)',
                    zhcht: '身高 (cm)'
                }
            },
            {
                columnId: 'm013_4',
                dataKey: 'headCircumference',
                inputType: 'hot',
                phenoKey: '',
                type: 'text',
                table: true,
                displayName: {
                    en: 'Head Circumference (cm)',
                    ja: '頭囲 (cm)',
                    ko: '머리둘레 (cm)',
                    zh: '头围 (cm)',
                    zhcht: '頭圍 (cm)'
                }
            },
            {
                columnId: 'm014',
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
                columnId: 'm015',
                dataKey: 'drinking',
                inputType: 'text',
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
                // options: {
                //     dataValue: ['yes', 'no'],
                //     en: ['Yes', 'No'],
                //     ja: ['有', '無'],
                //     ko: [],
                //     zh: [],
                //     zhcht: []
                // }
            },
            {
                columnId: 'm016',
                dataKey: 'smoking',
                inputType: 'text',
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
                // options: {
                //     dataValue: ['yes', 'no'],
                //     en: ['Yes', 'No'],
                //     ja: ['有', '無'],
                //     ko: [],
                //     zh: [],
                //     zhcht: []
                // }
            },
            {
                columnId: 'm017',
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
                columnId: 'm018',
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
                columnId: 'm019',
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
        categoryId: 'pi000',
        dataKey: 'phenotypicInfo',
        iconClass: 'modal-icon modal-phenotype',
        iconName: '',
        displayName: {
            en: 'Phenotype Info',
            ja: '表現型情報',
            ko: '표현형 정보',
            zh: '表型信息',
            zhcht: '表型信息'
        }
// modified by hzhang@bits.cc start
        ,doc_list: [
            {
                docId:    'pi003',
                title:    null,
                text:     null,
                hpo_list: [],
                withUI:   'yes',
                schema:   'auto',
                dataSrcColumnId: 'm005'
            },
            {
                docId: 'pi004',
                title:    null,
                text:     null,
                hpo_list: [],
                withUI: 'yes',
                schema: 'auto',
                dataSrcColumnId: 'm006'
            },
            {
                docId: 'pi005',
                withUI: 'yes',
                title:    null,
                text:     null,
                hpo_list: [],
                schema: 'auto',
                dataSrcColumnId: 'm009'
            },
            {
                docId: 'pi006',
                withUI: 'yes',
                title:    null,
                text:     null,
                hpo_list: [],
                schema: 'auto',
                dataSrcColumnId: 'f001'
            },
            {
                docId: 'pi007',
                withUI: 'yes',
                title:    null,
                text:     null,
                hpo_list: [],
                schema: 'manual',
                dataSrcColumnId: null
            }
        ],
        columns: [
            {
                columnId: 'pi001',
                dataKey:  'id',
                phenoKey: '',
                type:     'text',
                table:    true,
                displayName: {
                    en: 'HPO ID',
                    ja: 'HPO ID',
                    ko: '',
                    zh: '',
                    zhcht: ''
                }
            },
            {
                columnId: 'pi002',
                dataKey:  'name',
                phenoKey: '',
                type:     'text',
                table:    true,
                displayName: {
                    en: 'Symptom',
                    ja: '症状',
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                languages: ['en','ja','ko','zh','zhcht']
            },
            {
                columnId:  'pi003',
                dataKey:   'source_medical_history_current',
                inputType: 'checkbox',
                phenoKey:  '',
                type:      'text',
                table:     true,
                displayName: {
                    en: 'Current Medical History',
                    ja: '現病歴',
                    ko: '현재 병력',
                    zh: '现病史',
                    zhcht: '現病史'
                },
                options: {
                    dataValue: ['no', 'yes'],
                    en: ['No', 'Yes'],
                    ja: ['無','有'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnId:  'pi004',
                dataKey:   'source_medical_history_previous',
                inputType: 'checkbox',
                phenoKey:  '',
                type:      'text',
                table:     true,
                displayName: {
                    en: 'Previous Medical History',
                    ja: '既往歴',
                    ko: '과거 병력',
                    zh: '既往病史',
                    zhcht: '既往病史'
                },
                options: {
                    dataValue: ['no', 'yes'],
                    en: ['No', 'Yes'],
                    ja: ['無','有'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnId:  'pi005',
                dataKey:   'source_medical_history_process',
                inputType: 'checkbox', 
                phenoKey:  '',
                type:      'text',
                table:     true,
                displayName: {
                    en: 'Process',
                    ja: '経過',
                    ko: '경과',
                    zh: '进程',
                    zhcht: '進程'
                },
                options: {
                    dataValue: ['no', 'yes'],
                    en: ['No', 'Yes'],
                    ja: ['無','有'],
                    ko: [],
                    zh: [],
                    zhcht: []
                 }
            },
            {
                columnId:  'pi006',
                dataKey:   'source_medical_history_family',
                inputType: 'checkbox',
                phenoKey:  '',
                type:      'text',
                table:     true,
                displayName: {
                    en: 'Family History',
                    ja: '家族歴',
                    ko: '가족력',
                    zh: '家族史',
                    zhcht: '家族史'
                },
                options: {
                    dataValue: ['no', 'yes'],  
                    en: ['No', 'Yes'],
                    ja: ['無','有'],
                      ko: [],                    
                    zh: [],
                    zhcht: []
                 }
            },
            {
                columnId:  'pi007',
                dataKey:   'source_manual',
                inputType: 'checkbox',
                phenoKey:  '', 
                type:      'text',
                table:     true,
                displayName: { 
                    en: 'Any Text',
                    ja: '任意のテキスト',
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['no', 'yes'],
                    en: ['No', 'Yes'],
                    ja: ['無','有'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnId:  'pi008',
                dataKey:   'is_observed',
                inputType: 'select',
                phenoKey:  '',
                type:      'dropdown',
                table:     true,
                displayName: {
                    en: 'Excluded',
                    ja: '症状の有無',
                    ko: '증상의 유무',
                    zh: '有无症状',
                    zhcht: '有無症狀'
                },
                options: {
                    dataValue: ['yes', 'no'],
                    en: ['No', 'Yes'],
                    ja: ['症状あり', '症状なし'],
                    ko: ['증상 있음', '증상 없음'],
                    zh: ['有症状','无症状'],
                    zhcht: ['有症狀','無症狀']
                }
            },
            {
                columnId:  'pi009',
                dataKey:   'hpo_clinical_relevance',
                inputType: 'select',
                phenoKey:  '',
                type:      'dropdown',
                table:     true,
                displayName: {
                    en: 'Clinical relevance',
                    ja: '重要性',
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['normal', 'distinctive', 'minor'],
                    en: ['Normal', 'Distinctive finding', 'Minor finding'],
                    ja: ['通常', '高い', '低い'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnId:  'pi010',
                dataKey:   'hpo_severity',
                inputType: 'select',
                phenoKey:  '',
                type:      'dropdown',
                table:     true,
                displayName: {
                    en: 'Severity',
                    ja: '重症度',
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['borderline', 'severe', 'profound', 'moderate', 'mild'],
                    en: ['Borderline', 'Severe', 'Profound', 'Moderate', 'Mild'],
                    ja: ['境界域', '重度', '最重度','中等度','軽度'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnId:  'pi011',
                dataKey:   'hpo_age_of_onset',
                inputType: 'select',
                phenoKey:  '',
                type:      'dropdown',
                table:     true,
                displayName: {
                    en: 'Age of onset',
                    ja: '発症年齢',
                    ko: '',
                    zh: '发病年龄',
                    zhcht: ''
                },
                options: {
                    dataValue: ['unknown', 'adult', 'antenatal', 'pediatric', 'congenital', 'puerperal', 'neonatal'],
                    en: ['Unknown', 'Adult onset', 'Antenatal onset', 'Pediatric onset', 'Congenital onset', 'Puerperal onset', 'Neonatal onset'],
                    ja: ['Unknown', 'Adult onset', 'Antenatal onset', 'Pediatric onset', 'Congenital onset', 'Puerperal onset', 'Neonatal onset'],
                    ko: ['', '', '', '', '', '', ''],
                    zh: ['', '', '', '', '', '', ''],
                    zhcht: ['','','','','', '', '']
                }
            },
            {
                columnId:  'pi012',
                dataKey:   'hpo_temporal_pattern',
                inputType: 'select',
                phenoKey:  '',
                type:      'dropdown',
                table:     true,
                displayName: {
                    en: 'Temporal pattern',
                    ja: '発症パターン',
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
                options: {
                    dataValue: ['unknown', 'recurrent', 'subacute', 'fluctuating', 'migratory', 'diurnal', 'stable','insidious','prolonged','nocturnal','chronic','transient'],
                    en: ['Unknown', 'Recurrent Acute', 'Subacute', 'Fluctuating', 'Migratory', 'Diurnal', 'Stable', 'Insidious onset', 'Prolonged', 'Nocturnal', 'Chronic', 'Transient'],
                    ja: ['Unknown', 'Recurrent Acute', 'Subacute', 'Fluctuating', 'Migratory', 'Diurnal', 'Stable', 'Insidious onset', 'Prolonged', 'Nocturnal', 'Chronic', 'Transient'],
                    ko: [],
                    zh: [],
                    zhcht: []
                }
            },
            {
                columnId:  'pi013',
                dataKey:   'hpo_pace_of_progression',
                inputType: 'select',
                phenoKey:  '',
                type:      'dropdown',
                table:     true,
                displayName: {
                    en: 'Pace of progression',
                    ja: '進行速度',
                    ko: '진행 속도',
                    zh: '进展速度',
                    zhcht: '進展速度'
                },
                options: {
                    dataValue: ['unknown', 'adult', 'antenatal', 'pediatric', 'congenital', 'puerperal', 'neonatal'],
                    en: ['Unknown', 'Progressive', 'Variable progression rate', 'Slowly progressive', 'Nonprogressive', 'Rapidly progressive'],
                    ja: ['Unknown', 'Progressive', 'Variable progression rate', 'Slowly progressive', 'Nonprogressive', 'Rapidly progressive'],
                    ko: ['', '', '', '', '', ''],
                    zh: ['', '', '', '', '', ''],
                    zhcht: ['','','','','', '']
                }
            },
            {
                columnId:  'pi014',
                dataKey:   'hpo_resolution',
                inputType: 'text',
                phenoKey:  '',
                type:      'text',
                table:     true,
                displayName: {
                    en: 'Resolution',
                    ja: '消失',
                    ko: '',
                    zh: '',
                    zhcht: ''
                },
            },
            {
                columnId: 'pi015',
                dataKey:  'hpo_comments',
                inputType: 'text',
                phenoKey:  '',  
                type:      'text',
                table:     true,
                displayName: {
                    en: 'Comments',
                    ja: 'コメント',
                    ko: '코멘트',
                    zh: '注释',
                    zhcht: '註釋'
                }
            }
        ]
// modified by hzhang@bits.cc end
    },
    {
        categoryId: 'g000',
        dataKey: 'geneInfo',
        iconClass: 'modal-icon modal-gene',
        iconName: '',
        displayName: {
            en: 'Genotype Info',
            ja: '遺伝子型情報',
            ko: '유전자형 정보',
            zh: '基因型信息',
            zhcht: '基因型信息'
        },
        columns: [
            {
                columnId: 'g001',
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
                columnId: 'g002',
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
                columnId: 'g003',
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
                columnId: 'g004',
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
                columnId: 'g005',
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
                columnId: 'g006',
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
                columnId: 'g007',
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
                columnId: 'g008',
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
                columnId: 'g009',
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
                columnId: 'g010',
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
                columnId: 'g011',
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
                columnId: 'g012',
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
                columnId: 'g013',
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
                columnId: 'g014',
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
        categoryId: 'f000',
        dataKey: 'familyInfo',
        iconClass: 'modal-icon modal-family',
        iconName: '',
        displayName: {
            en: 'Family Info',
            ja: '家系情報',
            ko: '가계 정보',
            zh: '家庭信息',
            zhcht: '家庭信息'
        },
        columns: [
            {
                columnId: 'f001',
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
                columnId: 'f002',
                dataKey: 'geneticList',
                inputType: 'multiple-radio',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Mode of Inheritance',
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
                columnId: 'f003',
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
                columnId: 'f004',
                dataKey: 'consanguineMarriage',
                inputType: 'radio',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Consanguinity',
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
                columnId: 'f005',
                dataKey: 'miscarriage',
                inputType: 'radio',
                phenoKey: '',
                type: 'dropdown',
                table: true,
                displayName: {
                    en: 'Parents with at least 3 Miscarriages',
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
                columnId: 'f006',
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
                columnId: 'f007',
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
