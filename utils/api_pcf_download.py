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


#####
# POST: API for PhenoTouch
# /get_hpo_by_text
# カンマ区切りのHPO IDを返す
# マッチするものがない場合はnoneを返す
#####
def pcf_download(r_target, r_phenotype, r_target_id, r_format, r_range):

    # full or partial
    if r_range == "partial":
        r_range = ""

    # get ranking
    url_api_pcf_get_ranking_by_hpo_id         = "https://pcf.dbcls.jp/pcf_get_ranking_by_hpo_id"
    dict_param_api_pcf_get_ranking_by_hpo_id  = {"target":r_target, "phenotype":r_phenotype}
    r_ranking = requests.get(url_api_pcf_get_ranking_by_hpo_id, params=dict_param_api_pcf_get_ranking_by_hpo_id)

    # get data for each result
    url_api_pcf_get_omim_data_by_omim_id      = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_omim_data_by_omim_id"
    url_api_pcf_get_orpha_data_by_orpha_id    = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_orpha_data_by_orpha_id"
    url_api_pcf_get_gene_data_by_ncbi_gene_id = "https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_get_gene_data_by_ncbi_gene_id"
    url_api_pcf_get_case_data_by_case_id      = ""
    dict_param_api_pcf_get_omim_data_by_omim_id      = {"omim_id":r_target_id, "mode":r_range}
    dict_param_api_pcf_get_orpha_data_by_orpha_id    = {"orpha_id":r_target_id, "mode":r_range}
    dict_param_api_pcf_get_gene_data_by_ncbi_gene_id = {"ncbi_gene_id":r_target_id, "mode":r_range}
    dict_param_api_pcf_get_case_data_by_case_id      = {"case_id":r_target_id, "mode":r_range}

    if r_target == "omim":
        r_data = requests.get(url_api_pcf_get_omim_data_by_omim_id, params=dict_param_api_pcf_get_omim_data_by_omim_id)
    elif r_target == "orphanet":
        r_data = requests.get(url_api_pcf_get_orpha_data_by_orpha_id, params=dict_param_api_pcf_get_orpha_data_by_orpha_id)
    elif r_target == "gene":
        r_data = requests.get(url_api_pcf_get_gene_data_by_ncbi_gene_id, params=dict_param_api_pcf_get_gene_data_by_ncbi_gene_id)
    elif r_target == "case":
        r_data = requests.get(url_api_pcf_get_case_data_by_case_id, params=dict_param_api_pcf_get_case_data_by_case_id)

    json_ranking = r_ranking.json()
    json_data = r_data.json()
    list_json_data = []
    tsv_data = []

    # JSON
    if r_format == "json":
        for entry in json_ranking:
            if entry["id"] in json_data:
                json_data[entry["id"]]["id"] = entry["id"]
                json_data[entry["id"]]["rank"] = entry["rank"]
                json_data[entry["id"]]["score"] = entry["score"]
                json_data[entry["id"]]["matched_hpo_id"] = entry["matched_hpo_id"]
                list_json_data.append(json_data[entry["id"]])
        return list_json_data
    # TSV
    elif r_format == "tsv":
        if r_target == "omim":
            tsv_data.append("\t".join(("Rank","Score","OMIM_ID","Disease_Name","Matched_Phenotype","Causative_Gene")))
        # Orphanet
        elif r_target == "orphanet":
            tsv_data.append("\t".join(("Rank","Score","ORPHA_ID","Disease_Name","Matched_Phenotype","Causative_Gene")))
        # Gene
        elif r_target == "gene":
            tsv_data.append("\t".join(("Rank","Score","NCBI_Gene_ID","HGNC_Gene_Symbol","Matched_Phenotype")))
        # Case
        elif r_target == "case":
            tsv_data.append("\t".join(("Rank","Score","Case_ID","Matched_Phenotype")))

        for entry in json_ranking:
            if entry["id"] in json_data:
                # OMIM
                if r_target == "omim":
                    hgnc_gene_symbol = json_data[entry["id"]]["hgnc_gene_symbol"] if "hgnc_gene_symbol" in json_data[entry["id"]] else ""
                    list_row = (str(entry["rank"]), str(entry["score"]), str(entry["id"]), str(json_data[entry["id"]]["omim_disease_name_en"]), str(entry["matched_hpo_id"]), str(",".join(hgnc_gene_symbol)))
                    tsv_data.append("\t".join(list_row))
                # Orphanet
                elif r_target == "orphanet":
                    hgnc_gene_symbol = json_data[entry["id"]]["hgnc_gene_symbol"] if "hgnc_gene_symbol" in json_data[entry["id"]] else ""
                    #list_row = (str(entry["rank"]), str(entry["score"]), str(entry["id"]), str(json_data[entry["id"]]["orpha_disease_name_en"]), str(entry["matched_hpo_id"]), str(",".join(json_data[entry["id"]]["hgnc_gene_symbol"])))
                    list_row = (str(entry["rank"]), str(entry["score"]), str(entry["id"]), str(json_data[entry["id"]]["orpha_disease_name_en"]), str(entry["matched_hpo_id"]), str(",".join(hgnc_gene_symbol)))
                    tsv_data.append("\t".join(list_row))
                # Gene
                elif r_target == "gene":
                    list_row = (str(entry["rank"]), str(entry["score"]), str(entry["id"]), str(json_data[entry["id"]]["hgnc_gene_symbol"]), str(entry["matched_hpo_id"]))
                    tsv_data.append("\t".join(list_row))
                # Case
                elif r_target == "case":
                    list_row = (str(entry["rank"]), str(entry["score"]), str(entry["id"]), str(json_data[entry["id"]]["omim_disease_name_en"]), str(entry["matched_hpo_id"]), str(",".join(json_data[entry["id"]]["hgnc_gene_symbol"])))
                    tsv_data.append("\t".join(list_row))
        return tsv_data

    return


#def main():
    #print(pcf_download("omim", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "OMIM:263750,OMIM:214800,OMIM:219000", "json", "full"))
    #print(pcf_download("omim", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "OMIM:263750,OMIM:214800,OMIM:219000", "json", "partial"))
    #print(pcf_download("omim", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "OMIM:263750,OMIM:214800,OMIM:219000", "tsv", "partial"))
    #print(pcf_download("orphanet", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "ORPHA:246,ORPHA:245,ORPHA:52,ORPHA:3258", "json", "full"))
    #print(pcf_download("orphanet", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "ORPHA:246,ORPHA:245,ORPHA:52,ORPHA:3258", "json", "partial"))
    #print(pcf_download("orphanet", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "ORPHA:246,ORPHA:245,ORPHA:52,ORPHA:3258", "tsv", "partial"))
    #print(pcf_download("gene", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "GENEID:1723,GENEID:9723,GENEID:10262,GENEID:4038", "json", "full"))
    #print(pcf_download("gene", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "GENEID:1723,GENEID:9723,GENEID:10262,GENEID:4038", "json", "partial"))
    #print(pcf_download("gene", "HP:0000347,HP:0003022,HP:0009381,HP:0000204,HP:0000625", "GENEID:1723,GENEID:9723,GENEID:10262,GENEID:4038", "tsv", "partial"))

#if __name__ == '__main__':
#    main()
