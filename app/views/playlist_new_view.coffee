# The **PlaylistNewView** (shown as a tab) renders a form for adding a
# new playlist and handles adding them to the `Playlists` collection.

module.exports = class PlaylistNewView extends Backbone.View

  # Set the CSS classes.
  className: 'playlist-new tab'

  # Cache the template.
  template: require './templates/playlist_new'

  # Handle the form submit event.
  events:
    'submit form': 'create'

  # Render the form into the DOM.
  render: =>
    @$el.html @template
    this

  # Helper to hide and reset the form.
  hide: ->
    @$('form')[0].reset()
    @$el.hide()

  # Create a new playlist using the form values
  # if they pass some basic validation.
  create: (e) =>
    e.preventDefault()
    data =
      title: @$('input[name="title"]').val()
      description: @$('input[name="description"]').val()
    unless data.title is ""
      playlist = app.playlists.create(data)
      playlist.set selected:true
      @hide()
