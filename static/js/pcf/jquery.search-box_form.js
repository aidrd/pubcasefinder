/*
 * jQuery Plugin: Search phenotype 
 */
;(function ($) {

	//(hpo list input, setting)buttons on left, (clear,submit) button on right    
	const SCHEMA_2022 = "schema-2022";
	//(text2hpo,phenotouch,hpo list input)buttons on left, (clear,submit) button on right
	const SCHEMA_2021 = "schema-2021";

	const TEXT_INPUT_SCHEMA_MANUAL='manual',TEXT_INPUT_SCHEMA_AUTO='auto';

	const LANGUAGE_JA='ja', LANGUAGE_EN='en',
		  UISETTING_TAG_SIZE_S ='s',UISETTING_TAG_SIZE_M='m',UISETTING_TAG_SIZE_L='l',
		  UISETTING_TAG_SIZE_LST = [UISETTING_TAG_SIZE_S,UISETTING_TAG_SIZE_M,UISETTING_TAG_SIZE_L],
		  UISETTING_LANGUAGE_JAPANESE = 'ja',UISETTING_LANGUAGE_ENGLISH = 'en',
		  UISETTING_LANGUAGE_GERMANY  = 'de',UISETTING_LANGUAGE_NETHERLANDS = 'nl',
		  UISETTING_LANGUAGE_LST = [UISETTING_LANGUAGE_ENGLISH,UISETTING_LANGUAGE_JAPANESE,UISETTING_LANGUAGE_GERMANY,UISETTING_LANGUAGE_NETHERLANDS],
		  UISETTING_LANGUAGE_LABEL = {
				[UISETTING_LANGUAGE_ENGLISH]:     'English',
				[UISETTING_LANGUAGE_JAPANESE]:    'Japanese',
				[UISETTING_LANGUAGE_GERMANY]:     'Germany',
				[UISETTING_LANGUAGE_NETHERLANDS]: 'Netherlands'
		  },
		  LANGUAGE = {
			[LANGUAGE_JA] : {
				'TEXT2HPO_URL'				: '/ehr',
				'TEXT2HPO_BTN_TITLE'		: '文章から症状を自動抽出',
				'TEXT_INPUT_TITLE'			: '文章から症状を自動抽出',
				'PHENOTOUCH_BTN_TITLE'		: 'ヒト3Dモデルを利用して症状を検索',
				'HPO_LIST_INPUT_BTN_TITLE'  : 'HPO IDのリストを入力',
				'UISETTING_BTN_TITLE'		   : '設定',
				'UISETTING_TBL_LABEL_TAGSIZE'  : 'タグサイズ:',
				'UISETTING_TBL_LABEL_LANGUAGE' : 'クエリー言語:',
				'UISETTING_TAG_SIZE_LABEL'    : {
					[UISETTING_TAG_SIZE_S] : '小',
					[UISETTING_TAG_SIZE_M] : '中',
					[UISETTING_TAG_SIZE_L] : '大'
				}
			},
			[LANGUAGE_EN] : {
				'TEXT2HPO_URL'				: 'https://doc2hpo.wglab.org/',
				'TEXT2HPO_BTN_TITLE'		: 'Input Free-Text (doc2hpo)',
				'TEXT_INPUT_TITLE'			: 'Automatically extract HPO term from text',
				'PHENOTOUCH_BTN_TITLE'		: 'Find Phenotypes using Human 3D Model',
				'HPO_LIST_INPUT_BTN_TITLE'  : 'Input HPO IDs',
				'UISETTING_BTN_TITLE'		   : 'Setting',
				'UISETTING_TBL_LABEL_TAGSIZE'  : 'Tag size:',
				'UISETTING_TBL_LABEL_LANGUAGE' : 'Query language:',
				'UISETTING_TAG_SIZE_LABEL'    : {
					[UISETTING_TAG_SIZE_S] : 'Small',
					[UISETTING_TAG_SIZE_M] : 'Medium',
					[UISETTING_TAG_SIZE_L] : 'Large'
				}
			}
		};

    var DEFAULT_SETTINGS = {
        url_tokeninput_hpo:         '/tokeninput_hpo',
        url_tokeninput_hpo_second:  '/pcf_get_hpo_by_text',
        url_popup_hierarchy_hpo:    '/popup_hierarchy_hpo',
        url_load_hpo_data:          '/get_hpo_data_by_hpo_id',
        lang:                       'ja',

        form_action:                '/result',
        form_para_target:           'omim',
        form_para_filter:           '',
        form_para_filter_vgp:       '',
        form_para_size:             '10',
        form_para_display_format:   'full',
        show_loading:               null,
        hide_loading:               null,
        modify_modal_on_show:       null,
        after_modal_close:          null,
        is_hierarchy_fullscreen:    true,

        // SCHEMA_2022 or SCHEMA_2021
        schema:                     SCHEMA_2022,
		text_input_schema:          TEXT_INPUT_SCHEMA_MANUAL,        

        uisetting_tag_size:			UISETTING_TAG_SIZE_L,
		uisetting_language:			UISETTING_LANGUAGE_ENGLISH,UISETTING_LANGUAGE_JAPANESE
    };

	function setCookie(cname,cvalue){
		document.cookie = cname+"="+cvalue+";" + `expires=${new Date(new Date().getTime()+1000*60*60*24*365).toGMTString()}; path=/`;
	}

	function getCookie(cname){

		if(!document.cookie){
			document.cookie = `expires=${new Date(new Date().getTime()+1000*60*60*24*365).toGMTString()}; path=/`;
			return "";
		}		
		
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i].trim();
	        if (c.indexOf(name)===0) { return c.substring(name.length,c.length); }
	    }
	    return "";
	}


	var windowNavigatorLanguage = (window.navigator.languages && window.navigator.languages[0]) || window.navigator.language ||
                					window.navigator.userLanguage || window.navigator.browserLanguage;
                					
    function isWindowNavigatorLanguageJa(){
        return windowNavigatorLanguage === "ja" || windowNavigatorLanguage.toLowerCase() === "ja-jp";
    }

    function isWindowNavigatorLanguageDe(){
        return windowNavigatorLanguage === "de"  || windowNavigatorLanguage.toLowerCase() === "de-de" || windowNavigatorLanguage.toLowerCase() === "de-ch";
    }

    function isWindowNavigatorLanguageNl(){
        return windowNavigatorLanguage === "nl" || windowNavigatorLanguage === "nl-nl";
    }

	var isObject = function(value) {
		return $.isPlainObject(value);
	},
	isArray = function(value) {
		return $.isArray(value);
	},
	isFunction = function(value) {
		return $.isFunction(value);
	},
	isNumeric = function(value) {
		return $.isNumeric(value);
	},
	isString = function(value) {
		return typeof value === 'string';
	},
	isBoolean = function(value) {
		return typeof value === 'boolean';
	},
	isEmpty = function(value, allowEmptyString) {
		return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (isArray(value) && value.length === 0);
	},
	isDefined = function(value) {
		return typeof value !== 'undefined';
	},
	hasJA = function( str ) {
		return ( str && str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/) )? true : false;
	}
	;


	// Additional public (exposed) methods
	var methods = {
		init: function(options) {
			var settings = $.extend({}, DEFAULT_SETTINGS, options || {});

			let cookie_tag_size = getCookie('uisetting_tag_size');
			if(cookie_tag_size){
				settings['uisetting_tag_size'] = cookie_tag_size;
			}else{
				setCookie('uisetting_tag_size', settings['uisetting_tag_size']);
			}

			let cookie_language = getCookie('uisetting_language');
			if(cookie_language){
				settings['uisetting_language'] = cookie_language;
			}else{
				if(isWindowNavigatorLanguageJa()){
					settings['uisetting_language'] = UISETTING_LANGUAGE_ENGLISH + "," + UISETTING_LANGUAGE_JAPANESE;	
				}else if(isWindowNavigatorLanguageDe()){
					settings['uisetting_language'] = UISETTING_LANGUAGE_ENGLISH + "," + UISETTING_LANGUAGE_GERMANY;
				}else if(isWindowNavigatorLanguageNl()){
					settings['uisetting_language'] = UISETTING_LANGUAGE_ENGLISH + "," + UISETTING_LANGUAGE_NETHERLANDS;
				}else{
					settings['uisetting_language'] = UISETTING_LANGUAGE_ENGLISH;
				}
				
				setCookie('uisetting_language', settings['uisetting_language']);
			}

			return this.each(function () {
				//$(this).data("settings", settings);
				$(this).data("searchBoxFormObject", new $.Search_Box_Form(this, settings));
			});
		},
		update_target: function(target) {
			this.data("searchBoxFormObject").update_setting({'form_para_target':target});
			return this;
		},
		update_filter: function(filter) {
			this.data("searchBoxFormObject").update_setting({'form_para_filter':filter});
			return this;
		},
		update_filter_vgp: function(filter_vgp) {
			this.data("searchBoxFormObject").update_setting({'form_para_filter_vgp':filter_vgp});
			return this;
		},
        update_size: function(size) {
			this.data("searchBoxFormObject").update_setting({'form_para_size':size});
			return this;
		},
		update_display_format: function(display_format) {
			this.data("searchBoxFormObject").update_setting({'form_para_display_format':display_format});
			return this;
		},
		add_token:	function(item) {
			this.data("searchBoxFormObject").add_token(item);
			return this;
		},
		get_tokens: function() {
			return this.data("searchBoxFormObject").get_tokens();
		}
	};

	// Expose the .tokenInput function to jQuery as a plugin
	$.fn.search_box_form = function (method) {
		// Method calling and initialization logic
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};

	// TokenList class for each input
	$.Search_Box_Form = function (div_search_box_form, settings) {
	
		//
		// utility modules
		//
        function uniq_fast(a) {
            let seen = {};
            let out = [];
            let len = a.length;
            let j = 0;
            for(let i = 0; i < len; i++) {
                let item = a[i];
                if(seen[item] !== 1) {
                    seen[item] = 1;
                    out[j++] = item;
                }
            }
            return out;
        }

		//
		// sub modules for UI
		//
		function create_text2hpo_button(language){
	        let $btn = $('<button>').addClass('text-button')
                               .data('TEXT2HPO_URL', LANGUAGE[language]['TEXT2HPO_URL'])
                               .click(function(){
                                   window.open($(this).data('TEXT2HPO_URL'),'_blank');
                               });

	        $('<img>').attr({
	            'src':            '/static/images/pcf/text_black.svg',
	            'data-toggle':    'tooltip',
				'data-placement': 'top',
	            'title':          LANGUAGE[language]['TEXT2HPO_BTN_TITLE']
	        }).appendTo($btn);
			
			return $btn;
		}

		function create_phenotouch_button(language){
			let $btn = $('<button>').addClass('text-button')
									.attr({'id':'phenotouch'})
									.click(function(e){
										$('.selected_at_popup').removeClass('selected_at_popup');
										$('.token-input-selected-token-facebook').removeClass('token-input-selected-token-facebook');
										$.PopupRelationHPOWithWebGL();
										e.preventDefault();
										e.stopPropagation();
										return false;
                               		});

			$('<img>').attr({
				'src':            '/static/images/pcf/3d_black.svg',
				'data-toggle':    'tooltip',
				'data-placement': 'top',
				'title':          LANGUAGE[language]['PHENOTOUCH_BTN_TITLE']
			}).appendTo($btn);
				
			return $btn;
		}

		function create_hpo_list_input_button(language){
	        let $btn = $('<button>').addClass('text-button')
									.attr('id','hpo-list-input-button')
									.click(function(){
										var modal = document.getElementById('hpo-list-input-modal');
										if (!modal) { modal = init_hpo_list_input_modal(); }
										$(modal).modal('show');
									});

			$('<img>').attr({
				'src':            '/static/images/pcf/HPOID.svg',
				'data-toggle':    'tooltip',
				'data-placement': 'top',
				'title':          LANGUAGE[language]['HPO_LIST_INPUT_BTN_TITLE']
			}).appendTo($btn);

			return $btn;
		}


		function create_list_input_button(language){
	        let $btn = $('<button>').addClass('text-button').attr('id','hpo-list-input-button');

			$('<img>').attr({
				'src':            '/static/images/pcf/HPOID.svg',
				'data-toggle':    'tooltip',
				'data-placement': 'top',
				'title':          LANGUAGE[language]['HPO_LIST_INPUT_BTN_TITLE']
			}).appendTo($btn);

			return $btn;
		}

		function create_text_input_button(language){
			let $btn = $('<button>').addClass('round-button').attr('id',"btn_text_input_trigger");
			$('<img>').attr({
				'src':            '/static/images/pcf/HPOID_grey.svg',
				'data-toggle':    'tooltip',
				'data-placement': 'top',
				'title':          LANGUAGE[language]['TEXT_INPUT_TITLE']
			}).appendTo($btn);

			return $btn;
		}


		// trigger to show setting GUI
		function create_uisetting_button(language){

			let $btn = $('<button>').attr('tid','btn_uisetting_trigger').addClass('round-button');

			$('<span>').addClass('material-icons').text('settings')
						.attr('id','btn_uisetting_trigger')
						.attr({
           					'data-toggle':    'tooltip',
							'data-placement': 'top',
							'title':          LANGUAGE[language]['UISETTING_BTN_TITLE']
						})
						.appendTo($btn);
			return $btn;


        }

		function create_uisetting_ui(language, uisetting_tag_size, uisetting_language, trigger_btn_id){

			let $dropdown = $('<div>').attr({'id':'dropdown-menu_uisetting'}).addClass('dropdown-menu-wrapper').appendTo('body');
			let $form     = $('<div>').appendTo($dropdown);
			let $tbl      = $('<table>').appendTo($form);

			let $tr0      = $('<tr>').appendTo($tbl);
			let $td0_1    = $('<td>').text(LANGUAGE[language]['UISETTING_BTN_TITLE']).addClass('uititle').attr("colspan",2).appendTo($tr0);
			
			let $tr1      = $('<tr>').appendTo($tbl);
			$('<td>').text(LANGUAGE[language]['UISETTING_TBL_LABEL_TAGSIZE']).addClass('title').css({"padding-top":"10px"}).appendTo($tr1);
			let $td1_2    = $('<td>').appendTo($tr1);
			let $select_tagsize = $('<select>').attr('id',"sel_tagsize").appendTo($td1_2);
			UISETTING_TAG_SIZE_LST.forEach(function(tag_size){
				$('<option>').text(LANGUAGE[language]['UISETTING_TAG_SIZE_LABEL'][tag_size])
							 .val(tag_size)
							 .appendTo($select_tagsize);
			});
			$select_tagsize.val(uisetting_tag_size).change(function() {
				let selected_tag_size = $(this).val();
				
				setCookie('uisetting_tag_size', selected_tag_size);
				
				var oldsettings = $div_wrapper.data('SETTINGS');
				var newsettings = $.extend({}, oldsettings, {'uisetting_tag_size':selected_tag_size});
				$div_wrapper.data('SETTINGS', newsettings);
				
				$("#tokeninput_hpo").tokenInput("setTagSize",selected_tag_size);
				$("#tokeninput_hpo").popupRelationHPO("setTagSize",selected_tag_size);
				
				return false;
			});

			let uisetting_language_arr = uisetting_language.split(',');
			
			let $tr2      = $('<tr>').appendTo($tbl);
			$('<td>').text(LANGUAGE[language].UISETTING_TBL_LABEL_LANGUAGE).addClass('title').appendTo($tr2);
			let $td2_2    = $('<td>').appendTo($tr2);
			let $div_lang = $('<div>').addClass('d-flex flex-column').appendTo($td2_2);
			
			UISETTING_LANGUAGE_LST.forEach(function(language_item){

				let check_str = "";
				if(uisetting_language_arr.includes(language_item)){
					check_str = "checked";
				}
				
				$('<label>' +
						'<input type=\"checkbox\" name=\"cbk_uisetting_language\" value='+ language_item + ' '+ check_str+' \/>' +
						UISETTING_LANGUAGE_LABEL[language_item] +
				  '</label>'				
				).appendTo($div_lang);
			});

			$('input[name=cbk_uisetting_language]').each(function() {
				$(this).click(function(){
					let arr = [];
					$('input[name=cbk_uisetting_language]:checked').each(function() {
						let v = $(this).val();
						arr.push(v);
					});

					let str = arr.join(',');
					setCookie('uisetting_language', str);
					let oldsettings = $div_wrapper.data('SETTINGS');
					let newsettings = $.extend({}, oldsettings, {'uisetting_language':str});
					$div_wrapper.data('SETTINGS', newsettings);
					$("#tokeninput_hpo").tokenInput("setOptions",{'uisetting_language':str});
				});
			});
			


			const template_uisetting = document.getElementById('dropdown-menu_uisetting');
			template_uisetting.style.display = 'block';
			tippy('#'+trigger_btn_id, 
				{
					arrow:         true,
					allowHTML:     true,
					appendTo:      document.body,
					animation:     'scale-extreme',
					maxWidth:      500,
					width:		   450,
					strategy:     'fixed',
					interactive:   true,
					trigger:      'click',
					theme:        'pcf-popup',
					placement:    'bottom-start',
					 offset:	  [-15, 10],
					content:      template_uisetting,
					onShown(instance) {
						//customize ui
						//$('#str_target').html(str_target_label);
						//let selected_num = $("#pcf-content").pcf_content('get_selected_num');
						//let options = $('#sel_download_option').find('option');
						//$(options[2]).text('Selection (' + selected_num + ')');
				    }
				}
			);
		}

		function create_clear_button(){
			return $('<button>').addClass('round-button material-icons').text('clear')
						.click(function(){
							$("#tokeninput_hpo").tokenInput("clear");
							return false;
						});
		}

		function create_submit_button(){
			return	$('<button>').addClass('round-button material-icons').text('search')
						.attr('id', 'submit_button')
						.click(function(){
							runSubmit();
							//openMagnificPopupte_submit_button();
						});
		}

		function openMagnificPopupte_submit_button(){
			var magnificPopup = document.getElementById('magnificPopup');
			if (!magnificPopup) { magnificPopup = init_magnificPopup(); }
			else {	
				if($('#magnificPopup').css('display') === 'none'){
					$('#magnificPopup').show();
				}else{
					$('#magnificPopup').hide();
				}
			}
		}

		function init_magnificPopup(){
			var $magnificPopup = $('<div>').attr('id', 'magnificPopup')
										   .attr('tabindex', '-1')
										   .css({'top':'151px',
												 'opacity':0.01,
												 'left': 0,
												 'width':'100%',
												 'heigt':'100%',
												 'z-index':1042,
												 'position' : 'fixed',
												 'background':'#0b0b0b',
												 'overflow': 'hidden auto'})
											.appendTo('body');
			$magnificPopup.css({'height':'100%'});
			var $div1 = $('<div>').addClass("popup-hierarchy-hpo-table popup-hierarchy-hpo-loading").appendTo($magnificPopup);
			var $div2 = $('<div>').addClass("popup-hierarchy-hpo-tr").appendTo($div1);
			var $div3 = $('<div>').addClass("popup-hierarchy-hpo-td").css({'vertical-align': 'middle'}).text('Loading...').appendTo($div2);


			

		}


		function runSubmit(){

			let settings = $div_wrapper.data('SETTINGS');

			// trigger search
			let form = document.createElement("form");
			form.setAttribute("method", "get");
			form.setAttribute("action", settings.form_action);

			let target = document.createElement("input");
			target.setAttribute("type",  "text");
			target.setAttribute("name",  "target");
			target.setAttribute("value", settings.form_para_target);
			form.appendChild(target); 

			let phenotype = document.createElement("input");
			phenotype.setAttribute("type", "text");
			phenotype.setAttribute("name", "phenotype");
			phenotype.setAttribute("value",$("#tokeninput_hpo").val());
			form.appendChild(phenotype);

			let filter = document.createElement("input");
			filter.setAttribute("type", "text");
			filter.setAttribute("name", "filter");
			filter.setAttribute("value",settings.form_para_filter);
			form.appendChild(filter);  

			let filter_vgp = document.createElement("input");
			filter_vgp.setAttribute("type", "text");
			filter_vgp.setAttribute("name", "vgp");
			filter_vgp.setAttribute("value",settings.form_para_filter_vgp);
			form.appendChild(filter_vgp);  

			let size = document.createElement("input");
			size.setAttribute("type", "text");
			size.setAttribute("name", "size");
			size.setAttribute("value",settings.form_para_size);
			form.appendChild(size);

			let display_format = document.createElement("input");
			display_format.setAttribute("type", "text");
			display_format.setAttribute("name", "display_format");
			display_format.setAttribute("value",settings.form_para_display_format);
			form.appendChild(display_format); 

			let lang = document.createElement("input");
			lang.setAttribute("type", "text");
			lang.setAttribute("name", "lang");
			lang.setAttribute("value",settings.lang);
			form.appendChild(lang);

			$(form).appendTo('body').submit();

			return false;
		};

		//
		// modules for outside call
		//
		this.update_setting = function(newoption) {
			var oldsettings = $div_wrapper.data('SETTINGS');
			var newsettings = $.extend({}, oldsettings, newoption || {});
			$div_wrapper.data('SETTINGS', newsettings);
		};                

        this.add_token = function(item) {
            $("#tokeninput_hpo").tokenInput("add", item);
        };

		this.get_tokens = function() {
			return $("#tokeninput_hpo").tokenInput("get");
		};


		//
		// Initialization UI
		//
		var $div_wrapper = $(div_search_box_form).addClass("search-box_form d-flex flex-nowrap");
		$div_wrapper.data('SETTINGS', settings);

		var $div_left   = $('<div>').addClass("search-box_controller_left d-flex flex-column").appendTo($div_wrapper);
		var $div_middle = $('<div>').addClass("flex-grow-1 tokeninput_hpo_wrapper").appendTo($div_wrapper);
		var $div_right  = $('<div>').addClass("search-box_controller_right d-flex flex-column").appendTo($div_wrapper);

		if(settings.schema === SCHEMA_2021){

			let $div_l1 = $('<div>').addClass("button_wrapper").addClass(SCHEMA_2021).appendTo($div_left);
			let $div_l2 = $('<div>').addClass("button_wrapper").addClass(SCHEMA_2021).appendTo($div_left);
			let $div_l3 = $('<div>').addClass("button_wrapper").addClass(SCHEMA_2021).appendTo($div_left);
			create_text2hpo_button(settings.lang).appendTo($div_l1);
			create_phenotouch_button(settings.lang).appendTo($div_l2);
			//create_hpo_list_input_button(settings.lang).appendTo($div_l3);
			let $list_input_trigger_btn = create_list_input_button(settings.lang).appendTo($div_l3);
			$list_input_trigger_btn.listinput({ 
				url_hpoid:		'/get_hpo_data_by_hpo_id',
				schema:		'hpo',
				language:	settings.lang,
				output_list: function(obj_list){
					obj_list.forEach(function(item){
						if(Object.keys(item).length > 0){
							$("#tokeninput_hpo").tokenInput("add", item);
						}
					});
				}
			});


		}else if(settings.schema === SCHEMA_2022){
			let $div_l1 = $('<div>').addClass("button_wrapper").addClass(SCHEMA_2022).appendTo($div_left);
			let $div_l2 = $('<div>').addClass("button_wrapper").addClass(SCHEMA_2022).appendTo($div_left);

			let $text_input_trigger_btn = create_text_input_button(settings.lang).appendTo($div_l1);
			
			$text_input_trigger_btn.textinput_hpo({ 
				schema:     settings.text_input_schema,
				language:   settings.lang,
				output_hpo: function(hpo_list){
					$("#tokeninput_hpo").tokenInput("add_hpo_list", hpo_list);
				}
			});

			let $ui_trigger_btn = create_uisetting_button(settings.lang).appendTo($div_l2);	
			
			create_uisetting_ui(settings.lang, settings.uisetting_tag_size, settings.uisetting_language, $ui_trigger_btn.attr('tid'));

		}else{
			alert("UNKNOWN SCHEMA[" + settings.schema + "]");
		}

		let $div_r1 = $('<div>').addClass("button_wrapper").appendTo($div_right);
		let $div_r2 = $('<div>').addClass("button_wrapper").appendTo($div_right);
		create_clear_button().appendTo($div_r1);
		create_submit_button().appendTo($div_r2);


		$('<textarea>').attr('rows','1').attr('id','tokeninput_hpo').attr('name','str_phenotypes').appendTo($div_middle);

        $("#tokeninput_hpo")
            .tokenInput(settings.url_tokeninput_hpo, 
						{theme:               "facebook", 
						 lang:                settings.lang,
						 uisetting_language:  settings.uisetting_language,
						 uisetting_tag_size:  settings.uisetting_tag_size,
						 second_url_str:      settings.url_tokeninput_hpo_second, 
						 doSubmit:            runSubmit,
						 onLongerQuery:       settings.schema === SCHEMA_2022 ? 
	 											function(text){$('#btn_text_input_trigger').textinput_hpo('start_modal_with_text',text);} :
	 											function(text){$('#hpo-list-input-button').listinput('start_modal_with_text',text);},
						 onClickDelete:		function() { $("#tokeninput_hpo").popupRelationHPO('triggerChangeState');}
						}
					   );

		$("#tokeninput_hpo")
			.popupRelationHPO( settings.url_popup_hierarchy_hpo,
							  {'is_hierarchy_fullscreen': settings.is_hierarchy_fullscreen,
							   'modify_modal_on_show':	  settings.modify_modal_on_show,
                               'language_in':			  settings.lang,
							   'after_modal_close':		  function(){
									if($.isFunction(settings.after_modal_close)){
										settings.after_modal_close();
									}
									// delete 三行以上症状が入力されている場合に，一行目の症状パネルを選択すると，選択パネルではなく最終行に表示が移動してしまう
									//setTimeout(function() {
									//	$('#token-input-tokeninput_hpo').focus();
									//}, 50);
								},
							   'prependTo': div_search_box_form.id
							  });

	};


}(jQuery));

