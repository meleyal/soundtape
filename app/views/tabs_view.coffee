module.exports = class TabsView extends Backbone.View

  className: 'tabs'

  render: ->
    @$el.append app.playlistsView.render().el
    @$el.append app.soundNewView.render().el
    @$el.append app.playlistNewView.render().el
    this

  switchTo: (tab) ->
    @$('.tab').hide()
    switch tab
      when 'show-playlists'
        @$('.playlists').show()
      when 'add-playlist'
        @$('.playlist-new').show().find('input').first().focus()
      when 'add-sound'
        @$('.sound-new').show().find('input').focus()
