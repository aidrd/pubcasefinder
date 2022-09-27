
let columns = {
    "患者基本情報": [
        {
            "columnName": "患者ID",
            "dataKey": "patientID",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "家族ID",
            "dataKey": "FamilyID",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "続柄",
            "dataKey": "relationship",
            "type": "dropdown",
            "options": ["発端者", "父親", "母親", "兄弟姉妹", "その他"],
            "table": true
        },
        {
            "columnName": "グループ名",
            "dataKey": "groupID",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "状態",
            "dataKey": "lifestatus",
            "type": "dropdown",
            "options": ["生存", "故人"],
            "table": true
        },
        {
            "columnName": "生年月",
            "dataKey": "birth",
            "type": "date",
            "options": [],
            "table": true
        },
        {
            "columnName": "年齢",
            "dataKey": "age",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "没年月",
            "dataKey": "death",
            "type": "date",
            "options": [],
            "table": true
        },
        {
            "columnName": "性別",
            "dataKey": "sex",
            "type": "dropdown",
            "options": ["男性", "女性", "その他", "不明"],
            "table": true
        },
        {
            "columnName": "概要",
            "dataKey": "Note",
            "type": "text",
            "options": [],
            "table": true
        }
    ],
    "診療情報": [
        {
            "columnName": "臨床診断",
            "dataKey": "clinical-diagnosis",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "確定診断",
            "dataKey": "final-diagnosis",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "主訴",
            "dataKey": "chief-complaint",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "診断状況",
            "dataKey": "case-solved",
            "type": "dropdown",
            "options": ["解決", "新規候補", "VUS", "未解決"],
            "table": true
        },
        {
            "columnName": "現病歴",
            "dataKey": "current-medical-history",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "既往歴",
            "dataKey": "previous-medical-history",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "出生前および周産期の病歴",
            "dataKey": "prenatal-perinatal-history",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "生育歴および教育歴",
            "dataKey": "early-developmental-and-schooling-history",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "経過",
            "dataKey": "process",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "発症年齢",
            "dataKey": "age-onset",
            "type": "dropdown",
            "options": ["不明", "先天性の発症", "出生前発症 - 胎生期発症", "出生前発症- 胎児期発症", "新生児期発症", "幼児期発症", "小児期発症", "若年性発症（思春期発症）", "成人発症 ", "成人発症- 前期発症（青年期発症） ", "成人発症- 中年期発症（壮年期発症）", "成人発症- 後期発症 "],
            "table": true
        },
        {
            "columnName": "検査所見",
            "dataKey": "examination-finding",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "アレルギー",
            "dataKey": "allergies",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "体重",
            "dataKey": "body-weight",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "身長",
            "dataKey": "body-height",
            "type": "text",
            "options": [],
            "table": true
        },{
            "columnName": "頭囲",
            "dataKey": "head-circumference",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "社会歴",
            "dataKey": "social-history",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "飲酒量",
            "dataKey": "drinking",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "喫煙",
            "dataKey": "smoking",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "内服歴",
            "dataKey": "medications",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "渡航歴",
            "dataKey": "vaccination-history",
            "type": "text",
            "options": [],
            "table": true
        }
    ],
    "遺伝子型情報": [
        {
            "columnName": "Gene",
            "dataKey": "Gene",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "Status",
            "dataKey": "Status",
            "type": "dropdown",
            "options": ['Rejected Candidate', 'Confirmed causa', 'Carrier', 'Tested Negative'],
            "table": true
        },
        {
            "columnName": "Strategy",
            "dataKey": "Strategy",
            "type": "dropdown",
            "options": ['Sequencing', 'Deletion/duplication', 'Familial mutation', 'Common mutations'],
            "table": true
        },
        {
            "columnName": "Reference",
            "dataKey": "Reference",
            "type": "dropdown",
            "options": ["GRCh37 (hg19)", "GRCh38 (hg38)", "GRCh36 (hg18)"],
            "table": true
        },
        {
            "columnName": "Chr:Position",
            "dataKey": "Chr-Position",
            "type": "text",
            "options": [],
            "table": true
        },        {
            "columnName": "cDNA Change",
            "dataKey": "cDNA Change",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "Pathogenicity",
            "dataKey": "Pathogenicity",
            "type": "dropdown",
            "options": ["Pathogenic", "Likely Pathogenic", "Varitant of Unknown Significance", "Likely Benign", "Benign", "Investigation Needed"],
            "table": true
        },
        {
            "columnName": "Genotype",
            "dataKey": "Genotype",
            "type": "dropdown",
            "options": ['heterozygous', 'homozygous', 'hemizygous'],
            "table": true
        },
        {
            "columnName": "Transcript",
            "dataKey": "Transcript",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "Protein Charge",
            "dataKey": "ProteinCharge",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "Annotations",
            "dataKey": "Annotations",
            "type": "dropdown",
            "options": ['missense', 'nonsense', 'insertion - in frame', 'insertion - frameshift', 'deletion - in frame', 'deletion - frameshift', 'indel - in frame', 'indel - frameshift', 'duplication', 'repeat expansion', 'synonymous', 'other'],
            "table": true
        },
        {
            "columnName": "Inheritance",
            "dataKey": "Inheritance",
            "type": "dropdown",
            "options": ['de novo germline', 'de novo somatic mosaicism', 'maternal', 'paternal', 'unknown'],
            "table": true
        },
        {
            "columnName": "Evidence",
            "dataKey": "Evidence",
            "type": "dropdown",
            "options": ['Rare (MAF less than 0.01)', 'Predicted damaging by in silico models', 'Reported in other affected individuals'],
            "table": true
        },
        {
            "columnName": "Comments",
            "dataKey": "Comments",
            "type": "text",
            "options": [],
            "table": true
        }
    ],
    "家系情報": [
        {
            "columnName": "家族歴",
            "dataKey": "family-info",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "遺伝形式",
            "dataKey": "genetic_list",
            "type": "dropdown",
            "options": ["Sporadic", "Autosomal dominant inheritance", "Sex-limited autosomal dominant", "Autosomal dominant somatic cell mutation", "Autosomal dominant contiguous gene syndrome", "Autosomal recessive inheritance", "Gonosomal inheritance", "X-linked inheritance", "X-linked dominant inheritance", "X-linked recessive inheritance", "Y-linked inheritance", "Multifactorial inheritance", "Digenic inheritance", "Oligogenic inheritance", "Polygenic inheritance", "Mitochondrial inheritance"],
            "table": true
        },
        {
            "columnName": "その他の罹患近親者",
            "dataKey": "other-families",
            "type": "dropdown",
            "options": ["不明", "はい", "いいえ"],
            "table": true
        },
        {
            "columnName": "近親婚",
            "dataKey": "consanguine-marriage",
            "type": "dropdown",
            "options": ["不明", "はい", "いいえ"],
            "table": true
        },
        {
            "columnName": "流産が3回以上ある両親",
            "dataKey": "abortion",
            "type": "dropdown",
            "options": ["不明", "はい", "いいえ"],
            "table": true
        },
        {
            "columnName": "父方の民族",
            "dataKey": "gene-father",
            "type": "text",
            "options": [],
            "table": true
        },
        {
            "columnName": "母性の民族",
            "dataKey": "gene-mother",
            "type": "text",
            "options": [],
            "table": true
        }
    ]
}