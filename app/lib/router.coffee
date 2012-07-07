module.exports = class Router extends Backbone.Router

  routes:
    '': 'index'
    '*all': 'redirect'

  # The index action handles rendering the initial views.
  # New users see a welcome screen, existing users see their
  # last selected playlist (saved in a cookie).
  index: ->
    $('#content')
      .append(app.bannerView.render().el)
      .append(app.tabsView.render().el)
      .append(app.soundsView.render().el)

    app.playlists.fetch()

    if app.playlists.length > 0
      if savedPlaylist = _.cookie 'playlist'
        app.playlists.get(savedPlaylist).set selected:true
      else
        app.playlists.first().set selected:true
    else
      $('#content').append app.welcomeView.render().el

  # Nginx redirects all requests to index.html.
  # Here we catch any routes triggered on the client
  # and redirect them to the index action.
  redirect: ->
    @navigate ''
