/*
 * jQuery Plugin: Search phenotype 
 */
;(function ($) {

    const LANGUAGE_JA='ja', LANGUAGE_EN='en',
          UISETTING_TAG_SIZE_S='s', UISETTING_TAG_SIZE_M='m', UISETTING_TAG_SIZE_L='l',
          UISETTING_TAG_SIZE_LST=[UISETTING_TAG_SIZE_S,UISETTING_TAG_SIZE_M,UISETTING_TAG_SIZE_L],
          UISETTING_LANGUAGE_JAPANESE='ja', UISETTING_LANGUAGE_ENGLISH='en',
          UISETTING_LANGUAGE_LST=[UISETTING_LANGUAGE_ENGLISH,UISETTING_LANGUAGE_JAPANESE],
          UISETTING_LANGUAGE_LABEL = {[UISETTING_LANGUAGE_ENGLISH]:'English', [UISETTING_LANGUAGE_JAPANESE]:'Japanese'},
          LANGUAGE = {
            [LANGUAGE_JA] : {
                'TEXT_INPUT_TITLE'             : '文章から症状を自動抽出',
                'UISETTING_BTN_TITLE'          : '設定',
                'UISETTING_TBL_LABEL_TAGSIZE'  : 'タグサイズ:',
                'UISETTING_TBL_LABEL_LANGUAGE' : 'クエリー言語:',
                'UISETTING_TAG_SIZE_LABEL'    : {
                    [UISETTING_TAG_SIZE_S] : '小',
                    [UISETTING_TAG_SIZE_M] : '中',
                    [UISETTING_TAG_SIZE_L] : '大'
                }
            },
            [LANGUAGE_EN] : {
                'TEXT_INPUT_TITLE'             : 'Automatically extract signs and symptoms from text',
                'UISETTING_BTN_TITLE'          : 'Setting',
                'UISETTING_TBL_LABEL_TAGSIZE'  : 'Tag size:',
                'UISETTING_TBL_LABEL_LANGUAGE' : 'Query language:',
                'UISETTING_TAG_SIZE_LABEL'     : {
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
        doc_list:                   null,
        getDocByColId:              null,
        onClickTextBtn:             null,	
        getExcludeHPOList:             null,	
        uisetting_tag_size:         UISETTING_TAG_SIZE_L,
        uisetting_language:         UISETTING_LANGUAGE_ENGLISH,UISETTING_LANGUAGE_JAPANESE
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

    // Additional public (exposed) methods
    var methods = {
        init: function(options) {
            var settings = $.extend({}, DEFAULT_SETTINGS, options || {})

            if(!(settings.lang in LANGUAGE)){ settings.lang = LANGUAGE_JA}

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
                }else{
                    settings['uisetting_language'] = UISETTING_LANGUAGE_ENGLISH;
                }
                
                setCookie('uisetting_language', settings['uisetting_language']);
            }

            return this.each(function () {
                $(this).data("searchBoxFormObject", new $.Search_Box_Form(this, settings));
            });
        },
        add_token:    function(item) {
            this.data("searchBoxFormObject").add_token(item);
            return this;
        },
        get_tokens: function() {
            return this.data("searchBoxFormObject").get_tokens();
        },
        clear_tokens:  function(item) {
            this.data("searchBoxFormObject").clear_tokens();
            return this;
        },
        clear_input_area: function() {
            this.data("searchBoxFormObject").clear_input_area();
            return this;
        },
        load_dic_if_needed: function(isSilentLoading){
            $(this).data("searchBoxFormObject").load_dic_if_needed(isSilentLoading);
        },
        trigger_doc_input: function(docId){
            $(this).data("searchBoxFormObject").trigger_doc_input(docId);
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
        function create_text_input_button(language){
            let $btn = $('<button>').addClass('round-button').attr('id',"btn_text_input_trigger");
            $('<img>').attr({
                'src':            '/static/record/images/HPOID_grey.svg',
                'data-toggle':    'tooltip',
                'data-html':'true',
                'data-original-title': LANGUAGE[language]['TEXT_INPUT_TITLE']
            })
			let $span = $('<span>').addClass("material-symbols-outlined").text('playlist_add')
					   .attr({'data-toggle':'tooltip','data-original-title':LANGUAGE[language]['TEXT_INPUT_TITLE']})
            .tooltip({trigger: 'hover', placement:'top', container: 'body', boundary: 'window' })
            .appendTo($btn);

            return $btn;
        }


        // trigger to show setting GUI
        function create_uisetting_button(language){
            let $btn = $('<button>').attr('tid','btn_uisetting_trigger').addClass('round-button');
            $('<span>').addClass('material-icons').text('settings')
                        .attr('id','btn_uisetting_trigger')
                        .attr({
                            'data-toggle':    'tooltip',
                            'data-html':'true',
                            'data-original-title': LANGUAGE[language]['UISETTING_BTN_TITLE']
                        })
                        .tooltip({trigger: 'hover', placement:'top', container: 'body', boundary: 'window' })
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
                    width:           450,
                    strategy:     'fixed',
                    interactive:   true,
                    trigger:      'click',
                    theme:        'pcf-popup',
                    placement:    'bottom-start',
                     offset:      [-15, 10],
                    content:      template_uisetting
                }
            );
        }

        function create_clear_button(){
            return $('<button>').addClass('round-button material-icons').text('clear')
                        .click(function(){
                            $("#tokeninput_hpo").tokenInput("clear");
                            $("#tokeninput_hpo").popupRelationHPO('triggerChangeState');
                            return false;
                        });
        }

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
            let hpo_list = $("#tokeninput_hpo").tokenInput("get");
            if(!hpo_list || !hpo_list.length) return hpo_list;
            $div_text.textinput_hpo('find_names_by_id', hpo_list);
            return hpo_list;
        };

        this.clear_tokens = function() {
            $("#tokeninput_hpo").tokenInput("clear");
        };

        this.clear_input_area = function() {
            $("#tokeninput_hpo").tokenInput("clear");
            $div_text.textinput_hpo('clear_input_area');
            $div_text.removeClass('active');
            $text_input_trigger.removeClass('selected');
        };

        this.trigger_doc_input = function(docId){
            $text_input_trigger.trigger('click');
            $div_text.textinput_hpo('set_text_bydocId',docId);
        };

        //
        // Initialization UI
        //
        var $div_wrapper = $(div_search_box_form).addClass("search-box_form d-flex flex-nowrap").data('SETTINGS', settings);

        var $div_left   = $('<div>').addClass("search-box_controller_left d-flex flex-column").appendTo($div_wrapper);
        var $div_middle = $('<div>').addClass("flex-grow-1 tokeninput_hpo_wrapper").appendTo($div_wrapper);
        var $div_right  = $('<div>').addClass("search-box_controller_right d-flex flex-column justify-content-center").appendTo($div_wrapper);

        let $div_l1 = $('<div>').addClass("button_wrapper").appendTo($div_left);
		let $div_l2 = $('<div>').addClass("button_wrapper").appendTo($div_left);        
        let $text_input_trigger = create_text_input_button(settings.lang).appendTo($div_l1).click(function(){
            $div_text.textinput_hpo('load_dic_if_needed');
            $div_text.textinput_hpo('clear_input_area');

            if($.isFunction(settings.onClickTextBtn)){
                settings.onClickTextBtn($(this).hasClass('selected'))
            }

            $div_text.toggleClass('active');
			$(this).toggleClass('selected');
        });

        let $ui_trigger_btn = create_uisetting_button(settings.lang).appendTo($div_l2);    
        create_uisetting_ui(settings.lang, settings.uisetting_tag_size, settings.uisetting_language, $ui_trigger_btn.attr('tid'));

        let $div_r1 = $('<div>').addClass("button_wrapper").appendTo($div_right);
        create_clear_button().appendTo($div_r1);

        $('<textarea>').attr('rows','1').attr('id','tokeninput_hpo').attr('name','str_phenotypes').appendTo($div_middle);
        $("#tokeninput_hpo").tokenInput(
            settings.url_tokeninput_hpo, 
            {
                theme:               "facebook", 
                lang:                settings.lang,
                uisetting_language:  settings.uisetting_language,
                uisetting_tag_size:  settings.uisetting_tag_size,
                second_url_str:      settings.url_tokeninput_hpo_second,
                onLongerQuery:       function(text){
                    if($text_input_trigger.hasClass('selected')) {
                        $div_text.textinput_hpo('set_text',text)
                    }else{
                        $text_input_trigger.trigger('click')
                        $div_text.textinput_hpo('set_text',text)
                    }
                },
                onClickDelete:        function() {
                    $("#tokeninput_hpo").popupRelationHPO('triggerChangeState');
                },
                getExcludeHPOList:      settings.getExcludeHPOList
            }
        );

        $("#tokeninput_hpo")
            .popupRelationHPO( settings.url_popup_hierarchy_hpo,
                              {'is_hierarchy_fullscreen': false,
                               'language_in':              settings.lang,
                               'prependTo': div_search_box_form.id
                              });

//       $("#tokeninput_hpo").tokenInput("setInputBoxFocus");

		let $div_text = $('<div>').attr('id', 'text-input-container').insertAfter($div_wrapper);
        $div_text.textinput_hpo({ 
            doc_list: settings.doc_list,
            language: settings.lang,
            getDocByColId: settings.getDocByColId,
            output_hpo: function(hpo_list){
                $("#tokeninput_hpo").tokenInput("add_hpo_list", hpo_list);
            },
            load_text:  null,
            trigger_close: function(){
                $text_input_trigger.trigger('click')
            }
        });

        this.load_dic_if_needed = function(){
            $div_text.textinput_hpo('load_dic_if_needed', true);
        };
    };
}(jQuery));

