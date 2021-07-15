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
			KEY_COUNT             = "pcf-count",
			LANG_EN               = "en",
			LANG_JA               = "ja",
			KEY_LANG              = "PCF-LANGUAGE",
			KEY_HPO_ID            = "PCF-HPO-ID",
			KEY_HPO_NAME          = "PCF-HPO-NAME";

	const PHENOTYPE_TABLE_HEADER = ['Add','HPO:ID','Label','Description'];
			
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

	function _hasJA(str){
		return ( str && str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/) )? true : false;
	}

	function _construct_data_panel_ja_case_report(url_str){
		let str = "<script type=\"module\" src=\"https:\/\/togostanza.github.io/metastanza/pagination-table.js\" async><\/script>" +
				"<style>"+
					"togostanza-pagination-table {--togostanza-tbody-font-size: 12px;--togostanza-background-color: #ffffff;}" +
				"<\/style>"+
				  "<togostanza-pagination-table " +
  					"data-url=\""+url_str+"\" " +
  					"data-type=\"json\" " +
  					"padding=\"0px\" " +
  					"page-size-option=\"10,20,50,100\" " +
  					"page-slider=\"false\" " +
  					"columns=\"[{&quot;id&quot;:&quot;pyear&quot;,&quot;label&quot;:&quot;Year&quot;},"+
						   "{&quot;id&quot;:&quot;title&quot;,&quot;label&quot;:&quot;Title&quot;},"+
						   "{&quot;id&quot;:&quot;journal&quot;,&quot;label&quot;:&quot;Journal&quot;},"+
						   "{&quot;id&quot;:&quot;id&quot;,&quot;label&quot;:&quot;J-STAG&quot;,&quot;link&quot;:&quot;url&quot;},"+
						   "{&quot;id&quot;:&quot;id_jglobal&quot;,&quot;label&quot;:&quot;J-GLOBAL&quot;,&quot;link&quot;:&quot;url_jglobal&quot;}]\">" +
				 "</togostanza-pagination-table>";
		return str;
	}

	function _construct_data_panel_en_case_report(url_str){
		let str = "<script type=\"module\" src=\"https:\/\/togostanza.github.io/metastanza/pagination-table.js\" async=\"\"><\/script>" +
                                "<style>"+
                                        "togostanza-pagination-table {--togostanza-tbody-font-size: 12px;--togostanza-background-color: #ffffff;}" +
                                "<\/style>"+
				  "<togostanza-pagination-table " +
			  		"data-url=\""+url_str+"\" " +
  					"data-type=\"json\" " +
  					"padding=\"0px\" " +
  					"page-size-option=\"10,20,50,100\" " +
  					"page-slider=\"false\" " +
					"columns=\"[{&quot;id&quot;:&quot;pyear&quot;,&quot;label&quot;:&quot;Year&quot;},"+
						   "{&quot;id&quot;:&quot;title&quot;,&quot;label&quot;:&quot;Title&quot;},"+
						   "{&quot;id&quot;:&quot;journal&quot;,&quot;label&quot;:&quot;Journal&quot;},"+
						   "{&quot;id&quot;:&quot;id&quot;,&quot;label&quot;:&quot;PubMed&quot;,&quot;link&quot;:&quot;url&quot;}]\">" +
				  "</togostanza-pagination-table>";
		return str;
	}
	
	function appendChildren(parentEl, children) {
		let children_sorted = children.sort(function(a, b) {return a.id.localeCompare(b.id)});
		for (let i = 0; i < children_sorted.length; i++) {
			let child = children_sorted[i];

			let $element = $('<div />');
			if('hpo_id' in child){
				$('<a>').attr('href',child.hpo_url).attr('target','_blank').text(child.id).appendTo($element);
				$('<span class=\"material-icons\">post_add</span>')
					.data(KEY_HPO_ID,child.hpo_id)
					.data(KEY_HPO_NAME,child.id)
					.click(function(){
						let $span = $(this);
						let hpo_id1 = $span.data(KEY_HPO_ID);
						let hpo_name1 = $span.data(KEY_HPO_NAME);
						if(_hasJA(hpo_name1)) hpo_id1 += '_ja';
						$("#tokeninput_hpo").tokenInput("add", {id: hpo_id1, name: hpo_name1});
					})
					.appendTo($element);

				$element.addClass('item');
			}else{
				$element.text(child.id);
			}


			if('children' in child){
				$element.addClass('category');
				appendChildren($element, child.children);
			}


			parentEl.append($element);
		}
	}


	function _construct_data_panel_phenotype(url_str, lang, $container){
		$.ajax({  
			url:    url_str,  
			method: "GET",  
			async:  true,  	
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
					"definition": "Testis in inguinal canal. That is, absence of one or both testes from the scrotum owing to failure of the testis or testes to descend through the inguinal canal to the scrotum."
				}
*/
				let hash = {};
				json_data.forEach(function(item){

					let category = item.hpo_category_name_en;
					if(lang === LANG_JA && 'hpo_category_name_ja' in item && item.hpo_category_name_ja){
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
					Object.keys(hash[category]).sort().forEach(function(hpo_id){
						let item = hash[category][hpo_id];
						let $row = $('<tr>').appendTo($tbody);

						let hpo_name = item.hpo_label_en;
						if(lang === LANG_JA && 'hpo_label_ja' in item && item.hpo_label_ja){
							hpo_name = item.hpo_label_ja;
						}
						let $td1 = $('<td nowrap=\"nowrap\">').appendTo($row);
						//$('<a>').attr('href',item.hpo_url).attr('target','_blank').text(item.hpo_id).appendTo($td1);
						$('<span class=\"material-icons\">post_add</span>')
							.data(KEY_HPO_ID,   item.hpo_id)
							.data(KEY_HPO_NAME, hpo_name)
							.click(function(){
								let $span = $(this);
								let hpo_id1 = $span.data(KEY_HPO_ID);
								let hpo_name1 = $span.data(KEY_HPO_NAME);
								if(_hasJA(hpo_name1)) hpo_id1 += '_ja';
								$("#tokeninput_hpo").tokenInput("add", {id: hpo_id1, name: hpo_name1});
							})
							.appendTo($td1);
						
						let $td2 = $('<td>').appendTo($row);
						$('<a>').attr('href',item.hpo_url).attr('target','_blank').text(item.hpo_id).appendTo($td2);
						
						$('<td>').text(hpo_name).appendTo($row);
						
						$('<td>').text(item.definition).appendTo($row);
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
				
				if(setting[KEY_LANG] === LANG_EN && target === TARGET_JA_CASE_LIST) continue; 
	
				$("<div>").addClass("list-show-panel").addClass(CLASS_INIT)
						  .data(KEY_TARGET,target).data(KEY_URL,setting[url_key]).data(KEY_LANG,setting[KEY_LANG])
						  .appendTo($container);				

				let $a = $('<a>').data(KEY_TARGET,target).data(KEY_COUNT,setting[count_key]).text(setting[label_key]).appendTo($list_show_button_panel);
				if(i>0) $a.addClass("v_line_left");
				$("<span>Show("+setting[count_key]+")</span>").appendTo($a);
				if(setting[count_key] > 0){
					$a.click(function(){
						let $button =$(this);
						let target_b = $button.data(KEY_TARGET);
						let count    = $button.data(KEY_COUNT);
						$button.toggleClass(CLASS_ACTIVE);
						if($button.hasClass(CLASS_ACTIVE)){
							$button.find('span').text('Hide('+count+')');
						}else{
							$button.find('span').text('Show('+count+')');
						}
						
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
