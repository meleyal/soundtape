SoundsView = require '../views/sounds_view'
SoundNewView = require '../views/sound_new_view'

module.exports = class Router extends Backbone.Router

  routes:
    '': 'index'

  index: ->
    $('#content').append app.bannerView.render().el
    $('#content').append app.tabsView.render().el
    $('#content').append app.soundsView.render().el

    app.playlists.fetch()
    if app.playlists.length > 0
      app.playlists.clearSelection()
      app.playlists.last().set selected:true
      #if app.playlists.current().sounds.length < 1
        #app.soundsView.new()
    else
      $('#content').append app.welcomeView.render().el
