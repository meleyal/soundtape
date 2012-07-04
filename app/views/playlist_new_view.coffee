module.exports = class PlaylistNewView extends Backbone.View

  className: 'playlist-new tab'

  template: require './templates/playlist_new'

  events:
    'submit form': 'create'

  render: =>
    @$el.html @template
    this

  hide: ->
    @$('form')[0].reset()
    @$el.hide()

  create: (e) =>
    e.preventDefault()
    data =
      title: @$('input[name="title"]').val()
      description: @$('input[name="description"]').val()
    playlist = app.playlists.create(data)
    playlist.set selected:true
    @hide()
