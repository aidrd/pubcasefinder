const URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_tooltip_data_by_hpo_id';

var phenotypeData = [];


function phenotypeInfo_isTrue(str) {
    if (str === 'yes') return true;
    return false;
}


function phenotypeInfo_updateNum() {
    $("#phenotype_num").text(`(${phenotypeData.length})`);
    if(phenotypeData.length){
        $('#phenotype_description_wrapper').show();
    }else{
        $('#phenotype_description_wrapper').hide();
    }
}

function phenotypeInfo_search_disease(){
    let hpo_lst = [];
    for(let i=0; i<phenotypeData.length; i++){
        if(!('is_observed' in phenotypeData[i]) || phenotypeData[i].is_observed === 'yes'){
            hpo_lst.push(phenotypeData[i].id.replace('_ja',''));
        }
    }

    if(hpo_lst.length === 0){
        alert("No HPOs(with symptoms)");        return;
    }

    let url = "/result?phenotype=" +
              hpo_lst.join('_ja%2C') +'_ja'+
              "&target=omim&filter=&size=10&display_format=full&lang=ja";
    window.open(url);

}


function phenotypeInfo_initUI(phenotypeInfo_container) {
    phenotypeInfo_container.innerHTML = `
        <div class="search-box_wrapper">
            <div id="search-box_form"></div>
        </div>
        <p class="phenotype_add_wrapper">
            <button id="phenotype_add" class="ripper_effect" onclick="phenotypeInfo_addRows();">
                <i class="material-symbols-outlined">add_notes</i>
                ${translate2('phenotypic-info-add')}
            </button>
        </p>
        <div class="d-flex flex-row justify-content-between phenotype_title">
            <div class="phenotype_title_sub">
                <span>${translate2('phenotypic-info-list')}</span>
                <span id="phenotype_num">(0)</span>
            </div>
            <div class="phenotype_title_sub">
              <span class="sample observed mr-3">${translate2('phenotypic-standalone-observed')}</span>
              <span class="sample notobserved">${translate2('phenotypic-standalone-notobserved')}</span>
            </div>
        </div>
        <ul id="phenotype_list"></ul>
        <div id="phenotype_description_wrapper"></div>
        <div class="phenotype_action_wrapper">
            <button id="phenotype_copy" class="phenotype_action_btn">
                <i>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16">
  <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2m0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1M3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
</svg>
                </i>${translate2('phenotypic-standalone-copy')}
            </button>
            <button id="do_pcf_search" class="phenotype_action_btn" onclick="phenotypeInfo_search_disease();">            
                <i><img src="/static/record/images/commonmenu-icon1.svg"></i>${translate2('phenotypic-standalone-search')}
            </button>
        </div>
    `;

    $("#search-box_form").search_box_form({
        'lang': lang === 'ja' ? 'ja' : 'en',
        'doc_list': null,
        'getDocByColId': null,
        'onClickTextBtn': null,
    });


    $('#phenotype_copy')
        .tooltip({'title':'Copied to clipboard!', 'trigger':'manual', 'placement':'top'})
        .on('click', function (e) {
            $(this).tooltip('show');

            let textArr = [];
            for(let i=0; i<phenotypeData.length; i++){
                let row = phenotypeData[i].id + "\t" + 
                          phenotypeData[i].name_en
                if(lang==='ja'){ 
                    row = row + "\t" + phenotypeData[i].name_ja;
                }
                //if('is_observed' in phenotypeData[i] && phenotypeData[i].is_observed==='no'){
                //    row = row + "\t" + translate2('phenotypic-standalone-notobserved');
                //}else{
                //    row = row + "\t" + translate2('phenotypic-standalone-observed');
               // }
                textArr.push(row);
            }

            let text = textArr.join("\n");

            if (window.clipboardData && window.clipboardData.setData) {
                window.clipboardData.setData("Text", text);
            } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                let textarea = document.createElement("textarea");
                textarea.style = "position: absolute; left: -1000px; top: -1000px";
                textarea.textContent = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                //try {
                //    let selection = document.getSelection();
                //    selection.removeAllRanges();
                //    let range = document.createRange();
                //    range.selectNodeContents(textarea);
                //    selection.addRange(range);
                //    document.execCommand('copy');
                //    selection.removeAllRanges();
                //}
                //catch (ex) {
                //    console.log("Copy to clipboard failed.", ex);
                //}
                //finally {
                    document.body.removeChild(textarea);
                //}
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        })
        .on('mouseleave', function () {
            $(this).tooltip('hide');
        });
}

var _isObject = function (value) { return $.isPlainObject(value); },
    _isArray = function (value) { return $.isArray(value); },
    _isEmpty = function (value, allowEmptyString) {
        return (value === null) || (value === undefined) ||
            (!allowEmptyString ? value === '' : false) ||
            (_isArray(value) && value.length === 0) ||
            (_isObject(value) && Object.keys(value).length === 0);
    },
    _isExistVal = function (key, hash) {
        if (_isEmpty(hash)) return false;
        if (!(key in hash)) return false;
        return !_isEmpty(hash[key]);
    };

function _contruct_popup_content_val(key, hash, delimer) {
    if (!_isExistVal(key, hash)) return '';
    if (_isEmpty(hash[key])) return '';
    if (_isArray(hash[key])) {
        if (_isEmpty(delimer)) return hash[key].join(',');
        return hash[key].join(delimer);
    }
    return hash[key];
}

function _contruct_popup_content(hpo_id, popup_data, lang) {
    let max_text_len = hpo_id.length;
    let name_ja = _contruct_popup_content_val('name_ja', popup_data);
    let name_en = _contruct_popup_content_val('name_en', popup_data);
    if (_isEmpty(name_ja) && _isEmpty(name_en)) {
        return ['no data found for ' + popup_id, max_text_len];
    }
    if (max_text_len < name_ja.length) max_text_len = name_ja.length;
    if (max_text_len < name_en.length) max_text_len = name_en.length;
    let hpo_url = _contruct_popup_content_val('hpo_url', popup_data);
    if (max_text_len < hpo_url.length) max_text_len = hpo_url.length;

    let definition = _contruct_popup_content_val('definition', popup_data);
    if (max_text_len < definition.length) max_text_len = definition.length;

    let comment = _contruct_popup_content_val('comment', popup_data);
    if (max_text_len < comment.length) max_text_len = comment.length;

    let synonym = _contruct_popup_content_val('synonym', popup_data, ', ');
    if (max_text_len < synonym.length) max_text_len = synonym.length;

    let content = '<table>' +
        '<tr>' +
        '<th class=\"pcf-popup-phenotype_inlist\">HPO ID  </th>' +
        '<td><a href=\"' + hpo_url + '\" target=\"_blank\">' + hpo_id + '</td>' +
        '</tr>';
    if (lang !== 'ja') {
        content += '<tr>' +
            '<th class=\"pcf-popup-phenotype_inlist\">Label</th>' +
            '<td>' + name_en + '</td>' +
            '</tr>';
    } else {
        content += '<tr>' +
            '<th class=\"pcf-popup-phenotype_inlist\">Label(ja) </th>' +
            '<td>' + name_ja + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th class=\"pcf-popup-phenotype_inlist\">Label(en) </th>' +
            '<td>' + name_en + '</td>' +
            '</tr>';
    }

    content += '<tr>' +
        '<th class=\"pcf-popup-phenotype_inlist\">Definition</th>' +
        '<td>' + definition + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th class=\"pcf-popup-phenotype_inlist\">Comment   </th>' +
        '<td>' + comment + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th class=\"pcf-popup-phenotype_inlist\">Synonym   </th>' +
        '<td>' + synonym + '</td>' +
        '</tr>' +
        '</table>';

    return [content, max_text_len];
}

function phenotypeInfo_change_observed_state(hpo_id,is_observed,btn_id){
    let j=0;
    for(;j<phenotypeData.length;j++){
        let hpo_id_list = phenotypeData[j].id.replace('_ja','');
        if(hpo_id_list === hpo_id){
            phenotypeData[j].is_observed=is_observed;
            break;
        }
    }

    $('#'+btn_id).removeClass('observed').removeClass('notobserved')
                 .addClass(is_observed==='yes'? 'observed' : 'notobserved');
}

function phenotypeInfo_createRows() {
    //phenotypeInfo_updatePCFSearchButton();
    if (!phenotypeData || !phenotypeData.length) return;

    // update list num
    phenotypeInfo_updateNum();

    //let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();

    //let if_show_detail = $("#phenotype-detail-switch").hasClass('active');

    let $ul = $('#phenotype_list');

    for (let i = 0; i < phenotypeData.length; i++) {

        let $li = $('<li>').addClass('phenotype_list_row').addClass('shadow-sm').appendTo($ul);

        let $header = $('<div>').addClass('d-flex flex-row phenotype_list_row_header').appendTo($li);

        let $header_sub_left = $('<div>').addClass('phenotype_list_row_header_sub flex-grow-1').appendTo($header);

        // delete button
        $('<span>').addClass('material-symbols-outlined hpo_delete').text('delete')
            .click(function (e) {
                tippy.hideAll();
                if (confirm(translate2('phenotypic-info-comfirm-delete'))) {
                    let hpo_id = $(this).next().text();
                    for(let j=0;j<phenotypeData.length;j++){
                        let hpo_id_list = phenotypeData[j].id.replace('_ja','');
                        if(hpo_id_list === hpo_id){
                            phenotypeData.splice(j, 1);
                            break;
                        }
                    }
                    phenotypeInfo_updateNum();
                    $(this).closest('li').remove();
                }
                e.stopPropagation();
            })
            .appendTo($header_sub_left);

        // hpo id
        let btn_id = "hpo_id_btn_"+i;
        let $hpd_id_btn_wrapper = $('<div>').attr('id',btn_id).addClass('hpd_id_btn_wrapper').appendTo($header_sub_left);
        if('is_observed' in phenotypeData[i] && phenotypeData[i].is_observed === 'no'){
            $hpd_id_btn_wrapper.addClass("notobserved");
        }else{
            $hpd_id_btn_wrapper.addClass("observed");
        }

        let hpo_id = phenotypeData[i].id.replace('_ja','');
        let button = document.createElement('button');
        button.textContent = hpo_id;
        button.classList.add("list-tag");
        button.classList.add("hpo_id");
        tippy(button, {
            arrow: false,
            allowHTML: true,
            appendTo: document.body,
            animation: 'scale',
            animationFill: true,
            trigger: 'click',
            maxWidth: 400,
            strategy: 'fixed',
            interactive: true,
            theme: 'pcf-popup',
            placement: 'bottom-start',
            content: 'Loading...',
            offset: [0, 0],
            popup_url: URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID + '?hpo_id=' + hpo_id,
            popup_id: hpo_id,
            popup_lang: lang === 'ja' ? 'ja' : 'en',
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

                let url = instance.props.popup_url;
                let hpo_id = instance.props.popup_id;
                let lang = instance.props.popup_lang;

                $.ajax({
                    url: url,
                    type: 'GET',
                    async: true,
                    dataType: 'text'
                }).done(function (data, textStatus, jqXHR) {
                    let json_data = JSON.parse(data);
                    let [content, max_text_len] = _contruct_popup_content(hpo_id, json_data, lang);
                    if (max_text_len < 40) {
                        instance.setProps({ maxWidth: 500 });
                    } else if (max_text_len < 60) {
                        instance.setProps({ maxWidth: 600 });
                    } else if (max_text_len < 80) {
                        instance.setProps({ maxWidth: 700 });
                    } else if (max_text_len < 120) {
                        instance.setProps({ maxWidth: 800 });
                    } else {
                        instance.setProps({ maxWidth: 850 });
                    }
                    instance.setContent(content);
                    instance._src = 'done';
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    // Fallback if the network request failed
                    instance.setContent(`Request failed from server.`);
                    instance._src = null;
                }).always(function () {
                    instance._isFetching = false;
                });
            }
        });

        $(button).click(function (e) { e.stopPropagation(); }).appendTo($hpd_id_btn_wrapper);

        // hpo name
        if (lang === 'ja') {
            let $div = $('<div>').addClass('d-flex flex-row flex-grow-1').appendTo($header_sub_left);
            let $div1 = $('<div>').addClass('d-flex align-items-start w-50').appendTo($div);
            let $div2 = $('<div>').addClass('d-flex align-items-start w-50').appendTo($div);

            let hpo_name_ja = phenotypeData[i]['name_ja'];
            $('<span>').addClass('text-left').text(hpo_name_ja).appendTo($div1);

            let hpo_name_en = phenotypeData[i]['name_en'];
            $('<span>').addClass('text-left').text(hpo_name_en).appendTo($div2);

        } else {
            let hpo_name = phenotypeData[i]['name_en'];
            let hpo_name_key = `name_${lang}`;
            if (phenotypeData[i][hpo_name_key]) hpo_name = phenotypeData[i][hpo_name_key];
            $('<span>').addClass('hpo_name').addClass('text-left').text(hpo_name).appendTo($header_sub_left);
        }


        let $header_sub_right = $('<div>').addClass('phenotype_list_row_header_sub').appendTo($header);

        // switch of if display detail 
        let dropdown_toggle = document.createElement('button');
        dropdown_toggle.classList.add('material-symbols-outlined');
        dropdown_toggle.innerHTML = "more_vert";
        //let btn_id = "dropdownMenuButton"+i;
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
           hpo_id:     hpo_id,
           btn_id:     btn_id,
           li_Y_id:    li_Y_id,
           li_N_id:    li_N_id,
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

                  $("#"+li_Y_id).click(function(){
                       phenotypeInfo_change_observed_state(hpo_id,'yes',btn_id);
                       setTimeout(function(){tippy.hideAll();},100);
                  });

                  $("#"+li_N_id).click(function(){
                       phenotypeInfo_change_observed_state(hpo_id,'no',btn_id);
                       setTimeout(function(){tippy.hideAll();},100);
                  });

                  instance._isSetClickEvent = true;
          },
          content(reference) {
             let observed = translate2('phenotypic-standalone-observed');
             let notobserved = translate2('phenotypic-standalone-notobserved'); 
             return  "<ul class=\"dropdown-observe\">" +
                       "<li id=\""+li_Y_id+"\">" +
                          "<span class=\"observed\">" + observed + "</span>" +
                       "</li>" +
                       "<li id=\""+li_N_id+"\">" +
                          "<span class=\"notobserved\">" +notobserved + "</span>" +
                       "</li>" +
                     "</ul>";
          }
      });

        $(dropdown_toggle).attr('id',btn_id).appendTo($header_sub_right);

        //$('<span>').addClass("material-symbols-outlined detail_display_switch").text('expand_more')
        //    .click(function (e) {
        //        $(this).closest('li').toggleClass('active');
        //        e.stopPropagation();
        //    })
        //    .appendTo($header_sub_right);
    }
}

function phenotypeInfo_addRows() {
    tippy.hideAll();

    let hpo_list = $("#search-box_form").search_box_form('get_tokens');

    if (!hpo_list || !hpo_list.length) return;

    //let phenotypeInfo = categories.filter(c => { return c.dataKey === 'phenotypicInfo' })[0]

    hpo_list.forEach(hpo => {
        let hpo_id = hpo.id.replace('_ja', '');
        let existed_hpo = [];
        phenotypeData.filter((hpo_existed, idx) => {
            let hid_existed = hpo_existed.id.replace('_ja', ''); 
            if (hid_existed === hpo_id) {
                existed_hpo.push(idx)
            }
        })
        if (existed_hpo.length) {
            return;
        }
        phenotypeData.push(hpo);
    })

    $("#search-box_form").search_box_form('clear_tokens');
    phenotypeInfo_reset_hpo_list();
    phenotypeInfo_createRows();
}



function phenotypeInfo_reset_hpo_list() {
    // hpo list reset
    $('#phenotype_num').text('(0)')
    $('#phenotype_list').empty()
}


$(document).ready(function() {
  let main_div = document.querySelector("#phenotype-main")
  phenotypeInfo_initUI(main_div);
});