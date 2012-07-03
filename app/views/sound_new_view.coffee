module.exports = class SoundNewView extends Backbone.View

  className: 'sound-new tab'

  template: require './templates/sound_new'

  apiUrl: 'http://soundcloud.com/oembed'

  events:
    'submit form': 'create'

  initialize: ->

  render: =>
    @$el.html @template
    this

  show: ->
    @$el.show()

  hide: ->
    @$('form')[0].reset()
    @$el.hide()

  create: (e) =>
    @playlist = app.playlists.current()
    e.preventDefault()
    url = @$('input[name="url"]').val()
    options = $.param { url: url, show_comments: false }
    req = $.getJSON "#{@apiUrl}?#{options}"
    req.success (data) =>
      _.extend data, { url, playlist_id: @playlist.id }
      sound = @playlist.sounds.create(data)
      # TODO: refactor this, views should bind to add event
      app.soundsView.addOne(sound)
      app.bannerView.deactivateNav()
      @hide()
