module.exports = class PlaylistView extends Backbone.View

  className: 'playlist'

  template: require './templates/playlist'

  events:
    'click': 'select'

  render: (@model) ->
    @$el.html @template({ model })
    @$el.css backgroundColor: model.get('color')
    this

  select: (e) =>
    e.preventDefault()
    @model.set selected:true
