/*
 * jQuery Plugin: Search phenotype 
 */
;(function ($) {
	
	var DEFAULT_SETTINGS = {

		url_tokeninput_hpo:			'/tokeninput_hpo',
		url_tokeninput_hpo_second:	'/pcf_get_hpo_by_text',
		url_popup_hierarchy_hpo:	'/popup_hierarchy_hpo',
		url_load_hpo_data:			'/get_hpo_data_by_hpo_id',
		lang:						'ja',

		form_action:				'/result',

		form_para_target:			'omim',
		form_para_filter:			'',
		form_para_size:				'10',
		form_para_display_format:	'full',

		show_loading:				null,
		hide_loading:				null,
		modify_modal_on_show:		null,
		after_modal_close:			null,
		is_hierarchy_fullscreen:	true,
	};


	const LANGUAGE_JA='ja', LANGUAGE_EN='en',
		LANGUAGE = {
			[LANGUAGE_JA] : {
				'TEXT2HPO_URL'				: '/ehr',
				'TEXT2HPO_BTN_TITLE'		: '文章から症状を自動抽出',
				'PHENOTOUCH_BTN_TITLE'		: 'ヒト3Dモデルを利用して症状を検索',
				'HPO_LIST_INPUT_BTN_TITLE'  : 'HPO IDのリストを入力',
			},
			[LANGUAGE_EN] : {
				'TEXT2HPO_URL'				: 'https://doc2hpo.wglab.org/',
				'TEXT2HPO_BTN_TITLE'		: 'Input Free-Text (doc2hpo)',
				'PHENOTOUCH_BTN_TITLE'		: 'Find Phenotypes using Human 3D Model',
				'HPO_LIST_INPUT_BTN_TITLE'  : 'Input HPO IDs',
			}
		};

	// Additional public (exposed) methods
	var methods = {
		init: function(options) {
			var settings = $.extend({}, DEFAULT_SETTINGS, options || {});

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
		// Initialization
		//
		var $div_wrapper = $(div_search_box_form).addClass("search-box_form d-flex flex-nowrap");
		$div_wrapper.data('SETTINGS', settings);

		this.update_setting = function(newoption) {
			var oldsettings = $div_wrapper.data('SETTINGS');
			var newsettings = $.extend({}, oldsettings, newoption || {});
			$div_wrapper.data('SETTINGS', newsettings);
		};

		var $div_left   = $('<div>').addClass("search-box_controller_left d-flex flex-column").appendTo($div_wrapper);
		var $div_middle = $('<div>').addClass("flex-grow-1 tokeninput_hpo_wrapper").appendTo($div_wrapper);
		var $div_right  = $('<div>').addClass("search-box_controller_right d-flex flex-column").appendTo($div_wrapper);

		
		var $div_l1 = $('<div>').addClass("button_wrapper").appendTo($div_left);
		var $div_l2 = $('<div>').addClass("button_wrapper").appendTo($div_left);
		var $div_l3 = $('<div>').addClass("button_wrapper").appendTo($div_left);

		$('<textarea>').attr('rows','1').attr('id','tokeninput_hpo').attr('name','str_phenotypes').appendTo($div_middle);

        var $div_r1 = $('<div>').addClass("button_wrapper").appendTo($div_right);
        var $div_r2 = $('<div>').addClass("button_wrapper").appendTo($div_right);

		$btn_l1 = $('<button>').addClass('text-button')
							   .data('TEXT2HPO_URL', LANGUAGE[settings.lang]['TEXT2HPO_URL'])
							   .click(function(){
							       window.open($(this).data('TEXT2HPO_URL'),'_blank'); 
							   })
							   .appendTo($div_l1);

		$('<img>').attr({
			'src':            '/static/images/pcf/text_black.svg',
			'data-toggle':    'tooltip',
			'data-placement': 'top',
			'title':          LANGUAGE[settings.lang]['TEXT2HPO_BTN_TITLE']
		}).appendTo($btn_l1);	

		$btn_l2 = $('<button>').addClass('text-button')
							   .attr({'id':'phenotouch'})
							   .click(function(e){
									$('.selected_at_popup').removeClass('selected_at_popup');
									$('.token-input-selected-token-facebook').removeClass('token-input-selected-token-facebook');
									$.PopupRelationHPOWithWebGL();
									e.preventDefault();
									e.stopPropagation();
									return false;
							   })
							   .appendTo($div_l2);

        $('<img>').attr({
            'src':            '/static/images/pcf/3d_black.svg',
            'data-toggle':    'tooltip',
            'data-placement': 'top',
            'title':          LANGUAGE[settings.lang]['PHENOTOUCH_BTN_TITLE']
        }).appendTo($btn_l2); 

		$btn_l3 = $('<button>').addClass('text-button')
							   .attr('id','hpo-list-input-button')
							   .click(function(){
									var modal = document.getElementById('hpo-list-input-modal');
									if (!modal) { modal = init_hpo_list_input_modal(); }
									$(modal).modal('show');
							   })
							   .appendTo($div_l3);

        $('<img>').attr({
            'src':            '/static/images/pcf/HPOID.svg',
            'data-toggle':    'tooltip',
            'data-placement': 'top',
            'title':          LANGUAGE[settings.lang]['HPO_LIST_INPUT_BTN_TITLE']
        }).appendTo($btn_l3);

		function init_hpo_list_input_modal() {
			var modal = document.createElement('div');
			modal.classList.add('modal', 'fade');
			modal.setAttribute('id', 'hpo-list-input-modal');
			modal.setAttribute('tabindex', '-1');
			modal.setAttribute('role', 'dialog');
			modal.setAttribute('aria-labelledby', 'hpo-list-input-modal-title');
			modal.setAttribute('aria-hidden', 'true');
			modal.innerHTML =
			'<div class=\"modal-dialog modal-dialog-centered modal-xl\">' +
				'<div class=\"modal-content p-5\">' + 
					'<div class=\"modal-header p-0\">' +
						'<h7 class=\"modal-title\" id=\"hpo-list-input-modal-title\" style=\"font-weight:bold;font-size:1.2rem;\">' +
							'<img src=\"/static/images/pcf/HPOID.svg\" style=\"height:22px;width:22px;\"></img>' +
							'Import Hpo Term List' +
						'</h7>'+
					'</div>'+
					'<div class=\"modal-body p-0\">'+
						'<div class=\"container-fluid p-0\">'+
							'<div class=\"row mx-0 py-3\">' +
								'<p>Import Human Phenotype Ontology (HPO) term IDs.<br />You can extract multiple HPO term IDs from any kind of textual input. HPO term ids must satisfy the format HP:XXXXXXX to be recognized.</p>'+
							'</div>'+
							'<div class=\"row mx-0\">'+
								'<div class=\"col-4 px-0\" style=\"border:1px solid #ced4da;border-radius: 0.25rem;height:256px;max-height:256px;\">'+
									'<textarea class=\"form-control2\" id=\"hpo-list-input-textarea\" style=\"background-color:#f8f9fa;border:0px;height:254px;\"></textarea>'+
								'</div>'+
								'<div class=\"align-self-center\">'+
									'<div>'+
										'<button id=\"hpo-list-input-submit-button\" style=\"color:white;background-color:#222057;opacity:1.0;height:52px;width:52px;font-size:32px;border:0px;\" class=\"round-button material-icons\">chevron_right</button> '+
									'</div>'+
								'</div>'+
								'<div class=\"col px-0\">'+
									'<div class=\"form-control2 p-0\" style=\"height:256px;max-height:256px;background-color:#ced4da;box-shadow:none;\">'+
										'<table class=\"form-control2 table table-hover p-0\" id=\"hpo-list-input-table\" style=\"height:100%;border:0px;box-shadow:none;margin:0px\"></table>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class=\"modal-footer px-0 pb-0\" style=\"border:0;\">'+
						'<button type=\"button\" style=\"padding-left:40px;padding-right:40px;\" class=\"btn btn-secondary py-1\" data-dismiss=\"modal\" id=\"hpo-list-input-close-button\">CANCEL</button>'+
						'<button type=\"button\" style=\"padding-left:40px;padding-right:40px;\" class=\"btn btn-primary py-1 mr-0\" id=\"hpo-list-input-apply-button\">APPLY</button>'+
					'</div>'+
				'</div>'+
			'</div>';
			document.body.appendChild(modal);

	        $('#hpo-list-input-modal').on('show.bs.modal', function () {
    	        $("#hpo-list-input-textarea").val("");
	            $("#hpo-list-input-table").find("tr").remove();
    	    });

	        $('#hpo-list-input-modal').on('shown.bs.modal', function () {
    	        setTimeout(function() {
        	        $('#hpo-list-input-textarea').focus();
	            }, 10);
    	    });


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

			$("#hpo-list-input-submit-button").click(function (e){
				let text = $("#hpo-list-input-textarea").val().toUpperCase().replaceAll("HP:0000118","");

				if(!text){
					alert("Please input HPO term list...");
					$("#hpo-list-input-textarea").focus();
					return false;
				}

				let r = text.match(/HP:(\d){7}/g);

				if(!r){
					alert("HPO term ids must satisfy the format HP:XXXXXXX.");
					$("#hpo-list-input-textarea").focus();
					return false;
				}
	
				let unique = uniq_fast(r);	
				text = unique.join(',');

				// load hpo term list from server.

				$("#hpo-list-input-submit-button").attr("disabled", true);

				let $tbl = $("#hpo-list-input-table");
				$tbl.find("tr").remove();

				if($.isFunction(settings.show_loading)){
					settings.show_loading();
				}

				let url_str = settings.url_load_hpo_data + '?hpo_id=' + text;

	            $.ajax({
    	            url:      url_str,  // 通信先のURL
        	        type:     'GET',	// 使用するHTTPメソッド(get/post)
            	    async:    true,    // 使用するHTTPメソッド(true/false)
                	dataType: 'text',
	                timeout:  3000,
    	        }).done(function(data,textStatus,jqXHR) {

        	        if($.isFunction(settings.hide_loading)){
            	        settings.hide_loading();
                	}

					let json_data = JSON.parse(data);
	
					let counter = 0;
					unique.forEach(function(hpo_id){
						if(hpo_id in json_data){

							let name_text = json_data[hpo_id].name_en;
							let hpo_id_text = hpo_id;
							if(settings.lang === LANGUAGE_JA){
								if(json_data[hpo_id].name_ja){
									name_text = json_data[hpo_id].name_ja;
								}
								hpo_id_text = hpo_id_text + "_ja";
							}
					
							let $tr  = $('<tr>').appendTo($tbl);
							$tr.addClass('table-secondary');
					
							let $td1 = $('<td>').appendTo($tr);
							$td1.css({'padding-left':'1.0rem'});
							let $cbx = $('<input>', {type: 'checkbox', name: 'hpo_list', "checked":"checked"}).appendTo($td1);
							$cbx.css({'margin-bottom':'unset'}).data('HPO_ITEM', {'id':hpo_id_text, 'name':name_text}).change(function() {
								$(this).parent().parent().toggleClass('table-secondary');
							});

							let $td2 = $('<td>').css({'color':'#4582bf'}).appendTo($tr);
							$td2.text(hpo_id);

							let $td3 = $('<td>').appendTo($tr);
							$td3.css({'width':'80%'}).text(name_text);

							counter++;
						}
					});	

					if(counter === 0){
						alert("No HPO term Found.");
					}

    	        }).fail(function(jqXHR, textStatus, errorThrown ) {
					if($.isFunction(settings.hide_loading)){
                		settings.hide_loading();
					}
	                alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
    	        }).always(function(){
					if($.isFunction(settings.hide_loading)){
						settings.hide_loading();
					}
					$('#hpo-list-input-submit-button').removeAttr("disabled");
				});
			});
	
			$("#hpo-list-input-apply-button").click(function (e){

				let $tbl = $("#hpo-list-input-table");
				let cnt = 0;
	        	$tbl.find("input[name='hpo_list']:checked").each(function(){
					cnt++;
					let hpo_item = $(this).data('HPO_ITEM');
					$("#tokeninput_hpo").tokenInput("add", hpo_item);
				});
		
				if(!cnt){
					alert("No HPO term selected.");
					return false;
				}

				$("#hpo-list-input-close-button").trigger('click');

				$("#tokeninput_hpo").tokenInput("blinkLastTokens", cnt);

				setTimeout(function() {
					let element = document.getElementById("token-input-tokeninput_hpo");
					element.scrollIntoViewIfNeeded();
					$('#token-input-tokeninput_hpo').focus();
	        	}, 10);

				return false;
			});

            return modal;
        };


		var runSubmit = function(){

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

        $("#tokeninput_hpo")
            .tokenInput(settings.url_tokeninput_hpo, 
						{theme: "facebook", 
						 lang: settings.lang, 
						 second_url_str: settings.url_tokeninput_hpo_second, 
						 doSubmit: runSubmit
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
								}
							  });

		this.add_token = function(item) {
			$("#tokeninput_hpo").tokenInput("add", item);
		};

		 $('<button>').addClass('round-button material-icons').text('clear')
					.click(function(){
						$("#tokeninput_hpo").tokenInput("clear");
						return false;
					})
					.appendTo($div_r1);

		$('<button>').addClass('round-button material-icons').text('search')
					.attr('id', 'search_button')
					.click(function(){	
						runSubmit();			
					})
					.appendTo($div_r2);		

	};


}(jQuery));

