import { I18nManager } from "react-native"
import * as RNLocalize from "react-native-localize"
import i18n from "i18n-js"
import memoize from "lodash.memoize"

import moment from 'moment'
import 'moment/min/locales'

const translationGetters = {
  en: () => require("../../assets/translations/en.json"),
  de: () => require("../../assets/translations/de.json")
}

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
)

export const pickTranslation = (node: any) =>
  node[i18n.locale === 'de' ? 'de' : 'en']

const setI18nConfig = () => {
  const fallback = { languageTag: "en", isRTL: false }

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback

  translate.cache.clear();
  I18nManager.forceRTL(isRTL)

  i18n.translations = { [languageTag]: translationGetters[languageTag]() }
  i18n.locale = languageTag

  moment.locale(languageTag)
}

setI18nConfig()
RNLocalize.addEventListener("change", () => setI18nConfig())
