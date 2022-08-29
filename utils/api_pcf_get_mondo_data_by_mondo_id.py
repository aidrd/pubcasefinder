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
        list_mondos = r_mondo_id.split(",")
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        sql_mondo = 'select OntoID,OntoName,OntoNameJa from OntoTermMONDOInformation where OntoID in (%s)' % ','.join(['%s']*len(list_mondos))
        cursor_mondo = OBJ_MYSQL.cursor()
        cursor_mondo.execute(sql_mondo, list_mondos)
        values_mondo = cursor_mondo.fetchall()
        cursor_mondo.close()

        for value_mondo in values_mondo:
            mondo_id = value_mondo[0]
            if mondo_id not in hash_data:
                hash_data[mondo_id] = {}
                hash_data[mondo_id]['name_en']=""
                hash_data[mondo_id]['name_ja']=""

                if value_mondo[1]:
                    hash_data[mondo_id]['name_en'] = value_mondo[1]

                if value_mondo[2]:
                    hash_data[mondo_id]['name_ja'] = value_mondo[2]

        OBJ_MYSQL.close()

    return hash_data
