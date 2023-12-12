let lang = 'ja';
localStorage.lang = lang;

$(`.dropdown-menu-item[data-lang='${lang}']`).addClass('dropdown-selected')
document.getElementById('selected-language-display').innerText = $('.dropdown-selected').text()

$('ul#dropdown-language li').click((e) => {
    if (e.target.classList.contains('popup-bg-cover')) return document.getElementById('dropdown-language').classList.toggle('dropdown-menu-open')
    let newLang = e.target.dataset.lang

    if (newLang === lang) return

    document.getElementById('selected-language-display').innerText = e.target.innerText
    localStorage.lang = newLang

    window.location.reload()
})

// modify end by hzhang@bits

let infoTranslations = {
    en: [
        { 'What is PanelSearch?': 'PanelSearch is a publicly-available database that allows you to search and utilize Virtual Gene Panels associated with 9,998 human diseases. Virtual Gene Panels can be used for efficient clinical interpretation of genome sequences.' },
        { 'How to construct Virtual Gene Panels': 'Based on the Monarch Disease Ontology (Mondo), which includes many rare and genetic diseases, we have constructed Virtual Gene Panels that automatically summarize disease-causing genes for each disease. By using the disease hierarchy information in Mondo, we have also automatically constructed Virtual Gene Panels for disease groups such as Mendelian disease for example.' },
        { 'Data sources': 'Virtual Gene Panels were constructed from the following data sources.</br>・Mondo: <a href="http://purl.obolibrary.org/obo/mondo.obo">http://purl.obolibrary.org/obo/mondo.obo</a></br>・MedGen: <a href="https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen" target="_blank">https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen</a></br>・Orphanet: <a href="http://www.orphadata.org/data/xml/en_product6.xml" target="_blank">http://www.orphadata.org/data/xml/en_product6.xml</a></br>・GenCC: <a href="https://search.thegencc.org/download" target="_blank">https://search.thegencc.org/download</a>' },
        { 'Disclaimer': 'Please refer to <a href="https://pubcasefinder.dbcls.jp/termsofservice?lang=en" target="_blank">this link</a>.' }
    ],
    ja: [
        { 'PanelSearchとは？': 'PanelSearchは、ヒトの9,998疾患に関連するVirtual Gene Panelを検索し、利活用できる公開データベースです。Virtual Gene Panelはゲノム配列の効率的な臨床的解釈に役立てることができます。' },
        { 'Virtual Gene Panel構築方法': '多くの希少・遺伝性疾患を含むMonarch Disease Ontology（Mondo）をベースに、それぞれの疾患について疾患原因遺伝子を自動でまとめたVirtual Gene Panelを構築しました。Mondoの疾患階層情報を利用することで、例えば「Mendelian disease」などの疾患グループのVirtual Gene Panelも自動で構築しています。' },
        { 'データソース': '以下のデータソースからVirtual Gene Panelを構築しました。</br>・Mondo: <a href="http://purl.obolibrary.org/obo/mondo.obo">http://purl.obolibrary.org/obo/mondo.obo</a></br>・MedGen: <a href="https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen" target="_blank">https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen</a></br>・Orphanet: <a href="http://www.orphadata.org/data/xml/en_product6.xml" target="_blank">http://www.orphadata.org/data/xml/en_product6.xml</a></br>・GenCC: <a href="https://search.thegencc.org/download" target="_blank">https://search.thegencc.org/download</a>' },
        { '免責事項': '<a href="https://pubcasefinder.dbcls.jp/termsofservice" target="_blank">リンク先</a>を参照してください。' }
    ],
    ko: [
        { 'PanelSearch란?': 'PanelSearch는 인간의 9,998 질환과 관련된 Virtual Gene Panel을 검색하고 활용할 수 있는 공개 데이터베이스입니다. Virtual Gene Panel은 게놈 배열의 효율적인 임상적 해석에 도움이 될 수 있습니다.' },
        { 'Virtual Gene Panel 구축 방법': '많은 희귀・유전성 질환명을 포함하는 Monarch Disease Ontology(Mondo)를 베이스로, 각각의 질환에 대해 질환 원인 유전자를 자동으로 정리한 Virtual Gene Panel을 구축했습니다. Mondo의 질환 계층 정보를 이용함으로써 예를 들어 「Mendelian disease」 등의 질환 그룹인 Virtual Gene Panel도 자동으로 구축하고 있습니다.' },
        { '데이터 소스': '이하의 데이터 소스로부터 Virtual Gene Panel을 구축했습니다.</br>・Mondo: <a href="http://purl.obolibrary.org/obo/mondo.obo">http://purl.obolibrary.org/obo/mondo.obo</a></br>・MedGen: <a href="https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen" target="_blank">https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen</a></br>・Orphanet: <a href="http://www.orphadata.org/data/xml/en_product6.xml" target="_blank">http://www.orphadata.org/data/xml/en_product6.xml</a></br>・GenCC: <a href="https://search.thegencc.org/download" target="_blank">https://search.thegencc.org/download</a>' },
        { '면책 사항': '<a href="https://pubcasefinder.dbcls.jp/termsofservice?lang=ko" target="_blank">링크</a>를 참조해 주시기 바랍니다.' }
    ],
    zh: [
        { '什么是面板搜索？': '面板搜索是一个公开的数据库, 允许你搜索和利用与9,998种人类疾病相关的虚拟基因面板。虚拟基因小组可用于对基因组序列的有效临床解释。' },
        { '如何构建虚拟基因板': '基于Monarch疾病本体论（Mondo）, 其中包括许多罕见和遗传性疾病, 我们已经构建了虚拟基因面板, 自动总结每种疾病的致病基因。通过使用Mondo中的疾病层次信息, 我们还为疾病组（例如 "孟德尔病"）自动构建了虚拟基因面板。' },
        { '数据来源': '虚拟基因面板是由以下数据来源构建的。</br>・Mondo: <a href="http://purl.obolibrary.org/obo/mondo.obo">http://purl.obolibrary.org/obo/mondo.obo</a></br>・MedGen: <a href="https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen" target="_blank">https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen</a></br>・Orphanet: <a href="http://www.orphadata.org/data/xml/en_product6.xml" target="_blank">http://www.orphadata.org/data/xml/en_product6.xml</a></br>・GenCC: <a href="https://search.thegencc.org/download" target="_blank">https://search.thegencc.org/download</a>' },
        { '免责声明': '请参考<a href="https://pubcasefinder.dbcls.jp/termsofservice?lang=en" target="_blank">这个链接</a>。' }
    ],
    zhcht: [
        { '什麼是面板搜索？': 'PanelSearch 是一個公開可用的數據庫，可讓您搜索和利用與 9,998 種人類疾病相關的虛擬基因面板。 Virtual Gene Panels 可用於對基因組序列進行高效的臨床解釋。' },
        { '如何構建虛擬基因面板': '基於包括許多罕見和遺傳疾病的君主疾病本體論 (Mondo)，我們構建了虛擬基因面板，可以自動總結每種疾病的致病基因。 通過使用 Mondo 中的疾病等級信息，我們還自動構建了針對疾病組的虛擬基因面板，例如“孟德爾疾病”。' },
        { '數據源': 'Virtual Gene Panels 是根據以下數據源構建的。</br>・Mondo: <a href="http://purl.obolibrary.org/obo/mondo.obo">http://purl.obolibrary.org/obo/mondo.obo</a></br>・MedGen: <a href="https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen" target="_blank">https://ftp.ncbi.nlm.nih.gov/gene/DATA/mim2gene_medgen</a></br>・Orphanet: <a href="http://www.orphadata.org/data/xml/en_product6.xml" target="_blank">http://www.orphadata.org/data/xml/en_product6.xml</a></br>・GenCC: <a href="https://search.thegencc.org/download" target="_blank">https://search.thegencc.org/download</a>' },
        { '免責聲明': '請參考<a href="https://pubcasefinder.dbcls.jp/termsofservice?lang=en" target="_blank">此鏈接</a>。' }
    ]
}

let modalContent = document.getElementById('modal-info-content')
modalContent.innerHTML = `
<img src="/static/record/images/logo_PanelSearch.svg" class="info-panel-img">    
<ul>
        <li>
            <i>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="400" viewBox="0 0 400 400">
            <defs>
                <clipPath id="clip-Info-panel-01">
                <rect width="400" height="400"/>
                </clipPath>
            </defs>
            <g id="Info-panel-01" clip-path="url(#clip-Info-panel-01)">
                <path id="合体_26" data-name="合体 26" d="M-21527.922,3999.957l-84.8-77.337a151.581,151.581,0,0,1-81.207,28.6,152.33,152.33,0,0,1-160.1-144.149,152.334,152.334,0,0,1,144.15-160.1,152.343,152.343,0,0,1,160.1,144.154,151.867,151.867,0,0,1-39.018,110.008l82.432,75.18a15.99,15.99,0,0,1,1.041,22.6,15.936,15.936,0,0,1-10.982,5.2c-.277.014-.557.021-.834.021A15.956,15.956,0,0,1-21527.922,3999.957Zm-180.277-321.026a120.467,120.467,0,0,0-113.873,126.463,120.473,120.473,0,0,0,126.469,113.873,120.467,120.467,0,0,0,113.867-126.468,120.485,120.485,0,0,0-120.084-114.035Q-21705,3678.764-21708.2,3678.931Z" transform="translate(21879.32 -3628.085)"/>
            </g>
            </svg>
            </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][0])}</h4>
                <p>${Object.values(infoTranslations[lang][0])}
                </p>
            </span>
        </li>
        <li>
        <i>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="400" viewBox="0 0 400 400">
        <defs>
            <clipPath id="clip-Info-panel-02">
            <rect width="400" height="400"/>
            </clipPath>
        </defs>
        <g id="Info-panel-02" clip-path="url(#clip-Info-panel-02)">
            <circle id="楕円形_481" data-name="楕円形 481" cx="30.317" cy="30.317" r="30.317" transform="translate(49.864 80.935)" fill="#11101d"/>
            <circle id="楕円形_482" data-name="楕円形 482" cx="30.317" cy="30.317" r="30.317" transform="translate(49.864 169.683)" fill="#11101d"/>
            <circle id="楕円形_483" data-name="楕円形 483" cx="30.317" cy="30.317" r="30.317" transform="translate(49.864 258.43)" fill="#11101d"/>
            <path id="線_978" data-name="線 978" d="M200.367,16H0A16,16,0,0,1-16,0,16,16,0,0,1,0-16H200.367a16,16,0,0,1,16,16A16,16,0,0,1,200.367,16Z" transform="translate(150.101 111.253)"/>
            <path id="線_979" data-name="線 979" d="M200.367,16H0A16,16,0,0,1-16,0,16,16,0,0,1,0-16H200.367a16,16,0,0,1,16,16A16,16,0,0,1,200.367,16Z" transform="translate(150.101 200)"/>
            <path id="線_980" data-name="線 980" d="M200.367,16H0A16,16,0,0,1-16,0,16,16,0,0,1,0-16H200.367a16,16,0,0,1,16,16A16,16,0,0,1,200.367,16Z" transform="translate(150.101 288.747)"/>
        </g>
        </svg>
        </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][1])}</h4>
                <p>${Object.values(infoTranslations[lang][1])}
                </p>
            </span>
        </li>
        <li>
        <i>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="400" viewBox="0 0 400 400">
            <defs>
                <clipPath id="clip-Info-panel-03">
                <rect width="400" height="400"/>
                </clipPath>
            </defs>
            <g id="Info-panel-03" clip-path="url(#clip-Info-panel-03)">
                <path id="楕円形_476" data-name="楕円形 476" d="M156.5-16C185.305-16,329-13.4,329,38S185.305,92,156.5,92-16,89.4-16,38,127.695-16,156.5-16ZM294.581,38C281.549,29.245,234.212,16,156.5,16S31.451,29.245,18.419,38C31.451,46.755,78.788,60,156.5,60S281.549,46.755,294.581,38Z" transform="translate(43 34)"/>
                <path id="パス_124794" data-name="パス 124794" d="M172.5,40.324C143.695,40.324,0,37.722,0-13.653V-270a16,16,0,0,1,16-16,16,16,0,0,1,16,16V-15.615C40.269-7.054,88.746,8.324,172.5,8.324S304.731-7.054,313-15.615V-270a16,16,0,0,1,16-16,16,16,0,0,1,16,16V-13.653C345,37.722,201.305,40.324,172.5,40.324Z" transform="translate(28 341.676)"/>
                <path id="パス_124795" data-name="パス 124795" d="M172.5,53.977C143.695,53.977,0,51.375,0,0A16,16,0,0,1,16-16,16,16,0,0,1,31.862-2.108c7.853,8.531,56.4,24.085,140.638,24.085S305.285,6.424,313.138-2.108A16,16,0,0,1,329-16,16,16,0,0,1,345,0C345,51.375,201.305,53.977,172.5,53.977Z" transform="translate(28 234.029)"/>
                <path id="パス_124796" data-name="パス 124796" d="M172.5,53.977C143.695,53.977,0,51.375,0,0A16,16,0,0,1,16-16,16,16,0,0,1,31.862-2.108c7.853,8.531,56.4,24.085,140.638,24.085S305.285,6.424,313.138-2.108A16,16,0,0,1,329-16,16,16,0,0,1,345,0C345,51.375,201.305,53.977,172.5,53.977Z" transform="translate(28 154.277)"/>
                <rect id="長方形_8893" data-name="長方形 8893" width="345" height="53" transform="translate(28 173)" fill="none"/>
            </g>
            </svg>
            </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][2])}</h4>
                <p>${Object.values(infoTranslations[lang][2])}
                </p>
            </span>
        </li>
        <li>
        <i>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="400" height="400" viewBox="0 0 400 400">
        <defs>
            <clipPath id="clip-Info-panel-04">
            <rect width="400" height="400"/>
            </clipPath>
        </defs>
        <g id="Info-panel-04" clip-path="url(#clip-Info-panel-04)">
            <path id="多角形_45" data-name="多角形 45" d="M192,13.925A45.536,45.536,0,0,1,231.821,36.9l140,242.075A46,46,0,0,1,332,348H52a46,46,0,0,1-39.821-69.029l140-242.075A45.536,45.536,0,0,1,192,13.925ZM332,316a14,14,0,0,0,12.119-21.009l-140-242.075a14,14,0,0,0-24.239,0l-140,242.075A14,14,0,0,0,52,316Z" transform="translate(8 14)"/>
            <circle id="楕円形_469" data-name="楕円形 469" cx="24.5" cy="24.5" r="24.5" transform="translate(225 304) rotate(180)"/>
            <rect id="長方形_8887" data-name="長方形 8887" width="39" height="128" rx="19.5" transform="translate(220 236) rotate(180)"/>
        </g>
        </svg>
        </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][3])}</h4>
                <p>${Object.values(infoTranslations[lang][3])}
                </p>
            </span>
        </li>
    </ul>
`

document.getElementById('selected-language-display').textContent =
    $('ul#dropdown-language li').filter((i, el) => el.dataset.lang === lang)[0].innerText;

$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if (scroll >= $(window).height()) {
        $("#nav-panel").addClass("scrolled");
    } else {
        $("#nav-panel").removeClass("scrolled");
    }
});

