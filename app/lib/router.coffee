SoundsView = require '../views/sounds_view'
SoundNewView = require '../views/sound_new_view'

module.exports = class Router extends Backbone.Router

  routes:
    '': 'index'
    '*all': 'redirect'

  index: ->
    $('#content').append app.bannerView.render().el
    $('#content').append app.tabsView.render().el
    $('#content').append app.soundsView.render().el

    app.playlists.fetch()

    if app.playlists.length > 0
      if savedPlaylist = _.cookie 'playlist'
        app.playlists.get(savedPlaylist).set selected:true
      else
        app.playlists.first().set selected:true
    else
      $('#content').append app.welcomeView.render().el

  redirect: ->
    @navigate ''
