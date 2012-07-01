module.exports = class TabsView extends Backbone.View

  className: 'tabs'

  initialize: ->

  render: ->
    @$el.append app.playlistsView.render().el
    @$el.append app.soundNewView.render().el
    @$el.append app.playlistNewView.render().el
    this

  switchTo: (tab) ->
    @$('.tab').hide()
    switch tab
      when 'show-playlists' then @$('.playlists').show()
      when 'add-playlist' then @$('.playlist-new').show()
      when 'add-sound' then @$('.sound-new').show()
