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

def pcf_filter_get_all_case_id():

    list_case_id = []
    OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

    # CasePhenoからCaseIDを取得
    sql_CasePheno = u"select distinct CaseID from CasePheno"
    cursor_CasePheno = OBJ_MYSQL.cursor()
    cursor_CasePheno.execute(sql_CasePheno)
    values_CasePheno = cursor_CasePheno.fetchall()
    cursor_CasePheno.close()
    for value_CasePheno in values_CasePheno:
        id_case = value_CasePheno[0]
        list_case_id.append(id_case)
        
    OBJ_MYSQL.close()

    return list_case_id

