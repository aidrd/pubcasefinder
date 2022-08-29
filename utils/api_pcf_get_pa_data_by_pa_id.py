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


def pcf_get_pa_data_by_pa_id(r_pa_id):

    hash_data = {}

    if r_pa_id != "":
        list_pas = r_pa_id.split(",")
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        sql_CaseGene = 'select panel_id,panel_name from vgp where panel_id in (%s)' % ','.join(['%s']*len(list_pas))
        cursor_CaseGene = OBJ_MYSQL.cursor()
        cursor_CaseGene.execute(sql_CaseGene, list_pas)
        values_CaseGene = cursor_CaseGene.fetchall()
        cursor_CaseGene.close()

        for value_CaseGene in values_CaseGene:
            pa_id = value_CaseGene[0]
            if pa_id not in hash_data:
                hash_data[pa_id] = {}
                hash_data[pa_id]['name_en']=value_CaseGene[1]
                hash_data[pa_id]['name_ja']=""

        OBJ_MYSQL.close()

    return hash_data
