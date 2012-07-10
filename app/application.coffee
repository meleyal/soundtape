# Require all the things
Router = require 'lib/router'
Playlists = require 'models/playlists'
Sounds = require 'models/sounds'
PlaylistsView = require 'views/playlists_view'
PlaylistNewView = require 'views/playlist_new_view'
WelcomeView = require 'views/welcome_view'
BannerView = require 'views/banner_view'
TabsView = require 'views/tabs_view'
SoundsView = require 'views/sounds_view'
SoundNewView = require 'views/sound_new_view'

# Application bootstrapper
module.exports = class Application

  apiKey: '76fc7439611dfed3405d099962c576d7'

  # Kick off the app on document ready
  constructor: ->
    $ =>
      @initialize()
      Backbone.history.start pushState:true

  # Create the initial moving parts
  initialize: ->
    SC.initialize client_id: @apiKey
    @router = new Router
    @playlists = new Playlists
    @sounds = new Sounds
    @welcomeView = new WelcomeView
    @bannerView = new BannerView
    @tabsView = new TabsView
    @playlistsView = new PlaylistsView
    @playlistNewView = new PlaylistNewView
    @soundsView = new SoundsView
    @soundNewView = new SoundNewView

# `window.app` acts as the mediator between classes
window.app = new Application
