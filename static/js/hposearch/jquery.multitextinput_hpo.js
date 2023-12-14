;(function ($) {

    const HPO_DIC="/static/data/HPO-japanese.20221104.textinput.txt",
          IS_NOTOBSERVED_REGEX='[な無](かった|く|い|し)|(られ|され|おら|せ|でき|出来|みえ|認め)ず',
          IS_NOTOBSERVED_CHARS_NUM=20,
          IS_NOTOBSERVED_STOP_LETTERS=["\,","\.","\。","\．","\\n"];


    const SETTINGS_KEY     = 'textInputHPOSettings',
          OBJECT_KEY       = 'textInputHPOObject',
          OBSERVED_Y       = 'observed',
          OBSERVED_N       = 'notobserved',
          CLASS_OBSERVED_Y = 'observed',
          CLASS_OBSERVED_N = 'notobserved',
          CLASS_CHOSEN     = 'chosen',
          STATUS_KEY       = 'textInputHPOStatus',
          STATUS_INIT      = 'init',
          STATUS_LOADING   = 'loading',
          STATUS_LOADED    = 'loaded';

    const LANGUAGE_EN='en', LANGUAGE_JA='ja',
          LANGUAGE = {
            [LANGUAGE_EN] : {
                'placeholder' : 'Type in the patient phenotype description.',
                'sample_label': {
                    [OBSERVED_Y] : 'Observed',
                    [OBSERVED_N] : 'Not Observed'
                }
            },
            [LANGUAGE_JA] : {
                'placeholder' : 'テキストを入力し、真ん中の青い丸ボタンをクリックしてください。',
                'sample_label': {
                    [OBSERVED_Y] : '症状あり',
                    [OBSERVED_N] : '症状なし'
                }
            }
        }    
    ;

    var DEFAULT_SETTINGS = {
        language: LANGUAGE_EN,
        doc_list: null,
        output_hpo: null, //func that output hpos
        getDocByColId: null, //func that load text by docId
        trigger_close: null
    };


    var _isFunction = function(value) {
        return $.isFunction(value);
    },
    _isArray = function(value){
		return $.isArray(value);
	},
    _isDefined = function(value) {
        return typeof value !== 'undefined';
    },
    _isEmpty = function(value) {
        return (!(_isDefined(value))) || (value === null) ||  value === '' || (_isArray(value) && value.length === 0);
    },
    _hasJA = function( str ) {
        return ( str && str.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/) )? true : false;
    };
    
    var methods = {
        init: function(options) {
            var settings = $.extend(true,{}, DEFAULT_SETTINGS, options || {});
            return this.each(function () {
                $(this).data(SETTINGS_KEY, settings);
                $(this).data(OBJECT_KEY, new $.TextInputHPO(this));
            });
        },
        load_dic_if_needed: function(isSilentLoading){
            $(this).data(OBJECT_KEY).load_dic_if_needed(isSilentLoading);
        },
        set_text: function(text){
            $(this).data(OBJECT_KEY).set_text(text);
        },
        clear_input_area: function(text){
            $(this).data(OBJECT_KEY).clear_input_area();
        },
        find_names_by_id: function(hpo_list){
            return $(this).data(OBJECT_KEY).find_names_by_id(hpo_list);
        },
        set_text_bydocId: function(docId){
            $(this).data(OBJECT_KEY).set_text_bydocId(docId);
        }

    };

    $.fn.textinput_hpo = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else {
            return methods.init.apply(this, arguments);
        }
    };


    $.TextInputHPO = function (container) {
        
        let $container = $(container).data(STATUS_KEY, STATUS_INIT);
        
        let current_settings = $container.data(SETTINGS_KEY);

        let hpo_dic = new $.TextInputHPO.HPO_dic();
        
        //
        // construct UI
        //
        // loader ui
        let $text_input_loader = $('<div>').attr('id', 'text-input-loader').appendTo($container);
        let $div_loader_wrapper = $('<div>').addClass("d-flex flex-row").appendTo($text_input_loader);
        $('<span>').addClass("text-input-loader-gif").appendTo($div_loader_wrapper);
        $('<span>').attr('id', 'text-input-loader-text').appendTo($div_loader_wrapper);
        function _text_input_show_loader(text){
            if(text){
                $('#text-input-loader-text').text(text);
            }else{
                $('#text-input-loader-text').text("");
            }
            if($('#text-input-loader').css('display') === 'none') $("#text-input-loader").fadeIn("normal");
        };
        function _text_input_hide_loader(){
            if($('#text-input-loader').css('display') === 'none') return;
            $("#text-input-loader").fadeOut("slow");
        };

        // header
        let $header = $('<div>').addClass('text-input-header d-flex flex-wrap').appendTo($container);
        let $h5 = $('<h5>').addClass('flex-fill').appendTo($header);
        let html_str = "<img src=\"/static/record/images/HPOID.svg\">任意のテキストから臨床症状を自動抽出";
        $h5.html(html_str);

		
		let $sample_wrap = $('<div>').addClass('sample-wrap d-flex flex-nowrap').appendTo($header);
        $('<span>').addClass("sample").addClass(CLASS_OBSERVED_Y).addClass('mr-3').text(LANGUAGE[current_settings.language]['sample_label'][OBSERVED_Y]).appendTo($sample_wrap);
        $('<span>').addClass("sample").addClass(CLASS_OBSERVED_N).text(LANGUAGE[current_settings.language]['sample_label'][OBSERVED_N]).appendTo($sample_wrap); 


        let $doc_btn_wrapper = $('<div>').addClass('text-input-doc-btn-wrapper').appendTo($container);
         
        if(current_settings.doc_list){
          current_settings.doc_list.forEach(doc => {
            if(!doc.dataSrcColumnId) return;
            let btn = document.createElement('button');
            let btn_title = (doc.title).toUpperCase();
            btn.innerHTML = `<span class="material-symbols-outlined">playlist_add</span>${btn_title}`
            $(btn).data('docId', doc.docId).data('dataSrcColumnId',doc.dataSrcColumnId).addClass('doc')
                  .attr('id', `docBtn-${doc.docId}`)
                  .click(function(){
                        //paste text by id
                        let $btn = $(this)
                        let dataSrcColumnId = $btn.data('dataSrcColumnId')
                        if($btn.hasClass('selected')){
                            $btn.removeClass('selected');
                            _clear();
                        }else{
                            if(_isFunction(current_settings.getDocByColId)) {
                                _clear()
                                let text = current_settings.getDocByColId(dataSrcColumnId)
                                $text_input_textarea.add_text(text);
                                $text_input_textarea.set_focus();
                                $btn.addClass('selected')
                                if(text){
                                    setTimeout(function(){_parse_text();}, 100);
                                }
                            }else{
                                alert('func not defined')
                            }
                        }
                  })
                  .appendTo($doc_btn_wrapper);
          })
        }

        // content
        let $content = $('<div>').addClass('text-input-content d-flex justify-content-between').appendTo($container);
        let $text_input_textarea_wrapper = $('<div>').addClass('text-input-wrapper')
                                                     .scroll(function(e) {e.stopPropagation();})
                                                     .appendTo($content);
        let $text_input_textarea         = new $.TextInputHPO.HPO_textarea(current_settings.language, function(hpo_id){$text_input_table.chosen(hpo_id);});
        $text_input_textarea.get_textarea().appendTo($text_input_textarea_wrapper);

        let $text_input_table_wrapper    = $('<div>').addClass('text-input-wrapper')
                                                     .scroll(function(e) {e.stopPropagation();})
                                                     .appendTo($content);
        let $text_input_table = new $.TextInputHPO.HPO_table(
                                        current_settings.language, 
                                        function(hpo_id){$text_input_textarea.chosen(hpo_id);},
                                        function(hpo_id,class_observed){$text_input_textarea.changeObservedStatus(hpo_id, class_observed);}
                                    );
        $text_input_table.get_table().appendTo($text_input_table_wrapper);

        let $parse_button = $('<button>').attr('id','text-input-parse-button')
                     .addClass("round-button material-icons").text('chevron_right')
                     .click(function(){
						$text_input_table.clear();
						setTimeout(function(){
							_parse_text();
						}, 100);
					 }).appendTo($content);

        // footer
        let $footer = $('<div>').addClass('text-input-footer d-flex justify-content-end').appendTo($container);

        let $clear_button = $('<button>').addClass('ctl')
                                          .text("CLEAR")
                                          .click(function(){
                                              _clear();
                                          })
                                          .appendTo($footer);
        let $close_button = $('<button>').addClass('ctl')
                                          .text("CLOSE")
                                          .attr('id',"text-input-close-button")
                                          .click(function(){
                                              _clear();
                                              if(_isFunction(current_settings.trigger_close))current_settings.trigger_close(); 
                                          })
                                          .appendTo($footer);
                                       
        let $input_button = $('<button>').addClass('enter')
                    .attr('id',"text-input-apply-button")
                    .text("上記ボックスに抽出結果を追加")
                    .click(function(){
                        let hpo_list = $text_input_table.get_hpo_list();
                        if(hpo_list.length){
                            let settings = $container.data(SETTINGS_KEY);
                            if(_isFunction(settings.output_hpo)){
								
								if($(":button.doc.selected").length){
									let docId = $(":button.doc.selected").data('docId')
									hpo_list.forEach(h => {
										h['docId'] = docId
									})
								}else{
									hpo_list.forEach(h => {
										if('docId' in h) delete h.docId;
									})
	                            }	
								settings.output_hpo(hpo_list);
                                _clear();
                                if(_isFunction(current_settings.trigger_close))current_settings.trigger_close();
                            }else{
                                alert("HPO output function was not set.");
                            }
                        }else {
                            alert("No HPO selected.");
                        }
                     })
                     .appendTo($footer);

/*
        if($.isPlainObject( window['tmripple']) && $.isFunction(window['tmripple'].init)){
			$parse_button.attr({'data-animation':'ripple'});
			$div_btn_wraper_l.find('button').attr({'data-animation':'ripple'});
			$div_btn_wraper_r.find('button').attr({'data-animation':'ripple'});
            tmripple.init();
        }
*/
        // end of ui initialize

        let _clear = function(){
            $text_input_textarea.clear()
            $text_input_table.clear()
            $(":button.doc").removeClass('selected')
        }

        this.clear_input_area = function(){
            _clear();
        }
        
        this.load_dic_if_needed = function(isSilentLoading){
            let status = $container.data(STATUS_KEY);
            if(status === STATUS_LOADING || status === STATUS_LOADED) return;
            if(!hpo_dic.isLoaded()){
                hpo_dic.load_HPO_DIC_from_server(
                    function(){
                        if(!isSilentLoading) _text_input_show_loader(); 
                        $container.data(STATUS_KEY, STATUS_LOADING);
                    },  //func before loading
                    function(){
                        if(!isSilentLoading) _text_input_hide_loader(); 
                        $container.data(STATUS_KEY, STATUS_LOADED);
                    },  //func after load
                    function(){
                        if(!isSilentLoading) _text_input_hide_loader(); 
                        $container.data(STATUS_KEY, STATUS_INIT);
                    }   //func failed loading
                );
            }
        }
        
        this.set_text = function(text){
            _clear();
            $text_input_textarea.add_text(text);
            $text_input_textarea.set_focus();
            setTimeout(function(){
                let usr_input_text = $text_input_textarea.get_text();
                if(usr_input_text.length > 0){
                    _parse_text();
                }
            },100);
        }

        this.find_names_by_id = function(hpo_list){
            return hpo_dic.find_names_by_id(hpo_list);
        }

        this.set_text_bydocId = function(docId){
            let btn_id =  `docBtn-${docId}`;
            $('#'+btn_id).trigger('click');
            setTimeout(function(){
                let usr_input_text = $text_input_textarea.get_text();
                if(usr_input_text.length > 0){
                    _parse_text();
                }
            },100);
        }
        
        //
        // functions of parsing text
        //    
        let _parse_text = function(){
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
                            let obj = {start:           pos,
                                        end:           pos + hpo_term.length -1,
                                        id_in_dic:       item.HPO_ID,
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
                                let obj = {start:         pos,
                                           end:             pos + hpo_term.length -1,
                                           id_in_dic:     item.HPO_ID,
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
        
        let $textarea = $('<div>').attr('id', 'text-input-area')
                                  .attr('contenteditable','true')
                                  .attr('data-placeholder', LANGUAGE[this.language].placeholder)
                                  .attr('autocomplete','off')
                                  .attr('autocapitalize','off')
                                  .attr('spellcheck', false)
                                  .addClass('text-input-textarea')
                                  .on("paste", function (e) {
        e.preventDefault();

        let text;
        let clp = (e.originalEvent || e).clipboardData;
        if (clp === undefined || clp === null) {
            text = window.clipboardData.getData("text") || "";
            if (text !== "") {
                if (window.getSelection) {
                    let newNode = document.createElement("span");
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

        let onChosenSpan = onChosen;

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
                let end       = hpomatches[i].end;
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
        
        let $table = $('<table>').addClass("text-input-table form-control table table-hover p-0 ").attr('id','hpo-list-input-table');
        let $tbody = $('<tbody>').appendTo($table);
        let onChosenRow = onChosen;
        let onChangeObservedStatus = onChange;

        this._change_observed_state = function(hpo_id, observed_class,btn_id){
            let $tr = $('#'+btn_id).closest("tr");
			$tr.find("td[data-hpo_id~='"+hpo_id+"']").removeClass(CLASS_OBSERVED_Y).removeClass(CLASS_OBSERVED_N).addClass(observed_class);
            $tr.removeClass(CLASS_OBSERVED_Y).removeClass(CLASS_OBSERVED_N).addClass(observed_class);
            let $cbx = $tr.find("input[type='checkbox']")
            let hpo_data = $cbx.data('HPO_ITEM')
            hpo_data.is_observed = observed_class === CLASS_OBSERVED_Y ? 'yes':'no'
            $cbx.data('HPO_ITEM',hpo_data)
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
            let element = document.getElementById(id);
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
                let id_in_dic    = hpomatches[i].id_in_dic;
                let is_observed =  hpomatches[i].is_observed;
                if(id_in_dic in hpo_list){
                    if(!is_observed) hpo_list[id_in_dic].is_observed = is_observed;
                }else{
                    hpo_list[id_in_dic] = hpomatches[i];
                }
            }
            
            let i = 0;
            for( let key in hpo_list) {
                let id_in_dic    = hpo_list[key].id_in_dic;
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
                $cbx.css({'margin-bottom':'unset'})
                    .data('HPO_ITEM', {
                        'id':hpo_id, 
                        'name':name_text,
                        'name_ja': jterm_in_dic,
                        'name_en': eterm_in_dic,
                        'is_observed': is_observed?'yes':'no'
                    })
                    .change(function() {
                    $(this).closest('tr').toggleClass('table-secondary');
                });

                let $td2 = $('<td>').attr('data-hpo_id',id_in_dic).addClass(is_observed?CLASS_OBSERVED_Y:CLASS_OBSERVED_N).addClass('hpo_id').appendTo($tr);
                $('<span>').text(id_in_dic).appendTo($td2);
                
                let $td3 = $('<td>').addClass('hpo_name').appendTo($tr);
                let str = eterm_in_dic;
                if(this.language === LANGUAGE_JA && jterm_in_dic) str = jterm_in_dic; 
                $td3.text(str);

                let $td4 = $('<td>').appendTo($tr);
                let dropdown_toggle = document.createElement('button');
                dropdown_toggle.classList.add('material-symbols-outlined');
                dropdown_toggle.innerHTML = "more_vert";

                let btn_id = "dropdownMenuButton"+i;
                let lang   = this.language;
                let li_Y_id = "dropdownMenuButton"+i+'li_y';
                let li_N_id = "dropdownMenuButton"+i+'li_n';
                
                tippy(dropdown_toggle, {
                    allowHTML:  true,
                    appendTo:   document.body,
                    maxWidth:   150,
                    trigger:    'click',
                    strategy:   'fixed',
                    interactive:true,
                    theme:      'pcf_menu',
                    placement:  'left',
                    hpo_id:     id_in_dic,
                    btn_id:     btn_id,
                    li_Y_id:    li_Y_id,
                    li_N_id:    li_N_id,
                    hpo_tbl_obj: this,
                    onCreate(instance) {
                        // Setup our own custom state properties
                        instance._isSetClickEvent = false;
                    },
                    onShown(instance) {
                        if (instance._isSetClickEvent) return;
                        let btn_id = instance.props.btn_id;
                        let hpo_id = instance.props.hpo_id;
                        // set click event
                        let li_Y_id = instance.props.li_Y_id;
                        let li_N_id = instance.props.li_N_id;
                        let hpo_tbl_obj = instance.props.hpo_tbl_obj;
                        
                        $("#"+li_Y_id).click(function(){
                            hpo_tbl_obj._change_observed_state(hpo_id,CLASS_OBSERVED_Y,btn_id);
							setTimeout(function(){tippy.hideAll();},100);
                        });
                        
                        $("#"+li_N_id).click(function(){
                            hpo_tbl_obj._change_observed_state(hpo_id,CLASS_OBSERVED_N,btn_id);
							setTimeout(function(){tippy.hideAll();},100);
                        });
                        
                        instance._isSetClickEvent = true;
                    },
                    content(reference) {
                        return  "<ul class=\"dropdown-observe\">" +
                                    "<li id=\""+li_Y_id+"\">" +
                                        "<span class=\""+CLASS_OBSERVED_Y+"\">" +LANGUAGE[lang]['sample_label'][OBSERVED_Y] + "</span>" +
                                    "</li>" +
                                    "<li id=\""+li_N_id+"\">" +
                                        "<span class=\""+CLASS_OBSERVED_N+"\">" +LANGUAGE[lang]['sample_label'][OBSERVED_N] + "</span>" +
                                    "</li>" +
                                "</ul>";
                    }
                });

                $(dropdown_toggle).attr('id',btn_id).appendTo($td4);
                $tbody.append($tr);

                i++;
            }
        };

        this.get_table=function(){
            return $table;
        };
    };
    
    $.TextInputHPO.HPO_dic = function () {

        let hpo_dic_json = [];

        this.get_dic = function(){
            return hpo_dic_json; 
        };

        this.find_names_by_id = function(hpo_list){
            hpo_list.forEach(function(hpo){

                if('name_ja' in hpo) return;

				let hpo_id = hpo.id.replace('_ja','');
                for(let i=0; i<hpo_dic_json.length; i++){
                    if(hpo_dic_json[i].SEARCH_KEY === hpo_id){
                        hpo.name_ja = hpo_dic_json[i].JT;
                        hpo.name_en = hpo_dic_json[i].ET;
                        return;
                    }
                }
				
				if(_hasJA(hpo.name)){
					hpo.name_ja = hpo.name;
					hpo.name_en = "";
				}else{
					hpo.name_ja = "";
					hpo.name_en = hpo.name;
				}

            });
        };

        this.isLoaded = function(){
            return hpo_dic_json.length > 0; 
        };

        this.load_HPO_DIC_from_server = function(f_before,f_after,f_fail){
        
            if(_isFunction(f_before)) f_before();
        
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
                if(_isFunction(f_after)) f_after();
             })
             .fail(function(errorThrown ) {
                 alert(errorThrown);
                 if(_isFunction(f_before)) f_fail();
             });
        };
    };

}(jQuery));
