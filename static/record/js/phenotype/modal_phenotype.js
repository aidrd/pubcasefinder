const URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID = 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_tooltip_data_by_hpo_id';

var phenotypeData = {};

function phenotypeInfo_initPhenotypData(patientData){
    let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();
    phenotypeInfo.columns.forEach(c => {
        phenotypeData[c.columnId] = (patientData && (c.columnId in patientData)) ? patientData[c.columnId] :[];
    });
}

function phenotypeInfo_isTrue(str) {
    if(str === 'yes') return true;
    return false;
}

function phenotypeInfo_getColumn(columnId) {
    for(let i=0; i<categories.length; i++){
        for(let j=0; j<categories[i].columns.length; j++){
            if(categories[i].columns[j].columnId === columnId) return categories[i].columns[j];
        }
    }
    return null;
}

function phenotypeInfo_getPhenotypeInfo(){
    return categories.filter(c => { return c.dataKey === 'phenotypicInfo' })[0];
}

function phenotypeInfo_getCurrentPatientID(){
    return document.getElementById('PCFNo').nextElementSibling.innerHTML;
}

function phenotypeInfo_createDocList() {
    let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();
    let doc_list = JSON.parse(JSON.stringify(phenotypeInfo.doc_list));
    doc_list.forEach(doc => {
        if(doc.dataSrcColumnId){
            let c = phenotypeInfo_getColumn(doc.dataSrcColumnId);
            let title = c['displayName'][lang] || c['displayName']['en'];
            doc['title'] = title;
        }
    })
    return doc_list;
}

/*
function phenotypeInfo_createExtraPopupItems() {
    let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();
    let extra_popup_items = [];
    ['pi008','pi009','pi010','pi011','pi012','pi013','pi014','pi015'].forEach(cid => {
        let col = phenotypeInfo.columns.filter(c => { return c.columnId === cid})[0];

        let dataValue = '';
        if (col.inputType === 'select') {
            let options = col.options.dataValue;
            dataValue = col['options'][lang].length > 0 ? col['options'][lang] : col['options']['en'];
        }

        let obj = {
            dataKey:     col.dataKey,
            displayName: col['displayName'][lang] || col['displayName']['en'],
            inputType:   col.inputType,
            dataValue:   dataValue
        };
    });
    return extra_popup_items;
}
*/

function phenotypeInfo_updateFilterCNT() {
    let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();
    ['pi003','pi004','pi005','pi006','pi008','pi009','pi010','pi011','pi012','pi013'].forEach(cid => {
        let col = phenotypeInfo.columns.filter(c => { return c.columnId === cid})[0];
        if(col.inputType === 'checkbox'){
            let cbx_id      = `cbx-filter-${cid}`;
            let displayName = col['displayName'][lang] || col['displayName']['en'];
            let cnt = 0;
            let val_yes = col.options.dataValue[1];
            phenotypeData[cid].forEach(v => {
                if(v === val_yes) cnt++;
            });
            let new_name = `${displayName}(${cnt})`;
            $('#' + cbx_id).next().text(new_name);
        }else if(col.inputType === 'select'){
            let options = col.options.dataValue;
            let optionLang = col['options'][lang].length > 0 ? col['options'][lang] : col['options']['en'];
            options.forEach((v_filter, i) => {
               let cbx_id      = `cbx-filter-${cid}-${i}`;
               let displayName = optionLang[i];
               let cnt = 0;
               phenotypeData[cid].forEach(v => {
                   if(v === v_filter) cnt++;
               });
               let new_name = `${displayName}(${cnt})`;
               $('#' + cbx_id).next().text(new_name);
            });
        }else{
            console.log(`Error: unknown inputTYpe(${col.inputType})`);
        }
    });
}

function phenotypeInfo_createFilterUI(filter_container_id) {
    let $container = $('#' + filter_container_id);

    let $div_ctl = $('<div>').addClass('ctl').appendTo($container);
    $('<button>').text(translate('phenotypic-info-filter-clearall'))
                 .click(function(){
                     $('#phenotype_filter').find("input[type='checkbox']").prop('checked','');
                     $('#phenotype_list').find('li').show();    
                 })
                 .appendTo($div_ctl);

    let $tbl  = $('<table>').appendTo($container)
    let $tr1  = $('<tr>').appendTo($tbl);
    let $td_h = $('<td>').attr('colspan',2).appendTo($tr1);

    let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();
    // doc src list
    ['pi003','pi004','pi005','pi006'].forEach(cid => {
        let col         = phenotypeInfo.columns.filter(c => { return c.columnId === cid})[0]
        let displayName = col['displayName'][lang] || col['displayName']['en']
        displayName += '(0)';
        let checked     = '';
        let cbx_id      = `cbx-filter-${cid}`;
        phenotypeInfo_createCbx(cbx_id,cid,col.inputType,checked,displayName,phenotypeInfo_onFilterChange).appendTo($td_h);
        $('#'+cbx_id).val(col.options.dataValue[1]);
    });

    ['pi008','pi009','pi010','pi011','pi012','pi013'].forEach(cid => {
        let $tr = $('<tr>').appendTo($tbl);
        let col = phenotypeInfo.columns.filter(c => { return c.columnId === cid})[0];
        let titleName = col['displayName'][lang] || col['displayName']['en'];
        $('<td>').addClass('title').text(titleName).appendTo($tr);
        
        let $td2 = $('<td>').appendTo($tr);

        let options = col.options.dataValue;
        let optionLang = col['options'][lang].length > 0 ? col['options'][lang] : col['options']['en'];
        options.forEach((v, i) => {
            let displayName = optionLang[i] + "(0)";
            let cbx_id      = `cbx-filter-${cid}-${i}`;
            phenotypeInfo_createCbx(cbx_id,cid,'','',displayName,phenotypeInfo_onFilterChange).appendTo($td2);
            $('#' + cbx_id).val(v);
        });
    });
}

function phenotypeInfo_onFilterChange(){

/*
    if($('#phenotypic-btn-filter').hasClass('active')===false){
         $('#phenotype_list').find('li').show();
         return;
    }
*/

    let filter_list = [];

    $('#phenotype_filter').find("input[type='checkbox']:checked").each(function(){
        let $cbx = $(this);
        let cid = $cbx.data('cid');
        let val = $cbx.val();
        filter_list.push({cid:cid,val:val});
    });

    if(filter_list.length === 0){
        $('#phenotype_list').find('li').show();
        return;
    }

    $('#phenotype_list').find('li').each(function(li_idx,li){
        let isShown = false;
        filter_list.forEach(filter => {
            if(phenotypeData[filter.cid][li_idx] === filter.val) isShown = true;
        });
        if(isShown){
            $(li).show();
        }else{
            $(li).hide();
        }
    });
}

function phenotypeInfo_updateNum(){
    $("#phenotype_num").text(`(${phenotypeData['pi001'].length})`);
}


function phenotypeInfo_initUI(phenotypeInfo_container){
    phenotypeInfo_container.innerHTML = `
        <div class="search-box_wrapper">
            <div id="search-box_form"></div>
        </div>
        <div id="phenotype_doc_input_btn_wrapper"></div>
        <p class="phenotype_add_wrapper">
            <button id="phenotype_add" class="ripper_effect" onclick="phenotypeInfo_addRows();">
                <i class="material-symbols-outlined">add_notes</i>
                ${translate('phenotypic-info-add')}
            </button>
        </p>
        <div class="d-flex flex-row justify-content-between phenotype_title">
            <div class="phenotype_title_sub">
                <span>${translate('phenotypic-info-list')}</span>
                <span id="phenotype_num">(0)</span>
            </div>
            <div class="phenotype_title_sub">
                <span>${translate('phenotypic-info-detail')}</span>
				<input type="range" id="phenotype-detail-switch" min="0" max="1" value="0" step="1">
                <button id="phenotypic-btn-filter" class="round-button"><span class="material-symbols-outlined">tune</span></button>
            </div>
        </div>
        <div id=phenotype_filter></div>
        <ul id="phenotype_list"></ul>
    `
    let phenotypeInfo_doc_list = phenotypeInfo_createDocList();

    $("#search-box_form").search_box_form({
        'lang': lang === 'ja'? 'ja' :'en',
        'doc_list': phenotypeInfo_doc_list,
        'getDocByColId': phenotypeInfo_getDocByColId,
        'onClickTextBtn': function(isActived){
            if(isActived){
                $('#phenotype_add').show();
                $('#phenotype_doc_input_btn_wrapper').show();
            }else{
                $('#phenotype_add').hide();
                $('#phenotype_doc_input_btn_wrapper').hide();
            }
        }
    })

    phenotypeInfo_doc_list.forEach(doc => {
        if(!doc.dataSrcColumnId) return;
        let btn = document.createElement('button');
        let btn_title = (doc.title).toUpperCase();
        btn.innerHTML = `<span class="material-symbols-outlined">playlist_add</span>${btn_title}`;
        $(btn).data('docId', doc.docId)
              .click(function(){
                  let docId = $(this).data('docId');
                  $("#search-box_form").search_box_form('trigger_doc_input',docId);
              })
              .appendTo($('#phenotype_doc_input_btn_wrapper'));
    });

    /*
    $("#phenotype-detail-switch").on('input',function(event){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('#phenotype_list').find('li').removeClass('active');
        }else{
            $(this).addClass('active');
            $('#phenotype_list').find('li').removeClass('active');
            $('#phenotype_list').find('li').addClass('active');
        }
    })
   */
    $("#phenotype-detail-switch").on('click',function(event){
        if($(this).hasClass('active')){
            $(this).val(0);
            $(this).removeClass('active');
            $('#phenotype_list').find('li').removeClass('active');
        }else{
            $(this).val(1);
            $(this).addClass('active');
            $('#phenotype_list').find('li').removeClass('active');
            $('#phenotype_list').find('li').addClass('active');
        }
    })

 
    $("#phenotypic-btn-filter").click(function(event){
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('#phenotype_filter').removeClass('active');
            //$('#phenotype_list').find('li').show();
        }else{
            $(this).addClass('active');
            $('#phenotype_filter').addClass('active');
            //phenotypeInfo_onFilterChange();
        }
    });

    phenotypeInfo_createFilterUI('phenotype_filter');

    phenotypeInfo_initPhenotypData();    
}

function phenotypeInfo_onInputChange(input_obj){
    let $input    = $(input_obj);
    let val       = $input.val();
    let cid       = $input.data('cid');
    let inputType = $input.data('inputType');
    
    let $li     = $input.closest('li');
    let hpo_id  = $li.find('.hpo_id')[0].innerHTML;
    
    let idx   = phenotypeData['pi001'].indexOf(hpo_id);
    
    if(inputType === 'text' ){
        phenotypeData[cid][idx] = val;
    }else if(inputType === 'select'){
        phenotypeData[cid][idx] = val;
        phenotypeInfo_updateFilterCNT();
        phenotypeInfo_onFilterChange();
    }else if(inputType === 'checkbox') {
        let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();
        let col_def       = phenotypeInfo.columns.filter(c => { return c.columnId === cid})[0]
        if($input.prop('checked')){
            phenotypeData[cid][idx] = col_def.options.dataValue[1];
        }else{
            phenotypeData[cid][idx] = col_def.options.dataValue[0];
        }
        phenotypeInfo_updateFilterCNT();
        phenotypeInfo_onFilterChange();
    }else{
        console.log('Error: unknown phenotypeInfo inputType (' + inputType + ')');
    }
}

function phenotypeInfo_createCbx(cbx_id,cid,inputType,checked,displayName,onchange){

    let $div_cbx_wrapper = $('<div>').addClass('phenotype_cbx_wrapper');
    let $cbx = $('<input>').attr('type',     'checkbox')
                .attr('id',        cbx_id)
                .data('cid',       cid)
                .data('inputType', inputType)
                .prop('checked',   checked)
                .appendTo($div_cbx_wrapper);
    if($.isFunction(onchange)){
        $cbx.change(function(){onchange(this);});
    }
    $('<label>').text(displayName).prop('for',cbx_id).appendTo($div_cbx_wrapper);
    
    return $div_cbx_wrapper;
}

var _isObject   = function(value) {return $.isPlainObject(value);},
    _isArray    = function(value) {return $.isArray(value);},
    _isEmpty    = function(value, allowEmptyString) {
            return  (value === null) || (value === undefined) ||
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
                      '<th class=\"pcf-popup-phenotype_inlist\">HPO ID  </th>'+
                      '<td><a href=\"'+hpo_url+'\" target=\"_blank\">'+hpo_id+'</td>'+
                    '</tr>';
    if(lang !== 'ja'){
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

    content +=      '<tr>'+
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



function phenotypeInfo_createRows(){
    
    if(!phenotypeData || !('pi001' in phenotypeData) || !phenotypeData['pi001'].length) return;

    // update list num
    phenotypeInfo_updateNum();
    
    let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();
   
    let if_show_detail = $("#phenotype-detail-switch").hasClass('active');
 
    let $ul = $('#phenotype_list');
    
    for(let i=0;i<phenotypeData['pi001'].length;i++){

        let $li=$('<li>').addClass('phenotype_list_row').addClass('shadow-sm').addClass(if_show_detail ? 'active' : '').appendTo($ul);
        
        let $header = $('<div>').addClass('d-flex flex-row phenotype_list_row_header').appendTo($li);
        let $header_sub_left = $('<div>').addClass('phenotype_list_row_header_sub flex-grow-1')
                                         .click(function(){
                                             $(this).closest('li').toggleClass('active');
                                         })
                                         .appendTo($header);
        // delete button
        $('<span>').addClass('material-symbols-outlined hpo_delete').text('delete')
                   .click(function(e){
                       if( confirm( translate('phenotypic-info-comfirm-delete') )){
                           let hpo_id = $(this).next().text();
                           let idx = phenotypeData['pi001'].indexOf(hpo_id);
                           let phenotypeInfo = phenotypeInfo_getPhenotypeInfo();
                           phenotypeInfo.columns.forEach(col => {
                               phenotypeData[col.columnId].splice(idx,1);
                           })
                           phenotypeInfo_updateNum();
                           $(this).closest('li').remove();
                       }
                       e.stopPropagation();
                   })
                   .appendTo($header_sub_left);

        // hpo id
        let button = document.createElement('button');
        button.textContent = phenotypeData['pi001'][i];
        button.classList.add("list-tag");
        button.classList.add("hpo_id");
        //$('<span>').addClass('hpo_id').text(phenotypeData['pi001'][i]).appendTo($header_sub_left);
        tippy(button, {
            arrow:         false,
            allowHTML:     true,
            appendTo:      document.body,
            animation:     'scale',
            animationFill: true,
            trigger:      'click',
            maxWidth:      400,
            strategy:     'fixed',
            interactive:  true,
            theme:        'pcf-popup',
            placement:    'bottom-start',
            content:      'Loading...',
            offset:       [0,0],
            popup_url:    URL_GET_HPO_TOOLTIP_DATA_BY_HPO_ID+'?hpo_id=' + phenotypeData['pi001'][i],
            popup_id:     phenotypeData['pi001'][i],
            popup_lang:   lang==='ja'?'ja':'en',
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

        $(button).click(function(e){e.stopPropagation();}).appendTo($header_sub_left);

        // hpo name
        if(lang === 'ja'){
            let $div  = $('<div>').addClass('d-flex flex-row flex-grow-1').appendTo($header_sub_left); 
            let $div1 = $('<div>').addClass('d-flex align-items-start w-50').appendTo($div);
            let $div2 = $('<div>').addClass('d-flex align-items-start w-50').appendTo($div); 

            let hpo_name_ja = phenotypeData['pi002'][i]['name_ja'];
            $('<span>').addClass('text-left').text(hpo_name_ja).appendTo($div1);

            let hpo_name_en = phenotypeData['pi002'][i]['name_en'];
            $('<span>').addClass('text-left').text(hpo_name_en).appendTo($div2);

        } else {
            let hpo_name = phenotypeData['pi002'][i]['name_en'];
            let hpo_name_key = `name_${lang}`;
            if(phenotypeData['pi002'][i][hpo_name_key]) hpo_name = phenotypeData['pi002'][i][hpo_name_key];
            $('<span>').addClass('hpo_name').addClass('text-left').text(hpo_name).appendTo($header_sub_left);
        }


        let $header_sub_right = $('<div>').addClass('phenotype_list_row_header_sub').appendTo($header);

        // switch of if display detail 
        $('<span>').addClass("material-symbols-outlined detail_display_switch").text('expand_more')
                   .click(function(e){
                       $(this).closest('li').toggleClass('active');
                       e.stopPropagation();
                    })
                   .appendTo($header_sub_right);
        
        let $detail = $('<div>').addClass('detail').appendTo($li)
        let $tbl  = $('<table>').appendTo($detail)
        let $tr1  = $('<tr>').appendTo($tbl);
        let $td_h = $('<td>').attr('colspan',6).appendTo($tr1);
        // doc src list
        ['pi003','pi004','pi005','pi006'].forEach(cid => {
            let col         = phenotypeInfo.columns.filter(c => { return c.columnId === cid})[0]
            let displayName = col['displayName'][lang] || col['displayName']['en']
            let checked     = phenotypeData[cid][i] === col.options.dataValue[1] ? 'checked' : '';
            let cbx_id      = `cbx-${i}-${cid}`;
            phenotypeInfo_createCbx(cbx_id,cid,col.inputType,checked,displayName,phenotypeInfo_onInputChange).appendTo($td_h);
        });
        //detail 
        [['pi008','pi009','pi010'],['pi011','pi012','pi013'],['pi014','pi015']].forEach(lst => {
            let $tr = $('<tr>').appendTo($tbl);
            lst.forEach((cid,cid_idx) => {
                let col = phenotypeInfo.columns.filter(c => { return c.columnId === cid})[0];
                let displayName = col['displayName'][lang] || col['displayName']['en'];

                $('<td>').text(displayName).appendTo($tr);
                let $td2 = $('<td>').addClass('phenotype_input').appendTo($tr);

                if(lst.length < 3 && cid_idx === lst.length-1){
                    $td2.attr('colspan',3);
                }

                let input;
                if (col.inputType === 'text') {
                    input = document.createElement('input');
                    input.type = 'text';
                    let v = phenotypeData[cid][i];
                    $(input).val(v).appendTo($td2);
                } else if (col.inputType === 'select') {
                    input = document.createElement('select');
                    $(input).appendTo($td2);
                    let options = col.options.dataValue;
                    let optionLang = col['options'][lang].length > 0 ? col['options'][lang] : col['options']['en'];
                    options.forEach((o, k) => {
                        let option = document.createElement('option');
                        option.value = o;
                        option.innerText = optionLang[k]; 
                        input.add(option);
                    })
                    input.value = phenotypeData[cid][i];
                }

                $(input).data('cid', cid)
                        .data('inputType', col.inputType)
                        .change(function(){phenotypeInfo_onInputChange(this);});
            })
        })
    }
}

function phenotypeInfo_addRows(){
    let hpo_list = $("#search-box_form").search_box_form('get_tokens');
    
    if(!hpo_list || !hpo_list.length) return;
    
    let phenotypeInfo = categories.filter(c => { return c.dataKey === 'phenotypicInfo' })[0]

    hpo_list.forEach(hpo => {
        let hpo_id = hpo.id.replace('_ja','');
        let existed_hpo = [];
        phenotypeData['pi001'].filter((hid,idx) => { 
            if(hid === hpo_id){
                existed_hpo.push(idx)
            } 
        })
        if(existed_hpo.length) {
            let idx = existed_hpo[0]
            if('docId' in hpo){
                phenotypeData[hpo.docId][idx] = phenotypeInfo.columns.filter(c => { return c.columnId === hpo.docId})[0].options.dataValue[1]
                phenotypeData['pi008'][idx]   = hpo.is_observed
            }else{
                phenotypeData['pi007'][idx] = phenotypeInfo.columns.filter(c => { return c.columnId === 'pi007'})[0].options.dataValue[1]
                phenotypeData['pi008'][idx] = phenotypeInfo.columns.filter(c => { return c.columnId === 'pi008'})[0].options.dataValue[0]
            }
            return;
        }
        phenotypeInfo.columns.forEach(c => {
            if(c.columnId === 'pi001'){
                let col_val = hpo[c.dataKey].replace('_ja','');
                phenotypeData[c.columnId].push(col_val);
                return
            }

            if(c.columnId === 'pi002'){
                let obj = {};
                c.languages.forEach(language => {
                    let key = `name_${language}`;
                    obj[key] = key in hpo ? hpo[key] : '';
                });
                phenotypeData[c.columnId].push(obj);
                return
            }

            if (['pi003', 'pi004', 'pi005', 'pi006'].includes(c.columnId)) {
                if('docId' in hpo && hpo.docId === c.columnId){
                    // from doc
                    phenotypeData[c.columnId].push(c.options.dataValue[1])
                }else{
                    // from manual
                    phenotypeData[c.columnId].push(c.options.dataValue[0])
                }
                return
            }
            
            if(c.columnId === 'pi007'){
                if('docId' in hpo){
                    // from document,then set manual flag to no
                    phenotypeData[c.columnId].push(c.options.dataValue[0])
                }else{
                    //manual input,,then set manual flag to yes
                    phenotypeData[c.columnId].push(c.options.dataValue[1])
                }
                return
            }
            
            if(c.columnId === 'pi008'){
                if('is_observed' in hpo){
                    // from document,then set to the document value
                    phenotypeData[c.columnId].push(hpo.is_observed)
                }else{
                    // from manual,then set to default yes
                    phenotypeData[c.columnId].push(c.options.dataValue[0])
                }
                return
            }
            
            if('options' in c){
                phenotypeData[c.columnId].push(c.options.dataValue[0])
            }else{
                phenotypeData[c.columnId].push('')
            }
        })
    })
    
    $("#search-box_form").search_box_form('clear_tokens');
    phenotypeInfo_reset_hpo_filter();
    phenotypeInfo_reset_hpo_list();
    phenotypeInfo_createRows();
    phenotypeInfo_updateFilterCNT();
    phenotypeInfo_onFilterChange();
}

function phenotypeInfo_reset(){

	// clear data
    phenotypeInfo_initPhenotypData();

    // search_box reset
    $("#search-box_form").search_box_form('clear_input_area');
    $("#search-box_form").search_box_form('load_dic_if_needed');

    // filter reset
    phenotypeInfo_reset_hpo_filter();

    // list reset
    phenotypeInfo_reset_hpo_list();

    // 
    $('#phenotype_add').show();
    $('#phenotype_doc_input_btn_wrapper').show();
}

function phenotypeInfo_reset_hpo_filter(){
    $('#phenotypic-btn-filter').removeClass('active')
    $('#phenotype_filter').removeClass('active')
    //$('#phenotype_list').find('li').show();
}

function phenotypeInfo_reset_hpo_list(){
    // hpo list reset
    $('#phenotype-detail-switch').removeClass('active')
    $('#phenotype-detail-switch').val('0')
    $('#phenotype_num').text('(0)')
    $('#phenotype_list').empty()
}

function phenotypeInfo_inputValues(patientData){
    phenotypeInfo_initPhenotypData(patientData);
    phenotypeInfo_createRows();
    phenotypeInfo_updateFilterCNT();
    phenotypeInfo_onFilterChange();
}

function phenotypeInfo_getDocByColId(dataSrcColumnId){
    let val = `${document.querySelector(`.tab-wrap *[name="${dataSrcColumnId}"]`).value}`;
    return val;
}

function phenotypeInfo_phenotypeNameRenderer(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.BaseRenderer.apply(this, arguments);
    let displayValue = "";
    if (value && value.length) {
        let h = [];
        value.forEach(names => {
            let n_k = `name_${lang}`;
            let n = names[n_k] ? names[n_k] : names['name_en'];
            h.push(n);
        });
        displayValue = h.join('<br>');
    }
    td.innerHTML = displayValue;
}