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

def pcf_filter_get_case_id_by_ncbi_gene_id(r_ncbi_gene_id):

    list_case_id = []
    OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

    if r_ncbi_gene_id != "":
        r_ncbi_gene_id = r_ncbi_gene_id.replace('GENEID', 'ENT')
        # CaseGeneからCaseIDを取得
        sql_CaseGene = u"select distinct CaseID from CaseGene where EntrezID=%s"
        cursor_CaseGene = OBJ_MYSQL.cursor()
        cursor_CaseGene.execute(sql_CaseGene, (r_ncbi_gene_id,))
        values_CaseGene = cursor_CaseGene.fetchall()
        cursor_CaseGene.close()
        for value_CaseGene in values_CaseGene:
            id_case = value_CaseGene[0]
            list_case_id.append(id_case)

    OBJ_MYSQL.close()

    return list_case_id

