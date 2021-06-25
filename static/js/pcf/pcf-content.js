;(function ($) {

	const URL_GET_RANKING_BY_HPO_ID                 = 'https://pcf.dbcls.jp/pcf_get_ranking_by_hpo_id',
		  URL_GET_RANKING_BY_HPO_ID_WITH_FILTER     = 'get_ranking_by_hpo_id_with_filter',

		  URL_GET_DATA_BY_ID                        = 'get_data_by_id',
		  URL_GET_OMIM_DATA_BY_OMIM_ID              = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_omim_data_by_omim_id',
		  URL_GET_ORPHA_DATA_BY_ORPHA_ID            = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_orpha_data_by_orpha_id',
		  URL_GET_GENE_DATA_BY_NCBI_GENE_ID         = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_gene_data_by_ncbi_gene_id',
		  URL_GET_CASE_DATA_BY_CASE_ID              = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_case_data_by_case_id',

		  URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID     = 'https://pcf.dbcls.jp/pcf_get_count_case_report_by_mondo_id',

		  URL_GET_HPO_DATA_BY_OMIM_ID               = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_omim_id',
		  URL_GET_HPO_DATA_BY_HPO_ID                = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_hpo_id',
		  URL_GET_HPO_DATA_BY_ORPHA_ID              = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_orpha_id',

		  URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID        = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_tooltip_data_by_hpo_id',
		  URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_gene_tooltip_data_by_ncbi_gene_id',
		  URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID  = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_disease_tooltip_data_by_mondo_id',

		  URL_GET_CASE_REPORT_BY_MONDO_ID           = 'https://pcf.dbcls.jp/pcf_get_case_report_by_mondo_id',

		  URL_SHARE                                 = '/pcf_share',

		  URL_DOWNLOAD                              = '/pcf_download',

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
		  URL_PCF_FILTER_GET_ALL_GENE_ID                    = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_all_gene_id';

	const URL_PARA_TARGET         = 'target',
		  URL_PARA_PHENOTYPE      = 'phenotype',
		  URL_PARA_FILTER         = 'filter',
		  URL_PARA_SIZE           = 'size',
		  URL_PARA_DISPLAY_FORMAT = 'display_format',
		  URL_PARA_LANG           = 'lang',
		  URL_PARA_OMIM_ID        = 'omim_id',
		  URL_PARA_MONDO_ID       = 'mondo_id',
		  URL_PARA_NCBI_GENE_ID   = 'ncbi_gene_id',
		  URL_PARA_NCBI_ID        = 'ncbi_id',
		  URL_PARA_CASE_ID        = 'case_id',
		  URL_PARA_HPO_ID         = 'hpo_id',
		  URL_PARA_ORPHA_ID       = 'orpha_id',
  		  URL_PARA_TARGET_ID      = 'target_id',
		  URL_PARA_RANK           = 'rank',
		  URL_PARA_SCORE          = 'score',
		  URL_PARA_FORMAT         = 'format',
		  URL_PARA_SHARE          = 'share',
		  URL_PARA_URL            = 'url';

	const TARGET_OMIM='omim',TARGET_ORPHANET='orphanet',TARGET_GENE='gene',TARGET_CASE='case',
		  TARGET_LST=[TARGET_OMIM,TARGET_ORPHANET,TARGET_GENE,TARGET_CASE];

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
										{'CLASS':'list-tag_gray', 'TEXT':'疾患原因遺伝子'}]
				},
				'DETAIL_LABEL': {
					'FIND_IMAGES':  '画像検索(Google)',
					'PHENOTYPE_LST':'症状一覧',
					'JA_REPORT':    '症例報告（J-STAGE & J-GLOBAL）',
					'EN_REPORT':    '症例報告（PubMed）',
					'UR_DBMS':      '日本語疾患詳細(UR-DBMS)',
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
										{'CLASS':'list-tag_gray', 'TEXT':'Causative Gene'}]
				},
				'DETAIL_LABEL': {
					'FIND_IMAGES':   'Find images(Google)',
					'PHENOTYPE_LST': 'Symptom List',
					'JA_REPORT':     'Case Report(J-STAGE & J-GLOBAL)',
					'EN_REPORT':     'Case Report(PubMed)',
					'UR_DBMS':       'UR-DBMS'
				}
			}
		};

	const SETTING_KEY_TARGET         = 'PCF-TARGET',
		  SETTING_KEY_PHENOTYPE      = 'PCF-PHENOTYPE',
		  SETTING_KEY_FILTER         = 'PCF-FILTER',
		  SETTING_KEY_SIZE           = 'PCF-SIZE',
		  DISPLAY_FORMAT_FULL        = 'full', 
		  DISPLAY_FORMAT_SUMMARY     = 'summary',
		  SETTING_KEY_DISPLAY_FORMAT = 'PCF-DISPLAY-FORMAT',
		  SETTING_KEY_LANG           = 'PCF-LANG',
		  SETTING_KEY_ID_LST         = 'PCF-ID-LST',
		  SETTING_KEY_ONSELECTTAB    = 'onSelectTab';

	var DEFAULT_SETTINGS = {
		[SETTING_KEY_TARGET]:         TARGET_OMIM,
		[SETTING_KEY_PHENOTYPE]:      '',
		[SETTING_KEY_FILTER]:         '',
		[SETTING_KEY_SIZE]:           10,
		[SETTING_KEY_DISPLAY_FORMAT]: DISPLAY_FORMAT_FULL,
		[SETTING_KEY_LANG]:           LANGUAGE_JA,
		[SETTING_KEY_ONSELECTTAB]:    null
	};


	const KEY_SETTING_OBJECT = 'pcf-setting',
		  KEY_TARGET         = 'pcf-target';

	const CLASS_ACTIVE                    = "pcf-active",
		  CLASS_STATUS_DETAIL_DATA_LOADED = "pcf-status-data-loaded",
		  CLASS_STATUS_RANKING_LOADED     = "pcf-status-ranking-data-loaded",
		  CLASS_TAB_BUTTON_PREFIX         = "tab-button-",
		  CLASS_TAB_BUTTON_ICON_PREFIX    = "icon-",
		  CLASS_ROW                       = "list-content",
		  CLASS_POPUP_PHENOTYPE           = "pcf-popup px-4 py-3 pcf-popup-pheotype",
		  CLASS_POPUP_INHERITANCE         = "pcf-popup px-4 py-3 pcf-popup-inheritance",
		  CLASS_POPUP_GENE                = "pcf-popup px-4 py-3 pcf-popup-gene",
		  CLASS_POPUP_DISEASE             = "pcf-popup px-4 py-3 pcf-popup-disease";

	const	POPUP_TYPE_PHENOTYPE    = "popup-phenotype",
			POPUP_TYPE_INHERITANCE  = "popup-inheritance",
			POPUP_TYPE_GENE         = "popup-gene",
			POPUP_TYPE_DISEASE      = "popup-disease",
			KEY_POPUP_TYPE          = 'pcf-popup-type',
			KEY_POPUP_ID_PHENOTYPE  = 'pcf-phenotype-id',
			KEY_POPUP_ID_INHERITANCE = 'pcf-inheritance-id',
			KEY_POPUP_ID_NCBI_GENE  = 'pcf-gene-id',
			KEY_POPUP_ID_DISEASE    = 'pcf-disease-id',
			POPUP_ID_KEY_HASH = {
				[POPUP_TYPE_PHENOTYPE]   : KEY_POPUP_ID_PHENOTYPE,
				[POPUP_TYPE_INHERITANCE] : KEY_POPUP_ID_INHERITANCE,
				[POPUP_TYPE_GENE]        : KEY_POPUP_ID_NCBI_GENE,
				[POPUP_TYPE_DISEASE]     : KEY_POPUP_ID_DISEASE
			},
			KEY_POPUP_DATA         = 'pcf-popup-data',
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
		FILTER_TYPE_ENT='ENT:',FILTER_TYPE_MONDO='MONDO:',FILTER_TYPE_HPO='HP:',FILTER_TYPE_ALL='ALL',
		tokenLogicaloperatorItemAndValue='AND_',tokenLogicaloperatorItemORValue='',tokenLogicaloperatorItemNOTValue='NOT_',
		RegExp_AND    = new RegExp(tokenLogicaloperatorItemAndValue, 'i'),RegExp_NOT    = new RegExp(tokenLogicaloperatorItemNOTValue, 'i'),
		FILTER_URL_HASH = {
			[TARGET_OMIM]:     {
				[FILTER_TYPE_ENT]   : URL_PCF_FILTER_GET_OMIM_ID_BY_NCBI_GENE_ID,
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_OMIM_ID_BY_MONDO_ID,
				[FILTER_TYPE_HPO]   : URL_PCF_FILTER_GET_OMIM_ID_BY_INHERITANCE_HPO_ID,
				[FILTER_TYPE_ALL]   : URL_PCF_FILTER_GET_ALL_OMIM_ID
			},
			[TARGET_ORPHANET]: {
				[FILTER_TYPE_ENT]   : URL_PCF_FILTER_GET_ORPHA_ID_BY_NCBI_GENE_ID,
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_ORPHA_ID_BY_MONDO_ID,
				[FILTER_TYPE_HPO]   : URL_PCF_FILTER_GET_ORPHA_ID_BY_INHERITANCE_HPO_ID,
				[FILTER_TYPE_ALL]   : URL_PCF_FILTER_GET_ALL_ORPHA_ID
			},
			[TARGET_GENE]:     {
				[FILTER_TYPE_ENT]   : "",
				[FILTER_TYPE_MONDO] : URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID,
				[FILTER_TYPE_HPO]   : URL_PCF_FILTER_GET_GENE_ID_BY_INHERITANCE_HPO_ID,
				[FILTER_TYPE_ALL]   : URL_PCF_FILTER_GET_ALL_GENE_ID
			},
			[TARGET_CASE]:     {
				[FILTER_TYPE_ENT]   : "",
				[FILTER_TYPE_MONDO] : "",
				[FILTER_TYPE_HPO]   : "",
				[FILTER_TYPE_ALL]   : ""
			}
		},
		FILTER_NAME_URL_HASH = {
			[FILTER_TYPE_ENT]   : URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID,
			[FILTER_TYPE_MONDO] : URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID,
			[FILTER_TYPE_HPO]   : URL_GET_HPO_DATA_BY_HPO_ID
		};

	function _get_filter_url_all(target){
		return FILTER_URL_HASH[target][FILTER_TYPE_ALL];
	}
	
	function _get_filter_url_by_filter_id(target,filter_id){
		let url_str="";
		let filter_type = _get_filter_type_by_filter_id(filter_id);
		if(filter_type) url_str=FILTER_URL_HASH[target][filter_type];
		return url_str;
	}
	
	// filter_id: ^(|AND_|OR_|NOT_)(ENT|MONDO|HP):\d+(|_ja)$
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

	function _get_filter_name(filter_type,lang,json_data,id){
		let name = '';
		if(filter_type === FILTER_TYPE_MONDO){
			if('name_en' in json_data)	name = json_data.name_en;
			if(lang === LANGUAGE_JA && 'name_ja' in json_data) name = json_data.name_ja;
		}else if(filter_type === FILTER_TYPE_HPO){
			if(id in json_data){
				if('name_en' in json_data[id]) name = json_data[id].name_en;
				if(lang === LANGUAGE_JA && 'name_ja' in json_data[id]) name = json_data[id].name_ja;
			}
		}else if("hgnc_gene_symbol" in json_data){
			name = json_data["hgnc_gene_symbol"];
		}
		return name;
	}

	function _get_filter_type_by_filter_id(filter_id){
		const RegExp_ENT   = new RegExp(FILTER_TYPE_ENT,   'i');
		const RegExp_MONDO = new RegExp(FILTER_TYPE_MONDO, 'i');
		const RegExp_HPO   = new RegExp(FILTER_TYPE_HPO,   'i');
		if(RegExp_ENT.test(filter_id)){
			return FILTER_TYPE_ENT;
		}else if(RegExp_MONDO.test(filter_id)){
			return FILTER_TYPE_MONDO;
		}else if(RegExp_HPO.test(filter_id)){
			return FILTER_TYPE_HPO;
		}else{
			alert('found unknown filter id('+filter_id+')');
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
		if(SETTING_KEY_FILTER in setting && !_isEmpty(setting[SETTING_KEY_FILTER])){
			return _contruct_url(URL_GET_RANKING_BY_HPO_ID_WITH_FILTER, setting);
		}else{
			return _contruct_url(URL_GET_RANKING_BY_HPO_ID, setting);
		}
	}

	// contruct key and return relative ranking data(json object) in ranking cache 
	function _get_ranking_data_from_cache(setting){
		let key = _contruct_ranking_cache_key(setting);
		return pcf_ranking_cache[key];
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
	function _contruct_url_str(url, datalst){
		let str = url + "?";
		for(let para_name in datalst){
			str = str + para_name + "=" + datalst[para_name] + "&";
		}
		return str;
	}
	
	//contruct url
	function _contruct_url(url_key, setting){
		
		let url_str = "";
		
		if(url_key === URL_GET_RANKING_BY_HPO_ID){
			
			url_str = _contruct_url_str(URL_GET_RANKING_BY_HPO_ID, {[URL_PARA_TARGET]   : setting[SETTING_KEY_TARGET], 
																	[URL_PARA_PHENOTYPE]: setting[SETTING_KEY_PHENOTYPE]});
																	
		}else if(url_key === URL_GET_RANKING_BY_HPO_ID_WITH_FILTER){
			
			url_str = _contruct_url_str(URL_GET_RANKING_BY_HPO_ID_WITH_FILTER, {[URL_PARA_TARGET]   : setting[SETTING_KEY_TARGET], 
																				[URL_PARA_PHENOTYPE]: setting[SETTING_KEY_PHENOTYPE],
																				[URL_PARA_FILTER]   : setting[SETTING_KEY_FILTER]});
																				
		}else if(url_key === URL_GET_DATA_BY_ID && setting[SETTING_KEY_TARGET] === TARGET_OMIM){
			
			url_str = _contruct_url_str(URL_GET_OMIM_DATA_BY_OMIM_ID,{[URL_PARA_OMIM_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_GET_DATA_BY_ID && setting[SETTING_KEY_TARGET] === TARGET_ORPHANET){
			
			url_str = _contruct_url_str(URL_GET_ORPHA_DATA_BY_ORPHA_ID,{[URL_PARA_ORPHA_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_GET_DATA_BY_ID && setting[SETTING_KEY_TARGET] === TARGET_GENE){
			
			url_str = _contruct_url_str(URL_GET_GENE_DATA_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_GET_DATA_BY_ID && setting[SETTING_KEY_TARGET] === TARGET_CASE){
			
			url_str = _contruct_url_str(URL_GET_CASE_DATA_BY_CASE_ID,{[URL_PARA_CASE_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID){
			
			url_str = _contruct_url_str(URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID,{[URL_PARA_HPO_ID]: setting[URL_PARA_HPO_ID]});
			
		}else if(url_key === URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID){

			let ent_id = setting[SETTING_KEY_ID_LST];
			let ncbi_gene_id = ent_id.replace(/ENT/,"GENEID");
			url_str = _contruct_url_str(URL_GET_GENE_TOOLTIP_DATA_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]:ncbi_gene_id});
			
		}else if(url_key === URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID){
			
			url_str = _contruct_url_str(URL_GET_DISEASE_TOOLTIP_DATA_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_GET_HPO_DATA_BY_OMIM_ID){
			
			url_str = _contruct_url_str(URL_GET_HPO_DATA_BY_OMIM_ID,{[URL_PARA_OMIM_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_GET_HPO_DATA_BY_ORPHA_ID){
			
			url_str = _contruct_url_str(URL_GET_HPO_DATA_BY_ORPHA_ID,{[URL_PARA_ORPHA_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_GET_HPO_DATA_BY_HPO_ID){
			
			url_str = _contruct_url_str(URL_GET_HPO_DATA_BY_HPO_ID,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID){
			
			url_str = _contruct_url_str(URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID,{ [URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST],
																				[URL_PARA_LANG]: setting[SETTING_KEY_LANG]});
																				
		}else if(url_key === URL_GET_CASE_REPORT_BY_MONDO_ID){
			
			url_str = _contruct_url_str(URL_GET_CASE_REPORT_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST],
																		 [URL_PARA_LANG]: setting[SETTING_KEY_LANG]});
																	
		}else if(url_key === URL_PCF_FILTER_GET_OMIM_ID_BY_MONDO_ID){
			
			url_str = _contruct_url_str(URL_PCF_FILTER_GET_OMIM_ID_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_PCF_FILTER_GET_OMIM_ID_BY_NCBI_GENE_ID){
			
			let ent_id = setting[SETTING_KEY_ID_LST];
			let ncbi_gene_id = ent_id.replace(/ENT/,"GENEID");
			url_str = _contruct_url_str(URL_PCF_FILTER_GET_OMIM_ID_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]: ncbi_gene_id});
			
		}else if(url_key === URL_PCF_FILTER_GET_OMIM_ID_BY_INHERITANCE_HPO_ID){
			
			url_str = _contruct_url_str(URL_PCF_FILTER_GET_OMIM_ID_BY_INHERITANCE_HPO_ID,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_PCF_FILTER_GET_ORPHA_ID_BY_MONDO_ID){
			
			url_str = _contruct_url_str(URL_PCF_FILTER_GET_ORPHA_ID_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_PCF_FILTER_GET_ORPHA_ID_BY_NCBI_GENE_ID){
			
			let ent_id = setting[SETTING_KEY_ID_LST];
			let ncbi_gene_id = ent_id.replace(/ENT/,"GENEID");
			url_str = _contruct_url_str(URL_PCF_FILTER_GET_ORPHA_ID_BY_NCBI_GENE_ID,{[URL_PARA_NCBI_GENE_ID]: ncbi_gene_id});
			
		}else if(url_key === URL_PCF_FILTER_GET_ORPHA_ID_BY_INHERITANCE_HPO_ID){
			
			url_str = _contruct_url_str(URL_PCF_FILTER_GET_ORPHA_ID_BY_INHERITANCE_HPO_ID,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID){
			
			url_str = _contruct_url_str(URL_PCF_FILTER_GET_GENE_ID_BY_MONDO_ID,{[URL_PARA_MONDO_ID]: setting[SETTING_KEY_ID_LST]});
			
		}else if(url_key === URL_PCF_FILTER_GET_GENE_ID_BY_INHERITANCE_HPO_ID){
			
			url_str = _contruct_url_str(URL_PCF_FILTER_GET_GENE_ID_BY_INHERITANCE_HPO_ID,{[URL_PARA_HPO_ID]: setting[SETTING_KEY_ID_LST]});
			
		}
		return url_str;
	}

	// some util functions
	var _isObject   = function(value) {return $.isPlainObject(value);},
		_isArray    = function(value) {return $.isArray(value);},
		_isFunction = function(value) {return $.isFunction(value);},
		_isNumeric  = function(value) {return $.isNumeric(value);},
		_isString   = function(value) {return typeof value === 'string';},
		_isBoolean  = function(value) {return typeof value === 'boolean';},
		_isEmpty    = function(value, allowEmptyString) {
			return	(value === null) || (value === undefined) || 
					(!allowEmptyString ? value === '' : false) || 
					(_isArray(value) && value.length === 0)||
					(_isObject(value) && Object.keys(value).length === 0);	
		},
		_isDefined  = function(value) {return typeof value !== 'undefined';},
		_isExistVal = function(key, hash){
			if(_isEmpty(hash))  return false;
			
			if (!(key in hash)) return false;
			
			return !_isEmpty(hash[key]);
		},
		_hasJA = function( str ) {return ( str && str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/) )? true : false},
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

	// 
	function _selectTab(target){
		_set_active_target(target);

		let $target_tab_panel = tab_panel_lst[target];
		let current_setting = $target_tab_panel.data(KEY_SETTING_OBJECT);

		if(_isFunction(current_setting[SETTING_KEY_ONSELECTTAB])){
			current_setting[SETTING_KEY_ONSELECTTAB](LANGUAGE[current_setting[SETTING_KEY_LANG]]['TAB_LABEL'][target]);
		}
		
		if(_is_target_status_data_loaded(target)) return;

		if(_isEmpty(current_setting[SETTING_KEY_PHENOTYPE])) return;

		_run_pcf_search(current_setting);
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

	function _contruct_popup_content(popup_id,popup_type,popup_data){
		
		let popup_html_id = POPUP_HTML_ID_HASH[popup_type];
		let content = $("#"+popup_html_id).html();

		if(popup_type === POPUP_TYPE_PHENOTYPE || popup_type === POPUP_TYPE_INHERITANCE){
			let name_ja = _contruct_popup_content_val('name_ja',popup_data);
			let name_en = _contruct_popup_content_val('name_en',popup_data);
			if(_isEmpty(name_ja) && _isEmpty(name_en)){
				//alert('no data found for '+ popup_id);
				return '';
			}
			content = content.replace(/popup_content_pcf-phenotype-id/g, popup_id);	
			content = content.replace(/popup_content_hpo_url/g,   _contruct_popup_content_val('hpo_url',popup_data));	
			content = content.replace(/popup_content_name_ja/g,   name_ja);
			content = content.replace(/popup_content_name_en/g,   name_en);
			content = content.replace(/popup_content_definition/g,_contruct_popup_content_val('definition',popup_data));
			content = content.replace(/popup_content_comment/g,   _contruct_popup_content_val('comment',popup_data));
			content = content.replace(/popup_content_synonym/g,   _contruct_popup_content_val('synonym',popup_data));
		}else if(popup_type === POPUP_TYPE_GENE){
			let type_of_gene = _contruct_popup_content_val('type_of_gene',popup_data);
			if(_isEmpty(type_of_gene)){
				//alert('no data found for '+ popup_id);
				return '';
			}
			content = content.replace(/popup_content_pcf-gene-id/g, popup_id);	
			content = content.replace(/popup_content_ncbi_gene_url/g,   _contruct_popup_content_val('ncbi_gene_url',popup_data));
			content = content.replace(/popup_content_hgnc_gene_url/g,   _contruct_popup_content_val('hgnc_gene_url',popup_data));
			content = content.replace(/popup_content_hgnc_gene_symbol/g,_contruct_popup_content_val('hgnc_gene_symbol',popup_data));
			content = content.replace(/popup_content_synonym/g,         _contruct_popup_content_val('synonym',popup_data,'|'));
			content = content.replace(/popup_content_full_name/g,       _contruct_popup_content_val('full_name',popup_data));
			content = content.replace(/popup_content_other_full_name/g, _contruct_popup_content_val('other_full_name',popup_data));
			content = content.replace(/popup_content_type_of_gene/g,    type_of_gene);
			content = content.replace(/popup_content_location/g,        _contruct_popup_content_val('location',popup_data));
		}else if(popup_type === POPUP_TYPE_DISEASE){
			let name_ja = _contruct_popup_content_val('name_ja',popup_data);
			let name_en = _contruct_popup_content_val('name_en',popup_data);
			if(_isEmpty(name_ja) && _isEmpty(name_en)){
				//alert('no data found for '+ popup_id);
				return '';
			}
			content = content.replace(/popup_content_pcf-disease-id/g, popup_id);
			content = content.replace(/popup_content_mondo_url/g, _contruct_popup_content_val('mondo_url',popup_data));	
			content = content.replace(/popup_content_name_ja/g,   name_ja);
			content = content.replace(/popup_content_name_en/g,   name_en);
			content = content.replace(/popup_content_definition/g,_contruct_popup_content_val('definition',popup_data));	
			content = content.replace(/popup_content_synonym/g,   _contruct_popup_content_val('synonym',popup_data));
			content = content.replace(/popup_content_omim_list/g, _contruct_popup_content_val_hash('omim_id','omim_url',popup_data));
			content = content.replace(/popup_content_orpha_list/g,_contruct_popup_content_val_hash('orpha_id','orpha_url',popup_data));
		}else {
			//ありえない
		}

		return content;
	}
	
	function _popoverContent() {  
		
		let content = '';  
		let $element = $(this);// popover trigger 
		let popup_type   = $element.data(KEY_POPUP_TYPE);
		let popup_id_key = POPUP_ID_KEY_HASH[popup_type]; 
		let popup_id     = $element.data(popup_id_key);

		let popup_data = $element.data(KEY_POPUP_DATA);
		if(_isEmpty(popup_data)){

			let url_str    = POPUP_URL_HASH[popup_type];
			let url_id_key = POPUP_URL_PARA_HASH[popup_type];
			url_str = _contruct_url(url_str,{[url_id_key]: popup_id}); 
			
			$.ajax({  
				url:    url_str,  
				method: "GET",  
				async:  false,  	
				dataType: "text",
				success:function(data){  
					let json_data = JSON.parse(data);
					if(!_isEmpty(json_data)){
						$element.data(KEY_POPUP_DATA,json_data);
						content = _contruct_popup_content(popup_id,popup_type,json_data);
						$element.attr('data-content',content);
					}else{
						content = "no data found";
					}
				}  
			});  

		}else{
			content = _contruct_popup_content(popup_id,popup_type,popup_data);
		}
		
		return content;  
	} 

	function _contruct_popup_button(popup_type, key_popup_id, id,list_tag,text,class_popup){
		return $('<span>').data(KEY_POPUP_TYPE,popup_type).data(key_popup_id,id)
							.addClass("list-tag").addClass(list_tag).text(text)
							.click(function(){$(this).toggleClass("pcf-active");})
							.popover({html:true,placement:'bottom',trigger:'hover click',content:_popoverContent,sanitize:false,
					  template:'<div class=\"popover\" role=\"tooltip\"><div class=\"arrow\"></div><div class=\"popover-body '+class_popup+'\"></div></div>'});

	}

	function _contruct_detail(id, phenoList, item, lang, target, display_format, $container_panel){

		let isJA = (lang === LANGUAGE_JA);
		let isDisplayFull = (display_format === DISPLAY_FORMAT_FULL);
		
		// 1. english title
		let $h3 = $('<h3>').appendTo($container_panel);
		if("omim_disease_name_en" in item){
			$h3.text(item.omim_disease_name_en);
		}else if("orpha_disease_name_en"in item){
			$h3.text(item.orpha_disease_name_en);
		}else if("hgnc_gene_symbol" in item){
			$h3.text(item.hgnc_gene_symbol + " (NCBI "+id+")");
		}else{
			$h3.text(id);
		}

		// 2. japanese title
		if(isJA && ("omim_disease_name_ja" in item)){
			$("<h2>").text(item.omim_disease_name_ja).appendTo($container_panel);
		}else if(isJA && ("orpha_disease_name_ja" in item)){
			$("<h2>").text(item.orpha_disease_name_ja).appendTo($container_panel);
		}else{
			$h3.css({'margin-bottom':'0.5em'});
		}

		// 3. phenotypes list
		if(!_isEmpty(phenoList)){
			//let $container_list_query = $('<div>').addClass("list-query").appendTo($container_panel);
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
				_contruct_popup_button(POPUP_TYPE_PHENOTYPE, KEY_POPUP_ID_PHENOTYPE, hpo_id, "list-tag_blue", label_text, CLASS_POPUP_PHENOTYPE).appendTo($container_list_query);
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
						_contruct_popup_button(POPUP_TYPE_INHERITANCE, KEY_POPUP_ID_INHERITANCE, hpo_id, "list-tag_green", text, CLASS_POPUP_INHERITANCE).appendTo($container_list_heredity);
					}
				}
	
				if(_isExistVal("hgnc_gene_symbol",item)){
					for(let i=0;i<item.hgnc_gene_symbol.length;i++){
						let text = item.hgnc_gene_symbol[i];
						let id    = item.ncbi_gene_id[i];
						_contruct_popup_button(POPUP_TYPE_GENE, KEY_POPUP_ID_NCBI_GENE, id, "list-tag_gray", text, CLASS_POPUP_GENE).appendTo($container_list_heredity);
					}
				}
			}
		}else if(target === TARGET_GENE){
			if(_isExistVal("mondo_disease_name_en",item)){
				let $container_list_diseasename = $('<div>').addClass("d-flex").addClass("flex-wrap").addClass("list-tag-wrapper").appendTo($container_panel);
				
				for(let mondo_id in item.mondo_disease_name_en){
					let text = item.mondo_disease_name_en[mondo_id];
					if(isJA && _isExistVal(mondo_id, item.mondo_disease_name_ja)) text = item.mondo_disease_name_ja[mondo_id];
					_contruct_popup_button(POPUP_TYPE_DISEASE, KEY_POPUP_ID_DISEASE, mondo_id, "list-tag_red", text, CLASS_POPUP_DISEASE).appendTo($container_list_diseasename);
					
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
						_contruct_popup_button(POPUP_TYPE_INHERITANCE, KEY_POPUP_ID_INHERITANCE, hpo_id, "list-tag_green", text, CLASS_POPUP_INHERITANCE).appendTo($container_list_disease);
					}else{
						$('<span>').addClass("list-tag").addClass("list-tag_green").text(text).appendTo($container_list_disease);
					}
				}
			}
		}
		
		
		// 5. description p
		if(isDisplayFull && _isExistVal("description",item)){
			let $p = $('<p>').text(item.description).appendTo($container_panel);
			let href_str = encodeURIComponent(item.description);
			    href_str = "https://translate.google.co.jp/?sl=en&tl=ja&text=" + href_str + "&op=translate&hl=ja";
			
			$("<a>").text(" >> Translate(Google)").attr( 'href', href_str).attr('target', '_blank').appendTo($p);
		}
		
		
		// 6. list link line
		if(isDisplayFull && target !== TARGET_CASE){
			let $list_link_panel = $('<div>').addClass("d-flex").addClass("flex-wrap").addClass("list-link").appendTo($container_panel);
			
			if(_isExistVal("omim_url" ,item)){
				$('<a>').text(id).attr('href',item.omim_url).attr('target','_blank').appendTo($list_link_panel);
			} else if(_isExistVal("orpha_url" ,item)){
				$('<a>').text(id).attr('href',item.orpha_url).attr('target','_blank').appendTo($list_link_panel);
			} else if(target === TARGET_GENE){
				$('<a>').text("NCBI " + id).attr('href',"https://www.ncbi.nlm.nih.gov/gene/?term=" + id).attr('target','_blank').appendTo($list_link_panel);

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
			
			
			if(_isExistVal("omim_disease_name_en", item)){
				let href_str = "http://www.google.com/search?q="+item.omim_disease_name_en+"&tbm=isch";
				//if (isJA) href_str = "http://www.google.com/search?q="+item.omim_disease_name_ja+"&tbm=isch";
				$('<a>').text(LANGUAGE[lang].DETAIL_LABEL.FIND_IMAGES).attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);
			} else if(_isExistVal("orpha_disease_name_en", item)){
				let href_str = "http://www.google.com/search?q="+item.orpha_disease_name_en+"&tbm=isch";
				//if (isJA) href_str = "http://www.google.com/search?q="+item.orpha_disease_name_ja+"&amp;tbm=isch";
				$('<a>').text(LANGUAGE[lang].DETAIL_LABEL.FIND_IMAGES).attr('href',href_str).attr('target','_blank').appendTo($list_link_panel);
			}
			
			if(_isExistVal("mondo_url",item)){
				for(let i=0;i<item.mondo_url.length;i++){
					$('<a>').text("Monarch").attr('href',item.mondo_url[i]).attr('target','_blank').appendTo($list_link_panel);
				}
			}
	
			if(_isExistVal("kegg_url",item)){
				item.kegg_url.forEach(function(url_str){
					$('<a>').text("KEGG:" + _get_id_from_url(url_str)).attr('href',url_str).attr('target','_blank').appendTo($list_link_panel);
				});
			}
	
			if(_isExistVal("gene_reviews_url",item)){
				item.gene_reviews_url.forEach(function(url_str){
					$('<a>').text("Gene Reviews").attr('href',url_str).attr('target','_blank').appendTo($list_link_panel);
				});
			}
			
			if(_isExistVal("gtr_url",item)){ 
				item.gtr_url.forEach(function(url_str){
					$('<a>').text("GTR").attr('href',url_str).attr('target','_blank').appendTo($list_link_panel);
				});
			}
		
		}
		
		
		//7. list link line
		if(isDisplayFull && (target === TARGET_OMIM || target === TARGET_ORPHANET)) {

			let mondo_id = ""
			if(_isExistVal("mondo_id",item)) mondo_id = item["mondo_id"][0];

			let case_report_count_ja = _get_case_report_count_data_from_cache(mondo_id, LANGUAGE_JA);
			let case_report_count_en = _get_case_report_count_data_from_cache(mondo_id, LANGUAGE_EN);
			let url_phenotype        = _contruct_url(URL_GET_HPO_DATA_BY_OMIM_ID,{[SETTING_KEY_ID_LST]:id});
			if(target === TARGET_ORPHANET) url_phenotype = _contruct_url(URL_GET_HPO_DATA_BY_ORPHA_ID,{[SETTING_KEY_ID_LST]:id});
			let url_case_report_en   = _contruct_url(URL_GET_CASE_REPORT_BY_MONDO_ID,{[SETTING_KEY_ID_LST]: mondo_id,[SETTING_KEY_LANG]: LANGUAGE_EN});
			let url_case_report_ja   = _contruct_url(URL_GET_CASE_REPORT_BY_MONDO_ID,{[SETTING_KEY_ID_LST]: mondo_id,[SETTING_KEY_LANG]: LANGUAGE_JA});
		
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
				"PCF-LANGUAGE"           : lang
			}).appendTo($container_panel);
		}

		return $container_panel;
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
		
		let detail_data = _get_detail_data_from_cache(target);
		if(_isEmpty(detail_data)) return;


		let loaded_num  = _get_target_loaded_num(target);
		let isFirstLoad = true;
		if(loaded_num > 0) isFirstLoad = false;
		
		let total_num = ranking_list.length;
		let total_num_str = total_num.toLocaleString("en-US");

		// top
		if(isFirstLoad){
			let $top_panel = $('<div>').addClass("list-header").appendTo($target_tab_panel);
			$('<div>').addClass("list-results").text(total_num_str + " results").appendTo($top_panel);
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
			let $td_right = $('<div>').addClass('list-content_right').appendTo($tr);

			// left
			let $rank = $('<div>').addClass('rank').appendTo($td_left);
			//let input_str = "<input type=\"checkbox\" value=\""+ranking_list[i].id+"\"><p>"+ranking_list[i].rank+"</p></input>";
			let input_str = "<input type=\"checkbox\" value=\""+ranking_list[i].id+"\"><p>"+(i+1)+"</p></input>";
			$(input_str).appendTo($rank);
			
			
			let percentage_str = "<span>("+ (ranking_list[i].score * 100).toFixed(1)+"%)</span>";
			$(percentage_str).appendTo($td_left);
			
			
			if(isDisplayFull){
				let $list_content_left_bt = $('<div>').addClass('list-content_left_bt').appendTo($td_left);
				$('<a>').text("Copy").append("<i class=\"material-icons\">content_copy</i>").appendTo($list_content_left_bt);
				$('<a>').text("Like").append("<i class=\"material-icons\">favorite_border</i>").appendTo($list_content_left_bt);
			}else{
				let $list_content_left_bt = $('<div>').addClass('list-content_left_bt').addClass('summary').appendTo($td_left);
				$('<a>').append("<i class=\"material-icons\">content_copy</i>").appendTo($list_content_left_bt);
				$('<a>').append("<i class=\"material-icons\">favorite_border</i>").appendTo($list_content_left_bt);
			}
			
			//right
			if(ranking_list[i].id in detail_data ){
				_contruct_detail(ranking_list[i].id, ranking_list[i].matched_hpo_id, detail_data[ranking_list[i].id], lang, target, display_format, $td_right);
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

	function _search_case_report_data_and_show_result(setting){

		let uncached_list = _find_unloaded_case_report_count_data_ids(setting,LANGUAGE_EN);

		// check if  needs to be load from interent	
		if(!_isEmpty(uncached_list)){

			// search detail data from internet and draw result
			let id_lst = uncached_list.join(",");
			
			let url_str = _contruct_url(URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID, {[SETTING_KEY_ID_LST]:id_lst, [SETTING_KEY_LANG]:LANGUAGE_EN});

			_run_ajax(url_str,'GET', 'text', true, function(data){
	
				if(!_isEmpty(data)){
					var json_data = _parseJson(data);
					_set_case_report_count_data_to_cache(json_data,LANGUAGE_EN);
				}
				
				let uncached_list1 = _find_unloaded_case_report_count_data_ids(setting,LANGUAGE_JA);
				if(!_isEmpty(uncached_list1)){
					let id_lst1 = uncached_list1.join(",");
					let url_str1 = _contruct_url(URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID, {[SETTING_KEY_ID_LST]:id_lst1, [SETTING_KEY_LANG]:LANGUAGE_JA});
					_run_ajax(url_str1,'GET', 'text', true, function(data1){
						if(!_isEmpty(data1)){
							var json_data1 = _parseJson(data1);
							_set_case_report_count_data_to_cache(json_data1,LANGUAGE_JA);
						}
						_show_result(setting);
						pcf_hide_loading();
					});
				} else {
					_show_result(setting);
					pcf_hide_loading();
				}
			});
		} else {

			let uncached_list1 = _find_unloaded_case_report_count_data_ids(setting,LANGUAGE_JA);
			if(!_isEmpty(uncached_list1)){
				let id_lst1 = uncached_list1.join(",");
				let url_str1 = _contruct_url(URL_GET_COUNT_CASE_REPORT_BY_MONDO_ID, {[SETTING_KEY_ID_LST]:id_lst1, [SETTING_KEY_LANG]:LANGUAGE_JA});
				_run_ajax(url_str1,'GET', 'text', true, function(data1){
					if(!_isEmpty(data1)){
						var json_data1 = _parseJson(data1);
						_set_case_report_count_data_to_cache(json_data1,LANGUAGE_JA);
					}
					_show_result(setting);
					pcf_hide_loading();
				});
			} else {
				_show_result(setting);
				pcf_hide_loading();
			}
		}
		
	}


	function _search_phenotype_data_and_show_result(setting){

		let uncached_list = _find_unloaded_hpo_ids(setting);
		let isDisplayFull = (setting[SETTING_KEY_DISPLAY_FORMAT] === DISPLAY_FORMAT_FULL);
		let target        = setting[SETTING_KEY_TARGET];
		
		// check if  needs to be load from interent	
		if(!_isEmpty(uncached_list)){
			// search detail data from internet and draw result
			setting[SETTING_KEY_ID_LST] = uncached_list.join(",");
			let url_str = _contruct_url(URL_GET_HPO_DATA_BY_HPO_ID, setting);
			_run_ajax(url_str,'GET', 'text', true, function(data){
				if(!_isEmpty(data)){
					var json_data = _parseJson(data);
					_set_phenotype_name_data_to_cache(json_data);
				}
				if(isDisplayFull && (target === TARGET_OMIM || target === TARGET_ORPHANET)){ 
					_search_case_report_data_and_show_result(setting);
					
				}else{
					_show_result(setting);
					pcf_hide_loading();
				}
			});
		} else {
			if(isDisplayFull && (target === TARGET_OMIM || target === TARGET_ORPHANET)){
				_search_case_report_data_and_show_result(setting);
			}else{
				_show_result(setting);
				pcf_hide_loading();
			}	
		}
	}
	
	function _search_detail_data_and_show_result(setting){

		pcf_show_loading();

		let target = setting[SETTING_KEY_TARGET];
		
		if(_is_target_status_init(target) || _is_target_status_data_loaded(target)) return;

		let uncached_list = _find_unloaded_detail_data_ids(setting);

		// check if  needs to be load from interent	
		if(!_isEmpty(uncached_list)){

			// search detail data from internet and draw result
			setting[SETTING_KEY_ID_LST] = uncached_list.join(",");
		
			let url_str = _contruct_url(URL_GET_DATA_BY_ID, setting);
			_run_ajax(url_str,'GET', 'text', true, function(data){
				
				if(!_isEmpty(data)){
					var json_data = _parseJson(data);
					if(!_isEmpty(json_data)){
						_set_detail_data_to_cache(json_data,target);
					}
				}
				_search_phenotype_data_and_show_result(setting);
			});
		} else {
			_search_phenotype_data_and_show_result(setting);
		}
	}

	function _run_pcf_filter_logical(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,target,setting){
		let ranking_id_list = {};
		ranking_data_without_filter.forEach(function(item){
			ranking_id_list[item.id] = 1;
		});

		Object.keys(items_total_hash).sort().forEach(function(i_str){
			let logical_type   = items_total_hash[i_str].logical_type;
			let filter_id_list = result_ranking_id_hash[i_str];

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
				ranking_data_new.push(item);
			}
		});
		
		_set_ranking_data_into_cache(ranking_data_new,setting);
		_set_target_status_ranking_data_loaded(target);
		_search_detail_data_and_show_result(setting);
	}


	function _run_pcf_filter_load_data(setting, ranking_data_without_filter){

		let target = setting[SETTING_KEY_TARGET];
		
		if(_isEmpty(setting[SETTING_KEY_FILTER])){
			// no filter, go to next step directly
			_set_target_status_ranking_data_loaded(target);
			_search_detail_data_and_show_result(setting);
			return;
		}

		let filter_list = setting[SETTING_KEY_FILTER].split(',');

		// parameters for ajax calls
		var items_ajax_list = [];
		var items_total_hash = {};
		var result_ranking_id_hash = {};
		
		// analyze filter one by one
		for(let i=0; i<filter_list.length; i++){

			let str_filter_id = filter_list[i];
			let id            = _get_id_from_filter_id(str_filter_id);
			let filter_type   = _get_filter_type_by_filter_id(str_filter_id);
			let logical_type  = _get_logical_by_filter_id(str_filter_id, i);
			let url_str       = FILTER_URL_HASH[target][filter_type];

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
				let url_str_full = _contruct_url(url_str,{[SETTING_KEY_ID_LST]:id});
				items_ajax_list.push({
					'index'        : i,
					'str_filter_id': str_filter_id,
					'id'           : id,
					'filter_type'  : filter_type,
					'logical_type' : logical_type,
					'url_str_full' : url_str_full
				});
			}else{
				// no need to get data through ajax
				if(target === TARGET_GENE && filter_type === FILTER_TYPE_ENT){

					let gene_id = id.replace(/ENT/,"GENEID");
					
					result_ranking_id_hash[i] = {};
		
					ranking_data_without_filter.forEach(function(data_item){
						if(logical_type === LOGICAL_AND_NOT){
							if(data_item.id !== gene_id) result_ranking_id_hash[i][data_item.id]=1;
						}else{
							if(data_item.id === gene_id) result_ranking_id_hash[i][data_item.id]=1;
						}
					});
				}else{

					result_ranking_id_hash[i] = {};
					if(logical_type === LOGICAL_AND_NOT){	
						ranking_data_without_filter.forEach(function(data_item){
							result_ranking_id_hash[i][data_item.id]=1;
						});
					}
				}
			}
		}
		
		if(items_ajax_list.length === 0){
			if(Object.keys(result_ranking_id_hash).length >0){
				// no need to do ajax
				// do logical ,create ranking list, and continue
				_run_pcf_filter_logical(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,target,setting);
				return;
			}else{
				_set_ranking_data_into_cache([],setting);
				_set_target_status_ranking_data_loaded(target);
				pcf_hide_loading();
				return;
			}
		}

		if(items_ajax_list.length === 1){
			
			_run_ajax(items_ajax_list[0].url_str_full,'GET', 'text', true, function(data){

				let json_data = _parseJson(data);
				let hash = {};
				if(!_isEmpty(json_data)){
					for(jid in json_data){
						if(!_isEmpty(json_data[jid])){
							json_data[jid].forEach(function(target_data_id){
								hash[target_data_id] = 1;
							});
						}
					}
				}

				let idx = "" +items_ajax_list[0].index;
				let isLogicalNot = (items_ajax_list[0].logical_type === LOGICAL_AND_NOT);
				result_ranking_id_hash[idx] = {};
				ranking_data_without_filter.forEach(function(data_item){
					if(isLogicalNot){
						if(!(data_item.id in hash))	result_ranking_id_hash[idx][data_item.id]=1;
					}else{
						if(data_item.id in hash) result_ranking_id_hash[idx][data_item.id]=1;
					}
				});
				
				// do logical ,create ranking list, and continue
				_run_pcf_filter_logical(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,target,setting);
				return;
			});
			
			return;
		}

		// function to trigger the ajax call
		var ajax_request = function(item) {

			var deferred = $.Deferred();

			$.ajax({
				url: item.url_str_full,
				dataType: "text",
				type: 'GET',
				success: function(data) {
					// do something here
					//console.log(data.results[0]);
					
					let json_data = _parseJson(data);
					let hash = {};
					if(!_isEmpty(json_data)){
						for(jid in json_data){
							if(!_isEmpty(json_data[jid])){
								json_data[jid].forEach(function(target_data_id){
									hash[target_data_id] = 1;
								});
							}
						}
					}
	
					result_ranking_id_hash[item.index] = {}
					let isLogicalNot = (item.logical_type === LOGICAL_AND_NOT);
					ranking_data_without_filter.forEach(function(data_item){
						if(isLogicalNot){
							if(!(data_item.id in hash))	result_ranking_id_hash[item.index][data_item.id]=1;
						}else{
							if(data_item.id in hash)	result_ranking_id_hash[item.index][data_item.id]=1;
						}
					});
					
					// mark the ajax call as completed
					deferred.resolve(data);
				},
				error: function(error) {
					// mark the ajax call as failed
					deferred.reject(error);
				}
			});

			return deferred.promise();
		};

		var looper = $.Deferred().resolve();

		// go through each item and call the ajax function
		$.when.apply($, $.map(items_ajax_list, function(item, i) {
			looper = looper.then(function() {
			// trigger ajax call with item data
				return ajax_request(item);
			});
			return looper;
		})).then(function() {
			// run this after all ajax calls have completed
			// do logical ,create ranking list, and continue
			_run_pcf_filter_logical(ranking_data_without_filter,items_total_hash,result_ranking_id_hash,target,setting);
			return;
			//console.log('Done!');
		}).fail(function() {
			//console.log( 'I fire if one or more requests failed.' );
			alert("Failed loading filtering data["+setting[SETTING_KEY_FILTER]+"]");
			pcf_hide_loading();
			return;
		});
	}

	function _run_pcf_search(setting){

		pcf_show_loading();
	
		let target = setting[SETTING_KEY_TARGET];

		if(_is_target_status_init(target)){
			
			let ranking_data = _get_ranking_data_from_cache(setting)
			if(!_isEmpty(ranking_data)){
				_set_target_status_ranking_data_loaded(target);
				_search_detail_data_and_show_result(setting);
				return false;
			}
			
			//do searching ranking(without filter)
			let setting_without_filter = $.extend(true,{}, setting,{[SETTING_KEY_FILTER]:''});

			let ranking_data_without_filter = _get_ranking_data_from_cache(setting_without_filter);

			if(_isEmpty(ranking_data_without_filter)){
				let url_str = _contruct_url(URL_GET_RANKING_BY_HPO_ID,setting_without_filter);
				_run_ajax(url_str,'GET', 'text', true, function(data){
					var json_data_without_filter = _parseJson(data);
					if(!_isEmpty(json_data_without_filter)){
						// the ranking data without filtered
						_set_ranking_data_into_cache(json_data_without_filter,setting_without_filter);
						//_run_pcf_filter(setting);
						_run_pcf_filter_load_data(setting, json_data_without_filter);
						return false;
					}else{
						// no data found by hpo lists,no need to proceed do filtering.
						_set_ranking_data_into_cache([],setting_without_filter);
						_set_target_status_ranking_data_loaded(target);
						pcf_hide_loading();
						return false;
					}
				});
			}else{
				//_run_pcf_filter(setting);
				_run_pcf_filter_load_data(setting, ranking_data_without_filter);
				return false;
			}
		} else {
			_search_detail_data_and_show_result(setting);
		}
		
		return false;
	}

	function _run_ajax(url_str,http_type,response_dataType,async,callback,callback_fail){
		$.ajax({	
			url:      url_str,  // 通信先のURL
			type:     http_type,// 使用するHTTPメソッド(get/post)
			async:    async,    // 使用するHTTPメソッド(true/false)
			dataType: response_dataType,
		}).done(function(data1,textStatus,jqXHR) {
			if(_isFunction(callback))callback(data1);
		}).fail(function(jqXHR, textStatus, errorThrown ) {
			alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
			if(_isFunction(callback_fail)) callback_fail();
			pcf_hide_loading();
		});
	}


	function _load_filter_objects(filter_id_list, filter_object_list, phenotype_object_list, callback){

		if(filter_id_list === 0){
			if(_isFunction(callback)){
				callback(phenotype_object_list, filter_object_list);
			}
			return
		}

		let tmp = filter_id_list.split(',');

		let str_filter_id = tmp[0];

		let lang = LANGUAGE_EN;

		if(str_filter_id.match(/_ja$/i))lang = LANGUAGE_JA;

		let id           = _get_id_from_filter_id(str_filter_id);
		let filter_type  = _get_filter_type_by_filter_id(str_filter_id);

		if(!_isEmpty(filter_type)){
			
			let logical_str  = _get_logical_str_by_filter_id(str_filter_id);
			let url_str      = FILTER_NAME_URL_HASH[filter_type];
			let url_str_full = _contruct_url(url_str,{[SETTING_KEY_ID_LST]:id});
			
			_run_ajax(url_str_full,'GET', 'text', true, function(data){
				if(!_isEmpty(data)){
					json_data = _parseJson(data);
					let name = _get_filter_name(filter_type,lang,json_data,id);
					if(!_isEmpty(name)){
						let obj = {'id':str_filter_id,'name':name,'logicaloperator':logical_str};
						filter_object_list.push(obj);
					}
				}
				
				if(tmp.length === 1){
					if(_isFunction(callback)){
						callback(phenotype_object_list, filter_object_list);
					}
				}else{
					tmp.shift();
					_load_filter_objects(tmp.join(','), filter_object_list, phenotype_object_list, callback);
				}
				return false;
			});
		}else{
			alert('indicated filter ['+str_filter_id+'] is malformed');
		}
		
		return false;

		
	}
	
	var methods = {
		init: function(options) {
			
			let setting = $.extend(true,{}, DEFAULT_SETTINGS);

			if(_isExistVal(URL_PARA_PHENOTYPE, options)) setting[SETTING_KEY_PHENOTYPE]      = options[URL_PARA_PHENOTYPE];
			if(_isExistVal(URL_PARA_FILTER   , options)) setting[SETTING_KEY_FILTER]         = options[URL_PARA_FILTER];
			if(_isExistVal(URL_PARA_FORMAT   , options)) setting[SETTING_KEY_DISPLAY_FORMAT] = options[URL_PARA_FORMAT];
			if(_isExistVal(URL_PARA_LANG     , options)) setting[SETTING_KEY_LANG]           = options[URL_PARA_LANG];
			if(_isExistVal(URL_PARA_SIZE     , options) &&options[URL_PARA_SIZE] > 0) setting[SETTING_KEY_SIZE] = options[URL_PARA_SIZE];
			if(_isExistVal(SETTING_KEY_ONSELECTTAB,options)) setting[SETTING_KEY_ONSELECTTAB]= options[SETTING_KEY_ONSELECTTAB];
			
			
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
			if(_isExistVal(URL_PARA_PHENOTYPE, options)) setting[SETTING_KEY_PHENOTYPE] = options[URL_PARA_PHENOTYPE];
			if(_isExistVal(URL_PARA_FILTER   , options)) setting[SETTING_KEY_FILTER]    = options[URL_PARA_FILTER];
			_clear_all_and_update_setting(setting);
			let current_target = _get_active_target();
			_selectTab(current_target);
		},
		update_filter: function(filter_str){
			let new_setting = {[SETTING_KEY_FILTER]: filter_str};
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
		load_phenotype_and_filter_objects_by_ids(hpo_id_list,filter_id_list,callback){
			
			let phenotype_id_list = hpo_id_list.replace(/_ja/gi, '');
			
			let phenotype_url_str = _contruct_url(URL_GET_HPO_DATA_BY_HPO_ID, {[SETTING_KEY_ID_LST]:phenotype_id_list});
			
			let phenotype_object_list = [];
			
			let filter_object_list = [];
			
			_run_ajax(phenotype_url_str,'GET', 'text', true, function(data){

				if(!_isEmpty(data)){
					
					json_data = _parseJson(data);
					
					hpo_id_list.split(',').forEach(function(str_hpo_id){
						if(str_hpo_id.match(/_ja$/i)){
							hpo_id =str_hpo_id.replace(/_ja$/i,"");
							if(hpo_id in json_data){
								let obj = {'id'   : str_hpo_id, 'name' : json_data[hpo_id].name_ja}
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
				}else{
					return false;
				}
				
				if(filter_id_list.length === 0){
					if(_isFunction(callback)){
						callback(phenotype_object_list, filter_object_list);
					}
					return false;
				}
				
				_load_filter_objects(filter_id_list, filter_object_list, phenotype_object_list, callback);
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
