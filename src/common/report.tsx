export default [
  {id: 1, name: 'Ist zu spät zum Abholen gekommen'},
  {id: 2, name: 'Ist gar nicht zum Abholen gekommen'},
  {id: 3, name: 'Hat sich unhöflich oder respektlos verhalten', children: [
    {id: 1, name: 'gegenüber Foodsavern'},
    {id: 2, name: 'gegenüber BetriebsmitarbeiterInnen'},
    {id: 3, children: [
      {id: 1, name: 'beleidigende Äußerungen'},
      {id: 2, name: 'rassistische Äußerungen'},
      {id: 3, name: 'sexistische Äußerungen'},
      {id: 4, name: 'homophobe Äußerungen'},
      {id: 5, name: 'Gewalttätigkeit und Drohung'},
      {id: 6, name: 'Andere unangebrachte Äußerungen und Verhalten'}
    ]}
  ]},
  {id: 4, name: 'Hat den Abholort nicht sauber hinterlassen'},
  {id: 5, name: 'Hat sich nicht gemeinschaftlich und sozial beim Abholen verhalten', children: [
    {id: 1, name: 'vor BetriebsmitarbeiterInnen'},
    {id: 2, name: 'vor Foodsavern'},
    {id: 3, name: 'vor Kunden'}
  ]},
  {id: 6, name: 'Hat sich fordernd/übergriffig verhalten', children: [
    {id: 1, name: 'gegenüber BetriebsmitarbeiterInnen'},
    {id: 2, name: 'gegenüber Foodsavern'},
    {id: 3, name: 'gegenüber Kunden'}
  ]},
  {id: 7, name: 'Hat Vorwürfe gemacht', children: [
    {id: 1, name: 'gegenüber BetriebsmitarbeiterInnen'},
    {id: 2, name: 'gegenüber Foodsavern'},
    {id: 3, name: 'gegenüber Kunden'}
  ]},
  {id: 8, name: 'Hat Sachen mitgenommen die nicht für ihn/sie bestimmt waren', children: [
    {id: 1, name: 'von BetriebsmitarbeiterInnen'},
    {id: 2, name: 'von Foodsavern'},
    {id: 3, name: 'von Kunden'}
  ]},
  {id: 9, name: 'Hat Pfandflaschen/-kisten etc. nicht zurückgebracht'},
  {id: 10, name: 'Häufiges kurzfristiges Absagen der Abholungen'},
  {id: 11, name: 'Ignoriert Kontaktaufnahme'},
  {id: 12, name: 'Schmeißt gerettete Lebensmittel weg'},
  {id: 13, name: 'Nimmt nicht alle zur Abholung vorgesehenen Lebensmittel mit'},
  {id: 14, name: 'Hat sich außerhalb seiner/ihrer Abholzeit beim Betrieb zu rettende Lebensmittel genommen oder nachgefragt'},
  {id: 15, name: 'Verkauft gerettete Lebensmittel'},
  {id: 16, name: 'Hat gegen andere Verhaltensregeln verstoßen (alles andere)'}
]