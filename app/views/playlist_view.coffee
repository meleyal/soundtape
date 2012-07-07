# The **PlaylistView** renders and handles selecting a single playlist.

module.exports = class PlaylistView extends Backbone.View

  # Set the CSS class.
  className: 'playlist'

  # Cache the template.
  template: require './templates/playlist'

  # Handle click event.
  events:
    'click': 'select'

  # Render the playlist model into the DOM
  # and set the background color.
  render: (@model) ->
    @$el.html @template({ model })
    @$el.css backgroundColor: model.get('color')
    this

  # Select the playlist by settings its model attribute.
  select: (e) =>
    e.preventDefault()
    @model.set selected:true
