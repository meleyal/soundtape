module.exports = class WelcomeView extends Backbone.View

  className: 'welcome'

  template: require './templates/welcome'

  events:
    'submit form': 'create'

  initialize: ->

  render: ->
    @$el.html @template
    this

  create: (e) =>
    e.preventDefault()
    data =
      title: @$('input[name="title"]').val()
      description: @$('input[name="description"]').val()
    model = app.playlists.create(data)
    model.set selected:true
    @remove()
