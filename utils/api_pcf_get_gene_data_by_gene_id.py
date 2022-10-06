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
        list_genes = r_gene_id.replace('GENEID','ENT').split(",")
        OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")
        sql_gene = 'select EntrezID,Symbol,SymbolSynonym from DiseaseGene where EntrezID in (%s)' % ','.join(['%s']*len(list_genes))
        cursor_gene = OBJ_MYSQL.cursor()
        cursor_gene.execute(sql_gene, list_genes)
        values_gene = cursor_gene.fetchall()
        cursor_gene.close()

        for value_gene in values_gene:
            gene_id   = value_gene[0].replace('ENT','GENEID')

            if gene_id not in hash_data:
                hash_data[gene_id] = {}
                hash_data[gene_id]['name_en']=""
                hash_data[gene_id]['name_ja']=""
                if value_gene[1]:
                    hash_data[gene_id]['name_en'] = value_gene[1]
                else:
                    hash_data[gene_id]['name_en'] = value_gene[2]

        sql_gene2 = 'select EntrezID,Symbol,SymbolSynonym from DiseaseGeneOMIM where EntrezID in (%s)' % ','.join(['%s']*len(list_genes))
        cursor_gene2 = OBJ_MYSQL.cursor()
        cursor_gene2.execute(sql_gene2, list_genes)
        values_gene2 = cursor_gene2.fetchall()
        cursor_gene2.close()
        for value_gene in values_gene2:
            gene_id   = value_gene[0].replace('ENT','GENEID')
            if gene_id not in hash_data:
                hash_data[gene_id] = {}
                hash_data[gene_id]['name_en']=""
                hash_data[gene_id]['name_ja']=""
                if value_gene[1]:
                    hash_data[gene_id]['name_en'] = value_gene[1]
                else:
                    hash_data[gene_id]['name_en'] = value_gene[2]


        OBJ_MYSQL.close()

    return hash_data
