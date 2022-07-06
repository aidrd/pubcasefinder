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


def pcf_get_paa_data_by_paa_id(r_paa_id):

    hash_case_id = {}

    if r_paa_id != "":
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        sql_CaseGene = u"select panel_name from vgpau where panel_id=%s"
        cursor_CaseGene = OBJ_MYSQL.cursor()
        cursor_CaseGene.execute(sql_CaseGene, (r_paa_id,))
        value_CaseGene = cursor_CaseGene.fetchone()
        if value_CaseGene:
            panel_name = value_CaseGene[0]
            hash_case_id['name_en'] = panel_name
        cursor_CaseGene.close()

        OBJ_MYSQL.close()

    return hash_case_id
