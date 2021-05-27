# -*- coding: utf-8 -*-

from flask import Flask, session, render_template, request, redirect, url_for, jsonify, make_response
import os
import re
import MySQLdb
import json
import sys
import datetime
import copy
import mojimoji
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from io import StringIO, BytesIO
import csv
# https://blog.capilano-fw.com/?p=398
from flask_babel import gettext,Babel
from flask_cors import CORS

from utils.check_input import process_input_phenotype, process_input_gene

# API for MME
from utils.api_mme import make_JSON_MME, make_JSON_IRUD
from utils.api_mme_omim import make_JSON_MME_omim, make_JSON_IRUD_omim, make_JSON_IRUD_omim_all

# API for PhenoTouch
from utils.api_get_hpo_by_text import search_hpo_by_text

# API: get rank OMIM
from utils.get_rank_omim import get_rank_omim


app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,session_id')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD')
    # The add method cannot be used here, otherwise the problem of The 'Access-Control-Allow-Origin' header contains multiple values ​​will appear.
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

app.secret_key = 'pubcasefinder1210'

# https://github.com/shibacow/flask_babel_sample/blob/master/srv.py
babel = Babel(app)
@babel.localeselector
def get_locale():
    if 'lang' not in session:
        session['lang'] = request.accept_languages.best_match(['ja', 'ja_JP', 'en'])
    if request.args.get('lang'):
        session['lang'] = request.args.get('lang')
    return session.get('lang', 'en')
app.jinja_env.globals.update(get_locale=get_locale)

# debug
app.debug = True

#####
# DB設定
app.config.from_pyfile('config.cfg')
db_sock = app.config['DBSOCK']
db_name = app.config['DBNAME']
db_user = app.config['DBUSER']
db_pw   = app.config['DBPW']




#####
# Routing
# http://qiita.com/Morinikki/items/c2af4ffa180856d1bf30
# http://flask.pocoo.org/docs/0.12/quickstart/
#####

#####
# display top page
# /
@app.route('/')
def index():
    return render_template('index.html')


#####
# display datasets page
# /datasets
@app.route('/datasets')
def datasets():
    if get_locale() == "ja" or get_locale() == "ja_JP":
        return render_template('/datasets/v1.3.0/datasets_ja.html')
    else:
        return render_template('/datasets/v1.3.0/datasets_en.html')


#####
# display history page
# /history
@app.route('/history')
def history():
    if get_locale() == "ja" or get_locale() == "ja_JP":
        return render_template('history_ja.html')
    else:
        return render_template('history_en.html')


#####
# display terms of service page
# /termsofservice
@app.route('/termsofservice')
def termsofservice():
    if get_locale() == "ja" or get_locale() == "ja_JP":
        return render_template('termsofservice_ja.html')
    else:
        return render_template('termsofservice_en.html')


#####
# display API page
# /mme
@app.route('/mme')
def mme():
    return render_template('pubcasefinder_api_en.html')


#####
# display result page
@app.route('/result', methods=['GET'])
def result():
    r_target = ""
    r_phenotype = ""
    r_filter = ""
    r_size = ""
    r_display_format = ""
    r_lang = ""
    if request.args.get('target') is not None:
        r_target = request.args.get('target')
    if request.args.get('phenotype') is not None:
        r_phenotype = request.args.get('phenotype')
    if request.args.get('filter') is not None:
        r_filter = request.args.get('filter')
    if request.args.get('size') is not None:
        r_size = request.args.get('size')
    if request.args.get('display_format') is not None:
        r_display_format = request.args.get('display_format')
    if request.args.get('lang') is not None:
        r_lang = request.args.get('lang')

    return render_template('result.html',
                           r_target=r_target,
                           r_phenotype=r_phenotype,
                           r_filter=r_filter,
                           r_size=r_size,
                           r_display_format=r_display_format,
                           r_lang=r_lang)


#####
# display text2hpo page
# /text2hpo
@app.route('/text2hpo')
def text2hpo():
   return render_template('text2hpo.html')


#####
# API: provide candidate HPO IDs using text as query
# POST method
# /get_hpo_by_text
@app.route('/get_hpo_by_text', methods=['POST'])
def POST_API_GET_HPO_BY_TEXT():
    if request.method == 'POST':
        text = request.form['text']
        if text == "":
            return "none"
    else:
        return "none"
    str_list_hpo = search_hpo_by_text(text)
    return str_list_hpo


#####
# API: for MME
# POST method
# /mme/match
@app.route('/mme/match', methods=['POST'])
def REST_API_JSON_MME_POST():
    pattern_content_type_json = r'application\/json*'
    pattern_content_type_matchmaker = r'application\/vnd.ga4gh.matchmaker.v\d+.\d+\+json*'
    if not re.search(pattern_content_type_json , request.headers['Content-Type']) and not re.search(pattern_content_type_matchmaker , request.headers['Content-Type']):
        print(request.headers['Content-Type'])
        return jsonify(res='Error: Content-Type'), 400

    # utils/api_mme.py
    dict_results = make_JSON_MME(request.json)

    return jsonify(dict_results)


#####
# API: get ranking using HPO IDs as query
# GET method
# /pcf_get_ranking_by_hpo_id/?target=[TARGET]&phenotype=[HPO_ID]
#@app.route('/get_rank_omim/phenotype:<string:phenotypes>', methods=['GET'])
@app.route('/pcf_get_ranking_by_hpo_id', methods=['GET'])
def pcf_get_ranking_by_hpo_id():
    r_target = ""
    r_phenotype = ""
    if request.args.get('target') is not None:
        r_target = request.args.get('target')
    if request.args.get('phenotype') is not None:
        r_phenotype = request.args.get('phenotype')

    # check query : phenotypes
    list_dict_phenotype, phenotypes_remove_error, phenotypes_remove_error_ja = process_input_phenotype(r_phenotype)

    if request.method == 'GET':
        dict_result = get_rank_omim(phenotypes_remove_error_ja)
        return jsonify(dict_result)


#####
# tokeninput_hpo()
# complement input for phenotypes
#####
@app.route('/tokeninput_hpo', methods=['GET', 'POST'])
def tokeninput_hpo():

    list_json = []

    # GETメソッドの値を取得
    if request.method == 'GET':

        # requestから値を取得
        #tokeninput = request.args.get("q")
        tokeninputs = request.args.get("q").replace(u'　', u' ').split()
        sql_params = []
        in_tokeninputs = []
        for v in tokeninputs:
            sql_params.append("%"+v+"%")
            in_tokeninputs.append(mojimoji.zen_to_han(v, kana=False).lower())
        for v in tokeninputs:
            sql_params.append("%"+v+"%")

        # OntoTermテーブルからHPのtermを検索
        ## SQLのLIKEを使うときのTips
        ### http://d.hatena.ne.jp/heavenshell/20111027/1319712031
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        # ICテーブルに存在する各termの頻度で、表示するtermをソート
        #sql_OntoTerm = u"select distinct a.uid, a.uid_value, b.FreqSelf from IndexFormHP as a left join IC as b on replace(a.uid, '_ja', '')=b.OntoID where a.uid_value like %s order by b.FreqSelf desc, value"
        sql_OntoTerm = u"select distinct a.uid, a.value, c.OntoSynonym, b.FreqSelf from IndexFormHP as a left join IC as b on replace(a.uid, '_ja', '')=b.OntoID LEFT JOIN OntoTermHPInformation AS c ON a.uid=c.OntoID where {0} OR (LENGTH(a.value)=CHARACTER_LENGTH(a.value) AND a.uid IN (SELECT OntoID FROM OntoTermHPSynonym WHERE OntoVersion='20190603' AND {1})) order by b.FreqSelf desc, value".format(' AND '.join(map(lambda x: "a.uid_value collate utf8_unicode_ci like %s", tokeninputs)),' AND '.join(map(lambda x: "OntoSynonym collate utf8_unicode_ci like %s", tokeninputs)))
        cursor_OntoTerm = OBJ_MYSQL.cursor()
        cursor_OntoTerm.execute(sql_OntoTerm, tuple(sql_params))
        values = cursor_OntoTerm.fetchall()
        cursor_OntoTerm.close()
        for value in values:
            dict_json = {}
            onto_id = mojimoji.zen_to_han(value[0], kana=False).lower()
            onto_id_term = mojimoji.zen_to_han(value[1], kana=False).lower()
            onto_id_synonym = []

            for in_tokeninput in in_tokeninputs:
                if type(onto_id) is str and len(onto_id) and in_tokeninput not in onto_id:
                    onto_id = None
                if type(onto_id_term) is str and len(onto_id_term) and in_tokeninput not in onto_id_term:
                    onto_id_term = None
                if onto_id is None and onto_id_term is None:
                    break

            if onto_id is None and onto_id_term is None and type(value[2]) is str and len(value[2]):
                list_synonym = value[2].split('|')
                for synonym in list_synonym:
                    temp_synonym = mojimoji.zen_to_han(synonym, kana=False).lower()
                    for in_tokeninput in in_tokeninputs:
                        if type(temp_synonym) is str and len(temp_synonym) and in_tokeninput not in temp_synonym:
                            temp_synonym = None
                            break
                    if temp_synonym is not None:
                        onto_id_synonym.append(synonym)

            dict_json['id'] = value[0]
            dict_json['name'] = value[1]
            if len(onto_id_synonym)>0:
                dict_json['synonym'] = onto_id_synonym
            else:
                dict_json['synonym'] = None
            list_json.append(dict_json)

    OBJ_MYSQL.close()

    return jsonify(list_json)


#####
# popup_hierarchy_hpo()
# オントロジーのバージョンをSQL内で"20170630"に固定しているので、要修正
#####
@app.route('/popup_hierarchy_hpo', methods=['GET', 'POST'])
def popup_hierarchy_hpo():

    list_json = []

    # GETメソッドの値を取得
    if request.method == 'GET':

        # requestから値を取得
        #onto_id = request.args.get("q")
        onto_id_pre = request.args.get("q")
        onto_id = onto_id_pre.replace('_ja', '')

        # MySQLへ接続
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

        # JSONデータ
        dict_json = {}

        # OntoTermHPInformationテーブルから情報取得
        sql_information = u"select OntoName, OntoSynonym, OntoDefinition, OntoComment, OntoParentNum, OntoChildNum, OntoNameJa from OntoTermHPInformation where OntoVersion='20190603' and OntoID=%s"
        sql_informations_fmt = u"select OntoID, OntoName, OntoSynonym, OntoDefinition, OntoComment, OntoChildNum, OntoNameJa from OntoTermHPInformation where OntoVersion='20190603' and OntoID in (%s)"

        sql_hierarchy_parent = u"select OntoParentID from OntoTermHPHierarchy where OntoVersion='20190603' and OntoID=%s"
        sql_hierarchy_child  = u"select OntoID from OntoTermHPHierarchy where OntoVersion='20190603' and OntoParentID=%s"

        # OntoTermHPInformationテーブルからクエリにマッチするレコードを取得
        cursor_information = OBJ_MYSQL.cursor()
        cursor_information.execute(sql_information, (onto_id,))
        values_information = cursor_information.fetchall()
        cursor_information.close()

        for value_information in values_information:
            dict_self_class = {}
            onto_name       = value_information[0]
            onto_synonym    = value_information[1]
            onto_definition = value_information[2]
            onto_comment    = value_information[3]
            onto_parent_num = value_information[4]
            onto_child_num  = value_information[5]
            onto_name_ja    = value_information[6]
            dict_self_class['id']         = onto_id
            dict_self_class['name']       = onto_name
            dict_self_class['name_ja']    = onto_name_ja if onto_name_ja != "" else onto_name
            dict_self_class['synonym']    = onto_synonym
            dict_self_class['definition'] = onto_definition
            dict_self_class['comment']    = onto_comment

            list_parent_child_onto_id = []
            # OntoTermHPHierarchyから親クラスの情報取得
            list_parent_onto_id = []
            if onto_parent_num > 0:
                cursor_hierarchy_parent = OBJ_MYSQL.cursor()
                cursor_hierarchy_parent.execute(sql_hierarchy_parent, (onto_id,))
                values_hierarchy_parent = cursor_hierarchy_parent.fetchall()
                cursor_hierarchy_parent.close()

                for value_hierarchy_parent in values_hierarchy_parent:
                    parent_onto_id = value_hierarchy_parent[0]
                    list_parent_onto_id.append(parent_onto_id)
                    list_parent_child_onto_id.append(parent_onto_id)

            # OntoTermHPHierarchyから子クラスの情報取得
            list_child_onto_id = []
            if onto_child_num > 0:
                cursor_hierarchy_child = OBJ_MYSQL.cursor()
                cursor_hierarchy_child.execute(sql_hierarchy_child, (onto_id,))
                values_hierarchy_child = cursor_hierarchy_child.fetchall()
                cursor_hierarchy_child.close()

                for value_hierarchy_child in values_hierarchy_child:
                    child_onto_id = value_hierarchy_child[0]
                    list_child_onto_id.append(child_onto_id)
                    list_parent_child_onto_id.append(child_onto_id)

            # OntoTermHPInformations_fmtテーブルからクエリにマッチするレコードを取得
            in_onto_id=', '.join(map(lambda x: '%s', list_parent_child_onto_id))
            sql_informations_fmt = sql_informations_fmt % in_onto_id
            cursor_informations_fmt = OBJ_MYSQL.cursor()
            cursor_informations_fmt.execute(sql_informations_fmt, list_parent_child_onto_id)
            values_informations_fmt = cursor_informations_fmt.fetchall()
            cursor_informations_fmt.close()

            dict_all_class = {}
            for value_informations_fmt in values_informations_fmt:
                onto_id         = value_informations_fmt[0]
                onto_name       = value_informations_fmt[1]
                onto_synonym    = value_informations_fmt[2]
                onto_comment    = value_informations_fmt[3]
                onto_definition = value_informations_fmt[4]
                onto_child_num  = value_informations_fmt[5]
                onto_name_ja    = value_informations_fmt[6]
                dict_all_class[onto_id] = {}
                dict_all_class[onto_id]['id']      = onto_id
                dict_all_class[onto_id]['name']    = onto_name
                dict_all_class[onto_id]['name_ja'] = onto_name_ja if onto_name_ja != "" else onto_name
                dict_all_class[onto_id]['count']   = onto_child_num

            # JSON作成
            ## self class リスト
            list_self_class = []
            list_self_class.append(dict_self_class)

            ## parent class リスト
            list_super_class = []
            if len(list_parent_onto_id) > 0:
                for parent_onto_id in list_parent_onto_id:
                    list_super_class.append(dict_all_class[parent_onto_id])

            ## child class リスト
            list_sub_class = []
            if len(list_child_onto_id) > 0:
                for child_onto_id in list_child_onto_id:
                    list_sub_class.append(dict_all_class[child_onto_id])
            
            ## dict_json に収納
            dict_json['selfclass']  = list_self_class
            dict_json['superclass'] = list_super_class
            dict_json['subclass']   = list_sub_class

    OBJ_MYSQL.close()

    return jsonify(dict_json)


#####
# Validate file size by parsing the entire file or up to MAX_FILE_SIZE, whichever comes first.
# This is done to prevent DoS attacks by forcing the system to parse the entirety of very large
# files to get the total size.
# This will force the file to be parsed twice, however; once for file size check, once to save
# the file data. Combine both to improve efficiency.
#####
def validateFileSize(file):
    chunk = 10 #chunk size to read per loop iteration; 10 bytes
    data = None
    size = 0

    #keep reading until out of data
    while data != b'':
        data = file.read(chunk)
        size += len(data)
        #return false if the total size of data parsed so far exceeds MAX_FILE_SIZE
        #if size >  app.config['MAX_FILE_SIZE']:
        if size >  1000000: # 1MB limit
            return False

    return True




