;(function ($) {

	const URL_GET_RANKING_BY_HPO_ID                 = 'https://pubcasefinder.dbcls.jp/pcf_get_ranking_by_hpo_id',
		  URL_GET_RANKING_BY_HPO_ID_WITH_FILTER     = 'get_ranking_by_hpo_id_with_filter',
		  URL_GET_DATA_BY_ID                        = 'get_data_by_id',
		  URL_GET_OMIM_DATA_BY_OMIM_ID              = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_omim_data_by_omim_id',
		  URL_GET_ORPHA_DATA_BY_ORPHA_ID            = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_orpha_data_by_orpha_id',
		  URL_GET_GENE_DATA_BY_NCBI_GENE_ID         = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_gene_data_by_ncbi_gene_id',
		  URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID     = 'https://pubcasefinder.dbcls.jp/pcf_get_count_case_report_by_mondo_id',
		  URL_GET_HPO_DATA_BY_OMIM_ID               = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_omim_id',
		  URL_GET_HPO_DATA_BY_HPO_ID                = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_hpo_id',
		  URL_GET_HPO_DATA_BY_HPO_ID_LOCAL          = '/get_hpo_data_by_hpo_id',
		  URL_GET_HPO_DATA_BY_ORPHA_ID              = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_orpha_id',
		  URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID        = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_tooltip_data_by_hpo_id',
		  URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_gene_tooltip_data_by_ncbi_gene_id',
		  URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID  = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_disease_tooltip_data_by_mondo_id',
		  URL_GET_CASE_REPORT_BY_MONDO_ID           = 'https://pubcasefinder.dbcls.jp/pcf_get_case_report_by_mondo_id',
		  URL_SHARE                                 = 'https://pubcasefinder.dbcls.jp/pcf_share',
		  URL_DOWNLOAD                              = 'https://pubcasefinder.dbcls.jp/pcf_download',
		  URL_PCF_FILTER_GET_OMIM_ID_BY_MONDO_ID            = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_omim_id_by_mondo_id',
		  URL_PCF_FILTER_GET_OMIM_ID_BY_NCBI_GENE_ID        = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_omim_id_by_ncbi_gene_id',
		  URL_PCF_FILTER_GET_OMIM_ID_BY_INHERITANCE_HPO_ID  = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_omim_id_by_inheritance_hpo_id',
		  URL_PCF_FILTER_GET_ALL_OMIM_ID                    = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_all_omim_id',
		  URL_PCF_FILTER_GET_ORPHA_ID_BY_MONDO_ID           = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_orpha_id_by_mondo_id',
		  URL_PCF_FILTER_GET_ORPHA_ID_BY_NCBI_GENE_ID       = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_orpha_id_by_ncbi_gene_id',
		  URL_PCF_FILTER_GET_ORPHA_ID_BY_INHERITANCE_HPO_ID = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_orpha_id_by_inheritance_hpo_id',
		  URL_PCF_FILTER_GET_ALL_ORPHA_ID                   = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_all_orpha_id',
		  URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID            = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_gene_id_by_mondo_id',
		  URL_PCF_FILTER_GET_GENE_ID_BY_INHERITANCE_HPO_ID  = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_gene_id_by_inheritance_hpo_id',
		  URL_PCF_FILTER_GET_ALL_GENE_ID                    = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_all_gene_id',
		  URL_PCF_FILTER_GET_CASE_ID_BY_NCBI_GENE_ID        = 'https://pubcasefinder.dbcls.jp/pcf_filter_get_case_id_by_ncbi_gene_id',
		  URL_PCF_FILTER_GET_GENE_ID_BY_NANDO_ID            = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_gene_id_by_nando_id",
		  URL_PCF_FILTER_GET_GENE_ID_BY_PA_ID               = "/pcf_filter_get_gene_id_by_pa_id",
		  URL_PCF_FILTER_GET_GENE_ID_BY_PAA_ID              = "/pcf_filter_get_gene_id_by_paa_id",
		  URL_PCF_FILTER_GET_CASE_ID_BY_GENE_ID             = "/pcf_filter_get_case_id_by_gene_id",
		  URL_PCF_FILTER_GET_CASE_ID_BY_MONDO_ID            = "/pcf_filter_get_case_id_by_mondo_id",
		  URL_PCF_FILTER_GET_CASE_ID_BY_NANDO_ID            = "/pcf_filter_get_case_id_by_nando_id",
		  URL_PCF_FILTER_GET_CASE_ID_BY_PA_ID               = "/pcf_filter_get_case_id_by_pa_id",
		  URL_PCF_FILTER_GET_CASE_ID_BY_PAA_ID              = "/pcf_filter_get_case_id_by_paa_id",
		  URL_PCF_GET_NANDO_DATA_BY_NANDO_ID                = "/pcf_get_nando_data_by_nando_id",
		  URL_PCF_GET_MONDO_DATA_BY_MONDO_ID                = "/pcf_get_mondo_data_by_mondo_id",
		  URL_PCF_GET_GENE_DATA_BY_GENE_ID                  = "/pcf_get_gene_data_by_gene_id",
		  URL_PCF_GET_PA_DATA_BY_PA_ID                      = "/pcf_get_pa_data_by_pa_id",
		  URL_PCF_GET_PAA_DATA_BY_PAA_ID                    = "/pcf_get_paa_data_by_paa_id",
		  URL_PCF_EXPAND_GET_MONDO_ID_BY_MONDO_ID           = "/api/pcf_expand_get_mondo_id_by_mondo_id",
		  URL_PCF_EXPAND_GET_NANDO_ID_BY_NANDO_ID           = "/api/pcf_expand_get_nando_id_by_nando_id",
		  URL_PCF_CONVERT_GENESYMBOL_TO_NCBI_GENE_ID        = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_convert_genesymbol_to_ncbigeneid';

	const URL_PARA_TARGET         = 'target',
		  URL_PARA_PHENOTYPE      = 'phenotype',
		  URL_PARA_FILTER         = 'filter',
		  URL_PARA_FILTER_VGP     = 'filter_vgp',
		  URL_PARA_SIZE           = 'size',
		  URL_PARA_LANG           = 'lang',
		  URL_PARA_OMIM_ID        = 'omim_id',
		  URL_PARA_GENE_ID        = 'gene_id',
		  URL_PARA_MONDO_ID       = 'mondo_id',
		  URL_PARA_NANDO_ID       = 'nando_id',
		  URL_PARA_PA_ID          = 'pa_id',
		  URL_PARA_PAA_ID         = 'paa_id',
		  URL_PARA_NCBI_GENE_ID   = 'ncbi_gene_id',
		  URL_PARA_HPO_ID         = 'hpo_id',
		  URL_PARA_ORPHA_ID       = 'orpha_id',
		  URL_PARA_FORMAT         = 'format',
		  URL_PARA_TARGET_ID      = 'target_id',
		  URL_PARA_SHARE          = 'share',
		  URL_PARA_URL            = 'url',
		  URL_PARA_RANGE          = 'range';

	const TARGET_OMIM     = 'omim',
		  TARGET_ORPHANET = 'orphanet',
		  TARGET_GENE     = 'gene',
		  TARGET_CASE     = 'case',
		  TARGET_LST = [TARGET_OMIM,TARGET_ORPHANET,TARGET_GENE,TARGET_CASE],
		  TARGET_ID_PREFIX_OMIM  = 'OMIM:', 
		  TARGET_ID_PREFIX_ORPHA = 'ORPHA:',
		  TARGET_ID_PREFIX_GENE  = 'GENEID:',
		  TARGET_ID_PREFIX_CASE  = 'CASEID:',
		  RegExp_OMIM  = new RegExp(TARGET_ID_PREFIX_OMIM, 'i'),
		  RegExp_ORPHA = new RegExp(TARGET_ID_PREFIX_ORPHA, 'i'),
		  RegExp_GENE  = new RegExp(TARGET_ID_PREFIX_GENE, 'i'),
		  RegExp_CASE  = new RegExp(TARGET_ID_PREFIX_CASE, 'i');

	const LANGUAGE_JA = 'ja',LANGUAGE_EN = 'en',
		  LANGUAGE = {
			[LANGUAGE_JA] : {
				'TAB_LABEL':{
					[TARGET_OMIM]:     'Genetic Disease',
					[TARGET_ORPHANET]: 'Rare Disease',
					[TARGET_GENE]:     'Gene',
					[TARGET_CASE]:     'Case'
				},
				'SAMPLE_TAG_LABEL': {
					[TARGET_OMIM]:     [{'CLASS':'list-tag_blue', 'TEXT':'クエリに対応する症状'},
										{'CLASS':'list-tag_green','TEXT':'遺伝形式'},
										{'CLASS':'list-tag_gray', 'TEXT':'疾患原因遺伝子'}],
					[TARGET_ORPHANET]: [{'CLASS':'list-tag_blue', 'TEXT':'クエリに対応する症状'},
										{'CLASS':'list-tag_green','TEXT':'遺伝形式'},
										{'CLASS':'list-tag_gray', 'TEXT':'疾患原因遺伝子'}],
					[TARGET_GENE]:     [{'CLASS':'list-tag_blue', 'TEXT':'クエリに対応する症状'},
										{'CLASS':'list-tag_red',  'TEXT':'疾患名'},
										{'CLASS':'list-tag_green','TEXT':'遺伝形式'}],
					[TARGET_CASE]:     [{'CLASS':'list-tag_blue', 'TEXT':'クエリに対応する症状'},
										{'CLASS':'list-tag_gray', 'TEXT':'クエリに対応する疾患原因遺伝子'}]
				},
				'DETAIL_LABEL': {
					'FIND_IMAGES':  '画像検索(Google)',
					'PHENOTYPE_LST':'症状一覧',
					'JA_REPORT':    '症例報告(J-STAGE)',
					'EN_REPORT':    '症例報告(PubMed)',
					'UR_DBMS':      '日本語疾患情報(UR-DBMS)'
				}
			},
			[LANGUAGE_EN] : {
				'TAB_LABEL':{
					[TARGET_OMIM]:     'Genetic Disease',
					[TARGET_ORPHANET]: 'Rare Disease',
					[TARGET_GENE]:     'Gene',
					[TARGET_CASE]:     'Case'
				},
				'SAMPLE_TAG_LABEL': {
					[TARGET_OMIM]:     [{'CLASS':'list-tag_blue', 'TEXT':'Matched Phenotype'},
										{'CLASS':'list-tag_green','TEXT':'Modes of Inheritance'},
										{'CLASS':'list-tag_gray', 'TEXT':'Causative Gene'}],
					[TARGET_ORPHANET]: [{'CLASS':'list-tag_blue', 'TEXT':'Matched Phenotype'},
										{'CLASS':'list-tag_green','TEXT':'Modes of Inheritance'},
										{'CLASS':'list-tag_gray', 'TEXT':'Causative Gene'}],
					[TARGET_GENE]:     [{'CLASS':'list-tag_blue', 'TEXT':'Matched Phenotype'},
										{'CLASS':'list-tag_red',  'TEXT':'Disease Name'},
										{'CLASS':'list-tag_green','TEXT':'Modes of Inheritance'}],
					[TARGET_CASE]:     [{'CLASS':'list-tag_blue', 'TEXT':'Matched Phenotype'},
										{'CLASS':'list-tag_gray', 'TEXT':'Matched Causative Gene'}]
				},
				'DETAIL_LABEL': {
					'FIND_IMAGES':   'Find images(Google)',
					'PHENOTYPE_LST': 'Clinical features',
					'JA_REPORT':     'Case reports(J-STAGE)',
					'EN_REPORT':     'Case reports(PubMed)',
					'UR_DBMS':       'UR-DBMS'
				}
			}
		};

	const NANDO_LABEL = {'NANDO_1':'難病情報(指定)','NANDO_2':'難病情報(小慢)','DEFAULT':'難病情報'}

	const SETTING_KEY_TARGET         = 'PCF-TARGET',
		  SETTING_KEY_PHENOTYPE      = 'PCF-PHENOTYPE',
		  SETTING_KEY_FILTER         = 'PCF-FILTER',
		  SETTING_KEY_FILTER_VGP     = 'PCF-FILTER-VGP',
		  SETTING_KEY_SIZE           = 'PCF-SIZE',
		  DISPLAY_FORMAT_FULL        = 'full', 
		  DISPLAY_FORMAT_SUMMARY     = 'summary',
		  SETTING_KEY_DISPLAY_FORMAT = 'PCF-DISPLAY-FORMAT',
		  SETTING_KEY_LANG           = 'PCF-LANG',
		  SETTING_KEY_ID_LST         = 'PCF-ID-LST',
		  SETTING_KEY_ONSELECTTAB    = 'onSelectTab',
		  SETTING_KEY_LOAD_FILTER_IDS= 'load_filter_ids',
		  SETTING_KEY_URL            = 'PCF-URL',
		  SHARE_TYPE_URL             = 'url',
		  SHARE_TYPE_LIKE            = 'like',
		  SETTING_KEY_SHARE          = 'PCF-SHARE',
		  SETTING_KEY_TARGET_ID      = 'PCF-TARGET-ID',
		  SETTING_KEY_RANK           = 'PCF-RANK',
		  SETTING_KEY_DETAIL         = 'PCF-DETAIL',
		  DOWNLOAD_MODE_ALL_SHOWN    = "all_shown",
		  DOWNLOAD_MODE_ALL          = "all",
		  DOWNLOAD_MODE_SELECTION    = "sel",
		  RANGE_FULL                 = "full",
		  RANGE_PARTIAL              = "partial",
		  SETTING_KEY_DOWNLOAD_MODE  = 'PCF-DOWNLOAD_MODE',
		  SETTING_KEY_DOWNLOAD_FORMAT= 'PCF-DOWNLOAD_FORMAT';

	var DEFAULT_SETTINGS = {
		[SETTING_KEY_TARGET]:         TARGET_OMIM,
		[SETTING_KEY_PHENOTYPE]:      '',
		[SETTING_KEY_FILTER]:         '',
		[SETTING_KEY_FILTER_VGP]:     '',
		[SETTING_KEY_SIZE]:           10,
		[SETTING_KEY_DISPLAY_FORMAT]: DISPLAY_FORMAT_FULL,
		[SETTING_KEY_LANG]:           LANGUAGE_JA,
		[SETTING_KEY_ONSELECTTAB]:    null,
		[SETTING_KEY_LOAD_FILTER_IDS]:null,
		'add_token':				  null,
	};


	const KEY_SETTING_OBJECT = 'pcf-setting',
		  KEY_TARGET         = 'pcf-target';

	const CLASS_ACTIVE                    = "pcf-active",
		  CLASS_STATUS_DETAIL_DATA_LOADED = "pcf-status-data-loaded",
		  CLASS_STATUS_RANKING_LOADED     = "pcf-status-ranking-data-loaded",
		  CLASS_TAB_BUTTON_PREFIX         = "tab-button-",
		  CLASS_TAB_BUTTON_ICON_PREFIX    = "icon-",
		  CLASS_ROW                       = "list-content",
		  CLASS_POPUP_PHENOTYPE           = "pcf-popup-phenotype",
		  CLASS_POPUP_PHENOTYPE_INLIST    = "pcf-popup-phenotype_inlist",
		  CLASS_POPUP_INHERITANCE         = "pcf-popup-inheritance",
		  CLASS_POPUP_GENE                = "pcf-popup-gene",
		  CLASS_POPUP_DISEASE             = "pcf-popup-disease";

	const	POPUP_TYPE_PHENOTYPE    = "popup-phenotype",
			POPUP_TYPE_INHERITANCE  = "popup-inheritance",
			POPUP_TYPE_GENE         = "popup-gene",
			POPUP_TYPE_DISEASE      = "popup-disease",
			POPUP_HTML_ID_HASH = {
				[POPUP_TYPE_PHENOTYPE]   : "popover_html_phenotype",
				[POPUP_TYPE_INHERITANCE] : "popover_html_phenotype",
				[POPUP_TYPE_GENE]        : "popover_html_gene",
				[POPUP_TYPE_DISEASE]     : "popover_html_disease"
			},
			POPUP_URL_HASH = {
				[POPUP_TYPE_PHENOTYPE]   : URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID,
				[POPUP_TYPE_INHERITANCE] : URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID,
				[POPUP_TYPE_GENE]        : URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID,
				[POPUP_TYPE_DISEASE]     : URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID
			},
			POPUP_URL_PARA_HASH = {
				[POPUP_TYPE_PHENOTYPE]   : URL_PARA_HPO_ID,
				[POPUP_TYPE_INHERITANCE] : URL_PARA_HPO_ID,
				[POPUP_TYPE_GENE]        : SETTING_KEY_ID_LST,
				[POPUP_TYPE_DISEASE]     : SETTING_KEY_ID_LST
			};

	const   INHERITANCE_LABEL_TO_ID = {
		'Autosomal dominant inheritance': 'HP:0000006',
		'Autosomal recessive inheritance':'HP:0000007',
		'X-linked inheritance':'HP:0001417',
		'X-linked recessive inheritance':'HP:0001419',
		'X-linked dominant inheritance':'HP:0001423',
		'Heterogeneous':'HP:0001425',
		'Multifactorial inheritance':'HP:0001426',
		'Mitochondrial inheritance':'HP:0001427',
		'Somatic mutation':'HP:0001428',
		'Somatic mosaicism':'HP:0001442',
		'Autosomal dominant somatic cell mutation':'HP:0001444',
		'Y-linked inheritance':'HP:0001450',
		'Autosomal dominant contiguous gene syndrome':'HP:0001452',
		'Contiguous gene syndrome':'HP:0001466',
		'Sex-limited autosomal dominant':'HP:0001470',
		'Familial predisposition':'HP:0001472',
		'Male-limited autosomal dominant':'HP:0001475',
		'Genetic anticipation':'HP:0003743',
		'Genetic anticipation with paternal anticipation bias':'HP:0003744',
		'Sporadic':'HP:0003745',
		'Polygenic inheritance':'HP:0010982',
		'Digenic inheritanec':'HP:0010984',
		'Autosomal dominant inheritance with maternal imprinting':'HP:0012275',
		'Autosomal dominant germline de novo mutation':'HP:0025352',
	};

	const LOGICAL_NOT = "LOGI-NOT",LOGICAL_AND = "LOGI-AND",LOGICAL_OR = "LOGI-OR",LOGICAL_AND_NOT = "LOGI-AND-NOT",LOGICAL_OR_NOT = "LOGI-OR-NOT",
		FILTER_TYPE_GENEID='GENEID:',FILTER_TYPE_HGNC='HGNC:',FILTER_TYPE_MONDO='MONDO:',FILTER_TYPE_HPO='HP:',FILTER_TYPE_NANDO='NANDO:',FILTER_TYPE_PA='PA:',FILTER_TYPE_PAA='PAA:',FILTER_TYPE_ALL='ALL',
		tokenLogicaloperatorItemAndValue='AND_',tokenLogicaloperatorItemORValue='',tokenLogicaloperatorItemNOTValue='NOT_',
		FILTER_URL_HASH = {
			[TARGET_OMIM]:     {
				[FILTER_TYPE_GENEID]: URL_PCF_FILTER_GET_OMIM_ID_BY_NCBI_GENE_ID,
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_OMIM_ID_BY_MONDO_ID,
				[FILTER_TYPE_HPO]   : URL_PCF_FILTER_GET_OMIM_ID_BY_INHERITANCE_HPO_ID,
				[FILTER_TYPE_ALL]   : URL_PCF_FILTER_GET_ALL_OMIM_ID
			},
			[TARGET_ORPHANET]: {
				[FILTER_TYPE_GENEID]: URL_PCF_FILTER_GET_ORPHA_ID_BY_NCBI_GENE_ID,
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_ORPHA_ID_BY_MONDO_ID,
				[FILTER_TYPE_HPO]   : URL_PCF_FILTER_GET_ORPHA_ID_BY_INHERITANCE_HPO_ID,
				[FILTER_TYPE_ALL]   : URL_PCF_FILTER_GET_ALL_ORPHA_ID
			},
			[TARGET_GENE]:     {
				[FILTER_TYPE_GENEID]: "",
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID,
				[FILTER_TYPE_HPO]   : URL_PCF_FILTER_GET_GENE_ID_BY_INHERITANCE_HPO_ID,
				[FILTER_TYPE_ALL]   : URL_PCF_FILTER_GET_ALL_GENE_ID
			},
			[TARGET_CASE]:     {
				[FILTER_TYPE_GENEID]: URL_PCF_FILTER_GET_CASE_ID_BY_NCBI_GENE_ID,
				[FILTER_TYPE_MONDO] : "",
				[FILTER_TYPE_HPO]   : "",
				[FILTER_TYPE_ALL]   : ""
			}
		},
		FILTER_NAME_URL_HASH = {
			[FILTER_TYPE_HGNC]  : URL_PCF_CONVERT_GENESYMBOL_TO_NCBI_GENE_ID,
			[FILTER_TYPE_GENEID]: URL_PCF_GET_GENE_DATA_BY_GENE_ID,    //URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID,
			[FILTER_TYPE_MONDO] : URL_PCF_GET_MONDO_DATA_BY_MONDO_ID,  //URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID,
			[FILTER_TYPE_HPO]   : URL_GET_HPO_DATA_BY_HPO_ID
		},
		FILTER_VGP_URL_HASH = {
			[TARGET_OMIM]:     {
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID,
				[FILTER_TYPE_NANDO] : URL_PCF_FILTER_GET_GENE_ID_BY_NANDO_ID,
				[FILTER_TYPE_PA]    : URL_PCF_FILTER_GET_GENE_ID_BY_PA_ID,
				[FILTER_TYPE_PAA]   : URL_PCF_FILTER_GET_GENE_ID_BY_PAA_ID
			},
			[TARGET_ORPHANET]:     {
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID,
				[FILTER_TYPE_NANDO] : URL_PCF_FILTER_GET_GENE_ID_BY_NANDO_ID,
				[FILTER_TYPE_PA]    : URL_PCF_FILTER_GET_GENE_ID_BY_PA_ID,
				[FILTER_TYPE_PAA]   : URL_PCF_FILTER_GET_GENE_ID_BY_PAA_ID
			},
			[TARGET_GENE]:     {
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID,
				[FILTER_TYPE_NANDO] : URL_PCF_FILTER_GET_GENE_ID_BY_NANDO_ID,
				[FILTER_TYPE_PA]    : URL_PCF_FILTER_GET_GENE_ID_BY_PA_ID,
				[FILTER_TYPE_PAA]   : URL_PCF_FILTER_GET_GENE_ID_BY_PAA_ID
			},
			[TARGET_CASE]:     {
				[FILTER_TYPE_GENEID] : URL_PCF_FILTER_GET_CASE_ID_BY_GENE_ID,
				[FILTER_TYPE_MONDO]  : URL_PCF_FILTER_GET_CASE_ID_BY_MONDO_ID,
				[FILTER_TYPE_NANDO]  : URL_PCF_FILTER_GET_CASE_ID_BY_NANDO_ID,
				[FILTER_TYPE_PA]     : URL_PCF_FILTER_GET_CASE_ID_BY_PA_ID,
				[FILTER_TYPE_PAA]    : URL_PCF_FILTER_GET_CASE_ID_BY_PAA_ID
			}
		},
		FILTER_VGP_NAME_URL_HASH = {
			[FILTER_TYPE_HGNC]  : URL_PCF_CONVERT_GENESYMBOL_TO_NCBI_GENE_ID,
			[FILTER_TYPE_GENEID]: URL_PCF_GET_GENE_DATA_BY_GENE_ID,   //URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID,
			[FILTER_TYPE_MONDO] : URL_PCF_GET_MONDO_DATA_BY_MONDO_ID, //URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID
			[FILTER_TYPE_NANDO] : URL_PCF_GET_NANDO_DATA_BY_NANDO_ID,
			[FILTER_TYPE_PA]    : URL_PCF_GET_PA_DATA_BY_PA_ID,
			[FILTER_TYPE_PAA]   : URL_PCF_GET_PAA_DATA_BY_PAA_ID
		},
		VGP_DOWNLOAD_URL_HASH = {
			[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID,
			[FILTER_TYPE_NANDO] : URL_PCF_FILTER_GET_GENE_ID_BY_NANDO_ID,
			[FILTER_TYPE_PA]    : URL_PCF_FILTER_GET_GENE_ID_BY_PA_ID,
			[FILTER_TYPE_PAA]   : URL_PCF_FILTER_GET_GENE_ID_BY_PAA_ID
		},
		VGP_EXPAND_URL_HASH = {
			[FILTER_TYPE_MONDO] : URL_PCF_EXPAND_GET_MONDO_ID_BY_MONDO_ID,
			[FILTER_TYPE_NANDO] : URL_PCF_EXPAND_GET_NANDO_ID_BY_NANDO_ID
		};



	// filter_id: ^(|AND_|OR_|NOT_)(GENEID|HGNC|MONDO|HP):\d+(|_ja)$
	const RegExp_AND = new RegExp(tokenLogicaloperatorItemAndValue, 'i');
	const RegExp_NOT = new RegExp(tokenLogicaloperatorItemNOTValue, 'i');
	function _get_logical_by_filter_id(filter_id,order){
		if(RegExp_AND.test(filter_id)){
			return LOGICAL_AND;
		}else if(RegExp_NOT.test(filter_id)){
			return LOGICAL_AND_NOT;
		}else if(order == 0){
			return LOGICAL_AND;
		}else{
			return LOGICAL_OR;
		}
	}
	
	function _get_logical_str_by_filter_id(filter_id){
		if(RegExp_AND.test(filter_id)){
			return tokenLogicaloperatorItemAndValue;
		}else if(RegExp_NOT.test(filter_id)){
			return tokenLogicaloperatorItemNOTValue;
		}else{
			return tokenLogicaloperatorItemORValue;
		}		
	}

	function _get_id_from_filter_id(filter_id){
		var id = filter_id.replace(/_ja$/i,'');
		id = id.replace(/^NOT_/i,'');
		id = id.replace(/^AND_/i,'');
		id = id.replace(/^OR_/i,'');
		return id;
	}

	function _get_filter_name_or_id(filter_type,lang,json_data,id){
		let ret = '';
		if(filter_type === FILTER_TYPE_MONDO){
			if('name_en' in json_data)	ret = json_data.name_en;
			if(lang === LANGUAGE_JA && 'name_ja' in json_data && !_isEmpty(json_data.name_ja)) ret = json_data.name_ja;

		}else if(filter_type === FILTER_TYPE_NANDO){
			if('name_en' in json_data)	ret = json_data.name_en;
			if(lang === LANGUAGE_JA && 'name_ja' in json_data && !_isEmpty(json_data.name_ja)) ret = json_data.name_ja;

		}else if(filter_type === FILTER_TYPE_PA){
			
			if('name_en' in json_data)	ret = json_data.name_en;

		}else if(filter_type === FILTER_TYPE_PAA){
			
			if('name_en' in json_data)	ret = json_data.name_en;
			
		}else if(filter_type === FILTER_TYPE_HPO){
			if(id in json_data){
				if('name_en' in json_data[id]) ret = json_data[id].name_en;
				if(lang === LANGUAGE_JA && 'name_ja' in json_data[id] && !_isEmpty(json_data[id].name_ja)) ret = json_data[id].name_ja;
			}
		}else if(filter_type === FILTER_TYPE_HGNC){
			if(_isArray(json_data) && json_data.length > 0){
				ret = json_data[0].ncbi_gene_id;
			}
		}else if("hgnc_gene_symbol" in json_data){
			ret = json_data["hgnc_gene_symbol"];
		}
		
		return ret;
	}

	const RegExp_HGNC   = new RegExp(FILTER_TYPE_HGNC,  'i');
	const RegExp_GENEID = new RegExp(FILTER_TYPE_GENEID,'i');
	const RegExp_MONDO  = new RegExp(FILTER_TYPE_MONDO, 'i');
	const RegExp_HPO    = new RegExp(FILTER_TYPE_HPO,   'i');
	const RegExp_NANDO  = new RegExp(FILTER_TYPE_NANDO, 'i');
	const RegExp_PA     = new RegExp(FILTER_TYPE_PA,    'i');
	const RegExp_PAA    = new RegExp(FILTER_TYPE_PAA,   'i');
	function _get_filter_type_by_filter_id(filter_id){
		if(RegExp_GENEID.test(filter_id)){
			return FILTER_TYPE_GENEID;
		}else if(RegExp_MONDO.test(filter_id)){
			return FILTER_TYPE_MONDO;
		}else if(RegExp_HPO.test(filter_id)){
			return FILTER_TYPE_HPO;
		}else if(RegExp_HGNC.test(filter_id)){
			return FILTER_TYPE_HGNC;
		}else if(RegExp_NANDO.test(filter_id)){
			return FILTER_TYPE_NANDO;
		}else if(RegExp_PA.test(filter_id)){
			return FILTER_TYPE_PA;
		}else if(RegExp_PAA.test(filter_id)){
			return FILTER_TYPE_PAA;
		}else{
			alert('found unknown type of filter id('+filter_id+')');
			return "";
		}
 	}

	// KEY:detail data id, VAL:detail data(JSON object)
	var pcf_detail_data_cache = {
		[TARGET_OMIM]:     {},
		[TARGET_ORPHANET]: {},
		[TARGET_GENE]:     {},
		[TARGET_CASE]:     {}
	};

	function _set_detail_data_to_cache(json_data, target){
		$.extend(pcf_detail_data_cache[target], json_data);
	}

	function _get_detail_data_from_cache(target){
		return pcf_detail_data_cache[target];
	}

	// key: hpo_id, val: {name_en, name_js}
	var pcf_phenotype_name_cache = {};
	
	function _set_phenotype_name_data_to_cache(json_data){
		$.extend(pcf_phenotype_name_cache, json_data);
	}

	function _is_phenotype_name_existed_at_cache(hpo_id){
		return(hpo_id in pcf_phenotype_name_cache);
	}
	
	function _get_phenotype_name_from_cache(hpo_id,language){
		if (!(hpo_id in pcf_phenotype_name_cache)) return "";
		if(language == LANGUAGE_EN)return pcf_phenotype_name_cache[hpo_id].name_en;
		return pcf_phenotype_name_cache[hpo_id].name_ja;
	}

	// key: [lang][mondo_id], val: count
	var pcf_case_report_count_cache = {
		[LANGUAGE_EN]:{},
		[LANGUAGE_JA]:{}
	}

	function _set_case_report_count_data_to_cache(json_data,lang){
		json_data.forEach(function(item){
			let mondo_id = item.id;
			pcf_case_report_count_cache[lang][mondo_id] = item.count;
		});
	}

	function _is_case_report_count_existed_at_cache(mondo_id,lang){
		return (mondo_id in pcf_case_report_count_cache[lang]);
	}

	function _get_case_report_count_data_from_cache(mondo_id,lang){
		if(_isEmpty(mondo_id)) return 0;
		if(!_is_case_report_count_existed_at_cache(mondo_id,lang)) return 0;
		return pcf_case_report_count_cache[lang][mondo_id];
	}

	// KEY:urlstr, VAL:array of Ranking data(JSON object)
	var pcf_ranking_cache = {};

	// return key(urlstr) of the ranking cache, contructed by the indicated target in the setting.
	function _contruct_ranking_cache_key(setting) {
		// use url as pcf_ranking_cache key
		if((SETTING_KEY_FILTER in setting && !_isEmpty(setting[SETTING_KEY_FILTER])) || 
		   (SETTING_KEY_FILTER_VGP in setting && !_isEmpty(setting[SETTING_KEY_FILTER_VGP]))){
			return _construct_url(URL_GET_RANKING_BY_HPO_ID_WITH_FILTER, setting);
		}else{
			return _construct_url(URL_GET_RANKING_BY_HPO_ID, setting);
		}
	}

	// contruct key and return relative ranking data(json object) in ranking cache 
	function _get_ranking_data_from_cache(setting){
		let key = _contruct_ranking_cache_key(setting);
		return pcf_ranking_cache[key];
	}

	function _get_ranking_data_without_filter_from_cache(setting){
		let setting_without_filter = $.extend(true,{}, setting,{[SETTING_KEY_FILTER]:'', [SETTING_KEY_FILTER_VGP]:''});
		let ranking_data_without_filter = _get_ranking_data_from_cache(setting_without_filter);
		return ranking_data_without_filter;
	}
	
	// save the ranking data array into cache with the url as key.
	function _set_ranking_data_into_cache(ranking_data,setting){
		let key = _contruct_ranking_cache_key(setting);
		pcf_ranking_cache[key] = ranking_data;
	}

	// check if exist ranking data in the cache.
	function _is_exist_ranking_data(setting){
		let key = _contruct_ranking_cache_key(setting);
		return (key in pcf_ranking_cache);
	}

	// target panel status:
	// 1. init:
	// 2. ranking data loaded:  CLASS_STATUS_RANKING_LOADED     = "pcf-status-ranking-data-loaded",
	// 3. detail data loaded:   CLASS_STATUS_DETAIL_DATA_LOADED = "pcf-status-data-loaded",
	function _set_target_status_init(target){
		let $target_tab_panel = tab_panel_lst[target];
		$target_tab_panel.removeClass(CLASS_STATUS_DETAIL_DATA_LOADED);
		$target_tab_panel.removeClass(CLASS_STATUS_RANKING_LOADED);
	}
	
	function _is_target_status_init(target){
		let $target_tab_panel = tab_panel_lst[target];
		return !($target_tab_panel.hasClass(CLASS_STATUS_RANKING_LOADED) || 
				 $target_tab_panel.hasClass(CLASS_STATUS_DETAIL_DATA_LOADED));
	}
	
	function _is_target_status_data_loaded(target){
		let $target_tab_panel = tab_panel_lst[target];
		return $target_tab_panel.hasClass(CLASS_STATUS_DETAIL_DATA_LOADED);
	}
	
	function _set_target_status_ranking_data_loaded(target){
		let $target_tab_panel = tab_panel_lst[target];
		$target_tab_panel.addClass(CLASS_STATUS_RANKING_LOADED);
	}

	function _set_target_status_detail_data_loaded(target){
		let $target_tab_panel = tab_panel_lst[target];
		$target_tab_panel.addClass(CLASS_STATUS_DETAIL_DATA_LOADED);
	}

	function _set_target_status_detail_data_unloaded(target){
		let $target_tab_panel = tab_panel_lst[target];
		$target_tab_panel.removeClass(CLASS_STATUS_DETAIL_DATA_LOADED);
	}

	// for load data for new page , return an array of ids,which are not loaded into tab content panel yet.
	// 1. get all ids from ranking data cache.
	// 2. find the start position
	// 3. retrun the ids of new page 
	function _find_unloaded_detail_data_ids(setting){
		let retLst = [];
		
		let load_counter = setting[SETTING_KEY_SIZE];

		let num_loaded = _get_target_loaded_num(setting[SETTING_KEY_TARGET]);

		let ranking_data_lst = _get_ranking_data_from_cache(setting);

		let target = setting[SETTING_KEY_TARGET];
		let cached_detail_data = _get_detail_data_from_cache(target);

		let start = 0;
		if(num_loaded > 0) start = num_loaded;

		for(let i=start; (i<ranking_data_lst.length && load_counter > 0); i++){
			//check if existed at cache.
			if(!(ranking_data_lst[i].id in cached_detail_data)){
				retLst.push(ranking_data_lst[i].id);
			}
			load_counter--;
		}
		
		return retLst;
	}


	function _find_unloaded_hpo_ids(setting){
		let retLst = {};

		let load_counter = setting[SETTING_KEY_SIZE];

		let num_loaded = _get_target_loaded_num(setting[SETTING_KEY_TARGET]);

		let ranking_data_lst = _get_ranking_data_from_cache(setting);

		let start = 0;
		if(num_loaded > 0) start = num_loaded;

		for(let i=start; (i<ranking_data_lst.length && load_counter > 0); i++){
			//check if existed at cache.
			let phenoList = ranking_data_lst[i].matched_hpo_id;
			phenoList.split(',').forEach(function(hpo_id){
				if(!_is_phenotype_name_existed_at_cache(hpo_id)){
					retLst[hpo_id] = 1;
				}
			});

			load_counter--;
		}
		
		return Object.keys(retLst);
	}

	function _find_unloaded_case_report_count_data_ids(setting, lang){
		let retLst = {};
		
		let load_counter = setting[SETTING_KEY_SIZE];

		let num_loaded = _get_target_loaded_num(setting[SETTING_KEY_TARGET]);

		let ranking_data_lst = _get_ranking_data_from_cache(setting);

		let target = setting[SETTING_KEY_TARGET];
		let cached_detail_data = _get_detail_data_from_cache(target);

		let start = 0;
		if(num_loaded > 0) start = num_loaded;

		for(let i=start; (i<ranking_data_lst.length && load_counter > 0); i++){
			//check if existed at cache.
			if(ranking_data_lst[i].id in cached_detail_data){
				let detail_data = cached_detail_data[ranking_data_lst[i].id];
				if(!_isEmpty(detail_data.mondo_id)){
					detail_data.mondo_id.forEach(function(mondo_id){
						if(!_is_case_report_count_existed_at_cache(mondo_id, lang)){
							retLst[mondo_id] = 1;
						}
					});
				}
			}
			load_counter--;
		}
		
		return Object.keys(retLst);
	}



	// return [address]?[para1]=[val1]&[para2]=[val2]&...
	function _construct_url_str(url, datalst){
		let str = url + "?";
		for(let para_name in datalst){
			str = str + para_name + "=" + datalst[para_name] + "&";
		}
		return str;
	}
	
	//contruct url
	function _construct_url(url_key, setting){
		
		let url_str = "";
		
		if(url_key === URL_GET_RANKING_BY_HPO_ID){
			url_str = _construct_url_str(URL_GET_RANKING_BY_HPO_ID, {[URL_PARA_TARGET]   : setting[SETTING_KEY_TARGET], 
																	[URL_PARA_PHENOTYPE]: setting[SETTING_KEY_PHENOTYPE]});
																	
		}else if(url_key === URL_GET_RANKING_BY_HPO_ID_WITH_FILTER){
			url_str = _construct_url_str(URL_GET_RANKING_BY_HPO_ID_WITH_FILTER, {[URL_PARA_TARGET]   : setting[SETTING_KEY_TARGET], 
																				[URL_PARA_PHENOTYPE] : setting[SETTING_KEY_PHENOTYPE],
																				[URL_PARA_FILTER]    : setting[SETTING_KEY_FILTER],
																				[URL_PARA_FILTER_VGP]: setting[SETTING_KEY_FILTER_VGP]});
		}else if(url_key === URL_GET_DATA_BY_ID && setting[SETTING_KEY_TARGET] === TARGET_OMIM){
			url_str = _construct_url_str(URL_GET_OMIM_DATA_BY_OMIM_ID,{[URL_PARA_OMIM_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_GET_DATA_BY_ID && setting[SETTING_KEY_TARGET] === TARGET_ORPHANET){
			url_str = _construct_url_str(URL_GET_ORPHA_DATA_BY_ORPHA_ID,{[URL_PARA_ORPHA_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_GET_DATA_BY_ID && setting[SETTING_KEY_TARGET] === TARGET_GENE){
			url_str = _construct_url_str(URL_GET_GENE_DATA_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID){
			url_str = _construct_url_str(URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID,{[URL_PARA_HPO_ID]: setting[URL_PARA_HPO_ID]});
		}else if(url_key === URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID){
			let ent_id = setting[SETTING_KEY_ID_LST];
			let ncbi_gene_id = ent_id.replace(/ENT/,"GENEID");
			url_str = _construct_url_str(URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]:ncbi_gene_id});
		}else if(url_key === URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID){
			url_str = _construct_url_str(URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_GET_HPO_DATA_BY_OMIM_ID){
			url_str = _construct_url_str(URL_GET_HPO_DATA_BY_OMIM_ID,{[URL_PARA_OMIM_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_GET_HPO_DATA_BY_ORPHA_ID){
			url_str = _construct_url_str(URL_GET_HPO_DATA_BY_ORPHA_ID,{[URL_PARA_ORPHA_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_GET_HPO_DATA_BY_HPO_ID){
			url_str = _construct_url_str(URL_GET_HPO_DATA_BY_HPO_ID,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_GET_HPO_DATA_BY_HPO_ID_LOCAL){
			url_str = _construct_url_str(URL_GET_HPO_DATA_BY_HPO_ID_LOCAL,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID){
			url_str = _construct_url_str(URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID,{ [URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST],[URL_PARA_LANG]: setting[SETTING_KEY_LANG]});
		}else if(url_key === URL_GET_CASE_REPORT_BY_MONDO_ID){
			url_str = _construct_url_str(URL_GET_CASE_REPORT_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST],[URL_PARA_LANG]: setting[SETTING_KEY_LANG]});
		}else if(url_key === URL_PCF_FILTER_GET_OMIM_ID_BY_MONDO_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_OMIM_ID_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_OMIM_ID_BY_NCBI_GENE_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_OMIM_ID_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]: setting[SETTING_KEY_ID_LST].replace(/ENT/,"GENEID")});
		}else if(url_key === URL_PCF_FILTER_GET_OMIM_ID_BY_INHERITANCE_HPO_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_OMIM_ID_BY_INHERITANCE_HPO_ID,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_ORPHA_ID_BY_MONDO_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_ORPHA_ID_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_ORPHA_ID_BY_NCBI_GENE_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_ORPHA_ID_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]: setting[SETTING_KEY_ID_LST].replace(/ENT/,"GENEID")});
		}else if(url_key === URL_PCF_FILTER_GET_ORPHA_ID_BY_INHERITANCE_HPO_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_ORPHA_ID_BY_INHERITANCE_HPO_ID,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_GENE_ID_BY_NANDO_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_GENE_ID_BY_NANDO_ID,{[URL_PARA_NANDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_GET_NANDO_DATA_BY_NANDO_ID){
			url_str = _construct_url_str(URL_PCF_GET_NANDO_DATA_BY_NANDO_ID,{[URL_PARA_NANDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_GENE_ID_BY_PA_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_GENE_ID_BY_PA_ID,{[URL_PARA_PA_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_GET_PA_DATA_BY_PA_ID){
			url_str = _construct_url_str(URL_PCF_GET_PA_DATA_BY_PA_ID,{[URL_PARA_PA_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_GET_MONDO_DATA_BY_MONDO_ID){
			url_str = _construct_url_str(URL_PCF_GET_MONDO_DATA_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_GET_GENE_DATA_BY_GENE_ID){
			url_str = _construct_url_str(URL_PCF_GET_GENE_DATA_BY_GENE_ID,{[URL_PARA_GENE_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_EXPAND_GET_MONDO_ID_BY_MONDO_ID){
			url_str = _construct_url_str(URL_PCF_EXPAND_GET_MONDO_ID_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_EXPAND_GET_NANDO_ID_BY_NANDO_ID){
			url_str = _construct_url_str(URL_PCF_EXPAND_GET_NANDO_ID_BY_NANDO_ID,{[URL_PARA_NANDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_GENE_ID_BY_PAA_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_GENE_ID_BY_PAA_ID,{[URL_PARA_PAA_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_GET_PAA_DATA_BY_PAA_ID){
			url_str = _construct_url_str(URL_PCF_GET_PAA_DATA_BY_PAA_ID,{[URL_PARA_PAA_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_GENE_ID_BY_INHERITANCE_HPO_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_GENE_ID_BY_INHERITANCE_HPO_ID,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_CASE_ID_BY_NCBI_GENE_ID){
			url_str = _construct_url_str(URL_PCF_FILTER_GET_CASE_ID_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]: setting[SETTING_KEY_ID_LST].replace(/ENT/,"GENEID")});
		}else if(url_key === URL_PCF_FILTER_GET_CASE_ID_BY_GENE_ID) {
			url_str = _construct_url_str(URL_PCF_FILTER_GET_CASE_ID_BY_GENE_ID,{[URL_PARA_GENE_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_CASE_ID_BY_MONDO_ID) {
			url_str = _construct_url_str(URL_PCF_FILTER_GET_CASE_ID_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_CASE_ID_BY_NANDO_ID) {
			url_str = _construct_url_str(URL_PCF_FILTER_GET_CASE_ID_BY_NANDO_ID,{[URL_PARA_NANDO_ID]: setting[SETTING_KEY_ID_LST]});
		}else if(url_key === URL_PCF_FILTER_GET_CASE_ID_BY_PA_ID) {
			url_str = _construct_url_str(URL_PCF_FILTER_GET_CASE_ID_BY_PA_ID,{[URL_PARA_PA_ID]: setting[SETTING_KEY_ID_LST]});  
		}else if(url_key === URL_PCF_FILTER_GET_CASE_ID_BY_PAA_ID) {
			url_str = _construct_url_str(URL_PCF_FILTER_GET_CASE_ID_BY_PAA_ID,{[URL_PARA_PAA_ID]: setting[SETTING_KEY_ID_LST]});  
		}else if(url_key === URL_PCF_CONVERT_GENESYMBOL_TO_NCBI_GENE_ID){
			url_str = _construct_url_str(URL_PCF_CONVERT_GENESYMBOL_TO_NCBI_GENE_ID,{hgnc_gene_symbol: setting[SETTING_KEY_ID_LST].replace(/HGNC:/i,'')});
		}else if(url_key === URL_SHARE){
			if(setting[SETTING_KEY_SHARE] === SHARE_TYPE_URL){
				// share url
				url_str = _construct_url_str(URL_SHARE,{[URL_PARA_SHARE]:SHARE_TYPE_URL, [URL_PARA_URL]:setting[SETTING_KEY_URL]});
			}else{
				// share like
				url_str = _construct_url_str(URL_SHARE,{[URL_PARA_SHARE]:SHARE_TYPE_LIKE, [URL_PARA_TARGET]:setting[SETTING_KEY_TARGET], [URL_PARA_PHENOTYPE]:setting[SETTING_KEY_ID_LST], [URL_PARA_TARGET_ID]:setting[SETTING_KEY_TARGET_ID]});
			}
		}else if(url_key === URL_DOWNLOAD){

			let target_id = setting[SETTING_KEY_TARGET_ID];
			let r_range   = RANGE_PARTIAL;
			if(setting[SETTING_KEY_DOWNLOAD_MODE] === DOWNLOAD_MODE_ALL){
				r_range   = RANGE_FULL;
				target_id = '';
			}

			return {url:	URL_DOWNLOAD,
				data:	URL_PARA_TARGET    + "=" + setting[SETTING_KEY_TARGET] + "&" +
					URL_PARA_PHENOTYPE + "=" + setting[SETTING_KEY_PHENOTYPE].replace(/_ja/gi,"") + "&" +
					URL_PARA_TARGET_ID + "=" + encodeURIComponent(target_id) + "&" +
					URL_PARA_FORMAT    + "=" + setting[SETTING_KEY_DOWNLOAD_FORMAT]  + "&" +
					URL_PARA_RANGE     + "=" + r_range
				};
		}
		
		return url_str;
	}

	// some util functions
	var _isObject   = function(value) {return $.isPlainObject(value);},
		_isArray    = function(value) {return $.isArray(value);},
		_isFunction = function(value) {return $.isFunction(value);},
		_isEmpty    = function(value, allowEmptyString) {
			return	(value === null) || (value === undefined) || 
					(!allowEmptyString ? value === '' : false) || 
					(_isArray(value) && value.length === 0)||
					(_isObject(value) && Object.keys(value).length === 0);	
		},
		_isExistVal = function(key, hash){
			if(_isEmpty(hash))  return false;
			if (!(key in hash)) return false;
			return !_isEmpty(hash[key]);
		},
		_parseJson= function(text) {
			var json_data = null;
			try {
				json_data = JSON.parse(text);
			} catch (d) {}
			return json_data;
		},
		_get_id_from_url = function(url_str){
			let ret = "";
			let tmp = url_str.split("?");
			if(tmp.length > 1){
				ret = tmp[1];
			}
			return ret;
		},
		_get_id_from_url_v2 = function(url_str){
			let ret = "";
			let tmp = url_str.split("/");
			if(tmp.length > 1){  
				ret = tmp[tmp.length -1];
			}
			return ret;  
		};

	
	// use target as key
	var tab_button_lst = {}, tab_panel_lst  = {};

	function _get_target_loaded_num(target){
		let $target_tab_panel = tab_panel_lst[target];
		return $target_tab_panel.find("." + CLASS_ROW).length;
	}

	function _get_active_target(){
		for(let target in tab_panel_lst){
			let $panel = tab_panel_lst[target];
			if($panel.hasClass(CLASS_ACTIVE)) return target;
		}
		// ありえない
		alert("SYS ERROR: no active panel!");
		return null;
	}


	function _set_active_target(target_in){
		for(let target in tab_button_lst){
			let $button = tab_button_lst[target];
			$button.removeClass(CLASS_ACTIVE);
		}

		for(let target in tab_panel_lst){
			let $panel = tab_panel_lst[target];
			$panel.removeClass(CLASS_ACTIVE);
		}

		tab_button_lst[target_in].addClass(CLASS_ACTIVE);
		tab_panel_lst[target_in].addClass(CLASS_ACTIVE);
	}
	
	// clear all of the data and element in the tab page
	// reset the setting data with the input
	// set the tab page to the unload status.
	function _clear_all_and_update_setting(setting) {
		for(let target in tab_panel_lst){
			let $panel = tab_panel_lst[target];
			$panel.empty();
			let old_setting = $panel.data(KEY_SETTING_OBJECT); 
			let new_setting = $.extend(old_setting, setting);
			$panel.data(KEY_SETTING_OBJECT,new_setting);
			_set_target_status_init(target);
		}
	}

	function _selectTab(target){
		_set_active_target(target);

		let $target_tab_panel = tab_panel_lst[target];
		let current_setting = $target_tab_panel.data(KEY_SETTING_OBJECT);

		if(_isFunction(current_setting[SETTING_KEY_ONSELECTTAB])){
			current_setting[SETTING_KEY_ONSELECTTAB](LANGUAGE[current_setting[SETTING_KEY_LANG]]['TAB_LABEL'][target],target);
		}
		
		if(_is_target_status_data_loaded(target)) return;

		if(_isEmpty(current_setting[SETTING_KEY_PHENOTYPE])) return;

		_run_pcf_search_ranking_data(current_setting);
	}

	function _contruct_popup_content_val(key,hash,delimer){
		if(!_isExistVal(key,hash)) return '';
		if(_isEmpty(hash[key])) return '';
		if(_isArray(hash[key])) {
			if(_isEmpty(delimer)) return hash[key].join(',');
			return hash[key].join(delimer);
		}
		return hash[key];
	}

	function _contruct_popup_content_val_hash(key_id,key_url,hash){
		if(!_isExistVal(key_id,hash)) return '';
		let ret = "";
		for(let i =0;i<hash[key_id].length;i++){
			let id  = hash[key_id][i];
			let url = hash[key_url][i];
			ret = ret + "<a href=\""+url+"\" target=\"_blank\">"+id+"</a>"
		}
		return ret;
	}

	function _contruct_popup_content(popup_id, popup_type, popup_data, popup_class){
		
		let popup_html_id = POPUP_HTML_ID_HASH[popup_type];
		let content       = $("#"+popup_html_id).html();
		let max_text_len  = popup_id.length;

		if(popup_type === POPUP_TYPE_PHENOTYPE || popup_type === POPUP_TYPE_INHERITANCE){

			let name_ja = _contruct_popup_content_val('name_ja',popup_data);
			let name_en = _contruct_popup_content_val('name_en',popup_data);
			if(_isEmpty(name_ja) && _isEmpty(name_en)){
				return ['no data found for '+ popup_id, max_text_len];
			}
			
			if(max_text_len < name_ja.length) max_text_len =name_ja.length; 
			if(max_text_len < name_en.length) max_text_len =name_en.length;
			
			content = content.replace(/popup_content_class/g, popup_class);
			content = content.replace(/popup_content_pcf-phenotype-id/g, popup_id);
			
			let hpo_url = _contruct_popup_content_val('hpo_url',popup_data);
			if(max_text_len < hpo_url.length) max_text_len =hpo_url.length;	
			content = content.replace(/popup_content_hpo_url/g, hpo_url);	
			content = content.replace(/popup_content_name_ja/g, name_ja);
			content = content.replace(/popup_content_name_en/g, name_en);
			
			let definition = _contruct_popup_content_val('definition',popup_data);
			if(max_text_len < definition.length) max_text_len = definition.length;
			content = content.replace(/popup_content_definition/g, definition);
			
			let comment = _contruct_popup_content_val('comment',popup_data);
			if(max_text_len < comment.length) max_text_len = comment.length;
			content = content.replace(/popup_content_comment/g, comment);
			
			let synonym = _contruct_popup_content_val('synonym',popup_data,', ');
			if(max_text_len < synonym.length) max_text_len = synonym.length;
			content = content.replace(/popup_content_synonym/g, synonym);
			
		}else if(popup_type === POPUP_TYPE_GENE){
			let type_of_gene = _contruct_popup_content_val('type_of_gene',popup_data);
			if(_isEmpty(type_of_gene)){
				return ['no data found for '+ popup_id, max_text_len];
			}
			content = content.replace(/popup_content_class/g, popup_class);
			content = content.replace(/popup_content_pcf-gene-id/g, popup_id);
			
				
			content = content.replace(/popup_content_ncbi_gene_url/g,   _contruct_popup_content_val('ncbi_gene_url',popup_data));
			content = content.replace(/popup_content_hgnc_gene_url/g,   _contruct_popup_content_val('hgnc_gene_url',popup_data));
			
			let hgnc_gene_symbol = _contruct_popup_content_val('hgnc_gene_symbol',popup_data);
			if(hgnc_gene_symbol) max_text_len  = 60;// based on the letter count of Link
			content = content.replace(/popup_content_hgnc_gene_symbol/g, hgnc_gene_symbol);
			
			let synonym = _contruct_popup_content_val('synonym',popup_data,', ');
			if(max_text_len < synonym.length) max_text_len = synonym.length;
			content = content.replace(/popup_content_synonym/g, synonym);
			
			let full_name = _contruct_popup_content_val('full_name',popup_data);
			if(max_text_len < full_name.length) max_text_len = full_name.length;
			content = content.replace(/popup_content_full_name/g, full_name);
			
			let other_full_name = _contruct_popup_content_val('other_full_name',popup_data,', ');
			if(max_text_len < other_full_name.length) max_text_len = other_full_name.length;
			content = content.replace(/popup_content_other_full_name/g, other_full_name);
		
			let summary = _contruct_popup_content_val('ncbi_gene_summary',popup_data,', ');
			if(max_text_len < summary.length) max_text_len = summary.length;
			content = content.replace(/popup_content_summary/g, summary);
	
			if(max_text_len < type_of_gene.length) max_text_len = type_of_gene.length;
			content = content.replace(/popup_content_type_of_gene/g,    type_of_gene);
			
			let location = _contruct_popup_content_val('location',popup_data);
			if(max_text_len < location.length) max_text_len = location.length;
			content = content.replace(/popup_content_location/g, location);
			
		}else if(popup_type === POPUP_TYPE_DISEASE){
			let name_ja = _contruct_popup_content_val('name_ja',popup_data);
			let name_en = _contruct_popup_content_val('name_en',popup_data);
			if(_isEmpty(name_ja) && _isEmpty(name_en)){
				return ['no data found for '+ popup_id, max_text_len];
			}

			if(max_text_len < name_ja.length) max_text_len =name_ja.length; 
			if(max_text_len < name_en.length) max_text_len =name_en.length;

			content = content.replace(/popup_content_class/g, popup_class);
			content = content.replace(/popup_content_pcf-disease-id/g, popup_id);
			content = content.replace(/popup_content_mondo_url/g, _contruct_popup_content_val('mondo_url',popup_data));	
			
			content = content.replace(/popup_content_name_ja/g,   name_ja);
			content = content.replace(/popup_content_name_en/g,   name_en);
			
			let definition = _contruct_popup_content_val('definition',popup_data);
			if(max_text_len < definition.length) max_text_len = definition.length;
			content = content.replace(/popup_content_definition/g, definition);

			let synonym = _contruct_popup_content_val('synonym',popup_data,', ');
			if(max_text_len < synonym.length) max_text_len = synonym.length;
			content = content.replace(/popup_content_synonym/g, synonym);

			let omim_list = _contruct_popup_content_val_hash('omim_id','omim_url',popup_data);
			if(max_text_len < omim_list.length) max_text_len = omim_list.length;
			content = content.replace(/popup_content_omim_list/g, omim_list);

			let orpha_list = _contruct_popup_content_val_hash('orpha_id','orpha_url',popup_data);
			if(max_text_len < orpha_list.length) max_text_len = orpha_list.length;
			content = content.replace(/popup_content_orpha_list/g,orpha_list);
		}else {
			//ありえない
		}

		return [content, max_text_len];
	}

	function _contruct_popup_button(popup_type,id,list_tag,text,popup_class){
		let button = document.createElement('button');
		button.textContent = text;
		button.classList.add("list-tag");
		button.classList.add(list_tag);
		
		tippy(button, {
			arrow:         false,
	  		allowHTML:     true,
	 		appendTo:      document.body,
			animation:     'scale',
			animationFill: true,
			//delay:         [400, null],
			trigger:      'click',
			maxWidth:      400,
			strategy:     'fixed',
			interactive:  true,
			theme:        'pcf-popup',
			placement:    'bottom-start',
	  		content:      'Loading...',
			offset:       [0,0],
			popup_type:   popup_type,
			popup_id:     id,
			popup_class:  popup_class,
			onCreate(instance) {
			    // Setup our own custom state properties
			    instance._isFetching = false;
			    instance._src = null;
			    instance._error = null;
			},
			onShow(instance) {
				if (instance._isFetching || instance._src || instance._error) {
					return;
				}

				instance._isFetching = true;
 
				let popup_type   = instance.props.popup_type;
				let popup_id     = instance.props.popup_id;
				let popup_class  = instance.props.popup_class;
				
				let url_str      = POPUP_URL_HASH[popup_type];
				let url_id_key   = POPUP_URL_PARA_HASH[popup_type];
				let url_str_full = _construct_url(url_str,{[url_id_key]: popup_id}); 

				$.ajax({	
					url:      url_str_full,
					type:     'GET',
					async:    true,
					dataType: 'text',
				}).done(function(data,textStatus,jqXHR) {
						let json_data = JSON.parse(data);
						let [content, max_text_len] = _contruct_popup_content(popup_id,popup_type,json_data, popup_class);
						if(max_text_len<40){
							instance.setProps({maxWidth: 500});
						}else if(max_text_len<60){
							instance.setProps({maxWidth: 600});
						}else if(max_text_len<80){
							instance.setProps({maxWidth: 700});
						}else if(max_text_len<120){
							instance.setProps({maxWidth: 800});
						}else{
							instance.setProps({maxWidth: 850});
						}
						instance.setContent(content);
						instance._src = 'done';
				}).fail(function(jqXHR, textStatus, errorThrown ) {
		        	// Fallback if the network request failed
					instance.setContent(`Request failed from server.`);
					instance._src = null;
				}).always(function(){
					instance._isFetching = false;
				});
			},
		});
		
		return $(button);
	}

	function _contruct_detail(id, phenoList, item, lang, target, display_format, $container_panel, ranking_item, setting){

		let isJA = (lang === LANGUAGE_JA);
		let isDisplayFull = (display_format === DISPLAY_FORMAT_FULL);
		
		// 1. english title
		let $h3 = $('<h3>').appendTo($container_panel);
		if(target === TARGET_CASE){
			$h3.html("<a href=\""+ranking_item.url+"\" target=\"_blank\">"+id+"</a>");
			$h3.addClass('title-case');
		}else if("omim_disease_name_en" in item){
			$h3.text(item.omim_disease_name_en);
		}else if("orpha_disease_name_en"in item){
			$h3.text(item.orpha_disease_name_en);
		}else if("hgnc_gene_symbol" in item){
			$h3.text(item.hgnc_gene_symbol + " - " + item.full_name);
		}else{
			$h3.text(id);
		}

		// 2. japanese title
		if(target === TARGET_CASE){
			$h3.css({'margin-bottom':'0.5em'});
		} else if(isJA && ("omim_disease_name_ja" in item)){
			$("<h2>").text(item.omim_disease_name_ja).appendTo($container_panel);
		}else if(isJA && ("orpha_disease_name_ja" in item)){
			$("<h2>").text(item.orpha_disease_name_ja).appendTo($container_panel);
		}else if(target === TARGET_GENE){
			if(!_isEmpty(item.synonym)){
				$("<h2>").text('Also known as: ' + item.synonym.join(', ')).appendTo($container_panel);
			}
		}else{
			$h3.css({'margin-bottom':'0.5em'});
		}

		// 3. phenotypes list
		if(!_isEmpty(phenoList)){
			let $container_list_query = $('<div>').addClass("d-flex").addClass("flex-wrap").addClass("list-tag-wrapper").appendTo($container_panel);
			phenoList.split(',').forEach(function(hpo_id){
				let label_text = _get_phenotype_name_from_cache(hpo_id,lang);
				if(_isEmpty(label_text)){
					let label_text_en = _get_phenotype_name_from_cache(hpo_id,LANGUAGE_EN);
					if(!_isEmpty(label_text_en)){
						label_text= label_text_en;	
					}else{
						label_text= hpo_id;
					}
				}
				_contruct_popup_button(POPUP_TYPE_PHENOTYPE,hpo_id, "list-tag_blue", label_text, CLASS_POPUP_PHENOTYPE).appendTo($container_list_query);
			});
		}
		
		// 4. 
		if(target === TARGET_OMIM || target === TARGET_ORPHANET){
			if((_isExistVal("inheritance_en",item)) || (_isExistVal("hgnc_gene_symbol",item) )){
				
				//let $container_list_heredity = $('<div>').addClass("list-heredity-disease").appendTo($container_panel);
				let $container_list_heredity = $('<div>').addClass("d-flex").addClass("flex-wrap").addClass("list-tag-wrapper").appendTo($container_panel);
				
				if(_isExistVal("inheritance_en",item)){
					for(let hpo_id in item.inheritance_en){
						let text = item.inheritance_en[hpo_id];
						if(isJA)text = item.inheritance_ja[hpo_id];
						_contruct_popup_button(POPUP_TYPE_INHERITANCE,hpo_id, "list-tag_green", text, CLASS_POPUP_INHERITANCE).appendTo($container_list_heredity);
					}
				}
	
				if(_isExistVal("hgnc_gene_symbol",item)){
					for(let i=0;i<item.hgnc_gene_symbol.length;i++){
						let text = item.hgnc_gene_symbol[i];
						let id    = item.ncbi_gene_id[i];
						_contruct_popup_button(POPUP_TYPE_GENE,id, "list-tag_gray", text, CLASS_POPUP_GENE).appendTo($container_list_heredity);
					}
				}
			}
		}else if(target === TARGET_GENE){
			if(_isExistVal("mondo_disease_name_en",item)){
				let $container_list_diseasename = $('<div>').addClass("d-flex").addClass("flex-wrap").addClass("list-tag-wrapper").appendTo($container_panel);
				
				for(let mondo_id in item.mondo_disease_name_en){
					let text = item.mondo_disease_name_en[mondo_id];
					if(isJA && _isExistVal(mondo_id, item.mondo_disease_name_ja)) text = item.mondo_disease_name_ja[mondo_id];
					_contruct_popup_button(POPUP_TYPE_DISEASE,mondo_id, "list-tag_red", text, CLASS_POPUP_DISEASE).appendTo($container_list_diseasename);
					
				}
			}
			
			if(_isExistVal("inheritance_en",item)){
				let $container_list_disease = $('<div>').addClass("d-flex").addClass("flex-wrap").addClass("list-tag-wrapper").appendTo($container_panel);
				for(let i=0;i<item.inheritance_en.length;i++){
					let text = item.inheritance_en[i];
					if(isJA)text = item.inheritance_ja[i];
					//$('<span>').addClass("list-tag").addClass("list-tag_green").text(text).appendTo($container_list_disease);

					if(item.inheritance_en[i] in INHERITANCE_LABEL_TO_ID){
						let hpo_id = INHERITANCE_LABEL_TO_ID[item.inheritance_en[i]];
						_contruct_popup_button(POPUP_TYPE_INHERITANCE,hpo_id, "list-tag_green", text, CLASS_POPUP_INHERITANCE).appendTo($container_list_disease);
					}else{
						$('<span>').addClass("list-tag").addClass("list-tag_green").text(text).appendTo($container_list_disease);
					}
				}
			}
		}else if(target === TARGET_CASE){
			if(_isExistVal("hgnc_gene_symbol",ranking_item)){

				//let $container_list_heredity = $('<div>').addClass("list-heredity-disease").appendTo($container_panel);
				let $container_list_heredity = $('<div>').addClass("d-flex").addClass("flex-wrap").addClass("list-tag-wrapper").appendTo($container_panel);

				Object.keys(ranking_item.hgnc_gene_symbol).forEach(function(id){
					let text = ranking_item["hgnc_gene_symbol"][id];
					_contruct_popup_button(POPUP_TYPE_GENE,id, "list-tag_gray", text, CLASS_POPUP_GENE).appendTo($container_list_heredity);
				});
			}
		}
		
		// 5. description p
		if(target !== TARGET_CASE && isDisplayFull && _isExistVal("description",item)){
			let $p = $('<p>').text(item.description).appendTo($container_panel);
			let href_str = encodeURIComponent(item.description);
			    href_str = "https://translate.google.co.jp/?sl=en&tl=ja&text=" + href_str + "&op=translate&hl=ja";
			
			$("<a>").text(" >> Translate(Google)").attr( 'href', href_str).attr('target', '_blank').appendTo($p);
		}else if(target === TARGET_GENE  && isDisplayFull){
			if(_isExistVal("ncbi_gene_summary",item)){
				let $p = $('<p>').text(item.ncbi_gene_summary).appendTo($container_panel);
				let href_str = encodeURIComponent(item.ncbi_gene_summary);
        	                    href_str = "https://translate.google.co.jp/?sl=en&tl=ja&text=" + href_str + "&op=translate&hl=ja";
	                        $("<a>").text(" >> Translate(Google)").attr( 'href', href_str).attr('target', '_blank').appendTo($p);
			}
		}
		
		
		// 6. list link line
		if(isDisplayFull && target !== TARGET_CASE){
			let $list_link_panel = $('<div>').addClass("d-flex").addClass("flex-wrap").addClass("list-link").appendTo($container_panel);
			
			if(_isExistVal("omim_url" ,item)){
				$('<a>').text(id).attr('href',item.omim_url).attr('target','_blank').appendTo($list_link_panel);
			} else if(_isExistVal("orpha_url" ,item)){
				$('<a>').text(id).attr('href',item.orpha_url).attr('target','_blank').appendTo($list_link_panel);
			} else if(target === TARGET_GENE){
				let id_n = id.replace('GENEID:','');
				$('<a>').text("NCBI GENE ID:" + id_n).attr('href',"https://www.ncbi.nlm.nih.gov/gene/?term=" + id_n).attr('target','_blank').appendTo($list_link_panel);

				if(_isExistVal("hgnc_gene_url",item)) {
					$('<a>').text("HGNC").attr('href',item.hgnc_gene_url).attr('target','_blank').appendTo($list_link_panel);
				}
				
				if(_isExistVal("hgnc_gene_symbol",item)) {
					let href_str = "http://www.hgmd.cf.ac.uk/ac/gene.php?gene=" +item.hgnc_gene_symbol;
					$('<a>').text("HGMD").attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);
					
					href_str = "https://www.ncbi.nlm.nih.gov/clinvar/?term=" +item.hgnc_gene_symbol;
					$('<a>').text("ClinVar").attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);
					
					href_str = "https://togovar.biosciencedbc.jp/?term=" +item.hgnc_gene_symbol;
					$('<a>').text("TogoVar").attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);

					href_str = "https://www.ncbi.nlm.nih.gov/CBBresearch/Lu/Demo/LitVar/#!?query=" +item.hgnc_gene_symbol;
					$('<a>').text("LitVar").attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);
					
					href_str = "https://www.ncbi.nlm.nih.gov/research/pubtator/?view=docsum&query=" +item.hgnc_gene_symbol;
					$('<a>').text("PubTator").attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);

					href_str = "http://www.dgidb.org/genes/" + item.hgnc_gene_symbol + "#_interactions";
					$('<a>').text("DGIdb").attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);
				}
			}
			
			if(isJA && (_isExistVal("ur_dbms_url", item))){
				$('<a>').text(LANGUAGE[lang].DETAIL_LABEL.UR_DBMS).attr('href',item.ur_dbms_url).attr('target','_blank').appendTo($list_link_panel);
			}

			if(isJA && (_isExistVal("nando_url", item))){
				item.nando_url.forEach(function(nando_url_str){

					let notfound = true;

					for(let search_key in NANDO_LABEL){
						if(nando_url_str.indexOf(search_key) > 0){
							$('<a>').text(NANDO_LABEL[search_key])
								.attr('href',nando_url_str)
								.attr('target','_blank')
								.appendTo($list_link_panel);
							notfound = false;
							break;
						}
					}

					if(notfound){
						$('<a>').text(NANDO_LABEL.DEFAULT)
							.attr('href',nando_url_str)
							.attr('target','_blank')
							.appendTo($list_link_panel);
					}
				});
			}
			
			
			if(_isExistVal("omim_disease_name_en", item)){
				let href_str = "http://www.google.com/search?q="+item.omim_disease_name_en+"&tbm=isch";
				//if (isJA) href_str = "http://www.google.com/search?q="+item.omim_disease_name_ja+"&tbm=isch";
				$('<a>').text(LANGUAGE[lang].DETAIL_LABEL.FIND_IMAGES).attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);
			} else if(_isExistVal("orpha_disease_name_en", item)){
				let href_str = "http://www.google.com/search?q="+item.orpha_disease_name_en+"&tbm=isch";
				//if (isJA) href_str = "http://www.google.com/search?q="+item.orpha_disease_name_ja+"&amp;tbm=isch";
				$('<a>').text(LANGUAGE[lang].DETAIL_LABEL.FIND_IMAGES).attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);
			}
		
			if(target !== TARGET_GENE){
				if(_isExistVal("mondo_url",item)){
					for(let i=0;i<item.mondo_url.length;i++){
						$('<a>').text(item.mondo_id[i]).attr('href',item.mondo_url[i]).attr('target','_blank').appendTo($list_link_panel);
					}
				}
			}

			if(_isExistVal("kegg_url",item)){
				item.kegg_url.forEach(function(url_str){
					$('<a>').text("KEGG:" + _get_id_from_url(url_str)).attr('href',url_str).attr('target','_blank').appendTo($list_link_panel);
				});
			}
	
			if(_isExistVal("gene_reviews_url",item)){
				item.gene_reviews_url.forEach(function(url_str){
					//https://www.ncbi.nlm.nih.gov/books/NBK1153/
					let ix = url_str.indexOf('books/');
					if(ix != -1){
						let ustr = url_str.substring(ix);
						ustr = ustr.replace('books','');
						ustr = ustr.replace('/','');
						ustr = ustr.replace('/','');
						$('<a>').text("GeneReviews:" + ustr).attr('href',url_str).attr('target','_blank').appendTo($list_link_panel);
					}else{
						$('<a>').text("Gene Reviews").attr('href',url_str).attr('target','_blank').appendTo($list_link_panel);
					}
				});
			}
			
			if(_isExistVal("gtr_url",item)){ 
				item.gtr_url.forEach(function(url_str){
					//https://www.ncbi.nlm.nih.gov/gtr/all/tests/?term=C2676137/
					let ix = url_str.indexOf('term=');
					if(ix != -1){
						let ustr = url_str.substring(ix);
						ustr = ustr.replace(/term=/,'');
						ustr = ustr.replace('/','');
						$('<a>').text("GTR:" + ustr).attr('href',url_str).attr('target','_blank').appendTo($list_link_panel);
					}else{
						$('<a>').text("GTR").attr('href',url_str).attr('target','_blank').appendTo($list_link_panel);
					}
				});
			}
		}
		
		//7. list link line
		if(isDisplayFull && (target === TARGET_OMIM || target === TARGET_ORPHANET)) {

			let mondo_id = ""
			if(_isExistVal("mondo_id",item)) mondo_id = item["mondo_id"][0];

			let case_report_count_ja = _get_case_report_count_data_from_cache(mondo_id, LANGUAGE_JA);
			let case_report_count_en = _get_case_report_count_data_from_cache(mondo_id, LANGUAGE_EN);
			let url_phenotype        = _construct_url(URL_GET_HPO_DATA_BY_OMIM_ID,{[SETTING_KEY_ID_LST]:id});
			if(target === TARGET_ORPHANET) url_phenotype = _construct_url(URL_GET_HPO_DATA_BY_ORPHA_ID,{[SETTING_KEY_ID_LST]:id});
			let url_case_report_en   = _construct_url(URL_GET_CASE_REPORT_BY_MONDO_ID,{[SETTING_KEY_ID_LST]: mondo_id,[SETTING_KEY_LANG]: LANGUAGE_EN});
			let url_case_report_ja   = _construct_url(URL_GET_CASE_REPORT_BY_MONDO_ID,{[SETTING_KEY_ID_LST]: mondo_id,[SETTING_KEY_LANG]: LANGUAGE_JA});
	
			let isOrpha = (target === TARGET_ORPHANET);

			$('<div>').css({'width':'100%'}).pcf_collapse_panel({
				"LABEL_PHENOTYPE"   : LANGUAGE[lang].DETAIL_LABEL.PHENOTYPE_LST,
				"LABEL_JA_CASE"     : LANGUAGE[lang].DETAIL_LABEL.JA_REPORT,
				"LABEL_EN_CASE"     : LANGUAGE[lang].DETAIL_LABEL.EN_REPORT,
				"PCF-URL-PHENOTYPE"      : url_phenotype,
				"PCF-URL-CASE_REPORT_EN" : url_case_report_en,
				"PCF-URL-CASE_REPORT_JA" : url_case_report_ja,
				"OMIM-ORPHA-ID"          : id,
				"MONDO-ID"               : mondo_id,
				"COUNT_PHENOTYPE"        : item.count_hpo_id,
				"COUNT_JA_CASE"          : case_report_count_ja,
				"COUNT_EN_CASE"          : case_report_count_en,
				"PCF-LANGUAGE"           : lang,
				"popup_type"             : POPUP_TYPE_PHENOTYPE,
				"list_tag"               : "list-tag_blue",
				"popup_class"            : CLASS_POPUP_PHENOTYPE_INLIST,
				"popup_func"             : _contruct_popup_button,
				"isorpha"                : isOrpha,
				"add_token"				 : setting.add_token,
			}).appendTo($container_panel);
		}

		return $container_panel;
	}

	function _contruct_copy_content(rank,detail_data,lang){
		let isJA      = (lang===LANGUAGE_JA);
		let target_id = rank.id;
		let score     = rank.score * 100;
		if(score > 100) score = 100		
		score = score.toFixed(1)+"%";

		let phenotype_list_str = "";
		rank.matched_hpo_id.split(',').forEach(function(hpo_id){
			let label_text = _get_phenotype_name_from_cache(hpo_id,lang);
			if(_isEmpty(label_text)){
				let label_text_en = _get_phenotype_name_from_cache(hpo_id,LANGUAGE_EN);
				if(!_isEmpty(label_text_en)){
					label_text= label_text_en;	
				}else{
					label_text= hpo_id;
				}
			}
			if(phenotype_list_str.length === 0){
				phenotype_list_str = label_text + "("+hpo_id+")";
			}else{
				phenotype_list_str = phenotype_list_str + ',' + label_text + "("+hpo_id+")";
			}
		});
		
		let text = 'ID: ' + target_id;
		if(RegExp_OMIM.test(target_id)){

			let inheritance_list_str = "";								
			if(_isExistVal("inheritance_en",detail_data)){
				for(let hpo_id in detail_data.inheritance_en){
					let inheritance_text = detail_data.inheritance_en[hpo_id];
					
					if(isJA)inheritance_text = detail_data.inheritance_ja[hpo_id];

					if(inheritance_list_str.length === 0){
						inheritance_list_str = inheritance_text  + "("+hpo_id+")";
					}else{
						inheritance_list_str = inheritance_list_str + ',' + inheritance_text  + "("+hpo_id+")";
					}
				}
			}

			let gene_list_str = "";
			if(_isExistVal("hgnc_gene_symbol",detail_data)){
				for(let i=0;i<detail_data.hgnc_gene_symbol.length;i++){
					let gene_text = detail_data.hgnc_gene_symbol[i];
	
					if(gene_list_str.length === 0){
						gene_list_str = gene_text + "("+ detail_data.ncbi_gene_id[i] +")";
					}else{
						gene_list_str = gene_list_str + ',' + gene_text + "("+ detail_data.ncbi_gene_id[i] +")";
					}

				}
			}

			if(isJA) text = text + "\n<br>" + "Name(ja): " + detail_data.omim_disease_name_ja;
			text = text + "\n<br>" +  "Name(en): "             + detail_data.omim_disease_name_en;
			text = text + "\n<br>" +  "Matched Phenotype: "    + phenotype_list_str;
			text = text + "\n<br>" +  "Modes of Inheritance: " + inheritance_list_str;
			text = text + "\n<br>" +  "Causative Gene: "       + gene_list_str;
			text = text + "\n<br>" +  "Definition: "          + detail_data.description;
			text = text + "\n<br>" +  "LINKS:\n<br>"           + target_id + ', ' + detail_data.omim_url;
			if(isJA){
				if(_isExistVal("ur_dbms_url", detail_data)) text = text + "\n<br>" + "UR-DBMS" + ', ' + detail_data.ur_dbms_url;
				
				if(_isExistVal("nando_url", detail_data)){
					detail_data.nando_url.forEach(function(nando_url_str){
						nando_url_str = nando_url_str.replace("_",":");
						let nando_id = _get_id_from_url_v2(nando_url_str);
						text = text + "\n<br>" + nando_id + ', ' + nando_url_str;
					});
				}
			}
			
			if(_isExistVal("mondo_url",detail_data)){
				for(let i=0;i<detail_data.mondo_url.length;i++){
					text = text + "\n<br>" + detail_data.mondo_id[i] + ', ' + detail_data.mondo_url[i];
				}
			}
			
			if(_isExistVal("gtr_url",detail_data)){
				detail_data.gtr_url.forEach(function(url_str){
					let gtr_id= _get_id_from_url(url_str);
					gtr_id = gtr_id.replace("term=",'GTR:').replace('/',"");
					text = text + "\n<br>" + gtr_id + ', ' + url_str;
				});
			}
			

		}else if(RegExp_ORPHA.test(target_id)){

			let inheritance_list_str = "";								
			if(_isExistVal("inheritance_en",detail_data)){
				for(let hpo_id in detail_data.inheritance_en){
					let inheritance_text = detail_data.inheritance_en[hpo_id];
					
					if(isJA)inheritance_text = detail_data.inheritance_ja[hpo_id];

					if(inheritance_list_str.length === 0){
						inheritance_list_str = inheritance_text  + "("+hpo_id+")";
					}else{
						inheritance_list_str = inheritance_list_str + ',' + inheritance_text  + "("+hpo_id+")";
					}
				}
			}

			let gene_list_str = "";
			if(_isExistVal("hgnc_gene_symbol",detail_data)){
				for(let i=0;i<detail_data.hgnc_gene_symbol.length;i++){
					let gene_text = detail_data.hgnc_gene_symbol[i];
	
					if(gene_list_str.length === 0){
						gene_list_str = gene_text + "("+ detail_data.ncbi_gene_id[i] +")";
					}else{
						gene_list_str = gene_list_str + ',' + gene_text + "("+ detail_data.ncbi_gene_id[i] +")";
					}

				}
			}

			if(isJA) text = text + "\n<br>" + "Name(ja): " + detail_data.orpha_disease_name_ja;
			text = text + "\n<br>" +  "Name(en): "             + detail_data.orpha_disease_name_en;
			text = text + "\n<br>" +  "Matched Phenotype: "    + phenotype_list_str;
			text = text + "\n<br>" +  "Modes of Inheritance: " + inheritance_list_str;
			text = text + "\n<br>" +  "Causative Gene: "       + gene_list_str;
			text = text + "\n<br>" +  "Definition: "          + detail_data.description;
			text = text + "\n<br>" +  "LINKS:\n<br>"           + target_id + ', ' + detail_data.orpha_url;
			if(isJA){
				if(_isExistVal("ur_dbms_url", detail_data)) text = text + "\n<br>" + "UR-DBMS" + ', ' + detail_data.ur_dbms_url;
				
				if(_isExistVal("nando_url", detail_data)){
					detail_data.nando_url.forEach(function(nando_url_str){
						nando_url_str = nando_url_str.replace("_",":");
						let nando_id = _get_id_from_url_v2(nando_url_str);
						text = text + "\n<br>" + nando_id + ', ' + nando_url_str;
					});
				}
			}
			
			if(_isExistVal("mondo_url",detail_data)){
				for(let i=0;i<detail_data.mondo_url.length;i++){
					text = text + "\n<br>" + detail_data.mondo_id[i] + ', ' + detail_data.mondo_url[i];
				}
			}
			
			if(_isExistVal("gtr_url",detail_data)){
				detail_data.gtr_url.forEach(function(url_str){
					let gtr_id= _get_id_from_url(url_str);
					gtr_id = gtr_id.replace("term=",'GTR:').replace('/',"");
					text = text + "\n<br>" + gtr_id + ', ' + url_str;
				});
			}


		}else if(RegExp_GENE.test(target_id)){

			let disease_list_str = "";
			if(_isExistVal("mondo_disease_name_en",detail_data)){
				for(let mondo_id in detail_data.mondo_disease_name_en){
					let disease_text = detail_data.mondo_disease_name_en[mondo_id];
					if(isJA && _isExistVal(mondo_id, detail_data.mondo_disease_name_ja)) disease_text = detail_data.mondo_disease_name_ja[mondo_id];
		
					if(disease_list_str.length === 0){
						disease_list_str = disease_text + "("+mondo_id+")";
					}else{
						disease_list_str = disease_list_str + ',' + disease_text + "("+mondo_id+")";
					}
				}
			}

			let inheritance_list_str = "";	
			if("inheritance_en" in detail_data){
				for(let i=0;i<detail_data.inheritance_en.length;i++){
				
					let inheritance_text = detail_data.inheritance_en[i];
				
					if(isJA) inheritance_text = detail_data.inheritance_ja[i];

					if(inheritance_list_str.length === 0){
						inheritance_list_str = inheritance_text + "("+INHERITANCE_LABEL_TO_ID[detail_data.inheritance_en[i]]+")";
					}else{
						inheritance_list_str = inheritance_list_str + ',' + inheritance_text  + "("+INHERITANCE_LABEL_TO_ID[detail_data.inheritance_en[i]]+")";
					}
				}
			}
			text = text + "\n<br>" +  "Name(en): "             + detail_data.hgnc_gene_symbol + "," + detail_data.full_name ;
			text = text + "\n<br>" +  "Matched Phenotype: "    + phenotype_list_str;
			text = text + "\n<br>" +  "Diseases: "             + disease_list_str;
			text = text + "\n<br>" +  "Modes of Inheritance: " + inheritance_list_str;
			text = text + "\n<br>" +  "LINKS:\n<br>"           + detail_data.hgnc_gene_id + ', ' + detail_data.hgnc_gene_url;
			
			if(_isExistVal("mondo_url",detail_data)){
				for(let i=0;i<detail_data.mondo_url.length;i++){
					text = text + "\n<br>" + detail_data.mondo_id[i] + ', ' + detail_data.mondo_url[i];
				}
			}
		}

		return text;
	}

	function _clear_selection(){
		let target       = _get_active_target();
		let $panel       = tab_panel_lst[target];
		let id_selectnum = target + "_selected_num";
                let id_clear     = target + "_clear_select";

		$('#'+id_selectnum).hide();
		$('#'+id_clear).hide();

		$panel.find("input[name='target_id']:checked").prop('checked',false); 

	}
	
	function _on_select_changed(){

		let target = _get_active_target();
		let $panel = tab_panel_lst[target];

		let id_selectnum = target + "_selected_num";
		let id_clear     = target + "_clear_select";

		let num = $panel.find("input[name='target_id']:checked").length;
		$('#'+id_selectnum).text('' + num + " item selected");

		if(num > 0){
			$('#'+id_selectnum).show();
			$('#'+id_clear).show();
		}else{
			$('#'+id_selectnum).hide();
			$('#'+id_clear).hide();
		}

	}

	function _show_result(setting){
		
		let target         = setting[SETTING_KEY_TARGET];
		let lang           = setting[SETTING_KEY_LANG];
		let num_per_page   = setting[SETTING_KEY_SIZE];
		let display_format = setting[SETTING_KEY_DISPLAY_FORMAT];

		let isDisplayFull = (display_format === DISPLAY_FORMAT_FULL);				

		if(_is_target_status_data_loaded(target)) return;

		let $target_tab_panel = tab_panel_lst[target];

		let ranking_list = _get_ranking_data_from_cache(setting);
		if(_isEmpty(ranking_list)) return;
		
		let detail_data = null;
		if(target !== TARGET_CASE){
			detail_data = _get_detail_data_from_cache(target);
			if(_isEmpty(detail_data)) return;
		}


		let loaded_num  = _get_target_loaded_num(target);
		let isFirstLoad = true;
		if(loaded_num > 0) isFirstLoad = false;
		
		let total_num = ranking_list.length;
		let total_num_str = total_num.toLocaleString("en-US");

		// top
		if(isFirstLoad){
			let $top_panel = $('<div>').addClass("list-header").appendTo($target_tab_panel);
			$('<div>').attr('id', target + "_list-results").addClass("list-results").text(total_num_str + " results").appendTo($top_panel);
			$('<div>').attr('id', target + "_selected_num").addClass("list-results-select-num").text("0 item selected").css({'display':'none'}).appendTo($top_panel);
			$('<div>').attr('id', target + "_clear_select").addClass("list-results-clear-select").text("x clear selection")
				.click(function(){
					_clear_selection();
				})
				.css({'display':'none'})
				.appendTo($top_panel);

			let $tag_sample_container = $('<div>').addClass("list-tag_sample").appendTo($top_panel);
			LANGUAGE[lang]['SAMPLE_TAG_LABEL'][target].forEach(function(item){
				//$('<span>').text(item.TEXT).addClass(item.CLASS).css({'margin-left':'5px'}).appendTo($tag_sample_container);
				$('<span>').text(item.TEXT).addClass(item.CLASS).appendTo($tag_sample_container);
			});
		}
		// data rows
		var $last_row = null;
		if(!isFirstLoad){
			let rows = $target_tab_panel.find("." + CLASS_ROW);
			$last_row = $(rows[rows.length-1]);
			
			if(loaded_num >= num_per_page){
				let $page_row = $('<div>').addClass("list-content-pagenum").insertAfter($last_row);
				
				let page_num = parseInt(loaded_num/num_per_page, 10);
				
				$("<div>").text("Page " + page_num).addClass('list-content_center').appendTo($page_row);

				$last_row = $page_row;
			}
		}

		let i=loaded_num;
		let data_counter = num_per_page;
		if(loaded_num >0 && loaded_num < num_per_page){
			data_counter = num_per_page - loaded_num;
		}
		for(;(i<ranking_list.length && data_counter>0);i++){
			
			let $tr = $('<div>').addClass(CLASS_ROW);
			if($last_row == null){
				//when initialize tab panel
				$tr.appendTo($target_tab_panel);				
			}else{
				$tr.insertAfter($last_row);
			}
			$last_row = $tr;
			
			let $td_left  = $('<div>').addClass('list-content_left').appendTo($tr);
			let $td_right = $('<div>').addClass('list-content_right').addClass('flex-fill').appendTo($tr);

			// left
			let $rank = $('<div>').addClass('rank').appendTo($td_left);
			let input_str = "<input type=\"checkbox\" value=\""+ranking_list[i].id+"\" name=\"target_id\"><p>"+(i+1)+"</p></input>";
			let $input_checkbox = $(input_str).appendTo($rank);
			$input_checkbox.change(function(){
				_on_select_changed();
			});
			

			//let score = (ranking_list[i].score * 100).toFixed(1)+"%";
	        let score     = ranking_list[i].score * 100;
    	    if(score > 100) score = 100
	        score = score.toFixed(1)+"%";
			score = score.replace('100.0','100');
			let $percentage = $("<span>("+ score+")</span>").appendTo($td_left);
			if(!isDisplayFull) $percentage.addClass('summary');
			
			if(target !== TARGET_CASE){

				let $list_content_left_bt = $('<div>').addClass('list-content_left_bt').appendTo($td_left);

				if(ranking_list[i].id in detail_data ){

					let copy_button = document.createElement('a');
		
					if(isDisplayFull){
						copy_button.innerHTML = "Copy<i class=\"material-icons\">content_copy</i>";
					}else{
						copy_button.innerHTML = "<i class=\"material-icons\">content_copy</i>";
					}

	
					let copy_button_id = 'btn_copy_' + target + "_" + i;
					tippy(copy_button, {
						allowHTML:      true,
						appendTo:       document.body,
						maxWidth:       550,
						trigger:        'click',
						strategy:       'fixed',
						interactive:    true,
						theme:          'pcf-popup',
						placement:      'bottom-start',
						copy_button_id: copy_button_id,
						onCreate(instance) {
			    			// Setup our own custom state properties
							instance._isSetClickEvent = false;
						},
						onShown(instance) {
							let copy_button_id = instance.props.copy_button_id;							
							let pid = "copy_content_"+copy_button_id;
							$("#" + pid).focus();
							
							if (instance._isSetClickEvent) {
								return;
							}

							// set click event
							$("#"+copy_button_id).tooltip({'title':'Summary successfully copied', 'trigger':'manual', 'placement':'bottom'})
											.on('click', function (e) {
												let $copy_button = $(this);
												$copy_button.tooltip('show');
												let text = $copy_button.parent().prev().find("p").text();
												
												if (window.clipboardData && window.clipboardData.setData) {
												    // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
													window.clipboardData.setData("Text", text);
												}
												else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
												        let textarea = document.createElement("textarea");
												        textarea.style = "position: absolute; left: -1000px; top: -1000px";
												        textarea.textContent = text;
												        document.body.appendChild(textarea);
												        //textarea.select();
												        try {
													            let selection = document.getSelection();
												                selection.removeAllRanges();
												
												                let range = document.createRange();
												                range.selectNodeContents(textarea);
												                selection.addRange(range);
												
												                document.execCommand('copy');
												                selection.removeAllRanges();
												        }
												        catch (ex) {
												                console.warn("Copy to clipboard failed.", ex);
												        }
												        finally {
												                document.body.removeChild(textarea);
												        }
												}
												return false;
											})
											.on('mouseleave', function () {
												$(this).tooltip('hide');
											});
							instance._isSetClickEvent = true;
						},
						content(reference) {
							const text_content = _contruct_copy_content(ranking_list[i],detail_data[ranking_list[i].id],lang);
							return	"<div class=\"copy-content\">" +
									"<p id=\"copy_content_"+copy_button_id+"\">"+ text_content +"</p>"+
								"</div>"+
								"<div class=\"btn-toolbar d-flex flex-row\" style=\"margin-top:10px;\">" +
									"<button  id=\""+copy_button_id+"\" " +
											" class=\"cancel-button\" "+
											" style=\"margin-right:0px;\" "+
											" >"+
											"<i style=\"font-size:18px;vertical-align:sub;\" class=\"material-icons\">content_copy</i>Copy to the clipboard</button>"+
								"</div>";
						},
					});

					if(isDisplayFull){
						let $copy_button_wrapper = $('<span>').appendTo($list_content_left_bt);
						$(copy_button).css({'height':'1.1rem'}).appendTo($copy_button_wrapper);
					}else{
						$(copy_button).appendTo($list_content_left_bt);
					}
	
					let $like_button = $('<a>').appendTo($list_content_left_bt);
					if(isDisplayFull){
						$like_button.text("Like").append("<i class=\"material-icons\">favorite_border</i>");
					}else{
						$list_content_left_bt.addClass('summary');
						$like_button.append("<i class=\"material-icons\">favorite_border</i>");
						$like_button.css({'margin-left': '15px'});
					}
	
					$like_button.data(SETTING_KEY_TARGET,target).data(SETTING_KEY_ID_LST,ranking_list[i].matched_hpo_id)
								.data(SETTING_KEY_TARGET_ID,ranking_list[i].id)
								.on('click', function (e) {
									let $btn = $(this) 
								
									if($btn.hasClass('liked')){
										$btn.removeClass('liked');
										$btn.find('i').text('favorite_border');
									}else{
										let like_url_str = _construct_url(URL_SHARE,{	[SETTING_KEY_SHARE]:     SHARE_TYPE_LIKE,
																			[SETTING_KEY_TARGET]:    $btn.data(SETTING_KEY_TARGET),
																			[SETTING_KEY_ID_LST]:    $btn.data(SETTING_KEY_ID_LST),
																			[SETTING_KEY_TARGET_ID]: $btn.data(SETTING_KEY_TARGET_ID)});
										_run_ajax(like_url_str,'GET', null, 'text', true, true, null, null);
										$btn.addClass('liked');
										$btn.find('i').text('favorite');
									}
									e.preventDefault();
									e.stopPropagation();
									return false;
								});
				}
			}

			
			//right
			if(target === TARGET_CASE){
				_contruct_detail(ranking_list[i].id, ranking_list[i].matched_hpo_id, null, lang, target, display_format, $td_right, ranking_list[i], setting);
			}else if(ranking_list[i].id in detail_data ){
				_contruct_detail(ranking_list[i].id, ranking_list[i].matched_hpo_id, detail_data[ranking_list[i].id], lang, target, display_format, $td_right,ranking_list[i], setting);
			} else {
				$td_right.text('No Search Results for ('+ranking_list[i].id+').').css({'text-align':'center','vertical-align':'middle'});
			}
			
			data_counter--;
		}

		// bottom
		if(isFirstLoad){
			let $bottom_panel = $('<div>').addClass("list-footer").appendTo($target_tab_panel);
			$('<div>').addClass("list-results").text(total_num_str + " results").appendTo($bottom_panel);
			let button_str = "<button id=\"show_more_button-"+target+"\"><span><i class=\"material-icons\">add</i></span><p>Show More</p></button>";
			$(button_str)
			.data(KEY_TARGET,target)
			.click(function(){
				let target = $(this).data(KEY_TARGET);
				let $target_tab_panel = tab_panel_lst[target];
				_set_target_status_detail_data_unloaded(target);
				let setting = $target_tab_panel.data(KEY_SETTING_OBJECT);
				_search_detail_data_and_show_result(setting);
			})
			.appendTo($bottom_panel);
		}
		
		if(i >= ranking_list.length){
			$("#show_more_button-"+target).hide();
		} 	

		// set panel status to loaded
		_set_target_status_detail_data_loaded(target);
	}


	function _search_phenotypename_casereportnum_and_show_result(setting){

		let target        = setting[SETTING_KEY_TARGET];
		let isDisplayFull = (setting[SETTING_KEY_DISPLAY_FORMAT] === DISPLAY_FORMAT_FULL);


		let ajax_item_list=[];


		let type_phenotypename = 'phenotypename';
		let uncached_phenotypename_list = _find_unloaded_hpo_ids(setting);
		if(!_isEmpty(uncached_phenotypename_list)){
			setting[SETTING_KEY_ID_LST] = uncached_phenotypename_list.join(",");
			let url_str = _construct_url(URL_GET_HPO_DATA_BY_HPO_ID, setting);
			let obj = {[SETTING_KEY_URLSTR]:url_str, 'type': type_phenotypename};
			ajax_item_list.push(obj);
		}

		let type_casereportcount_en = 'casereportcount_en';
		let type_casereportcount_ja = 'casereportcount_ja';
		if(isDisplayFull && (target === TARGET_OMIM || target === TARGET_ORPHANET)){

			let uncached_casereportcount_en_list = _find_unloaded_case_report_count_data_ids(setting,LANGUAGE_EN);
			if(!_isEmpty(uncached_casereportcount_en_list)){
				let id_lst = uncached_casereportcount_en_list.join(",");
				let url_str = _construct_url(URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID, {[SETTING_KEY_ID_LST]:id_lst, [SETTING_KEY_LANG]:LANGUAGE_EN});
				let obj = {[SETTING_KEY_URLSTR]:url_str, 'type': type_casereportcount_en};
				ajax_item_list.push(obj);
			}
			
			let uncached_casereportcount_ja_list = _find_unloaded_case_report_count_data_ids(setting,LANGUAGE_JA);
			if(!_isEmpty(uncached_casereportcount_ja_list)){
				let id_lst = uncached_casereportcount_ja_list.join(",");
				let url_str = _construct_url(URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID, {[SETTING_KEY_ID_LST]:id_lst, [SETTING_KEY_LANG]:LANGUAGE_JA});
				let obj = {[SETTING_KEY_URLSTR]:url_str, 'type': type_casereportcount_ja};
				ajax_item_list.push(obj);
			} 
		}

		var callback_success = function(data,item){
			if(!_isEmpty(data)){
				let json_data = _parseJson(data);
				if(item.type === type_phenotypename){
					_set_phenotype_name_data_to_cache(json_data);
				}else if(item.type === type_casereportcount_en){
					_set_case_report_count_data_to_cache(json_data,LANGUAGE_EN);
				}else if(item.type === type_casereportcount_ja){
					_set_case_report_count_data_to_cache(json_data,LANGUAGE_JA);
				}
			}
		};
		
		var callback_fail = function() {
			alert('Server access error!');
		};
		
		var callback_after_all_call = function(){
			_show_result(setting);
			pcf_hide_loading();
		};
		
		var callback_fail_after_all_call = function(){
			pcf_hide_loading();
		}
		
		if(ajax_item_list.length === 0){
			_show_result(setting);
			pcf_hide_loading();
		}else if(ajax_item_list.length === 1){
			_run_ajax(ajax_item_list[0][SETTING_KEY_URLSTR],'GET', null, 'text', true, true, function(data){
				callback_success(data,ajax_item_list[0]);
				_show_result(setting);
				pcf_hide_loading();
				return;
			});
			return;
		}else {
			_run_ajax_sequential(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call);
		}
		
		return;
	}


	function _search_detail_data_and_show_result(setting){

		pcf_show_loading();

		let target = setting[SETTING_KEY_TARGET];
		
		if(_is_target_status_init(target) || _is_target_status_data_loaded(target)) return;

		let uncached_list = _find_unloaded_detail_data_ids(setting);

		// check if  needs to be load from interent	
		if(!_isEmpty(uncached_list)){

			if(target === TARGET_CASE){
				_search_phenotypename_casereportnum_and_show_result(setting);
			}else{
				// search detail data from internet and draw result
				setting[SETTING_KEY_ID_LST] = uncached_list.join(",");
		
				let url_str = _construct_url(URL_GET_DATA_BY_ID, setting);
				_run_ajax(url_str,'GET', null, 'text', true, true, function(data){
				
					if(!_isEmpty(data)){
						var json_data = _parseJson(data);
						if(!_isEmpty(json_data)){
							_set_detail_data_to_cache(json_data,target);
						}
					}
					_search_phenotypename_casereportnum_and_show_result(setting);
				});
			}
		} else {
			_search_phenotypename_casereportnum_and_show_result(setting);
		}
	}

	function _run_pcf_filter_logical_case(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,filter_vgp_gene_hash,target,setting){

		let ranking_id_list = {};
		ranking_data_without_filter.forEach(function(item){
			ranking_id_list[item.id] = "";
		});
		

		let gene_id_hash = {};
		let load_filter_ids_func = setting[SETTING_KEY_LOAD_FILTER_IDS];
		if(_isFunction(load_filter_ids_func)){
			let tokenList = load_filter_ids_func();				
			tokenList.forEach(function(item){
				let id = item.id;
				let name = item.name;
				gene_id_hash[id] = name;
			});
		}			

		if(_isEmpty(result_ranking_id_hash)){
			let ranking_data_new = [];
			ranking_data_without_filter.forEach(function(item){
				let obj = $.extend(true,{}, item);
				for(geneid in filter_vgp_gene_hash){
					//filter_vgp_gene_hash[geneid]['cases'].forEach(function(case_id){
					for(let i=0;i<filter_vgp_gene_hash[geneid]['cases'].length;i++){
						case_id=filter_vgp_gene_hash[geneid]['cases'][i];
						if(case_id === item.id){
							let gene_name = filter_vgp_gene_hash[geneid]['name'];
							if('hgnc_gene_symbol' in obj){
								if(!(geneid in obj['hgnc_gene_symbol'])){
									obj['hgnc_gene_symbol'][geneid] = gene_name;
								}
							}else{
								obj['hgnc_gene_symbol'] = {};
								obj['hgnc_gene_symbol'][geneid] = gene_name;
							}
							break;
						}
					}
				}
				if('hgnc_gene_symbol' in obj) ranking_data_new.push(obj);
			});

			_set_ranking_data_into_cache(ranking_data_new,setting);
			_set_target_status_ranking_data_loaded(target);
			_search_detail_data_and_show_result(setting);
			
			return;
		}
		
		Object.keys(items_total_hash).sort().forEach(function(i_str){
			let filter_type = items_total_hash[i_str].filter_type;
			if(filter_type !== FILTER_TYPE_GENEID) return;
			
			let logical_type = items_total_hash[i_str].logical_type;
			let gene_id      = items_total_hash[i_str].id;
			let hash 		 = result_ranking_id_hash[i_str];
			
			let isLogicalNot = (logical_type === LOGICAL_AND_NOT);
			
			let filter_id_list = {};
			ranking_data_without_filter.forEach(function(data_item){
				if(isLogicalNot){
					if(!(data_item.id in hash)) filter_id_list[data_item.id]=1;
				}else{
					if(data_item.id in hash) filter_id_list[data_item.id]=1;
				}
			});
			

			if(logical_type === LOGICAL_AND || logical_type === LOGICAL_AND_NOT){
				Object.keys(ranking_id_list).forEach(function(ranking_id){
					if(!(ranking_id in filter_id_list)){
						delete ranking_id_list[ranking_id];
					}else{
						if(ranking_id_list[ranking_id] === ""){
							ranking_id_list[ranking_id] = gene_id;
						}else{
							ranking_id_list[ranking_id] = ranking_id_list[ranking_id] + "," + gene_id;
						}
					}
				});
			} else {
				Object.keys(filter_id_list).forEach(function(ranking_id){
					if(ranking_id in ranking_id_list){
						if(ranking_id_list[ranking_id] === ""){
							ranking_id_list[ranking_id] = gene_id;
						}else{
							ranking_id_list[ranking_id] = ranking_id_list[ranking_id] + "," + gene_id;
						}

					}else{
						ranking_id_list[ranking_id] = gene_id;
					}
				});
			}
		});
		
		let ranking_data_new = [];
		ranking_data_without_filter.forEach(function(item){
			if(item.id in ranking_id_list) {
				let gene_id_lst_str = ranking_id_list[item.id];
				
				let obj = $.extend(true,{}, item);
				
				if(gene_id_lst_str.length > 0){
					obj['hgnc_gene_symbol'] = {};
					gene_id_lst_str.split(',').forEach(function(gene_id){
						let gene_name = gene_id;
						if(gene_id in gene_id_hash){
							gene_name = gene_id_hash[gene_id];
						}
						obj['hgnc_gene_symbol'][gene_id] = gene_name;
					});
				}
				ranking_data_new.push(obj);
			}
		});
		
		
		if(!_isEmpty(filter_vgp_gene_hash)){
			let ranking_data_new2 = [];
			ranking_data_new.forEach(function(item){
				let obj = $.extend(true,{}, item);
				let found = false;
				for(geneid in filter_vgp_gene_hash){
					
					for(let i=0;i<filter_vgp_gene_hash[geneid]['cases'].length;i++){
					//filter_vgp_gene_hash[geneid]['cases'].forEach(function(case_id){
						let case_id = filter_vgp_gene_hash[geneid]['cases'][i];
						if(case_id === item.id){
							found = true;
							let gene_name = filter_vgp_gene_hash[geneid]['name'];

							if('hgnc_gene_symbol' in obj){
								if(!(geneid in obj['hgnc_gene_symbol'])){
									obj['hgnc_gene_symbol'][geneid] = gene_name;
								}
							}else{
								obj['hgnc_gene_symbol'] = {};
								obj['hgnc_gene_symbol'][geneid] = gene_name;
							}

							break;
						}
					}
				}
				if(found) ranking_data_new2.push(obj);
			});
			
			ranking_data_new = ranking_data_new2;
		}		
		
		_set_ranking_data_into_cache(ranking_data_new,setting);
		_set_target_status_ranking_data_loaded(target);
		_search_detail_data_and_show_result(setting);
	}


	function _run_pcf_filter_logical(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,filter_vgp_gene_hash,target,setting){

		if(!ranking_data_without_filter || (_isEmpty(ranking_data_without_filter))){		
			_set_ranking_data_into_cache([],setting);
			_set_target_status_ranking_data_loaded(target);
			pcf_hide_loading();
			return false;
		}
		
		let no_filter = true;
		let filter_list_str    = setting[SETTING_KEY_FILTER];		
		if(filter_list_str.length > 0) no_filter = false;

		let no_filter_vgp = true;
		let filter_vgp_list_str= setting[SETTING_KEY_FILTER_VGP];
		if(filter_vgp_list_str.length > 0) no_filter_vgp = false;

		if(no_filter){

			if(no_filter_vgp){
				_set_ranking_data_into_cache(ranking_data_without_filter,setting); 
				_set_target_status_ranking_data_loaded(target);
				_search_detail_data_and_show_result(setting);
				return;
			}else{			

				if(target === TARGET_CASE){
					_run_pcf_filter_logical_case(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,filter_vgp_gene_hash,target,setting);
					return;
				}

				let ranking_data_new = [];
				ranking_data_without_filter.forEach(function(item){
					if(target === TARGET_GENE){
						if(item.id in filter_vgp_gene_hash){ranking_data_new.push(item);}
					}else{
						// target omim orphanet
						if(item.gene_id){
							let found = false;
							let gene_id_list =item.gene_id.split(',');
							for(let i=0;i<gene_id_list.length;i++){
								if(gene_id_list[i] in filter_vgp_gene_hash){
									found = true;
									break;
								}
							}
							if(found){ranking_data_new.push(item);}
						}
					}
				});
				_set_ranking_data_into_cache(ranking_data_new,setting);
				_set_target_status_ranking_data_loaded(target);
				_search_detail_data_and_show_result(setting);
				return;
			}
		}else{
			
			if(target === TARGET_CASE){
				_run_pcf_filter_logical_case(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,filter_vgp_gene_hash,target,setting);
				return;
			}
			
			let ranking_id_list = {};
			
			ranking_data_without_filter.forEach(function(item){
				ranking_id_list[item.id] = 1;
			});
			
			Object.keys(items_total_hash).sort().forEach(function(i_str){

				let logical_type   = items_total_hash[i_str].logical_type;

				let hash = result_ranking_id_hash[i_str];
				
				let isLogicalNot = (logical_type === LOGICAL_AND_NOT);
				
				let filter_id_list = {};
				ranking_data_without_filter.forEach(function(data_item){
					if(isLogicalNot){
						if(!(data_item.id in hash)) filter_id_list[data_item.id]=1;
					}else{
						if(data_item.id in hash) filter_id_list[data_item.id]=1;
					}
				});
				

				if(logical_type === LOGICAL_AND || logical_type === LOGICAL_AND_NOT){
					Object.keys(ranking_id_list).forEach(function(ranking_id){
						if(!(ranking_id in filter_id_list)){
							delete ranking_id_list[ranking_id];
						}
					});
				} else {
					Object.keys(filter_id_list).forEach(function(ranking_id){
						ranking_id_list[ranking_id] = 1;
					});
				}
			});
			
			let ranking_data_new = [];
			ranking_data_without_filter.forEach(function(item){
				if(item.id in ranking_id_list) {
					if(no_filter_vgp){
						ranking_data_new.push(item);
					}else if(target === TARGET_GENE){
						if(item.id in filter_vgp_gene_hash){ranking_data_new.push(item);}
					}else{
						// target omim orphanet
						if(item.gene_id){
							let found = false;
							let gene_id_list =item.gene_id.split(',');
							for(let i=0;i<gene_id_list.length;i++){
								if(gene_id_list[i] in filter_vgp_gene_hash){
									found = true;
									break;
								}
							}
							if(found){ranking_data_new.push(item);}
						}
					}
				}
			});
			
			_set_ranking_data_into_cache(ranking_data_new,setting);
			_set_target_status_ranking_data_loaded(target);
			_search_detail_data_and_show_result(setting);
		}
	}

	function _run_pcf_search_ranking_data(setting){

		pcf_show_loading();
	
		let target_str   = setting[SETTING_KEY_TARGET];
		let ranking_data = _get_ranking_data_from_cache(setting);
		
		if((!_is_target_status_init(target_str))  && (!_isEmpty(ranking_data))){
			// target panel already loaded ranking data.go to next step directly.
			_search_detail_data_and_show_result(setting);
			return false;
		}
		
		if(ranking_data){
			_set_target_status_ranking_data_loaded(target_str);
			if(_isEmpty(ranking_data)){
				// 0 result, no need to continue.
				pcf_hide_loading();
			}else{
				//use the ranking data in cache, go to next step directly.
				_search_detail_data_and_show_result(setting);
			}
			return false;
		}

		// need to load ranking data from server.
		 
		let ajax_item_list=[];
		
			
		// 1. ranking data based on phenotype,no filter. 		
		let setting_without_filter = $.extend(true,{}, setting,{[SETTING_KEY_FILTER]:'',[SETTING_KEY_FILTER_VGP]:''});
		
		let ranking_data_without_filter = _get_ranking_data_without_filter_from_cache(setting);
		
		let type_ranking = 'ranking';
		if(!ranking_data_without_filter){
			// never load before,need to do ajax
			let url_str = _construct_url(URL_GET_RANKING_BY_HPO_ID,setting_without_filter);
			let obj = {[SETTING_KEY_URLSTR]:url_str, 'type': type_ranking};
			ajax_item_list.push(obj);
		}else if(_isEmpty(ranking_data_without_filter)){
			// load ranking data before, and 0 result. no need to continue
			_set_ranking_data_into_cache([],setting);
			_set_target_status_ranking_data_loaded(target_str);
			pcf_hide_loading();
			return false;
		}
		
		// 2. filter
		let type_filter = 'filter';
		let items_total_hash = {};
		let result_ranking_id_hash = {};
		let filter_list_str    = setting[SETTING_KEY_FILTER];		
		if(filter_list_str.length > 0){
			// analyze filter one by one
			let filter_list = filter_list_str.split(',');
			for(let i=0; i<filter_list.length; i++){
	
				let str_filter_id = filter_list[i];
				let id            = _get_id_from_filter_id(str_filter_id);
				let filter_type   = _get_filter_type_by_filter_id(str_filter_id);
				let logical_type  = _get_logical_by_filter_id(str_filter_id, i);
				let url_str       = FILTER_URL_HASH[target_str][filter_type];
	
				// keep the item 
				items_total_hash[i] ={
					'index'        : i,
					'str_filter_id': str_filter_id,
					'id'           : id,
					'filter_type'  : filter_type,
					'logical_type' : logical_type,
				};
				
				// check if need get data through ajax
				if(!_isEmpty(url_str)){
					let url_str_full = _construct_url(url_str,{[SETTING_KEY_ID_LST]:id});
					let obj = {[SETTING_KEY_URLSTR]:url_str_full, 'type': 'filter', 'index': i};
					ajax_item_list.push(obj);
				}else{
					// no need to get data through ajax
					if(target_str === TARGET_GENE && filter_type === FILTER_TYPE_GENEID){
						let gene_id = id.replace(/ENT/,"GENEID");
						result_ranking_id_hash[i] = {};
						result_ranking_id_hash[i][gene_id]=1;
					}else{
						result_ranking_id_hash[i] = {};
					}
				}
			}		
		}

		// 3. filter_vgp
		let filter_vgp_gene_hash = {};
		let filter_vgp_list_str    = setting[SETTING_KEY_FILTER_VGP];		
		if(filter_vgp_list_str.length > 0){
			// analyze filter one by one
			let filter_vgp_list = filter_vgp_list_str.split(',');
			for(let i=0; i<filter_vgp_list.length; i++){
	
				let str_filter_vgp_id = filter_vgp_list[i];
				let id            = _get_id_from_filter_id(str_filter_vgp_id);
				let filter_type   = _get_filter_type_by_filter_id(str_filter_vgp_id);
				if(target_str !== TARGET_CASE && filter_type === FILTER_TYPE_GENEID){
					filter_vgp_gene_hash[id] = 1;
					continue;
				}
				let url_str      = FILTER_VGP_URL_HASH[target_str][filter_type];
				let url_str_full = _construct_url(url_str,{[SETTING_KEY_ID_LST]:id});
				let obj = {[SETTING_KEY_URLSTR]:url_str_full, 'type': 'filter_vgp', 'filter_type': filter_type,'filter_vgp_id':id};
				ajax_item_list.push(obj);
			}		
		}



		
		var callback_success = function(data,item){

			let json_data = _parseJson(data);

			if(item.type === type_ranking){
				
				ranking_data_without_filter = json_data;
				_set_ranking_data_into_cache(ranking_data_without_filter,setting_without_filter);
				
			}else if(item.type === type_filter){

				let idx = item.index;
				result_ranking_id_hash[idx] = {};
				if(!_isEmpty(json_data)){
					if(target_str === TARGET_CASE){
						if(!_isEmpty(json_data) && _isArray(json_data)){
							json_data.forEach(function(target_data_id){
								result_ranking_id_hash[idx][target_data_id] = 1;
							});
						}
					}else{
						for(jid in json_data){
							if(!_isEmpty(json_data[jid])){
								json_data[jid].forEach(function(target_data_id){
									result_ranking_id_hash[idx][target_data_id] = 1;
								});
							}
						}
					}
				}
			}else{
				// type filter vgp
				
				if(!_isEmpty(json_data)){
					
					if(target_str === TARGET_CASE){
								for(geneid in json_data){
									if(!_isEmpty(json_data[geneid]) && 'cases' in json_data[geneid] && !_isEmpty(json_data[geneid]['cases'])){
										if(geneid in filter_vgp_gene_hash){
											filter_vgp_gene_hash[geneid]['cases'].concat(json_data[geneid]['cases']);
										}else{
											filter_vgp_gene_hash[geneid] = json_data[geneid];
										}
									}
								}
					}else{
						for(jid in json_data){
							json_data[jid].forEach(function(target_data_id){
								filter_vgp_gene_hash[target_data_id] = 1;
							});
						}
					}
				}
			}
		};
		
		var callback_fail = function() {
			alert('Server access error!');
		};
		
		var callback_after_all_call = function(){
			_run_pcf_filter_logical(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,filter_vgp_gene_hash,target_str,setting);
		};
		
		var callback_fail_after_all_call = function(){
			pcf_hide_loading();
		}
		
		if(ajax_item_list.length === 0){
			if(Object.keys(result_ranking_id_hash).length >0 || Object.keys(filter_vgp_gene_hash).length >0){
				// no need to do ajax
				// do logical ,create ranking list, and continue
				_run_pcf_filter_logical(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,filter_vgp_gene_hash,target_str,setting);
				return;
			}else{
				_set_ranking_data_into_cache([],setting);
				_set_target_status_ranking_data_loaded(target_str);
				pcf_hide_loading();
				return;
			}
		}else if(ajax_item_list.length === 1){
			
			_run_ajax(ajax_item_list[0][SETTING_KEY_URLSTR],'GET', null, 'text', true, true, function(data){
				callback_success(data,ajax_item_list[0]);
				// do logical ,create ranking list, and continue
				_run_pcf_filter_logical(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,filter_vgp_gene_hash,target_str,setting);
				return;
			});
			
			return;
		}else {
			_run_ajax_sequential(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call);
		}
		
		return;
	}

	function _run_ajax(url_str,http_type,post_data,response_dataType,async,isRetry,callback,callback_fail){

		let retry_data_obj = {
			url_str:			url_str,
			http_type:			http_type,
			post_data:			post_data,
			response_dataType:	response_dataType,
			async:				async,
			callback:			callback,
			callback_fail:		callback_fail
		};

		if(http_type=="GET"){

			$.ajax({	
				url:      url_str,  // 通信先のURL
				type:     http_type,// 使用するHTTPメソッド(get/post)
				async:    async,    // 使用するHTTPメソッド(true/false)
				dataType: response_dataType,
				//timeout:  3000,
			}).done(function(data1,textStatus,jqXHR) {
				if(_isFunction(callback))callback(data1);
			}).fail(function(jqXHR, textStatus, errorThrown ) {
				//alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
				if(_isFunction(callback_fail)) callback_fail();
				pcf_hide_loading();
				if(isRetry){
					pcf_show_alert_dialog(jqXHR, textStatus, errorThrown, url_str, retry_data_obj);
				}else{
					alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
				}
			});
		}else{
			$.ajax({
				url:      url_str,  // 通信先のURL
				type:     http_type,// 使用するHTTPメソッド(get/post)
				async:    async,    // 使用するHTTPメソッド(true/false)
				data:     post_data,
				proccessData: false, 
				dataType: response_dataType,
			}).done(function(data1,textStatus,jqXHR) {
				if(_isFunction(callback))callback(data1);
			}).fail(function(jqXHR, textStatus, errorThrown ) {
				//alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
				if(_isFunction(callback_fail)) callback_fail();
				pcf_hide_loading();
				if(isRetry){
					pcf_show_alert_dialog(jqXHR, textStatus, errorThrown, url_str, retry_data_obj);
				}else{
					alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
				}
			});
		}
	}

	function _getTimeStamp(){
		let date = new Date();
		let year_str = date.getFullYear();
		let month_str = 1 + date.getMonth();
		let day_str = date.getDate();
		let hour_str = date.getHours();
		let minute_str = date.getMinutes();
		let second_str = date.getSeconds();
		month_str = ('0' + month_str).slice(-2);
		day_str = ('0' + day_str).slice(-2); 
		hour_str = ('0' + hour_str).slice(-2);
		minute_str = ('0' + minute_str).slice(-2);
		second_str = ('0' + second_str).slice(-2);
		
		let format_str = 'YYYYMMDD-hhmmss';
		format_str = format_str.replace(/YYYY/g, year_str);
		format_str = format_str.replace(/MM/g, month_str);
		format_str = format_str.replace(/DD/g, day_str);
		format_str = format_str.replace(/hh/g, hour_str);
		format_str = format_str.replace(/mm/g, minute_str);
		format_str = format_str.replace(/ss/g, second_str);
		
		return format_str;
	}

	const SETTING_KEY_URLSTR = 'url_str_full';
	function _run_ajax_sequential(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call){

		// function to trigger the ajax call
		var ajax_request = function(item) {

			var deferred = $.Deferred();

			$.ajax({
				url: item[SETTING_KEY_URLSTR],
				dataType: "text",
				type: 'GET',
				success: function(data) {
					// do something here
					if(_isFunction(callback_success)) callback_success(data,item);
					// mark the ajax call as completed
					deferred.resolve(data);
				},
				error: function(error) {
					// mark the ajax call as failed
					if(_isFunction(callback_fail)) callback_fail(error);
					deferred.reject(error);
				}
			});

			return deferred.promise();
		};

		var looper = $.Deferred().resolve();

		// go through each item and call the ajax function
		$.when.apply($, $.map(ajax_item_list, function(item, i) {
			looper = looper.then(function() {
			// trigger ajax call with item data
				return ajax_request(item);
			});
			return looper;
		})).then(function() {
			// run this after all ajax calls have completed
			if(_isFunction(callback_after_all_call)) callback_after_all_call();
			return;
			//console.log('Done!');
		}).fail(function() {
			//console.log( 'I fire if one or more requests failed.' );
			if(_isFunction(callback_fail_after_all_call)) callback_fail_after_all_call();
			pcf_hide_loading();
			return;
		});
	}

	function _modify_filter_string(filter_str){
		return filter_str.replace(/ENT:/gi,'GENEID:');
	}

	function _create_download_file(data,fileName){
		var blob = new Blob([data], { type: "application/octetstream" });
		
		//Check the Browser type and download the File.
		var isIE = false || !!document.documentMode;
		if (isIE) {
			window.navigator.msSaveBlob(blob, fileName);
		} else {
			var url = window.URL || window.webkitURL;
			link = url.createObjectURL(blob);
			var $a = $("<a />");
			$a.attr("download", fileName);
			$a.attr("href", link);
			$("body").append($a);
			$a[0].click();
			//$("body").remove(a);
			$a.remove();
		}
	}
	
	function _load_objects_by_ids(hpo_id_list,filter_id_list,filter_vgp_id_list,callback){

		if(filter_id_list)	filter_id_list = _modify_filter_string(filter_id_list);
			
		pcf_show_loading();

		let phenotype_object_list = [];
		let filter_object_list = [];
		let filter_vgp_object_list = [];

		// need to load ranking data from server.
		let ajax_item_list = [];
		let result_filter_hash = {};
		let result_filter_vgp_hash = {};

		// 1. phenotype list
		let type_phenotype = 'type_phenotype';
		if(hpo_id_list.length > 0){
			let phenotype_id_list = hpo_id_list.trim().replace(/_ja/gi, '');
			let phenotype_url_str = _construct_url(URL_GET_HPO_DATA_BY_HPO_ID, {[SETTING_KEY_ID_LST]:phenotype_id_list});
			ajax_item_list.push({[SETTING_KEY_URLSTR]:phenotype_url_str, 'type': type_phenotype});
		}

		// 2. filter list
		let type_filter = 'type_filter';
		let filter_id_list_str =filter_id_list.trim();
		if(filter_id_list_str.length > 0){
			let filter_id_list_tmp = filter_id_list_str.split(',');
			for(let i=0; i<filter_id_list_tmp.length;i++){
				let str_filter_id= filter_id_list_tmp[i];
				let logical_str  = _get_logical_str_by_filter_id(str_filter_id);
				let id           = _get_id_from_filter_id(str_filter_id);
				let filter_type  = _get_filter_type_by_filter_id(str_filter_id);
				let url_str      = FILTER_NAME_URL_HASH[filter_type];
				let url_str_full = _construct_url(url_str,{[SETTING_KEY_ID_LST]:id});
				ajax_item_list.push({[SETTING_KEY_URLSTR] : url_str_full, 
									 'type'               : type_filter,
									 'str_filter_id'      : str_filter_id,
									 'index'              : i,
									 'filter_type'        : filter_type,
									 'id'                 : id,
									 'logical_str'        : logical_str});
			}
		}
			
		// 3. filter vgp list
		let type_filter_vgp = 'type_filter_vgp';
		let filter_vgp_id_list_str =filter_vgp_id_list.trim(); 
		if(filter_vgp_id_list_str.length > 0){
			let filter_vgp_id_list_tmp = filter_vgp_id_list_str.split(',');
			for(let i=0; i<filter_vgp_id_list_tmp.length;i++){
				// MONDO,GENEID,HGNC,NANDO,PA,PAA
				let str_filter_id= filter_vgp_id_list_tmp[i];
				let id           = _get_id_from_filter_id(str_filter_id);
				let filter_type  = _get_filter_type_by_filter_id(str_filter_id);
				let url_str      = FILTER_VGP_NAME_URL_HASH[filter_type];
				let url_str_full = _construct_url(url_str,{[SETTING_KEY_ID_LST]:id});
				ajax_item_list.push({[SETTING_KEY_URLSTR] : url_str_full, 
									 'type'               : type_filter_vgp,
									 'str_filter_id'      : str_filter_id,
									 'index'              : i,
									 'filter_type'        : filter_type,
									 'id'                 : id
									 });
			}
		}
			
			
			
		var callback_success = function(data,item){
			let json_data = _parseJson(data);
			if(item.type === type_phenotype){
				hpo_id_list.trim().split(',').forEach(function(str_hpo_id){
					if(str_hpo_id.match(/_ja$/i)){
						hpo_id = str_hpo_id.replace(/_ja$/i,"");
						if(hpo_id in json_data){
							let name_text = json_data[hpo_id].name_ja;
							if(_isEmpty(name_text)) name_text = json_data[hpo_id].name_en;
							let obj = {'id':str_hpo_id, 'name':name_text};
							phenotype_object_list.push(obj);
						}
					}else{
						if(str_hpo_id in json_data){
							let obj = {'id':str_hpo_id, 'name':json_data[str_hpo_id].name_en}
							phenotype_object_list.push(obj);
						}
					}
				});
				_set_phenotype_name_data_to_cache(json_data);
			}else if(item.type === type_filter){
				let idx = item.index;
				result_filter_hash[idx] = {};
				if(!_isEmpty(json_data)){
					let lang = LANGUAGE_EN;
					if(item.str_filter_id.match(/_ja$/i))lang = LANGUAGE_JA;
					let val = _get_filter_name_or_id(item.filter_type, lang, json_data, item.id);
					if(!_isEmpty(val)){
						if(item.filter_type === FILTER_TYPE_HGNC){
							result_filter_hash[idx] = {'id': "GENEID:" +val, 'name':item.id.replace(/HGNC:/i,''), 'logicaloperator':item.logical_str};
						}else{
							result_filter_hash[idx] = {'id':item.str_filter_id, 'name':val, 'logicaloperator':item.logical_str};
						}
					}
				}
			}else{
				let idx = item.index;
				result_filter_vgp_hash[idx] = {};
				if(!_isEmpty(json_data)){
					let lang = LANGUAGE_EN;
					if(item.str_filter_id.match(/_ja$/i))lang = LANGUAGE_JA;
					let val = _get_filter_name_or_id(item.filter_type, lang, json_data, item.id);
					if(!_isEmpty(val)){
						if(item.filter_type === FILTER_TYPE_HGNC){
							result_filter_vgp_hash[idx] = {'id': "GENEID:" +val, 'name':item.id.replace(/HGNC:/i,'')};
						}else{
							result_filter_vgp_hash[idx] = {'id':item.str_filter_id, 'name':val};
						}
					}
				}
			}
		};
		
		var callback_fail = function() {
			alert('Server access error!');
		};
	
		var callback_after_all_call = function(){
			Object.keys(result_filter_hash).sort().forEach(function(idx){
				filter_object_list.push(result_filter_hash[idx]);
			});

			Object.keys(result_filter_vgp_hash).sort().forEach(function(idx){
				filter_vgp_object_list.push(result_filter_vgp_hash[idx]);
			});
			
			if(_isFunction(callback)){
				callback(phenotype_object_list, filter_object_list,filter_vgp_object_list);
			}
			return
		};
		
		var callback_fail_after_all_call = function(){
			pcf_hide_loading();
		}
		
		if(ajax_item_list.length === 0){
			pcf_hide_loading();
			return;
		}else if(ajax_item_list.length === 1){
			_run_ajax(ajax_item_list[0][SETTING_KEY_URLSTR],'GET', null, 'text', true, true, function(data){
				callback_success(data,ajax_item_list[0]);
				// do logical ,create ranking list, and continue
				if(_isFunction(callback)) callback(phenotype_object_list, filter_object_list, filter_vgp_object_list);
				return;
			});
			return;
		}else {
			_run_ajax_sequential(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call);
		}

		return;
	}
	
	var methods = {
		init: function(options) {

			let setting = $.extend(true,{}, DEFAULT_SETTINGS);

			if(_isExistVal(URL_PARA_PHENOTYPE, options)) setting[SETTING_KEY_PHENOTYPE]      = options[URL_PARA_PHENOTYPE];
			if(_isExistVal(URL_PARA_FILTER   , options)) setting[SETTING_KEY_FILTER]         = _modify_filter_string(options[URL_PARA_FILTER]);
			if(_isExistVal(URL_PARA_FILTER_VGP,options)) setting[SETTING_KEY_FILTER_VGP]     = options[URL_PARA_FILTER_VGP];			
			if(_isExistVal(URL_PARA_FORMAT   , options)) setting[SETTING_KEY_DISPLAY_FORMAT] = options[URL_PARA_FORMAT];
			if(_isExistVal(URL_PARA_LANG     , options)) setting[SETTING_KEY_LANG]           = options[URL_PARA_LANG];
			if(_isExistVal(URL_PARA_SIZE     , options) &&options[URL_PARA_SIZE] > 0) setting[SETTING_KEY_SIZE] = options[URL_PARA_SIZE];
			if(_isExistVal(SETTING_KEY_ONSELECTTAB,options)) setting[SETTING_KEY_ONSELECTTAB]= options[SETTING_KEY_ONSELECTTAB];
			if(_isExistVal(SETTING_KEY_LOAD_FILTER_IDS,options)) setting[SETTING_KEY_LOAD_FILTER_IDS]= options[SETTING_KEY_LOAD_FILTER_IDS];

			if(_isExistVal('add_token', options)) setting['add_token'] = options['add_token'];
			
			$tab_button_panel    = $('<div>').addClass("tab-button-panel").appendTo(this);
			$tab_content_wrapper = $('<div>').addClass("tab-content-wrapper").appendTo(this);
			
			TARGET_LST.forEach(function(target){
				
				let current_setting = $.extend(true,{}, setting, {[SETTING_KEY_TARGET]: target});

				let tab_button_html = "<span>"+
										"<i class=\"" + CLASS_TAB_BUTTON_ICON_PREFIX + target +"\"></i>"+
										LANGUAGE[current_setting[SETTING_KEY_LANG]]['TAB_LABEL'][target]+
									  "</span>";
				 
	
				tab_button_lst[target]=$(tab_button_html)
										.addClass(CLASS_TAB_BUTTON_PREFIX + target)
										.data(KEY_SETTING_OBJECT, current_setting)
										.click(function(){_selectTab(target);})
										.appendTo($tab_button_panel);

				tab_panel_lst[target]=$('<div>')
										.addClass("tab-content-panel")
										.data(KEY_SETTING_OBJECT,current_setting)
										.attr('placeholder','No Search Results.')
										.appendTo($tab_content_wrapper);
											
				_set_target_status_init(target);
			});

			if(_isExistVal(URL_PARA_TARGET, options)){
				_selectTab(options[URL_PARA_TARGET]);
			}else{
				_selectTab(setting[SETTING_KEY_TARGET]);				
			}			
			
			
			//if(!_isExistVal(URL_PARA_PHENOTYPE, options)) pcf_hide_loading();
			
			return this.each(function () {
				$(this);
			});
		},
		get_target: function() {
			return _get_active_target();
		},
		search: function(options){
			let setting = {};
			if(_isExistVal(URL_PARA_PHENOTYPE , options)) setting[SETTING_KEY_PHENOTYPE] = options[URL_PARA_PHENOTYPE];
			if(_isExistVal(URL_PARA_FILTER    , options)) setting[SETTING_KEY_FILTER]    = _modify_filter_string(options[URL_PARA_FILTER]);
			if(_isExistVal(URL_PARA_FILTER_VGP, options)) setting[SETTING_KEY_FILTER_VGP]= options[URL_PARA_FILTER_VGP];
			_clear_all_and_update_setting(setting);
			let current_target = _get_active_target();
			_selectTab(current_target);
		},
		retry: function(retry_data_obj){
			pcf_show_loading();
			_run_ajax(	retry_data_obj.url_str,
						retry_data_obj.http_type,
						retry_data_obj.post_data,
						retry_data_obj.response_dataType,
						retry_data_obj.async,
						true,
						retry_data_obj.callback,
						retry_data_obj.callback_fail);
		},
		update_filter: function(filter_str){
			let new_setting = {[SETTING_KEY_FILTER]: _modify_filter_string(filter_str)};
			_clear_all_and_update_setting(new_setting);
			let current_target = _get_active_target();
			_selectTab(current_target);
		},
		update_filter_vgp: function(filter_vgp_str){
			let new_setting = {[SETTING_KEY_FILTER_VGP]: filter_vgp_str};
			_clear_all_and_update_setting(new_setting);
			let current_target = _get_active_target();
			_selectTab(current_target);
		},
		update_size: function(size){
			let new_setting = {[SETTING_KEY_SIZE]: size};
			_clear_all_and_update_setting(new_setting);
			let current_target = _get_active_target();
			_selectTab(current_target);
		},
		update_display_format: function(format){
			let new_setting = {[SETTING_KEY_DISPLAY_FORMAT]: format};
			_clear_all_and_update_setting(new_setting);
			let current_target = _get_active_target();
			_selectTab(current_target);
		},
		send_share_url: function(urlstr){
			let share_url_str = _construct_url(URL_SHARE, {[SETTING_KEY_SHARE]: SHARE_TYPE_URL,[SETTING_KEY_URL]:encodeURIComponent(urlstr)});
			_run_ajax(share_url_str,'GET', null, 'text', true, true, null, null);
		},
		get_selected_num: function(){
			let target = _get_active_target();
			let $panel = tab_panel_lst[target];
			return $panel.find("input[name='target_id']:checked").length;
		},
		download: function(hpo_id_list, mode, format){

			let target = _get_active_target();
			let $panel = tab_panel_lst[target];
			let target_id = '';
			if(mode === DOWNLOAD_MODE_ALL_SHOWN){
				let tmp = [];
				$panel.find("input[name='target_id']").each(function(){
					tmp.push($(this).val());
  				});
				if(tmp.length === 0){
					pcf_show_alert_dialog_msg('Info','no records');
					return;
				}else{
					target_id = tmp.join(',');
				}
			}else if(mode === DOWNLOAD_MODE_SELECTION) {
				let tmp = [];
				$panel.find("input[name='target_id']:checked").each(function(){
					tmp.push($(this).val());
  				});
				if(tmp.length === 0){
					pcf_show_alert_dialog_msg('Info','no records selected');
					return;
				}else{
					target_id = tmp.join(',');
				}
			}else{
				//DOWNLOAD_MODE_ALL
				//check if filtered.
				let setting = $panel.data(KEY_SETTING_OBJECT);

				if(setting[SETTING_KEY_FILTER] || setting[SETTING_KEY_FILTER_VGP]){
					//filtered
					mode = DOWNLOAD_MODE_SELECTION;
					let tmp = [];
					let ranking_data_lst = _get_ranking_data_from_cache(setting);
                			for(let i=0;i<ranking_data_lst.length; i++){
		                                tmp.push(ranking_data_lst[i].id);
                        		}
					target_id = tmp.join(',');
				}
			}

			let url_hash = _construct_url(URL_DOWNLOAD, {[SETTING_KEY_TARGET]:         target,
														 [SETTING_KEY_PHENOTYPE]:      hpo_id_list,
														 [SETTING_KEY_TARGET_ID]:      target_id,
														 [SETTING_KEY_DOWNLOAD_FORMAT]:format,
														 [SETTING_KEY_DOWNLOAD_MODE]:  mode});

			pcf_show_loading();

			_run_ajax(url_hash.url,'POST',url_hash.data, 'text', true, true, function(data){

				pcf_hide_loading();

				let fileName = 'pubcasefinder_' + _getTimeStamp() + '.' + format;
				
				_create_download_file(data, fileName);
			});
		},
		download_vgp: function(filter_vgp_id_list, callback){
			
			let filter_vgp_id_list_str =filter_vgp_id_list.trim(); 
			if(filter_vgp_id_list_str.length === 0){
				alert('no virtual panel data!');
				if(_isFunction(callback))callback();
				return;
			}


			pcf_show_loading();
			
			let ajax_item_list=[];
			let filter_vgp_gene_hash = {};
			
			let filter_vgp_list = filter_vgp_id_list_str.split(',');
			for(let i=0; i<filter_vgp_list.length; i++){
	
				let str_filter_vgp_id = filter_vgp_list[i];
				let id            = _get_id_from_filter_id(str_filter_vgp_id);
				let filter_type   = _get_filter_type_by_filter_id(str_filter_vgp_id);
				if(filter_type === FILTER_TYPE_GENEID){
					filter_vgp_gene_hash[id] = str_filter_vgp_id;
					continue;
				}
				let url_str      = VGP_DOWNLOAD_URL_HASH[filter_type];
				let url_str_full = _construct_url(url_str,{[SETTING_KEY_ID_LST]:id});
				let obj = {[SETTING_KEY_URLSTR]:url_str_full, 'filter_type': filter_type,'filter_vgp_id':id};
				ajax_item_list.push(obj);
			}		


			var callback_success = function(data,item){
				let json_data = _parseJson(data);
				if(!_isEmpty(json_data)){
					for(jid in json_data){
						json_data[jid].forEach(function(target_data_id){
							if(target_data_id in filter_vgp_gene_hash){
								filter_vgp_gene_hash[target_data_id] = filter_vgp_gene_hash[target_data_id] + ',' + jid;
							}else{
								filter_vgp_gene_hash[target_data_id] = jid;
							}
						});
					}
				}
			};
		
			var callback_fail = function() {
				alert('Server access error!');
			};
		
			var callback_after_all_call = function(){
				pcf_hide_loading();
				//Convert the Byte Data to BLOB object.
				let content = '\"GENE ID\"\t\"SOURCE\"\n';
				Object.keys(filter_vgp_gene_hash).sort(function(a,b){
					let a_id = parseInt(a.replace('GENEID:',''));
					let b_id = parseInt(b.replace('GENEID:',''));
					if(a_id > b_id) {
						return 1;
					}else if(a_id < b_id) {
						return -1;
					}else{
						return 0;
					}
				}).forEach(function (gene_id) {
					content = content + "\"" + gene_id + "\"" + "\t" + "\"" + filter_vgp_gene_hash[gene_id] + "\"" + "\n"; 
				});
				
				let fileName = 'virtual_panel_' + _getTimeStamp() + '.tsv'; 

				_create_download_file(content, fileName);

				if(_isFunction(callback))callback();				
			};
		
			var callback_fail_after_all_call = function(){
				pcf_hide_loading();
				if(_isFunction(callback))callback();
			}
		
			if(ajax_item_list.length === 0){
				// do download
				callback_after_all_call();
				
			}else if(ajax_item_list.length === 1){
			
				_run_ajax(ajax_item_list[0][SETTING_KEY_URLSTR],'GET', null, 'text', true, true, function(data){
					callback_success(data,ajax_item_list[0]);
					// do logical ,create ranking list, and continue
					callback_after_all_call();
					return;
				});
			
				return;
			}else {
				_run_ajax_sequential(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call);
			}
		
			return;
		},
		expand_vgp: function(filter_vgp_id_list, callback){
			
			let filter_vgp_id_list_str =filter_vgp_id_list.trim(); 
			if(filter_vgp_id_list_str.length === 0){
				alert('no virtual panel data!');
				return;
			}

			let ajax_item_list=[];
			let vgp_expand_id_hash = {};
			
			let filter_vgp_list = filter_vgp_id_list_str.split(',');
			for(let i=0; i<filter_vgp_list.length; i++){
	
				let str_filter_vgp_id = filter_vgp_list[i];
				let id            = _get_id_from_filter_id(str_filter_vgp_id);
				let filter_type   = _get_filter_type_by_filter_id(str_filter_vgp_id);
				if(!(filter_type in VGP_EXPAND_URL_HASH)){
					continue;
				}
				let url_str      = VGP_EXPAND_URL_HASH[filter_type];
				let url_str_full = _construct_url(url_str,{[SETTING_KEY_ID_LST]:id});
				let obj = {[SETTING_KEY_URLSTR]:url_str_full, 'filter_type': filter_type,'filter_vgp_id':id};
				ajax_item_list.push(obj);
			}		


			if(ajax_item_list.length === 0){
				alert("No expandable virtual gene panel items found!");
				return;
			}
			
			pcf_show_loading();

			var callback_success = function(data,item){
				let json_data = _parseJson(data);
				if(!_isEmpty(json_data)){
					json_data.forEach(function(target_data_id){
						vgp_expand_id_hash[target_data_id] = "";
					});
				}
			};
		
			var callback_fail = function() {
				alert('Server access error!');
			};
		
			var callback_after_all_call = function(){
				if(_isEmpty(vgp_expand_id_hash)){
					pcf_hide_loading();
					alert("Got 0 expanded items.");
					return;
				}
				
				_load_objects_by_ids("","",Object.keys(vgp_expand_id_hash).join(","),callback);
				
			};
		
			var callback_fail_after_all_call = function(){
				pcf_hide_loading();
			}
		
			if(ajax_item_list.length === 1){
				_run_ajax(ajax_item_list[0][SETTING_KEY_URLSTR],'GET', null, 'text', true, true, function(data){
					callback_success(data,ajax_item_list[0]);
					// do logical ,create ranking list, and continue
					callback_after_all_call();
					return;
				});
			
				return;
			}else {
				_run_ajax_sequential(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call);
			}
		
			return;
		},

		load_phenotype_and_filter_objects_by_ids(hpo_id_list,filter_id_list,filter_vgp_id_list,callback){
			_load_objects_by_ids(hpo_id_list,filter_id_list,filter_vgp_id_list,callback);
		},
		load_phenotype_objects_by_ids(hpo_id_list,lang,callback){
			pcf_show_loading();
			let phenotype_id_list = hpo_id_list.trim().replace(/_ja/gi, '');
			let phenotype_url_str = _construct_url(URL_GET_HPO_DATA_BY_HPO_ID_LOCAL, {[SETTING_KEY_ID_LST]:phenotype_id_list});

			_run_ajax(phenotype_url_str,'GET', null, 'text', true, false, function(data){

				let phenotype_object_list = [];

				let json_data = _parseJson(data);
				
				hpo_id_list.trim().split(',').forEach(function(str_hpo_id){
					if(lang === 'ja'){
						hpo_id = str_hpo_id.replace(/_ja$/i,"");
						if(hpo_id in json_data){
							let name_text = json_data[hpo_id].name_ja;
							if(_isEmpty(name_text)) name_text = json_data[hpo_id].name_en;
							let obj = {'id':str_hpo_id, 'name':name_text};
							phenotype_object_list.push(obj);
						}
					}else{
						if(str_hpo_id in json_data){
							let obj = {'id':str_hpo_id, 'name':json_data[str_hpo_id].name_en}
							phenotype_object_list.push(obj);
						}
					}
				});

				_set_phenotype_name_data_to_cache(json_data);
			
				pcf_hide_loading();

				if(_isFunction(callback)){
					callback(phenotype_object_list);
				}

				return;
			});
		},
	};
	
	$.fn.pcf_content = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};

}(jQuery));
