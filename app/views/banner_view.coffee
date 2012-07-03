Playlist = require '../models/playlist'

module.exports = class BannerView extends Backbone.View

  tagName: 'header'

  className: 'banner'

  template: require './templates/banner'

  events:
    'click nav a': 'onNavClick'

  initialize: ->
    app.playlists.on 'change:selected', @render

  render: (model) =>
    model ?= new Playlist color: '#F60'
    @$el.html @template { model }
    @$el.css backgroundColor: model.get('color')
    this

  onNavClick: (e) =>
    e.preventDefault()
    el = $(e.currentTarget)
    action = el.attr('data-action')
    return if el.is('.active')
    @$('nav a').removeClass('active')
    el.addClass 'active'
    app.tabsView.switchTo action

  deactivateNav: (e) =>
    @$('nav a').removeClass('active')
