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


def pcf_get_gene_data_by_gene_id(r_gene_id):

    hash_data = {}

    if r_gene_id != "":
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        sql_gene = u"select Symbol,SymbolSynonym from DiseaseGene where EntrezID=%s"
        cursor_gene = OBJ_MYSQL.cursor()
        cursor_gene.execute(sql_gene, (r_gene_id.replace('GENEID','ENT'),))
        value_gene = cursor_gene.fetchone()
        if value_gene:
            hash_data['hgnc_gene_symbol'] = ""
            if value_gene[0]:
                hash_data['hgnc_gene_symbol'] = value_gene[0]
            else:
                hash_data['hgnc_gene_symbol'] = value_gene[1]

        cursor_gene.close()

        OBJ_MYSQL.close()

    return hash_data
