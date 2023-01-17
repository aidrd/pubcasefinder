;(function ($) {

	const URL_GET_ALL_PANEL_ID           = '/pcf_get_all_mondo_id',
		  URL_GET_PANEL_ID_BY_PANEL      = '/pcf_panel_get_mondo_id_match_panel_name_synonym',
		  URL_GET_PANEL_ID_BY_GENE       = 'https://pubcasefinder.dbcls.jp/api/pcf_panel_get_mondo_id_match_gene_symbol_synonym_ncbiid',
		  URL_GET_PANEL_DATA_BY_PANEL_ID = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_panel_data_by_mondo_id',
		  URL_GET_HPO_DATA_BY_PANEL_ID   = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_mondo_id',
		  URL_GET_GENE_DATA_BY_PANEL_ID  = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_gene_by_mondo_id',
		  //URL_GET_GENE_DATA_BY_PANEL_ID  = 'https://pubcasefinder.dbcls.jp/pcf_get_case_report_by_mondo_id',
		  URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_tooltip_data_by_hpo_id',
		  URL_DOWNLOAD_ALL_PANEL         = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_download_all_panel',
		  URL_DOWNLOAD_PANEL             = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_download_panel_by_mondo_id';

	const SETTINGS_KEY        = 'VGPSettings',
		  OBJECT_KEY          = 'VGPObject',
		  LANGUAGE_EN         = 'en',
		  LANGUAGE_JA         = 'ja',
		  SETTINGS_KEY_LANG   = 'language',
		  SETTINGS_KEY_SIZE   = 'vgp-size',
		  SETTINGS_KEY_TARGET = 'vgp-target',
		  SETTINGS_KEY_FILTER = 'vgp-filter',
		  SETTINGS_KEY_SIZE_M = 'vgp-size-limit',
		  SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST = 'after_search_idlist',
		  CLASS_STATUS_INIT   = 'vgp-status-init',
		  CLASS_STATUS_LOADED = 'vgp-status-loaded',
		  CLASS_PANEL_ROW     = 'vgp-panel-row',
		  CLASS_PAGENUM_ROW   = 'vgp-pagenum-row',
		  ID_LOADER           = 'vgp-loader',
		  ID_LOADER_TEXT      = 'vgp-loader-text',
		  ID_CONTENT          = 'vgp-content',
		  ID_CONTENT_TITLE    = 'vgp-content-title',
		  ID_CONTENT_LIST     = 'vgp-content-list',
		  ID_CONTENT_EMPTY    = 'vgp-content-empty',
		  SIZE_ALL = -1,
		  TARGET_ALL   = 'all',
		  TARGET_PANEL = 'panel',
		  TARGET_GENE  = 'gene'
		  ;

	const URL_HASH_SEARCH = {
		[TARGET_ALL]:   URL_GET_ALL_PANEL_ID,
		[TARGET_PANEL]: URL_GET_PANEL_ID_BY_PANEL,
		[TARGET_GENE]:  URL_GET_PANEL_ID_BY_GENE
	};
	

	var DEFAULT_SETTINGS = {
		[SETTINGS_KEY_SIZE]:   50, // panel data per page
		[SETTINGS_KEY_SIZE_M]: 50, // maximum panel data 
		[SETTINGS_KEY_TARGET]: TARGET_ALL, // TARGET_ALL or TARGET_PANEL or TARGET_GENE
		[SETTINGS_KEY_FILTER]: '', // filter string
		[SETTINGS_KEY_LANG]:   LANGUAGE_EN
		
	};
	
	var _isFunction = function(value) {	return $.isFunction(value);	},
	_isArray = function(value) {return $.isArray(value);},
	_isEmpty = function(value, allowEmptyString) {
		return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (_isArray(value) && value.length === 0);
	},
	_isDefined = function(value) {return typeof value !== 'undefined';},
	_parseJson= function(text) {
		var json_data = null;
		try {
			json_data = JSON.parse(text);
		} catch (d) {}
		return json_data;
	},
	_capitalizeFirstLetter = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	_removeDuplicates = function (arr){
		var unique = [];
		arr.forEach(element => {
			if (!unique.includes(element)) {
				unique.push(element);
			}
		});
		return unique;
	};
		
	var methods = {
		
		init: function(options) {
			let settings = $.extend(true,{}, DEFAULT_SETTINGS, options || {});
			return this.each(function () {
				$(this).data(SETTINGS_KEY, settings);
				$(this).data(OBJECT_KEY, new $.VisualGenePanelList(this));
			});
		},
		search_panels: function(options){
			let old_settings = this.data(SETTINGS_KEY);
			let settings = $.extend(true,{}, old_settings, options || {});
			$(this).data(SETTINGS_KEY, settings);
			this.data(OBJECT_KEY).search_panels();
			return this;
		},
		download_all_panels: function(){
			this.data(OBJECT_KEY).download_all_panels();
			return this;
		}
	};
	
	$.fn.visual_gene_panel_list = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};
	
	$.VisualGenePanelList = function (root_panel) {
		
		var $root_panel = $(root_panel);
		
		//var current_settings = $root_panel.data(SETTINGS_KEY);
		
		var search_idlist_cache = {
			[TARGET_ALL]:   null,
			[TARGET_PANEL]: {},
			[TARGET_GENE]:  {}
		};
		
		function _is_idlist_loaded(target,filter) {
			if(_isEmpty(filter)){
				return(!_isEmpty(search_idlist_cache[TARGET_ALL]));
			}else if(target === TARGET_ALL){
				return((filter in search_idlist_cache[TARGET_PANEL]) && (filter in search_idlist_cache[TARGET_GENE]));
			}else{
				return(filter in search_idlist_cache[target]);
			}
		};
		
		function _get_idlist_from_cache(target,filter){
			if(_isEmpty(filter)){
				
				return search_idlist_cache[TARGET_ALL];
				
			}else if(target === TARGET_ALL){
				
				let ret = [];
				
				if(filter in search_idlist_cache[TARGET_PANEL]){
					ret = ret.concat(search_idlist_cache[TARGET_PANEL][filter]);
				}
				
				if(filter in search_idlist_cache[TARGET_GENE]){
					ret = ret.concat(search_idlist_cache[TARGET_GENE][filter]);
				}
				
				return _removeDuplicates(ret);

			}else{
				if(filter in search_idlist_cache[target]){
					return search_idlist_cache[target][filter];
				}else{
					return null;
				}
			}
		}
		function _store_idlist_to_cache(target,filter,idlist){
			if(_isEmpty(filter)){
				search_idlist_cache[TARGET_ALL] = idlist;
			}else{
				search_idlist_cache[target][filter] = idlist;
			}
		}
		

		var panel_cache = {};
		function _get_panel_data_from_cache(panel_id){
			let ret=null;
			if(panel_id in panel_cache){
				ret = panel_cache[panel_id];
			}
			return ret;
		}
		function _store_panel_data_to_cache(json_data){
			$.extend(panel_cache, json_data);
		}
		function _get_uncached_panel_list(selected_idlist){
			let ret=[];
			for(let i=0;i<selected_idlist.length; i++){
				if(!(selected_idlist[i] in panel_cache)){
					ret.push(selected_idlist[i]);
				}
			}
			return ret;
		}
		
		
		//
		// construct UI
		//
		// UI:loader
		var $div_loader = $('<div>').attr('id', ID_LOADER).appendTo($root_panel);
		var $div_loader_wrapper = $('<div>').addClass("d-flex flex-row vgp-loader-content").appendTo($div_loader);
		$('<span>').addClass("vgp-loader-gif").appendTo($div_loader_wrapper);
		$('<span>').addClass("vgp-loader-text").appendTo($div_loader_wrapper);
		function _show_loader(){
			if($('#'+ ID_LOADER).is(":visible") === false)	$('#'+ID_LOADER).show();
		};
		function _hide_loader(){
			if($('#'+ID_LOADER).is(":visible")) $("#"+ID_LOADER).hide();
		};

		// UI: content wrapper
		var $div_content = $('<div>').attr('id', ID_CONTENT).addClass('').appendTo($root_panel);
		function _show_content(){
			if($('#'+ ID_CONTENT).is(":visible") === false) $('#'+ID_CONTENT).show();
		};
		function _hide_content(){
			if($('#'+ID_CONTENT).is(":visible")) $("#"+ID_CONTENT).hide();
		};
		function _init_content(){
			$div_content_list.empty();
			$div_content_list.removeClass(CLASS_STATUS_LOADED).removeClass(CLASS_STATUS_INIT).addClass(CLASS_STATUS_INIT);
			_show_content_empty();
		}
		function _set_content_loaded(){
			$div_content_list.removeClass(CLASS_STATUS_LOADED).addClass(CLASS_STATUS_LOADED);
		}
		function _set_content_unloaded(){
			$div_content_list.removeClass(CLASS_STATUS_LOADED);
		}
		function _is_content_init(){
			return $div_content_list.hasClass(CLASS_STATUS_INIT);
		}
		function _is_content_loaded(){
			return $div_content_list.hasClass(CLASS_STATUS_LOADED);
		}

		
		// UI: content title 
		var $div_content_title = $('<div>').attr('id',ID_CONTENT_TITLE).addClass('row').appendTo($div_content);
		$('<div>').addClass('col row align-items-center vgp-col-panel').text('Panel').appendTo($div_content_title);
		$('<div>').addClass('vgp-col-download vgp-col-download-title').text('Download').appendTo($div_content_title);
		
		// UI: content data panel 
		var $div_content_list = $('<div>').attr('id',ID_CONTENT_LIST).appendTo($div_content);
		
		$('<div>').attr('id',ID_CONTENT_EMPTY).text('No panels found!').appendTo($div_content);
		function _show_content_empty(){
			if($('#'+ ID_CONTENT_EMPTY).is(":visible") === false) $('#'+ID_CONTENT_EMPTY).show();
		};
		function _hide_content_empty(){
			if($('#'+ID_CONTENT_EMPTY).is(":visible")) $("#"+ID_CONTENT_EMPTY).hide();
		};
		
		function _show_result(settings){

			if(_is_content_loaded()) return;
			
			let num_per_page = settings[SETTINGS_KEY_SIZE];
			let num_maximum  = settings[SETTINGS_KEY_SIZE_M];
			let language     = settings[SETTINGS_KEY_LANG];
			
			let idlist = _get_idlist_from_cache(settings[SETTINGS_KEY_TARGET], settings[SETTINGS_KEY_FILTER]);
			let total_num = idlist.length;
			let total_num_str = total_num.toLocaleString("en-US");
			
			if(num_per_page === SIZE_ALL){
				num_maximum = total_num;
			}else{
				num_maximum = Math.min(total_num, num_maximum);
			}
			
			let loaded_num  = $div_content_list.find("." + CLASS_PANEL_ROW).length;
			let isFirstLoad = true;
			if(loaded_num > 0){
				 isFirstLoad = false;
			}

			var $last_row = null;
			if(!isFirstLoad){
				let rows = $div_content_list.find("." + CLASS_PANEL_ROW);
				$last_row = $(rows[rows.length-1]);
				
				if(num_per_page !== SIZE_ALL && loaded_num >= num_per_page){
					let $page_row = $('<div>').addClass(CLASS_PAGENUM_ROW).insertAfter($last_row);
					
					let page_num = parseInt(loaded_num/num_per_page, 10);
					
					$("<div>").text("Page " + page_num).appendTo($page_row);

					$last_row = $page_row;
				}
			}

			let i=loaded_num;
			for(; i<num_maximum; i++){
				let panel_id = idlist[i];
				let panel_data = _get_panel_data_from_cache(panel_id);
				if(_isEmpty(panel_data)) {
					console.log('info: ' + panel_id + ' not found!');
					continue;
				}
				let $tr = $('<div>').addClass(CLASS_PANEL_ROW);
				if($last_row === null){
					//when initialize tab panel
					$tr.appendTo($div_content_list);				
				}else{
					$tr.insertAfter($last_row);
				}
				$last_row = $tr;

				// create row
				let $div_upper = $('<div>').addClass('d-flex flex-row flex-nowrap').appendTo($tr);
				
				let $vgp_panel = $('<div>').addClass('flex-grow-1 vgp-col-panel').appendTo($div_upper);
				
				let $div_vgp_name_wrapper = $('<div>').addClass('d-flex flex-row vgp-name-wrapper').appendTo($vgp_panel);

				let vgp_name = _capitalizeFirstLetter(panel_data.name_en);
				//if(settings[SETTINGS_KEY_LANG] === LANGUAGE_JA && 'name_ja' in panel_data){
				//	vgp_name = panel_data.name_ja;
				//}

				$('<div>').addClass('vgp-name').text(vgp_name).appendTo($div_vgp_name_wrapper);
				
				if('synonym' in panel_data && !_isEmpty(panel_data.synonym)){
					/*
					let $btn = $('<button>').addClass('vgp-synonym').text('Also known as').appendTo($div_vgp_name_wrapper);
					$btn.popover({
						trigger: 'focus',
						content: panel_data.synonym,
					}).click(function(){
						
					});
					*/
					let button = document.createElement('button');
					button.textContent = 'Also known as';
					button.classList.add("list-tag-vgp-synonym");
				
					tippy(button, {
						// default
						allowHTML:     	true,
						appendTo:      	document.body,
						content: 		panel_data.synonym,
						placement: 		'right',
						theme:        	'pcf-popup',
						trigger: 		'click',
						interactive:	true,
					});
					$(button).appendTo($div_vgp_name_wrapper);
				}
			
				if(settings[SETTINGS_KEY_LANG] === LANGUAGE_JA && 'name_ja' in panel_data){
                	vgp_name = panel_data.name_ja;
					let $div_vgp_name_wrapper2 = $('<div>').addClass('vgp-name-wrapper').appendTo($vgp_panel);
					$('<div>').addClass('vgp-name').text(vgp_name).appendTo($div_vgp_name_wrapper2);
                }	
				if('definition' in panel_data && !_isEmpty(panel_data.definition)){
					let $div_vgp_def = $('<div>').addClass('vgp-def-wrapper').appendTo($vgp_panel);
					let $p = $('<p>').text(panel_data.definition).appendTo($div_vgp_def);
					let href_str = encodeURIComponent(panel_data.definition);
					href_str = "https://translate.google.co.jp/?sl=en&tl=ja&text=" + href_str + "&op=translate&hl=ja";
					$("<a>").text(" >> Translate(Google)").attr( 'href', href_str).attr('target', '_blank').appendTo($p);
				}
				
				
				let $vgp_download = $('<div>').addClass('vgp-col-download').appendTo($div_upper);
				let $btn = $('<button>').addClass('vgp-download-btn')
										.data('panel_id', panel_id)
										.click(function(){
											let id = $(this).data('panel_id');
											_download_panel(id);
										})
										.appendTo($vgp_download);
				let $span = $('<span>').addClass('material-icons').text('save_alt')
						.attr({
							'data-toggle':    'tooltip',
							'data-placement': 'top',
							'title':          'Download this panel'
						})
						.appendTo($btn);
				$span.tooltip();
				
				let $div_lower = $('<div>').addClass('list-show_wrapper').appendTo($tr);
				
				let mondo_id  = panel_data.mondo_id;
				let mondo_url = panel_data.mondo_url;
				let omim_id   = 'omim_id' in panel_data ? 'OMIM:'+panel_data.omim_id : '';
				let omim_url  = 'omim_url' in panel_data ? panel_data.omim_url : '';
				let orpha_id  = 'orpha_id'  in panel_data ? 'Orphanet:' + panel_data.orpha_id : '';
				let orpha_url = 'orpha_url' in panel_data ? panel_data.orpha_url : '';
				let icd_id    = 'icd10_id'  in panel_data ? panel_data.icd10_id.replace(/ICD10/g,'ICD-10') : '';
				let icd_url   = 'icd10_url' in panel_data ? panel_data.icd10_url : '';
				let count_phenotype = 'count_hpo_id' in panel_data ? panel_data.count_hpo_id : '';
				count_phenotype = _isEmpty(count_phenotype) ? 0 : parseInt(count_phenotype);
				let count_gene = 'count_gene_id' in panel_data ? panel_data.count_gene_id : '';
				count_gene = _isEmpty(count_gene) ? 0 : parseInt(count_gene);
				let url_phenotype   = URL_GET_HPO_DATA_BY_PANEL_ID + '?mondo_id='+mondo_id.replace(/MONDO:/,'');
				let url_gene        = URL_GET_GENE_DATA_BY_PANEL_ID + '?mondo_id='+mondo_id.replace(/MONDO:/,'')+'&lang='+language;
				let url_hpo_tooltip = URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID + '?hpo_id=';
				
				$div_lower.vgp_collapse_panel({
					url_phenotype   : url_phenotype,
					url_gene        : url_gene,
					url_hpo_tooltip : url_hpo_tooltip,
					mondo_id        : mondo_id,
					mondo_url       : mondo_url,
					omim_id         : omim_id,
					omim_url        : omim_url,
					orpha_id        : orpha_id,
					orpha_url       : orpha_url,
					icd_id          : icd_id,
					icd_url         : icd_url,
					count_phenotype : count_phenotype,
					count_gene      : count_gene,
					language        : language
				});
				
			}

			// create show more row 
			if(isFirstLoad) {
				if(num_per_page !== SIZE_ALL){
					// create show more row
					let $bottom_panel = $('<div>').addClass("list-footer").appendTo($div_content_list);
					$('<div>').addClass("list-results").text(total_num_str + " results").appendTo($bottom_panel);
					let button_str = "<button id=\"show_more_button\"><span><i class=\"material-icons\">add</i></span><p>Show More</p></button>";
					$(button_str)
					.click(function(){
						var settings = $root_panel.data(SETTINGS_KEY);
						let num_per_page = settings[SETTINGS_KEY_SIZE];
						let num_maximum  = settings[SETTINGS_KEY_SIZE_M];
						num_maximum  += num_per_page;
						settings = $.extend(true,{}, settings, {[SETTINGS_KEY_SIZE_M]:num_maximum});
						$root_panel.data(SETTINGS_KEY,settings);
						_set_content_unloaded();
						_search_panel_data(settings);
					})
					.appendTo($bottom_panel);
				}
				
				if(i > 0){
					_hide_content_empty();
				}
			}

			if(i >= total_num){
				$("#show_more_button").hide();
			} 	

			_set_content_loaded();
		}
		
		function _search_panel_data(settings){
			_hide_content();
			_show_loader();

			let idlist = _get_idlist_from_cache(settings[SETTINGS_KEY_TARGET], settings[SETTINGS_KEY_FILTER]);
			
			// find uncached ids
			let selected_idlist;
			if(settings[SETTINGS_KEY_SIZE] === SIZE_ALL){
				selected_idlist = idlist;
			}else{
				selected_idlist = [];
				for(let i=0; i<idlist.length && i<settings[SETTINGS_KEY_SIZE_M]; i++){
					selected_idlist.push(idlist[i]);
				}
			}
			
			let uncached_idlist = _get_uncached_panel_list(selected_idlist);
			if(_isEmpty(uncached_idlist)){
				_hide_loader();
				_show_content();
				_show_result(settings);
				return;
			}
			
			let url_str = URL_GET_PANEL_DATA_BY_PANEL_ID + '?mondo_id=' + encodeURIComponent(uncached_idlist.join(',').replace(/MONDO:/g, ''));
			_run_ajax(url_str,'GET', null, 'text', true, 
				function(data){
					let obj = _parseJson(data);
					let hash = {};
					for(let j=0;j<obj.length; j++){
						let panel_id = obj[j].mondo_id;
						hash[panel_id] = obj[j];
					}
					_store_panel_data_to_cache(hash);
					_hide_loader();
					_show_content();
					_show_result(settings);
					return;
				},
				function(){
					_hide_loader();
					_show_content();
					return;
				}
			);
		}
		
		function _search_idlist_sequential(settings){
		
			let ajax_item_list = [];
			[TARGET_GENE,TARGET_PANEL].forEach(function(target,idx){
				let url = URL_HASH_SEARCH[target] + '?query=' + settings[SETTINGS_KEY_FILTER];
				ajax_item_list.push({
					[SETTING_KEY_URLSTR]:  url,
					[SETTINGS_KEY_TARGET]: target,
					[SETTINGS_KEY_FILTER]: settings[SETTINGS_KEY_FILTER]
				})
			});
			
			var callback_success = function(data,item){
				let json_data = _parseJson(data);
				let target = item[SETTINGS_KEY_TARGET];
				let filter = item[SETTINGS_KEY_FILTER];
				_store_idlist_to_cache(target, filter, json_data);
			};

			var callback_fail = function() {
				alert('Server access error!');
			};

			var callback_after_all_call = function(){
				_search_panel_data(settings);
				
				let idlist = _get_idlist_from_cache(settings[SETTINGS_KEY_TARGET], settings[SETTINGS_KEY_FILTER]);

				let num = idlist.length;

				if(_isFunction(settings[SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST])){
					settings[SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST](num);
				}
				
			};
			
			var callback_fail_after_all_call = function(){
				_hide_loader();
				_show_content();
			};

			_run_ajax_sequential(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call);
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
			}).fail(function() {
				if(_isFunction(callback_fail_after_all_call)) callback_fail_after_all_call();
				return;
			});
		}

		
		function _search_idlist(settings){
			
			_hide_content();
			_show_loader();
			
			// search id
			let is_loaded = _is_idlist_loaded(settings[SETTINGS_KEY_TARGET], settings[SETTINGS_KEY_FILTER]);
			// search panel data
			if(is_loaded){
				_search_panel_data(settings);
				let idlist = _get_idlist_from_cache(settings[SETTINGS_KEY_TARGET], settings[SETTINGS_KEY_FILTER]);
				if(_isFunction(settings[SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST])){
					settings[SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST](idlist.length);
				}
				return;
			}

			if(_isEmpty(settings[SETTINGS_KEY_FILTER])){
				let url_str = URL_HASH_SEARCH[TARGET_ALL];
				_run_ajax(url_str,'GET', null, 'text', true, 
					function(data){
						let json_data = _parseJson(data);
						let num = json_data.length;
						_store_idlist_to_cache(settings[SETTINGS_KEY_TARGET], settings[SETTINGS_KEY_FILTER], json_data);
						if(_isFunction(settings[SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST])){
							settings[SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST](num);
						}
						_search_panel_data(settings);
						return;
					},
					function(){
						_hide_loader();
						_show_content();
						return;
					}
				);
			}else if(settings[SETTINGS_KEY_TARGET] === TARGET_ALL){
				_search_idlist_sequential(settings);
				return;
			}else{
				let url_str = URL_HASH_SEARCH[settings[SETTINGS_KEY_TARGET]] + '?query=' + settings[SETTINGS_KEY_FILTER];
				_run_ajax(url_str,'GET', null, 'text', true, 
					function(data){
						let json_data = _parseJson(data);
						let num = json_data.length;
						_store_idlist_to_cache(settings[SETTINGS_KEY_TARGET], settings[SETTINGS_KEY_FILTER], json_data);
						if(_isFunction(settings[SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST])){
							settings[SETTINGS_KEY_FUNC_AFTER_SEARCH_IDLIST](num);
						}
						_search_panel_data(settings);
						return;
					},
					function(){
						_hide_loader();
						_show_content();
						return;
					}
				);
			}
		}
		

		function _run_ajax(url_str,http_type,post_data,response_dataType,async,callback,callback_fail){

			if(http_type==="GET"){
				$.ajax({	
					url:      url_str,  // 通信先のURL
					type:     http_type,// 使用するHTTPメソッド(get/post)
					async:    async,    // 使用するHTTPメソッド(true/false)
					dataType: response_dataType
					//timeout:  3000,
				}).done(function(data1,textStatus,jqXHR) {
					if(_isFunction(callback))callback(data1);
				}).fail(function(jqXHR, textStatus, errorThrown ) {
					//alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
					if(_isFunction(callback_fail)) callback_fail();
					alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
				});
			}else{
				$.ajax({
					url:      url_str,  // 通信先のURL
					type:     http_type,// 使用するHTTPメソッド(get/post)
					async:    async,    // 使用するHTTPメソッド(true/false)
					data:     post_data,
					proccessData: false, 
					dataType: response_dataType
				}).done(function(data1,textStatus,jqXHR) {
					if(_isFunction(callback))callback(data1);
				}).fail(function(jqXHR, textStatus, errorThrown ) {
					//alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
					if(_isFunction(callback_fail)) callback_fail();
					alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
				});
			}
		}

		function _download_all_panels(){

			_hide_content();
			_show_loader();
			
			// do search idlist
			let url_str = URL_DOWNLOAD_ALL_PANEL;
			_run_ajax(url_str,'GET', null, 'text', true, 
				function(data){
					_hide_loader();
					_show_content();
					_create_download_file(data, 'panel-all.txt');
					return;
				},
				function(){
					_hide_loader();
					_show_content();
					return;
				}
			);
		}

		function _download_panel(panel_id){

			let  window_y_offset = window.pageYOffset;
			_hide_content();
			_show_loader();
			
			// do search idlist
			let url_str = URL_DOWNLOAD_PANEL + "?mondo_id=" + panel_id.replace(/MONDO:/,'');
			_run_ajax(url_str,'GET', null, 'text', true, 
				function(data){
					_hide_loader();
					_show_content();
					document.documentElement.scrollTop = document.body.scrollTop = window_y_offset;
					_create_download_file(data, 'panel-'+panel_id.replace(/MONDO:/,'')+'.txt');
					return;
				},
				function(){
					_hide_loader();
					_show_content();
					document.documentElement.scrollTop = document.body.scrollTop = window_y_offset;
					return;
				}
			);
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
				$a.remove();
			}
		}

		this.download_all_panels = function(){
			_download_all_panels();
		};

		this.search_panels = function(){
			_init_content();
			var current_settings = $root_panel.data(SETTINGS_KEY);
			_search_idlist(current_settings);
		};
	};


}(jQuery));
