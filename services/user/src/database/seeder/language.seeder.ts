import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Languages } from 'src/languages/languages.entity';

export class LanguageSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const languages = [
      {
        code: 'aa',
        name: 'Afar',
      },
      {
        code: 'ab',
        name: 'Abkhaz',
      },
      {
        code: 'ae',
        name: 'Avestan',
      },
      {
        code: 'af',
        name: 'Afrikaans',
      },
      {
        code: 'ak',
        name: 'Akan',
      },
      {
        code: 'am',
        name: 'Amharic',
      },
      {
        code: 'an',
        name: 'Aragonese',
      },
      {
        code: 'ar',
        name: 'Arabic',
      },
      {
        code: 'as',
        name: 'Assamese',
      },
      {
        code: 'av',
        name: 'Avaric',
      },
      {
        code: 'ay',
        name: 'Aymara',
      },
      {
        code: 'az',
        name: 'Azerbaijani',
      },
      {
        code: 'ba',
        name: 'Bashkir',
      },
      {
        code: 'be',
        name: 'Belarusian',
      },
      {
        code: 'bg',
        name: 'Bulgarian',
      },
      {
        code: 'bh',
        name: 'Bihari',
      },
      {
        code: 'bi',
        name: 'Bislama',
      },
      {
        code: 'bm',
        name: 'Bambara',
      },
      {
        code: 'bn',
        name: 'Bengali, Bangla',
      },
      {
        code: 'bo',
        name: 'Tibetan Standard, Tibetan, Central',
      },
      {
        code: 'br',
        name: 'Breton',
      },
      {
        code: 'bs',
        name: 'Bosnian',
      },
      {
        code: 'ca',
        name: 'Catalan',
      },
      {
        code: 'ce',
        name: 'Chechen',
      },
      {
        code: 'ch',
        name: 'Chamorro',
      },
      {
        code: 'co',
        name: 'Corsican',
      },
      {
        code: 'cr',
        name: 'Cree',
      },
      {
        code: 'cs',
        name: 'Czech',
      },
      {
        code: 'cu',
        name: 'Old Church Slavonic, Church Slavonic, Old Bulgarian',
      },
      {
        code: 'cv',
        name: 'Chuvash',
      },
      {
        code: 'cy',
        name: 'Welsh',
      },
      {
        code: 'da',
        name: 'Danish',
      },
      {
        code: 'de',
        name: 'German',
      },
      {
        code: 'dv',
        name: 'Divehi, Dhivehi, Maldivian',
      },
      {
        code: 'dz',
        name: 'Dzongkha',
      },
      {
        code: 'ee',
        name: 'Ewe',
      },
      {
        code: 'el',
        name: 'Greek (modern)',
      },
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'eo',
        name: 'Esperanto',
      },
      {
        code: 'es',
        name: 'Spanish',
      },
      {
        code: 'et',
        name: 'Estonian',
      },
      {
        code: 'eu',
        name: 'Basque',
      },
      {
        code: 'fa',
        name: 'Persian (Farsi)',
      },
      {
        code: 'ff',
        name: 'Fula, Fulah, Pulaar, Pular',
      },
      {
        code: 'fi',
        name: 'Finnish',
      },
      {
        code: 'fj',
        name: 'Fijian',
      },
      {
        code: 'fo',
        name: 'Faroese',
      },
      {
        code: 'fr',
        name: 'French',
      },
      {
        code: 'fy',
        name: 'Western Frisian',
      },
      {
        code: 'ga',
        name: 'Irish',
      },
      {
        code: 'gd',
        name: 'Scottish Gaelic, Gaelic',
      },
      {
        code: 'gl',
        name: 'Galician',
      },
      {
        code: 'gn',
        name: 'Guaraní',
      },
      {
        code: 'gu',
        name: 'Gujarati',
      },
      {
        code: 'gv',
        name: 'Manx',
      },
      {
        code: 'ha',
        name: 'Hausa',
      },
      {
        code: 'he',
        name: 'Hebrew',
      },
      {
        code: 'hi',
        name: 'Hindi',
      },
      {
        code: 'ho',
        name: 'Hiri Motu',
      },
      {
        code: 'hr',
        name: 'Croatian',
      },
      {
        code: 'ht',
        name: 'Haitian, Haitian Creole',
      },
      {
        code: 'hu',
        name: 'Hungarian',
      },
      {
        code: 'hy',
        name: 'Armenian',
      },
      {
        code: 'hz',
        name: 'Herero',
      },
      {
        code: 'ia',
        name: 'Interlingua',
      },
      {
        code: 'id',
        name: 'Indonesian',
      },
      {
        code: 'ie',
        name: 'Interlingue',
      },
      {
        code: 'ig',
        name: 'Igbo',
      },
      {
        code: 'ii',
        name: 'Nuosu',
      },
      {
        code: 'ik',
        name: 'Inupiaq',
      },
      {
        code: 'io',
        name: 'Ido',
      },
      {
        code: 'is',
        name: 'Icelandic',
      },
      {
        code: 'it',
        name: 'Italian',
      },
      {
        code: 'iu',
        name: 'Inuktitut',
      },
      {
        code: 'ja',
        name: 'Japanese',
      },
      {
        code: 'jv',
        name: 'Javanese',
      },
      {
        code: 'ka',
        name: 'Georgian',
      },
      {
        code: 'kg',
        name: 'Kongo',
      },
      {
        code: 'ki',
        name: 'Kikuyu, Gikuyu',
      },
      {
        code: 'kj',
        name: 'Kwanyama, Kuanyama',
      },
      {
        code: 'kk',
        name: 'Kazakh',
      },
      {
        code: 'kl',
        name: 'Kalaallisut, Greenlandic',
      },
      {
        code: 'km',
        name: 'Khmer',
      },
      {
        code: 'kn',
        name: 'Kannada',
      },
      {
        code: 'ko',
        name: 'Korean',
      },
      {
        code: 'kr',
        name: 'Kanuri',
      },
      {
        code: 'ks',
        name: 'Kashmiri',
      },
      {
        code: 'ku',
        name: 'Kurdish',
      },
      {
        code: 'kv',
        name: 'Komi',
      },
      {
        code: 'kw',
        name: 'Cornish',
      },
      {
        code: 'ky',
        name: 'Kyrgyz',
      },
      {
        code: 'la',
        name: 'Latin',
      },
      {
        code: 'lb',
        name: 'Luxembourgish, Letzeburgesch',
      },
      {
        code: 'lg',
        name: 'Ganda',
      },
      {
        code: 'li',
        name: 'Limburgish, Limburgan, Limburger',
      },
      {
        code: 'ln',
        name: 'Lingala',
      },
      {
        code: 'lo',
        name: 'Lao',
      },
      {
        code: 'lt',
        name: 'Lithuanian',
      },
      {
        code: 'lu',
        name: 'Luba-Katanga',
      },
      {
        code: 'lv',
        name: 'Latvian',
      },
      {
        code: 'mg',
        name: 'Malagasy',
      },
      {
        code: 'mh',
        name: 'Marshallese',
      },
      {
        code: 'mi',
        name: 'Māori',
      },
      {
        code: 'mk',
        name: 'Macedonian',
      },
      {
        code: 'ml',
        name: 'Malayalam',
      },
      {
        code: 'mn',
        name: 'Mongolian',
      },
      {
        code: 'mr',
        name: 'Marathi (Marāṭhī)',
      },
      {
        code: 'ms',
        name: 'Malay',
      },
      {
        code: 'mt',
        name: 'Maltese',
      },
      {
        code: 'my',
        name: 'Burmese',
      },
      {
        code: 'na',
        name: 'Nauruan',
      },
      {
        code: 'nb',
        name: 'Norwegian Bokmål',
      },
      {
        code: 'nd',
        name: 'Northern Ndebele',
      },
      {
        code: 'ne',
        name: 'Nepali',
      },
      {
        code: 'ng',
        name: 'Ndonga',
      },
      {
        code: 'nl',
        name: 'Dutch',
      },
      {
        code: 'nn',
        name: 'Norwegian Nynorsk',
      },
      {
        code: 'no',
        name: 'Norwegian',
      },
      {
        code: 'nr',
        name: 'Southern Ndebele',
      },
      {
        code: 'nv',
        name: 'Navajo, Navaho',
      },
      {
        code: 'ny',
        name: 'Chichewa, Chewa, Nyanja',
      },
      {
        code: 'oc',
        name: 'Occitan',
      },
      {
        code: 'oj',
        name: 'Ojibwe, Ojibwa',
      },
      {
        code: 'om',
        name: 'Oromo',
      },
      {
        code: 'or',
        name: 'Oriya',
      },
      {
        code: 'os',
        name: 'Ossetian, Ossetic',
      },
      {
        code: 'pa',
        name: '(Eastern) Punjabi',
      },
      {
        code: 'pi',
        name: 'Pāli',
      },
      {
        code: 'pl',
        name: 'Polish',
      },
      {
        code: 'ps',
        name: 'Pashto, Pushto',
      },
      {
        code: 'pt',
        name: 'Portuguese',
      },
      {
        code: 'qu',
        name: 'Quechua',
      },
      {
        code: 'rm',
        name: 'Romansh',
      },
      {
        code: 'rn',
        name: 'Kirundi',
      },
      {
        code: 'ro',
        name: 'Romanian',
      },
      {
        code: 'ru',
        name: 'Russian',
      },
      {
        code: 'rw',
        name: 'Kinyarwanda',
      },
      {
        code: 'sa',
        name: 'Sanskrit (Saṁskṛta)',
      },
      {
        code: 'sc',
        name: 'Sardinian',
      },
      {
        code: 'sd',
        name: 'Sindhi',
      },
      {
        code: 'se',
        name: 'Northern Sami',
      },
      {
        code: 'sg',
        name: 'Sango',
      },
      {
        code: 'si',
        name: 'Sinhalese, Sinhala',
      },
      {
        code: 'sk',
        name: 'Slovak',
      },
      {
        code: 'sl',
        name: 'Slovene',
      },
      {
        code: 'sm',
        name: 'Samoan',
      },
      {
        code: 'sn',
        name: 'Shona',
      },
      {
        code: 'so',
        name: 'Somali',
      },
      {
        code: 'sq',
        name: 'Albanian',
      },
      {
        code: 'sr',
        name: 'Serbian',
      },
      {
        code: 'ss',
        name: 'Swati',
      },
      {
        code: 'st',
        name: 'Southern Sotho',
      },
      {
        code: 'su',
        name: 'Sundanese',
      },
      {
        code: 'sv',
        name: 'Swedish',
      },
      {
        code: 'sw',
        name: 'Swahili',
      },
      {
        code: 'ta',
        name: 'Tamil',
      },
      {
        code: 'te',
        name: 'Telugu',
      },
      {
        code: 'tg',
        name: 'Tajik',
      },
      {
        code: 'th',
        name: 'Thai',
      },
      {
        code: 'ti',
        name: 'Tigrinya',
      },
      {
        code: 'tk',
        name: 'Turkmen',
      },
      {
        code: 'tl',
        name: 'Tagalog',
      },
      {
        code: 'tn',
        name: 'Tswana',
      },
      {
        code: 'to',
        name: 'Tonga (Tonga Islands)',
      },
      {
        code: 'tr',
        name: 'Turkish',
      },
      {
        code: 'ts',
        name: 'Tsonga',
      },
      {
        code: 'tt',
        name: 'Tatar',
      },
      {
        code: 'tw',
        name: 'Twi',
      },
      {
        code: 'ty',
        name: 'Tahitian',
      },
      {
        code: 'ug',
        name: 'Uyghur',
      },
      {
        code: 'uk',
        name: 'Ukrainian',
      },
      {
        code: 'ur',
        name: 'Urdu',
      },
      {
        code: 'uz',
        name: 'Uzbek',
      },
      {
        code: 've',
        name: 'Venda',
      },
      {
        code: 'vi',
        name: 'Vietnamese',
      },
      {
        code: 'vo',
        name: 'Volapük',
      },
      {
        code: 'wa',
        name: 'Walloon',
      },
      {
        code: 'wo',
        name: 'Wolof',
      },
      {
        code: 'xh',
        name: 'Xhosa',
      },
      {
        code: 'yi',
        name: 'Yiddish',
      },
      {
        code: 'yo',
        name: 'Yoruba',
      },
      {
        code: 'za',
        name: 'Zhuang, Chuang',
      },
      {
        code: 'zh',
        name: 'Chinese',
      },
      {
        code: 'zu',
        name: 'Zulu',
      },
    ];

    const existingLanguages = await em.findAll(Languages);

    for (const language of languages) {
      if (
        !existingLanguages.some((existing) => existing.code === language.code)
      ) {
        const languageEntity = new Languages(language);
        await em.persistAndFlush(languageEntity);
      }
    }
  }
}
