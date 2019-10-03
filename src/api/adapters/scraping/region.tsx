import { AllHtmlEntities } from 'html-entities'

import { Region } from '../../../common/typings'
import agent from '../../agent'

const entities = new AllHtmlEntities()

export default async (id: number): Promise<Region> => {
  const $ = await agent('regionMembers', null, {id})
  return {
    ...JSON.parse(
      entities.decode(
        $('div#vue-memberlist')
        .attr('data-vue-props')
      )
    ),
    admins:
      $('#admin-list li a')
      .map(({}, el) => parseInt($(el).attr('href').replace(/\D/g, '')))
      .get(),

    stats:
      $('.welcome_quick_link').text().match(/\d+/g).map(num => parseInt(num)),

    saved:
      $('.user_display_name').text().match(/\d+/g).map(num => parseInt(num))
  }
}