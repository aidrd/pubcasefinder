# panelデータを更新した際は，本スクリプトを実行し，ダウンロードファイルを更新する
wget 'https://pubcasefinder.dbcls.jp/sparqlist/api/pcf_download_all_panel' -O ./all_panel.tsv
