# -*- coding: utf-8 -*-

import os
import re
import MySQLdb
import json
from flask import Flask, session, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)
app.secret_key = 'pubcasefinder1210'

#####
# DB setting
app.config.from_pyfile('../config.cfg')
db_sock = app.config['DBSOCK']
db_name = app.config['DBNAME']
db_user = app.config['DBUSER']
db_pw   = app.config['DBPW']

def pcf_filter_get_case_id_by_gene_id(r_gene_id):

    list_case_id = {}
    OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

    if r_gene_id != "":
        gene_id = r_gene_id.replace('GENEID', 'ENT')

        # CaseGeneからCaseIDを取得
        sql_CaseGene = u"select distinct CaseID, Symbol from CaseGene where EntrezID=%s"
        cursor_CaseGene = OBJ_MYSQL.cursor()
        cursor_CaseGene.execute(sql_CaseGene, (gene_id,))
        values_CaseGene = cursor_CaseGene.fetchall()
        cursor_CaseGene.close()
        for value_CaseGene in values_CaseGene:
            case_id   = value_CaseGene[0]
            gene_name = value_CaseGene[1]
            if r_gene_id not in list_case_id:
                list_case_id[r_gene_id]={}
                list_case_id[r_gene_id]['name']=gene_name
                list_case_id[r_gene_id]['cases']=[]
            list_case_id[r_gene_id]['cases'].append(case_id)

    OBJ_MYSQL.close()

    return list_case_id

