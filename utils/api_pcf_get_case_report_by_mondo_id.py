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

def pcf_get_case_report_by_mondo_id(r_mondo_id, r_lang):

    list_dict_cs = []
    OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

    if r_mondo_id != "":

        # J-Stageの症例報告を取得
        if r_lang == "ja":
            sql_JStage = u"select a.id_jstage, a.title_ja, a.url_ja, a.pdate, a.id_jglobal, a.journal_ja, journal_en from JStage as a left join AnnotOntoMONDOJStage as b on a.id_jstage=b.id_jstage where b.id_mondo=%s order by a.pdate desc"
            cursor_JStage = OBJ_MYSQL.cursor()
            cursor_JStage.execute(sql_JStage, (r_mondo_id,))
            values_JStage = cursor_JStage.fetchall()
            cursor_JStage.close()
            for value_JStage in values_JStage:
                id_jstage  = value_JStage[0]
                title_ja   = value_JStage[1]
                url_ja     = value_JStage[2]
                pdate      = value_JStage[3]
                id_jglobal = value_JStage[4]
                journal_ja = value_JStage[5]
                journal_en = value_JStage[6]
                journal_ja = journal_ja.replace("　", " ")
                journal = journal_ja.translate(str.maketrans({chr(0xFF01 + i): chr(0x21 + i) for i in range(94)})) if journal_ja != "" else journal_en
                dict_jstage = {}
                #dict_jstage['id']         = id_jstage
                dict_jstage['id']         = "Go to J-STAGE"
                dict_jstage['title']      = title_ja
                dict_jstage['url']        = url_ja
                dict_jstage['url_img_jstage'] = "<a target='_blank' href='" + url_ja + "'><img src='https://pubcasefinder.dbcls.jp/static/images/logo_J-STAGE.png' alt='J-STAGE logo' style='width: 80px; height: auto;'></a>"
                dict_jstage['pyear']      = pdate
                #dict_jstage['id_jglobal'] = id_jglobal
                dict_jstage['id_jglobal'] = "Go to J-GLOBAL"
                dict_jstage['url_jglobal'] = "https://jglobal.jst.go.jp/detail?JGLOBAL_ID=" + id_jglobal
                dict_jstage['url_img_jglobal'] = "<a target='_blank' href='https://jglobal.jst.go.jp/detail?JGLOBAL_ID=" + id_jglobal + "'><img src='https://pubcasefinder.dbcls.jp/static/images/logo_J-GLOBAL.png' alt='J-GLOBAL logo' style='width: 100px; height: auto;'></a>"
                dict_jstage['journal']    = journal
                list_dict_cs.append(dict_jstage)
        # PubMedの症例報告を取得
        elif r_lang == "en":
            sql_pubmed = u"select distinct a.PMID, b.title, b.pyear, b.journal from AnnotOntoMONDO as a left join CaseReports as b on a.PMID = b.PMID where a.OntoID=%s order by b.pyear desc, b.title"
            cursor_pubmed = OBJ_MYSQL.cursor()
            cursor_pubmed.execute(sql_pubmed, (r_mondo_id,))
            values_pubmed = cursor_pubmed.fetchall()
            cursor_pubmed.close()
            for value_pubmed in values_pubmed:
                pmid    = value_pubmed[0]
                title   = value_pubmed[1]
                pyear   = value_pubmed[2]
                journal = value_pubmed[3]
                dict_pubmed = {}
                dict_pubmed['id']      = pmid
                dict_pubmed['title']   = title
                dict_pubmed['url']     = "https://pubmed.ncbi.nlm.nih.gov/" + str(pmid)
                dict_pubmed['pyear']   = pyear
                dict_pubmed['journal'] = journal
                list_dict_cs.append(dict_pubmed)

    OBJ_MYSQL.close()

    return list_dict_cs

