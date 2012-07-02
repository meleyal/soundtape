module.exports = class PlaylistNewView extends Backbone.View

  className: 'playlist-new tab'

  template: require './templates/playlist_new'

  events:
    'submit form': 'create'

  initialize: ->
    #console.log @template

  render: =>
    @$el.html @template
    this

  show: ->
    @$el.show()

  create: (e) =>
    e.preventDefault()
    data =
      title: @$('input[name="title"]').val()
      description: @$('input[name="description"]').val()
    playlist = app.playlists.create(data)
    playlist.set(selected:true)
    @remove()
