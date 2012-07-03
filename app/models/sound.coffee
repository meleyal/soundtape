module.exports = class Sound extends Backbone.Model

  defaults:
    playing: false

  #validate: (attrs) ->
    #console.log 'validate'
    #console.log attrs.url.match('http')?
    #unless attrs.url.match('http')?
      #return 'must be a valid URL'
