export default [
  {id: 1, de: 'Ist zu spät zum Abholen gekommen', en: 'Came too late to an arranged pick-up'},
  {id: 2, de: 'Ist gar nicht zum Abholen gekommen', en: 'Did not appear to an arranged pick-up'},
  {id: 3, de: 'Hat sich unhöflich oder respektlos verhalten', en: 'Behaved rudely or disrespectfully', children: [
    {id: 1, de: 'gegenüber Foodsavern', en: 'to foodsavers'},
    {id: 2, de: 'gegenüber BetriebsmitarbeiterInnen', en: 'to store employees'},
    {id: 3, children: [
      {id: 1, de: 'beleidigende Äußerungen', en: 'offensive comments'},
      {id: 2, de: 'rassistische Äußerungen', en: 'racist remarks'},
      {id: 3, de: 'sexistische Äußerungen', en: 'sexist expressions'},
      {id: 4, de: 'homophobe Äußerungen', en: 'homophobic remarks'},
      {id: 5, de: 'Gewalttätigkeit und Drohung', en: 'violence and threat'},
      {id: 6, de: 'Andere unangebrachte Äußerungen und Verhalten', en: 'other inappropriate remarks and behaviour'}
    ]}
  ]},
  {id: 4, de: 'Hat den Abholort nicht sauber hinterlassen', en: 'Didn\'t leave the pickup location clean'},
  {id: 5, de: 'Hat sich nicht gemeinschaftlich und sozial beim Abholen verhalten', en: 'Has not behaved in a communal and social way during the collection', children: [
    {id: 1, de: 'vor BetriebsmitarbeiterInnen', en: 'in front of store employees'},
    {id: 2, de: 'vor Foodsavern', en: 'in front of foodsavers'},
    {id: 3, de: 'vor Kunden', en: 'in front of store customers'}
  ]},
  {id: 6, de: 'Hat sich fordernd/übergriffig verhalten', en: 'Has behaved in a demanding or overbearing manner', children: [
    {id: 1, de: 'gegenüber BetriebsmitarbeiterInnen', en: 'to employees of the store'},
    {id: 2, de: 'gegenüber Foodsavern', en: 'to foodsavers'},
    {id: 3, de: 'gegenüber Kunden', en: 'to customers of the store'}
  ]},
  {id: 7, de: 'Hat Vorwürfe gemacht', en: 'Has made accusations', children: [
    {id: 1, de: 'gegenüber BetriebsmitarbeiterInnen', en: 'against employees of the store'},
    {id: 2, de: 'gegenüber Foodsavern', en: 'against foodsavers'},
    {id: 3, de: 'gegenüber Kunden', en: 'against customers of the store'}
  ]},
  {id: 8, de: 'Hat Sachen mitgenommen die nicht für ihn/sie bestimmt waren', en: 'Took things that weren\'t meant for him/her', children: [
    {id: 1, de: 'von BetriebsmitarbeiterInnen', en: 'of employees of the store'},
    {id: 2, de: 'von Foodsavern', en: 'of foodsavers'},
    {id: 3, de: 'von Kunden', en: 'of customers of the store'}
  ]},
  {id: 9, de: 'Hat Pfandflaschen/-kisten etc. nicht zurückgebracht', en: 'Has not returned returnable bottles/crates etc.'},
  {id: 10, de: 'Häufiges kurzfristiges Absagen der Abholungen', en: 'Frequent short-term cancellations of pick-ups'},
  {id: 11, de: 'Ignoriert Kontaktaufnahme', en: 'Ignores contact approaches'},
  {id: 12, de: 'Schmeißt gerettete Lebensmittel weg', en: 'Throws away rescued food'},
  {id: 13, de: 'Nimmt nicht alle zur Abholung vorgesehenen Lebensmittel mit', en: 'Doesn\'t take with him all the food intended for collection'},
  {id: 14, de: 'Hat sich außerhalb seiner/ihrer Abholzeit beim Betrieb zu rettende Lebensmittel genommen oder nachgefragt', en: 'Has taken or inquired about food to be rescued outside the pick-up time at the store'},
  {id: 15, de: 'Verkauft gerettete Lebensmittel', en: 'Sells rescued food'},
  {id: 16, de: 'Hat gegen andere Verhaltensregeln verstoßen (alles andere)', en: 'Has violated other rules of conduct (everything else)'}
]