;(function ($) {

	const	TARGET_GENE_LIST      = "gene_list",
			TARGET_PHENOTYPE_LIST = "phenotype_list",
			TARGET_LIST           = [TARGET_GENE_LIST,TARGET_PHENOTYPE_LIST],
			KEY_URL_GENE          = "url_gene",
			KEY_URL_PHENOTYPE     = "url_phenotype",
			KEY_URL_HPO_TOOLTIP   = "url_hpo_tooltip",
			URL_KEY_LIST          = [KEY_URL_GENE,KEY_URL_PHENOTYPE],
			KEY_COUNT_GENE        = "count_gene",
			KEY_COUNT_PHENOTYPE   = "count_phenotype",
			COUNT_KEY_LIST        = [KEY_COUNT_GENE,KEY_COUNT_PHENOTYPE],
			LABEL_GENE            = "Genes",
			LABEL_PHENOTYPE       = "Clinical features",
			LABEL_LIST            = [LABEL_GENE,LABEL_PHENOTYPE],
			KEY_MONDO_ID          = 'mondo_id',
			KEY_MONDO_URL         = 'mondo_url',
			KEY_OMIM_ID           = 'omim_id',
			KEY_OMIM_URL          = 'omim_url',
			KEY_ORPHA_ID          = 'orpha_id',
			KEY_ORPHA_URL         = 'orpha_url',
			KEY_ICD_ID            = 'icd_id',
			KEY_ICD_URL           = 'icd_url',
			LANGUAGE_EN           = 'en',
			LANGUAGE_JA           = 'ja',
			KEY_LANGUAGE          = 'language',
			LINK_KEY_HASH = [
				{id: KEY_MONDO_ID, url: KEY_MONDO_URL },
				{id: KEY_OMIM_ID,  url: KEY_OMIM_URL  },
				{id: KEY_ORPHA_ID, url: KEY_ORPHA_URL },
				{id: KEY_ICD_ID,   url: KEY_ICD_URL   }
			],
			CLASS_ACTIVE          = "vgp-active",
			CLASS_INIT            = "status-empty",
			CLASS_DATA_LOADED     = "vgp-data-loaded",
			KEY_TARGET            = "vgp-target",
			KEY_URL               = "vgp-url",
			KEY_COUNT             = "vgp-count",
			KEY_HPO_ID            = "VGP-HPO-ID",
			KEY_HPO_NAME          = "VGP-HPO-NAME";

	const PHENOTYPE_TABLE_HEADER = ['HPO ID','Label','Frequency','Search'];

	var DEFAULT_SETTINGS = {
		[KEY_URL_PHENOTYPE]   : '',
		[KEY_URL_GENE]        : '',
		[KEY_URL_HPO_TOOLTIP] : '',
		[KEY_MONDO_ID]        : '',
		[KEY_MONDO_URL]       : '',
		[KEY_OMIM_ID]         : '',
		[KEY_OMIM_URL]        : '',
		[KEY_ORPHA_ID]        : '',
		[KEY_ORPHA_URL]       : '',
		[KEY_ICD_ID]          : '',
		[KEY_ICD_URL]         : '',
		[KEY_COUNT_PHENOTYPE] : 0,
		[KEY_COUNT_GENE]      : 0,
		[KEY_LANGUAGE]        : LANGUAGE_EN
	};

	var _isObject   = function(value) {return $.isPlainObject(value);},
		_isArray    = function(value) {return $.isArray(value);},
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
		};

	function _contruct_popup_content_val(key,hash,delimer){
		if(!_isExistVal(key,hash)) return '';
		if(_isEmpty(hash[key])) return '';
		if(_isArray(hash[key])) {
			if(_isEmpty(delimer)) return hash[key].join(',');
			return hash[key].join(delimer);
		}
		return hash[key];
	}
	
	function _contruct_popup_content(hpo_id,popup_data, lang){

		let max_text_len  = hpo_id.length;
		
		let name_ja = _contruct_popup_content_val('name_ja',popup_data);
		let name_en = _contruct_popup_content_val('name_en',popup_data);
		if(_isEmpty(name_ja) && _isEmpty(name_en)){
			return ['no data found for '+ popup_id, max_text_len];
		}

		if(max_text_len < name_ja.length) max_text_len =name_ja.length; 
		if(max_text_len < name_en.length) max_text_len =name_en.length;

		let hpo_url = _contruct_popup_content_val('hpo_url',popup_data);
		if(max_text_len < hpo_url.length) max_text_len =hpo_url.length;

		let definition = _contruct_popup_content_val('definition',popup_data);
		if(max_text_len < definition.length) max_text_len = definition.length;

		let comment = _contruct_popup_content_val('comment',popup_data);
		if(max_text_len < comment.length) max_text_len = comment.length;

		let synonym = _contruct_popup_content_val('synonym',popup_data,', ');
		if(max_text_len < synonym.length) max_text_len = synonym.length;


		let content = '<table>' +
						'<tr>'+
						  '<th class=\"pcf-popup-phenotype_inlist\">HPO ID	</th>'+
						  '<td><a href=\"'+hpo_url+'\" target=\"_blank\">'+hpo_id+'</td>'+
						'</tr>';
		if(lang === LANGUAGE_EN){
			content +=  '<tr>'+
						  '<th class=\"pcf-popup-phenotype_inlist\">Label</th>'+
						  '<td>'+name_en+'</td>'+
						'</tr>';
		}else{
			content +=  '<tr>'+
						  '<th class=\"pcf-popup-phenotype_inlist\">Label(ja) </th>'+
						  '<td>'+name_ja+'</td>'+
						'</tr>'+
						'<tr>'+
						  '<th class=\"pcf-popup-phenotype_inlist\">Label(en) </th>'+
						  '<td>'+name_en+'</td>'+
						'</tr>';
		}

		content +=		'<tr>'+
						  '<th class=\"pcf-popup-phenotype_inlist\">Definition</th>'+
						  '<td>'+definition+'</td>'+
						'</tr>'+
						'<tr>'+
						  '<th class=\"pcf-popup-phenotype_inlist\">Comment   </th>'+
						  '<td>'+comment+'</td>'+
						'</tr>'+
						'<tr>'+
						  '<th class=\"pcf-popup-phenotype_inlist\">Synonym   </th>'+
						  '<td>'+synonym+'</td>'+
						'</tr>'+
					  '</table>';

		return [content, max_text_len];
	}

	function _contruct_popup_button(hpo_id, url_hpo_tooltip, lang){
		let button = document.createElement('button');
		button.textContent = hpo_id;
		button.classList.add("list-tag");

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
			popup_url:    url_hpo_tooltip + hpo_id,
			popup_id:     hpo_id,
			popup_lang:   lang,
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
 
				let url    = instance.props.popup_url;
				let hpo_id = instance.props.popup_id;
				let lang   = instance.props.popup_lang;
				
				$.ajax({	
					url:       url,
					type:     'GET',
					async:     true,
					dataType: 'text'
				}).done(function(data,textStatus,jqXHR) {
						let json_data = JSON.parse(data);
						let [content, max_text_len] = _contruct_popup_content(hpo_id,json_data, lang);
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
			}
		});
		
		return $(button);
	}

	function _construct_data_panel_phenotype(url_str, url_hpo_tooltip, lang, $container){

		$.ajax({  
			url:      url_str,  
			method:   "GET",  
			async:    true,  	
			dataType: "text",
			success:function(data){  

				let json_data = JSON.parse(data);
/*
				{
					"hpo_category_name_en": "Abnormality of the genitourinary system",
					"hpo_category_name_ja": "泌尿生殖器異常",
					"hpo_id": "HP:0000028",
					"hpo_url": "http://purl.obolibrary.org/obo/HP_0000028",
					"hpo_label_en": "Cryptorchidism",
					"hpo_label_ja": "停留精巣",
					"definition": "Testis in inguinal canal."
				}
*/
				let hash = {};
				json_data.forEach(function(item){

					let category = item.hpo_category_name_en;
					if(lang === LANGUAGE_JA && 'hpo_category_name_ja' in item && item.hpo_category_name_ja){
						category = item.hpo_category_name_ja;
					}

					if(!(category in hash)){
						hash[category] = {};
					}

					hash[category][item.hpo_id] = item;
				});

				Object.keys(hash).sort().forEach(function(category){
					$('<label>').text(category).appendTo($container);
					let $table = $('<table>').appendTo($container);
					let $thead = $('<thead>').appendTo($table);
					let $thead_row = $('<tr>').appendTo($thead);

					PHENOTYPE_TABLE_HEADER.forEach(function(th_text){
						$('<th>').text(th_text).appendTo($thead_row);
					});
					
					let $tbody = $('<tbody>').appendTo($table);
					Object.keys(hash[category]).sort(function(hpo_id_a,hpo_id_b){
						let item_a = hash[category][hpo_id_a];
						let item_b = hash[category][hpo_id_b];

						let hpo_name_a = item_a.hpo_label_en;
						if(lang === LANGUAGE_JA && 'hpo_label_ja' in item_a && item_a.hpo_label_ja){
							hpo_name_a = item_a.hpo_label_ja;
						}

						let hpo_name_b = item_b.hpo_label_en;
						if(lang === LANGUAGE_JA && 'hpo_label_ja' in item_b && item_b.hpo_label_ja){
							hpo_name_b = item_b.hpo_label_ja;
						}
						
						if(hpo_name_a > hpo_name_b) return 1;
						
						if(hpo_name_a < hpo_name_b) return -1;
						
						return 0;
						
					}).forEach(function(hpo_id){
						let item = hash[category][hpo_id];
						let $row = $('<tr>').appendTo($tbody);

						let hpo_name = item.hpo_label_en;
						if(lang === LANGUAGE_JA && 'hpo_label_ja' in item && item.hpo_label_ja){
							hpo_name = item.hpo_label_ja;
						}
						let $hpo_id_td = $('<td>').appendTo($row);
						//if($.isFunction(popup_func)){
							_contruct_popup_button(hpo_id, url_hpo_tooltip, lang).appendTo($hpo_id_td);
						//}else{
						//	$('<a>').attr('href',item.hpo_url).attr('target','_blank').text(item.hpo_id).appendTo($hpo_id_td);
						//}

						let $label_td = $('<td>').css({'width':'80%','font-size':'1.0rem','vertical-align':'middle'}).appendTo($row);
						$label_td.text(hpo_name);				

						let $frequency_td = $('<td nowrap=\"nowrap\">').css({'font-size':'1.0rem','vertical-align':'middle'}).appendTo($row);
						if('frequency' in item){
							$frequency_td.text(item.frequency);
						}else{
							$frequency_td.text(' ');	
						}

						let $search_td = $('<td>').css({'white-space':'nowrap'}).appendTo($row);

						let search_image_href_str = "http://www.google.com/search?q=" + hpo_name +"&tbm=isch";
						//$('<a class=\"material-icons-outlined\">image</a>')
						$('<a class=\"material-icons\">image</a>')
							.attr('href',  search_image_href_str)
							.attr('target','_blank')
							.appendTo($search_td);
					
						let search_href_str = encodeURIComponent(hpo_name);
						search_href_str = "https://www.google.com/search?q=" + search_href_str;
						//$('<a class=\"material-icons-outlined\">textsms</a>')
						$('<a class=\"material-icons\">textsms</a>')
							.attr('href',  search_href_str)
							.attr('target','_blank')
							.css({'margin-left':'20px'})
							.appendTo($search_td);
					});
				});

				$container.removeClass(CLASS_INIT).addClass(CLASS_DATA_LOADED);	
			}  
		});  


	}

	function _construct_data_panel_gene(url_str){
		let str = "<script type=\"module\" src=\"https:\/\/togostanza.github.io\/metastanza\/pagination-table.js\" async><\/script>" +
				  "<style>"+
					"togostanza-pagination-table {--togostanza-tbody-font-size: 12px;--togostanza-background-color: #ffffff;}" +
				  "<\/style>"+
				  "<togostanza-pagination-table " +
			  		"data-url=\""+url_str+"\" " +
  					"data-type=\"json\" " +
					"custom-css-url=\"\" " +
					"width=\"\" " +
  					"fixed-columns=\"1\" " +
  					"padding=\"0px\" " +
  					"page-size-option=\"10,20,50,100\" " +
  					"page-slider=\"true\" " +
					"columns=\"[{&quot;id&quot;:&quot;hgnc_gene_symbol&quot;,&quot;label&quot;:&quot;Gene symbol&quot;},"+
							"{&quot;id&quot;:&quot;gene_id&quot;,&quot;label&quot;:&quot;Gene ID&quot;},"+
							"{&quot;id&quot;:&quot;disease_info&quot;,&quot;label&quot;:&quot;Disease name&quot;},"+
							"{&quot;id&quot;:&quot;source_name&quot;,&quot;label&quot;:&quot;Source&quot;}]\">" +
				  			"<\/togostanza-pagination-table>";
		return str;
	}
	
	var _setInnerHTML = function(elm, html) {
		elm.innerHTML = html;
		Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
			const newScript = document.createElement("script");
			Array.from(oldScript.attributes).forEach( attr => newScript.setAttribute(attr.name, attr.value) );
			newScript.appendChild(document.createTextNode(oldScript.innerHTML));
			oldScript.parentNode.replaceChild(newScript, oldScript);
		});
	}

	function _construct_data_panel(target, url_str, url_hpo_tooltip, lang, container_dom){
		if(target === TARGET_PHENOTYPE_LIST){
			_construct_data_panel_phenotype(url_str, url_hpo_tooltip, lang, $(container_dom));
		}else{
			let html_str = _construct_data_panel_gene(url_str);
			$(container_dom).removeClass(CLASS_INIT).addClass(CLASS_DATA_LOADED);
			_setInnerHTML(container_dom,html_str);
		}
	}


	var methods = {
		init: function(options) {

			let setting = $.extend(true,{}, DEFAULT_SETTINGS, options || {});

			// init elements
			let $container = this;
			//let $list_show_button_panel = $("<div>").addClass("list-show").addClass('d-flex flex-row').appendTo($container);
			let $list_show_button_panel = $("<div>").addClass("list-show").addClass('d-flex flex-wrap').appendTo($container);
			for(let i=0; i<TARGET_LIST.length; i++){

				let target          = TARGET_LIST[i],
					url_key         = URL_KEY_LIST[i],
					url             = setting[url_key],
					count_key       = COUNT_KEY_LIST[i],
					count           = setting[count_key],
					label           = LABEL_LIST[i],
					language        = setting[KEY_LANGUAGE],
					url_hpo_tooltip = setting[KEY_URL_HPO_TOOLTIP];

				$("<div>").addClass("list-show-panel").addClass(CLASS_INIT)
						.data(KEY_TARGET,          target)
						.data(KEY_URL,             url)
						.data(KEY_URL_HPO_TOOLTIP, url_hpo_tooltip)
						.data(KEY_LANGUAGE,        language)
						.appendTo($container);				

				let $a = $('<a>').data(KEY_TARGET,target)
								 .data(KEY_COUNT,count)
								 .text(label)
								 .appendTo($list_show_button_panel);

				if(i>0) $a.addClass("v_line_left");
				
				$("<span>Show("+count+")</span>").appendTo($a);
				if(count > 0){
					$a.click(function(){
						let $button  = $(this);
						let target_b = $button.data(KEY_TARGET);
						let count    = $button.data(KEY_COUNT);
						
						$button.toggleClass(CLASS_ACTIVE);
						if($button.hasClass(CLASS_ACTIVE)){
							$button.find('span').text('Hide('+count+')');
						}else{
							$button.find('span').text('Show('+count+')');
						}
						
						$button.siblings().each(function(){
							let $b       = $(this);
							let target_s = $b.data(KEY_TARGET);
							let c        = $b.data(KEY_COUNT);
							if(target_s !== target_b){
								$b.removeClass(CLASS_ACTIVE);
								$b.find('span').text('Show('+c+')');
							}
						});


						$button.parent().siblings().each( function () {
							let $panel = $(this); 
							let target_panel    = $panel.data(KEY_TARGET);
							let target_url      = $panel.data(KEY_URL);
							let target_language = $panel.data(KEY_LANGUAGE);
							let url_hpo_tooltip = $panel.data(KEY_URL_HPO_TOOLTIP);
							
							if(target_panel === target_b){
								$panel.toggleClass(CLASS_ACTIVE);

								if($panel.hasClass(CLASS_ACTIVE) && $panel.hasClass(CLASS_INIT)){
									// construct panel
									_construct_data_panel(target_panel, target_url, url_hpo_tooltip, target_language, this);
								}
							}else{
								$panel.removeClass(CLASS_ACTIVE);
							}
						});
					});
				}
			}
			
			for(let i=0; i<LINK_KEY_HASH.length; i++){
				let id_key  = LINK_KEY_HASH[i].id;
				let url_key = LINK_KEY_HASH[i].url;
				if(!_isEmpty(setting[id_key]) && !_isEmpty(setting[url_key])){
					if(setting[url_key].indexOf('|')){
						let url_lst = setting[url_key].split('|');
						let id_lst  = setting[id_key].split('|');
						for(let n=0;n<url_lst.length;n++){
							$("<a>").text(id_lst[n])
								.addClass('vgp-link')
								.attr( 'href', url_lst[n]).attr('target', '_blank')
								.appendTo($list_show_button_panel);
						}
					}else{
						$("<a>").text(setting[id_key])
							.addClass('vgp-link')
							.attr( 'href', setting[url_key]).attr('target', '_blank')
							.appendTo($list_show_button_panel);
					}
				}
			}
			
			return this.each(function () {
				$(this);
			});
		}
	};
	
	$.fn.vgp_collapse_panel = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};

}(jQuery));
