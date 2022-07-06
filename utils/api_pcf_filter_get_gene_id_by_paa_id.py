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


def pcf_filter_get_gene_id_by_paa_id(r_paa_id):

    hash_gene_id = {}

    if r_paa_id != "":
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        sql_CaseGene = u"select gene_id from vgpau_genes where panel_id=%s"
        cursor_CaseGene = OBJ_MYSQL.cursor()
        cursor_CaseGene.execute(sql_CaseGene, (r_paa_id,))
        values_CaseGene = cursor_CaseGene.fetchall()
        cursor_CaseGene.close()

        for value_CaseGene in values_CaseGene:
            gene_id   = value_CaseGene[0].replace('ENT','GENEID')

            if r_paa_id not in hash_gene_id:
                hash_gene_id[r_paa_id]=[]
            hash_gene_id[r_paa_id].append(gene_id)

        OBJ_MYSQL.close()

    return hash_gene_id
