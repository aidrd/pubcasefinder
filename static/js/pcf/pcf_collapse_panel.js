;(function ($) {

	const	TARGET_PHENOTYPE_LIST = "phenotype-list",
			TARGET_JA_CASE_LIST   = "japanese-case-list",
			TARGET_EN_CASE_LIST   = "english-case-list",
			TARGET_LIST           = [TARGET_PHENOTYPE_LIST,TARGET_JA_CASE_LIST,TARGET_EN_CASE_LIST],
			KEY_URL_PHENOTYPE     = "PCF-URL-PHENOTYPE",
			KEY_URL_CASE_REPORT_EN= "PCF-URL-CASE_REPORT_EN",
			KEY_URL_CASE_REPORT_JA= "PCF-URL-CASE_REPORT_JA",
			URL_KEY_LIST          = [KEY_URL_PHENOTYPE,KEY_URL_CASE_REPORT_JA,KEY_URL_CASE_REPORT_EN],
			KEY_ID_PHENOTYPE      = "OMIM-ORPHA-ID",
			KEY_ID_MONDO          = "MONDO-ID",
			KEY_COUNT_PHENOTYPE   = "COUNT_PHENOTYPE",
			KEY_COUNT_JA_CASE     = "COUNT_JA_CASE",
			KEY_COUNT_EN_CASE     = "COUNT_EN_CASE",
			COUNT_KEY_LIST        = [KEY_COUNT_PHENOTYPE,KEY_COUNT_JA_CASE,KEY_COUNT_EN_CASE],
			KEY_LABEL_PHENOTYPE   = "LABEL_PHENOTYPE",
			KEY_LABEL_JA_CASE     = "LABEL_JA_CASE",
			KEY_LABEL_EN_CASE     = "LABEL_EN_CASE",
			LABEL_KEY_LIST        = [KEY_LABEL_PHENOTYPE,KEY_LABEL_JA_CASE,KEY_LABEL_EN_CASE],
			STATUS_LOADED         = "status-loaded",
			CLASS_ACTIVE          = "pcf-active",
			CLASS_INIT            = "status-empty",
			CLASS_DATA_LOADED     = "pcf-data-loaded",
			KEY_TARGET            = "pcf-target",
			KEY_URL               = "pcf-url",
			LANG_EN               = "en",
			LANG_JA               = "ja",
			KEY_LANG              = "PCF-LANGUAGE",
			KEY_HPO_ID            = "PCF-HPO-ID",
			KEY_HPO_NAME          = "PCF-HPO-NAME";
		
	var DEFAULT_SETTINGS = {
		[KEY_LABEL_PHENOTYPE]   : '',
		[KEY_LABEL_JA_CASE]     : '',
		[KEY_LABEL_EN_CASE]     : '',
		[KEY_URL_PHENOTYPE]     : '',
		[KEY_URL_CASE_REPORT_EN]: '',
		[KEY_URL_CASE_REPORT_JA]: '',
		[KEY_ID_PHENOTYPE]      : '',
		[KEY_ID_MONDO]          : '',
		[KEY_COUNT_PHENOTYPE]   : 0,
		[KEY_COUNT_JA_CASE]     : 0,
		[KEY_COUNT_EN_CASE]     : 0,
		[KEY_LANG]              : LANG_JA
	};


	function _construct_data_panel_ja_case_report(url_str){
		let str = "<script type=\"module\" src=\"https:\/\/togostanza.github.io/metastanza/pagination-table.js\" async=\"\"><\/script>" +
				  "<togostanza-pagination-table " +
  					"data-url=\""+url_str+"\" " +
  					"data-type=\"json\" " +
  					"padding=\"0\" " +
  					"page-size-option=\"10,20,50,100\" " +
  					"page-slider=\"false\" " +
  					"columns=\"[{&quot;id&quot;:&quot;id&quot;,&quot;label&quot;:&quot;J-STAGE ID&quot;,&quot;link&quot;:&quot;url&quot;},"+
							   "{&quot;id&quot;:&quot;pyear&quot;,&quot;label&quot;:&quot;Year&quot;},"+
							   "{&quot;id&quot;:&quot;title&quot;,&quot;label&quot;:&quot;Title&quot;}]\">" +
				 "</togostanza-pagination-table>";
		return str;
	}

	function _construct_data_panel_en_case_report(url_str){
		let str = "<script type=\"module\" src=\"https:\/\/togostanza.github.io/metastanza/pagination-table.js\" async=\"\"><\/script>" +
				  "<togostanza-pagination-table " +
			  		"data-url=\""+url_str+"\" " +
  					"data-type=\"json\" " +
  					"padding=\"0\" " +
  					"page-size-option=\"10,20,50,100\" " +
  					"page-slider=\"false\" " +
					"columns=\"[{&quot;id&quot;:&quot;id&quot;,&quot;label&quot;:&quot;PMID&quot;,&quot;link&quot;:&quot;url&quot;},{&quot;id&quot;:&quot;pyear&quot;,&quot;label&quot;:&quot;Year&quot;},{&quot;id&quot;:&quot;title&quot;,&quot;label&quot;:&quot;Title&quot;}]\">"+
				  "</togostanza-pagination-table>";
		return str;
	}

	function _construct_data_panel_phenotype(url_str, lang, $container){
		$.ajax({  
			url:    url_str,  
			method: "GET",  
			async:  true,  	
			dataType: "text",
			success:function(data){  

				let json_data = JSON.parse(data);

				// contruct data
				let hash_data = {};
				json_data.forEach(function(item){
					
					let category_name = item.hpo_category_name_en;
					let hpo_label     = item.hpo_label_en;
					let hpo_id        = item.hpo_id;
					let hpo_url       = item.hpo_url;
					
					if(lang === LANG_JA && 'hpo_category_name_ja' in item){
						category_name = item.hpo_category_name_ja;
					}

					if(lang === LANG_JA && 'hpo_label_ja' in item){
						hpo_label     = item.hpo_label_ja;
					}
					
					if(category_name in hash_data){
						hash_data[category_name].push({'id':hpo_id,'url':hpo_url,'label':hpo_label});
					}else{
						hash_data[category_name] = [];
						let item_hpo = {'id':hpo_id,'url':hpo_url,'label':hpo_label};
						hash_data[category_name].push(item_hpo);
					}
				});
				
				// contruct url
				let $table = $('<table>').appendTo($container);
				Object.keys(hash_data).sort().forEach(function(category_name){
					let $tr_category = $('<tr>').appendTo($table);
					$('<td>').text(category_name).addClass("category").appendTo($tr_category);
					
					let array = hash_data[category_name].sort(function(a, b) {
    					return a.label.localeCompare(b.label);
					}); 
					array.forEach(function(item_hpo){
						
						let $tr_hpo = $('<tr>').appendTo($table);
						let $td_hpo = $('<td>').addClass("item").appendTo($tr_hpo);
						$('<a>').attr('href',item_hpo.url).attr('target','_blank').text(item_hpo.label).appendTo($td_hpo);
						$('<span class=\"material-icons\">post_add</span>')
							.data(KEY_HPO_ID,item_hpo.id)
							.data(KEY_HPO_NAME,item_hpo.label)
							.click(function(){
								let $span = $(this);
								let hpo_id = $span.data(KEY_HPO_ID);
								let hpo_name = $span.data(KEY_HPO_NAME);
								$("#tokeninput_hpo").tokenInput("add", {id: hpo_id, name: hpo_name});
							})
							.appendTo($td_hpo);
					});
				});
					
				$container.removeClass(CLASS_INIT).addClass(CLASS_DATA_LOADED);	
			}  
		});  


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

	function insertAndExecute(id, text) {
		document.getElementById(id).innerHTML = text;
		var scripts = Array.prototype.slice.call(document.getElementById(id).getElementsByTagName("script"));
		for (var i = 0; i < scripts.length; i++) {
			if (scripts[i].src != "") {
				var tag = document.createElement("script");
				tag.src = scripts[i].src;
				document.getElementsByTagName("head")[0].appendChild(tag);
			}
			else {
				eval(scripts[i].innerHTML);
			}
		}
	}

	function _construct_data_panel(target, url_str, lang, container_dom){
		if(target === TARGET_PHENOTYPE_LIST){
			_construct_data_panel_phenotype(url_str, lang, $(container_dom));
		}else{

			let html_str = _construct_data_panel_ja_case_report(url_str);

			if(target === TARGET_EN_CASE_LIST){
				html_str = _construct_data_panel_en_case_report(url_str);
			}
			//$(html_str).appendTo($container);
			//$container.html(html_str)
			$(container_dom).removeClass(CLASS_INIT).addClass(CLASS_DATA_LOADED);
			_setInnerHTML(container_dom,html_str);
		}
	}
	
	var methods = {
		init: function(options) {

			let setting = $.extend(true,{}, DEFAULT_SETTINGS, options || {});
			
			// init elements
			let $container = this;
			let $list_show_button_panel = $("<div>").addClass("list-show").appendTo($container);
			
			for(let i=0; i<TARGET_LIST.length; i++){

				let target=TARGET_LIST[i],url_key=URL_KEY_LIST[i],count_key=COUNT_KEY_LIST[i],label_key=LABEL_KEY_LIST[i];
				
				$("<div>").addClass("list-show-panel").addClass(CLASS_INIT)
						  .data(KEY_TARGET,target).data(KEY_URL,setting[url_key]).data(KEY_LANG,setting[KEY_LANG])
						  .appendTo($container);				

				let $a = $('<a>').data(KEY_TARGET,target).text(setting[label_key]).appendTo($list_show_button_panel);
				if(i>0) $a.addClass("v_line_left");
				$("<span>Show("+setting[count_key]+")</span>").appendTo($a);
				if(setting[count_key] > 0){
					$a.click(function(){
						let $button =$(this);
						let target_b =  $button.data(KEY_TARGET);
						$button.toggleClass(CLASS_ACTIVE);
						$button.siblings().removeClass(CLASS_ACTIVE);
						$button.parent().siblings().each( function () {
							let $panel = $(this); 
							let target_panel = $panel.data(KEY_TARGET);
							let target_url   = $panel.data(KEY_URL);
							let lang         = $panel.data(KEY_LANG);
							if(target_panel === target_b){
								$panel.toggleClass(CLASS_ACTIVE);

								if($panel.hasClass(CLASS_ACTIVE) && $panel.hasClass(CLASS_INIT)){
									// construct panel
									_construct_data_panel(target_panel, target_url, lang, this);
								}
							}else{
								$panel.removeClass(CLASS_ACTIVE);
							}
						});
					});
				}
			}
			
			return this.each(function () {
				$(this);
			});
		}
	};
	
	$.fn.pcf_collapse_panel = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};

}(jQuery));
