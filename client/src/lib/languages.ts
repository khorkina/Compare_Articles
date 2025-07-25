export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

// Complete Wikipedia languages list - all 270+ languages supported by Wikipedia
export const SUPPORTED_LANGUAGES: Language[] = [
  // Major Languages
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  
  // Popular European Languages
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Slovenščina' },
  { code: 'et', name: 'Estonian', nativeName: 'Eesti' },
  { code: 'lv', name: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'is', name: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge' },
  { code: 'cy', name: 'Welsh', nativeName: 'Cymraeg' },
  { code: 'mt', name: 'Maltese', nativeName: 'Malti' },
  { code: 'eu', name: 'Basque', nativeName: 'Euskera' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català' },
  { code: 'gl', name: 'Galician', nativeName: 'Galego' },
  { code: 'be', name: 'Belarusian', nativeName: 'Беларуская' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Македонски' },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip' },
  { code: 'bs', name: 'Bosnian', nativeName: 'Bosanski' },
  
  // Asian Languages
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமিழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', name: 'Lao', nativeName: 'ລາວ' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргызча' },
  { code: 'uz', name: 'Uzbek', nativeName: 'Oʻzbek' },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmen' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол' },
  
  // African Languages
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali' },
  { code: 'mg', name: 'Malagasy', nativeName: 'Malagasy' },
  
  // Other Popular Languages
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa' },
  { code: 'ceb', name: 'Cebuano', nativeName: 'Sinugboanon' },
  { code: 'war', name: 'Waray', nativeName: 'Winaray' },
  { code: 'min', name: 'Minangkabau', nativeName: 'Minangkabau' },
  { code: 'sh', name: 'Serbo-Croatian', nativeName: 'Srpskohrvatski' },
  { code: 'simple', name: 'Simple English', nativeName: 'Simple English' },
  
  // Additional Languages
  { code: 'ace', name: 'Acehnese', nativeName: 'Acèh' },
  { code: 'ady', name: 'Adyghe', nativeName: 'Адыгэбзэ' },
  { code: 'an', name: 'Aragonese', nativeName: 'Aragonés' },
  { code: 'arc', name: 'Aramaic', nativeName: 'ܐܪܡܝܐ' },
  { code: 'arz', name: 'Egyptian Arabic', nativeName: 'مصرى' },
  { code: 'ast', name: 'Asturian', nativeName: 'Asturianu' },
  { code: 'av', name: 'Avar', nativeName: 'Авар' },
  { code: 'ay', name: 'Aymara', nativeName: 'Aymar aru' },
  { code: 'ba', name: 'Bashkir', nativeName: 'Башҡортса' },
  { code: 'bar', name: 'Bavarian', nativeName: 'Boarisch' },
  { code: 'bcl', name: 'Bikol Central', nativeName: 'Bikol Central' },
  { code: 'bh', name: 'Bihari', nativeName: 'भोजपुरी' },
  { code: 'bi', name: 'Bislama', nativeName: 'Bislama' },
  { code: 'bm', name: 'Bambara', nativeName: 'Bamanankan' },
  { code: 'bo', name: 'Tibetan', nativeName: 'བོད་ཡིག' },
  { code: 'bpy', name: 'Bishnupriya', nativeName: 'বিষ্ণুপ্রিয়া মণিপুরী' },
  { code: 'br', name: 'Breton', nativeName: 'Brezhoneg' },
  { code: 'bxr', name: 'Buryat', nativeName: 'Буряад' },
  { code: 'ce', name: 'Chechen', nativeName: 'Нохчийн' },
  { code: 'ch', name: 'Chamorro', nativeName: 'Chamoru' },
  { code: 'chy', name: 'Cheyenne', nativeName: 'Tsėhésenėstsestotse' },
  { code: 'ckb', name: 'Sorani Kurdish', nativeName: 'کوردی' },
  { code: 'co', name: 'Corsican', nativeName: 'Corsu' },
  { code: 'cr', name: 'Cree', nativeName: 'Nehiyawewin' },
  { code: 'crh', name: 'Crimean Tatar', nativeName: 'Qırımtatarca' },
  { code: 'cu', name: 'Church Slavonic', nativeName: 'словѣньскъ' },
  { code: 'cv', name: 'Chuvash', nativeName: 'Чӑвашла' },
  { code: 'diq', name: 'Zazaki', nativeName: 'Zazaki' },
  { code: 'dsb', name: 'Lower Sorbian', nativeName: 'Dolnoserbski' },
  { code: 'dv', name: 'Divehi', nativeName: 'ދިވެހިބަސް' },
  { code: 'dz', name: 'Dzongkha', nativeName: 'རྫོང་ཁ' },
  { code: 'ee', name: 'Ewe', nativeName: 'Eʋegbe' },
  { code: 'ext', name: 'Extremaduran', nativeName: 'Estremeñu' },
  { code: 'ff', name: 'Fulah', nativeName: 'Fulfulde' },
  { code: 'fiu-vro', name: 'Võro', nativeName: 'Võro' },
  { code: 'fj', name: 'Fijian', nativeName: 'Vosa Vakaviti' },
  { code: 'fo', name: 'Faroese', nativeName: 'Føroyskt' },
  { code: 'frp', name: 'Franco-Provençal', nativeName: 'Arpetan' },
  { code: 'frr', name: 'Northern Frisian', nativeName: 'Nordfriisk' },
  { code: 'fur', name: 'Friulian', nativeName: 'Furlan' },
  { code: 'fy', name: 'West Frisian', nativeName: 'Frysk' },
  { code: 'gag', name: 'Gagauz', nativeName: 'Gagauz' },
  { code: 'gan', name: 'Gan Chinese', nativeName: '贛語' },
  { code: 'gd', name: 'Scottish Gaelic', nativeName: 'Gàidhlig' },
  { code: 'glk', name: 'Gilaki', nativeName: 'گیلکی' },
  { code: 'gn', name: 'Guarani', nativeName: 'Avañeẽ' },
  { code: 'gom', name: 'Goan Konkani', nativeName: 'गोंयची कोंकणी' },
  { code: 'got', name: 'Gothic', nativeName: '𐌲𐌿𐍄𐌹𐍃𐌺' },
  { code: 'gv', name: 'Manx', nativeName: 'Gaelg' },
  { code: 'hak', name: 'Hakka Chinese', nativeName: '客家語' },
  { code: 'haw', name: 'Hawaiian', nativeName: 'Hawaiʻi' },
  { code: 'hif', name: 'Fiji Hindi', nativeName: 'फ़िजी हिन्दी' },
  { code: 'ho', name: 'Hiri Motu', nativeName: 'Hiri Motu' },
  { code: 'hsb', name: 'Upper Sorbian', nativeName: 'Hornjoserbsce' },
  { code: 'ht', name: 'Haitian Creole', nativeName: 'Kreyòl ayisyen' },
  { code: 'ia', name: 'Interlingua', nativeName: 'Interlingua' },
  { code: 'ie', name: 'Interlingue', nativeName: 'Interlingue' },
  { code: 'ik', name: 'Inupiaq', nativeName: 'Iñupiaq' },
  { code: 'ilo', name: 'Iloko', nativeName: 'Ilokano' },
  { code: 'io', name: 'Ido', nativeName: 'Ido' },
  { code: 'iu', name: 'Inuktitut', nativeName: 'ᐃᓄᒃᑎᑐᑦ' },
  { code: 'jbo', name: 'Lojban', nativeName: 'Lojban' },
  { code: 'kaa', name: 'Karakalpak', nativeName: 'Qaraqalpaqsha' },
  { code: 'kab', name: 'Kabyle', nativeName: 'Taqbaylit' },
  { code: 'kbd', name: 'Kabardian', nativeName: 'Адыгэбзэ' },
  { code: 'kg', name: 'Kongo', nativeName: 'KiKongo' },
  { code: 'ki', name: 'Kikuyu', nativeName: 'Gĩkũyũ' },
  { code: 'kj', name: 'Kuanyama', nativeName: 'Kuanyama' },
  { code: 'kl', name: 'Kalaallisut', nativeName: 'Kalaallisut' },
  { code: 'kom', name: 'Komi', nativeName: 'Коми' },
  { code: 'krc', name: 'Karachay-Balkar', nativeName: 'Къарачай-малкъар' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'कश्मीरी' },
  { code: 'ksh', name: 'Colognian', nativeName: 'Ripoarisch' },
  { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî' },
  { code: 'kv', name: 'Komi', nativeName: 'Коми' },
  { code: 'kw', name: 'Cornish', nativeName: 'Kernowek' },
  { code: 'la', name: 'Latin', nativeName: 'Latina' },
  { code: 'lad', name: 'Ladino', nativeName: 'Ladino' },
  { code: 'lb', name: 'Luxembourgish', nativeName: 'Lëtzebuergesch' },
  { code: 'lbe', name: 'Lak', nativeName: 'Лакку' },
  { code: 'lez', name: 'Lezghian', nativeName: 'Лезги' },
  { code: 'li', name: 'Limburgish', nativeName: 'Limburgs' },
  { code: 'lij', name: 'Ligurian', nativeName: 'Ligure' },
  { code: 'lmo', name: 'Lombard', nativeName: 'Lumbaart' },
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála' },
  { code: 'lrc', name: 'Northern Luri', nativeName: 'لۊری شومالی' },
  { code: 'ltg', name: 'Latgalian', nativeName: 'Latgaļu' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'map-bms', name: 'Basa Banyumasan', nativeName: 'Basa Banyumasan' },
  { code: 'mdf', name: 'Moksha', nativeName: 'Мокшень' },
  { code: 'mhr', name: 'Eastern Mari', nativeName: 'Олык марий' },
  { code: 'mi', name: 'Māori', nativeName: 'Māori' },
  { code: 'mwl', name: 'Mirandese', nativeName: 'Mirandés' },
  { code: 'myv', name: 'Erzya', nativeName: 'Эрзянь' },
  { code: 'mzn', name: 'Mazanderani', nativeName: 'مازِرونی' },
  { code: 'na', name: 'Nauru', nativeName: 'Dorerin Naoero' },
  { code: 'nah', name: 'Nahuatl', nativeName: 'Nāhuatl' },
  { code: 'nap', name: 'Neapolitan', nativeName: 'Napulitano' },
  { code: 'nds', name: 'Low German', nativeName: 'Plattdüütsch' },
  { code: 'nds-nl', name: 'Low Saxon', nativeName: 'Nedersaksies' },
  { code: 'new', name: 'Newari', nativeName: 'नेपाल भाषा' },
  { code: 'ng', name: 'Ndonga', nativeName: 'Owambo' },
  { code: 'nn', name: 'Norwegian Nynorsk', nativeName: 'Norsk nynorsk' },
  { code: 'nov', name: 'Novial', nativeName: 'Novial' },
  { code: 'nrm', name: 'Norman', nativeName: 'Nouormand' },
  { code: 'nso', name: 'Northern Sotho', nativeName: 'Sesotho sa Leboa' },
  { code: 'nv', name: 'Navajo', nativeName: 'Diné bizaad' },
  { code: 'ny', name: 'Chichewa', nativeName: 'Chi-Chewa' },
  { code: 'oc', name: 'Occitan', nativeName: 'Occitan' },
  { code: 'om', name: 'Oromo', nativeName: 'Oromoo' },
  { code: 'os', name: 'Ossetian', nativeName: 'Ирон' },
  { code: 'pag', name: 'Pangasinan', nativeName: 'Pangasinan' },
  { code: 'pam', name: 'Pampanga', nativeName: 'Kapampangan' },
  { code: 'pap', name: 'Papiamento', nativeName: 'Papiamentu' },
  { code: 'pcd', name: 'Picard', nativeName: 'Picard' },
  { code: 'pdc', name: 'Pennsylvania German', nativeName: 'Deitsch' },
  { code: 'pfl', name: 'Palatine German', nativeName: 'Pälzisch' },
  { code: 'pi', name: 'Pali', nativeName: 'पाऴि' },
  { code: 'pih', name: 'Norfuk', nativeName: 'Norfuk' },
  { code: 'pms', name: 'Piedmontese', nativeName: 'Piemontèis' },
  { code: 'pnb', name: 'Western Punjabi', nativeName: 'پنجابی' },
  { code: 'pnt', name: 'Pontic', nativeName: 'Ποντιακά' },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو' },
  { code: 'qu', name: 'Quechua', nativeName: 'Runa Simi' },
  { code: 'rm', name: 'Romansh', nativeName: 'Rumantsch' },
  { code: 'rmy', name: 'Romani', nativeName: 'Romani' },
  { code: 'rn', name: 'Rundi', nativeName: 'Kirundi' },
  { code: 'roa-rup', name: 'Aromanian', nativeName: 'Armãneashti' },
  { code: 'roa-tara', name: 'Tarantino', nativeName: 'Tarandíne' },
  { code: 'rue', name: 'Rusyn', nativeName: 'Русиньскый' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Kinyarwanda' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
  { code: 'sah', name: 'Sakha', nativeName: 'Саха тыла' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'sc', name: 'Sardinian', nativeName: 'Sardu' },
  { code: 'scn', name: 'Sicilian', nativeName: 'Sicilianu' },
  { code: 'sco', name: 'Scots', nativeName: 'Scots' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'se', name: 'Northern Sami', nativeName: 'Sámegiella' },
  { code: 'sg', name: 'Sango', nativeName: 'Sängö' },
  { code: 'sgs', name: 'Samogitian', nativeName: 'Žemaitėška' },
  { code: 'shn', name: 'Shan', nativeName: 'လိၵ်ႈတႆး' },
  { code: 'sn', name: 'Shona', nativeName: 'chiShona' },
  { code: 'srn', name: 'Sranan Tongo', nativeName: 'Sranantongo' },
  { code: 'ss', name: 'Swati', nativeName: 'SiSwati' },
  { code: 'st', name: 'Southern Sotho', nativeName: 'Sesotho' },
  { code: 'stq', name: 'Saterland Frisian', nativeName: 'Seeltersk' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda' },
  { code: 'szl', name: 'Silesian', nativeName: 'Ślōnski' },
  { code: 'tet', name: 'Tetum', nativeName: 'Tetun' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ' },
  { code: 'tn', name: 'Tswana', nativeName: 'Setswana' },
  { code: 'to', name: 'Tongan', nativeName: 'faka Tonga' },
  { code: 'tpi', name: 'Tok Pisin', nativeName: 'Tok Pisin' },
  { code: 'ts', name: 'Tsonga', nativeName: 'Xitsonga' },
  { code: 'tt', name: 'Tatar', nativeName: 'Татарча' },
  { code: 'tum', name: 'Tumbuka', nativeName: 'chiTumbuka' },
  { code: 'tw', name: 'Twi', nativeName: 'Twi' },
  { code: 'ty', name: 'Tahitian', nativeName: 'Reo Tahiti' },
  { code: 'tyv', name: 'Tuvan', nativeName: 'Тыва дыл' },
  { code: 'udm', name: 'Udmurt', nativeName: 'Удмурт' },
  { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە' },
  { code: 've', name: 'Venda', nativeName: 'Tshivenda' },
  { code: 'vec', name: 'Venetian', nativeName: 'Vèneto' },
  { code: 'vep', name: 'Veps', nativeName: 'Vepsän kel' },
  { code: 'vls', name: 'West Flemish', nativeName: 'West-Vlams' },
  { code: 'vo', name: 'Volapük', nativeName: 'Volapük' },
  { code: 'wa', name: 'Walloon', nativeName: 'Walon' },
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof' },
  { code: 'wuu', name: 'Wu Chinese', nativeName: '吴语' },
  { code: 'xal', name: 'Kalmyk', nativeName: 'Хальмг' },
  { code: 'xmf', name: 'Mingrelian', nativeName: 'მარგალური' },
  { code: 'yi', name: 'Yiddish', nativeName: 'ייִדיש' },
  { code: 'za', name: 'Zhuang', nativeName: 'Vahcuengh' },
  { code: 'zea', name: 'Zeelandic', nativeName: 'Zeêuws' },
  { code: 'zh-classical', name: 'Classical Chinese', nativeName: '文言' },
  { code: 'zh-min-nan', name: 'Min Nan Chinese', nativeName: 'Bân-lâm-gú' },
  { code: 'zh-yue', name: 'Cantonese', nativeName: '粵語' }
];

export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

export function getLanguageName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.name : code;
}

export function getLanguageNativeName(code: string): string {
  const lang = getLanguageByCode(code);
  return lang ? lang.nativeName : code;
}

// Helper function to get popular languages sorted by usage
export function getPopularLanguages(): Language[] {
  const popularCodes = [
    'en', 'es', 'fr', 'de', 'ru', 'zh', 'ja', 'ar', 'pt', 'it',
    'ko', 'hi', 'tr', 'pl', 'nl', 'sv', 'da', 'no', 'fi', 'cs',
    'hu', 'ro', 'uk', 'he', 'el', 'bg', 'hr', 'sr', 'sk', 'sl'
  ];
  
  return popularCodes.map(code => getLanguageByCode(code)!).filter(Boolean);
}

// Helper function to search languages by name or native name
export function searchLanguages(query: string): Language[] {
  const normalizedQuery = query.toLowerCase();
  return SUPPORTED_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(normalizedQuery) ||
    lang.nativeName.toLowerCase().includes(normalizedQuery) ||
    lang.code.toLowerCase().includes(normalizedQuery)
  );
}