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


def pcf_get_mondo_data_by_mondo_id(r_mondo_id):

    hash_data = {}

    if r_mondo_id != "":
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        sql_mondo = u"select OntoName,OntoNameJa from OntoTermMONDOInformation where OntoID=%s"
        cursor_mondo = OBJ_MYSQL.cursor()
        cursor_mondo.execute(sql_mondo, (r_mondo_id,))
        value_mondo = cursor_mondo.fetchone()
        if value_mondo:
            hash_data['name_en'] = ""
            hash_data['name_ja'] = ""
            if value_mondo[0]:
                hash_data['name_en'] = value_mondo[0]
            if value_mondo[1]:
                hash_data['name_ja'] = value_mondo[1]

        cursor_mondo.close()

        OBJ_MYSQL.close()

    return hash_data
