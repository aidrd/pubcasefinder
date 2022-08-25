;(function ($) {

	const SETTINGS_KEY='listInputSettings', OBJECT_KEY='listInputObject',
		  SCHEMA_HPO='hpo', SCHEMA_FILTER='filter',
		  LANGUAGE_EN='en', LANGUAGE_JA='ja',
		  LANGUAGE = {
			[SCHEMA_HPO]: {
				[LANGUAGE_EN] : {
					'title': 'Import Hpo Term List',
					'title2' : 'Import Human Phenotype Onotology(HPO) Term Ids.<br /> You can extract multiple HPO term ids from any kind of textual input. HPO term ids must satisfy the format HP:xxxxxxx to be recognized.'
				},
				[LANGUAGE_JA] : {
					'title': 'Import Hpo Term List',
					'title2' : 'Import Human Phenotype Onotology(HPO) Term Ids.<br /> You can extract multiple HPO term ids from any kind of textual input. HPO term ids must satisfy the format HP:xxxxxxx to be recognized.'
				}
			},
			[SCHEMA_FILTER]: {
				[LANGUAGE_EN] : {
					'title': 'Import NCBI Gene IDs',
					'title2' :'You can extract multiple NCBI Gene IDs from any kind of textual input.<br /> NCBI Gene IDs must satisfy the format <b>GENEID:xxxxxxx</b> to be recognized.'
				},
				[LANGUAGE_JA] : {
					'title': 'Import NCBI Gene IDs',
					'title2' : 'You can extract multiple NCBI Gene IDs from any kind of textual input.<br /> NCBI Gene IDs must satisfy the format <b>GENEID:xxxxxxx</b> to be recognized.'
				}
			}
		},
		CLASS_OBSERVED_Y = 'observed',
		CLASS_OBSERVED_N = 'notobserved',
		CLASS_CHOSEN     = 'chosen';
 
	var DEFAULT_SETTINGS = {
		schema:         SCHEMA_HPO,
		language:       LANGUAGE_EN,
		output_list:    null,
		url_geneid:		null,
        url_genesymbol: null,
        url_hpoid:      null
	};

	const reg_number = new RegExp('^[0-9]*$');
	
	var _isFunction = function(value) {return $.isFunction(value);},
	_isObject   = function(value) {return $.isPlainObject(value);},
	_isArray    = function(value) {return $.isArray(value);},
	_isEmpty    = function(value, allowEmptyString) {
		return	(value === null) || (value === undefined) || 
				(!allowEmptyString ? value === '' : false) || 
				(_isArray(value) && value.length === 0)||
				(_isObject(value) && Object.keys(value).length === 0);	
	},
	_isNumber = function(str){
		return reg_number.test(str);
	},
	_attach_prefix_to_id = function(prefix, id){
		return prefix + '-' + id;
	},
    _parseJson= function(text) {
        var json_data = null;
        try {
            json_data = JSON.parse(text);
        } catch (d) {}
        return json_data;
    },
	_uniq_fast = function(a) {
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
	};


	var methods = {
		init: function(options) {
			var settings = $.extend(true,{}, DEFAULT_SETTINGS, options || {});
			return this.each(function () {
				$(this).data(SETTINGS_KEY, settings);
				$(this).data(OBJECT_KEY, new $.ListInput(this, settings));
			});
		},
		start_modal_with_text: function(text){
			$(this).data(OBJECT_KEY).start_modal_with_text(text);
		}
	};

	$.fn.listinput = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			return methods.init.apply(this, arguments);
		}
	};


	$.ListInput = function (btn_trigger, settings) {
		
		var $btn_trigger = $(btn_trigger);

        var prefix = $btn_trigger.attr('id');
        
		var current_settings = $btn_trigger.data(SETTINGS_KEY);

		//
		// construct UI
		//
		var modal_id = _attach_prefix_to_id(prefix, 'list-input-modal');
		var modal_title_id = _attach_prefix_to_id(prefix, 'list-input-modal-title');
		var $modal = $('<div>').addClass('modal fade list-input-modal')
							   .attr({'id':modal_id,'tabindex':-1,'role':'dialog','aria-labelledby':modal_title_id,'aria-hidden':true})
							   .appendTo("body");
		var $modal_dialog  = $('<div>').addClass('modal-dialog modal-dialog-centered modal-xl').appendTo($modal);
		var $modal_content = $('<div>').addClass('modal-content p-5').appendTo($modal_dialog);

		// loader ui
		var list_input_loader_id = _attach_prefix_to_id(prefix, 'list-input-loader');
		var list_input_loader_msg_id = _attach_prefix_to_id(prefix, 'list-input-loader-msg');
		var $list_input_loader = $('<div>').attr('id', list_input_loader_id).addClass('list-input-loader').appendTo($modal_content);
		var $div_loader_wrapper = $('<div>').addClass("d-flex flex-row").appendTo($list_input_loader);
		$('<span>').addClass("list-input-loader-gif").appendTo($div_loader_wrapper);
		$('<span>').addClass("list-input-loader-text").attr('id', list_input_loader_msg_id).appendTo($div_loader_wrapper);

		var _show_loader = function(text){
			var prefix = $btn_trigger.attr('id');
			var list_input_loader_id = _attach_prefix_to_id(prefix, 'list-input-loader');
			var list_input_loader_msg_id = _attach_prefix_to_id(prefix, 'list-input-loader-msg');
			if(text){
				$('#' + list_input_loader_msg_id).text(text);
			}else{
				$('#' + list_input_loader_msg_id).text("");
			}
			if($('#' + list_input_loader_id).css('display') === 'none') $("#" + list_input_loader_id).fadeIn("normal");
		},
		_hide_loader = function(){
			var prefix = $btn_trigger.attr('id');
			var list_input_loader_id = _attach_prefix_to_id(prefix, 'list-input-loader');			
			if($('#' + list_input_loader_id).css('display') === 'none') return;
			$("#" + list_input_loader_id).fadeOut("slow");
		};

		//var $modal_header  = $('<div>').addClass('modal-header p-0').css({'border-bottom':'1px solid #dee2e6'}).appendTo($modal_content);
		var $modal_header  = $('<div>').addClass('modal-header list-input-header p-0').appendTo($modal_content);
		$('<h7><img src=\"/static/images/pcf/HPOID.svg\"></img> '+LANGUAGE[current_settings.schema][current_settings.language].title+'</h7>')
			.addClass('modal-title list-input-title').attr('id', modal_title_id).appendTo($modal_header);

		var $modal_header2  = $('<div>').addClass('modal-header py-3 px-0').css({'border':'0'}).appendTo($modal_content);
		$('<p>' + LANGUAGE[current_settings.schema][current_settings.language].title2 +'</p>').appendTo($modal_header2);

		var $modal_body = $('<div>').addClass('modal-body m-0 p-0 d-flex justify-content-between').appendTo($modal_content);		

		var $text_input_textarea_wrapper = $('<div>').addClass('list-input-wrapper').appendTo($modal_body);
		var $text_input_textarea         = new $.ListInput.ListInput_textarea(prefix,function(selected_id){$text_input_table.chosen(selected_id);});
		$text_input_textarea.get_textarea().appendTo($text_input_textarea_wrapper);

		var $text_input_table_wrapper    = $('<div>').addClass('list-input-wrapper').appendTo($modal_body);
		var $text_input_table            = new $.ListInput.ListInput_table(current_settings.language,prefix,function(selected_id){$text_input_textarea.chosen(selected_id);});
		$text_input_table.get_table().appendTo($text_input_table_wrapper);

		var parse_btn_id = _attach_prefix_to_id(prefix, 'list-input-parse-button');
		$('<button>').attr('id',parse_btn_id).addClass("round-button material-icons list-input-parse-button").text('chevron_right')
					 .click(function(){_parse_text();}).appendTo($modal_body);

		var $modal_footer = $('<div>').addClass('modal-footer px-0 pb-0 d-flex justify-content-between').appendTo($modal_content);

		$('<div>').addClass('d-flex flex-row').appendTo($modal_footer);		
		
		var $div_button = $('<div>').addClass('d-flex flex-row mr-0').appendTo($modal_footer);
		
		var close_btn_id = _attach_prefix_to_id(prefix, "list-input-close-button");
		var $close_button = $('<button>').addClass('btn btn-secondary py-1').attr('data-dismiss',"modal").attr('id',close_btn_id).text("CANCEL").appendTo($div_button);
		
		var apply_btn_id = _attach_prefix_to_id(prefix, "list-input-apply-button");
		$('<button>').addClass('btn btn-primary py-1 mr-0').attr('id',apply_btn_id).text("APPLY")
					 .click(function(){
						let list = $text_input_table.get_list();
						if(list.length){
							var settings = $btn_trigger.data(SETTINGS_KEY);
							if(_isFunction(settings.output_list)){
								$close_button.trigger('click');
								settings.output_list(list);
							}else{
								alert("output function was not set.");
							}
						}else {
							alert("No items selected.");							
						}
					 })
					 .appendTo($div_button);

		// attach trigger
		$btn_trigger.click(function(){
			var prefix = $btn_trigger.attr('id');
			var modal_id = _attach_prefix_to_id(prefix, 'list-input-modal');
			var modal = document.getElementById(modal_id);
			$(modal).modal('show');
		});
		
		this.start_modal_with_text = function(text){
			$btn_trigger.data("pre_set_text", text);
			var prefix = $btn_trigger.attr('id');
			var modal_id = _attach_prefix_to_id(prefix, 'list-input-modal');
			var modal = document.getElementById(modal_id);
			$(modal).modal('show');
		};
		
		$('#'+modal_id).on('show.bs.modal', function () {
			$text_input_textarea.clear();
			$text_input_table.clear();				
		});

		$('#'+modal_id).on('shown.bs.modal', function () {
			if($btn_trigger.data("pre_set_text")){
				let text = $btn_trigger.data("pre_set_text");
				$text_input_textarea.add_text(text);
				setTimeout(function(){_parse_text();}, 500);
				$btn_trigger.data("pre_set_text", "");
			}
			$text_input_textarea.set_focus();
		});
		
		// end of ui initialize

		//
		// functions of parsing text
		//	
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
			let text1 = usr_input_text.toUpperCase();	
			
			var settings_now = $btn_trigger.data(SETTINGS_KEY);
			
			let r = null;
			if(settings_now.schema === SCHEMA_HPO){
				r = text1.match(/HP:(\d){7}/g);
			}else{
				r = text1.match(/(ENT|GENEID):(\d)+/g);
			}

			if(!r && settings_now.schema === SCHEMA_HPO){
                alert("HPO term ids must satisfy the format HP:XXXXXXX.");
                $text_input_textarea.set_focus();
                return false;
			}

			
			let ajax_item_list=[];
			let data_hash = {};
            let type_hpo = 'hpo';
            let type_geneid = 'geneid';
            let type_genesymbol = 'genesymbol';
			if(current_settings.schema === SCHEMA_HPO){
                if(!settings_now.url_hpoid){
        			alert("The URL that retrieve HPO term is not defined.");
                    return;
                }else{
                    let ids_text = r.join(',');
                    let url_str = settings_now.url_hpoid + '?hpo_id=' + ids_text;
                    let obj = {[SETTING_KEY_URLSTR]:url_str, 'type': type_hpo};
                    ajax_item_list.push(obj);
                }
			}else{
                if(r){
                    if(!settings_now.url_geneid){
                        alert("The URL that retrieve GENEID is not defined.");
                        return;
                    }
                    let ids_text = r.join(',');
                    let url_str = settings_now.url_geneid + '?gene_id=' + ids_text;
                    let obj = {[SETTING_KEY_URLSTR]:url_str, 'type': type_geneid};
                    ajax_item_list.push(obj);
                }

                if(!settings_now.url_genesymbol){
                    alert("The URL that retrieve GENE SYMBOL is not defined.");
                    return;
                }
                let url_str = settings_now.url_genesymbol + '?hgnc_gene_symbol=' + (text1.replace(/\n/g,',').replace(/\&/g,','));
                let obj = {[SETTING_KEY_URLSTR]:url_str, 'type': type_genesymbol};
                ajax_item_list.push(obj);
			}

			var callback_success = function(data,item){
				let json_data = _parseJson(data);
				if(!_isEmpty(json_data)){
                    if(item.type === type_hpo){
                        for(let jid in json_data){
                            data_hash[jid] = json_data[jid];
                        }
                    }else if(item.type === type_geneid){
                        for(let jid in json_data){
                            let obj={};
                            obj[jid] = json_data[jid];
                            data_hash[jid] = obj;
                        }
                    }else{
                        for(let i=0;i<json_data.length;i++){
                            let obj={};
                            let geneid  = 'GENEID:' + json_data[i]['ncbi_gene_id'];
                            let name_en = json_data[i]['hgnc_gene_symbol'];
                            obj[geneid] = {'name_en':name_en, 'name_ja':''};
                            data_hash[name_en] = obj;
                        }
                    }
				}
			};

			var callback_fail = function() {
                _hide_loader();
				alert('Server access error!');
			};

            var callback_fail_after_all_call = function(){
				_hide_loader();
			};

			var callback_after_all_call = function(){
				_hide_loader();

				if(_isEmpty(data_hash)){
					alert('no term found at text');
					return;
				}
                
                let unique = Object.keys(data_hash);
                unique.sort(function(a, b) {
                    if (a.length < b.length) return 1;	
                    if (a.length > b.length) return -1;
                    return 0;
                });

                let longers_hash = {};
                for(let i=unique.length-1;i>=0;i--){
                    let key = unique[i];
                    let longers = [];
                    for(let j = i-1 ; j >= 0; j--){
                        let key_long = unique[j];
                        let idx = key_long.indexOf(key);
                        if(idx >= 0){
                            longers.push(j);
                        }
                    }
                    longers_hash[key] = longers;
                }
                
				let matches_lst = [];
				let idx_hashtable = {};
				$.each(unique, function(i, item) {
					if(settings_now.schema === SCHEMA_HPO){
						for(let pos=text1.indexOf(item); pos !== -1; pos = text1.indexOf(item, pos + 1)) {
							//let term_in_text = usr_input_text.substring(pos, pos + item.length);
							let obj =  {start:	 pos,
										end:	 pos + item.length -1,
										id:		 item,
										name_en: data_hash[item].name_en,
										name_ja: data_hash[item].name_ja
										};
							matches_lst.push(obj);
						}
						return;
					}
					
					let none_longer_found = true;			
					let long_lst = longers_hash[item];
					if(long_lst.length > 0) {
						for(let j=0; j<long_lst.length; j++){
							let key = 'idx_'+ long_lst[j];
							if(idx_hashtable[key]){
								none_longer_found = false;
								break;
							}
						} 
					}

                    let isGeneID = false;
                    if(item.startsWith('GENEID:')){isGeneID = true;}

					if(none_longer_found){
						let counter = 0;
						for(let pos=text1.indexOf(item); pos !== -1; pos = text1.indexOf(item, pos + 1)) {
							
							//check if a part of a longer id
                            if(isGeneID){
                                let pos_next_letter = pos + item.length;
                                if(pos_next_letter < text1.length){
                                    let next_letter = text1.substring(pos_next_letter, pos_next_letter + 1);
                                    if(_isNumber(next_letter)){
                                        // is a part of a longer item which has no value in json_data
                                        continue;
                                    }
                                }
                            }
							//let term_in_text = usr_input_text.substring(pos, pos + item.length);
							let d = data_hash[item];
							let geneid = Object.keys(d)[0];
							let obj =  {start:	 pos,
										end:	 pos + item.length -1,
										id:		 geneid,
										name_en: d[geneid].name_en,
										name_ja: d[geneid].name_ja
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
						for(let pos = text1.indexOf(item); pos !== -1; pos = text1.indexOf(item, pos + 1)) {
							let start = pos;
							let end   = pos + item.length -1;
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
								
								//check if a part of a longer id
                                if(isGeneID){
                                    let pos_next_letter = pos + item.length;
                                    if(pos_next_letter < text1.length){
                                        let next_letter = text1.substring(pos_next_letter, pos_next_letter + 1);
                                        if(_isNumber(next_letter)){
                                            // is a part of a longer item which has no value in json_data
                                            continue;
                                        }
                                    }
                                }
								//let term_in_text = usr_input_text.substring(pos, pos + item.length);
								let d = data_hash[item];
								let geneid = Object.keys(d)[0];								
								let obj = { start:	 pos,
											end:	 pos + item.length -1,
											id:		 geneid,
											name_en: d[geneid].name_en,
											name_ja: d[geneid].name_ja

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
				});

				if(matches_lst.length === 0){
					alert('no term found at text');
					return;
				}

				matches_lst.sort(function(a, b) {
					if (a.start < b.start) return -1;	
					if (a.start > b.start) return 1;
					if (a.end < b.end) return -1;
					if (a.end > b.end) return 1;
					return 0;
				});
				
				// output match to table
				$text_input_table.add(matches_lst);
				
				// output match to textarea
				$text_input_textarea.add(usr_input_text, matches_lst);
                
			};


			_show_loader('load data from server');
			if(ajax_item_list.length === 0){
				// do download
				callback_after_all_call();
			}else if(ajax_item_list.length === 1){
			
				_run_ajax(ajax_item_list[0][SETTING_KEY_URLSTR],'GET', null, 'text', true, function(data){
					callback_success(data,ajax_item_list[0]);
					// do logical ,create ranking list, and continue
					callback_after_all_call();
					return;
				});
			
				return;
			}else {
				_run_ajax_sequential(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call);
			}
        };

        var _run_ajax = function(url_str,http_type,post_data,response_dataType,async,callback,callback_fail){
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
                    _hide_loader();
                    alert('Server access error:' + textStatus + ":" + errorThrown + '\nURL: ' + url_str);
                });
            }
        };

        const SETTING_KEY_URLSTR = 'url_str_full';
        var _run_ajax_sequential = function(ajax_item_list, callback_success, callback_fail, callback_after_all_call, callback_fail_after_all_call){

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
                _hide_loader();
                return;
            });
        };
    };

	$.ListInput.ListInput_textarea = function (prefix, onChosen) {
		
		var $textarea = $('<div>').attr('id', _attach_prefix_to_id(prefix, 'list-input-textarea'))
								  .attr('contenteditable','true')
								  .addClass('list-input-textarea');

		var onChosenSpan = onChosen;

		this.get_textarea_id = function(){
			//return 'text-input-area';
			return $textarea.attr('id');
		};
		
		this.clear = function(){
			$textarea.empty();
		};

		this.chosen = function(selected_id){
			$textarea.find("span").removeClass(CLASS_CHOSEN);
			$textarea.find("span[data-list_id~='"+selected_id+"']").addClass(CLASS_CHOSEN);
		};

		this.changeObservedStatus = function(selected_id, class_observed){
			$textarea.find("span[data-list_id~='"+selected_id+"']").removeClass(CLASS_OBSERVED_Y).removeClass(CLASS_OBSERVED_N).addClass(class_observed);
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
			$textarea.empty();
			$textarea.append(parsed_text);
		};

		this.add = function(normalized_text, matches){

			let formated_text = "";
			let current_start_pos = 0;
		
			for( let i=0; i<matches.length; i++) {
				let start  = matches[i].start;
				let end	   = matches[i].end;
				let hpo_id = matches[i].id;
				
				let before_str = normalized_text.substring(current_start_pos, start);
				let hpo_str    = normalized_text.substring(start, end + 1);
		
				formated_text = formated_text + before_str;
		
				let class_from_symptoms = CLASS_OBSERVED_N;
				if(matches[i].is_observed) class_from_symptoms = CLASS_OBSERVED_Y;
				formated_text = formated_text + '<span class=\"'+class_from_symptoms+'\" data-list_id=\"'+hpo_id+'\">' + hpo_str + '</span>';
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
					let hpo_id = $(this).attr('data-list_id');					
					onChosenSpan(hpo_id);
				}
			});
		};

		this.get_textarea = function(){
			return $textarea;
		};
		
	};

	
	$.ListInput.ListInput_table = function (language, prefix, onChosen) {

		this.language = language;

		var $table = $('<table>').addClass("list-input-table form-control table table-hover p-0 ")
								 .attr('id',_attach_prefix_to_id(prefix,'hpo-list-input-table'));

		var onChosenRow = onChosen;

		this.clear = function(){
			$table.find("tr").remove();
		};

		this.chosen = function(selected_id){
			$table.find("tr").removeClass(CLASS_CHOSEN);
			$table.find("tr[data-list_id~='"+selected_id+"']").addClass(CLASS_CHOSEN);
			
			let id = $table.find("tr[data-list_id~='"+selected_id+"']").attr('id');
			var element = document.getElementById(id);
			element.scrollIntoViewIfNeeded(); // Centers the element in the visible area
		};
		
		this.get_list = function(){
			let ret = [];
			$table.find("input[name='list_input']:checked").each(function(){
				let hpo_item = $(this).data('LIST_ITEM');
				ret.push(hpo_item);
			});
			return ret;
		};
		
		this.add = function(hpomatches){
			
			let prefix = $table.attr('id');
			
			let hpo_list = {};
			for( let i=0; i<hpomatches.length; i++) {
				let id	= hpomatches[i].id;
				if(!(id in hpo_list)){
					hpo_list[id] = hpomatches[i];
				}
			}
			
//			let rows = [];
			let i = 0;
			for( let key in hpo_list) {
				let id	 = hpo_list[key].id;
			  	let jterm_in_dic = hpo_list[key].name_ja;
			  	let eterm_in_dic = hpo_list[key].name_en;

				//let $tr = $('<tr>').addClass('table-secondary').appendTo($table);
				let $tr = $('<tr>').addClass('table-secondary').addClass(CLASS_OBSERVED_Y)
								   .attr('data-list_id', id)
								   .attr('id', _attach_prefix_to_id(prefix, 'text-input-table-row-' + i))
								   .click(function(){
										$table.find('tr').removeClass(CLASS_CHOSEN);
										$(this).addClass(CLASS_CHOSEN);
										
										if(_isFunction(onChosenRow)) {
											let hpo_id = $(this).attr('data-list_id');
											onChosenRow(hpo_id);
										}
								   });

				let $td1 = $('<td>').addClass('selection').appendTo($tr);
				let $cbx = $('<input>', {type: 'checkbox', name: 'list_input', "checked":"checked"}).appendTo($td1);
				
				let name_text = eterm_in_dic;
				if(this.language === LANGUAGE_JA && jterm_in_dic) name_text = jterm_in_dic;
				let hpo_id = id;
				if(this.language === LANGUAGE_JA && jterm_in_dic) hpo_id = hpo_id + "_ja";
				$cbx.css({'margin-bottom':'unset'}).data('LIST_ITEM', {'id':hpo_id, 'name':name_text}).change(function() {
					$(this).closest('tr').toggleClass('table-secondary');
				});

				let $td2 = $('<td>').attr('data-list_id',id).addClass(CLASS_OBSERVED_Y).addClass('hpo_id').appendTo($tr);
				$('<span>').text(id).appendTo($td2);
				
				let $td3 = $('<td>').addClass('hpo_name').appendTo($tr);
				let str = eterm_in_dic;
				if(this.language === LANGUAGE_JA && jterm_in_dic) str = jterm_in_dic; 
				$td3.text(str);

				//rows.push($tr);
                $table.append($tr);
				i++;
			}

/*
			if(rows.length < 30){
				var j = 0;
		
				var inter = setInterval(function() {
				    if (j < rows.length) {
				      $table.append(rows[j]);
				      $table.find('tr:last-child').hide(); //hide the row
				      $table.find('tr:last-child').show('slow'); //show the row
				      j++;
				    } else {
				      clearInterval(inter);
				    }
				  }, 100); //milli-second gap you want to give
			}else{
				for(let j=0;j < rows.length; j++){
					$table.append(rows[j]);
				}
			}
 */
		};		

		this.get_table=function(){
			return $table;
		};
	};
	
}(jQuery));
