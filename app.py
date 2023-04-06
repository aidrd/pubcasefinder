# -*- coding: utf-8 -*-

from flask import Flask, session, render_template, request, redirect, url_for, jsonify, make_response, Response
import os
import re
import MySQLdb
import json
import sys
import datetime
import copy
import mojimoji
import requests
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from io import StringIO, BytesIO
import csv
# https://blog.capilano-fw.com/?p=398
from flask_babel import gettext,Babel
from flask_cors import CORS
# timestamp
from datetime import datetime
from pytz import timezone

# check input
from utils.check_input import process_input_phenotype

# API for PhenoTouch
from utils.api_get_hpo_by_text import search_hpo_by_text
from utils.api_get_hpo_by_text import search_hpo_by_text_with_dict

# API: get rank OMIM
from utils.api_pcf_get_ranking_by_hpo_id import pcf_get_ranking_by_hpo_id

# API: pcf_get_case_report_by_mondo_id
from utils.api_pcf_get_case_report_by_mondo_id import pcf_get_case_report_by_mondo_id

# API: pcf_get_count_case_report_by_mondo_id
from utils.api_pcf_get_count_case_report_by_mondo_id import pcf_get_count_case_report_by_mondo_id

# API: pcf_filter_get_case_id_by_ncbi_gene_id
from utils.api_pcf_filter_get_case_id_by_ncbi_gene_id import pcf_filter_get_case_id_by_ncbi_gene_id

# API: pcf_filter_get_case_id_by_gene_id
from utils.api_pcf_filter_get_case_id_by_gene_id import pcf_filter_get_case_id_by_gene_id

# API: pcf_filter_get_case_id_by_mondo_id
from utils.api_pcf_filter_get_case_id_by_mondo_id import pcf_filter_get_case_id_by_mondo_id

# API: pcf_filter_get_case_id_by_nando_id
from utils.api_pcf_filter_get_case_id_by_nando_id import pcf_filter_get_case_id_by_nando_id

# API: pcf_filter_get_gene_id_by_pa_id
from utils.api_pcf_filter_get_gene_id_by_pa_id import pcf_filter_get_gene_id_by_pa_id

# API: pcf_filter_get_case_id_by_pa_id
from utils.api_pcf_filter_get_case_id_by_pa_id import pcf_filter_get_case_id_by_pa_id

# API: pcf_filter_get_gene_id_by_paa_id
from utils.api_pcf_filter_get_gene_id_by_paa_id import pcf_filter_get_gene_id_by_paa_id

# API: pcf_filter_get_case_id_by_paa_id
from utils.api_pcf_filter_get_case_id_by_paa_id import pcf_filter_get_case_id_by_paa_id

# API: pcf_filter_get_all_case_id
from utils.api_pcf_filter_get_all_case_id import pcf_filter_get_all_case_id

# API pcf_get_pa_data_by_pa_id
from utils.api_pcf_get_pa_data_by_pa_id import pcf_get_pa_data_by_pa_id

# API pcf_get_paa_data_by_paa_id
from utils.api_pcf_get_paa_data_by_paa_id import pcf_get_paa_data_by_paa_id

# API pcf_get_mondo_data_by_mondo_id
from utils.api_pcf_get_mondo_data_by_mondo_id import pcf_get_mondo_data_by_mondo_id

# API pcf_get_nando_data_by_nando_id
from utils.api_pcf_get_nando_data_by_nando_id import pcf_get_nando_data_by_nando_id

# API pcf_get_gene_data_by_gene_id
from utils.api_pcf_get_gene_data_by_gene_id import pcf_get_gene_data_by_gene_id

# API: pcf_download
from utils.api_pcf_download import pcf_download


app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII']=False

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
# display case
# /
@app.route('/case')
def record():
    return render_template('record.html')


#####
# display case
# /
@app.route('/case_re')
def record_re():
    return render_template('record_re.html')


#####
# display top page
# /
@app.route('/')
def index():
    return render_template('index.html')


#####
# display guides page
# /guides
@app.route('/guides')
def guides():
    return render_template('guides.html')


#####
# display sources page
# /sources
@app.route('/sources')
def sources():
    return render_template('sources.html')


#####
# display history page
# /history
@app.route('/history')
def history():
    return render_template('history.html')


#####
# display terms of service page
# /termsofservice
@app.route('/termsofservice')
def termsofservice():
    return render_template('termsofservice.html')


#####
# display MME API page
# /mme
@app.route('/mme')
def mme():
    return render_template('api.html')


#####
# PubCaseFinder API page
# /api
@app.route('/api')
def api():
    return render_template('api.html')


#####
# display result page
@app.route('/result', methods=['GET'])
def result():
    r_target = ""
    r_phenotype = ""
    r_filter = ""
    r_vgp = ""
    r_size = ""
    r_display_format = ""
    r_lang = ""
    if request.args.get('target') is not None:
        r_target = request.args.get('target')
    if request.args.get('phenotype') is not None:
        r_phenotype = request.args.get('phenotype')
    if request.args.get('filter') is not None:
        r_filter = request.args.get('filter')
    if request.args.get('vgp') is not None:
        r_vgp = request.args.get('vgp')
    if request.args.get('size') is not None:
        if request.args.get('size') in  ['10','20','50','100','200']:
            r_size = request.args.get('size')
        else:
            r_size = '10'
    else:
        r_size = '10'
    if request.args.get('display_format') is not None:
        r_display_format = request.args.get('display_format')
    if request.args.get('lang') is not None:
        r_lang = request.args.get('lang')

    if(len(r_phenotype) > 0):
        list_phenotypes = r_phenotype.split(',')
        list_phenotypes_uniq = []
        for phenotype in list_phenotypes:
            if phenotype not in list_phenotypes_uniq and phenotype.replace('_ja', '') not in list_phenotypes_uniq and phenotype + '_ja' not in list_phenotypes_uniq:
                list_phenotypes_uniq.append(phenotype)

        phenotypes = ','.join(list_phenotypes_uniq)
        phenotypes = re.sub(r'^,+', '', phenotypes)
        phenotypes = re.sub(r',+$', '', phenotypes)
        r_phenotype = phenotypes

    if(len(r_filter) > 0):
        list_filters = r_filter.split(',')
        list_filters_uniq = []
        for str_filter in list_filters:
            if str_filter not in list_filters_uniq:
                list_filters_uniq.append(str_filter)

        filters = ','.join(list_filters_uniq)
        filters = re.sub(r'^,+', '', filters)
        filters = re.sub(r',+$', '', filters)
        r_filter = filters

    if(len(r_vgp) > 0):
        list_filters = r_vgp.split(',')
        list_filters_uniq = []
        for str_filter in list_filters:
            if str_filter not in list_filters_uniq:
                list_filters_uniq.append(str_filter)

        filters = ','.join(list_filters_uniq)
        filters = re.sub(r'^,+', '', filters)
        filters = re.sub(r',+$', '', filters)
        r_vgp = filters


    return render_template('result.html',
                           r_target=r_target,
                           r_phenotype=r_phenotype,
                           r_filter=r_filter,
                           r_vgp=r_vgp,
                           r_size=r_size,
                           r_display_format=r_display_format,
                           r_lang=r_lang)


#####
# display text2hpo page
# /ehr
@app.route('/ehr')
def ehr():
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
# API: provide candidate HPO IDs using text as query
# GET method
# /pcf_get_hpo_by_text?text=[TEXT]
@app.route('/pcf_get_hpo_by_text', methods=['GET'])
def api_pcf_get_hpo_by_text():
    r_text = ""
    if request.args.get('text') is not None:
        r_text = request.args.get('text')
        if r_text == "":
            return "none"
    else:
        return "none"

    dict_result = search_hpo_by_text_with_dict(r_text)
    return jsonify(dict_result)


#####
# API: get ranking using HPO IDs as query
# GET method
# /pcf_get_ranking_by_hpo_id?target=[TARGET]&phenotype=[HPO_ID]
# /pcf_get_ranking_by_hpo_id?target=[TARGET]&phenotype=[HPO_ID]&weight=[WEIGHT]
@app.route('/pcf_get_ranking_by_hpo_id', methods=['GET'])
def api_pcf_get_ranking_by_hpo_id():
    r_target    = ""
    r_phenotype = ""
    r_weight    = 1.0
    if request.args.get('target') is not None:
        r_target = request.args.get('target')
    if request.args.get('phenotype') is not None:
        r_phenotype = request.args.get('phenotype')
    if request.args.get('weight') is not None:
        r_weight = float(request.args.get('weight'))

    # check query : phenotypes
    #list_dict_phenotype, phenotypes_remove_error, phenotypes_remove_error_ja = process_input_phenotype(r_phenotype)
    list_dict_phenotype, phenotypes_remove_error, phenotypes_remove_error_ja = process_input_phenotype(r_phenotype)

    if request.method == 'GET':
        dict_result = pcf_get_ranking_by_hpo_id(r_target, phenotypes_remove_error_ja, r_weight)
        return jsonify(dict_result)


#####
# API: Get case reports by MONDO ID
# GET method
# /pcf_get_case_report_by_mondo_id?mondo_id=[MONDO_ID]&lang=[LANG]
# /api/get_case_report?id=[MONDO_ID]
@app.route('/pcf_get_case_report_by_mondo_id', methods=['GET'])
@app.route('/api/get_case_report', methods=['GET'])
def api_pcf_get_case_report_by_mondo_id():
    r_mondo_id = ""
    r_lang = ""
    if request.args.get('mondo_id') is not None:
        r_mondo_id = request.args.get('mondo_id')
    if request.args.get('id') is not None:
        r_mondo_id = request.args.get('id')
    if request.args.get('lang') is not None:
        r_lang = request.args.get('lang')
    elif request.args.get('lang') is None:
        r_lang = 'en'

    if request.method == 'GET':
        result = pcf_get_case_report_by_mondo_id(r_mondo_id, r_lang)
        return jsonify(result)


#####
# API: Get count case reports by MONDO ID
# GET method
# /pcf_get_count_case_report_by_mondo_id?mondo_id=[MONDO_ID]&lang=[LANG]
@app.route('/pcf_get_count_case_report_by_mondo_id', methods=['GET'])
def api_pcf_get_count_case_report_by_mondo_id():
    r_mondo_id = ""
    r_lang = ""
    if request.args.get('mondo_id') is not None:
        r_mondo_id = request.args.get('mondo_id')
    if request.args.get('lang') is not None:
        r_lang = request.args.get('lang')

    if request.method == 'GET':
        result = pcf_get_count_case_report_by_mondo_id(r_mondo_id, r_lang)
        return jsonify(result)


#####
# API: Filter case ID list: pcf_filter_get_case_id_by_ncbi_gene_id
# GET method
# /pcf_filter_get_case_id_by_ncbi_gene_id?ncbi_gene_id=[NCBI_GENE_ID]
@app.route('/pcf_filter_get_case_id_by_ncbi_gene_id', methods=['GET'])
def api_pcf_filter_get_case_id_by_ncbi_gene_id():
    r_ncbi_gene_id = ""
    if request.args.get('ncbi_gene_id') is not None:
        r_ncbi_gene_id = request.args.get('ncbi_gene_id')

    if request.method == 'GET':
        result = pcf_filter_get_case_id_by_ncbi_gene_id(r_ncbi_gene_id)
        return jsonify(result)


###### API: Filter case ID list: pcf_filter_get_case_id_by_gene_id
# GET method
# /pcf_filter_get_case_id_by_gene_id?gene_id=[GENE_ID]
@app.route('/pcf_filter_get_case_id_by_gene_id', methods=['GET'])
def api_pcf_filter_get_case_id_by_gene_id():
    r_gene_id = ""
    if request.args.get('gene_id') is not None:
        r_gene_id = request.args.get('gene_id')
    if request.method == 'GET':
        result = pcf_filter_get_case_id_by_gene_id(r_gene_id)
        return jsonify(result)

#####
# API: Filter case ID list: pcf_filter_get_case_id_by_mondo_id
# GET method
# /pcf_filter_get_case_id_by_mondo_id?mondo_id=[MONDO_ID]
@app.route('/pcf_filter_get_case_id_by_mondo_id', methods=['GET'])
def api_pcf_filter_get_case_id_by_mondo_id():

    r_mondo_id = ""

    if request.args.get('mondo_id') is not None:
        r_mondo_id = request.args.get('mondo_id')

    if request.method == 'GET':
        result = pcf_filter_get_case_id_by_mondo_id(r_mondo_id)
        return jsonify(result)

#####
# API: Filter case ID list: pcf_filter_get_case_id_by_nando_id
# GET method
# /pcf_filter_get_case_id_by_nando_id?nando_id=[NANDO_ID]
@app.route('/pcf_filter_get_case_id_by_nando_id', methods=['GET'])
def api_pcf_filter_get_case_id_by_nando_id():

    r_nando_id = ""

    if request.args.get('nando_id') is not None:
        r_nando_id = request.args.get('nando_id')

    if request.method == 'GET':
        result = pcf_filter_get_case_id_by_nando_id(r_nando_id)
        return jsonify(result)


#####
# API: Filter case ID list: pcf_filter_get_case_id_by_pa_id
# GET method
# /pcf_filter_get_case_id_by_pa_id?pa_id=[PA_ID]
@app.route('/pcf_filter_get_case_id_by_pa_id', methods=['GET'])
def api_pcf_filter_get_case_id_by_pa_id():

    r_pa_id = ""

    if request.args.get('pa_id') is not None:
        r_pa_id = request.args.get('pa_id')

    if request.method == 'GET':
        result = pcf_filter_get_case_id_by_pa_id(r_pa_id)
        return jsonify(result)



#####
# API: Filter case ID list: pcf_filter_get_case_id_by_paa_id
# GET method                                                                                                                  
# /pcf_filter_get_case_id_by_paa_id?paa_id=[PAA_ID]
@app.route('/pcf_filter_get_case_id_by_paa_id', methods=['GET'])
def api_pcf_filter_get_case_id_by_paa_id():

    r_paa_id = ""

    if request.args.get('paa_id') is not None:
        r_paa_id = request.args.get('paa_id')

    if request.method == 'GET':
        result = pcf_filter_get_case_id_by_paa_id(r_paa_id)
        return jsonify(result)


#####
# API: Filter case ID list: pcf_filter_get_all_case_id
# GET method
# /pcf_filter_get_all_case_id
@app.route('/pcf_filter_get_all_case_id', methods=['GET'])
def api_pcf_filter_get_all_case_id():
    result = pcf_filter_get_all_case_id()
    return jsonify(result)

#####
# API: Filter gene ID list: pcf_filter_get_gene_id_by_pa_id
# GET method
# /pcf_filter_get_gene_id_by_pa_id
@app.route('/pcf_filter_get_gene_id_by_pa_id', methods=['GET'])
def api_pcf_filter_get_gene_id_by_pa_id():

    r_pa_id = ""

    if request.args.get('pa_id') is not None:
        r_pa_id = request.args.get('pa_id')

    if request.method == 'GET':
        result = pcf_filter_get_gene_id_by_pa_id(r_pa_id)
        return jsonify(result)


#####
# API: Filter gene ID list: pcf_filter_get_gene_id_by_paa_id
# GET method
# /pcf_filter_get_gene_id_by_paa_id
@app.route('/pcf_filter_get_gene_id_by_paa_id', methods=['GET'])
def api_pcf_filter_get_gene_id_by_paa_id():

    r_paa_id = ""

    if request.args.get('paa_id') is not None:
        r_paa_id = request.args.get('paa_id')

    if request.method == 'GET':
        result = pcf_filter_get_gene_id_by_paa_id(r_paa_id)
        return jsonify(result)


# API: Filter PA DATA: pcf_get_pa_data_by_pa_id
# GET method
# /pcf_get_pa_data_by_pa_id
@app.route('/pcf_get_pa_data_by_pa_id', methods=['GET'])
def api_pcf_get_pa_data_by_pa_id():

    r_pa_id = ""

    if request.args.get('pa_id') is not None:
        r_pa_id = request.args.get('pa_id')

    if request.method == 'GET':
        result = pcf_get_pa_data_by_pa_id(r_pa_id)
        return jsonify(result)

# API: Filter PAA DATA: pcf_get_paa_data_by_paa_id
# GET method
# /pcf_get_paa_data_by_paa_id
@app.route('/pcf_get_paa_data_by_paa_id', methods=['GET'])
def api_pcf_get_paa_data_by_paa_id():

    r_paa_id = ""

    if request.args.get('paa_id') is not None:
        r_paa_id = request.args.get('paa_id')

    if request.method == 'GET':
        result = pcf_get_paa_data_by_paa_id(r_paa_id)
        return jsonify(result)


# API: Filter MONDO DATA: pcf_get_mondo_data_by_mondo_id
# GET method
# /pcf_get_mondo_data_by_mondo_id
@app.route('/pcf_get_mondo_data_by_mondo_id', methods=['GET'])
def api_pcf_get_mondo_data_by_mondo_id():

    r_mondo_id = ""
    if request.args.get('mondo_id') is not None:
        r_mondo_id = request.args.get('mondo_id')

    if request.method == 'GET':
        result = pcf_get_mondo_data_by_mondo_id(r_mondo_id)
        return jsonify(result)


# API: Filter NANDO DATA: pcf_get_nando_data_by_nando_id
# GET method
# /pcf_get_nando_data_by_nando_id
@app.route('/pcf_get_nando_data_by_nando_id', methods=['GET'])
def api_pcf_get_nando_data_by_nando_id():

    r_nando_id = ""
    if request.args.get('nando_id') is not None:
        r_nando_id = request.args.get('nando_id')

    if request.method == 'GET':
        result = pcf_get_nando_data_by_nando_id(r_nando_id)
        return jsonify(result)


# API: Filter GENE DATA: pcf_get_gene_data_by_gene_id
# GET method
# /pcf_get_gene_data_by_gene_id
@app.route('/pcf_get_gene_data_by_gene_id', methods=['GET'])
def api_pcf_get_gene_data_by_gene_id():
    r_gene_id = ""
    if request.args.get('gene_id') is not None:
        r_gene_id = request.args.get('gene_id')
    if request.method == 'GET':
        result = pcf_get_gene_data_by_gene_id(r_gene_id)
        return jsonify(result)



#####
# API: 
# GET method
# /api/pcf_expand_get_mondo_id_by_mondo_id
@app.route('/api/pcf_expand_get_mondo_id_by_mondo_id', methods=['GET'])
def pcf_expand_get_mondo_id_by_mondo_id():
    r_mondo_id = ""
    if request.args.get('mondo_id') is not None:
        r_mondo_id = request.args.get('mondo_id')

    #url_api_pcf_expand_get_mondo_id_by_mondo_id  = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_expand_get_mondo_id_by_mondo_id_onepathup_onlyone"
    url_api_pcf_expand_get_mondo_id_by_mondo_id  = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_expand_get_mondo_id_by_mondo_id_min200_onlyone"
    dict_param = {"mondo_id":r_mondo_id}
    r_post = requests.post(url_api_pcf_expand_get_mondo_id_by_mondo_id, data=dict_param)
    json_post = r_post.json()
    return jsonify(json_post)

    #list_mondo_id = ["MONDO:0002118"]
    #return jsonify(list_mondo_id)



#####
# API: 
# GET method
# /api/pcf_expand_get_nando_id_by_nando_id
@app.route('/api/pcf_expand_get_nando_id_by_nando_id', methods=['GET'])
def pcf_expand_get_nando_id_by_nando_id():
    r_nando_id = ""
    if request.args.get('nando_id') is not None:
        r_nando_id = request.args.get('nando_id')

    list_nando_id = ["NANDO:1200473","NANDO:2200865"]
    #return jsonify(result)
    return jsonify(list_nando_id)



#####
# API: Share URL
# GET method
# /pcf_share?share=[SHARE]&url=[URL]
@app.route('/pcf_share', methods=['GET','POST'])
def api_pcf_get_share():
    r_share = ""
    r_url = ""
    if request.args.get('share') is not None:
        r_share = request.args.get('share')

    if request.args.get('url') is not None:
        r_url = request.args.get('url')

    if r_share == "url":
        app.logger.error(r_url)

    return ('OK'), 200


#####
# API: Get Data Record
# GET method
# /api/get_data_record?target=[RECORD_TARGET]&id=[RECORD_ID]
@app.route('/api/get_data_record', methods=['GET'])
def api_pcf_get_data_record():
    r_target = ""
    r_id     = ""
    if request.args.get('target') is not None:
        r_target = request.args.get('target')
    if request.args.get('id') is not None:
        r_id = request.args.get('id')

    # get data record
    url = ""
    dict_param = {}
    if r_target == "omim":
        url = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_omim_data_by_omim_id"
        dict_param = {"omim_id":r_id}
    if r_target == "orphanet":
        url = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_orpha_data_by_orpha_id"
        dict_param = {"orpha_id":r_id}
    if r_target == "gene":
        url = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_gene_data_by_ncbi_gene_id"
        dict_param = {"ncbi_gene_id":r_id}

    if request.method == 'GET':
        if url != "":
            r_data = requests.get(url, params=dict_param)
            json_data = r_data.json()
            return jsonify(json_data)
        else:
            return


#####
# API: Get DPAs
# GET method
# /api/get_dpa
@app.route('/api/get_dpa', methods=['GET'])
def api_pcf_get_dpa():
    r_target = ""
    r_id     = ""
    if request.args.get('target') is not None:
        r_target = request.args.get('target')
    if request.args.get('id') is not None:
        r_id = request.args.get('id')

    # get data record
    url = ""
    dict_param = {}
    if r_target == "omim":
        url = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_omim_id"
        dict_param = {"omim_id":r_id}
    if r_target == "orphanet":
        url = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_orpha_id"
        dict_param = {"orpha_id":r_id}

    if request.method == 'GET':
        if url != "":
            r_data = requests.get(url, params=dict_param)
            json_data = r_data.json()
            return jsonify(json_data)
        else:
            return


#####
# API: Get GPAs
# GET method
# /api/get_gpa
@app.route('/api/get_gpa', methods=['GET'])
def api_pcf_get_gpa():
    r_id     = ""
    if request.args.get('id') is not None:
        r_id = request.args.get('id')

    # get data record
    url = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_hpo_data_by_gene_id"
    dict_param = {"ncbi_gene_id":r_id}

    if request.method == 'GET':
        if url != "":
            r_data = requests.get(url, params=dict_param)
            json_data = r_data.json()
            return jsonify(json_data)
        else:
            return


#####
# API: Download
# GET method
# /pcf_download?target=[TARGET]&phenotype=[HPO_ID]&target_id=[TARGET_ID]&format=[FORMAT]&range=[RANGE]
# /pcf_download?target=[TARGET]&phenotype=[HPO_ID]&target_id=[TARGET_ID]&format=[FORMAT]&range=[RANGE]&weight=[WEIGHT]
# /pcf_download?target=[TARGET]&phenotype=[HPO_ID]&target_id=[TARGET_ID]&format=[FORMAT]&range=[RANGE]&filter=[FILTER]
# /api/get_ranked_list?target=[TARGET]&format=[FORMAT]&hpo_id=[HPO_ID]
@app.route('/pcf_download', methods=['GET', 'POST'])
@app.route('/api/get_ranked_list', methods=['GET', 'POST'])
def api_pcf_download():
    r_target    = ""
    r_phenotype = ""
    r_target_id = ""
    r_format    = ""
    r_range     = ""
    r_weight    = 1.0
    r_filter    = ""

    if request.method == 'GET':
        if request.args.get('target') is not None:
            r_target = request.args.get('target')
        if request.args.get('phenotype') is not None:
            r_phenotype = request.args.get('phenotype')
        if request.args.get('hpo_id') is not None:
            r_phenotype = request.args.get('hpo_id')
        if request.args.get('target_id') is not None:
            r_target_id = request.args.get('target_id')
        if request.args.get('format') is not None:
            r_format = request.args.get('format')
        if request.args.get('range') is not None:
            r_range = request.args.get('range')
        if request.args.get('weight') is not None:
            r_weight = request.args.get('weight')
        if request.args.get('filter') is not None:
            r_filter = request.args.get('filter')
    else:
        if request.form is not None:
            if 'target' in request.form:
                r_target = request.form['target']
            if 'phenotype' in request.form:
                r_phenotype = request.form['phenotype']
            if 'hpo_id' in request.form:
                r_phenotype = request.form['hpo_id']
            if 'target_id' in request.form:
                r_target_id = request.form['target_id']
            if 'format' in request.form:
                r_format = request.form['format']
            if 'range' in request.form:
                r_range = request.form['range']
            if 'weight' in request.form:
                r_weight = request.form['weight']
            if 'filter' in request.form:
                r_filter = request.form['filter']
        if request.json is not None:
            if 'target' in request.json:
                r_target = request.json['target']
            if 'phenotype' in request.json:
                r_phenotype = request.json['phenotype']
            if 'hpo_id' in request.json:
                r_phenotype = request.json['hpo_id']
            if 'target_id' in request.json:
                r_target_id = request.json['target_id']
            if 'format' in request.json:
                r_jsonat = request.json['format']
            if 'range' in request.json:
                r_range = request.json['range']
            if 'weight' in request.json:
                r_weight = request.json['weight']
            if 'filter' in request.json:
                r_filter = request.json['filter']
        
    utc_now = datetime.now(timezone('UTC'))
    jst_now = utc_now.astimezone(timezone('Asia/Tokyo'))
    ts = jst_now.strftime("%Y%m%d-%H%M%S")
    
    if r_format == "json":
        json_data = pcf_download(r_target, r_phenotype, r_target_id, r_format, r_range, r_weight, r_filter)
        res = make_response(json.dumps(json_data, indent=4))
        res.headers["Content-Type"] = "application/json"
        res.headers["Content-disposition"] = "attachment; filename=" + "pubcasefinder_" + ts + ".json"
        #res.headers["Content-Encoding"] = "gzip"
        return res
    elif r_format == "tsv":
        tsv_data = pcf_download(r_target, r_phenotype, r_target_id, r_format, r_range, r_weight, r_filter)
        res = make_response("\n".join(tsv_data))
        res.headers["Content-Type"] = "text/tab-separated-values"
        res.headers["Content-disposition"] = "attachment; filename=" + "pubcasefinder_" + ts + ".tsv"
        #res.headers["Content-Encoding"] = "gzip"
        return res


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
        lang = request.args.get("lang")
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
        #sql_OntoTerm = u"select distinct a.uid, a.value, c.OntoSynonym, b.FreqSelf from IndexFormHP as a left join IC as b on replace(a.uid, '_ja', '')=b.OntoID LEFT JOIN OntoTermHPInformation AS c ON a.uid=c.OntoID where {0} OR (LENGTH(a.value)=CHARACTER_LENGTH(a.value) AND a.uid IN (SELECT OntoID FROM OntoTermHPSynonym WHERE {1})) order by b.FreqSelf desc, value".format(' AND '.join(map(lambda x: "a.uid_value collate utf8_unicode_ci like %s", tokeninputs)),' AND '.join(map(lambda x: "OntoSynonym collate utf8_unicode_ci like %s", tokeninputs)))
        sql_OntoTerm = ""
        if lang.startswith('ja') :
            sql_OntoTerm = u"select  distinct a.uid, a.value, c.OntoSynonym, b.FreqSelf, c.OntoSynonymJa from IndexFormHP as a LEFT JOIN IC as b on replace(a.uid, '_ja', '')=b.OntoID LEFT JOIN OntoTermHPInformation AS c ON replace(a.uid, '_ja', '')=c.OntoID where ( {0}  AND LENGTH(a.value)!=CHARACTER_LENGTH(a.value) )  OR ( a.uid IN (SELECT OntoID FROM OntoTermHPSynonymJa WHERE {1})) order by b.FreqSelf desc, value".format(' AND '.join(map(lambda x: "a.uid_value collate utf8_unicode_ci like %s", tokeninputs)),' AND '.join(map(lambda x: "OntoSynonym collate utf8_unicode_ci like %s", tokeninputs)))
        elif lang.startswith('en,ja'):
            for v in tokeninputs:
                sql_params.append("%"+v+"%")
            sql_OntoTerm = u"select  distinct  a.uid,  a.value, c.OntoSynonym, b.FreqSelf, c.OntoSynonymJa from IndexFormHP as a LEFT JOIN IC as b on replace(a.uid, '_ja', '')=b.OntoID LEFT JOIN OntoTermHPInformation AS c ON replace(a.uid, '_ja', '')=c.OntoID where {0} OR (a.uid IN (SELECT OntoID FROM OntoTermHPSynonym WHERE {1}) ) OR (a.uid IN (SELECT OntoID FROM OntoTermHPSynonymJa WHERE {2}) )  order by b.FreqSelf desc, value".format(' AND '.join(map(lambda x: "a.uid_value collate utf8_unicode_ci like %s", tokeninputs)),' AND '.join(map(lambda x: "OntoSynonym collate utf8_unicode_ci like %s", tokeninputs)),' AND '.join(map(lambda x: "OntoSynonym collate utf8_unicode_ci like %s", tokeninputs)))
        elif lang.startswith('en') :
            sql_OntoTerm = u"select  distinct a.uid, a.value, c.OntoSynonym, b.FreqSelf, c.OntoSynonymJa from IndexFormHP as a LEFT JOIN IC as b on a.uid=b.OntoID LEFT JOIN OntoTermHPInformation AS c ON a.uid=c.OntoID where ( {0}  AND LENGTH(a.value)=CHARACTER_LENGTH(a.value) )  OR ( a.uid IN (SELECT OntoID FROM OntoTermHPSynonym WHERE {1})) order by b.FreqSelf desc, value".format(' AND '.join(map(lambda x: "a.uid_value collate utf8_unicode_ci like %s", tokeninputs)),' AND '.join(map(lambda x: "OntoSynonym collate utf8_unicode_ci like %s", tokeninputs)))
        #app.logger.error(sql_OntoTerm)
        
        if sql_OntoTerm != "":
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

                if (lang == 'en' or lang == 'en,ja') and type(value[2]) is str and len(value[2]):
                    list_synonym = value[2].split('|')
                    for synonym in list_synonym:
                        temp_synonym = mojimoji.zen_to_han(synonym, kana=False).lower()
                        for in_tokeninput in in_tokeninputs:
                            if type(temp_synonym) is str and len(temp_synonym) and in_tokeninput not in temp_synonym:
                                temp_synonym = None
                                break
                        if temp_synonym is not None:
                            onto_id_synonym.append(synonym)

                if (lang == 'ja' or lang == 'en,ja') and type(value[4]) is str and len(value[4]):
                    list_synonym = value[4].split('|')
                    for synonym in list_synonym:
                        temp_synonym = mojimoji.zen_to_han(synonym, kana=False).lower()
                        for in_tokeninput in in_tokeninputs:
                            if type(temp_synonym) is str and len(temp_synonym) and in_tokeninput not in temp_synonym:
                                temp_synonym = None
                                break
                        if temp_synonym is not None:
                            onto_id_synonym.append(synonym)

    
                dict_json['id'] = value[0]
                dict_json['name'] = value[1].strip('"')
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
        sql_information = u"select OntoName, OntoSynonym, OntoDefinition, OntoComment, OntoParentNum, OntoChildNum, OntoNameJa from OntoTermHPInformation where OntoID=%s"
        sql_informations_fmt = u"select OntoID, OntoName, OntoSynonym, OntoDefinition, OntoComment, OntoChildNum, OntoNameJa from OntoTermHPInformation where OntoID in (%s)"

        sql_hierarchy_parent = u"select OntoParentID from OntoTermHPHierarchy where OntoID=%s"
        sql_hierarchy_child  = u"select OntoID from OntoTermHPHierarchy where OntoParentID=%s"

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
# tokeninput_filter()
# complement input for genes/variants
#####
@app.route('/tokeninput_filter', methods=['GET', 'POST'])
def tokeninput_filter():

    list_json = []

    # GETメソッドの値を取得
    if request.method == 'GET':

        # requestから値を取得
        #tokeninput = request.args.get("q")
        #tokeninputs = request.args.get("q").replace(u'　', u' ').replace('HP','hp').split()
        tokeninputs = request.args.get("q").replace(u'　', u' ').lower().split()
        sql_params = []
        in_tokeninputs = []
        for v in tokeninputs:
            sql_params.append("%"+v+"%")
            in_tokeninputs.append(mojimoji.zen_to_han(v, kana=False).lower())
        for v in tokeninputs:
            sql_params.append("%"+v+"%")
        for v in tokeninputs:
            sql_params.append("%"+v+"%")

        # DiseaseGeneテーブルからSymbol及びSynonymを検索
        ## SQLのLIKEを使うときのTips
        ### http://d.hatena.ne.jp/heavenshell/20111027/1319712031
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        # IndexFormSearchOrphanetOMIMテーブルからクエリにマッチするレコードを取得
        sql_IndexFormSearch = \
                              u"SELECT uid,Symbol,Synonyms,name_ja,EntrezID FROM (SELECT " \
                              u"  OntoID AS uid " \
                              u" ,OntoName AS Symbol " \
                              u" ,OntoSynonym AS Synonyms " \
                              u" ,OntoNameJa AS name_ja " \
                              u" ,NULL AS EntrezID " \
                              u" ,LOWER(TRIM(CONCAT(OntoID,' | ',OntoName,' | ',IFNULL(OntoNameJa,''),' | ',IFNULL(OntoSynonym,'')))) AS uid_value " \
                              u" ,'HP' AS source " \
                              u"FROM " \
                              u"  OntoTermHPInformation " \
                              u"WHERE " \
                              u"  OntoID IN (SELECT OntoDescendantID FROM OntoTermHPDescendant WHERE OntoID='HP:0000005') " \
                              u") AS A WHERE " \
                              u"{0}" \
                              u" UNION " \
                              u"SELECT uid,Symbol,Synonyms,name_ja,EntrezID FROM (SELECT " \
                              u"  OntoTermMONDOInformation.OntoID AS uid " \
                              u" ,OntoName AS Symbol " \
                              u" ,OntoSynonym AS Synonyms " \
                              u" ,OntoNameJa AS name_ja " \
                              u" ,OntoDbxrefName AS EntrezID " \
                              u" ,LOWER(TRIM(CONCAT(OntoTermMONDOInformation.OntoID,' | ',OntoName,' | ',IFNULL(OntoNameJa,''),' | ',IFNULL(OntoSynonym,''),' | ',IFNULL(OntoDbxrefName,'')))) AS uid_value " \
                              u" ,'MONDO' AS source " \
                              u"FROM " \
                              u"  OntoTermMONDOInformation " \
                              u"LEFT JOIN ( " \
                              u"  SELECT " \
                              u"    OntoVersion " \
                              u"   ,OntoID " \
                              u"   ,GROUP_CONCAT(DISTINCT OntoDbxrefName SEPARATOR ' | ') AS OntoDbxrefName " \
                              u"  FROM " \
                              u"    OntoTermMONDODbxref " \
                              u"  WHERE " \
                              u"    OntoDbxrefDb='ENT' " \
                              u"  GROUP BY " \
                              u"    OntoID " \
                              u") AS OntoTermMONDODbxref ON OntoTermMONDODbxref.OntoVersion=OntoTermMONDOInformation.OntoVersion AND OntoTermMONDODbxref.OntoID=OntoTermMONDOInformation.OntoID " \
                              u") AS A WHERE " \
                              u"{0}" \
                              u" UNION " \
                              u"select distinct uid, " \
                              u" COALESCE(DiseaseGeneOMIM.Symbol,DiseaseGene.Symbol) AS Symbol" \
                              u",COALESCE(DiseaseGeneOMIM.Synonym,DiseaseGene.Synonym) AS Synonyms " \
                              u",null AS name_ja " \
                              u",null AS EntrezID " \
                              u"from IndexFormSearchOrphanetOMIM " \
                              u"LEFT JOIN (SELECT distinct SymbolSynonym,Symbol,Synonym,Source,EntrezID FROM DiseaseGene) AS DiseaseGene ON DiseaseGene.EntrezID=IndexFormSearchOrphanetOMIM.uid AND LEFT(DiseaseGene.SymbolSynonym,300)=IndexFormSearchOrphanetOMIM.value " \
                              u"LEFT JOIN (SELECT distinct SymbolSynonym,Symbol,Synonym,Source,EntrezID FROM DiseaseGeneOMIM) AS DiseaseGeneOMIM ON DiseaseGeneOMIM.EntrezID=IndexFormSearchOrphanetOMIM.uid AND LEFT(DiseaseGeneOMIM.SymbolSynonym,300)=IndexFormSearchOrphanetOMIM.value " \
                              u" WHERE {0}"

        #sql_IndexFormSearch = sql_IndexFormSearch.format(' AND '.join(map(lambda x: "uid_value collate utf8_str_ci like %s", tokeninputs)))
        sql_IndexFormSearch = sql_IndexFormSearch.format(' AND '.join(map(lambda x: "uid_value like %s", tokeninputs)))
        #app.logger.info(sql_IndexFormSearch)
        #app.logger.info(tuple(sql_params))

        cursor_IndexFormSearch = OBJ_MYSQL.cursor()
        #cursor_IndexFormSearch.execute(sql_IndexFormSearch, ("%" + tokeninput.lower() +"%","%" + tokeninput.lower() +"%","%" + tokeninput.lower() +"%"))
        cursor_IndexFormSearch.execute(sql_IndexFormSearch, tuple(sql_params))
        values = cursor_IndexFormSearch.fetchall()
        cursor_IndexFormSearch.close()

        #in_tokeninput = mojimoji.zen_to_han(tokeninput, kana=False).lower()

        #app.logger.info(in_tokeninputs)

        for value in values:
            #app.logger.info(value)
            #app.logger.info(type(value[3]))
            dict_json = {}
            uid         = mojimoji.zen_to_han(value[0], kana=False).lower()
            uid_value   = mojimoji.zen_to_han(value[1], kana=False).lower()
            synonym_arr = []
            source_arr = []

            name_ja = None
            if isinstance(value[3],str) and len(value[3]):
                name_ja = mojimoji.zen_to_han(value[3], kana=False).lower()

            #app.logger.info(uid)
            #app.logger.info(uid_value)
            #app.logger.info(name_ja)

            uid_flag = True
            uid_value_flag = True
            for in_tokeninput in in_tokeninputs:
                if not isinstance(uid,str) or not len(uid) or not in_tokeninput in uid:
                    uid_flag = False
                if not isinstance(uid_value,str) or not len(uid_value) or not in_tokeninput in uid_value:
                    #app.logger.info(type(uid_value))
                    #app.logger.info(len(uid_value))
                    #app.logger.info(in_tokeninput in uid_value)
                    uid_value_flag = False
                if not uid_flag and not uid_value_flag:
                    #app.logger.info(in_tokeninput)
                    break

            if not uid_flag:
                uid = None

            if not uid_value_flag:
                uid_value = None

            #app.logger.info(uid)
            #app.logger.info(uid_value)

            if uid is None and uid_value is None and isinstance(value[2],str) and len(value[2]):
                list_synonym = value[2].split(' | ')
                for synonym in list_synonym:
                    temp_synonym = mojimoji.zen_to_han(synonym, kana=False).lower()
                    temp_synonym_flag = True
                    for in_tokeninput in in_tokeninputs:
                        if not isinstance(temp_synonym,str) or not len(temp_synonym) or not in_tokeninput in temp_synonym:
                            temp_synonym_flag = False
                            break
                    if temp_synonym_flag:
                        synonym_arr.append(synonym)

            #if not name_ja is None:
            #    app.logger.info(name_ja)
            #    app.logger.info(type(name_ja))
            #    app.logger.info(len(name_ja))

            if isinstance(name_ja,str) and len(name_ja):
                name_ja_flag = True
                for in_tokeninput in in_tokeninputs:
                    if not in_tokeninput in name_ja:
                        #app.logger.info(in_tokeninput)
                        #app.logger.info(isinstance(in_tokeninput,str))
                        name_ja_flag = False
                        break
                if not name_ja_flag:
                    name_ja = None
            #app.logger.info(name_ja)

            #app.logger.info(uid)
            #app.logger.info(uid_value)
            #app.logger.info(synonym_arr)
            #app.logger.info(name_ja)

            if uid is None and uid_value is None and not len(synonym_arr) and name_ja is None:
                continue


            #if type(value[3]) is str and len(value[3]):
            #    list_source = value[3].split(';')
            #    for source in list_source:
            #        source = source.strip()
            #        if type(source) is str and len(source):
            #            source_arr.append(source)

            if isinstance(name_ja,str) and len(name_ja):
                dict_json['id']   = value[0].replace('ENT:','GENEID:') + "_ja"
                dict_json['name'] = value[3]
            else:
                dict_json['id']   = value[0].replace('ENT:','GENEID:')
                dict_json['name'] = value[1]
            if len(synonym_arr)>0:
                dict_json['synonym'] = synonym_arr
            else:
                dict_json['synonym'] = None
            if len(source_arr)>0:
                dict_json['source'] = source_arr
            else:
                dict_json['source'] = None

            if isinstance(value[4],str) and len(value[4]):
                dict_json['EntrezID'] = value[4]
            else:
                dict_json['EntrezID'] = None

            list_json.append(dict_json)
            #app.logger.info(dict_json)
            #app.logger.info('')

    OBJ_MYSQL.close()

    return jsonify(list_json)

#####
# tokeninput_vgp()
# complement input for genes/variants
#####
@app.route('/tokeninput_vgp', methods=['GET', 'POST'])
def tokeninput_vgp():

    list_json = []

    # GETメソッドの値を取得
    if request.method == 'GET':

        # requestから値を取得
        tokeninputs = request.args.get("q").replace(u'　', u' ').lower().split()
        sql_params = []
        in_tokeninputs = []
        for v in tokeninputs:
            sql_params.append("%"+v+"%")
            in_tokeninputs.append(mojimoji.zen_to_han(v, kana=False).lower())
        for v in tokeninputs:
            sql_params.append("%"+v+"%")
        # add for NANDO
        for v in tokeninputs:
            sql_params.append("%"+v+"%")
        # add for PA
        for v in tokeninputs:
            sql_params.append("%"+v+"%")
        # add for PAA
        for v in tokeninputs:
            sql_params.append("%"+v+"%")

        # DiseaseGeneテーブルからSymbol及びSynonymを検索
        ## SQLのLIKEを使うときのTips
        ### http://d.hatena.ne.jp/heavenshell/20111027/1319712031
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        # IndexFormSearchOrphanetOMIMテーブルからクエリにマッチするレコードを取得
        sql_IndexFormSearch = \
                              u"SELECT uid,Symbol,Synonyms,name_ja,EntrezID FROM (SELECT " \
                              u"  OntoTermMONDOInformation.OntoID AS uid " \
                              u" ,OntoName AS Symbol " \
                              u" ,OntoSynonym AS Synonyms " \
                              u" ,OntoNameJa AS name_ja " \
                              u" ,OntoDbxrefName AS EntrezID " \
                              u" ,LOWER(TRIM(CONCAT(OntoTermMONDOInformation.OntoID,' | ',OntoName,' | ',IFNULL(OntoNameJa,''),' | ',IFNULL(OntoSynonym,''),' | ',IFNULL(OntoDbxrefName,'')))) AS uid_value " \
                              u" ,'MONDO' AS source " \
                              u"FROM " \
                              u"  OntoTermMONDOInformation " \
                              u"LEFT JOIN ( " \
                              u"  SELECT " \
                              u"    OntoVersion " \
                              u"   ,OntoID " \
                              u"   ,GROUP_CONCAT(DISTINCT OntoDbxrefName SEPARATOR ' | ') AS OntoDbxrefName " \
                              u"  FROM " \
                              u"    OntoTermMONDODbxref " \
                              u"  WHERE " \
                              u"    OntoDbxrefDb='ENT' " \
                              u"  GROUP BY " \
                              u"    OntoID " \
                              u") AS OntoTermMONDODbxref ON OntoTermMONDODbxref.OntoVersion=OntoTermMONDOInformation.OntoVersion AND OntoTermMONDODbxref.OntoID=OntoTermMONDOInformation.OntoID " \
                              u") AS A WHERE " \
                              u"{0}" \
                              u" UNION " \
                              u"SELECT uid,Symbol,Synonyms,name_ja,EntrezID FROM (SELECT " \
                              u"  OntoID AS uid " \
                              u" ,OntoName AS Symbol " \
                              u" ,OntoSynonymJa AS Synonyms " \
                              u" ,OntoNameJa AS name_ja " \
                              u" ,null AS EntrezID " \
                              u" ,LOWER(TRIM(CONCAT(OntoID,' | ',OntoName,' | ',IFNULL(OntoNameJa,''),' | ',IFNULL(OntoSynonym,''),' | ',IFNULL(OntoSynonymJa,'')))) AS uid_value " \
                              u" ,'NANDO' AS source " \
                              u"FROM " \
                              u"  OntoTermNANDOInformation " \
                              u") as A WHERE " \
                              u"{0}" \
                              u" UNION " \
                              u"select distinct uid, " \
                              u" COALESCE(DiseaseGeneOMIM.Symbol,DiseaseGene.Symbol) AS Symbol" \
                              u",COALESCE(DiseaseGeneOMIM.Synonym,DiseaseGene.Synonym) AS Synonyms " \
                              u",null AS name_ja " \
                              u",null AS EntrezID " \
                              u"from IndexFormSearchOrphanetOMIM " \
                              u"LEFT JOIN (SELECT distinct SymbolSynonym,Symbol,Synonym,Source,EntrezID FROM DiseaseGene) AS DiseaseGene ON DiseaseGene.EntrezID=IndexFormSearchOrphanetOMIM.uid AND LEFT(DiseaseGene.SymbolSynonym,300)=IndexFormSearchOrphanetOMIM.value " \
                              u"LEFT JOIN (SELECT distinct SymbolSynonym,Symbol,Synonym,Source,EntrezID FROM DiseaseGeneOMIM) AS DiseaseGeneOMIM ON DiseaseGeneOMIM.EntrezID=IndexFormSearchOrphanetOMIM.uid AND LEFT(DiseaseGeneOMIM.SymbolSynonym,300)=IndexFormSearchOrphanetOMIM.value " \
                              u" WHERE {0}" \
                              u" UNION " \
                              u"SELECT uid,Symbol,Synonyms,name_ja,EntrezID FROM (SELECT " \
                              u"  panel_id AS uid " \
                              u" ,panel_name AS Symbol " \
                              u" ,NULL AS Synonyms " \
                              u" ,NULL AS name_ja " \
                              u" ,NULL AS EntrezID " \
                              u" ,LOWER(TRIM(CONCAT(panel_id,' | ',panel_name))) AS uid_value " \
                              u" ,'PA' AS source " \
                              u"FROM " \
                              u"  vgp " \
                              u") AS A WHERE " \
                              u"{0}" \
                              u" UNION " \
                              u"SELECT uid,Symbol,Synonyms,name_ja,EntrezID FROM (SELECT " \
                              u"  panel_id AS uid " \
                              u" ,panel_name AS Symbol " \
                              u" ,NULL AS Synonyms " \
                              u" ,NULL AS name_ja " \
                              u" ,NULL AS EntrezID " \
                              u" ,LOWER(TRIM(CONCAT(panel_id,' | ',panel_name))) AS uid_value " \
                              u" ,'PAA' AS source " \
                              u"FROM " \
                              u"  vgpau " \
                              u") AS A WHERE " \
                              u"{0}" 
        #sql_IndexFormSearch = sql_IndexFormSearch.format(' AND '.join(map(lambda x: "uid_value collate utf8_str_ci like %s", tokeninputs)))
        sql_IndexFormSearch = sql_IndexFormSearch.format(' AND '.join(map(lambda x: "uid_value like %s", tokeninputs)))
        #app.logger.info(sql_IndexFormSearch)
        #app.logger.info(tuple(sql_params))

        cursor_IndexFormSearch = OBJ_MYSQL.cursor()
        #cursor_IndexFormSearch.execute(sql_IndexFormSearch, ("%" + tokeninput.lower() +"%","%" + tokeninput.lower() +"%","%" + tokeninput.lower() +"%"))
        cursor_IndexFormSearch.execute(sql_IndexFormSearch, tuple(sql_params))
        values = cursor_IndexFormSearch.fetchall()
        cursor_IndexFormSearch.close()

        #in_tokeninput = mojimoji.zen_to_han(tokeninput, kana=False).lower()

        #app.logger.info(in_tokeninputs)

        for value in values:
            #app.logger.info(value)
            #app.logger.info(type(value[3]))
            dict_json = {}
            uid         = mojimoji.zen_to_han(value[0], kana=False).lower()
            uid_value   = mojimoji.zen_to_han(value[1], kana=False).lower()
            synonym_arr = []
            source_arr = []

            name_ja = None
            if isinstance(value[3],str) and len(value[3]):
                name_ja = mojimoji.zen_to_han(value[3], kana=False).lower()

            #app.logger.info(uid)
            #app.logger.info(uid_value)
            #app.logger.info(name_ja)

            uid_flag = True
            uid_value_flag = True
            for in_tokeninput in in_tokeninputs:
                if not isinstance(uid,str) or not len(uid) or not in_tokeninput in uid:
                    uid_flag = False
                if not isinstance(uid_value,str) or not len(uid_value) or not in_tokeninput in uid_value:
                    #app.logger.info(type(uid_value))
                    #app.logger.info(len(uid_value))
                    #app.logger.info(in_tokeninput in uid_value)
                    uid_value_flag = False
                if not uid_flag and not uid_value_flag:
                    #app.logger.info(in_tokeninput)
                    break

            if not uid_flag:
                uid = None

            if not uid_value_flag:
                uid_value = None

            #app.logger.info(uid)
            #app.logger.info(uid_value)

            if uid is None and uid_value is None and isinstance(value[2],str) and len(value[2]):
                list_synonym = value[2].split(' | ')
                for synonym in list_synonym:
                    temp_synonym = mojimoji.zen_to_han(synonym, kana=False).lower()
                    temp_synonym_flag = True
                    for in_tokeninput in in_tokeninputs:
                        if not isinstance(temp_synonym,str) or not len(temp_synonym) or not in_tokeninput in temp_synonym:
                            temp_synonym_flag = False
                            break
                    if temp_synonym_flag:
                        synonym_arr.append(synonym)

            #if not name_ja is None:
            #    app.logger.info(name_ja)
            #    app.logger.info(type(name_ja))
            #    app.logger.info(len(name_ja))

            if isinstance(name_ja,str) and len(name_ja):
                name_ja_flag = True
                for in_tokeninput in in_tokeninputs:
                    if not in_tokeninput in name_ja:
                        #app.logger.info(in_tokeninput)
                        #app.logger.info(isinstance(in_tokeninput,str))
                        name_ja_flag = False
                        break
                if not name_ja_flag:
                    name_ja = None
            #app.logger.info(name_ja)

            #app.logger.info(uid)
            #app.logger.info(uid_value)
            #app.logger.info(synonym_arr)
            #app.logger.info(name_ja)

            if uid is None and uid_value is None and not len(synonym_arr) and name_ja is None:
                continue


            #if type(value[3]) is str and len(value[3]):
            #    list_source = value[3].split(';')
            #    for source in list_source:
            #        source = source.strip()
            #        if type(source) is str and len(source):
            #            source_arr.append(source)

            if isinstance(name_ja,str) and len(name_ja):
                dict_json['id']   = value[0].replace('ENT:','GENEID:') + "_ja"
                dict_json['name'] = value[3]
            else:
                dict_json['id']   = value[0].replace('ENT:','GENEID:')
                dict_json['name'] = value[1]
            if len(synonym_arr)>0:
                dict_json['synonym'] = synonym_arr
            else:
                dict_json['synonym'] = None
            if len(source_arr)>0:
                dict_json['source'] = source_arr
            else:
                dict_json['source'] = None

            if isinstance(value[4],str) and len(value[4]):
                dict_json['EntrezID'] = value[4]
            else:
                dict_json['EntrezID'] = None

            list_json.append(dict_json)
            #app.logger.info(dict_json)
            #app.logger.info('')

    OBJ_MYSQL.close()

    return jsonify(list_json)

#####
# popup_hierarchy_mondo()
# オントロジーのバージョンをSQL内で"20200405"に固定しているので、要修正
#####
@app.route('/popup_hierarchy_genes', methods=['GET', 'POST'])
def popup_hierarchy_genes():

    list_json = []

    # GETメソッドの値を取得
    if request.method == 'GET':

        # requestから値を取得
        #onto_id = request.args.get("q")
        onto_id_pre = request.args.get("q")
        onto_id = onto_id_pre.replace('_ja', '')
        onto_id_prefix = re.search(r'^(HP|MONDO|NANDO)', onto_id)
        onto_name = "MONDO"
        if onto_id_prefix and onto_id_prefix.group() == "HP":
            onto_name = "HP"
        elif onto_id_prefix and onto_id_prefix.group() == "NANDO":
            onto_name = "NANDO"

        # MySQLへ接続
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

        # JSONデータ
        dict_json = {}
        dict_json['selfclass']  = []
        dict_json['superclass'] = []
        dict_json['subclass']   = []

        # OntoTermMONDOInformationテーブルから情報取得
        sql_information = u"select OntoName, OntoSynonym, OntoDefinition, OntoComment, OntoParentNum, OntoChildNum, OntoNameJa from OntoTerm{0}Information where OntoID=%s".format(onto_name)
        if onto_id_prefix and onto_id_prefix.group() == "NANDO":
            sql_information = u"select OntoName, OntoSynonym, OntoDefinition, OntoComment, OntoParentNum, OntoChildNum, OntoNameJa, OntoSynonymJa, OntoDefinitionJa, OntoCommentJa from OntoTerm{0}Information where OntoID=%s".format(onto_name)

        sql_informations_fmt = u"select OntoID, OntoName, OntoChildNum, OntoNameJa from OntoTerm{0}Information where OntoID in (%s)".format(onto_name)

        sql_hierarchy_parent = u"select OntoParentID from OntoTerm{0}Hierarchy where OntoID=%s".format(onto_name)
        sql_hierarchy_child  = u"select OntoID from OntoTerm{0}Hierarchy where OntoParentID=%s".format(onto_name)

        # OntoTermMONDOInformationテーブルからクエリにマッチするレコードを取得
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
            dict_self_class['synonym_ja']    = ""
            dict_self_class['definition_ja'] = ""
            dict_self_class['comment_ja']    = ""
            if onto_id_prefix and onto_id_prefix.group() == "NANDO":
                dict_self_class['synonym_ja']    = value_information[7]
                dict_self_class['definition_ja'] = value_information[8]
                dict_self_class['comment_ja']    = value_information[9]



            list_parent_child_onto_id = []
            # OntoTermMONDOHierarchyから親クラスの情報取得
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

            # OntoTermMONDOHierarchyから子クラスの情報取得
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

            # OntoTermMONDOInformations_fmtテーブルからクエリにマッチするレコードを取得
            dict_all_class = {}

            if list_parent_child_onto_id:
                in_onto_id=', '.join(map(lambda x: '%s', list_parent_child_onto_id))
                sql_informations_fmt = sql_informations_fmt % in_onto_id

                cursor_informations_fmt = OBJ_MYSQL.cursor()
                cursor_informations_fmt.execute(sql_informations_fmt, list_parent_child_onto_id)
                values_informations_fmt = cursor_informations_fmt.fetchall()
                cursor_informations_fmt.close()

                for value_informations_fmt in values_informations_fmt:
                    onto_id         = value_informations_fmt[0]
                    onto_name       = value_informations_fmt[1]
                    onto_child_num  = value_informations_fmt[2]
                    onto_name_ja    = value_informations_fmt[3]
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
                    if parent_onto_id in dict_all_class.keys():
                        list_super_class.append(dict_all_class[parent_onto_id])

            ## child class リスト
            list_sub_class = []
            if len(list_child_onto_id) > 0:
                for child_onto_id in list_child_onto_id:
                    if child_onto_id in dict_all_class.keys():
                        list_sub_class.append(dict_all_class[child_onto_id])
            
            ## dict_json に収納
            dict_json['selfclass']  = list_self_class
            dict_json['superclass'] = list_super_class
            dict_json['subclass']   = list_sub_class

    OBJ_MYSQL.close()

    return jsonify(dict_json)


@app.route('/get_hpo_data_by_hpo_id', methods=['GET', 'POST'])
def get_hpo_data_by_hpo_id():
    dic_json = {}

    # GETメソッドの値を取得
    if request.method == 'GET':

        # requestから値を取得
        onto_id_pre = request.args.get("hpo_id")
        onto_id = onto_id_pre.replace('_ja', '')
        list_onto_id = onto_id.split(',')

        # MySQLへ接続
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

        sql_informations_fmt = u"select OntoID, OntoName, OntoNameJa from OntoTermHPInformation where OntoID NOT in (SELECT OntoDescendantID FROM OntoTermHPDescendant WHERE OntoID='HP:0000005') AND OntoID in (%s)"

        in_onto_id=', '.join(map(lambda x: '%s', list_onto_id))

        sql_informations_fmt = sql_informations_fmt % in_onto_id

        app.logger.info(sql_informations_fmt)

        cursor_informations_fmt = OBJ_MYSQL.cursor()
        cursor_informations_fmt.execute(sql_informations_fmt, list_onto_id)
        values_informations_fmt = cursor_informations_fmt.fetchall()
        cursor_informations_fmt.close()

        for value_informations_fmt in values_informations_fmt:
            onto_id         = value_informations_fmt[0]
            onto_name       = value_informations_fmt[1]
            onto_name_ja    = value_informations_fmt[2]

            dic_json[onto_id] = {}
            dic_json[onto_id]['name_en'] = onto_name
            dic_json[onto_id]['name_ja'] = onto_name_ja if onto_name_ja != "" else onto_name

        OBJ_MYSQL.close()

        return jsonify(dic_json)

#####
# display visual gene panel page
# /panel/search
@app.route('/panel/search')
def vgp():

    r_lang = "en"
    if request.args.get('lang') is not None:
        r_lang = request.args.get('lang')

    r_schema = "auto"
    if request.args.get('schema') is not None:
        r_schema = request.args.get('schema')

    return render_template('vgp.html', r_schema=r_schema, r_lang=r_lang)

@app.route('/pcf_get_all_panel', methods=['GET', 'POST'])
def pcf_get_all_panel():

    response_data = {}

    OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
    cursor = OBJ_MYSQL.cursor(MySQLdb.cursors.DictCursor)
    sql =  u"select MondoID as mondo_id, MondoTerm as panel_name,GeneCount as count from Panel order by MondoID;"
    cursor.execute(sql)
    results = cursor.fetchall()
    OBJ_MYSQL.close()

    return json.dumps(results, ensure_ascii=False)
