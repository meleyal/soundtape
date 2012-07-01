module.exports = class SoundView extends Backbone.View

  className: 'sound'

  template: require './templates/sound'

  render: (model) ->
    @model = model
    @$el.html @template({ model })
    this
