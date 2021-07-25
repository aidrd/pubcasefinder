# -*- coding: utf-8 -*-

import os
import re
import MySQLdb
from flask import Flask, session, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)
app.secret_key = 'pubcasefinder1210'

#####
# DB設定
app.config.from_pyfile('../config.cfg')
db_sock = app.config['DBSOCK']
db_name = app.config['DBNAME']
db_user = app.config['DBUSER']
db_pw   = app.config['DBPW']

#####
# pcf_get_ranking_by_hpo_id
def pcf_get_ranking_by_hpo_id(r_target, r_phenotype):
    list_phenotypes = r_phenotype.split(",")

    # MySQL接続　初期設定
    OBJ_MYSQL = MySQLdb.connect(unix_socket=db_sock, host="localhost", db=db_name, user=db_user, passwd=db_pw, charset="utf8")

    # 各エンティティごとのアノテーションHPO数
    # 各エンティティごとのアノテーションHPOの合計IC
    dict_AnnotationHPONum     = {}
    dict_AnnotationHPOSumIC   = {}
    sql_annot = ""
    if r_target=="omim":
        sql_annot = u"select distinct OntoID, AnnotationHPONum, AnnotationHPOSumIC from OMIM"
    elif r_target=="orphanet":
        sql_annot = u"select distinct OntoID, AnnotationHPONum, AnnotationHPOSumIC from Orphanet"
    elif r_target=="gene":
        sql_annot = u"select distinct EntrezID, AnnotationHPONum, AnnotationHPOSumIC from GeneFromHPO"
    elif r_target=="case":
        sql_annot = u"select distinct CaseID, AnnotationHPONum, AnnotationHPOSumIC from OpenCase"
    cursor_annot = OBJ_MYSQL.cursor()
    cursor_annot.execute(sql_annot)
    values_annot = cursor_annot.fetchall()
    cursor_annot.close()
    for value in values_annot:
        onto_id                          = value[0]
        AnnotationHPONum                 = value[1]
        AnnotationHPOSumIC               = value[2]
        dict_AnnotationHPONum[onto_id]   = AnnotationHPONum
        dict_AnnotationHPOSumIC[onto_id] = AnnotationHPOSumIC

    ## ICテーブルから全HPO termのICを取得
    dict_IC = {}
    sql_IC = u"select OntoID, IC from IC where OntoName='HP'"
    cursor_IC = OBJ_MYSQL.cursor()
    cursor_IC.execute(sql_IC)
    values = cursor_IC.fetchall()
    cursor_IC.close()
    for value in values:
        onto_id_hp          = value[0]
        ic                  = value[1]
        dict_IC[onto_id_hp] = ic

    ## IDOMIMOrphanetGeneテーブルからランキング対象となるNCBI Gene IDを取得
    dict_UniqID = {}
    if r_target=="gene":
        sql_IDOMIMOrphanetGene = u"select UniqID from IDOMIMOrphanetGene"
        cursor_IDOMIMOrphanetGene = OBJ_MYSQL.cursor()
        cursor_IDOMIMOrphanetGene.execute(sql_IDOMIMOrphanetGene)
        values = cursor_IDOMIMOrphanetGene.fetchall()
        cursor_IDOMIMOrphanetGene.close()
        for value in values:
            uniq_id = value[0]
            dict_UniqID[uniq_id] = 1

    ####
    ## 各疾患とのスコアを算出し、データを収納
    ### インデックステーブルを利用して、各疾患でのICの合計を取得
    ### http://stackoverflow.com/questions/4574609/executing-select-where-in-using-mysqldb
    sql_index = ""
    if r_target=="omim":
        sql_index = u"select a.DiseaseID, a.IndexOntoIDHP, a.DiseaseOntoIDHP, a.CommonRootHPIC, (b.IC - a.CommonRootHPIC) from IndexDPAOMIM as a left join IC as b on a.IndexOntoIDHP=b.OntoID where a.IndexOntoIDHP in (%s) and b.OntoName='HP' and a.DiseaseID in (select UniqID from IDOMIMOrphanetGene) order by field(a.IndexOntoIDHP, %s)"
    elif r_target=="orphanet":
        sql_index = u"select REPLACE(a.DiseaseID, 'ORPHA', 'ORDO'), a.IndexOntoIDHP, a.DiseaseOntoIDHP, a.CommonRootHPIC, (b.IC - a.CommonRootHPIC) from IndexDPAOrphanet as a left join IC as b on a.IndexOntoIDHP=b.OntoID where REPLACE(a.DiseaseID, 'ORPHA', 'ORDO') in (select distinct OntoID from Orphanet where RareDiseaseFlg=1) and a.IndexOntoIDHP in (%s) and b.OntoName='HP' and a.DiseaseID in (select UniqID from IDOMIMOrphanetGene) order by field(a.IndexOntoIDHP, %s)"
    elif r_target=="gene":
        sql_index = u"select a.NCBIGeneID_MONDOID, a.IndexOntoIDHP, a.GeneOntoIDHP, a.CommonRootHPIC, (b.IC - a.CommonRootHPIC) from IndexGPA as a left join IC as b on a.IndexOntoIDHP=b.OntoID where a.IndexOntoIDHP in (%s) and b.OntoName='HP' order by field(a.IndexOntoIDHP, %s)"
    elif r_target=="case":
        sql_index = u"select a.CaseID, a.IndexOntoIDHP, a.CaseOntoIDHP, a.CommonRootHPIC, (b.IC - a.CommonRootHPIC) from IndexCaseHP as a left join IC as b on a.IndexOntoIDHP=b.OntoID where a.IndexOntoIDHP in (%s) and b.OntoName='HP' order by field(a.IndexOntoIDHP, %s)"
    in_p=', '.join(map(lambda x: '%s', list_phenotypes))
    sql_index = sql_index % (in_p, in_p)
    cursor_index = OBJ_MYSQL.cursor()
    cursor_index.execute(sql_index, (list_phenotypes + list_phenotypes))
    values_index = cursor_index.fetchall()
    cursor_index.close()

    ####
    ## データを収納
    list_dict_similar_disease = []
    dict_similar_diseases = {}
    dict_over_thres_count = {}
    # default
    #thres_delta_ic, thres_count, thres_weight = 0, 0, 1
    # t10
    thres_delta_ic, thres_count, thres_weight = 7.5, 3, 0.25

    # 入力HPOとCommonHPOの差分カウント
    for value in values_index:
        onto_id            = value[0]
        onto_id_hp_index   = value[1]
        onto_id_hp_disease = value[2]
        ic                 = 0 if value[3] == "" else float(value[3])
        delta_ic           = float(value[4])
        weight             = 1

        if onto_id not in dict_over_thres_count:
            dict_over_thres_count[onto_id] = 0
        if delta_ic < thres_delta_ic:
            dict_over_thres_count[onto_id] += 1

    for value in values_index:
        onto_id       = value[0]
        onto_id_hp_index   = value[1]
        onto_id_hp_disease = value[2]
        ic                 = 0 if value[3] == "" else float(value[3])
        delta_ic           = float(value[4])
        weight             = 1

        # 入力HPOとCommonHPOの差分カウントおよびカウント回数の条件を満たした場合のweight設定
        if delta_ic >= thres_delta_ic and dict_over_thres_count[onto_id] >= thres_count:
            weight = thres_weight

        ## test
        if onto_id == "OMIM:234200":
            app.logger.error(onto_id_hp_index)
            app.logger.error(onto_id_hp_disease)
            app.logger.error("weight: " + str(weight))
            app.logger.error("weight: " + str(ic * weight))

        if onto_id not in dict_similar_diseases:
            dict_similar_diseases[onto_id] = {}
            dict_similar_diseases[onto_id]['matched_hpo_id']     = []
            dict_similar_diseases[onto_id]['sum_ic']             = 0
            dict_similar_diseases[onto_id]['sum_ic_denominator'] = 0

        (dict_similar_diseases[onto_id]['matched_hpo_id']).append(onto_id_hp_disease)

        # ICが0のエントリーが指定されると、分母の方が小さくなるため、分母のICが0の場合は分子のICも0にする
        if onto_id_hp_index in dict_IC and dict_IC[onto_id_hp_index] != 0:
            # GeneYenta: 分子
            dict_similar_diseases[onto_id]['sum_ic'] += ic * weight
            # GeneYenta: 分母
            dict_similar_diseases[onto_id]['sum_ic_denominator'] += dict_IC[onto_id_hp_index] * weight
        else:
            # GeneYenta: 分子
            dict_similar_diseases[onto_id]['sum_ic'] += 0
            # GeneYenta: 分母
            dict_similar_diseases[onto_id]['sum_ic_denominator'] += 0

    ####
    # 類似疾患検索結果を収納
    for onto_id in dict_similar_diseases.keys():

        geneid = ""
        if r_target=="gene":
            list_NCBIGeneID_MONDOID = onto_id.split("_")
            geneid = (list_NCBIGeneID_MONDOID[0]).replace('GENEID', 'ENT')

        # IndexDiseaseHPOMIMの中に、オントロジーには含まれないOMIM IDが含まれているため、それらの処理を飛ばす
        ## TODO: 実際は、IndexDiseaseHPOMIM関連から、データの作成時にそれらのOMIM IDを除く必要がある。 20180913 藤原
        if r_target=="gene":
            if geneid not in dict_AnnotationHPONum:
                continue
        else:
            if onto_id not in dict_AnnotationHPONum:
                continue

        # ランキング対象のNCBI Gene IDでない場合は処理を飛ばす
        if r_target=="gene":
            if geneid.replace('ENT', 'GENEID') not in dict_UniqID:
                continue

        dict_similar_disease = {}

        ## test ##
        if onto_id == "OMIM:234200":
            app.logger.error(dict_similar_diseases[onto_id]['sum_ic'])
            app.logger.error(dict_similar_diseases[onto_id]['sum_ic_denominator'])

        dict_similar_disease['score']                = float(dict_similar_diseases[onto_id]['sum_ic'] / dict_similar_diseases[onto_id]['sum_ic_denominator']) if dict_similar_diseases[onto_id]['sum_ic_denominator'] != 0 else 0
        list_matched_hpo_id = []
        for x in dict_similar_diseases[onto_id]['matched_hpo_id']:
            if x not in list_matched_hpo_id:
                list_matched_hpo_id.append(x)
        #dict_similar_disease['matched_hpo_id']       = ",".join(dict_similar_diseases[onto_id]['matched_hpo_id'])
        dict_similar_disease['matched_hpo_id']       = ",".join(list_matched_hpo_id)

        ## test ##
        if onto_id == "OMIM:234200":
            app.logger.error(dict_similar_disease['matched_hpo_id'])

        dict_similar_disease['annotation_hp_num']    = dict_AnnotationHPONum[onto_id] if not r_target=="gene" else dict_AnnotationHPONum[geneid]
        dict_similar_disease['annotation_hp_sum_ic'] = dict_AnnotationHPOSumIC[onto_id] if not r_target=="gene" else dict_AnnotationHPOSumIC[geneid]
        if r_target=="orphanet":
            onto_id = onto_id.replace('ORDO', 'ORPHA')
        #elif r_target=="gene":
        #    onto_id = onto_id.replace('ENT', 'GENEID')
        dict_similar_disease['id']                   = onto_id
        if r_target=="case":
            if re.compile("DECIPHER").search(onto_id):
                dict_similar_disease['url'] = "https://www.deciphergenomics.org/patient/" + onto_id.replace("DECIPHER:", "")
            elif re.compile("MyGene2").search(onto_id):
                dict_similar_disease['url'] = "https://mygene2.org/MyGene2/familyprofile/" + onto_id.replace("MyGene2:", "") + "/profile"
            elif re.compile("UDN").search(onto_id):
                dict_similar_disease['url'] = "https://undiagnosed.hms.harvard.edu/participants/participant-" + onto_id.replace("UDN:", "") + "/"
            
        list_dict_similar_disease.append(dict_similar_disease)

    ####
    # スコアを基にランキングを作成
    ## スコアが同一の場合は、以下の値でランキング
    ### アノテーションされたHPOの数
    ### アノテーションされたHPOのICの合計値
    list_dict_similar_disease_sorted = []
    rank             = 0
    rank_deposit     = 0
    prev_match_score = 0
    dict_rank_NCBIGeneID = {}
    for dict_similar_disease in sorted(list_dict_similar_disease, key=lambda x: (-float(x['score']),int(x['annotation_hp_num']),-float(x['annotation_hp_sum_ic']))):

        if r_target=="gene":
            list_NCBIGeneID_MONDOID = (dict_similar_disease['id']).split("_")
            NCBIGeneID = list_NCBIGeneID_MONDOID[0]
            MONDOID    = list_NCBIGeneID_MONDOID[1]
            if NCBIGeneID in dict_rank_NCBIGeneID:
                continue

            if dict_similar_disease['score'] != prev_match_score:
                rank = rank + 1 + rank_deposit 
                dict_similar_disease['rank'] = rank
                prev_match_score = dict_similar_disease['score']
                rank_deposit = 0
            else:
                dict_similar_disease['rank'] = rank
                prev_match_score = dict_similar_disease['score']
                rank_deposit += 1
            dict_similar_disease['id'] = NCBIGeneID
            list_dict_similar_disease_sorted.append(dict_similar_disease)
            dict_rank_NCBIGeneID[NCBIGeneID] = MONDOID
        else:
            if dict_similar_disease['score'] != prev_match_score:
                rank = rank + 1 + rank_deposit 
                dict_similar_disease['rank'] = rank
                prev_match_score = dict_similar_disease['score']
                rank_deposit = 0
            else:
                dict_similar_disease['rank'] = rank
                prev_match_score = dict_similar_disease['score']
                rank_deposit += 1
            list_dict_similar_disease_sorted.append(dict_similar_disease)


    return list_dict_similar_disease_sorted

