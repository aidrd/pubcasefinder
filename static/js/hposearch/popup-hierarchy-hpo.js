;(function ($) {

	var CSS_PREFIX = 'popup-hierarchy-hpo-';

	const LANGUAGE_EN='en',LANGUAGE_JA='ja',
		  SCHEMA_2022='schema_2022',SCHEMA_2016='schema_2016';
	
	var DEFAULT_SETTINGS = {
		// Search settings
		method: "GET",
		queryParam: "q",
		searchDelay: 300,
		jsonContainer: null,
		contentType: "json",

		nodeName: 'div',

		defaultTokenId : 'HP:0000118',
		disabledTokenIds : ['HP:0000118'],

		cssInlineContentClass:     CSS_PREFIX+'inline-content',
		cssInlineContentBaseClass: CSS_PREFIX+'inline-content-base',

		cssTokenInputContentBaseClass: CSS_PREFIX+'tokeninput-content-base',
		cssClassContentBaseClass:      CSS_PREFIX+'class-content-base',
		cssWebGLContentBaseClass:      CSS_PREFIX+'webgl-content-base',

		cssTableClass: CSS_PREFIX+'table',
		cssTrClass:    CSS_PREFIX+'tr',
		cssTdClass:    CSS_PREFIX+'td',

		cssBaseClass:        CSS_PREFIX+'base',
		cssTopBarClass:      CSS_PREFIX+'top-bar',
		cssBottomBarClass:   CSS_PREFIX+'bottom-bar',
		cssContentClass:     CSS_PREFIX+'content',
		cssLinkBaseRowClass: CSS_PREFIX+'link-base-row',
		cssLinkBaseClass:    CSS_PREFIX+'link-base',
		cssLinkClass:        CSS_PREFIX+'link',
		cssLinkNumberClass:  CSS_PREFIX+'link-number',
		cssLinkFocusClass:   CSS_PREFIX+'link-focus',
		cssTokenClass:       CSS_PREFIX+'token',
		cssTokenListClass:   CSS_PREFIX+'token-list',

		cssSelfContentClass:  CSS_PREFIX+'self-content',
		cssOtherContentClass: CSS_PREFIX+'other-content',
		cssCloseButtonClass:  CSS_PREFIX+'close-button',

		cssCheckboxGroupClass: CSS_PREFIX+'checkbox-group',
		cssProgressClass:      CSS_PREFIX+'progress',

		cssSelectedPhenotypeClass: CSS_PREFIX+'selectedphenotype',

		cssButtonDisabledClass: CSS_PREFIX+'button-disabled',
		cssButtonAddClass:      CSS_PREFIX+'button-add',
		cssButtonReplaceClass:  CSS_PREFIX+'button-replace',
		cssButtonCopyClass:     CSS_PREFIX+'button-copy',
		cssSeparatorClass:      CSS_PREFIX+'separator',


		cssButtonBaseClass:     CSS_PREFIX+'buttons-base',
		cssButtonsClass:        CSS_PREFIX+'buttons',
		cssContentTableClass:   CSS_PREFIX+'content-table',
		cssContentTrClass:      CSS_PREFIX+'content-tr',
		cssContentThClass:      CSS_PREFIX+'content-th',
		cssContentTdClass:      CSS_PREFIX+'content-td',
		cssContentTdColonClass: CSS_PREFIX+'content-td-colon',
		cssContentCopyClass:    CSS_PREFIX+'content-copy',

		cssWebGLContentClass: CSS_PREFIX+'webgl-content',

		cssFMATreeListContentClass: CSS_PREFIX+'fmatreelist-content',

		cssFMAListContentClass:       CSS_PREFIX+'fmalist-content',
		cssFMAListContentSelectClass: CSS_PREFIX+'fmalist-content-select',
		cssFMAListContentHoverClass:  CSS_PREFIX+'fmalist-content-hover',
		cssHPOListContentClass:       CSS_PREFIX+'hpolist-content',

		cssWebGLSwitchContentClass: CSS_PREFIX+'webgl-switch-content',
		cssLanguageChangeClass:     CSS_PREFIX+'language-change',
		cssWebGLHomeContentClass:   CSS_PREFIX+'webgl-home-content',

		cssResultsTooltipClass:      CSS_PREFIX+'results-tooltip',
		cssResultsTooltipTitleClass: CSS_PREFIX+'results-tooltip-title',

		cssNumberOfHitsClass: CSS_PREFIX+'number-of-hits',

		cssLoadingClass: CSS_PREFIX+'loading',
		
		loadingText: 'Loading...',

		titleSuperclass: 'superclass',
		titleSubclass:   'subclass',
		titleSelfclass:  'selfclass',

		keySuperclass: 'superclass',
		keySubclass:   'subclass',
		keySelfclass:  'selfclass',

		schema: SCHEMA_2016,
		[SCHEMA_2022]:	{
			cssBaseClass:          CSS_PREFIX+'base'           + '-' + SCHEMA_2022,
			cssTopBarClass:        CSS_PREFIX+'top-bar'        + '-' + SCHEMA_2022,
			cssContentClass:       CSS_PREFIX+'content'        + '-' + SCHEMA_2022,
			cssContentRowClass:    CSS_PREFIX+'content-row'    + '-' + SCHEMA_2022,
			cssButtonsClass:       CSS_PREFIX+'buttons'        + '-' + SCHEMA_2022,
			cssButtonBaseClass:    CSS_PREFIX+'buttons-base'   + '-' + SCHEMA_2022,
			cssSelectionBaseClass: CSS_PREFIX+'selection-base' + '-' + SCHEMA_2022,
			cssLanguageChangeClass:CSS_PREFIX+'language-change'+ '-' + SCHEMA_2022,
			cssNumberBaseClass:    CSS_PREFIX+'number-base'    + '-' + SCHEMA_2022,
			cssNumberClass:        CSS_PREFIX+'number'         + '-' + SCHEMA_2022,
			cssLinkBaseClass:      CSS_PREFIX+'link-base'      + '-' + SCHEMA_2022,
			cssLinkClass:          CSS_PREFIX+'link'
		},
		
		language_in: LANGUAGE_EN,
		language : {
			'ja' : {
				superclass : '上位概念',
				subclass : '下位概念',
				selectedphenotype: '患者の徴候および症状',
				replace : '置換',
				add : '追加',
				copy : 'コピー',
				jpn : 'JPN',
				eng : 'ENG',
				revert : '元に戻す',
				ok : 'OK',
				cancel : 'Cancel',
				clear : 'Clear',
				close : 'Close',

				is_observed : '症状の有無',
				is_observed_hash : { yes: 'あり', no: 'なし'},
				severity : '重要性',
				severity_hash : {0:'通常', 1:'高い', 2:'低い'},
				id : 'HPO ID',
				name : '症状(日)',
				english : '症状(英)',
				definition : '症状定義',
				comment : 'コメント',
				synonym : '同義語',

				phenotouch : 'PhenoTouch',
				webgltitle : '身体各部位を選択',
				webgloperationhelp : '選択：クリック<br>移動：ドラッグ<br>回転：Shift + ドラッグ<br>拡大縮小：スクロール',
				fmatreelisttitle : '選択部位の名称',
				fmalisttitle : 'Select proper parts you inducated.',
				hpolisttitle : '「__FMANAME__（__FMAID__）」に関連した兆候・症状',

				bone : 'Bone',
				muscle : 'Muscle',
				vessel : 'Vessel',
				internal : 'Internal',
				other : 'Other',

				fmaid : 'FMA ID',
				fmaname : 'Name',
				'#ofphenotypes' : '# of phenotypes',
				color : 'Color',
				hide : 'Hide',
				hpoid : 'ID',
				hponame : 'Name',

				tooltip_title : 'ここをクリック',
				tooltip_copy : '<div style="white-space:nowrap;text-align:center;">クリップボードに<br>HPO Id、症状（日）、症状（英）<br>をコピーします</div>',
				number_of_hits : 'ヒット件数 [__NUMBER__]&nbsp;&nbsp;',
				similar_candidate : 'もしかして:'
			},
			'en' : {
				superclass : 'Superclass',
				subclass : 'Subclass',
				selectedphenotype: 'patient\’s signs and symptoms',
				replace : 'Replace',
				add : 'Add',
				copy : 'Copy',
				jpn : 'JPN',
				eng : 'ENG',
				revert : 'revert',
				ok : 'OK',
				cancel : 'Cancel',
				clear : 'Clear',
				close : 'Close',

				is_observed : 'Exclude',
				is_observed_hash : { yes: 'No', no: 'Yes'},
				severity : 'Clinical relevance',
				severity_hash : {0:'Normal', 1:'Distinctive finding', 2:'Minor finding'},
				id : 'HPO ID',
				name : 'Name',
				english : 'English',
				definition : 'Definition',
				comment : 'Comment',
				synonym : 'Synonym',

				phenotouch : 'PhenoTouch',
				webgltitle : 'Touch body parts',
				webgloperationhelp : 'Select: Click<br>Move: Drag<br>Rotate: Shift + Drag<br>Zoom: Scroll',
				fmatreelisttitle : 'Touched body parts',
				fmalisttitle : 'Select proper parts you inducated.',
				hpolisttitle : 'Signs and symptoms related to __FMANAME__ (__FMAID__)',

				bone : 'Bone',
				muscle : 'Muscle',
				vessel : 'Vessel',
				internal : 'Internal',
				other : 'Other',

				fmaid : 'FMA ID',
				fmaname : 'Name',
				'#ofphenotypes' : '# of phenotypes',
				color : 'Color',
				hide : 'Hide',
				hpoid : 'ID',
				hponame : 'Name',

				tooltip_title : 'Click Here',
				tooltip_copy : 'Copy HPO Id and Name to the clipboard',
				number_of_hits : 'Number of hits [__NUMBER__]&nbsp;&nbsp;',
				similar_candidate : 'Did you mean:'
			}
		},
		okcancelButtonsAlign : 'right',
		clearButtonAlign : 'left',

		inputNodeName: 'textarea',
		inputId : 'popup-hierarchy-hpo',
		use_segments: ['bone','internal','muscle'],
		id_regexp : new RegExp("^(HP:[0-9]+)(.*)"),
		obj_ext : '.obj',
		obj_url : '/phenotouch/objs/',
		use_webgl : false,
		active_webgl : false,
		use_tooltip : false,
		tooltip_type : 'fixed',	//fixed or name
		fmatree_type : 'class',	//class or part
		copy_items: ['id','name','English'],
		copy_delimiter: ',',
		use_annotation_score : true,
		annotation_score_url : 'https://api.monarchinitiative.org/api/sim/score',
		
		modify_modal_on_show: null,
		after_modal_close: null,
		is_hierarchy_fullscreen: true,
		prependTo: null
	};

	const TOKENINPUT_SETTINGS_KEY = 'settings';
	const TOKENINPUT_ITEM_SETTINGS_KEY = 'tokeninput';

	var SKIN = {
		FMAID : 'FMA7163',
		OPACITY : 0.2,
		DEFAULT_OPACITY : 0.1
	};

	var KEY_PREFIX = 'popupRelationHPO',SETTINGS_KEY = KEY_PREFIX+'Settings',OBJECT_KEY = KEY_PREFIX+'Object';

	var isObject	= function(value) { return $.isPlainObject(value); },
		isArray		= function(value) { return $.isArray(value); },
		isFunction	= function(value) {	return $.isFunction(value);	},
		isNumeric	= function(value) { return $.isNumeric(value);	},
		isString	= function(value) { return typeof value === 'string';},
		isBoolean	= function(value) { return typeof value === 'boolean';	},
		isEmpty		= function(value, allowEmptyString) {return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (isArray(value) && value.length === 0);	},
		isDefined	= function(value) { return typeof value !== 'undefined';},
		hasJA		= function( str ) { return ( str && str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/) )? true : false;	};

	var methods = {
		init: function(url_or_data_or_function, options) {
			var settings = $.extend(true,{}, DEFAULT_SETTINGS, options || {});
			return this.each(function () {
				$(this).data(SETTINGS_KEY, settings);
				$(this).data(OBJECT_KEY, new $.PopupRelationHPO(this, url_or_data_or_function, settings));
			});
		},
        setTagSize: function(uisetting_tag_size){
            this.data(OBJECT_KEY).setTagSize(uisetting_tag_size);
            return this;
        },
		triggerChangeState: function(){
            this.data(OBJECT_KEY).triggerChangeState();
            return this;
        }
	};

	$.fn.popupRelationHPO = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};

	$.PopupRelationHPO = function (input, url_or_data_or_function, settings) {

		var cache = new $.TokenList.Cache();
		var tokeninput_settings = $.extend(true,{},$(input).data(TOKENINPUT_SETTINGS_KEY) || {});

		this.setTagSize = function(uisetting_tag_size){
			tokeninput_settings.uisetting_tag_size = uisetting_tag_size;
		};

		if(tokeninput_settings.prePopulate) delete tokeninput_settings.prePopulate;
//		console.log(tokeninput_settings);

		var tokeninput_classes = tokeninput_settings.classes;

		var current_settings = $(input).data(SETTINGS_KEY);

		var mfp_popup = null;
		if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && current_settings.prependTo){
/*
			let $webgl_trigger  = $('<div>').addClass("popup-hierarchy-hpo-webgl-trigger-content")
										.click(function(e){
											$('.selected_at_popup').removeClass('selected_at_popup');
											$('.token-input-selected-token-facebook').removeClass('token-input-selected-token-facebook');
											setTimeout(function(){
												closeMagnificPopup_mfp_popup();
												setTimeout(function(){ $.PopupRelationHPOWithWebGL(); },51);
                                            },51);
											e.preventDefault();
											e.stopPropagation();
											return false;
										});

			mfp_popup = new $.PopupRelationHPO.Mfp_Popup(current_settings.prependTo, $webgl_trigger);
*/
			mfp_popup = new $.PopupRelationHPO.Mfp_Popup(current_settings.prependTo);
		}

		this.triggerChangeState = function(){
			if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup && mfp_popup.is_mfp_popup_shown()){
				setTimeout(function(){
					changeStateAddOrReplace();
				},50);
			}
		};

		
		var __isFirstThreeBitsRenderer = true;
		var __webglResizeTimeoutID = null;

		function computeURL() {
			return isFunction(current_settings.url) ? settings.url.call(current_settings) : current_settings.url;
		}

		function getOriginalTokenInputItemNodes(){
			return $('ul.'+tokeninput_classes['tokenList'].split(/\s+/).join('.')).not('.'+current_settings.cssTokenListClass).children('li.'+tokeninput_classes['token']).not('.'+current_settings.cssTokenClass).toArray();
		}

		function getOriginalTokenInputItems(){
			return $.map($(input).tokenInput('get'), function(data){
				return $.extend(true, {},data);
			});
		}

		function getHighlightedOriginalTokenInputItem(){
			let original_token_node_list = getOriginalTokenInputItemNodes();
			let idx = original_token_node_list.findIndex(token_node => {
				return $(token_node).hasClass('selected_at_popup');
			});
			if(idx < 0) return null;
			let original_token_item_list = getOriginalTokenInputItems();
			return original_token_item_list[idx];
		}

		function updateHighlightedOriginalTokenInputItem(obj){
			let $selectedToken = $('li.selected_at_popup');
			let selectedToken  = $selectedToken.data(TOKENINPUT_ITEM_SETTINGS_KEY);
			let changedToken   = $.extend(true, {},selectedToken,obj);
			$selectedToken.data(TOKENINPUT_ITEM_SETTINGS_KEY, changedToken);

			let original_token_node_list = getOriginalTokenInputItemNodes();
			let idx = original_token_node_list.findIndex(token_node => {
				return $(token_node).hasClass('selected_at_popup');
			});
			$(input).tokenInput('update_saved_token', idx, obj);
		}

		function getOriginalTokenInputItem_by_id(hpo_id){
			let original_token_item_list = getOriginalTokenInputItems();
			let idx = original_token_item_list.findIndex(token_item => {
				return token_item.id.replace('_ja','') === hpo_id.replace('_ja','');
			});
			if(idx < 0) return null;
			return original_token_item_list[idx];
		}

		function updateOriginalTokenInputItem_by_id(hpo_id,obj){
			let original_token_node_list = getOriginalTokenInputItemNodes();
			let original_token_item_list = getOriginalTokenInputItems();
			original_token_item_list.forEach(function(token_item,idx){
				if(token_item.id.replace('_ja','') === hpo_id.replace('_ja','')){
					let $selectedToken = $(original_token_node_list[idx]);
					let selectedToken  = $selectedToken.data(TOKENINPUT_ITEM_SETTINGS_KEY);
					let changedToken   = $.extend(true, {},selectedToken,obj);
					$selectedToken.data(TOKENINPUT_ITEM_SETTINGS_KEY, changedToken);

					$(input).tokenInput('update_saved_token', idx, obj);
				}
			});
		}

		function removeOriginalTokenInputItems(){
			return $(input).tokenInput('clear');
		}
		
		function addOriginalTokenInputItem(){
			var tokenInputItems = getTokenInputItems();
			if(isArray(tokenInputItems)){
				removeOriginalTokenInputItems();
				$.each(tokenInputItems,function(){
					var temp = $.extend(true, {},this);
					if(isObject(temp) && isString(temp.id) && current_settings.id_regexp.test(temp.id)){
						temp.id = RegExp.$1;
					}
					if(hasJA(temp.name)) temp.id += '_ja';
					$(input).tokenInput('add',temp);
				});
				$.PopupRelationHPOTokenTooltip();
			}
		}
		
		function getOriginalTokenInputItemFromName(hpo_name){
			var tokenInputItems = getOriginalTokenInputItems();
			var target_arr = [];
			if($.isArray(tokenInputItems)){
				target_arr = $.grep(tokenInputItems,function(data){return data.name===hpo_name;});
			}
			return target_arr.length>0 ? target_arr[0] : null;
		}

		function getTokenInputItemNodes(){
			var tmp = 'ul.'+tokeninput_classes['tokenList'].split(/\s+/).join('.')+'.'+current_settings.cssTokenListClass+'>li.'+tokeninput_classes['token']+'.'+current_settings.cssTokenClass;
			if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
					return getOriginalTokenInputItemNodes();
			}
			return $(tmp).toArray();
		}

		function getTokenInputItems(){
			return $.map(getTokenInputItemNodes(),function(data){ return $(data).data(TOKENINPUT_ITEM_SETTINGS_KEY); });
		}

		function getTokenInputElement(){
			return $(current_settings.inputNodeName+'#'+current_settings.inputId);
		}

		function _addTokenInputItem(token,selectedToken){
			if(!isBoolean(selectedToken)) selectedToken = false;
			var $li = $(current_settings.nodeName+'.'+current_settings.cssSelectedPhenotypeClass+ ' ul.'+tokeninput_classes['tokenList'].split(/\s+/).join('.')+'.'+current_settings.cssTokenListClass+'>li.'+tokeninput_classes['token']).not('.'+current_settings.cssTokenClass).addClass(current_settings.cssTokenClass);
			if(isObject(selectedToken) && selectedToken.id && selectedToken.id===token.id){
				$li.addClass(tokeninput_classes['selectedToken']);
			}else if(isBoolean(selectedToken) && selectedToken){
				clearSelectedTokenInputItems();
				$li.addClass(tokeninput_classes['selectedToken']);
			}
			return $li;
		}

		function addTokenInputItem(token,selectedToken){
			var name = token.name;
			getTokenInputElement().tokenInput('add',token);
			return _addTokenInputItem(token,selectedToken);
		}
		
		function removeTokenInputItems(){
			return getTokenInputElement().tokenInput('clear');
		}
		
		function getSelectedTokenInputItems(){
			let nodes = getTokenInputItemNodes();
			if(current_settings.use_webgl || current_settings.is_hierarchy_fullscreen){
				return $(nodes).filter('.'+tokeninput_classes['selectedToken']).toArray();
			}else{
				return $(nodes).filter('.selected_at_popup').toArray();
			}
		}
		
		function clearSelectedTokenInputItems(){
			return $(getSelectedTokenInputItems()).removeClass(tokeninput_classes['selectedToken']);
		}

		function existsTokenInputItemFromID(hpo_id){
			var tokenInputItems = getTokenInputItems();
			var target_arr = [];
			if($.isArray(tokenInputItems)){
				target_arr = $.grep(tokenInputItems,function(data){return data.id===hpo_id;});
			}
			return target_arr.length!==0;
		}

		function getTokenInputItemFromName(hpo_name){
			var tokenInputItems = getTokenInputItems();
			var target_arr = [];
			if($.isArray(tokenInputItems)){
				target_arr = $.grep(tokenInputItems,function(data){return data.name===hpo_name;});
			}
			return target_arr.length>0 ? target_arr[0] : null;
		}

		var click_timeoutID = null;
		function createOtherContent(values, options) {

			options = options || {};
			
			var hidden = options.hidden ? true : false;

			var $otherContentBase = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).addClass(current_settings.cssOtherContentClass);

			if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){					
				if(!hidden && $.isArray(values) && values.length){
					
					var $base = $('<'+current_settings.nodeName+'>').addClass(current_settings[SCHEMA_2022].cssBaseClass).addClass(current_settings.cssOtherContentClass)
																	.click(function(e){e.stopPropagation();e.preventDefault();return false;})
																	.appendTo($otherContentBase);
					if(isString(options.classname)) $base.addClass(options.classname);
					
					if(isString(options['title']) && options['title'].length){
						var $title = $('<'+current_settings.nodeName+'>').addClass(current_settings[SCHEMA_2022].cssTopBarClass).text(options['title']).appendTo($base);
						if(isString(options.classname)) $title.addClass(options.classname);
					}

					var $content = $('<table>').addClass(current_settings[SCHEMA_2022].cssContentClass).appendTo($base);
					$.each(values.sort(function(a,b){
						var a_name = a.name;
						var b_name = b.name;
						if(runSearchOptions.hasJA && isString(a.name_ja)) a_name = a.name_ja;
						if(runSearchOptions.hasJA && isString(b.name_ja)) b_name = b.name_ja;
						return a_name<b_name?-1:(a_name>b_name?1:0);
					}), function(){

						var $link_base = $('<tr>').addClass(current_settings[SCHEMA_2022].cssContentRowClass).appendTo($content);					
						$link_base.addClass(options.classname);	

						var text = this.name;
						if(runSearchOptions.hasJA && isString(this.name_ja)) text = this.name_ja;
						
						var $number_html;
						if(isNumeric(this.count)){
							if(options.formatNumber){
								$number_html = $('<span>').addClass(current_settings[SCHEMA_2022].cssNumberClass).text(this.count);
							}
							else{
								text += ' ('+this.count+')';
							}
						}

						var data = {
							'target' : $.extend(true, {},tokeninput_target),
							'self' : $.extend(true, {},this)
						};

						//subclass
						if(isString(options.classname) && options.classname === CSS_PREFIX+current_settings.keySubclass){
							addExecuteButtons(data, existsTokenInputItemFromID(this.id), false).appendTo($link_base);
							if($number_html) $number_html.appendTo($('<td>').addClass(current_settings[SCHEMA_2022].cssNumberBaseClass).appendTo($link_base));
						}

						var $a_base = $('<td>').addClass(current_settings[SCHEMA_2022].cssLinkBaseClass).appendTo($link_base);

						var $a = $('<a>').addClass(current_settings[SCHEMA_2022].cssLinkClass)
										.attr({'href':'#'})
										.data(OBJECT_KEY, this)
										.click(function(){
											var data = $(this).data(OBJECT_KEY);
											if(click_timeoutID){
												clearTimeout(click_timeoutID);
											}
											click_timeoutID = setTimeout(function(){
												click_timeoutID = null;
												runSearch(data.id);
											},100);
											return false;
										})
										.appendTo($a_base);

						$('<span>').text(text).appendTo($a);

						//superclass
						if(isString(options.classname) && options.classname === CSS_PREFIX+current_settings.keySuperclass){
							if($number_html) $number_html.appendTo($('<td>').addClass(current_settings[SCHEMA_2022].cssNumberBaseClass).appendTo($link_base));
							addExecuteButtons(data, existsTokenInputItemFromID(this.id), false).appendTo($link_base);
						}
					});
				}				
				return $otherContentBase;
			}
			
			if(!hidden && $.isArray(values) && values.length){
				var $base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssBaseClass).addClass(current_settings.cssOtherContentClass)
																.click(function(e){e.stopPropagation();e.preventDefault();return false;})
																.appendTo($otherContentBase);
				if(isString(options.classname)) $base.addClass(options.classname);
				if(isString(options['title']) && options['title'].length){
					var $title = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTopBarClass).text(options['title']).appendTo($base);
				}
				var $content = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentClass).appendTo($base);

				$content.css({'display':'table','width':'100%','border-spacing':'0 5px'});

				var add_css = {
					'display':'table-cell',
					'vertical-align':'top',
					'width':'53px'
				};
				$.each(values.sort(function(a,b){
					var a_name = a.name;
					var b_name = b.name;
					if(runSearchOptions.hasJA && isString(a.name_ja)) a_name = a.name_ja;
					if(runSearchOptions.hasJA && isString(b.name_ja)) b_name = b.name_ja;
					return a_name<b_name?-1:(a_name>b_name?1:0);
				}), function(){
					var text = this.name;
					var $number_html;
					if(runSearchOptions.hasJA && isString(this.name_ja)) text = this.name_ja;

					if(isNumeric(this.count)){
						if(options.formatNumber){
							$number_html = $('<span>').addClass(current_settings.cssLinkNumberClass).text(this.count);
						}
						else{
							text += ' ('+this.count+')';
						}
					}

					var data = {
						'target' : $.extend(true, {},tokeninput_target),
						'self' : $.extend(true, {},this)
					};

					var $link_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssLinkBaseClass).css({'display':'table-row'}).appendTo($content);

					//subclass
					if(isString(options.classname) && options.classname === CSS_PREFIX+current_settings.keySubclass){
						addExecuteButtons(data, existsTokenInputItemFromID(this.id), false).appendTo($link_base).css(add_css);
						if($number_html) $number_html.appendTo($('<'+current_settings.nodeName+'>').css({'display':'table-cell','vertical-align':'top','text-align':'right','width':'1px'}).appendTo($link_base));
					}

					var $a_base = $('<'+current_settings.nodeName+'>').css({'display':'table-cell'}).appendTo($link_base);

					var $a = $('<a>')
					.addClass(current_settings.cssLinkClass)
					.attr({'href':'#'})
					.data(OBJECT_KEY, this)
					.click(function(){
						var data = $(this).data(OBJECT_KEY);

						if(false){
							if(isString(options.classname) && options.classname === CSS_PREFIX+settings.keySubclass){
								$(current_settings.nodeName+'.'+current_settings.cssTableClass).css({'animation':'popup-hierarchy-hpo-keyframe-subclass-translate 500ms ease-out 0s normal both'});
							}
							else if(isString(options.classname) && options.classname === CSS_PREFIX+current_settings.keySuperclass){
								$(current_settings.nodeName+'.'+current_settings.cssTableClass).css({'animation':'popup-hierarchy-hpo-keyframe-superclass-translate 500ms ease-out 0s normal both'});
							}
							setTimeout(function(){
								runSearch(data.id);
							},500);
						}else{
							if(click_timeoutID){
								clearTimeout(click_timeoutID);
							}
							click_timeoutID = setTimeout(function(){
								click_timeoutID = null;
								runSearch(data.id);
							},100);
						}
						return false;
					})
					.appendTo($a_base);

					$('<span>').text(text).appendTo($a);

					//superclass
					if(isString(options.classname) && options.classname === CSS_PREFIX+current_settings.keySuperclass){
						if($number_html) $number_html.appendTo($('<'+current_settings.nodeName+'>').css({'display':'table-cell','vertical-align':'top','text-align':'right','width':'1px'}).appendTo($link_base));
						addExecuteButtons(data, existsTokenInputItemFromID(this.id), false).appendTo($link_base).css(add_css);
					}

				});
			}
			return $otherContentBase;
		}

		function changeStateAddOrReplace(){
			var $selectedToken = $(getSelectedTokenInputItems());
			var tokenInputItems = getTokenInputItems();
			var tokenInputItemsHash = {};
			if(isArray(tokenInputItems)){
				$.each(tokenInputItems, function(){
					var tokenInputItem = this;
					var id = tokenInputItem.id;
					if(isObject(tokenInputItem) && isString(tokenInputItem.id) && current_settings.id_regexp.test(tokenInputItem.id)){
						id = RegExp.$1;
					}
					tokenInputItemsHash[id] = tokenInputItem;
				});
			}

			var $buttonAdd = $('button.'+current_settings.cssButtonAddClass);
			$buttonAdd.each(function(){
				var $button = $(this);
				var data = $button.data(OBJECT_KEY);
				var exists_data = $.grep(current_settings.disabledTokenIds, function(id){
					return id===data.self.id;
				}).length > 0 ? true : false;
				if(isObject(tokenInputItemsHash[data.self.id]) || exists_data ){
					$button.addClass(current_settings.cssButtonDisabledClass);
				}
				else{
					$button.removeClass(current_settings.cssButtonDisabledClass);
				}
			});

			var $buttonReplace = $('button.'+current_settings.cssButtonReplaceClass);

			if($selectedToken && $selectedToken.length > 0){
				$buttonReplace.removeClass(current_settings.cssButtonDisabledClass);

				$buttonReplace.each(function(){
					var $button = $(this);
					var data = $button.data(OBJECT_KEY);
					if(isEmpty(data)) return;
					var exists_data = $.grep(current_settings.disabledTokenIds, function(id){
						return id===data.self.id;
					}).length > 0 ? true : false;
					if(isObject(tokenInputItemsHash[data.self.id]) || exists_data) $button.addClass(current_settings.cssButtonDisabledClass);
				});
			}
			else{
				$buttonReplace.addClass(current_settings.cssButtonDisabledClass);
			}
		}

		function executionAddOrReplace(e){
			var $button = $(this);
			e.preventDefault();
			e.stopPropagation();
			if($button.hasClass(current_settings.cssButtonDisabledClass)) return false;

			getTokenInputElement().off('add.tokenInput');

			var params = $button.data(OBJECT_KEY) || {};

			var new_token = {id: params.self.id, name: params.self.name};
			if(runSearchOptions.hasJA && isString(params.self.name_ja)){
				new_token['id'] =  new_token['id'].replace(/_[a-z]+/,'') +  '_ja';
				new_token['name'] = params.self.name_ja;
			}
			if('is_observed' in params.self){
				new_token['is_observed'] = params.self.is_observed;
			}

			if(params.exec==='add'){
				if(current_settings.use_webgl || current_settings.is_hierarchy_fullscreen){
					addTokenInputItem(new_token);
				}else{
					/*
					let id = params.self.id;
					let name = params.self.name;
					if(runSearchOptions.hasJA && isString(params.self.name_ja)){
						id =  id.replace(/_[a-z]+/,'') +  '_ja';
						name = params.self.name_ja;
					}
					$("#tokeninput_hpo").tokenInput("add", {id: id, name: name});
					*/
					$("#tokeninput_hpo").tokenInput("add", new_token);
				}
			}
			else if(params.exec==='replace'){
				var $selectedToken = $('li.'+tokeninput_classes['selectedToken']+'.'+current_settings.cssTokenClass);
				if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
					$selectedToken = $('li.selected_at_popup');
				}
				var selectedToken = null;
				if($selectedToken && $selectedToken.length) selectedToken = $selectedToken.data(TOKENINPUT_ITEM_SETTINGS_KEY);

				var new_arr = [];
				var new_index = -1;
				if(isObject(selectedToken)){

					var arr = getTokenInputItems();
					if($.isArray(arr)){
						$.each(arr, function(index){
							if(this.id===selectedToken.id){
								new_arr.push(new_token);
								new_index = index;
							}
							else{
								new_arr.push(this);
							}
						});
					}
				}
				if(new_arr.length){
					if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
						$("#tokeninput_hpo").tokenInput("clear");
						$.each(new_arr, function(index){
							$("#tokeninput_hpo").tokenInput("add", this);
						});
						let tokenInputItemNodes = getOriginalTokenInputItemNodes();
						$(tokenInputItemNodes[new_index]).addClass(tokeninput_classes['selectedToken']).addClass('selected_at_popup');
					}else{
						tokeninput_target = $.extend(true, {},params.self);

						removeTokenInputItems();
						$.each(new_arr, function(index){
							addTokenInputItem(this,new_index === index);
						});
					}
				}
			}

			if(isObject(runSearchOptions)){
				if(isArray(runSearchOptions.tokenInputItems)) runSearchOptions.tokenInputItems = getTokenInputItems();
				if(isArray(runSearchOptions.tokenInputItemNodes)) runSearchOptions.tokenInputItemNodes = getTokenInputItemNodes();
			}

			changeStateAddOrReplace();

			if(current_settings.use_webgl || current_settings.is_hierarchy_fullscreen){
				setTimeout(function(){$button.get(0).focus();},51);
			}
			return false;
		}

		function addExecuteButtons(data,disabled, isBig){
			if(!isBoolean(disabled)) disabled = disabled ? true : false;

			var $button_base;
			if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && !isBig){
				$button_base = $('<td>').addClass(current_settings[SCHEMA_2022].cssButtonBaseClass);
			}else{
				$button_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssButtonBaseClass);
			}
			$.each(['add','replace'], function(i,val){
				var key = val;
				var $button;
				if(isBig){
					$button = $('<button>').addClass(key==='add'?'btn btn-primary':'btn')
										   .addClass(key==='add'?current_settings.cssButtonAddClass:current_settings.cssButtonReplaceClass)
										   .html(key==='add' ? '<span class="material-icons" style="font-size:20px;vertical-align:sub;">post_add</span>&nbsp;' + current_settings.language[getCurrentLanguage()][key] :
															   '<img src="/static/images/pcf/replace-green.svg" style="width:18px;height:18px;vertical-align:sub;margin-right:5px"></img>&nbsp;' + current_settings.language[getCurrentLanguage()][key])
										   .data(OBJECT_KEY,  $.extend(true, {},data,{'exec' : key.toLowerCase()})   )
										   .appendTo($button_base);
				} else {
					$button = $('<button>').data(OBJECT_KEY,  $.extend(true, {},data,{'exec' : key.toLowerCase()})   ).appendTo($button_base);
					if(key==='add'){
						if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && !isBig){
							$button.addClass('material-icons').addClass(current_settings.cssButtonAddClass).text('post_add');
						}else{
							$button.addClass('material-icons').addClass('btn btn-primary').addClass(current_settings.cssButtonAddClass).text('post_add');
						}
					}else{
						if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && !isBig){
							$button.addClass(current_settings.cssButtonReplaceClass).html('<img src="/static/images/pcf/replace-green.svg"></img>');
						}else{
							$button.addClass('btn').addClass(current_settings.cssButtonReplaceClass).html('<img src="/static/images/pcf/replace-green.svg" style="width:12px;height:12px;vertical-align:baseline;"></img>');
						}
					}
				}

				$button.on('click',executionAddOrReplace);
			});

			return $button_base;
		}

		var executionLanguage_timeoutID = null;
		function executionLanguage(){
			var $button = $(this);
			var params = $button.data(OBJECT_KEY) || {};
			runSearchOptions.hasJA = params.exec==='jpn';
			if(executionLanguage_timeoutID){
				clearTimeout(executionLanguage_timeoutID);
			}
			executionLanguage_timeoutID = setTimeout(function(){
				executionLanguage_timeoutID = null;
				showLoading();
				showResults();
			},100);
		}

		function addLanguageButtons(){
			var $button_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssButtonBaseClass);
			$.each(['jpn','eng'], function(){
				var key = this;
				var $button = $('<button>').addClass('btn btn-success').data(OBJECT_KEY,  $.extend(true, {},{'exec' : key.toLowerCase()})   ).text(current_settings.language[getCurrentLanguage()][key]).appendTo($button_base);
				$button.on('click',executionLanguage);
			});
			return $button_base;
		}

		function executionPhenoTouch(){
			var $button = $(this);
			var params = $button.data(OBJECT_KEY) || {};
			if(params.exec==='phenotouch'){
				var $inlineContent = $.magnificPopup.instance.contentContainer ? $.magnificPopup.instance.contentContainer : $();
				$inlineContent.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssClassContentBaseClass).hide();
				$inlineContent.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssWebGLContentBaseClass).show();
				$inlineContent.find(current_settings.nodeName+'.'+current_settings.cssWebGLSwitchContentClass).hide();
				$(window).resize();
				if(window.__threeBitsRenderer && !__threeBitsRenderer.isLoadingObj()){
				}
			}
			return;
		}

		function executionClear(){
			var $button = $(this);
			var params = $button.data(OBJECT_KEY) || {};
			if(params.exec==='clear'){
				removeTokenInputItems();
			}
			return;
		}

		function executionOKCancel(){
			var $button = $(this);
			var params = $button.data(OBJECT_KEY) || {};
			if(params.exec==='ok'){
					addOriginalTokenInputItem();
			}
			setTimeout(function(){
                $('li').removeClass(tokeninput_classes['selectedToken']);
                $('li').removeClass(tokeninput_classes['highlightedToken']);
                $('li').removeClass('selected_at_popup');
				if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup) {
					closeMagnificPopup_mfp_popup();
				}else{
					closeMagnificPopup();
				}
				$('div.'+tokeninput_classes['dropdown']).css({'display':'none'});
			},100);
			return;
		}

		function addPhenoTouchButtons(){
			var $button_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssButtonBaseClass);
			var language = current_settings.language[getCurrentLanguage()];
			var key = 'phenotouch';
			var $button = $('<button>').addClass('btn').addClass('btn-success').data(OBJECT_KEY,  $.extend(true, {},{'exec' : key.toLowerCase()})   ).text(language[key] ? language[key] : key).appendTo($button_base);
			$button.on('click',executionPhenoTouch);
			return $button_base;
		}

		function addClearButtons(){
			var $button_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssButtonBaseClass);
			var language = current_settings.language[getCurrentLanguage()];

				var key = 'clear';
				var $button = $('<button>').addClass('btn').addClass(key==='ok'?'btn-primary':'btn-default')
										   .data(OBJECT_KEY,  $.extend(true, {},{'exec' : key.toLowerCase()})   )
										   .text(language[key] ? language[key] : key)
										   .appendTo($button_base);

				if(current_settings.clearButtonAlign==='right'){
					$button.css({'margin-right':'20px'});
				}
				if(current_settings.clearButtonAlign==='left'){
					$button.css({'margin-left':'0px'});
				}
				$button.on('click',executionClear);
			return $button_base;
		}

		function addOKCancelButtons(){
			var $button_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssButtonBaseClass);
			var language = current_settings.language[getCurrentLanguage()];
			$.each(['ok','cancel'], function(i,val){
				var key = val;
				var $button = $('<button>').addClass('btn').addClass(key==='ok'?'btn-primary':'btn-default')
										   .data(OBJECT_KEY,  $.extend(true, {},{'exec' : key.toLowerCase()})   )
										   .text(language[key] ? language[key] : key)
										   .appendTo($button_base);
				$button.on('click',executionOKCancel);
			});
			return $button_base;
		}

		function getInlineContent(){
			var cssInlineContentElement = current_settings.nodeName+'.'+current_settings.cssInlineContentClass;
			var $inlineContent = $(cssInlineContentElement);
			if($inlineContent.length===0){
				$inlineContent = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssInlineContentClass).appendTo($(document.body));
			}
			return $inlineContent;
		}

		function emptyInlineContent(){
			var $inlineContent = getInlineContent();
			return $inlineContent.empty();
		}

		function getCurrentLanguage(){
			return runSearchOptions.hasJA ? 'ja' : 'en';
		}

		function getContentBaseElement() {
			if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup){
				return mfp_popup.get_mfp_popup_content_wrapper().find(current_settings.nodeName+'.'+current_settings.cssInlineContentBaseClass);
			}else{
				return $.magnificPopup.instance.contentContainer ? $.magnificPopup.instance.contentContainer.find(current_settings.nodeName+'.'+current_settings.cssInlineContentBaseClass) : $();
			}
		}

		function getIndicatedTokenKeyVal(hpo_id,key){
			let tokenInputItemNodes = getOriginalTokenInputItemNodes();
		}

		var pickFMAIDs = {};

		function setContentsLanguageName($node,key,value){
			var data_language_key = '__'+key+'__';
			$node.attr({'data-language-key':data_language_key});
			current_settings.language.en[data_language_key] = value['name'];
			current_settings.language.ja[data_language_key] = value['name_ja'] ? value['name_ja'] : value['name'];
		}

		function isNeedOverflewHidden(text){
			let width = Math.floor(($(window).width()-80) / 3) - 110;
			//console.log('col width: ' + width);
			
			//console.log(text);
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			//context.font = "1rem, 'IBM Plex Sans', sans-serif, 'Noto Sans JP'";
			context.font = "1rem, " + $(document.body).css('font-family');
			var dimension = context.measureText(text);
			var width_measured = Math.floor(dimension.width * 1.5);//line height
			//console.log('Measured Text Width: ' + width_measured);
			return width_measured > width * 2;
		}

		var __last_results = null;
		function showResults(results) {
			if(results){
				__last_results = $.extend(true, {},results);
			}else if(__last_results){
				results = $.extend(true, {},__last_results);
			}
			if(!results){
				emptyInlineContent();
				return;
			}

			//$('html').get(0).scrollTop=0;
			var language = current_settings.language[getCurrentLanguage()];

			if(!tokeninput_target){
				tokeninput_target_results = $.extend(true, {},results);
				if(isArray(results[current_settings.keySelfclass])){
					tokeninput_target = $.extend(true, {},results[current_settings.keySelfclass][0]);
				}
				else{
					tokeninput_target = {};
				}
			}

			var $inlineContentBase = getContentBaseElement();
			if($inlineContentBase.length===0){
				var $inlineContent;
				if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup){					
					$inlineContent = mfp_popup.get_mfp_popup_content_wrapper();
				}else{
					$inlineContent = $.magnificPopup.instance.contentContainer ? $.magnificPopup.instance.contentContainer : emptyInlineContent();
				}
				$inlineContentBase = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssInlineContentBaseClass).appendTo($inlineContent);
			}

			/////////////////////////////////////////////////////////////////////////
			// tokeninput contents
			/////////////////////////////////////////////////////////////////////////
			var $table;
			if(current_settings.is_hierarchy_fullscreen || current_settings.use_webgl){
				$table = $inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssTokenInputContentBaseClass);
				if($table.length===0){
					$table = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTableClass).addClass(current_settings.cssTokenInputContentBaseClass).appendTo($inlineContentBase);
					$table.css({
						'border-spacing': '5px',
						'margin-top':     '104px',
						'margin-left':    '0',
						'margin-right':   '0',
						'margin-bottom':  '15px'
					});
	
					var $tr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTrClass).appendTo($table);
					var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).css({'width':'8.5%'}).appendTo($tr);
					var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).css({'width':'83%'}).appendTo($tr);
	
					var $selectedphenotype_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssBaseClass).addClass(current_settings.cssSelectedPhenotypeClass).css({'width':'100%'}).appendTo($td);
	
					var $selectedphenotype_title = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTopBarClass).appendTo($selectedphenotype_base);
					$selectedphenotype_title.empty();
					var $selectedphenotype_title_table = $('<'+current_settings.nodeName+'>').css({'display':'table','border-collapse':'collapse','empty-cells':'hide','width':'100%'}).appendTo($selectedphenotype_title);
					var $selectedphenotype_title_tr = $('<'+current_settings.nodeName+'>').css({'display':'table-row'}).appendTo($selectedphenotype_title_table);
	
					var $selectedphenotype_title_td_left = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'left'}).appendTo($selectedphenotype_title_tr);
	
					var $selectedphenotype_title_td_center = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'center','width':'100%'}).appendTo($selectedphenotype_title_tr);
					$selectedphenotype_title_td_center.attr({'data-language-key':'selectedphenotype'}).text(language['selectedphenotype']);
	
					if(current_settings.is_hierarchy_fullscreen || current_settings.use_webgl){
						var $selectedphenotype_title_td_right = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'right','padding-right':'8px','position':'relative'}).appendTo($selectedphenotype_title_tr);
	
						var $language_button = $('<button>')
							.addClass(current_settings.cssLanguageChangeClass)
							.addClass('btn btn-default')
							.appendTo($selectedphenotype_title_td_right)
							.text('')
							.click(function(e){ e.preventDefault();	e.stopPropagation(); return false; });
	
						var $language_select = $('<select>')
							.attr({'name':'language'})
							.addClass(current_settings.cssLanguageChangeClass)
							.appendTo($selectedphenotype_title_td_right)
							.change(function(){
								var $select = $(this);
								var $select_option = $select.find('option:selected');
								$select.prev('button').html($select_option.text()+'&nbsp;▼');
								runSearchOptions.hasJA = $select_option.val()==='ja';
								if(executionLanguage_timeoutID){
									clearTimeout(executionLanguage_timeoutID);
								}
								executionLanguage_timeoutID = setTimeout(function(){
									executionLanguage_timeoutID = null;
									showLoading();
									showResults();
								},100);
	
							});
						var $language_option_en = $('<option>').attr({'data-language-key':'eng','name':'en'}).val('en').text(language['eng']).appendTo($language_select);
						var $language_option_jp = $('<option>').attr({'data-language-key':'jpn','name':'ja'}).val('ja').text(language['jpn']).appendTo($language_select);
					}
	
					var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).css({'width':'8.5%'}).appendTo($tr);
					if(current_settings.use_webgl){
						$('<'+current_settings.nodeName+'>')
							.addClass(current_settings.cssWebGLSwitchContentClass)
							.appendTo($td)
							.data(OBJECT_KEY, $.extend(true, {},{'exec' : 'phenotouch'}) )
							.click(executionPhenoTouch);
					}
	
					var onResult = function(results){
						getTokenInputElement().off('add.tokenInput').on('add.tokenInput', function(token){
							var $li = _addTokenInputItem(token,true);
							changeStateAddOrReplace();
							$li.trigger('click');
						});
						$.PopupRelationHPOTokenTooltip();
						return results;
					};
	
	
					var $selectedphenotype_textarea = $('<'+current_settings.inputNodeName+'>').attr({'id':current_settings.inputId}).appendTo($selectedphenotype_base);
					$selectedphenotype_textarea.tokenInput(tokeninput_settings.url, $.extend(true, {}, tokeninput_settings, {zindex: 1444,
						onResult: onResult,
						onCachedResult: onResult,
						onAdd: function(token){
							getTokenInputElement().trigger('add.tokenInput',[token]);
							getTokenInputElement().trigger('add.tokenInput2',[token]);
							$.PopupRelationHPOTokenTooltip();
						},
						onFreeTaggingAdd: function(token){
						},
						onDelete: function(token){
							if(isObject(runSearchOptions)){
								if(isArray(runSearchOptions.tokenInputItems)) runSearchOptions.tokenInputItems = $.grep(runSearchOptions.tokenInputItems || [],function(data){return token.id!==data.id;});
								if(isArray(runSearchOptions.tokenInputItemNodes)) runSearchOptions.tokenInputItemNodes = getTokenInputItemNodes();
							}
							changeStateAddOrReplace();
							getTokenInputElement().trigger('delete.tokenInput2',[token]);
	
							//tooltipのノードが残る為、強制的削除する
							if(current_settings.use_tooltip){
								var title;
								if(current_settings.tooltip_type === 'fixed'){
									title = current_settings.language[getCurrentLanguage()]['tooltip_title'];
								}
								else{
									title = token.name;
								}
								var tooltip_selector = 'ul.'+tokeninput_classes['tokenList'].split(/\s+/).join('.')+'>div.tooltip';
								$(tooltip_selector).each(function(){
									if($(this).text()===title) $(this).remove();
								});
							}
	
						},
						onReady: function(){
							var $ul = $(current_settings.nodeName+'.'+current_settings.cssSelectedPhenotypeClass+ ' ul.'+tokeninput_classes['tokenList'].split(/\s+/).join('.')).addClass(current_settings.cssTokenListClass);
							$ul.on('mousedown', function(e){
								var $li_node;
								if($(e.target).get(0).nodeName.toLowerCase()==='li'){
									$li_node = $(e.target);
								}
								else if($(e.target).get(0).nodeName.toLowerCase()==='p'){
									$li_node = $(e.target).parent('li');
								}
								else if($(e.target).get(0).nodeName.toLowerCase()==='div'){
									$li_node = $(e.target).parent('li');
								}
								else if($(e.target).get(0).nodeName.toLowerCase()==='span'){
									$li_node = $(e.target).parent('li');
								}
								if($li_node && $li_node.hasClass(current_settings.cssTokenClass)){
								}
								else{
									clearSelectedTokenInputItems();
									if(isObject(runSearchOptions)){
										if(isArray(runSearchOptions.tokenInputItems)) runSearchOptions.tokenInputItems = getTokenInputItems();
										if(isArray(runSearchOptions.tokenInputItemNodes)) runSearchOptions.tokenInputItemNodes = getTokenInputItemNodes();
									}
									changeStateAddOrReplace();
								}
							}).on('keydown', function(e){
								e.stopPropagation();
							});
						},
						onShowDropdownItem: function(count,isSimilar){
							let node = this;
							let $count_node = $('<div>').addClass(current_settings.cssNumberOfHitsClass);
							let node_content = '<b>' + current_settings.language[getCurrentLanguage()]['number_of_hits'].replace('__NUMBER__', count) + '</b>';
							if(isSimilar){
								node_content = '<b>' + current_settings.language[getCurrentLanguage()]['number_of_hits'].replace('__NUMBER__', '0') + '</b>';
								node_content = node_content + '&nbsp;&nbsp;' + '<font color=\"#f8516d\">' + current_settings.language[getCurrentLanguage()]['similar_candidate'] + '</font>';
							}
							$count_node.append(node_content);
							
							if(node.get(0).firstElementChild){
								var $firstElementChild = $(node.get(0).firstElementChild);
								$count_node.insertBefore($firstElementChild);
								if(count===0) $firstElementChild.remove();
							}
							else{
								$count_node.appendTo(node);
							}
						},
						onHideDropdownItem: function(){
							$.PopupRelationHPOResultsTooltip();
						}
					}));
	
					if(runSearchOptions.tokenInputItems && runSearchOptions.tokenInputItems.length){
						runSearchOptions.tokenInputItems.forEach(function(tokenInputItem,index){
							var selectedToken = isArray(runSearchOptions.tokenInputItemNodes) && $(runSearchOptions.tokenInputItemNodes).eq(index).hasClass(tokeninput_classes['selectedToken']) ? true : false;
							addTokenInputItem(tokenInputItem,selectedToken);
						});
					}
	
					var $selectedphenotype_bottom_bar = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssBottomBarClass).appendTo($selectedphenotype_base);
					$selectedphenotype_bottom_bar.empty();
	
					var $selectedphenotype_bottom_bar_table = $('<'+current_settings.nodeName+'>').css({'display':'table','border-collapse':'collapse','empty-cells':'hide','width':'100%'}).appendTo($selectedphenotype_bottom_bar);
					var $selectedphenotype_bottom_bar_tr = $('<'+current_settings.nodeName+'>').css({'display':'table-row'}).appendTo($selectedphenotype_bottom_bar_table);
	
					var $selectedphenotype_bottom_bar_td_left = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'left','padding-left':'4px'}).appendTo($selectedphenotype_bottom_bar_tr);
					var $selectedphenotype_bottom_bar_td_center = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'center'}).appendTo($selectedphenotype_bottom_bar_tr);
					var $selectedphenotype_bottom_bar_td_right = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'right','padding-right':'4px'}).appendTo($selectedphenotype_bottom_bar_tr);
	
	
					if(current_settings.clearButtonAlign==='left'){
						addClearButtons().appendTo($selectedphenotype_bottom_bar_td_left);
					}
					else if(current_settings.clearButtonAlign==='center'){
						addClearButtons().appendTo($selectedphenotype_bottom_bar_td_center);
					}
					else{
						addClearButtons().appendTo($selectedphenotype_bottom_bar_td_right);
					}
	
	
					if(current_settings.okcancelButtonsAlign==='left'){
						addOKCancelButtons().appendTo($selectedphenotype_bottom_bar_td_left);
					}
					else if(current_settings.okcancelButtonsAlign==='center'){
						addOKCancelButtons().appendTo($selectedphenotype_bottom_bar_td_center);
					}
					else{
						addOKCancelButtons().appendTo($selectedphenotype_bottom_bar_td_right);
					}
				}
	
				if(current_settings.is_hierarchy_fullscreen || current_settings.use_webgl){
					var $language_select = $('select[name=language]');
					$language_select.find('option').prop('selected', false);
					$language_select.prev('button').html($language_select.find('option[name='+getCurrentLanguage()+']').prop('selected', true).text()+'&nbsp;▼');
				
					$('*[data-language-key]').each(function(){
						var $this = $(this);
						var key = $this.attr('data-language-key');
						$this.text(language[key]);
					});
	
					$('*[data-language-tooltip-key]').each(function(){
						var $this = $(this);
						var key = $this.attr('data-language-tooltip-key');
						if(isEmpty(language[key])){
							$this.attr({'data-original-title':key});
						}
						else{
							$this.attr({'data-original-title':language[key]});
						}
					}).tooltip();
				}
			}

			/////////////////////////////////////////////////////////////////////////
			// class contents
			/////////////////////////////////////////////////////////////////////////
			$table = $inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssClassContentBaseClass);
			if($table.length){
				$table.empty();
			}
			else{
				$table = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTableClass).addClass(current_settings.cssClassContentBaseClass).appendTo($inlineContentBase);
			}

			var $tr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTrClass).appendTo($table);

			// super class content
			createOtherContent(results[current_settings.keySuperclass],{
				title: language.superclass,
				classname: CSS_PREFIX+current_settings.keySuperclass,
				formatNumber: true,
				hidden: $.isArray(current_settings.disabledTokenIds) && results[current_settings.keySelfclass].filter(function(r){ return current_settings.disabledTokenIds.filter(function(id){ return id===r.id; }).length>0 ? true : false; }).length>0 ? true : false
			}).appendTo($tr);

			// self class content
			var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).addClass(current_settings.cssSelfContentClass).appendTo($tr);
			if($.isArray(results[current_settings.keySelfclass]) && results[current_settings.keySelfclass].length){
				if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
					var $base = $('<'+current_settings.nodeName+'>').addClass(current_settings[SCHEMA_2022].cssBaseClass).click(function(e){ e.stopPropagation(); e.preventDefault(); return false; }).appendTo($td);

					var $title = null;
					if(isString(current_settings.titleSelfclass) && current_settings.titleSelfclass.length){
						$title = $('<'+current_settings.nodeName+'>').addClass(current_settings[SCHEMA_2022].cssTopBarClass)
																	.addClass(current_settings.titleSelfclass)
																	.text(current_settings.titleSelfclass)
																	.appendTo($base);
					}

					var target_arr = [];
					var arr = getTokenInputItems();
					if($.isArray(arr)){
						target_arr = $.grep(arr,function(data){return data.id===results[current_settings.keySelfclass][0].id;});
					}
					if(!isArray(results[current_settings.keySuperclass]) || results[current_settings.keySuperclass].length===0){
						target_arr.push('dummy');
					}

					var data = {
						'target' : $.extend(true, {},tokeninput_target),
						'self' : $.extend(true, {},results[current_settings.keySelfclass][0])
					};

					var $buttons = $('<'+current_settings.nodeName+'>').addClass(current_settings[SCHEMA_2022].cssButtonsClass).addClass('d-flex flex-row').appendTo($base);

					var $button_base = addExecuteButtons(data,target_arr.length!==0, true).appendTo($buttons);
					var $separator = $('<div>').addClass(current_settings.cssSeparatorClass).appendTo($button_base);
					var $copy_button = $('<button>')
						.addClass('btn btn-copy btn-ripper-effect')
						.addClass(current_settings.cssButtonCopyClass)
						.attr({
							'data-language-key':'copy',
							'data-language-tooltip-key':'tooltip_copy',
							'data-toggle':'tooltip',
							'data-html':'true',
							'data-placement': 'top',
							'data-original-title': language['tooltip_copy']
						})
						.text(language['copy'])
						.appendTo($button_base)
						.on('click',function(e){
							$(this).tooltip('hide');
							var $textarea = $('textarea.'+current_settings.cssContentCopyClass);
							$textarea.show().get(0).select();
							document.execCommand('copy');
							$textarea.hide();
						})
						.tooltip({'placement': 'top', 'container': 'body', boundary: 'window'});

					if($.isPlainObject( window['tmripple']) && $.isFunction(window['tmripple'].init)){
						$copy_button.attr({'data-animation':'ripple'});
						tmripple.init();
					}

					var $selection_base = $('<div>').addClass(current_settings[SCHEMA_2022].cssSelectionBaseClass).addClass('flex-fill').appendTo($buttons);
					var selected_en = runSearchOptions.hasJA ? "":"selected";
					var selected_ja = runSearchOptions.hasJA ? "selected":"";
					var select_str =	'<select name=\"language\" class=\"'+current_settings[SCHEMA_2022].cssLanguageChangeClass+'\">' + 
											'<option data-language-key=\"eng\" name=\"'+LANGUAGE_EN+'\" value=\"'+LANGUAGE_EN+'\" '+selected_en+'>'+language['eng']+'</option>' +
											'<option data-language-key=\"jpn\" name=\"'+LANGUAGE_JA+'\" value=\"'+LANGUAGE_JA+'\" '+selected_ja+'>'+language['jpn']+'</option>' +
										'</select>';
					var $language_select = $(select_str).appendTo($selection_base)
														.change(function(){
															var $select = $(this);
															var $select_option = $select.find('option:selected');
															runSearchOptions.hasJA = $select_option.val()===LANGUAGE_JA;
															if(executionLanguage_timeoutID){
																clearTimeout(executionLanguage_timeoutID);
															}
															executionLanguage_timeoutID = setTimeout(function(){
																executionLanguage_timeoutID = null;
																showLoading();
																showResults();
															},100);
														});

					//var $content = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentClass).appendTo($base);
					//var $contentTable = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentTableClass).appendTo($content);
					var $contentTable = $('<table>').addClass(current_settings[SCHEMA_2022].cssContentClass).appendTo($base);
					
					var title_text_arr = [];
					$.each(results[current_settings.keySelfclass], function(){
						var result = this;
						
						if($title && title_text_arr.length === 0){
							$.each(['id','name'], function(){
								var key = this;
								var value = result[key];
								if(runSearchOptions.hasJA){
									if(isString(result[key+'_ja'])) value = result[key+'_ja'];
								}
								title_text_arr.push(value);
							});
							$title.empty();
							//$title.text(title_text_arr.join(' '));
							$('<span>').text(title_text_arr.join(' ')).appendTo($title);
						}

						
						let highlighted_Original_TokenInputItem = getHighlightedOriginalTokenInputItem();
						let original_TokenInputItem_by_id = getOriginalTokenInputItem_by_id(result['id']);

						var copy_values = [];
						var list = ['is_observed','severity','id','name','English','definition','comment','synonym'];
						$.each(list, function(i,val){
							var key = val;
							var value = result[key];
							if(runSearchOptions.hasJA){
								if(isString(result[key+'_ja'])) value = result[key+'_ja'];
								if(key==='English') value = result['name'];
							}else if(key==='English'){
								return;
							}

							var $contentTr = $('<tr>').addClass(current_settings[SCHEMA_2022].cssContentRowClass).addClass('bottomline').appendTo($contentTable);

							var label = language[key.toLowerCase()] ? language[key.toLowerCase()] : key;
							var $th = $('<th>').text(label).appendTo($contentTr);
							var $value_td = $('<td>').css({'text-align':'left','width':'100%','padding-left':'0px','padding-right':'0px'}).appendTo($contentTr);
							
							if(key==='is_observed' || key==='severity'){
								
								let val_checked = "";
								if((highlighted_Original_TokenInputItem) &&
								   (key in highlighted_Original_TokenInputItem) &&
								   (highlighted_Original_TokenInputItem.id.replace('_ja','') === result.id.replace('_ja',''))){
									val_checked = highlighted_Original_TokenInputItem[key];
								}else if((original_TokenInputItem_by_id)&&(key in original_TokenInputItem_by_id)){
									val_checked = original_TokenInputItem_by_id[key];
								}
								var hash = language[key + "_hash" ];

								for(let val in hash){
									let title_label = hash[val];
                                    let cbx_id = 'popuphpo-cbx' + '-' + key + '-' + val;
									let $div = $('<div>').addClass('hpo-radio-wrap').appendTo($value_td);
									$('<input>').prop('type','radio')
												.prop('name','popuphpo-cbx-' + key)
												.prop('id',cbx_id)
												.prop('checked', (val_checked && val_checked===val) ? val_checked : false)
												.val(val)
												.data('hpo_id',result.id)
												.data('hpo_attr_key',key)
												.click(function(e){
													// change check status
											        const elmName = this.getAttribute('name');
											        const radios = document.querySelectorAll('input[type="radio"][name="' + elmName + '"]');
												    radios.forEach(elm => {
											            elm.removeAttribute('checked');
											        });
											        this.setAttribute('checked','checked');
											        e.stopPropagation();
													
													let hpo_id = $(this).data('hpo_id');
													let hpo_attr_key = $(this).data('hpo_attr_key');
													let hpo_attr_val = $(this).val();

													// modify ADD and Replace Button data obj value
													$('div.popup-hierarchy-hpo-buttons-schema_2022').find('button').each(function(idx,btn){
														let $btn = $(btn);
														var params = $btn.data(OBJECT_KEY) || {};
														if('self' in params){
															params.self = $.extend(true,{},params.self,{[hpo_attr_key]:hpo_attr_val});
															$btn.data(OBJECT_KEY, params);	
														}
													});
													// modify tokeninput entry 
													let highlighted_Original_TokenInputItem = getHighlightedOriginalTokenInputItem();
													let original_TokenInputItem_by_id = getOriginalTokenInputItem_by_id(hpo_id);

													if((highlighted_Original_TokenInputItem) &&
														(highlighted_Original_TokenInputItem.id.replace('_ja','') === hpo_id.replace('_ja',''))){
														updateHighlightedOriginalTokenInputItem({[hpo_attr_key]:hpo_attr_val});
													}else if((original_TokenInputItem_by_id)&&(key in original_TokenInputItem_by_id)){
														updateOriginalTokenInputItem_by_id(hpo_id, {[hpo_attr_key]:hpo_attr_val})
													}
												})
												.appendTo($div);
									$("<label for=\""+cbx_id+"\">").text(title_label)
																   .click(function(){
																	 $(this).prev().trigger('click');
																   })
																   .appendTo($div);
								}

								if (key === 'severity') $contentTr.hide();
							} else if(key==='name'){
								var $a = $('<a>')
								.addClass(current_settings.cssLinkClass)
								.attr({'href':'#'})
								.data(OBJECT_KEY, result)
								//.css({'border':'0px','display':'inline-block'/*,'width':'100%'*/})
								.click(function(){
									var data = $(this).data(OBJECT_KEY);
									setTimeout(function(){
										runSearch(data.id);
									},0);
									return false;
								})
								.appendTo($value_td);
								$('<span>').text(value).css({'border':'0px'}).appendTo($a);

							}
							else{
								value = value.replace(/\|/g, ' | ');		
								if(isNeedOverflewHidden(value)){
									$value_td.addClass('switch');
									let $div_content = $('<div>').addClass('hpo_content').appendTo($value_td);
									let $div_control = $('<div>').addClass('control').appendTo($value_td);
									$("<span>").appendTo($div_control)
										.click(function(){
											$(this).closest("td").toggleClass('on');
										});
									if(key==='comment' && isString(value)){
										$div_content.html(value.replace(/\\n/g,'<br />'));
									}
									else{
										$div_content.text(value);
									}
								}else{
									if(key==='comment' && isString(value)){
										$value_td.html(value.replace(/\\n/g,'<br />'));
									}
									else{
										$value_td.text(value);
									}
								}
							}

							if(current_settings.copy_items.indexOf(key)>=0){
								$value_td.addClass(current_settings.cssContentCopyClass);
								if(runSearchOptions.hasJA && key==='name'){
									if(isString(result[key+'_ja']) && result[key+'_ja']!==result[key]) copy_values.push(value);
								}
								else{
									copy_values.push(value);
								}
							}
						});
						$contentTable.find('tr').last().removeClass('bottomline');
						
						if(copy_values.length){
							$('<textarea>').addClass(current_settings.cssContentCopyClass).css({display:'none'}).text(copy_values.join(current_settings.copy_delimiter)).appendTo($contentTable);
						}
					});					
				}else{
					var $base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssBaseClass)
																	.click(function(e){ e.stopPropagation(); e.preventDefault(); return false; })
																	.appendTo($td);
					var $title = null;
					if(isString(current_settings.titleSelfclass) && current_settings.titleSelfclass.length){
						$title = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTopBarClass).text(current_settings.titleSelfclass).appendTo($base);
					}

					var target_arr = [];
					var arr = getTokenInputItems();
					if($.isArray(arr)){
						target_arr = $.grep(arr,function(data){return data.id===results[current_settings.keySelfclass][0].id;});
					}
					if(!isArray(results[current_settings.keySuperclass]) || results[current_settings.keySuperclass].length===0){
						target_arr.push('dummy');
					}

					var data = {
						'target' : $.extend(true, {},tokeninput_target),
						'self' : $.extend(true, {},results[current_settings.keySelfclass][0])
					};

					var $buttons = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssButtonsClass).appendTo($base);
					var $button_base = addExecuteButtons(data,target_arr.length!==0, true).appendTo($buttons);

					var $separator = $('<div>').addClass(current_settings.cssSeparatorClass).appendTo($button_base);

					var $copy_button = $('<button>')
						.addClass('btn btn-copy')
						.addClass(current_settings.cssButtonCopyClass)
						.attr({
							'data-language-key':'copy',
							'data-language-tooltip-key':'tooltip_copy',
							'data-toggle':'tooltip',
							'data-html':'true',
							'data-original-title': language['tooltip_copy']
						})
						.text(language['copy'])
						.appendTo($button_base)
						.on('click',function(e){
							$(this).tooltip('hide');
							var $textarea = $('textarea.'+current_settings.cssContentCopyClass);
							$textarea.show().get(0).select();
							document.execCommand('copy');
							$textarea.hide();
						})
						.tooltip();

					if($.isPlainObject( window['tmripple']) && $.isFunction(window['tmripple'].init)){
						$copy_button.attr({'data-animation':'ripple'});
						tmripple.init();
					}

					var $content = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentClass).appendTo($base);
					var $contentTable = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentTableClass).appendTo($content);

					var title_text_arr = [];

					$.each(results[current_settings.keySelfclass], function(){
						var result = this;
						if($title && title_text_arr.length === 0){
							$.each(['id','name'], function(){
								var key = this;
								var value = result[key];
								if(runSearchOptions.hasJA){
									if(isString(result[key+'_ja'])) value = result[key+'_ja'];
								}
								title_text_arr.push(value);
							});
							$title.empty();

							var $title_table = $('<'+current_settings.nodeName+'>').css({'display':'table','border-collapse':'collapse','width':'100%'}).appendTo($title);
							var $title_tr = $('<'+current_settings.nodeName+'>').css({'display':'table-row'}).appendTo($title_table);
							var $title_td1 = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'left','padding-left':'4px'}).text(title_text_arr.join(' ')).appendTo($title_tr);
							var $title_td2 = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'right','width':'20px'}).appendTo($title_tr);

							if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
								var $selectedphenotype_title_td_right = $('<'+current_settings.nodeName+'>').css({'display':'inline-block','text-align':'right','position':'relative'}).appendTo($title_td2);
								$selectedphenotype_title_td_right.css({'margin-right':'0px','font-size':'14px'});
								var $language_button = $('<button>')
									.addClass(current_settings.cssLanguageChangeClass)
									.addClass('btn btn-default')
									.appendTo($selectedphenotype_title_td_right)
									.text('')
									.click(function(e){
										e.preventDefault();
										e.stopPropagation();
										return false;
									});
								$language_button.css({'padding-right':'2px','padding-left':'2px'});
								var $language_select = $('<select>')
									.attr({'name':'language'})
									.addClass(current_settings.cssLanguageChangeClass)
									.appendTo($selectedphenotype_title_td_right)
									.change(function(){
										var $select = $(this);
										var $select_option = $select.find('option:selected');
										$select.prev('button').html($select_option.text()+'&nbsp;▼');;
										runSearchOptions.hasJA = $select_option.val()==='ja';
										if(executionLanguage_timeoutID){
											clearTimeout(executionLanguage_timeoutID);
										}
										executionLanguage_timeoutID = setTimeout(function(){
											executionLanguage_timeoutID = null;
											showLoading();
											showResults();
										},100);
									});
								$language_select.css({'padding-right':'2px','padding-left':'2px'});
								var $language_option_en = $('<option>').attr({'data-language-key':'eng','name':'en'}).val('en').text(language['eng']).appendTo($language_select);
								var $language_option_jp = $('<option>').attr({'data-language-key':'jpn','name':'ja'}).val('ja').text(language['jpn']).appendTo($language_select);

								var $language_select = $('select[name=language]');
								$language_select.find('option').prop('selected', false);
								$language_select.prev('button').html($language_select.find('option[name='+getCurrentLanguage()+']').prop('selected', true).text()+'&nbsp;▼');
							}
						}

						var copy_values = [];
						$.each(['id','name','English','definition','comment','synonym'], function(i,val){
							//var key = this.toString();
							var key = val;
							var value = result[key];
							if(runSearchOptions.hasJA){
								if(isString(result[key+'_ja'])) value = result[key+'_ja'];
								if(key==='English') value = result['name'];
							}else if(key==='English'){
								return;
							}
							var label = language[key.toLowerCase()] ? language[key.toLowerCase()] : key;
							var $contentTr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentTrClass).appendTo($contentTable);
							$('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentThClass).text(label).appendTo($contentTr);
							$('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentTdColonClass).text(':').appendTo($contentTr);
							var $value_td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentTdClass).appendTo($contentTr);
							if(key==='name'){

								var $a = $('<a>')
								.addClass(current_settings.cssLinkClass)
								.attr({'href':'#'})
								.data(OBJECT_KEY, result)
								.css({'border':'0px','display':'inline-block'/*,'width':'100%'*/})
								.click(function(){
									var data = $(this).data(OBJECT_KEY);
									setTimeout(function(){
										runSearch(data.id);
									},0);
									return false;
								})
								.appendTo($value_td);
								$('<span>').text(value).css({'border':'0px'}).appendTo($a);

							}
							else{
								if(key==='comment' && isString(value)){
									$value_td.html(value.replace(/\\n/g,'<br />'));
								}
								else{
									$value_td.text(value);
								}
							}

							if(current_settings.copy_items.indexOf(key)>=0){
								$value_td.addClass(current_settings.cssContentCopyClass);
								if(runSearchOptions.hasJA && key==='name'){
									if(isString(result[key+'_ja']) && result[key+'_ja']!==result[key]) copy_values.push(value);
								}
								else{
									copy_values.push(value);
								}
							}
						});
						if(copy_values.length){
							$('<textarea>').addClass(current_settings.cssContentCopyClass).css({display:'none'}).text(copy_values.join(current_settings.copy_delimiter)).appendTo($content);
						}
					});
				}
			}

			// sub class content
			createOtherContent(results[current_settings.keySubclass],{
				title: language.subclass,
				classname:CSS_PREFIX+current_settings.keySubclass,
				formatNumber: true
			}).appendTo($tr);
			
			changeStateAddOrReplace();

			/////////////////////////////////////////////////////////////////////////
			// WebGL
			/////////////////////////////////////////////////////////////////////////
			if(current_settings.use_webgl){
				$webgl_content_base_table = $inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssWebGLContentBaseClass);
				if($webgl_content_base_table.length===0){
					__isFirstThreeBitsRenderer = true;

					$webgl_content_base_table = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTableClass).addClass(current_settings.cssWebGLContentBaseClass).appendTo($inlineContentBase);
					$webgl_content_base_table.css({'width':'84%'});
					$webgl_content_base_table.hide();

					var $tr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTrClass).appendTo($webgl_content_base_table);
					var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).appendTo($tr);
					//$td.css({'width':'65%'});

					var $webgl_content_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssBaseClass).addClass(current_settings.cssWebGLContentClass).appendTo($td);
					$webgl_content_base.css({'position':'relative'});


					var $webgl_content_title = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTopBarClass).css({'display':'table','border-collapse':'collapse','width':'100%'}).appendTo($webgl_content_base);
					var $webgl_content_title_tr = $('<'+current_settings.nodeName+'>').css({'display':'table-row'}).appendTo($webgl_content_title);
					var $webgl_content_title_td1 = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'left','padding-left':'0.5em'})/*.attr({'data-language-key':'webgltitle'}).text(language['webgltitle'])*/.appendTo($webgl_content_title_tr);
					var $webgl_content_title_td2 = $('<'+current_settings.nodeName+'>').css({'display':'table-cell','text-align':'right','width':'20px'}).appendTo($webgl_content_title_tr);

					$('<span>')
						.attr({'data-language-key':'webgltitle'})
						.css({'cursor':'default'})
						.text(language['webgltitle'])
						.appendTo($webgl_content_title_td1);

					$('<span>')
						.attr({'data-language-tooltip-key':'webgloperationhelp'})
						.attr({'data-toggle':'tooltip', 'data-html':'true',  'data-original-title': language['webgloperationhelp']})
						.css({'display':'inline-block', 'padding':'3px 5px', 'margin-left':'0.5em', 'font-weight':'bold', 'font-size':'13px', 'line-height':'1em', 'border-radius':'8px', 'cursor':'default', 'background-color':'black'})
						.text('?')
						.appendTo($webgl_content_title_td1)
						.tooltip();

					$('<button>')
						.addClass('btn btn-default')
						.attr({'data-language-key':'close'})
						.css({'min-width':'70px','padding':'1px 4px','border':'2px solid white'})
						.text(language['close'])
						.click(function(){
							var $inlineContentBase = getContentBaseElement();
							if($inlineContentBase.length){
								$inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssClassContentBaseClass).show();
								$inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssWebGLContentBaseClass).hide();
								$inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssWebGLSwitchContentClass).show();

//								current_settings.active_webgl = false;
							}
						})
						.appendTo($webgl_content_title_td2);

					var $webgl_chechkbox_group = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentClass).addClass(current_settings.cssCheckboxGroupClass).appendTo($webgl_content_base);
					$webgl_chechkbox_group.css({'height':'30px','border-bottom':'1px solid gray','padding':'2px 0px','text-align':'left','vertical-align':'middle'});

					$.each(current_settings.use_segments, function(){
						var text = this.toString();
						var name = text.toLowerCase();
						if(isString(language[name])) text = language[name];
						var id = CSS_PREFIX+'checkbox-'+name;
						$('<input type=checkbox>').attr({'name':name,'value':name,'id':id}).prop('checked', name===current_settings.use_segments[0]).css({'margin-left':'10px'}).appendTo($webgl_chechkbox_group);
						$('<label>').attr({'for':id}).css({'margin-left':'2px','margin-right':'10px'}).text(text).appendTo($webgl_chechkbox_group);
					});

					var $webgl_content = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentClass).appendTo($webgl_content_base);
					$webgl_content.css({'padding':'0px','position':'relative','overflow':'hidden'});

					var $webgl_home_content = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssWebGLHomeContentClass).appendTo($webgl_content).click(function(){
						__threeBitsRenderer._setHorizontal(0)._setVertical(0).focus(true);
						$(this).hide();
					}).hide();

					if(window.threeBitsRenderer){

						var _click_callback = function(use_load){
							if(!isBoolean(use_load)) use_load = true;

							__threeBitsRenderer.removeAllSpeechBalloon();

							var paths = [];
							var checked_category = {};
							var $checked = $webgl_chechkbox_group.find('input[type=checkbox]:checked');
							if($checked.length){

								var $fmalist_content_base = $(current_settings.nodeName+'.'+current_settings.cssFMAListContentClass);
								var $fmalist_content = $fmalist_content_base.find(current_settings.nodeName+'.'+current_settings.cssContentClass);
								var $fmalist_content_tr = $fmalist_content.find('table tr');
								var pick_objid_hash = {};
								var obj_color_hash = {};
								var obj_hide_hash = {};
								var fma_hide_hash = {};
								if($fmalist_content_tr.length>1){
									$fmalist_content_tr.each(function(){
										var $tr = $(this);
										var fma_id = $tr.data('fma_id');
										if(isEmpty(fma_id)) return;

										var fma_name = $tr.data('fma_name');

										var hash = $tr.data('pick_objid') || {};
										Object.keys(hash).forEach(function(objid){
											pick_objid_hash[objid] = hash[objid];
										});
									});
								}

								$checked.each(function(){
									var category = $(this).val();
									checked_category[category] = null;
									if(category2obj['category'][category]){
										Object.keys(category2obj['category'][category]).forEach(function(objid){
											var params = {};
											params[Ag.Def.OBJ_ID_DATA_FIELD_ID] = objid;
											params[Ag.Def.CONCEPT_DATA_COLOR_DATA_FIELD_ID] = isDefined(pick_objid_hash[objid]) ? '#FF0000' : (isDefined(obj_color_hash[objid]) ? obj_color_hash[objid] : category2obj['category'][category][objid][Ag.Def.CONCEPT_DATA_COLOR_DATA_FIELD_ID]);
											params[Ag.Def.OBJ_URL_DATA_FIELD_ID] = current_settings.obj_url+objid+current_settings.obj_ext;
											params[Ag.Def.CONCEPT_DATA_OPACITY_DATA_FIELD_ID] = category==='other'?SKIN.OPACITY:1.0;
											params[Ag.Def.CONCEPT_DATA_VISIBLE_DATA_FIELD_ID] = isDefined(obj_hide_hash[objid]) ? false : true;
											params[Ag.Def.USE_FOR_BOUNDING_BOX_FIELD_ID] = false;
											params[Ag.Def.CONCEPT_DATA_SELECTED_DATA_FIELD_ID] = category==='other'?true:false;
											paths.push(params);
										});
									}
								});
							}
							if(!isDefined(checked_category['other'])){
								var category = 'other';
								if(category2obj['category'][category]){
									Object.keys(category2obj['category'][category]).forEach(function(objid){
										var params = {};
										params[Ag.Def.OBJ_ID_DATA_FIELD_ID] = objid;
										params[Ag.Def.CONCEPT_DATA_COLOR_DATA_FIELD_ID] = category2obj['category'][category][objid][Ag.Def.CONCEPT_DATA_COLOR_DATA_FIELD_ID];
										params[Ag.Def.OBJ_URL_DATA_FIELD_ID] = current_settings.obj_url+objid+current_settings.obj_ext;
										params[Ag.Def.CONCEPT_DATA_OPACITY_DATA_FIELD_ID] = SKIN.DEFAULT_OPACITY;
										params[Ag.Def.CONCEPT_DATA_VISIBLE_DATA_FIELD_ID] = true;
										params[Ag.Def.USE_FOR_BOUNDING_BOX_FIELD_ID] = false;
										paths.push(params);
									});
								}
							}
							if(paths.length){
								if(use_load){
									__threeBitsRenderer.loadObj(paths);
								}
								else{
									__threeBitsRenderer.setObjProperties(paths);
								}
							}
						};

						var click_callback = function(e){
							$(__threeBitsRenderer.domElement()).one('hide', _click_callback);
							__threeBitsRenderer.hideAllObj();
						};
						$webgl_chechkbox_group.find('input[type=checkbox]').on('click', function(e){
							__threeBitsRenderer.fireEvent('progress',__threeBitsRenderer,'Please wait...');
							setTimeout(click_callback.call(undefined,e),250);
						});

						if(!window.__threeBitsRenderer){
							window.__threeBitsRenderer = new threeBitsRenderer({
								width:108,
								height:108,
								rate:1,
								minZoom: 1,
								maxZoom: 23,
								backgroundColor: '#FFFFFF'
							});
						}
						var $domElement = $(__threeBitsRenderer.domElement());
						$domElement.show();
						$domElement.css({'z-index':'1'}).appendTo($webgl_content)
						.on('pick', function(e,ren,intersects){
							var fma_ids = {};
							var fma2pickobj = {};

							var name_key = 'name';
							if(runSearchOptions.hasJA) name_key += '_ja';

							if(isArray(intersects) && intersects.length && isObject(window.category2obj)){

								var $checked_category = $webgl_chechkbox_group.find('input[type=checkbox]:checked');

								var exists_parts = false;

								intersects.forEach(function(intersect){
									if(exists_parts) return false;
									if(!(isObject(intersect) && intersect.object && isString(intersect.object[Ag.Def.OBJ_ID_DATA_FIELD_ID]) && intersect.object[Ag.Def.OBJ_ID_DATA_FIELD_ID].length)) return;

									var art_id = intersect.object[Ag.Def.OBJ_ID_DATA_FIELD_ID];
//									console.log('art_id',art_id);

									$checked_category.each(function(){
										var category = $(this).val();

										if(exists_parts) return false;

										if(!isObject(category2obj['category'][category][art_id])) return true;
										if(!isString(category2obj['category'][category][art_id]['FMA'])) return false;

										var fma_id = category2obj['category'][category][art_id]['FMA'];
										if(!isObject(category2obj['FMA'][fma_id])) return false;

										if(isEmpty(fma2pickobj[fma_id])) fma2pickobj[fma_id] = {};
										if(!isEmpty(fma2pickobj[fma_id][art_id])) return false;

										exists_parts = true;

										fma_ids[fma_id] = category2obj['FMA'][fma_id];
									});
								});
							}
							else{
							}

							var _pick = function(fma_ids){
								if(fma_ids === undefined) fma_ids = pickFMAIDs;
//								console.log(fma_ids);

								if(isString(fma_ids)){
									var fma_id = fma_ids;
									fma_ids = {};
									fma_ids[fma_id] = category2obj['FMA'][fma_id];
								}
								fma_ids = fma_ids || {};

								pickFMAIDs = $.extend(true, {}, pickFMAIDs, fma_ids || {});

								var fma2pickobj = {};

								var fma_sort = function(a,b){
									var name_a = isString(fma_ids[a][name_key]) ? fma_ids[a][name_key] : fma_ids[a]['name'];
									var name_b = isString(fma_ids[b][name_key]) ? fma_ids[b][name_key] : fma_ids[b]['name'];

									if(name_a<name_b) return -1;
									if(name_a>name_b) return  1;
									return 0;
								};

								var $checked_category = $webgl_chechkbox_group.find('input[type=checkbox]:checked');

								Object.keys(fma_ids).sort(fma_sort).forEach(function(fma_id,index,array){

									var disp_fma_id = fma_id;
									if(fma_id.match(/^(FMA)([0-9]+.*)$/)){
										disp_fma_id = RegExp.$1+':'+RegExp.$2;
									}
									var fma_name = isString(fma_ids[fma_id][name_key]) ? fma_ids[fma_id][name_key] : fma_ids[fma_id]['name'];

									if(isObject(fma_ids[fma_id]['art_ids'])){
										$checked_category.each(function(){
											var checked_category = $(this).val();
											if(isArray(fma_ids[fma_id]['art_ids'][checked_category])){
												fma_ids[fma_id]['art_ids'][checked_category].forEach(function(temp_art_id){
													fma2pickobj[fma_id] = fma2pickobj[fma_id] || {};
													fma2pickobj[fma_id][temp_art_id] = {
														fma_id: disp_fma_id,
														fma_name: fma_name
													};
												});
											}
										});
									}
								});


								var height = $webgl_content_base.innerHeight();

								var $fmatreelist_content_base = $(current_settings.nodeName+'.'+current_settings.cssFMATreeListContentClass);
								var $fmatreelist_title = $fmatreelist_content_base.find(current_settings.nodeName+'.'+current_settings.cssTopBarClass);
								var $fmatreelist_content = $fmatreelist_content_base.find(current_settings.nodeName+'.'+current_settings.cssContentClass);
								$fmatreelist_content.empty();
								$fmatreelist_content.css({'max-height':((height/2-20)-$fmatreelist_title.height())+'px','overflow':'auto','padding':'10px'});

								var $fmalist_content_base = $(current_settings.nodeName+'.'+current_settings.cssFMAListContentClass);
								$fmalist_content_base.hide();
								var $fmalist_title = $fmalist_content_base.find(current_settings.nodeName+'.'+current_settings.cssTopBarClass);
								var $fmalist_content = $fmalist_content_base.find(current_settings.nodeName+'.'+current_settings.cssContentClass);
								$fmalist_content.css({'height':($fmalist_content_base.innerHeight()-$fmalist_title.height())+'px','overflow':'auto','padding':'0'});
								$fmalist_content.empty();

								var $hpolist_content_base = $(current_settings.nodeName+'.'+current_settings.cssHPOListContentClass);
								var $hpolist_title = $hpolist_content_base.find(current_settings.nodeName+'.'+current_settings.cssTopBarClass).empty();
								var $hpolist_content = $hpolist_content_base.find(current_settings.nodeName+'.'+current_settings.cssContentClass);

								if($fmalist_content_base.is(':visible') || $fmatreelist_content_base.is(':visible')) $hpolist_content_base.css({'margin-top':'20px'});

								$hpolist_content.css({'max-height':((height/2-20)-$hpolist_title.height())+'px','overflow':'auto','padding':'10px'});

								$hpolist_content.empty();


								$fmatreelist_content_base.css({'visibility':'hidden'});
								$hpolist_content_base.css({'visibility':'hidden'});

								if(Object.keys(fma_ids).length){

									var table_css = {};//{'width':'100%','font-size':'0.85em'};
									var head_css = {};//{'background-color':'#DDDDDD','cursor':'default'};
									var th_css = {};//{'padding':'0 2px','border':'1px solid #F0F0F0'};
									var td_left_css = {};//$.extend({},th_css,{'text-align':'left','vertical-align':'top'});
									var td_center_css = $.extend(true, {},td_left_css,{'padding':'0','text-align':'center'});
									var td_right_css = $.extend(true, {},td_left_css,{'padding':'0','text-align':'right'});

									var $fmalist_content_table = $('<table>').css(table_css).appendTo($fmalist_content);
									var $tr = $('<tr>').appendTo($fmalist_content_table).css(head_css);
									var $th = $('<th>').text(language['fmaid']).appendTo($tr).css(th_css);
									var $th = $('<th>').text(language['fmaname']).appendTo($tr).css(th_css);
									var $th = $('<th>').text(language['#ofphenotypes']).appendTo($tr).css(th_css);

									var $hpolist_content_table = $('<table>').css(table_css).appendTo($hpolist_content);
									var $tr = $('<tr>').appendTo($hpolist_content_table).css(head_css);

									Object.keys(fma_ids).sort(fma_sort).forEach(function(fma_id,index,array){
										var disp_fma_id = fma_id;
										if(fma_id.match(/^(FMA)([0-9]+.*)$/)){
											disp_fma_id = RegExp.$1+':'+RegExp.$2;
										}
										var fma_name = isString(fma_ids[fma_id][name_key]) ? fma_ids[fma_id][name_key] : fma_ids[fma_id]['name'];
										var $tr = $('<tr>').attr({'data-fmaid':fma_id})
                                                           .data({'disp_fma_id':disp_fma_id,'fma_id':fma_id,'fma_name':fma_name,'pick_objid': fma2pickobj[fma_id]||{} })
                                                           .data(OBJECT_KEY, fma2obj[fma_id])
                                                           .appendTo($fmalist_content_table)
										.hover(
											function(){
												var $this_tr = $(this);
												$this_tr.addClass(current_settings.cssFMAListContentHoverClass);
											},
											function(){
												var $this_tr = $(this);
												$this_tr.removeClass(current_settings.cssFMAListContentHoverClass);
											}
										)
										.click(function(){
											var language = current_settings.language[getCurrentLanguage()];

											var $this_tr = $(this);
											$fmalist_content_table.find('tr.'+current_settings.cssFMAListContentSelectClass).removeClass(current_settings.cssFMAListContentSelectClass);
											$this_tr.addClass(current_settings.cssFMAListContentSelectClass);

											var disp_fma_id = $this_tr.data('disp_fma_id');
											var fma_id = $this_tr.data('fma_id');

											var name_key = 'name';
											if(runSearchOptions.hasJA) name_key += '_ja';

											var fma = category2obj['FMA'][fma_id];

											var fma_name = fma[name_key] ? fma[name_key] : fma['name']; //$this_tr.data('fma_name');
//											$hpolist_title.html(disp_fma_id+'&nbsp;'+fma_name);

											var $hpolist_title_span = $('<span>').appendTo($hpolist_title);

											var hpolist_title_ja = current_settings.language['ja']['hpolisttitle'].replace('__FMANAME__', fma['name_ja'] ? fma['name_ja'] : fma['name']).replace('__FMAID__', disp_fma_id);
											var hpolist_title_en = current_settings.language['en']['hpolisttitle'].replace('__FMANAME__', fma['name']).replace('__FMAID__', disp_fma_id);
											if(runSearchOptions.hasJA){
												$hpolist_title_span.text(hpolist_title_ja);
											}
											else{
												$hpolist_title_span.text(hpolist_title_en);
											}
											setContentsLanguageName($hpolist_title_span, 'hpolisttitle_'+fma_id, {name:hpolist_title_en,name_ja:hpolist_title_ja});


											$hpolist_content.empty();
											var $hpolist_content_table = $('<table>').css(table_css).appendTo($hpolist_content);

											var hpo_sort = function(a,b){
												var hpo_ids = isObject(category2obj['HPO']) ? category2obj['HPO'] : fma_ids[fma_id]['HPO'];
												if(isObject(hpo_ids[a]) && isObject(hpo_ids[b])){
													var hpo_name_a = isString(hpo_ids[a][name_key]) ? hpo_ids[a][name_key] : hpo_ids[a]['name'];
													var hpo_name_b = isString(hpo_ids[b][name_key]) ? hpo_ids[b][name_key] : hpo_ids[b]['name'];

													if(hpo_name_a<hpo_name_b) return -1;
													if(hpo_name_a>hpo_name_b) return  1;
												}
												else{
													if(!isObject(hpo_ids[a])) console.warn('Unknown object ' + a);
													if(!isObject(hpo_ids[b])) console.warn('Unknown object ' + b);
												}
												return 0;
											};

											var create_hpo_list = function(hpo_id){
//												console.log(hpo_id);
												var hpo_ids = isObject(category2obj['HPO']) ? category2obj['HPO'] : fma_ids[fma_id]['HPO'];

												var hpo_name = isString(hpo_ids[hpo_id][name_key]) ? hpo_ids[hpo_id][name_key] : hpo_ids[hpo_id]['name'];

												var $tr = $('<tr>').data({'hpo_id':hpo_id}).appendTo($hpolist_content_table);

												var $td = $('<td>').css(td_center_css).css({'white-space':'nowrap'}).appendTo($tr);
												$('<button>')
													.addClass('btn btn-primary')
													.addClass(current_settings.cssButtonAddClass)
													.data(OBJECT_KEY,{self: $.extend(true, {id:hpo_id}, hpo_ids[hpo_id]), exec:'add'})/*.css({'margin':'0','padding':'0 2px','font-size':'inherit'})*/
													.attr({'data-language-key':'add'})
													.text(language['add'])
													.appendTo($td)
													.on('click',executionAddOrReplace);

												$('<button>')
													.addClass('btn btn-primary')
													.addClass(current_settings.cssButtonReplaceClass)
													.data(OBJECT_KEY,{self: $.extend(true, {id:hpo_id}, hpo_ids[hpo_id]), exec:'replace'})/*.css({'margin':'0','padding':'0 2px','font-size':'inherit'})*/
													.attr({'data-language-key':'replace'})
													.text(language['replace'])
													.appendTo($td)
													.on('click',executionAddOrReplace);


												var $td = $('<td>').css(td_right_css).appendTo($tr);
												$('<span>').addClass(current_settings.cssLinkNumberClass).text(hpo_ids[hpo_id]['count']).appendTo($td);

												var $td = $('<td>')/*.text(hpo_name)*/.appendTo($tr).css(td_left_css);

												var $a = $('<a>')
												.addClass(current_settings.cssLinkClass)
												.attr({'href':'#'})
												.data(OBJECT_KEY, {id:hpo_id})
												.click(function(){
													var data = $(this).data(OBJECT_KEY);

													if(false){
														if(isString(options.classname) && options.classname === CSS_PREFIX+settings.keySubclass){
															$(current_settings.nodeName+'.'+current_settings.cssTableClass).css({'animation':'popup-hierarchy-hpo-keyframe-subclass-translate 500ms ease-out 0s normal both'});
														}
														else if(isString(options.classname) && options.classname === CSS_PREFIX+current_settings.keySuperclass){
															$(current_settings.nodeName+'.'+current_settings.cssTableClass).css({'animation':'popup-hierarchy-hpo-keyframe-superclass-translate 500ms ease-out 0s normal both'});
														}
														setTimeout(function(){
															runSearch(data.id);
														},500);
													}else{
														if(click_timeoutID){
															clearTimeout(click_timeoutID);
														}
														click_timeoutID = setTimeout(function(){
															click_timeoutID = null;
															runSearch(data.id);
														},100);
													}
													return false;
												})
												.appendTo($td);

												var $span = $('<span>').text(hpo_name).appendTo($a);

												setContentsLanguageName($span, hpo_id, hpo_ids[hpo_id]);
//											});
											};

											(isObject(fma_ids[fma_id]['HPO']) ? Object.keys(fma_ids[fma_id]['HPO']) : (isArray(fma_ids[fma_id]['HPO']) ? fma_ids[fma_id]['HPO'] : [])).sort(hpo_sort).forEach(create_hpo_list);

											if(current_settings.fmatree_type === 'both'){
												(isObject(fma_ids[fma_id]['HPO_sub']) ? Object.keys(fma_ids[fma_id]['HPO_sub']) : (isArray(fma_ids[fma_id]['HPO_sub']) ? fma_ids[fma_id]['HPO_sub'] : [])).sort(hpo_sort).forEach(create_hpo_list);
											}
											else if(current_settings.fmatree_type === 'class'){
												(isObject(fma_ids[fma_id]['HPO_subclass']) ? Object.keys(fma_ids[fma_id]['HPO_subclass']) : (isArray(fma_ids[fma_id]['HPO_subclass']) ? fma_ids[fma_id]['HPO_subclass'] : [])).sort(hpo_sort).forEach(create_hpo_list);
											}
											else if(current_settings.fmatree_type === 'part'){
												(isObject(fma_ids[fma_id]['HPO_subpart']) ? Object.keys(fma_ids[fma_id]['HPO_subpart']) : (isArray(fma_ids[fma_id]['HPO_subpart']) ? fma_ids[fma_id]['HPO_subpart'] : [])).sort(hpo_sort).forEach(create_hpo_list);
											}

											changeStateAddOrReplace();



											//FMA Tree List
											var $superclass_ul = $('<ul>').addClass('tree super').appendTo($fmatreelist_content);
											var supert_keys;
											if(current_settings.fmatree_type === 'class'){
												supert_keys = ['class'];
											}
											else if(current_settings.fmatree_type === 'part'){
												supert_keys = ['part'];
											}
											else{
												supert_keys = ['class','part'];
											}

											supert_keys.forEach(function(supert_key){
												if(isArray(fma['super'+supert_key]) && fma['super'+supert_key].length){
													fma['super'+supert_key].forEach(function(super_fma_id,index,array){
														var super_fma = category2obj['FMA'][super_fma_id];
														var super_fma_name = super_fma[name_key] ? super_fma[name_key] : super_fma['name']; //$this_tr.data('fma_name');

														var $superclass_li = $('<li>').addClass('tree').addClass('number_after super'+supert_key).appendTo($superclass_ul);

														var sub_count = 0;
														supert_keys.forEach(function(sub_key){
															sub_count += (isArray(super_fma['sub'+sub_key]) && super_fma['sub'+sub_key].length) ? super_fma['sub'+sub_key].length : 0;
														});
														$('<span>').addClass(current_settings.cssLinkNumberClass).addClass('super'+supert_key).text(sub_count).appendTo($('<span>').addClass('number before').appendTo($superclass_li));

														var $superclass_a = $('<a>').addClass('link').attr({'href':'#'}).data('FMAID',super_fma_id).appendTo($superclass_li);
														var $superclass_span = $('<span>').text(super_fma_name).appendTo($superclass_a);
														setContentsLanguageName($superclass_span, super_fma_id, super_fma);

														$('<span>').addClass(current_settings.cssLinkNumberClass).addClass('super'+supert_key).text(sub_count).appendTo($('<span>').addClass('number after').appendTo($superclass_li));
													});
												}
											});

											var $itself_li = $('<li>').addClass('tree itself number_after').appendTo($superclass_ul);
											$('<span>').appendTo($itself_li);

											var sub_count = 0;
											supert_keys.forEach(function(sub_key){
												sub_count += (isArray(fma['sub'+sub_key]) && fma['sub'+sub_key].length) ? fma['sub'+sub_key].length : 0;
											});
											$('<span>').addClass(current_settings.cssLinkNumberClass).addClass('itself').text(sub_count).appendTo($('<span>').addClass('number before').appendTo($itself_li));

											var $itself_span = $('<span>').addClass('term itself').appendTo($itself_li);
											var $itself_strong = $('<strong>').text(fma_name).appendTo($itself_span);
											setContentsLanguageName($itself_strong, fma_id, fma);

											$('<span>').addClass(current_settings.cssLinkNumberClass).addClass('itself').text(sub_count).appendTo($('<span>').addClass('number after').appendTo($itself_li));

											supert_keys.forEach(function(supert_key){
												if((isArray(fma['sub'+supert_key]) && fma['sub'+supert_key].length)){
													var $subclass_ul = $('<ul>').addClass('tree sub').appendTo($itself_li);
													if(isArray(fma['sub'+supert_key]) && fma['sub'+supert_key].length){
														fma['sub'+supert_key].forEach(function(sub_fma_id,index,array){
															var sub_fma = category2obj['FMA'][sub_fma_id];
															var sub_fma_name = sub_fma[name_key] ? sub_fma[name_key] : sub_fma['name']; //$this_tr.data('fma_name');
															var $subclass_li = $('<li>').addClass('tree').addClass('number_after sub'+supert_key).appendTo($subclass_ul);
															var sub_count = 0;
															supert_keys.forEach(function(sub_key){
																sub_count += (isArray(sub_fma['sub'+sub_key]) && sub_fma['sub'+sub_key].length) ? sub_fma['sub'+sub_key].length : 0;
															});
															$('<span>').addClass(current_settings.cssLinkNumberClass).addClass('sub'+supert_key).text(sub_count).appendTo($('<span>').addClass('number before').appendTo($subclass_li));
															var $subclass_a = $('<a>').addClass('link').attr({'href':'#'}).data('FMAID',sub_fma_id).appendTo($subclass_li);
															var $subclass_span = $('<span>').text(sub_fma_name).appendTo($subclass_a);
															setContentsLanguageName($subclass_span, sub_fma_id, sub_fma);
															$('<span>').addClass(current_settings.cssLinkNumberClass).addClass('sub'+supert_key).text(sub_count).appendTo($('<span>').addClass('number after').appendTo($subclass_li));
														});
													}
												}
											});
											$superclass_ul.find('li.tree>a')
												.hover(
													function(){
														var $this_tr = $(this);
														$this_tr.addClass(current_settings.cssFMAListContentHoverClass);
													},
													function(){
														var $this_tr = $(this);
														$this_tr.removeClass(current_settings.cssFMAListContentHoverClass);
													}
												)
												.click(function(e){
													var $a = $(this);
													var fma_id = $a.data('FMAID');
//													console.log(fma_id);

													var $progressElem = $fmatreelist_content_base.find(current_settings.nodeName+'.'+current_settings.cssProgressClass);
													if($progressElem.length===0) $progressElem = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssProgressClass).appendTo($fmatreelist_content_base);
													$progressElem.text('Please wait...');

													$progressElem = $hpolist_content_base.find(current_settings.nodeName+'.'+current_settings.cssProgressClass);
													if($progressElem.length===0) $progressElem = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssProgressClass).appendTo($hpolist_content_base);
													$progressElem.text('Please wait...');



													setTimeout(function(){
														_pick(fma_id);
													},0);
													return false;
												});


											$fmatreelist_content_base.find(current_settings.nodeName+'.'+current_settings.cssProgressClass).remove();
											$hpolist_content_base.find(current_settings.nodeName+'.'+current_settings.cssProgressClass).remove();


											var height = $webgl_content_base.innerHeight();
											var fmatreelist_content_max_height = (height/2-20)-$fmatreelist_title.outerHeight(true);
											if(fmatreelist_content_max_height>0) $fmatreelist_content.css({'max-height':fmatreelist_content_max_height+'px'});
											var hpolist_content_max_height = height-$fmatreelist_content_base.outerHeight(true)-$hpolist_title.outerHeight(true)-20-3;
											if(hpolist_content_max_height>0) $hpolist_content.css({'max-height':hpolist_content_max_height+'px'});

										});
										var $td = $('<td>').text(disp_fma_id).appendTo($tr).css(td_left_css);
										var $td = $('<td>').text(fma_name).appendTo($tr).css(td_left_css);
										var $td = $('<td>').text(fma_ids[fma_id]['#HPO']).appendTo($tr).css(td_center_css);

										if(index===0){
											setTimeout(function(){
												$tr.click();
											},100);
										}

									});

									$fmatreelist_content_base.css({'visibility':'visible'});
									$hpolist_content_base.css({'visibility':'visible'});

								}
								_click_callback(false);
							};
							_pick(fma_ids);

						})
						.on('rotate', function(e,ren,value){
							if(value.H !== 0 || value.V !== 0){
							}
						})
						.on('zoom', function(e,ren,value){
							if(value !== 1){
							}
						})
						.on('load', function(e,ren,successful,loadedParams){
							var $progressElem = $webgl_content_base.find(current_settings.nodeName+'.'+current_settings.cssProgressClass);
							$progressElem.remove();

							if(isArray(loadedParams) && loadedParams.length){
								var loadedParamsHash = {};
								loadedParams.forEach(function(loadedParam){
									if(isObject(loadedParam) && isString(loadedParam[Ag.Def.OBJ_ID_DATA_FIELD_ID]) && loadedParam[Ag.Def.OBJ_ID_DATA_FIELD_ID].length){
										loadedParamsHash[loadedParam[Ag.Def.OBJ_ID_DATA_FIELD_ID]] = true;
									}
								});

								if(isObject(window.category2obj)){
									Object.keys(category2obj['category']).forEach(function(category){
										if(isObject(category2obj['category'][category])){
											Object.keys(category2obj['category'][category]).forEach(function(objid){
												if(isBoolean(loadedParamsHash[objid]) && loadedParamsHash[objid]) category2obj['category'][category][objid]['loaded'] = true;
											});
										}
									});
								}
							}

							if(successful){
								setTimeout(function(){
									var paths = [];

									$webgl_chechkbox_group.find('input[type=checkbox]:not(:checked)').each(function(){
										var $checkbox = $(this);
										if($checkbox/* && $checkbox.val()!='other'*/){
											var category = $checkbox.val();

											if(isObject(category2obj['category'][category])){
												Object.keys(category2obj['category'][category]).forEach(function(objid){
													if(category2obj['category'][category][objid]['loaded']) return;
													var params = {};
													params[Ag.Def.OBJ_ID_DATA_FIELD_ID] = objid;
													params[Ag.Def.CONCEPT_DATA_COLOR_DATA_FIELD_ID] = category2obj['category'][category][objid][Ag.Def.CONCEPT_DATA_COLOR_DATA_FIELD_ID];
													params[Ag.Def.OBJ_URL_DATA_FIELD_ID] = current_settings.obj_url+objid+current_settings.obj_ext;
													params[Ag.Def.CONCEPT_DATA_OPACITY_DATA_FIELD_ID] = 1;
													params[Ag.Def.CONCEPT_DATA_VISIBLE_DATA_FIELD_ID] = false;
													params[Ag.Def.USE_FOR_BOUNDING_BOX_FIELD_ID] = false;
													paths.push(params);
												});
											}
										}
									});
									if(paths.length) __threeBitsRenderer.loadObj(paths);
								},100);

								if(__isFirstThreeBitsRenderer && $webgl_content_base_table.is(':visible')){
//									console.log('__threeBitsRenderer.focus');
									__threeBitsRenderer.focus(__isFirstThreeBitsRenderer);
									__threeBitsRenderer._calcCameraPos();
									__threeBitsRenderer._render();
									__isFirstThreeBitsRenderer = false;
								}

							}

						})
						.on('progress', function(e,ren,message){
							var $progressElem = $webgl_content_base.find(current_settings.nodeName+'.'+current_settings.cssProgressClass);
							if($progressElem.length === 0){
								$progressElem = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssProgressClass).appendTo($webgl_content_base);
							}
							if(isString(message) && message.length){
								$progressElem.text(message);
								var innerHeight = $progressElem.innerHeight();
								if(innerHeight<16) innerHeight = 16;
								$progressElem.css({'line-height':innerHeight+'px'});
							}
							else{
								$progressElem.remove();
							}
						})
						;
						if(isObject(window.category2obj)){
							click_callback();
						}
					}




					var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).appendTo($tr);
					$td.css({'width':'35%'/*,'padding-left':'30px'*/});

					$table = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTableClass).appendTo($td);
					$table.css({'border-spacing':'0'});

					//FMA Tree List
					var $tr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTrClass).appendTo($table);
					var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).appendTo($tr);
					var $fmatreelist_content_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssBaseClass).addClass(current_settings.cssFMATreeListContentClass).appendTo($td);

					var $fmatreelist_title = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTopBarClass).attr({'data-language-key':'fmatreelisttitle'}).text(language['fmatreelisttitle']).appendTo($fmatreelist_content_base);
					$fmatreelist_title.css({'text-align':'left','padding-left':'0.5em','min-height':'27px'});

					var $fmatreelist_content = $('<'+current_settings.nodeName+'>').css({'min-height':'27px'}).addClass(current_settings.cssContentClass).appendTo($fmatreelist_content_base);
					var $fmatreelist_content_table = $('<table>').appendTo($fmatreelist_content);


					//FMA List
					var $tr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTrClass).appendTo($table);
					var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).appendTo($tr);
//					if($fmatreelist_content_base.is(':visible')) $td.css({'padding-top':'20px'});
					var $fmalist_content_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssBaseClass).addClass(current_settings.cssFMAListContentClass).appendTo($td);
					if($fmatreelist_content_base.is(':visible')) $fmalist_content_base.css({'margin-top':'20px'});
					$fmalist_content_base.hide();

					var $fmalist_title = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTopBarClass).attr({'data-language-key':'fmalisttitle'}).text(language['fmalisttitle']).appendTo($fmalist_content_base);
					$fmalist_title.css({'text-align':'left','padding-left':'0.5em'});
					var $fmalist_content = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentClass).appendTo($fmalist_content_base);

					var $fmalist_content_table = $('<table>').appendTo($fmalist_content);
					var $tr = $('<tr>').appendTo($fmalist_content_table);
					var $th = $('<th>').text(language['fmaid']).appendTo($tr);
					var $th = $('<th>').text(language['fmaname']).appendTo($tr);
					var $th = $('<th>').text(language['#ofphenotypes']).appendTo($tr);


					//HPO List
					var $tr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTrClass).appendTo($table);
					var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).appendTo($tr);
//					if($fmalist_content_base.is(':visible') || $fmatreelist_content_base.is(':visible')) $td.css({'padding-top':'20px'});

					var $hpolist_content_base = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssBaseClass).addClass(current_settings.cssHPOListContentClass).appendTo($td);
					if($fmalist_content_base.is(':visible') || $fmatreelist_content_base.is(':visible') || true) $hpolist_content_base.css({'margin-top':'20px'});

					var $hpolist_title = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTopBarClass).appendTo($hpolist_content_base);
					$hpolist_title.css({'text-align':'left','padding-left':'0.5em','min-height':'27px'});
					var $hpolist_content = $('<'+current_settings.nodeName+'>').css({'min-height':'27px'}).addClass(current_settings.cssContentClass).appendTo($hpolist_content_base);

					var $hpolist_content_table = $('<table>').appendTo($hpolist_content);

					$(window).resize(function(){

						try{
							var margin_top = Math.round($(window).innerHeight()*0.05);//0.0945;
							if(margin_top<0) margin_top = 0;
							$(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssTokenInputContentBaseClass).css({'margin-top': margin_top+'px'});

							if($webgl_content_base_table.is(':visible') && $webgl_content.innerWidth()>0){

								var webgl_content_height = $(window).innerHeight() - $webgl_content_base_table.offset().top - 120;
								if(webgl_content_height<100) webgl_content_height = 100;
								$webgl_content.css({'height': webgl_content_height });

								if(window.__threeBitsRenderer){
									__webglResizeTimeoutID = null;

									__threeBitsRenderer._setSize($webgl_content.innerWidth(),$webgl_content.innerHeight());

									if(__isFirstThreeBitsRenderer && !__threeBitsRenderer.isLoadingObj() && $webgl_content_base_table.is(':visible')){
										__threeBitsRenderer.focus(__isFirstThreeBitsRenderer);
										__threeBitsRenderer._calcCameraPos();
										__isFirstThreeBitsRenderer = false;
									}
									__threeBitsRenderer._render();
								}

								var height = $webgl_content_base.innerHeight();
								var fmatreelist_content_max_height = (height/2-20)-$fmatreelist_title.outerHeight(true);
								if(fmatreelist_content_max_height>0) $fmatreelist_content.css({'max-height':fmatreelist_content_max_height+'px'});
								var hpolist_content_max_height = height-$fmatreelist_content_base.outerHeight(true)-$hpolist_title.outerHeight(true)-20-3;
								if(hpolist_content_max_height>0) $hpolist_content.css({'max-height':hpolist_content_max_height+'px'});

							}
						}catch(e){
							console.error(e);
						}
					});
					$webgl_content_base_table.hide();

					$fmatreelist_content_base.css({'visibility':'hidden'});
					$hpolist_content_base.css({'visibility':'hidden'});
				}

				getTokenInputElement()
				.on('add.tokenInput2',function(){
					if($webgl_content_base_table.is(':visible')){
						setTimeout(function(){
							$(window).resize();
						},0);
					}
				})
				.on('delete.tokenInput2',function(){
					if($webgl_content_base_table.is(':visible')){
						setTimeout(function(){
							$(window).resize();
						},0);
					}
				});
			}
			else{
				$('tr.'+current_settings.cssFMAListContentSelectClass).triggerHandler('click');
			}

			/////////////////////////////////////////////////////////////////////////
			// token inputのリスト用のdivを移動
			/////////////////////////////////////////////////////////////////////////
			var $tokeninput_dropdown = getInlineContent().next('div.'+tokeninput_classes['dropdown']);
			if($tokeninput_dropdown.length) $tokeninput_dropdown.appendTo($inlineContentBase);


			if($(current_settings.nodeName+'.'+current_settings.cssInlineContentClass+'>'+ current_settings.nodeName + '.'+current_settings.cssInlineContentBaseClass).length){
				openMagnificPopup({
					items: {src:   current_settings.nodeName+'.'+current_settings.cssInlineContentClass+'>'+ current_settings.nodeName + '.'+current_settings.cssInlineContentBaseClass },
					type: 'inline',
					alignTop: false,
					showCloseBtn: false
				});
			}
			else{
				getContentBaseElement().show();
				getLoadingElement().hide();

				$(document.body).off('keydown', eventKeydown);
				if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
					$(document.body).off('click', eventClick);
				}

				var timeoutID;
				var func = function(){
					if(timeoutID){
						clearTimeout(timeoutID);
						timeoutID = null;
					}
					var $a;
					if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
						$a = mfp_popup.get_mfp_popup_content_wrapper().find(current_settings.nodeName+'.'+current_settings.cssSelfContentClass+' a.'+current_settings.cssLinkClass);
					}else{
						$a = $.magnificPopup.instance.contentContainer ? $.magnificPopup.instance.contentContainer.find(current_settings.nodeName+'.'+current_settings.cssSelfContentClass+' a.'+current_settings.cssLinkClass) : $();
					}
					if($a.length){
						$a.addClass(current_settings.cssLinkFocusClass);
						$a.get(0).focus();
						setTimeout(function(){ $a.get(0).focus(); },10); //←追加行
						$(document.body).on('keydown', eventKeydown);
						if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
							$(document.body).on('click', eventClick);
						}
					}
					else{
						timeoutID = setTimeout(func,100);
					}
				};
				func();

				//$(window).resize();

			}

			if(current_settings.use_webgl && current_settings.active_webgl){
				current_settings.active_webgl = false;

				$inlineContent.find(current_settings.nodeName+'.'+current_settings.cssWebGLSwitchContentClass).click();

//				if(isBoolean(current_settings.__active_webgl)) return;
//				current_settings.__active_webgl = true;

				var $domElement = $(__threeBitsRenderer.domElement());

				var initLoad = function(e,ren,successful,loadedParams){
					__threeBitsRenderer.focus(true);
					__threeBitsRenderer._calcCameraPos();
					__isFirstThreeBitsRenderer = false;
				};

				var initProgress = function(e,ren,message, currentNum, totalNum){
					if(!isNumeric(currentNum) || !isNumeric(totalNum)) return;
					if(currentNum !== totalNum) return;
					$domElement.off('progress', initProgress);
					$domElement.one('load', initLoad);
				};
				$domElement.on('progress', initProgress);
				__threeBitsRenderer.fireEvent('progress',__threeBitsRenderer,'Please wait...');
			}

		} // end of showResults

		function eventClick(e){
			let $target = $(e.target);
			if( !$target.hasClass('token-input-li')){
				$('li').removeClass(tokeninput_classes['selectedToken']);
				$('li').removeClass(tokeninput_classes['highlightedToken']); 
				$('li').removeClass('selected_at_popup');
				setTimeout(function(){
					if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup) {
						closeMagnificPopup_mfp_popup();
					}else{
						closeMagnificPopup();
					}
				},51);
				return false; 
			} 
		}

		function eventKeydown(e){
			//37←, 39→, 38↑, 40↓, 13:enter,
			var $a;
			if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen ) {
				if(mfp_popup){
					let $content_wrapper = mfp_popup.get_mfp_popup_content_wrapper();
					$a = $content_wrapper.find('td a.'+current_settings[SCHEMA_2022].cssLinkClass+'.'+current_settings.cssLinkFocusClass);
				}else{
					$a = $();
				}
			}else{
				$a = $.magnificPopup.instance.contentContainer ? $.magnificPopup.instance.contentContainer.find(current_settings.nodeName+'.'+current_settings.cssTdClass+' a.'+current_settings.cssLinkClass+'.'+current_settings.cssLinkFocusClass) : $();
			}
			if($a.length){
				if(e.which === 13){
					$a.get(0).click();
				}
				else if(e.which === 27){
					$('li').removeClass(tokeninput_classes['selectedToken']);
					$('li').removeClass(tokeninput_classes['highlightedToken']);
					$('li').removeClass('selected_at_popup');
	                setTimeout(function(){
						if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup) {
							closeMagnificPopup_mfp_popup();
						}else{
							closeMagnificPopup();
						}
					},51);
	                return false;
				}
				else if(e.which === 38){
					var expr = current_settings.nodeName+'.'+current_settings.cssLinkBaseClass;
					if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen ) {
						expr = 'tr.'+current_settings[SCHEMA_2022].cssContentRowClass;
					}
					var $prev_a = $a.parents(expr).prev(expr).find('a.'+current_settings.cssLinkClass);
					if($prev_a.length){
						$a.removeClass(current_settings.cssLinkFocusClass);
						$prev_a.eq(0).addClass(current_settings.cssLinkFocusClass).get(0).focus();
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}
				else if(e.which === 40){
					var expr = current_settings.nodeName+'.'+current_settings.cssLinkBaseClass;
					if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen ) {
						expr = 'tr.'+current_settings[SCHEMA_2022].cssContentRowClass;
					}
					var $next_a = $a.parents(expr).next(expr).find('a.'+current_settings.cssLinkClass);
					if($next_a.length){
						$a.removeClass(current_settings.cssLinkFocusClass);
						$next_a.eq(0).addClass(current_settings.cssLinkFocusClass).get(0).focus();
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}
				else if(e.which === 37){
					var expr = current_settings.nodeName+'.'+current_settings.cssTdClass;
					var $prev_a = $a.closest(expr).prev(expr).find('a.'+current_settings.cssLinkClass);
					if($prev_a.length){
						$a.removeClass(current_settings.cssLinkFocusClass);
						$prev_a.eq(0).addClass(current_settings.cssLinkFocusClass).get(0).focus();
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}
				else if(e.which === 39){
					var expr = current_settings.nodeName+'.'+current_settings.cssTdClass;
					var $next_a = $a.closest(expr).next(expr).find('a.'+current_settings.cssLinkClass);
					if($next_a.length){
						$a.removeClass(current_settings.cssLinkFocusClass);
						$next_a.eq(0).addClass(current_settings.cssLinkFocusClass).get(0).focus();
						e.stopPropagation();
						e.preventDefault();
						return false;
					}
				}
			}
		}

		function closeMagnificPopup_mfp_popup(){
			$(document.body).off('keydown', eventKeydown);
			$(document.body).off('click', eventClick);
			mfp_popup.closeMagnificPopup();
		}

		function openMagnificPopup_mfp_popup(params){
			closeMagnificPopup_mfp_popup();
			mfp_popup.openMagnificPopup(params);
			$(document.body).on('keydown', eventKeydown);
			$(document.body).on('click', eventClick);
		}

		function closeMagnificPopup(){
			var magnificPopup = $.magnificPopup.instance;

			var needtorestorescrollpos = false;
			if(magnificPopup.contentContainer && $('.mfp-wrap')) {
				let $inlineContentBase = $.magnificPopup.instance.contentContainer.find('div.popup-hierarchy-hpo-inline-content-base');
				if($inlineContentBase && $inlineContentBase.is(":visible")) needtorestorescrollpos = true;
			}

			if(magnificPopup && isFunction(magnificPopup.close)){

				if(window.__threeBitsRenderer){
					var $domElement = $(__threeBitsRenderer.domElement());
					$domElement.off('pick').off('rotate').off('zoom').off('load').off('progress');
					if($domElement.parent().get(0) !== document.body){
						$domElement.appendTo(document.body);
						$domElement.hide();
					}
					else{
					}
				}

				magnificPopup.close();
			}

			if(isFunction(current_settings.after_modal_close)){
				current_settings.after_modal_close();
			}

			if(needtorestorescrollpos) {
				setTimeout(function(){
					document.documentElement.scrollTop = document.body.scrollTop = window_y_offset;
				},1);
			}
		}
		var timeoutID = null;
		function openMagnificPopup(params){
			closeMagnificPopup();

			if(timeoutID){
				clearTimeout(timeoutID);
				timeoutID = null;
			}

			params = $.extend(true, {}, params, {
				enableEscapeKey: false,
				closeOnBgClick: false,
				callbacks: {
					beforeOpen: function() {
					},
					elementParse: function(item) {
					},
					change: function() {
					},
					resize: function() {
					},
					open: function() {
						if(getLoadingElement().is(':visible')){
							return;
						}

						var func = function(){
							if(timeoutID){
								clearTimeout(timeoutID);
								timeoutID = null;
							}
							var $a = $.magnificPopup.instance.contentContainer ? $.magnificPopup.instance.contentContainer.find(current_settings.nodeName+'.'+current_settings.cssSelfContentClass+' a.'+current_settings.cssLinkClass) : $();
							if($a.length){
								$a.addClass(current_settings.cssLinkFocusClass);
								$a.get(0).focus();
								$(document.body).on('keydown', eventKeydown);
								if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
									$(document.body).on('click', eventClick);
								}
							}
							else{
								timeoutID = setTimeout(func,100);
							}
						};
						func();

					},
					beforeClose: function() {
					},
					close: function() {
						$(document.body).off('keydown', eventKeydown);
						if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen){
							$(document.body).off('click', eventClick);
						}
					},
					afterClose: function() {
					},
					updateStatus: function(data) {
					}
				}
			});
			$.magnificPopup.open(params);
		}

		function getLoadingElement() {
			if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup){
				let $content_wrapper = mfp_popup.get_mfp_popup_content_wrapper();
				return $content_wrapper.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssLoadingClass);
			}else{
				return $.magnificPopup.instance.contentContainer ? $.magnificPopup.instance.contentContainer.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssLoadingClass) : $();
			}
		}

		var window_y_offset = 0;
		function showLoading() {
			if($.magnificPopup.instance.contentContainer && $('.mfp-wrap')) {
				let $inlineContentBase = $.magnificPopup.instance.contentContainer.find('div.popup-hierarchy-hpo-inline-content-base');
				if($inlineContentBase && $inlineContentBase.is(":visible") === false){ 
					window_y_offset = window.pageYOffset;
				}
			}else{
				window_y_offset = window.pageYOffset;
			}

			var $loadingElement = getLoadingElement();
			if($loadingElement.length){
				$loadingElement.show();
				getContentBaseElement().hide();
			}
			else{
				var $inlineContent = emptyInlineContent();

				var $table = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTableClass).addClass(current_settings.cssLoadingClass).appendTo($inlineContent);
				var $tr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTrClass).appendTo($table);
				var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).css({'vertical-align':'middle'}).appendTo($tr);
				$td.text(current_settings.loadingText);

				var obj = {
					items: {src:   current_settings.nodeName+'.'+current_settings.cssInlineContentClass+'>'+ current_settings.nodeName + '.' + current_settings.cssLoadingClass},
					type: 'inline',
					modal: false
				};
				
				if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup){
					//$td.css({'background':'#0b0b0b', 'opacity':'0.8','color':'#ffffff'});
					openMagnificPopup_mfp_popup(obj);
					return;
				}

				openMagnificPopup(obj);
			}

/*
			if(isFunction(current_settings.modify_modal_on_show)){
				let isFullScreen = false;
				if(current_settings.use_webgl || current_settings.is_hierarchy_fullscreen){
					isFullScreen = true;
				}
				current_settings.modify_modal_on_show(isFullScreen);
			}
*/			
		}

		function showLoadingFullScreen() {
			var $loadingElement = getLoadingElement();
			if($loadingElement.length){
				$loadingElement.show();
				getContentBaseElement().hide();
			}
			else{
				var $inlineContent = emptyInlineContent();

				var $table = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTableClass).addClass(current_settings.cssLoadingClass).appendTo($inlineContent);
				var $tr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTrClass).appendTo($table);
				var $td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssTdClass).css({'vertical-align':'middle'}).appendTo($tr);
				$td.text(current_settings.loadingText);

				openMagnificPopup({
					items: {src:   current_settings.nodeName+'.'+current_settings.cssInlineContentClass+'>'+ current_settings.nodeName + '.' + current_settings.cssLoadingClass},
					type: 'inline',
					modal: false
				});
			}

			//if(isFunction(current_settings.modify_modal_on_show)){
			//	current_settings.modify_modal_on_show(true);
			//}
		}


		var windowNavigatorLanguage = (window.navigator.languages && window.navigator.languages[0]) ||
				window.navigator.language ||
				window.navigator.userLanguage ||
				window.navigator.browserLanguage;
		function isWindowNavigatorLanguageJa(){
			//return windowNavigatorLanguage === "ja" || windowNavigatorLanguage.toLowerCase() === "ja-jp";
			return current_settings.language_in === LANGUAGE_JA;
		}
		var runSearchOptions = {hasJA:isWindowNavigatorLanguageJa()};
		function runSearch(query,options) {

			loadAllObj();

			if(isObject(options) && isObject(runSearchOptions)){
				if(options.tokenInputItems && runSearchOptions.tokenInputItems) delete runSearchOptions.tokenInputItems;
				if(options.tokenInputItemNodes && runSearchOptions.tokenInputItemNodes) delete runSearchOptions.tokenInputItemNodes;
			}
			if(isObject(options)){
				if(isString(options['lang'])){
					options['hasJA'] = (options['lang'].toLowerCase()==='ja' || options['lang'].toLowerCase()==='jpn') ? true : false;
					delete options['lang'];
				}
			}
			runSearchOptions = $.extend(true, {}, runSearchOptions, options || {});

			if(isString(query) && query.length){
				runSearchOptions.lastQuery = query;
			}
			else if(isString(runSearchOptions.lastQuery) && runSearchOptions.lastQuery.length){
				query = runSearchOptions.lastQuery;
			}
			else{
				query = '';
			}

			var $inlineContentBase = getContentBaseElement();
			if($inlineContentBase.length){
				$inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssClassContentBaseClass).show();
				$inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssTableClass+'.'+current_settings.cssWebGLContentBaseClass).hide();
				$inlineContentBase.find(current_settings.nodeName+'.'+current_settings.cssWebGLSwitchContentClass).show();
			}

			showLoading();

			var url = computeURL();

			var cache_key = query + url;
			var cached_results = cache.get(cache_key);
			cached_results = null;
			if(cached_results){
				showResults(cached_results);
				if(isFunction(runSearchOptions.callback)){
					runSearchOptions.callback.call(this, true);
				}
			}
			else{
				if(current_settings.url) {
					var ajax_params = {};
					ajax_params.data = {};
					if(url.indexOf("?") > -1) {
						var parts = url.split("?");
						ajax_params.url = parts[0];

						var param_array = parts[1].split("&");
						$.each(param_array, function (index, value) {
							var kv = value.split("=");
							ajax_params.data[kv[0]] = kv[1];
						});
					} else {
						ajax_params.url = url;
					}

					ajax_params.data[current_settings.queryParam] = query;
					ajax_params.type = current_settings.method;
					ajax_params.dataType = current_settings.contentType;
					if (current_settings.crossDomain) {
						ajax_params.dataType = "jsonp";
					}

					ajax_params.success = function(results) {
						cache.add(cache_key, current_settings.jsonContainer ? results[current_settings.jsonContainer] : results);

						showResults(current_settings.jsonContainer ? results[current_settings.jsonContainer] : results);
						if(isFunction(runSearchOptions.callback)){
							runSearchOptions.callback.call(this, true);
						}
					};

					ajax_params.error = function(XMLHttpRequest, textStatus, errorThrown) {
						console.warn(textStatus, errorThrown);
						if(isFunction(runSearchOptions.callback)){
							runSearchOptions.callback.call(this, false);
						}
					};

					if(isFunction(settings.onSend)){
						settings.onSend(ajax_params);
					}

					$.ajax(ajax_params);
				} else if(current_settings.local_data) {
					var results = $.grep(current_settings.local_data, function (row) {
						return row[current_settings.propertyToSearch].toLowerCase().indexOf(query.toLowerCase()) > -1;
					});

					cache.add(cache_key, results);

					showResults(results);
					if(isFunction(runSearchOptions.callback)){
						runSearchOptions.callback.call(this, true);
					}
				}
			}
		}

		if (isString(url_or_data_or_function) || isFunction(url_or_data_or_function)) {
			current_settings.url = url_or_data_or_function;
			var url = computeURL();
			if (isEmpty(current_settings.crossDomain) && isString(url)) {
				if(url.indexOf("://") === -1) {
					current_settings.crossDomain = false;
				} else {
					current_settings.crossDomain = (location.href.split(/\/+/g)[1] !== url.split(/\/+/g)[1]);
				}
			}
		} else if (isObject(url_or_data_or_function)) {
			current_settings.local_data = url_or_data_or_function;
		}

		var tokeninput_target = null;
		var tokeninput_array = null;
		var tokeninput_target_results = null;

		var tokeninput_selector = null;

		if(isObject(tokeninput_settings) && tokeninput_settings.classes) {
			if(isObject(tokeninput_classes) && isString(tokeninput_classes['tokenList']) && isString(tokeninput_classes['token'])){
				tokeninput_selector = 'ul.'+tokeninput_classes['tokenList'].split(/\s+/).join('.')+'>li.'+tokeninput_classes['token'];//+'>p';
				$(document).on('click', tokeninput_selector, function(e){
					e.stopPropagation();
					e.preventDefault();

					var click_text = '';
					var $li_node;
					if($(this).get(0).nodeName.toLowerCase()==='li'){
						$li_node = $(this);
						click_text = $li_node.data(TOKENINPUT_ITEM_SETTINGS_KEY).name;
					}
					else if($(this).get(0).nodeName.toLowerCase()==='p'){
						$li_node = $(this).parent('li');
						click_text = $li_node.data(TOKENINPUT_ITEM_SETTINGS_KEY).name;
					}
					else if($(this).get(0).nodeName.toLowerCase()==='span'){
						$li_node = $(this).parent('li');
						click_text = $li_node.data(TOKENINPUT_ITEM_SETTINGS_KEY).name;
					}

					var tokenInputItems;
					var tokenInputItemNodes;
					var tokenInputItem;
					var options = {};

					if($li_node){
						if($li_node.hasClass(current_settings.cssTokenClass)){
							tokenInputItems = getTokenInputItems();
							tokenInputItemNodes = getTokenInputItemNodes();
							//tokenInputItem = getTokenInputItemFromName(click_text);
                            $li_node.addClass('temporary_label');
                            let idx = tokenInputItemNodes.findIndex(obj => {return $(obj).hasClass('temporary_label');});
                            $li_node.removeClass('temporary_label');
                            tokenInputItem = tokenInputItems[idx];
						}
						else{
							current_settings = $.extend(true,{}, current_settings, {use_webgl: DEFAULT_SETTINGS.use_webgl});
							$(input).data(SETTINGS_KEY, current_settings);

							tokenInputItems = getOriginalTokenInputItems();
							tokenInputItemNodes = getOriginalTokenInputItemNodes();
							$li_node.addClass('temporary_label');
							let idx = tokenInputItemNodes.findIndex(obj => {return $(obj).hasClass('temporary_label');});
							$li_node.removeClass('temporary_label');
							//tokenInputItem = getOriginalTokenInputItemFromName(click_text);
							tokenInputItem = tokenInputItems[idx];
						}
						if(tokenInputItem){
							options.hasJA = hasJA(tokenInputItem.name);
							$(tokenInputItemNodes).removeClass(tokeninput_classes['selectedToken']);
							$li_node.addClass(tokeninput_classes['selectedToken']);
						}
					}

					if(!current_settings.use_webgl && !current_settings.is_hierarchy_fullscreen && mfp_popup){
						//if(!$.magnificPopup.instance.contentContainer){
						if(!mfp_popup.is_mfp_popup_shown()){
							$(tokenInputItemNodes).removeClass('selected_at_popup');
							$li_node.addClass('selected_at_popup');
							$(tokenInputItemNodes).removeClass(tokeninput_classes['selectedToken']);
							$li_node.addClass(tokeninput_classes['selectedToken']);
						}else{
							if($li_node.hasClass('selected_at_popup')){
								$li_node.removeClass('selected_at_popup');
								$(tokenInputItemNodes).removeClass(tokeninput_classes['selectedToken']);
								$(tokenInputItemNodes).removeClass(tokeninput_classes['highlightedToken']);
								setTimeout(function(){closeMagnificPopup_mfp_popup();	},51);
								return false;
							}else{
								$(tokenInputItemNodes).removeClass('selected_at_popup');
								$li_node.addClass('selected_at_popup');
								$(tokenInputItemNodes).removeClass(tokeninput_classes['selectedToken']);
								$li_node.addClass(tokeninput_classes['selectedToken']);
							}
						}
					}

					if(tokenInputItem){
						tokeninput_target = null;
						tokeninput_target_results = null;
						if(tokenInputItems) options.tokenInputItems = tokenInputItems;
						if(tokenInputItemNodes) options.tokenInputItemNodes = tokenInputItemNodes;
						runSearch(tokenInputItem.id,options);
					}
					else{
					}
					return false;
				});
			}
		}

		var fma2obj = {};
		var execLoadAllObjFlag = false;
		function loadAllObj(){

			if(execLoadAllObjFlag) return;
			execLoadAllObjFlag=true;

			if(!current_settings.use_webgl) return;

			if(isObject(window.category2obj)){
				var paths = [];
				current_settings.use_segments.forEach(function(category){
					if(isObject(category2obj['category'][category])){
						Object.keys(category2obj['category'][category]).forEach(function(objid){
							var params = {};
							params[Ag.Def.OBJ_ID_DATA_FIELD_ID] = objid;
							params[Ag.Def.CONCEPT_DATA_COLOR_DATA_FIELD_ID] = category2obj['category'][category][objid][Ag.Def.CONCEPT_DATA_COLOR_DATA_FIELD_ID];
							params[Ag.Def.OBJ_URL_DATA_FIELD_ID] = current_settings.obj_url+objid+current_settings.obj_ext;
							params[Ag.Def.CONCEPT_DATA_OPACITY_DATA_FIELD_ID] = 1;
							params[Ag.Def.CONCEPT_DATA_VISIBLE_DATA_FIELD_ID] = false;
							params[Ag.Def.USE_FOR_BOUNDING_BOX_FIELD_ID] = false;
							paths.push(params);

							Object.keys(category2obj['category'][category][objid]['FMA']).forEach(function(fma_id){
								fma2obj[fma_id] = fma2obj[fma_id] || {};
								fma2obj[fma_id][objid] = category;//category2obj['category'][category][objid];
							});

						});
					}
				});

				if(paths.length){

					if(window.threeBitsRenderer){
						if(!window.__threeBitsRenderer){
							window.__threeBitsRenderer = new threeBitsRenderer({
								width:108,
								height:108,
								rate:1,
								minZoom: 1,
								maxZoom: 23,
								backgroundColor: '#FFFFFF'
							});
							var $domElement = $(__threeBitsRenderer.domElement());
							$domElement.appendTo(document.body);
							$domElement.hide();
						}
						__threeBitsRenderer.loadObj(paths);
					}
					else{
					}
				}
			}
		}

		$.PopupRelationHPO = function(query, options, settings){
			if($.isPlainObject(settings)){
				current_settings = $.extend(true,{}, current_settings, settings || {});
				$(input).data(SETTINGS_KEY, current_settings);
			}

			var tokenInputItems = getOriginalTokenInputItems();
			var tokenInputItemNodes = getOriginalTokenInputItemNodes();

			options = options || {};
			if(isEmpty(options['lang'])) options['lang'] = isWindowNavigatorLanguageJa() ? 'ja' : 'en';

			var o = $.extend(true, {}, options || {});
			if(tokenInputItems) o.tokenInputItems = tokenInputItems;
			if(tokenInputItemNodes) o.tokenInputItemNodes = tokenInputItemNodes;

			if(isEmpty(query)) query = current_settings.defaultTokenId;// 'HP:0000118';

			runSearch(query,o);
		};

		var category2obj_jqxhr;

		$.PopupRelationHPOWithWebGL = function(query, options, settings){

			if(mfp_popup) mfp_popup.closeMagnificPopup();

			if($.magnificPopup.instance.contentContainer){
				var bk = window_y_offset;
				closeMagnificPopup();
				setTimeout(function(){ window_y_offset = bk; }, 50);
			}

			showLoadingFullScreen();

			if(!isObject(window.category2obj)){

				if(category2obj_jqxhr){
					category2obj_jqxhr.abort();
					category2obj_jqxhr = null;
				}

				category2obj_jqxhr = $.ajax({
					url: '/static/js/three-bits/category2obj.json',
					cache: true,
					crossDomain: false,
					dataType: 'json'
				}).done(function(data, textStatus, jqXHR){
					window.category2obj = data;
					setTimeout(function(){ $.PopupRelationHPOWithWebGL(query, options, settings); }, 0);
				}).fail(function(jqXHR, textStatus, errorThrown){
					console.error(jqXHR, textStatus, errorThrown);
				}).always(function(){
					category2obj_jqxhr = null;
				});
				return;
			}


			$.PopupRelationHPO(query, options, $.extend(true,{}, settings || {},{use_webgl:true,active_webgl:true}));
		};


		$.PopupRelationHPOTokenTooltip = function(){
			if(!current_settings.use_tooltip) return;

			if(isString(tokeninput_selector) && tokeninput_selector.length){
				$(tokeninput_selector).each(function(){
					var $li_node = $(this);
					var data = $li_node.data(TOKENINPUT_ITEM_SETTINGS_KEY);
					if(isObject(data) && isString(data.id) && isString(data.name)){
//						console.log(data);
						var title;
						if(current_settings.tooltip_type === 'fixed'){
							title = current_settings.language[getCurrentLanguage()]['tooltip_title'];
							$li_node.attr({'data-language-tooltip-key':'tooltip_title'});
						}
						else{
							title = data.name;
							$li_node.attr({'data-language-tooltip-key':data.name});
						}
						$li_node
						.attr({'data-toggle':'tooltip', 'data-original-title': title});
					}
				});
				try{
					$(tokeninput_selector+'[data-toggle="tooltip"]').tooltip();
				}catch(e){
					console.error(e);
				}
			}
		};

		if((current_settings.use_tooltip || current_settings.use_annotation_score) && isObject(tokeninput_settings)) {
			var orgOnAdd = tokeninput_settings.onAdd;
			var orgOnDelete = tokeninput_settings.onDelete;
			var orgOnSelectDropdownItem = tokeninput_settings.onSelectDropdownItem;
			var orgOnShowDropdownItem = tokeninput_settings.onShowDropdownItem;
			var orgOnHideDropdownItem = tokeninput_settings.onHideDropdownItem;

			var annotationScore_jqxhr;
			var annotationScoreTimeoutID;
			var annotationScoreCallback = function(){
				if(annotationScoreTimeoutID) clearTimeout(annotationScoreTimeoutID);

				var Rate = $('.rater').data('rate');

//		current_settings.annotation_score_url
				var orgTokenInputItems = getOriginalTokenInputItems();
				if(isArray(orgTokenInputItems) && orgTokenInputItems.length){
//					console.log($.map(orgTokenInputItems, function(item){ return item.id; }));
//					var items = $.map(orgTokenInputItems, function(item){ return item.id; });
//					console.log(items);

					if(annotationScore_jqxhr){
						annotationScore_jqxhr.abort();
						annotationScore_jqxhr = null;
					}

					$('#match_rate').text('Match rate calculating...');
//					$('.starrr').data('starrr').setRating(0);

					if(Rate) Rate.setValue(0);


					annotationScore_jqxhr = $.ajax({
						url: current_settings.annotation_score_url,
						cache: true,
						data: {id: $.map(orgTokenInputItems, function(item){ return item.id.replace(/_ja$/g,''); })},
						traditional: true,
						crossDomain: true,
						dataType: 'json'
					}).done(function(data, textStatus, jqXHR){
//						console.log('done',data, textStatus, jqXHR);
						if(isObject(data) && isNumeric(data.scaled_score)){
//							console.log('done', Math.round(data.scaled_score*100)+'%');
							$('#match_rate').text('Match rate '+Math.round(data.scaled_score*100)+'%');

//							console.log('done', Math.round(data.scaled_score*5));
//							$('.starrr').data('starrr').setRating(Math.round(data.scaled_score*5));
							if(Rate) Rate.setValue(Math.round(data.scaled_score*5*10)/10);

						}
					}).fail(function(jqXHR, textStatus, errorThrown){
//						console.log('fail',jqXHR, textStatus, errorThrown);
							$('#match_rate').text('Match rate -%');
					}).always(function(){
//						console.log('always');
						annotationScore_jqxhr = null;
					});

				}
				else{
					$('#match_rate').text('Match rate 0%');
//					$('.starrr').data('starrr').setRating(0);
					if(Rate) Rate.setValue(0);
				}


			};

			tokeninput_settings.onAdd = function(token){
				if(current_settings.use_annotation_score){
					if(annotationScoreTimeoutID) clearTimeout(annotationScoreTimeoutID);
					annotationScoreTimeoutID = setTimeout(annotationScoreCallback, 250);
				}
				if(current_settings.use_tooltip){
					$.PopupRelationHPOTokenTooltip();
				}
				if($.isFunction(orgOnAdd)) orgOnAdd.call($(input),token);
			};

			tokeninput_settings.onDelete = function(token){
				if(current_settings.use_annotation_score){
					if(annotationScoreTimeoutID) clearTimeout(annotationScoreTimeoutID);
					annotationScoreTimeoutID = setTimeout(annotationScoreCallback, 250);
				}
				if(current_settings.use_tooltip){
					//tooltipのノードが残る為、強制的削除する
					var title;
					if(current_settings.tooltip_type === 'fixed'){
						title = current_settings.language[getCurrentLanguage()]['tooltip_title'];
					}
					else{
						title = token.name;
					}
					var tooltip_selector = 'ul.'+tokeninput_classes['tokenList'].split(/\s+/).join('.')+'>div.tooltip';
					$(tooltip_selector).each(function(){
						if($(this).text()===title) $(this).remove();
					});
				}
				if($.isFunction(orgOnDelete)) orgOnDelete.call($(input),token);
			};

//			tokeninput_settings.onSelectDropdownItem = function(token_data){
//				$.PopupRelationHPOResultsTooltip(this,token_data);
//				if($.isFunction(orgOnSelectDropdownItem)) orgOnSelectDropdownItem.call($(input),token_data);
//			};

			tokeninput_settings.onShowDropdownItem = function(count,isSimilar){
				let node = this;
				let $count_node = $('<div>').addClass(current_settings.cssNumberOfHitsClass);
				
				let node_content = '<b>' + current_settings.language[current_settings.language_in]['number_of_hits'].replace('__NUMBER__', count) + '</b>';
				if(isSimilar){
					node_content = '<b>' + current_settings.language[current_settings.language_in]['number_of_hits'].replace('__NUMBER__', '0') + '</b>';
					node_content = node_content +
								   '<font color=\"#f8516d\">' + 
								     current_settings.language[current_settings.language_in]['similar_candidate'] + 
								   '</font>';
				}
				$count_node.append(node_content);

				if(node.get(0).firstElementChild){
					var $firstElementChild = $(node.get(0).firstElementChild);
					$count_node.insertBefore($firstElementChild);
					if(count===0) $firstElementChild.remove();
				}
				else{
					$count_node.appendTo(node);
				}
				if($.isFunction(orgOnShowDropdownItem)) orgOnShowDropdownItem.call($(input),count,false);
			};

			tokeninput_settings.onHideDropdownItem = function(){
				$.PopupRelationHPOResultsTooltip();
				if($.isFunction(orgOnHideDropdownItem)) orgOnHideDropdownItem.call($(input));
			};

			$(input).data(TOKENINPUT_SETTINGS_KEY, tokeninput_settings);
		}


		var resultsTooltip_timeoutID;
		var resultsTooltip_jqxhr;

		var $resultsTooltip = $('<'+current_settings.nodeName+'>')
			.addClass(current_settings.cssResultsTooltipClass)
			.appendTo('body')
			.hide();

		var hideResultsTooltip = function(){
//			console.log('hideResultsTooltip');
			if(resultsTooltip_jqxhr){
				resultsTooltip_jqxhr.abort();
				resultsTooltip_jqxhr = null;
			}
			if(resultsTooltip_timeoutID){
				clearTimeout(resultsTooltip_timeoutID);
				resultsTooltip_timeoutID = null;
			}
			$resultsTooltip
				.hide()
				.empty();
		};

//		$(document).on('scroll', function(e){
//			hideResultsTooltip();
//		});

		var showResultsTooltip = function(token_data,node,results){
//			console.log('showResultsTooltip',node,results);
//			console.log($(node).offset(),$(node).position());

			if(isObject(results) && isArray(results.selfclass) && results.selfclass.length){
				var selfclass = results.selfclass[0];

				$resultsTooltip.empty();

				var $resultsTooltipTitle = $('<'+current_settings.nodeName+'>')
					.addClass(current_settings.cssResultsTooltipTitleClass)
					.html(selfclass.id+'&nbsp;'+selfclass.name)
					.appendTo($resultsTooltip);

				var $resultsTooltipContent = $('<'+current_settings.nodeName+'>')
					.addClass(current_settings.cssContentTableClass)
					.appendTo($resultsTooltip);

				var language = current_settings.language[getCurrentLanguage()];

//				$.each(['id','name','English','definition','comment','synonym'], function(){
				$.each(['name','English','definition','comment','synonym'], function(i,val){
					var key = val;
					var value = selfclass[key];
//					if(runSearchOptions.hasJA){
//						if(isString(selfclass[key+'_ja'])) value = selfclass[key+'_ja'];
//						if(key=='English') value = selfclass['name'];
//					}else if(key=='English'){
//						return;
//					}
					if(isWindowNavigatorLanguageJa()){	//ブラウザの言語設定が日本語の場合
						//代表表現が日本語の場合
						if(token_data['id'].lastIndexOf('_ja')>=0){
							if(isString(selfclass[key+'_ja'])) return;
							if(key==='English') value = selfclass['name'];
						}
						else{
							if(key==='name'){
								if(isString(selfclass[key+'_ja'])){
									value = selfclass[key+'_ja'];
								}
								else{
									return;
								}
							}
							if(key==='English') return;
						}
					}
					else if(token_data['id'].lastIndexOf('_ja')>=0){
						if(key==='English') return;
					}
					else if(key==='name' || key==='English'){
						return;
					}
					var label = language[key.toLowerCase()] ? language[key.toLowerCase()] : key;
					var $contentTr = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentTrClass).addClass(current_settings.cssContentTrClass+'-'+key.toLowerCase()).appendTo($resultsTooltipContent);
					$('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentThClass).addClass(current_settings.cssContentThClass+'-'+key.toLowerCase()).text(label).appendTo($contentTr);
					$('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentTdColonClass).text(':').appendTo($contentTr);
					var $value_td = $('<'+current_settings.nodeName+'>').addClass(current_settings.cssContentTdClass).addClass(current_settings.cssContentTdClass+'-'+key.toLowerCase()).appendTo($contentTr);
					if(key==='comment' && isString(value)){
						$value_td.html(value.replace(/\\n/g,'<br />'));
					}
					else{
						$value_td.text(value);
					}
				});

				$resultsTooltip
					.css({'visibility':'hidden'})
					.show();

				var offset = $(node).offset();
				var node_height = $(node).outerHeight(true);
				var node_width = $(node).outerWidth(true);

				var top = offset.top;
//				console.log(top,$(document).children('html').get(0).scrollTop,$('nav.fh5co-nav').outerHeight(true));
				if(top < $(document).children('html').get(0).scrollTop + $('nav.fh5co-nav').outerHeight(true)){
					top = $(document).children('html').get(0).scrollTop + $('nav.fh5co-nav').outerHeight(true);
				}
				top += 10;

				var left = offset.left + node_width/2;
				var width = node_width/2 - 10;

				$resultsTooltip
					.css({
						position: 'absolute',
						visibility: 'visible',
						top: top,
						left: left,
						width: width,
						'z-index': (1043>tokeninput_settings.zindex?1043:tokeninput_settings.zindex)+1
					})
					.show();
			}
			else{
				hideResultsTooltip();
			}

		};

		$.PopupRelationHPOResultsTooltip = function(node,token_data,options){

			hideResultsTooltip();

			if(isEmpty(node) || isEmpty(token_data) || !isObject(token_data)) return;

			options = options || {};
			if(isEmpty(options['lang'])) options['lang'] = isWindowNavigatorLanguageJa() ? 'ja' : 'en';
			if(isObject(options)){
				if(isString(options['lang'])){
					options['hasJA'] = (options['lang'].toLowerCase()==='ja' || options['lang'].toLowerCase()==='jpn') ? true : false;
					delete options['lang'];
				}
			}
			runSearchOptions = $.extend(true, {}, runSearchOptions, options || {});


			var $node = $(node);
			var data_key = 'popup-hierarchy-hpo-tooltip-data';

//			if($.data(node,data_key)){
//				console.log($.data(node,data_key));
//				return;
//			}

			resultsTooltip_timeoutID = setTimeout(function(){
				if(isEmpty(resultsTooltip_timeoutID)) return;
				resultsTooltip_timeoutID = null;

				var query = token_data.id;

				var url = computeURL();

				var cache_key = query + url;
				var cached_results = cache.get(cache_key);
//				cached_results = null;
				if(cached_results){
//					console.log('call showResultsTooltip()');
					showResultsTooltip(token_data,node,cached_results);
					if(isFunction(runSearchOptions.callback)){
						runSearchOptions.callback.call(this, true);
					}
				}
				else{


					if(current_settings.url) {
						var ajax_params = {};
						ajax_params.data = {};
						if(url.indexOf("?") > -1) {
							var parts = url.split("?");
							ajax_params.url = parts[0];

							var param_array = parts[1].split("&");
							$.each(param_array, function (index, value) {
								var kv = value.split("=");
								ajax_params.data[kv[0]] = kv[1];
							});
						} else {
							ajax_params.url = url;
						}

						ajax_params.data[current_settings.queryParam] = query;
						ajax_params.type = current_settings.method;
						ajax_params.dataType = current_settings.contentType;
						if (current_settings.crossDomain) {
							ajax_params.dataType = "jsonp";
						}

						ajax_params.success = function(results) {

							if(isEmpty(resultsTooltip_jqxhr)) return;

							cache.add(cache_key, current_settings.jsonContainer ? results[current_settings.jsonContainer] : results);

//							console.log('call showResultsTooltip()');
							showResultsTooltip(token_data,node,current_settings.jsonContainer ? results[current_settings.jsonContainer] : results);
							if(isFunction(runSearchOptions.callback)){
								runSearchOptions.callback.call(this, true);
							}

							resultsTooltip_jqxhr = null;
						};

						ajax_params.error = function(XMLHttpRequest, textStatus, errorThrown) {

							if(isEmpty(resultsTooltip_jqxhr)) return;

							console.warn(textStatus, errorThrown);
							if(isFunction(runSearchOptions.callback)){
								runSearchOptions.callback.call(this, false);
							}

							resultsTooltip_jqxhr = null;
						};

						if(isFunction(settings.onSend)){
							settings.onSend(ajax_params);
						}

						resultsTooltip_jqxhr = $.ajax(ajax_params);

					} else if(current_settings.local_data) {
						var results = $.grep(current_settings.local_data, function (row) {
							return row[current_settings.propertyToSearch].toLowerCase().indexOf(query.toLowerCase()) > -1;
						});

						cache.add(cache_key, results);

//						console.log('call showResultsTooltip()');
						showResultsTooltip(token_data,node,results);
						if(isFunction(runSearchOptions.callback)){
							runSearchOptions.callback.call(this, true);
						}
					}
				}
			},0);
		};


		if(isObject(window.category2obj_subtypes) && isObject(window.category2obj_subtypes[current_settings.fmatree_type])) window.category2obj = window.category2obj_subtypes[current_settings.fmatree_type];

		var tokeninput_theme = tokeninput_settings["theme"] ? '-'+tokeninput_settings["theme"] : '';
		$(document).on('mouseover', 'span.token-input-token-information'+tokeninput_theme, function(e){
			var $item = $(this).closest('li');
//			console.log($item.closest('ul').html())
			var token_data = $item.data('tokeninput');
			var $dropdown = $(this).closest('div.'+tokeninput_classes['dropdown']);
			if(isObject(token_data) && $dropdown.length){
				$.PopupRelationHPOResultsTooltip($dropdown,token_data);
			}
			e.stopPropagation();
			return false;
		});
		$(document).on('mouseout', 'span.token-input-token-information'+tokeninput_theme, function(e){
			$.PopupRelationHPOResultsTooltip();
			e.stopPropagation();
			return false;
		});
	};

    //$.PopupRelationHPO.Mfp_Popup = function (prependTo, $trigger) {
	$.PopupRelationHPO.Mfp_Popup = function (prependTo) {
        var DIV_POPUP_BG_ID        = 'mfp_bg_local', 
			DIV_POPUP_WRAP_ID      = 'mfp_wrap_local',
            DIV_POPUP_CONTAINER_ID = 'mfp_container_local', 
			DIV_POPUP_CONTENT_ID   = 'mfp_content_local',
			prependTo_id           = prependTo;

		let $mfp_bg_local   = $('<div>').attr('id', DIV_POPUP_BG_ID).addClass('mfp-bg mfp-ready').css({'opacity':'0'}).appendTo('body');
		let $mfp_wrap_local = $('<div>').attr('id', DIV_POPUP_WRAP_ID).addClass('mfp-wrap mfp-close-btn-in mfp-auto-cursor mfp-ready')
										.attr('tabindex','-1').css({'overflow': 'hidden auto'}).appendTo('body');
		let $mfp_container  = $('<div>').attr('id', DIV_POPUP_CONTAINER_ID).addClass("mfp-container mfp-s-ready mfp-inline-holder").appendTo($mfp_wrap_local);
		let $mfp_content    = $('<div>').attr('id', DIV_POPUP_CONTENT_ID).addClass("mfp-content").appendTo($mfp_container);

		if(prependTo_id){
			_set_level_pos();
		}

		$mfp_wrap_local.hide();
		$mfp_bg_local.hide();

	    $(window).on('resize', function(e) {
			_set_level_pos();
	    });

		function _set_level_pos(){
            //let width = $(window).width();
            //$mfp_wrap_local.css({'width': width+'px'});

            let $prependTo = $('#'+ prependTo_id);
            let top = $prependTo.offset().top;
			if(document.documentElement.scrollTop){
				top = top - document.documentElement.scrollTop;
			}else if(document.body.scrollTop){
				top = top - document.body.scrollTop;
			}
            let pos = Math.ceil(top + $prependTo.height());
            $mfp_bg_local.css({'top': pos+'px'});
            $mfp_wrap_local.css({'top': pos+'px'});
//			let max_height= Math.floor(document.documentElement.clientHeight) - Math.ceil(pos);
//			$mfp_container.css({'max-height':max_height+'px','overflow':'hidden auto'});
			let max_height= Math.floor(document.documentElement.clientHeight) - Math.ceil(pos);
			$mfp_wrap_local.css({'max-height':max_height+'px','overflow':'hidden auto'});
		}


        function _get_mfp_popup_content_wrapper() {
            return $('#'+DIV_POPUP_CONTENT_ID);
        };
        this.get_mfp_popup_content_wrapper = function(){
            return _get_mfp_popup_content_wrapper();
        };
        this.is_mfp_popup_existed = function(){
            if($('#'+DIV_POPUP_BG_ID).length) return true;
            return false;
        };
        this.is_mfp_popup_shown = function(){
			return $('#'+DIV_POPUP_BG_ID).is(':visible');
        };

        function _hide_mfp_popup(){
            if ($('#'+DIV_POPUP_BG_ID).is(':visible')) {
                $('#'+DIV_POPUP_WRAP_ID).hide();				
                $('#'+DIV_POPUP_BG_ID).hide();
            }
        };
		this.hide_mfp_popup = function(){
			_hide_mfp_popup();
        };
		
        function _show_mfp_popup(){
            if ($('#'+DIV_POPUP_BG_ID).is(':visible') === false) {
				_set_level_pos();
                $('#'+DIV_POPUP_BG_ID).show();
                $('#'+DIV_POPUP_WRAP_ID).show();
            }
        };		
        this.show_mfp_popup = function(){
			_show_mfp_popup();
        };
		
        this.openMagnificPopup = function(options){
            let $mfp_popup_content_wrapper = _get_mfp_popup_content_wrapper();
            $(options.items.src).detach().appendTo($mfp_popup_content_wrapper);
            _show_mfp_popup();
        };
		
        this.closeMagnificPopup = function(){
			if($('#'+DIV_POPUP_BG_ID).is(':visible')){
	            _get_mfp_popup_content_wrapper().empty();
    	        _hide_mfp_popup();
			}
        };
        this.set_mfp_popup_transparent = function(){
            $('#'+DIV_POPUP_BG_ID).css({'opacity':'0'});
        };
    };

}(jQuery));