// Read the language from the URL
let lang = window.location.href.split('?lang=')[1] ?? 'en';

// Remove anchor from the URL
if (lang) {
    lang = lang.split('#')[0];
}

let infoTranslations = {
    en: [
        { '2Usable in a local environment': 'CaseSharing can be used in a local environment, allowing doctors and nurses to save case information on their own computers. This contributes to smoother information sharing and access within the hospital, and helps to streamline medical practices.' },
        { 'Try with sample data': 'Try out the system\'s functionality with sample data to get a better understanding of its operation and the components of case information.' },
        { 'Encouraging collaboration': 'In the future, we plan to expand the system\'s capabilities to enable smoother information sharing with other systems. This will lead to increased efficiency and productivity through better collaboration.' },
        { 'Multilingual support': 'The system supports languages such as English, Japanese, Korean, and Chinese, allowing people around the world to use the system in their own language and facilitating communication with users from different regions.' }
    ],
    ja: [
        { 'ローカル環境で使える': 'CaseSharingはローカル環境で使え、医師や看護師などが症例情報を自分のコンピューターに保存できることを意味します。これにより、病院内の情報共有やアクセスがスムーズになり、医療現場の効率化に貢献します。' },
        { 'サンプルデータで試す': 'サンプルデータを用いて本システムの使用イメージをつかみましょう。本システムの操作方法や症例情報の構成要素について理解を深めることができます。' },
        { 'コラボレーションを促進': '将来、他のシステムとスムーズに情報の共有ができるように、機能を拡張する予定です。情報の共有により業務の効率化や生産性向上につながります。' },
        { '多言語化': '本システムは英語、日本語、韓国語、中国語などの言語に対応しています。これにより、世界中の人々が、自分の言語で本システムを利用できるようになり、世界各地のユーザーとのコミュニケーションもスムーズになります。' }
    ],
    ko: [
        { '로컬 환경에서 사용 가능합니다.': 'CaseSharing은 로컬 환경에서 사용할 수 있으며, 의사나 간호사 등이 증례 정보를 자신의 컴퓨터에 저장할 수 있습니다. 이로 인해 병원 내 정보 공유와 접근이 원활해지며, 의료 현장의 효율화에 기여합니다.' },
        { '샘플 데이터로 시도해 보세요.': '샘플 데이터를 이용하여 본 시스템의 사용 이미지를 파악할 수 있습니다. 본 시스템의 조작 방법이나 증례 정보의 구성 요소에 대해 이해를 깊이 드실 수 있습니다.' },
        { '협업을 촉진합니다.': '앞으로 다른 시스템과 원활하게 정보 공유가 가능하도록 기능을 확장할 예정입니다. 정보 공유를 통해 업무의 효율화와 생산성 향상에 이어집니다.' },
        { '다국어화': '본 시스템은 영어, 일본어, 한국어, 중국어 등의 언어를 지원합니다. 이를 통해 전 세계 사람들이 자신의 언어로 본 시스템을 이용할 수 있게 되어, 세계 각지의 사용자들과의 커뮤니케이션도 원활해집니다.' }
    ],
    zh: [
        { '本地环境可用': 'CaseSharing可在本地环境中使用，意味着医生、护士等可以将病例信息保存在自己的计算机上。这将使医院内的信息共享和访问更加顺畅，为医疗现场的效率提供贡献。' },
        { '使用示例数据进行尝试': '使用示例数据来了解本系统的使用情况。您可以深入了解本系统的操作方法和病例信息的组成要素。' },
        { '促进协作': '未来，我们计划扩展功能，以便与其他系统顺畅共享信息。信息共享将促进业务效率和生产力的提高。' },
        { '多语言化': '本系统支持英语、日语、韩语、中文等多种语言。这将使世界各地的人们可以使用自己的语言使用本系统，与全球用户的沟通也将更加顺畅。' }
    ],
    zhct: [
        { '本地環境可使用。': 'CaseSharing 可在本地環境中使用，醫生和護士等可以將病例信息保存在自己的計算機上。這樣一來，醫院內的信息共享和訪問將變得更加順暢，有助於提高醫療效率。CaseSharing 可在本地環境中使用，醫生和護士等可以將病例信息保存在自己的計算機上。這樣一來，醫院內的信息共享和訪問將變得更加順暢，有助於提高醫療效率。' },
        { '使用樣例數據進行試用。': '利用樣例數據來瞭解本系統的使用方法。您可以深入理解本系統的操作方法和病例信息的組成要素。' },
        { '促進協作。': '未來，我們計劃擴展功能，使其能夠與其他系統順暢共享信息。信息共享有助於提高工作效率和生產力。' },
        { '多語言化。': '本系統支持英語、日語、韓語、中文等多種語言。這樣一來，全球各地的人們都可以使用自己的語言使用本系統，與世界各地的用戶進行順暢的溝通。' }
    ]
}

let modalContent = document.getElementById('modal-info-content')
modalContent.innerHTML = `
    <ul>
        <li>
            <i class="material-symbols-outlined">
            dvr
            </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][0])}</h4>
                <p>${Object.values(infoTranslations[lang][0])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
        demography
        </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][1])}</h4>
                <p>${Object.values(infoTranslations[lang][1])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
            handshake
            </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][2])}</h4>
                <p>${Object.values(infoTranslations[lang][2])}
                </p>
            </span>
        </li>
        <li>
        <i class="material-symbols-outlined">
        keyboard_previous_language
        </i>
            <span>
                <h4>${Object.keys(infoTranslations[lang][3])}</h4>
                <p>${Object.values(infoTranslations[lang][3])}
                </p>
            </span>
        </li>
    </ul>
`