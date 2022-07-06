# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import re
import json
import MySQLdb
import requests

app = Flask(__name__)


#####
# DB設定
app.config.from_pyfile('../config.cfg')
db_sock = app.config['DBSOCK']
db_name = app.config['DBNAME']
db_user = app.config['DBUSER']
db_pw   = app.config['DBPW']


def pcf_filter_get_case_id_by_mondo_id(r_mondo_id):

    hash_case_id = {}

    if r_mondo_id != "":
        url_api_pcf_filter_get_gene_id_by_mondo_id  = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_filter_get_gene_id_by_mondo_id"
        dict_param_api_pcf_filter_get_gene_id_by_mondo_id  = {"mondo_id":r_mondo_id}
        r_post_data = requests.post(url_api_pcf_filter_get_gene_id_by_mondo_id, data=dict_param_api_pcf_filter_get_gene_id_by_mondo_id)
        json_post_data = r_post_data.json()

        # get data for each result
        if r_mondo_id in json_post_data and json_post_data[r_mondo_id]:
            OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

            for geneid in json_post_data[r_mondo_id]:	
                gene_id = geneid.replace('GENEID', 'ENT')
                sql_CaseGene = u"select distinct CaseID, Symbol from CaseGene where EntrezID=%s"
                cursor_CaseGene = OBJ_MYSQL.cursor()
                cursor_CaseGene.execute(sql_CaseGene, (gene_id,))
                values_CaseGene = cursor_CaseGene.fetchall()
                cursor_CaseGene.close()
                if geneid not in hash_case_id:
                    hash_case_id[geneid] = {}
                    hash_case_id[geneid]['cases']=[]
                for value_CaseGene in values_CaseGene:
                    id_case = value_CaseGene[0]
                    gene_name = value_CaseGene[1]
                    hash_case_id[geneid]['name'] = gene_name
                    hash_case_id[geneid]['cases'].append(id_case)

            OBJ_MYSQL.close()

    return hash_case_id
