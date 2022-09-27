;(function ($) {

	//const HPO_DIC="/static/data/POET_dictionary_manbyoAB_temp_ver.02-01-with.tsv.utf8.bits.20220612.v4",
	const HPO_DIC="/static/data/HPO-japanese.20220414-20220831.textinput.txt",
		  IS_NOTOBSERVED_REGEX='[な無](かった|く|い|し)|(られ|され|おら|せ|でき|出来|みえ|認め)ず',
		  IS_NOTOBSERVED_CHARS_NUM=20,
		  IS_NOTOBSERVED_STOP_LETTERS=["\,","\.","\。","\．","\\n"];


	const SETTINGS_KEY     = 'textInputHPOSettings',
		  OBJECT_KEY       = 'textInputHPOObject',
		  SCHEMA_AUTO      = 'auto',
		  SCHEMA_MANUAL    = 'manual',
		  OBSERVED_Y       = 'observed',
		  OBSERVED_N       = 'notobserved',
		  CLASS_OBSERVED_Y = 'observed',
		  CLASS_OBSERVED_N = 'notobserved',
		  CLASS_CHOSEN     = 'chosen';

	const LANGUAGE_EN='en', LANGUAGE_JA='ja',
		  LANGUAGE = {
			[LANGUAGE_EN] : {
				'placeholder' : 'Import Human Phenotype Onotology(HPO) Term Ids. You can extract multiple HPO term ids from any kind of textual input. HPO term ids must satisfy the format HP:xxxxxxx to be recognized.',
				'sample_label': {
					[OBSERVED_Y] : 'Observed',
					[OBSERVED_N] : 'Not Observed'
				},
				'TEXT2HPO_URL': 'https://doc2hpo.wglab.org/',
				'TEXT2HPO_BTN_TITLE': 'Input Free-Text (doc2hpo)'
			},
			[LANGUAGE_JA] : {
				'placeholder' : 'Import Human Phenotype Onotology(HPO) Term Ids. You can extract multiple HPO term ids from any kind of textual input. HPO term ids must satisfy the format HP:xxxxxxx to be recognized.',
				'sample_label': {
					[OBSERVED_Y] : '症状あり',
					[OBSERVED_N] : '症状なし'
				},
                'TEXT2HPO_URL': '/ehr',
                'TEXT2HPO_BTN_TITLE': '文章から症状を自動抽出'
			}
		}	
	;
 
 	// Keys "enum"
	const KEY = {
		BACKSPACE	 : 8,
		TAB		     : 9,
		ENTER		 : 13,
		SHIFT		 : 16,
		CTRL		 : 17,
		ALT			 : 18,
		ESCAPE	     : 27,
		SPACE		 : 32,
		PAGE_UP	     : 33,
		PAGE_DOWN	 : 34,
		END		     : 35,
		HOME		 : 36,
		LEFT		 : 37,
		UP		     : 38,
		RIGHT		 : 39,
		DOWN		 : 40,
		DELETE       : 46,
		NUMPAD_ENTER : 108,
		COMMA		 : 188
	};


	var DEFAULT_SETTINGS = {
		schema:   SCHEMA_AUTO,
		language: LANGUAGE_EN,
		
		// function called when output hpo list.
		output_hpo: null,
        
        searchDelay: 3000
	};


	var _isFunction = function(value) {
		return $.isFunction(value);
	},
	_isEmpty = function(value, allowEmptyString) {
		return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (isArray(value) && value.length === 0);
	},
	_isDefined = function(value) {
		return typeof value !== 'undefined';
	},
	_hasJA = function( str ) {
		return ( str && str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/) )? true : false;
	},
	_hasDE = function( str ) {
		return ( str && str.match(/[äöüÄÖÜß]+/) )? true : false;
	},
	_hasNL = function( str ) {
		return ( str && str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/) )? true : false;
	},
	_text_input_show_loader = function(text){
		if(text){
			$('#text-input-loader-text').text(text);
		}else{
			$('#text-input-loader-text').text("");
		}
		if($('#text-input-loader').css('display') === 'none') $("#text-input-loader").fadeIn("normal");
	},
	_text_input_hide_loader = function(){
		if($('#text-input-loader').css('display') === 'none') return;
		$("#text-input-loader").fadeOut("slow");
	};

	var methods = {
		
		init: function(options) {
			var settings = $.extend(true,{}, DEFAULT_SETTINGS, options || {});
			return this.each(function () {
				$(this).data(SETTINGS_KEY, settings);
				$(this).data(OBJECT_KEY, new $.TextInputHPO(this, settings));
			});
		},
		start_modal_with_text: function(text){
			$(this).data(OBJECT_KEY).start_modal_with_text(text);
		}
	};

	$.fn.textinput_hpo = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};


	$.TextInputHPO = function (btn_trigger, settings) {
		
		var $btn_trigger = $(btn_trigger);
		
		var current_settings = $btn_trigger.data(SETTINGS_KEY);

		// hpo dic object
		var hpo_dic = new $.TextInputHPO.HPO_dic();
		
		//
		// construct UI
		//
		var $modal = $('<div>').addClass('modal fade')
							   .attr({'id':'text-input-modal','tabindex':-1,'role':'dialog','aria-labelledby':'text-input-modal-title','aria-hidden':true})
							   .css({'z-index':'1050'})
							   .scroll(function(e) {e.stopPropagation();})
							   .appendTo("body");
		var $modal_dialog  = $('<div>').addClass('modal-dialog modal-dialog-centered modal-xl').appendTo($modal);
		var $modal_content = $('<div>').addClass('modal-content').appendTo($modal_dialog);

		// loader ui
		var $text_input_loader = $('<div>').attr('id', 'text-input-loader').appendTo($modal_content);
		var $div_loader_wrapper = $('<div>').addClass("d-flex flex-row").appendTo($text_input_loader);
		$('<span>').addClass("text-input-loader-gif").appendTo($div_loader_wrapper);
		$('<span>').attr('id', 'text-input-loader-text').appendTo($div_loader_wrapper);

        // modal content
		var $modal_header  = $('<div>').addClass('modal-header p-0 d-flex flex-row').appendTo($modal_content);
		$('<h5><img src=\"/static/images/pcf/HPOID.svg\"></img> Extract Phenotypes And Human Phenotype Ontology Term Ids From Free-Text</h5>')
			.addClass('modal-title').addClass('flex-fill').attr('id','text-input-modal-title').appendTo($modal_header);
		let lng = current_settings.language === LANGUAGE_JA ? LANGUAGE_JA : LANGUAGE_EN;
		let $text2hpo_btn = $('<button>').addClass('text2hpo-button')
										.data('TEXT2HPO_URL', LANGUAGE[lng]['TEXT2HPO_URL'])
										.click(function(){window.open($(this).data('TEXT2HPO_URL'),'_blank');})
										.appendTo($modal_header);
        $('<img>').attr({
                'src':            '/static/images/pcf/text_black.svg',
                'data-toggle':    'tooltip',
                'data-placement': 'top',
                'title':          LANGUAGE[lng]['TEXT2HPO_BTN_TITLE']
        }).appendTo($text2hpo_btn);

		var $modal_body = $('<div>').addClass('modal-body m-0 p-0 d-flex justify-content-between').appendTo($modal_content);		

		var $text_input_textarea_wrapper = $('<div>').addClass('text-input-wrapper').appendTo($modal_body);
		var $text_input_textarea         = new $.TextInputHPO.HPO_textarea(current_settings.language, function(hpo_id){$text_input_table.chosen(hpo_id);});
		$text_input_textarea.get_textarea().appendTo($text_input_textarea_wrapper);
			
		var $text_input_table_wrapper    = $('<div>').addClass('text-input-wrapper').appendTo($modal_body);
		var $text_input_table = new $.TextInputHPO.HPO_table(
                                        current_settings.language, 
                                        function(hpo_id){$text_input_textarea.chosen(hpo_id);},
                                        function(hpo_id,class_observed){$text_input_textarea.changeObservedStatus(hpo_id, class_observed);}
                                    );
		$text_input_table.get_table().appendTo($text_input_table_wrapper);

        if(current_settings.schema === SCHEMA_AUTO) {
			//SCHEMA_AUTO
			let tid = $text_input_textarea.get_textarea_id();
			$('body').on('paste input', '#'+tid, function() {
                _trigger_parse_text();
			});			
            
			$('body').on('keydown', '#'+tid, function(event) {
                switch(event.keyCode) {
				  case KEY.LEFT:
				  case KEY.RIGHT:
				  case KEY.UP:
				  case KEY.DOWN:
                  case KEY.ESCAPE:
                  case KEY.TAB:
                  case KEY.SHIFT:
                  case KEY.CTRL:
                  case KEY.ALT:        
                  case KEY.ESCAPE:
                  case KEY.PAGE_UP:
                  case KEY.PAGE_DOWN:
                  case KEY.END:
                  case KEY.HOME:
                      //console.log('no input,code ' + event.keyCode);
                      break;
                  default:
                    //console.log('input,code ' + event.keyCode);
                    setTimeout(function(){ _trigger_parse_text();}, 50);
                    break;
                }
			});			            
            
		}else{
			//SCHEMA_MANUAL
			$('<button>').attr('id','text-input-parse-button').addClass("round-button material-icons").text('chevron_right')
						 .click(function(){_parse_text();}).appendTo($modal_body);
		}

		var $modal_footer = $('<div>').addClass('modal-footer px-0 pb-0 d-flex justify-content-between').appendTo($modal_content);

		var $div_sample = $('<div>').addClass('d-flex flex-row').appendTo($modal_footer);		
		$('<span>').addClass(CLASS_OBSERVED_Y).text(LANGUAGE[current_settings.language]['sample_label'][OBSERVED_Y]).appendTo($div_sample);
		$('<span>').addClass(CLASS_OBSERVED_N).css({'margin-left':'10px'}).text(LANGUAGE[current_settings.language]['sample_label'][OBSERVED_N]).appendTo($div_sample);
		
		var $div_button = $('<div>').addClass('d-flex flex-row mr-0').appendTo($modal_footer);
		$('<button>').addClass('btn btn-secondary py-1').attr('id',"text-input-clear-button").text("CLEAR")
					 .click(function(){
						$text_input_textarea.clear();
						$text_input_table.clear();				
					 })
					 .appendTo($div_button);
		
		$('<button>').addClass('btn btn-secondary py-1').attr('data-dismiss',"modal").attr('id',"text-input-close-button").text("CANCEL").appendTo($div_button);
									   
		$('<button>').addClass('btn btn-primary py-1 mr-0').attr('id',"text-input-apply-button").text("APPLY")
					 .click(function(){
						let hpo_list = $text_input_table.get_hpo_list();
						if(hpo_list.length){
							var settings = $btn_trigger.data(SETTINGS_KEY);
							if(_isFunction(settings.output_hpo)){
								$('#text-input-close-button').trigger('click');
								settings.output_hpo(hpo_list);
							}else{
								alert("HPO output function was not set.");
							}
						}else {
							alert("No HPO selected.");							
						}
					 })
					 .appendTo($div_button);

		// attach trigger
		$btn_trigger.click(function(){
			var modal = document.getElementById('text-input-modal');
			$(modal).modal('show');
		});
		
		this.start_modal_with_text = function(text){
			$btn_trigger.data("pre_set_text", text);
			var modal = document.getElementById('text-input-modal');
			$(modal).modal('show');
		};
		
		$('#text-input-modal').on('show.bs.modal', function () {
			$text_input_textarea.clear();
			$text_input_table.clear();				

			if(!hpo_dic.isLoaded()){
				hpo_dic.load_HPO_DIC_from_server();
			}
		});

		$('#text-input-modal').on('shown.bs.modal', function () {
			if($btn_trigger.data("pre_set_text")){
				$text_input_textarea.add_text($btn_trigger.data("pre_set_text"));
				setTimeout(function(){_parse_text();}, 500);
				$btn_trigger.data("pre_set_text", "");
			}
			$text_input_textarea.set_focus();
		});
		
		// end of ui initialize

		setTimeout(function(){
			hpo_dic.load_HPO_DIC_from_server(true);
		}, 500);
				
		//
		// functions of parsing text
		//	
        var timeout;
        function _trigger_parse_text(){
            clearTimeout(timeout);
            timeout = setTimeout(function(){_parse_text();}, $(btn_trigger).data(SETTINGS_KEY).searchDelay);
        }
        
		var _parse_text = function(){
			//clear table
			$text_input_table.clear();
			
			// get the user input text from textarea
			let usr_input_text = $text_input_textarea.get_text();
			if(usr_input_text.length === 0){
				alert('Please input first!');
				$text_input_textarea.set_focus();
				return false;
			} 
			
			usr_input_text = _normalize_text(usr_input_text);
			
			// find hpo match in text
			let hpomatches = _search_hpomatch_from_text(usr_input_text);
			
			// output match to table
			$text_input_table.add(hpomatches);
			
			// output match to textarea
			$text_input_textarea.add(usr_input_text, hpomatches);
		};

		function _normalize_text(note) {
			if(note.length === 0) return "";
			let parsed_text = jaconv.normalize(note);
			if ( String.prototype.normalize ) {
			  parsed_text = parsed_text.normalize("NFKC");
			}
			return parsed_text;
		}
		
		function _check_observed_status(startpos, text){
			
			let endpos   = Math.min(startpos + IS_NOTOBSERVED_CHARS_NUM, text.length);
			let str = text.substring(startpos, endpos).trim();
			
			for( let n=0; n<IS_NOTOBSERVED_STOP_LETTERS.length; n++) {
				let stop_letter = IS_NOTOBSERVED_STOP_LETTERS[n];
				let idx_stop = str.indexOf(stop_letter);
				if(idx_stop >=0)str = str.substring(0,idx_stop);
			}
			
			if(str && str.match(IS_NOTOBSERVED_REGEX)){
				return false;
			}
			
			return true;
		}

		function _search_hpomatch_from_text(text) { 
			let text1 = text.toUpperCase();
		 
			let matches_lst = [];

			let idx_hashtable = {};
			
			$.each(hpo_dic.get_dic(), function(i, item) {

				let hpo_term = item.SEARCH_KEY;
		
				if(hpo_term.length > 0){
		
					// check if longer was chosen already.
					let none_longer_found = true;			
					let long_lst_str = item.PARENTS;
					if(long_lst_str.length > 0) {
						let long_lst = long_lst_str.split(",");
						for(let j = 0; j < long_lst.length; j++){
							let key = 'idx_'+ long_lst[j];
							if(idx_hashtable[key]){
								none_longer_found = false;
								break;
							}
						} 
					}
		
					if(none_longer_found){
						let counter = 0;
						for(let pos = text1.indexOf(hpo_term); pos !== -1; pos = text1.indexOf(hpo_term, pos + 1)) {
							let term_in_text = text.substring(pos, pos + hpo_term.length);
							let obj = {start:		   pos,
										end:		   pos + hpo_term.length -1,
										id_in_dic:	   item.HPO_ID,
										term_in_dic:   hpo_term,
										eterm_in_dic:  item.ET,
										jterm_in_dic:  item.JT,
										term_in_text:  term_in_text,
										is_observed:   _check_observed_status(pos+hpo_term.length, text)
							};
							matches_lst.push(obj);
							counter = counter + 1;
						}
		
						if(counter > 0){
							let key = 'idx_'+i;
							idx_hashtable[key] = counter;
						}
					}else{
						//check overlap
						for(let pos = text1.indexOf(hpo_term); pos !== -1; pos = text1.indexOf(hpo_term, pos + 1)) {
							let start = pos;
							let end   = pos + hpo_term.length -1;
							let isOverlapped = false;
							for(let idx=0; idx<matches_lst.length;idx++){
								if( end < matches_lst[idx].start || start > matches_lst[idx].end){
									//no overlap
								}else{
									//found overlap
									isOverlapped = true;
									break;
								}
							}
		
							if(!isOverlapped){
								let term_in_text = text.substring(pos, pos + hpo_term.length);
								let obj = {start:		 pos,
										   end:			 pos + hpo_term.length -1,
										   id_in_dic:	 item.HPO_ID,
										   term_in_dic:  hpo_term,
										   eterm_in_dic: item.ET,
										   jterm_in_dic: item.JT,
										   term_in_text: term_in_text,
										   is_observed:  _check_observed_status(pos+hpo_term.length, text)
								};
								
								matches_lst.push(obj);
							   
								let key = 'idx_'+i;
								if(key in idx_hashtable){
									idx_hashtable[key] = idx_hashtable[key] + 1;
								}else{
									idx_hashtable[key] = 1;
								}
							}
						}
				   }
			   }
			});
		
			idx_hashtable.length = 0;
		
			// Startの順にソート（昇順）
			matches_lst.sort(function(a, b) {
				if (a.start < b.start) return -1;
				if (a.start > b.start) return 1;
				if (a.end < b.end) return -1;
				if (a.end > b.end) return 1;
				return 0;
			});
		
			//_remove_overlap(matches_lst);
			return matches_lst;
		}
		
	};

	$.TextInputHPO.HPO_textarea = function (language, onChosen) {
		
		this.language = language;
		
		var $textarea = $('<div>').attr('id', 'text-input-area')
								  .attr('contenteditable','true')
								  .attr('data-placeholder', LANGUAGE[this.language].placeholder)
                                  .attr('autocomplete','off')
                                  .attr('autocapitalize','off')
                                  .attr('spellcheck', false)
								  .addClass('text-input-textarea')
								  .on("paste", function (e) {
        e.preventDefault();

        var text;
        var clp = (e.originalEvent || e).clipboardData;
        if (clp === undefined || clp === null) {
            text = window.clipboardData.getData("text") || "";
            if (text !== "") {
                if (window.getSelection) {
                    var newNode = document.createElement("span");
                    newNode.innerHTML = text;
                    window.getSelection().getRangeAt(0).insertNode(newNode);
                } else {
                    document.selection.createRange().pasteHTML(text);
                }
            }
        } else {
            text = clp.getData('text/plain') || "";
            if (text !== "") {
                document.execCommand('insertText', false, text);
            }
        }
    });

		var onChosenSpan = onChosen;

		this.get_textarea_id = function(){
			return 'text-input-area';
		};

		this.clear = function(){
			$textarea.empty();
		};

		this.chosen = function(hpo_id){
			$textarea.find("span").removeClass(CLASS_CHOSEN);
			$textarea.find("span[data-hpo_id~='"+hpo_id+"']").addClass(CLASS_CHOSEN);
		};

		this.changeObservedStatus = function(hpo_id, class_observed){
			$textarea.find("span[data-hpo_id~='"+hpo_id+"']").removeClass(CLASS_OBSERVED_Y).removeClass(CLASS_OBSERVED_N).addClass(class_observed);
		};


								
		this.get_text = function(){
			
			let html_str = $textarea.html();

			let note = "";
						
			let idx = html_str.indexOf("<div>");
			if(idx >= 0){
				while(idx >= 0){
					// strip letters before <div>
					let str = html_str.substring(0,idx);
					note = note + str;
					html_str = html_str.substring(idx);
					
					// get <div>...</div>
					let idx2 = html_str.indexOf("</div>");
					let div_str = html_str.substring(0,idx2 + 6);
					if(note){
						note = note + "\n" + $(div_str).text();
					}else{
						note = $(div_str).text();
					}
					html_str = html_str.substring(idx2 + 6);
					
					idx = html_str.indexOf("<div>");
				}
				if(html_str.length > 0) {
					note = note + "\n" + html_str;
				}
				
			}else {
				note =  $textarea.text().trim();
			}
			
			return note;
		};

		this.set_focus = function(){
			setTimeout(function() {$textarea.trigger('focus');}, 10);
		};
		
		this.add_text = function(text){
			let lst = text.split('\n');
			let parsed_text = '<div>' + lst.join('</div><div>') + '</div>'; 
			$textarea.empty().append(parsed_text);
		};

		this.add = function(normalized_text, hpomatches){

			let formated_text = "";
			let current_start_pos = 0;
		
			for( let i=0; i<hpomatches.length; i++) {
				let start  = hpomatches[i].start;
				let end	   = hpomatches[i].end;
				let hpo_id = hpomatches[i].id_in_dic;
				
				let before_str = normalized_text.substring(current_start_pos, start);
				let hpo_str    = normalized_text.substring(start, end + 1);
		
				formated_text = formated_text + before_str;
		
				let class_from_symptoms = CLASS_OBSERVED_N;
				if(hpomatches[i].is_observed) class_from_symptoms = CLASS_OBSERVED_Y;
				formated_text = formated_text + '<span class=\"'+class_from_symptoms+'\" data-hpo_id=\"'+hpo_id+'\">' + hpo_str + '</span>';
			    current_start_pos = end + 1;
			}
		
			if(current_start_pos < normalized_text.length -1){
				let str = normalized_text.substring(current_start_pos);
				formated_text = formated_text + str;
			}

			let lst = formated_text.split('\n');
			let parsed_text = '<div>' + lst.join('</div><div>') + '</div>'; 
			
			$textarea.empty().append(parsed_text);
			
			$textarea.find('span').click(function(event){
				event.stopPropagation();
				event.preventDefault();
				$textarea.find('span').removeClass(CLASS_CHOSEN);
				$(this).addClass(CLASS_CHOSEN);
				if(_isFunction(onChosenSpan)) {
					let hpo_id = $(this).attr('data-hpo_id');					
					onChosenSpan(hpo_id);
				}
			});
		};

		this.get_textarea = function(){
			return $textarea;
		};
		
	};

	
	$.TextInputHPO.HPO_table = function (language, onChosen, onChange) {
		
		this.language = language;
		
		var $table = $('<table>').addClass("text-input-table form-control table table-hover p-0 ").attr('id','hpo-list-input-table');
		var $tbody = $('<tbody>').appendTo($table);
		var onChosenRow = onChosen;
		var onChangeObservedStatus = onChange;

		var _change_observed_state = function(hpo_id, observed_class){
			$table.find("td[data-hpo_id~='"+hpo_id+"']").removeClass(CLASS_OBSERVED_Y).removeClass(CLASS_OBSERVED_N);
			$table.find("td[data-hpo_id~='"+hpo_id+"']").addClass(observed_class);
			if(_isFunction(onChangeObservedStatus)){
				onChangeObservedStatus(hpo_id, observed_class);
			}
		};

		this.clear = function(){
			$table.find("tr").remove();
		};

		this.chosen = function(hpo_id){
			$table.find("tr").removeClass(CLASS_CHOSEN);
			$table.find("tr[data-hpo_id~='"+hpo_id+"']").addClass(CLASS_CHOSEN);
			
			let id = $table.find("tr[data-hpo_id~='"+hpo_id+"']").attr('id');
			var element = document.getElementById(id);
			element.scrollIntoViewIfNeeded(); // Centers the element in the visible area
		};
		
		this.get_hpo_list = function(){
			let ret = [];
        	$table.find("input[name='hpo_list']:checked").each(function(){
				let hpo_item = $(this).data('HPO_ITEM');
				ret.push(hpo_item);
			});
			return ret;
		};
		
		this.add = function(hpomatches){
			
			
			let hpo_list = {};
			for( let i=0; i<hpomatches.length; i++) {
				let id_in_dic	= hpomatches[i].id_in_dic;
				let is_observed =  hpomatches[i].is_observed;
				if(id_in_dic in hpo_list){
					if(!is_observed) hpo_list[id_in_dic].is_observed = is_observed;
				}else{
					hpo_list[id_in_dic] = hpomatches[i];
				}
			}
			
			let rows = [];
			let i = 0;
			for( let key in hpo_list) {
				let id_in_dic	 = hpo_list[key].id_in_dic;
			  	let jterm_in_dic = hpo_list[key].jterm_in_dic;
			  	let eterm_in_dic = hpo_list[key].eterm_in_dic;
				let is_observed  = hpo_list[key].is_observed;

				//let $tr = $('<tr>').addClass('table-secondary').appendTo($table);
				let $tr = $('<tr>').addClass('table-secondary').addClass(is_observed?CLASS_OBSERVED_Y:CLASS_OBSERVED_N)
								   .attr('data-hpo_id', id_in_dic)
								   .attr('id', 'text-input-table-row-' + i)
								   .click(function(){
										$table.find('tr').removeClass(CLASS_CHOSEN);
										$(this).addClass(CLASS_CHOSEN);
										
										if(_isFunction(onChosenRow)) {
											let hpo_id = $(this).attr('data-hpo_id');
											onChosenRow(hpo_id);
										}
								   });

				let $td1 = $('<td>').addClass('selection').appendTo($tr);
				let $cbx = $('<input>', {type: 'checkbox', name: 'hpo_list', "checked":"checked"}).appendTo($td1);
				
				let name_text = eterm_in_dic;
				if(this.language === LANGUAGE_JA && jterm_in_dic) name_text = jterm_in_dic;
				let hpo_id = id_in_dic;
				if(this.language === LANGUAGE_JA && jterm_in_dic) hpo_id = hpo_id + "_ja";
				$cbx.css({'margin-bottom':'unset'}).data('HPO_ITEM', {'id':hpo_id, 'name':name_text}).change(function() {
					//$(this).parent().parent().toggleClass('table-secondary');
					$(this).closest('tr').toggleClass('table-secondary');
				});

				let $td2 = $('<td>').attr('data-hpo_id',id_in_dic).addClass(is_observed?CLASS_OBSERVED_Y:CLASS_OBSERVED_N).addClass('hpo_id').appendTo($tr);
				$('<span>').text(id_in_dic).appendTo($td2);
				
				let $td3 = $('<td>').addClass('hpo_name').appendTo($tr);
				let str = eterm_in_dic;
				if(this.language === LANGUAGE_JA && jterm_in_dic) str = jterm_in_dic; 
				$td3.text(str);
								
				let $td4 = $('<td>').appendTo($tr);
				let $div = $('<div>').addClass("dropdown").appendTo($td4);
				let btn_id = "dropdownMenuButton"+i;
				$('<span class=\"material-icons dropdown-toggle\" id=\"'+btn_id+'\" data-toggle=\"dropdown\" data-offset=\"-10,0\">').text('more_vert').appendTo($div);
				let $ul = $('<ul>').addClass("dropdown-menu dropdown-menu-right").attr('aria-labelledby', btn_id).appendTo($div);

				let $li_ctl_upper1 = $('<li style=\"cursor: pointer;\" role=\"presentation\">').addClass("selected").appendTo($ul);
				$('<span>').data('hpo_id',id_in_dic).data('is_observed', true)
						.addClass(CLASS_OBSERVED_Y)
						.click(function(event){
							let id_in_dic = $(this).data('hpo_id');
							$(this).closest("tr").removeClass(CLASS_OBSERVED_Y).removeClass(CLASS_OBSERVED_N).addClass(CLASS_OBSERVED_Y);
							_change_observed_state(id_in_dic,CLASS_OBSERVED_Y);
							event.stopPropagation();
						})
						.text(LANGUAGE[this.language]['sample_label'][OBSERVED_Y])
						.appendTo($li_ctl_upper1);
						
				let $li_ctl_upper2 = $('<li style=\"cursor: pointer;\" role=\"presentation\">').addClass("").appendTo($ul);
				$('<span>').data('hpo_id',id_in_dic).data('is_observed', false)
						.addClass(CLASS_OBSERVED_N)
						.click(function(event){
							let id_in_dic = $(this).data('hpo_id');
							$(this).closest("tr").removeClass(CLASS_OBSERVED_Y).removeClass(CLASS_OBSERVED_N).addClass(CLASS_OBSERVED_N);
							_change_observed_state(id_in_dic,CLASS_OBSERVED_N);
							event.stopPropagation();
						})
						.text(LANGUAGE[this.language]['sample_label'][OBSERVED_N])
						.appendTo($li_ctl_upper2);

                //$table.append($tr);
				rows.push($tr);
				i++;
			}


			var j = 0;
			var inter = setInterval(function() {
			    if (j < rows.length) {
			      //$table.append(rows[j]);
			      //$table.find('tr:last-child').hide(); //hide the row
			      //$table.find('tr:last-child').show('slow'); //show the row
				  $tbody.append(rows[j]);
				  $tbody.find('tr:last-child').hide();
				  $tbody.find('tr:last-child').show('slow');
			      j++;
			    } else {
			      clearInterval(inter);
			    }
			  }, 50); //milli-second gap you want to give
			
			$('.dropdown-toggle').dropdown();
		};		

		this.get_table=function(){
			return $table;
		};
	};
	
	$.TextInputHPO.HPO_dic = function () {

		var hpo_dic_json = [];

		this.get_dic = function(){
			return hpo_dic_json; 
		};


		this.isLoaded = function(){
			return hpo_dic_json.length > 0; 
		};

		this.load_HPO_DIC_from_server = function(isSilentLoading){
		
			if(!isSilentLoading) _text_input_show_loader();
		
			$.get(HPO_DIC)
			 .done(function(data) {
				let lines   = data.split("\n");
				let headers = lines[0].split("\t");
				
				for(let i=1; i<lines.length; i++){
			
					if(lines[i].trim().length == 0) continue;
					
					let obj = {};
					let currentline=lines[i].split("\t");
					for(let j=0; j<headers.length; j++){
						obj[headers[j]] = currentline[j];
					}
					hpo_dic_json.push(obj);
				}
				
			 })
			 .fail(function(errorThrown ) {
			 	alert(errorThrown);
			 })
			 .always(function() {
			    if(!isSilentLoading) _text_input_hide_loader(); 
			 });
		};
	};

}(jQuery));
