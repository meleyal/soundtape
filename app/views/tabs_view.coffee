# The **TabsView** renders the tab subviews and handles switching between them.

module.exports = class TabsView extends Backbone.View

  # Set the CSS class.
  className: 'tabs'

  # Render the subviews into the DOM.
  render: ->
    @$el
      .append(app.playlistsView.render().el)
      .append(app.soundNewView.render().el)
      .append(app.playlistNewView.render().el)
    this

  # Switch to the selected tab (called from `BannerView`).
  switchTo: (tab) ->
    @$('.tab').hide()
    switch tab
      when 'show-playlists'
        @$('.playlists').show()
      when 'add-playlist'
        @$('.playlist-new').show().find('input').first().focus()
      when 'add-sound'
        @$('.sound-new').show().find('input').focus()
