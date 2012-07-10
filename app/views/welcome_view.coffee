# The **WelcomeView** is show to new users, inviting them
# to create their first playlist.

module.exports = class WelcomeView extends Backbone.View

  # Set the CSS class.
  className: 'welcome'

  # Cache the template.
  template: require './templates/welcome'

  # Handle the form submit event.
  events:
    'submit form': 'create'

  # Render the form into the DOM.
  render: ->
    @$el.html @template
    this

  # Create a new playlist using the form values
  # if they pass some basic validation.
  create: (e) =>
    e.preventDefault()
    data =
      title: @$('input[name="title"]').val()
      description: @$('input[name="description"]').val()
    unless data.title is ""
      model = app.playlists.create(data)
      model.set selected:true
      @remove()
