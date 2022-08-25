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


def pcf_get_nando_data_by_nando_id(r_nando_id):

    hash_data = {}

    if r_nando_id != "":
        list_nandos = r_nando_id.split(",")
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        sql_nando = 'select OntoID,OntoName,OntoNameJa from OntoTermNANDOInformation where OntoID in (%s)' % ','.join(['%s']*len(list_nandos))
        cursor_nando = OBJ_MYSQL.cursor()
        cursor_nando.execute(sql_nando, list_nandos)
        values_nando = cursor_nando.fetchall()
        cursor_nando.close()

        for value_nando in values_nando:
            nando_id = value_nando[0]
            if nando_id not in hash_data:
                hash_data[nando_id] = {}
                hash_data[nando_id]['name_en']=""
                hash_data[nando_id]['name_ja']=""

                if value_nando[1]:
                    hash_data[nando_id]['name_en'] = value_nando[1]

                if value_nando[2]:
                    hash_data[nando_id]['name_ja'] = value_nando[2]

        OBJ_MYSQL.close()

    return hash_data
