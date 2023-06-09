// modify start by hzhang@bits 
//// Read the language from the URL
//let lang = window.location.href.split('?lang=')[1] ?? 'en';

//// Remove anchor from the URL
//if (lang) {
//    lang = lang.split('#')[0];
//}

let lang = localStorage.lang || 'en'
lang = lang === 'undefined' ? 'en' : lang

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
            <i class="material-symbols-outlined">
            search
            </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][0])}</h4>
                <p>${Object.values(infoTranslations[lang][0])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
        view_list
        </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][1])}</h4>
                <p>${Object.values(infoTranslations[lang][1])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
            database
            </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][2])}</h4>
                <p>${Object.values(infoTranslations[lang][2])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
        warning
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
