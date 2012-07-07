Playlist = require '../models/playlist'

# The **BannerView** shows the currently selected playlist
# at the top of the page and handles the tab navigation.

module.exports = class BannerView extends Backbone.View

  tagName: 'header'

  className: 'banner'

  # Cache the template.
  template: require './templates/banner'

  # Handle tab click events.
  events:
    'click nav a': 'activateTab'

  # Re-render when the playlist changes.
  initialize: ->
    app.playlists.on 'change:selected', @render

  # Render the playlist model and set the background color.
  # Create a placeholder model if none is passed.
  render: (model) =>
    model ?= new Playlist color: '#F60'
    @$el.html @template { model }
    @$el.css backgroundColor: model.get('color')
    this

  # Activate a tab wen one is clicked.
  # Passes the selected tab onto the `TabView`.
  activateTab: (e) =>
    e.preventDefault()
    el = $(e.currentTarget)
    action = el.attr('data-action')
    return if el.is('.active')
    @$('nav a').removeClass('active')
    el.addClass 'active'
    app.tabsView.switchTo action

  # Helper to deactivate all tabs at once.
  deactivateTabs: (e) =>
    @$('nav a').removeClass('active')
