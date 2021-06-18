# -*- coding: utf-8 -*-

import os
import re
import MySQLdb

from flask import Flask, session, render_template, request, redirect, url_for, jsonify
from flask_babel import gettext,Babel


app = Flask(__name__)

# https://github.com/shibacow/flask_babel_sample/blob/master/srv.py
#babel = Babel(app)
#@babel.localeselector
#def get_locale():
#    return request.accept_languages.best_match(['ja', 'ja_JP', 'en'])

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


#####
# DB設定
app.config.from_pyfile('../config.cfg')
db_sock = app.config['DBSOCK']
db_name = app.config['DBNAME']
db_user = app.config['DBUSER']
db_pw   = app.config['DBPW']


####
# 入力のフェノタイプをチェックし、入力用に利用するフェノタイプセットと、エラー出力用に利用するフェノタイプセットを返す
def process_input_phenotype(str_phenotypes):
        
    # str_phenotypesをtokeninput用のJSON形式に変換
    list_dict_phenotype = []

    # 正しくないHPO IDをクエリからのぞいたクエリを収納
    list_query_phenotype_remove_error = []

    # クエリの全てのHPO IDがデータベースに含まれるか確認し、データを収納
    if str_phenotypes != "":
        for phenotype in str_phenotypes.split(","):
            OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
            #sql_OntoTerm = u"select uid_value from IndexFormHP where uid=%s"
            sql_OntoTerm = u"select value from IndexFormHP where uid=%s"
            cursor_OntoTerm = OBJ_MYSQL.cursor()
            cursor_OntoTerm.execute(sql_OntoTerm, (phenotype,))
            values = cursor_OntoTerm.fetchall()
            cursor_OntoTerm.close()
            onto_id_term = values[0][0] if values else ''
            OBJ_MYSQL.close()

            if onto_id_term != "":
                dict_phenotype = {}
                dict_phenotype['id'] = phenotype
                dict_phenotype['name'] = onto_id_term
                list_dict_phenotype.append(dict_phenotype)
                list_query_phenotype_remove_error.append(phenotype)

    # エラーを取り除いたフェノタイプセット
    str_phenotypes_remove_error = ','.join(list_query_phenotype_remove_error)

    # 日本語HP ID（HP:xxxxx_ja）のsuffix（_ja）を取り除いたフェノタイプセットを作成
    list_phenotypes_remove_ja = []
    for phenotype in list_query_phenotype_remove_error:
        list_phenotypes_remove_ja.append(phenotype.replace('_ja', ''))
    str_phenotypes_remove_error_ja = ','.join(list_phenotypes_remove_ja)

    return list_dict_phenotype, str_phenotypes_remove_error, str_phenotypes_remove_error_ja



####
# 入力のフェノタイプをチェックし、入力用に利用するフェノタイプセットと、エラー出力用に利用するフェノタイプセットを返す
def process_input_gene(str_genes):

    # str_genesをtokeninput用のJSON形式に変換
    list_dict_gene = []

    # 正しくないGene IDをクエリからのぞいたクエリを収納
    list_query_gene_remove_error = []

    # 正しくないGeneクエリを収納
    ## エラーダイアログに表示する
    list_query_gene_error = []

    # クエリの全てのGene IDがデータベースに含まれるか確認し、データを収納
    if str_genes != "":
        for gene in str_genes.split(","):

            # Gene Symbolの場合はEntrez Gene IDを抽出
            gene_symbol = ""
            entrez_id = ""
            pattern_entrez_id = 'HGNC'
            pattern_entrez_id_compiled = re.compile(pattern_entrez_id)
            if pattern_entrez_id_compiled.match(gene):
                gene_symbol = gene
                OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
                sql_GeneName2ID = u"select EntrezID from GeneName2ID where GeneName=%s"
                cursor_GeneName2ID = OBJ_MYSQL.cursor()
                gene_remove_prefix_HGNC = gene.replace('HGNC:', '')
                cursor_GeneName2ID.execute(sql_GeneName2ID, (gene_remove_prefix_HGNC,))
                values = cursor_GeneName2ID.fetchall()
                cursor_GeneName2ID.close()
                entrez_id = values[0][0] if values else ''
                OBJ_MYSQL.close()
                if entrez_id != "":
                    #gene = unicode("ENT:" + str(entrez_id))
                    gene = str("ENT:" + str(entrez_id))
                else:
                    list_query_gene_error.append(gene)
                    gene = ""

            # JSON用とクエリ用のデータを収納
            if gene != "":
                OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
                sql_IndexFormSearch = u"select uid_value from IndexFormSearchOrphanetOMIM where uid=%s"
                cursor_IndexFormSearch = OBJ_MYSQL.cursor()
                cursor_IndexFormSearch.execute(sql_IndexFormSearch, (gene,))
                values = cursor_IndexFormSearch.fetchall()
                cursor_IndexFormSearch.close()
                uid_value = values[0][0] if values else ''
                OBJ_MYSQL.close()
                if uid_value != "":
                    dict_gene = {}
                    dict_gene['id'] = gene
                    dict_gene['name'] = uid_value
                    list_dict_gene.append(dict_gene)
                    list_query_gene_remove_error.append(gene)
                else:
                    #list_query_gene_error.append(gene)
                    if gene_symbol == "":
                        list_query_gene_error.append(gene)
                    else:
                        list_query_gene_error.append(gene_symbol)

    # エラーを取り除いたgeneクエリ
    str_genes_remove_error = ','.join(list_query_gene_remove_error)

    return list_dict_gene, str_genes_remove_error, list_query_gene_error



def process_input_filter(str_filters):

    list_dict_filter = []
    list_query_filter_remove_error = []
    list_query_filter_error = []

    if str_filters != "":
        # ENT:1723,MONDO:0011410_ja,HP:0003745_ja
        pattern_entrez_id = r"^(|NOT_|AND_|OR_)ENT\:(\d+)$"
        pattern_mondo_id  = r"^(|NOT_|AND_|OR_)MONDO\:\d+(|_ja)$"
        pattern_hpo_id    = r"^(|NOT_|AND_|OR_)HP\:\d+(|_ja)$"

        pattern_entrez_id_compiled = re.compile(pattern_entrez_id,re.IGNORECASE)
        pattern_mondo_id_compiled  = re.compile(pattern_mondo_id, re.IGNORECASE)
        pattern_hpo_id_compiled    = re.compile(pattern_hpo_id,   re.IGNORECASE)

        for str_filter in str_filters.split(","):

            match_entrez_id = re.search(pattern_entrez_id_compiled, str_filter)
            match_mondo_id = re.search(pattern_mondo_id_compiled, str_filter)
            match_hpo_id = re.search(pattern_hpo_id_compiled, str_filter)
            
            if match_entrez_id:
                entrez_id = re.sub("NOT_","",str_filter,re.IGNORECASE)
                entrez_id = re.sub("AND_","",entrez_id, re.IGNORECASE)
                entrez_id = re.sub("OR_", "",entrez_id, re.IGNORECASE)
                OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
                sql_IndexFormSearch = u"select value from IndexFormSearchOrphanetOMIM where uid=%s"
                cursor_IndexFormSearch = OBJ_MYSQL.cursor()
                cursor_IndexFormSearch.execute(sql_IndexFormSearch, (entrez_id,))
                values = cursor_IndexFormSearch.fetchall()
                cursor_IndexFormSearch.close()
                uid_value = values[0][0] if values else ''
                OBJ_MYSQL.close()
                if uid_value != "":
                    dict_gene = {}
                    dict_gene['id'] = str_filter
                    dict_gene['name'] = uid_value
                    list_dict_filter.append(dict_gene)
                    list_query_filter_remove_error.append(entrez_id)
                else:
                    list_query_filter_error.append(str_filter)

            elif match_mondo_id:
                mondo_id = re.sub("NOT_","",str_filter,re.IGNORECASE);
                mondo_id = re.sub("AND_","",mondo_id,re.IGNORECASE);
                mondo_id = re.sub("OR_","",mondo_id,re.IGNORECASE);
                mondo_id = re.sub("_ja","",mondo_id,re.IGNORECASE);
                OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
                sql_IndexFormSearch = u"select OntoName,OntoNameJa from OntoTermMONDOInformation where OntoID=%s order by OntoVersion desc"
                cursor_IndexFormSearch = OBJ_MYSQL.cursor()
                cursor_IndexFormSearch.execute(sql_IndexFormSearch, (mondo_id,))
                values = cursor_IndexFormSearch.fetchall()
                cursor_IndexFormSearch.close()
                disease_name    = values[0][0] if values else ''
                disease_name_ja = values[0][1] if values else ''
                OBJ_MYSQL.close()

                if disease_name != "":
                    dict_gene = {}
                    dict_gene['id']   = str_filter
                    if re.search("_ja", str_filter, re.I) and disease_name_ja != "" :
                        dict_gene['name'] = disease_name_ja
                    else:
                        dict_gene['name'] = disease_name  

                    list_dict_filter.append(dict_gene)
                    list_query_filter_remove_error.append(mondo_id)

                else:
                    list_query_filter_error.append(str_filter)

            elif match_hpo_id:
                hpo_id = re.sub("NOT_","",str_filter,re.IGNORECASE);
                hpo_id = re.sub("AND_","",hpo_id,re.IGNORECASE);
                hpo_id = re.sub("OR_","",hpo_id,re.IGNORECASE);
                hpo_id = re.sub("_ja","",hpo_id,re.IGNORECASE);
                OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
                sql_OntoTerm = u"select OntoName,OntoNameJa from OntoTermHPInformation where OntoID=%s order by OntoVersion desc"
                cursor_OntoTerm = OBJ_MYSQL.cursor()
                cursor_OntoTerm.execute(sql_OntoTerm, (hpo_id,))
                values = cursor_OntoTerm.fetchall()
                cursor_OntoTerm.close()
                hpo_name    = values[0][0] if values else ''
                hpo_name_ja = values[0][1] if values else ''
                OBJ_MYSQL.close()

                if hpo_name != "":
                    dict_phenotype = {}
                    dict_phenotype['id'] = str_filter
                    if re.search("_ja", str_filter, re.I) and hpo_name_ja != "" :
                        dict_phenotype['name'] = hpo_name_ja
                    else:
                        dict_phenotype['name'] = hpo_name  

                    list_dict_filter.append(dict_phenotype)
                    list_query_filter_remove_error.append(hpo_id)

                else:
                    list_query_filter_error.append(str_filter)

            else:
                list_query_filter_error.append(str_filter)

    # エラーを取り除いたgeneクエリ
    str_filter_remove_error = ','.join(list_query_filter_remove_error)

    return list_dict_filter, str_filter_remove_error, list_query_filter_error

