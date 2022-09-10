
let columns = {
    "basicInfo": [
        {
            "columnName": "患者ID",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "患者さんメモ",
            "type": "text",
            "options": [],
            "table": false
        },
        {
            "columnName": "グループID",
            "type": "dropdown",
            "options": ["Honda", "Toyota", "Hyundai-01", "Tesla"],
            "table": true
        },
        {
            "columnName": "続柄",
            "type": "dropdown",
            "options": ["発端者", "父親", "母親", "兄弟姉妹", "その他"],
            "table": true
        },
        {
            "columnName": "状態",
            "type": "dropdown",
            "options": ["生存", "故人"],
            "table": true
        },
        {
            "columnName": "生年月日",
            "type": "date",
            "options": [],
            "table": true
        },
        {
            "columnName": "没年月",
            "type": "date",
            "options": [],
            "table": true
        },
        {
            "columnName": "性別",
            "type": "dropdown",
            "options": ["男性", "女性", "その他", "不明"],
            "table": true
        },
        {
            "columnName": "概要",
            "type": "text",
            "options": [],
            "table": true
        }
    ],
    "medicalInfo": [
        {
            "columnName": "臨床診断",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "確定診断",
            "type": "text",
            "options": [],
            "table": false
        },
        {
            "columnName": "主訴",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "診断状況",
            "type": "radio",
            "options": ["解決", "新規候補", "VUS", "未解決"],
            "table": true
        },
        {
            "columnName": "病歴",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "出生前および周産期の病歴",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "発症年齢",
            "type": "dropdown",
            "options": ["不明", "先天性の発症", "出生前発症 - 胎生期発症", "出生前発症- 胎児期発症", "新生児期発症", "幼児期発症", "小児期発症", "若年性発症（思春期発症）", "成人発症 ", "成人発症- 前期発症（青年期発症） ", "成人発症- 中年期発症（壮年期発症）", "成人発症- 後期発症 "],
            "table": true
        },
        {
            "columnName": "症状",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "主な検査結果",
            "type": "text_multiple",
            "options": [],
            "table": true
        },
        {
            "columnName": "アレルギー",
            "type": "radio_free",
            "options": [],
            "table": true
        },
        {
            "columnName": "体重",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "身長",
            "type": "text",
            "options": [],
            "table": true
        },{
            "columnName": "頭囲",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "飲酒量",
            "type": "text",
            "options": []
        },
        {
            "columnName": "喫煙",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "現在服用中の薬",
            "type": "text",
            "options": [],
            "table": true
        }
    ],
    "genotypeInfo": [
        {
            "columnName": "Gene",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "Status",
            "type": "dropdown",
            "options": ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
            "table": false
        },
        {
            "columnName": "Strategy",
            "type": "dropdown",
            "options": ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
            "table": true
        },
        {
            "columnName": "Reference",
            "type": "dropdown",
            "options": ["GRCh37 (hg19)", "GRCh38 (hg38)", "GRCh36 (hg18)"],
            "table": true
        },
        {
            "columnName": "Chr:Position",
            "type": "text",
            "options": [],
            "table": true
        },        {
            "columnName": "cDNA",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "Pathogenicity",
            "type": "dropdown",
            "options": ["Pathogenic", "Likely Pathogenic", "Varitant of Unknown Significance", "Likely Benign", "Benign", "Investigation Needed"],
            "table": true
        },
        {
            "columnName": "Pathogenicity",
            "type": "dropdown",
            "options": ['heterozygous', 'homozygous', 'hemizygous'],
            "table": true
        },
        {
            "columnName": "Transcript",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "Protein Charge",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "Annotations",
            "type": "dropdown",
            "options": ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
            "table": true
        },
        {
            "columnName": "Inheritance",
            "type": "dropdown",
            "options": ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
            "table": true
        },
        {
            "columnName": "Evidence",
            "type": "dropdown",
            "options": ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals'],
            "table": true
        },
        {
            "columnName": "Comments",
            "type": "text",
            "options": [],
            "table": true
        }
    ],
    "familyInfo": [
        {
            "columnName": "家族歴",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "家族のメンバー",
            "type": "text",
            "options": [],
            "table": false
        },
        {
            "columnName": "遺伝形式",
            "type": "checkbox",
            "options": ["藤原宿題"],
            "table": true
        },
        {
            "columnName": "その他の罹患近親者",
            "type": "dropdown",
            "options": ["不明", "はい", "いいえ"],
            "table": true
        },
        {
            "columnName": "近親婚",
            "type": "dropdown",
            "options": ["不明", "はい", "いいえ"],
            "table": true
        },
        {
            "columnName": "流産が3回以上ある両親",
            "type": "dropdown",
            "options": ["不明", "はい", "いいえ"],
            "table": true
        },
        {
            "columnName": "父方の民族 ",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "母性の民族",
            "type": "text",
            "options": [],
            "table": true
        }
    ]
}