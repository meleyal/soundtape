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

module.exports = class Application

  constructor: ->
    $ =>
      @initialize()
      console?.log 'Hire me :) http://meleyal.com'
      Backbone.history.start(pushState:true)

  initialize: ->
    @apiKey = '76fc7439611dfed3405d099962c576d7'
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

window.app = new Application
