# -*- coding: utf-8 -*-

from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import re
import json
import MySQLdb

import Levenshtein

app = Flask(__name__)


#####
# DB設定
app.config.from_pyfile('../config.cfg')
db_sock = app.config['DBSOCK']
db_name = app.config['DBNAME']
db_user = app.config['DBUSER']
db_pw   = app.config['DBPW']


#####
# POST: API for PhenoTouch
# /get_mondo_by_text
# カンマ区切りのMONDO IDを返す
# マッチするものがない場合はnoneを返す
#####
def search_mondo_by_text(text):

    dict_match = {}
    OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
    sql_OntoTermMONDO = u"select OntoID, OntoTerm from OntoTermMONDO;"
    cursor_OntoTermMONDO = OBJ_MYSQL.cursor()
    cursor_OntoTermMONDO.execute(sql_OntoTermMONDO)
    values = cursor_OntoTermMONDO.fetchall()
    cursor_OntoTermMONDO.close()
    for value in values:
        uid   = value[0]
        value = value[1]

        # ジャロ・ウィンクラー距離を計算
        jaro_dist = Levenshtein.jaro_winkler(text, value)

        if jaro_dist in dict_match:
            (dict_match[jaro_dist]).append("\t".join([uid,value]))
        else:
            dict_match[jaro_dist] = []
            (dict_match[jaro_dist]).append("\t".join([uid,value]))

    str_list_mondo = ""
    counter = 0
    for key, list_uid_value in sorted(dict_match.items(), reverse=True):
        #print(key)
        for uid_value in sorted(list_uid_value):
            str_list_mondo = str_list_mondo + "," + (uid_value.split())[0]
            counter += 1
            if counter == 5:
                break
        if counter == 5:
            break

    str_list_mondo = re.sub('^,', '', str_list_mondo)
    return str_list_mondo


#####
# GET: API for text search
# dict形式でMONDO IDと日本語訳を返す
# マッチするものがない場合はnoneを返す
#####
def search_mondo_by_text_with_dict(text):

    dict_match = {}
    OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
    sql_OntoTermMONDO = u"select OntoID, OntoTerm from OntoTermMONDO;"
    cursor_OntoTermMONDO = OBJ_MYSQL.cursor()
    cursor_OntoTermMONDO.execute(sql_OntoTermMONDO)
    values = cursor_OntoTermMONDO.fetchall()
    cursor_OntoTermMONDO.close()
    for value in values:
        uid   = value[0]
        value = value[1]

        # ジャロ・ウィンクラー距離を計算
        jaro_dist = Levenshtein.jaro_winkler(text, value)

        if jaro_dist in dict_match:
            (dict_match[jaro_dist]).append(",".join([uid,value]))
        else:
            dict_match[jaro_dist] = []
            (dict_match[jaro_dist]).append(",".join([uid,value]))

    str_list_mondo = ""
    counter = 0
    dict_return = {}
    list_return = []
    for key, list_uid_value in sorted(dict_match.items(), reverse=True):
        #print(key)
        for uid_value in sorted(list_uid_value):
            #dict_return[(uid_value.split())[0]] = (uid_value.split())[1]
            #list_return.append((uid_value.split())[1])
            list_return.append(uid_value)
            counter += 1
            if counter == 10:
                break
        if counter == 10:
            break

    return list_return


def main():
    print(search_mondo_by_text("Additional findings health related"))
    print(search_mondo_by_text_with_dict("Adult onset movement disorder"))

if __name__ == '__main__':
    main()
