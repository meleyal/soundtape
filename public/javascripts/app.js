(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  var Application, BannerView, PlaylistNewView, Playlists, PlaylistsView, Router, SoundNewView, Sounds, SoundsView, TabsView, WelcomeView;

  Router = require('lib/router');

  Playlists = require('models/playlists');

  Sounds = require('models/sounds');

  PlaylistsView = require('views/playlists_view');

  PlaylistNewView = require('views/playlist_new_view');

  WelcomeView = require('views/welcome_view');

  BannerView = require('views/banner_view');

  TabsView = require('views/tabs_view');

  SoundsView = require('views/sounds_view');

  SoundNewView = require('views/sound_new_view');

  module.exports = Application = (function() {

    Application.prototype.apiKey = '76fc7439611dfed3405d099962c576d7';

    function Application() {
      var _this = this;
      $(function() {
        _this.initialize();
        Backbone.history.start({
          pushState: true
        });
        return typeof console !== "undefined" && console !== null ? console.log('Hire me :) http://meleyal.com') : void 0;
      });
    }

    Application.prototype.initialize = function() {
      SC.initialize({
        client_id: this.apiKey
      });
      this.router = new Router;
      this.playlists = new Playlists;
      this.sounds = new Sounds;
      this.welcomeView = new WelcomeView;
      this.bannerView = new BannerView;
      this.tabsView = new TabsView;
      this.playlistsView = new PlaylistsView;
      this.playlistNewView = new PlaylistNewView;
      this.soundsView = new SoundsView;
      return this.soundNewView = new SoundNewView;
    };

    return Application;

  })();

  window.app = new Application;
  
}});

window.require.define({"lib/router": function(exports, require, module) {
  var Router,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'index',
      '*all': 'redirect'
    };

    Router.prototype.index = function() {
      var savedPlaylist;
      $('#content').append(app.bannerView.render().el);
      $('#content').append(app.tabsView.render().el);
      $('#content').append(app.soundsView.render().el);
      app.playlists.fetch();
      if (app.playlists.length > 0) {
        if (savedPlaylist = _.cookie('playlist')) {
          return app.playlists.get(savedPlaylist).set({
            selected: true
          });
        } else {
          return app.playlists.first().set({
            selected: true
          });
        }
      } else {
        return $('#content').append(app.welcomeView.render().el);
      }
    };

    Router.prototype.redirect = function() {
      return this.navigate('');
    };

    return Router;

  })(Backbone.Router);
  
}});

window.require.define({"models/playlist": function(exports, require, module) {
  var Playlist, Sounds,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Sounds = require('../models/sounds');

  module.exports = Playlist = (function(_super) {

    __extends(Playlist, _super);

    function Playlist() {
      this.playNext = __bind(this.playNext, this);
      return Playlist.__super__.constructor.apply(this, arguments);
    }

    Playlist.prototype.defaults = {
      title: 'SoundTape',
      description: '',
      selected: false
    };

    Playlist.prototype.initialize = function() {
      var sounds;
      app.sounds.fetch();
      sounds = app.sounds.where({
        playlist_id: this.id
      });
      this.sounds = new Sounds(sounds);
      if (this.get('color') == null) {
        this.set('color', this.randomColor());
      }
      this.sounds.on('finished', this.playNext);
      return Playlist.__super__.initialize.apply(this, arguments);
    };

    Playlist.prototype.randomColor = function() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    Playlist.prototype.playNext = function(sound) {
      var index, next;
      index = this.sounds.indexOf(sound);
      next = this.sounds.at(index - 1);
      if (next) {
        return next.set({
          play: true
        });
      }
    };

    return Playlist;

  })(Backbone.Model);
  
}});

window.require.define({"models/playlists": function(exports, require, module) {
  var Playlists,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Playlists = (function(_super) {

    __extends(Playlists, _super);

    function Playlists() {
      this.setCookie = __bind(this.setCookie, this);
      return Playlists.__super__.constructor.apply(this, arguments);
    }

    Playlists.prototype.model = require('./playlist');

    Playlists.prototype.localStorage = new Backbone.LocalStorage('Playlists');

    Playlists.prototype.initialize = function() {
      this.on('change:selected', this.deactivateOthers);
      return this.on('change:selected', this.setCookie);
    };

    Playlists.prototype.current = function() {
      return this.where({
        selected: true
      })[0];
    };

    Playlists.prototype.deactivateOthers = function(active) {
      var other, others, _i, _len, _results;
      others = this.filter(function(playlist) {
        return playlist !== active;
      });
      _results = [];
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        other = others[_i];
        _results.push(other.set({
          selected: false
        }, {
          silent: true
        }));
      }
      return _results;
    };

    Playlists.prototype.setCookie = function(model) {
      if (model.get('selected') != null) {
        return _.cookie('playlist', model.get('id'));
      }
    };

    return Playlists;

  })(Backbone.Collection);
  
}});

window.require.define({"models/sound": function(exports, require, module) {
  var Sound,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Sound = (function(_super) {

    __extends(Sound, _super);

    function Sound() {
      return Sound.__super__.constructor.apply(this, arguments);
    }

    Sound.prototype.defaults = {
      play: false
    };

    return Sound;

  })(Backbone.Model);
  
}});

window.require.define({"models/sounds": function(exports, require, module) {
  var Sounds,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Sounds = (function(_super) {

    __extends(Sounds, _super);

    function Sounds() {
      this.pauseOthers = __bind(this.pauseOthers, this);
      return Sounds.__super__.constructor.apply(this, arguments);
    }

    Sounds.prototype.model = require('./sound');

    Sounds.prototype.localStorage = new Backbone.LocalStorage('Sounds');

    Sounds.prototype.initialize = function() {
      return this.on('change:play', this.pauseOthers);
    };

    Sounds.prototype.pauseOthers = function(sound) {
      var other, others, _i, _len, _results;
      if (sound.get('play')) {
        others = this.filter(function(other) {
          return other !== sound;
        });
        _results = [];
        for (_i = 0, _len = others.length; _i < _len; _i++) {
          other = others[_i];
          _results.push(other.set({
            play: false
          }));
        }
        return _results;
      }
    };

    return Sounds;

  })(Backbone.Collection);
  
}});

window.require.define({"views/banner_view": function(exports, require, module) {
  var BannerView, Playlist,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Playlist = require('../models/playlist');

  module.exports = BannerView = (function(_super) {

    __extends(BannerView, _super);

    function BannerView() {
      this.deactivateTabs = __bind(this.deactivateTabs, this);

      this.activateTab = __bind(this.activateTab, this);

      this.render = __bind(this.render, this);
      return BannerView.__super__.constructor.apply(this, arguments);
    }

    BannerView.prototype.tagName = 'header';

    BannerView.prototype.className = 'banner';

    BannerView.prototype.template = require('./templates/banner');

    BannerView.prototype.events = {
      'click nav a': 'activateTab'
    };

    BannerView.prototype.initialize = function() {
      return app.playlists.on('change:selected', this.render);
    };

    BannerView.prototype.render = function(model) {
      if (model == null) {
        model = new Playlist({
          color: '#F60'
        });
      }
      this.$el.html(this.template({
        model: model
      }));
      this.$el.css({
        backgroundColor: model.get('color')
      });
      return this;
    };

    BannerView.prototype.activateTab = function(e) {
      var action, el;
      e.preventDefault();
      el = $(e.currentTarget);
      action = el.attr('data-action');
      if (el.is('.active')) {
        return;
      }
      this.$('nav a').removeClass('active');
      el.addClass('active');
      return app.tabsView.switchTo(action);
    };

    BannerView.prototype.deactivateTabs = function(e) {
      return this.$('nav a').removeClass('active');
    };

    return BannerView;

  })(Backbone.View);
  
}});

window.require.define({"views/playlist_new_view": function(exports, require, module) {
  var PlaylistNewView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = PlaylistNewView = (function(_super) {

    __extends(PlaylistNewView, _super);

    function PlaylistNewView() {
      this.create = __bind(this.create, this);

      this.render = __bind(this.render, this);
      return PlaylistNewView.__super__.constructor.apply(this, arguments);
    }

    PlaylistNewView.prototype.className = 'playlist-new tab';

    PlaylistNewView.prototype.template = require('./templates/playlist_new');

    PlaylistNewView.prototype.events = {
      'submit form': 'create'
    };

    PlaylistNewView.prototype.render = function() {
      this.$el.html(this.template);
      return this;
    };

    PlaylistNewView.prototype.hide = function() {
      this.$('form')[0].reset();
      return this.$el.hide();
    };

    PlaylistNewView.prototype.create = function(e) {
      var data, playlist;
      e.preventDefault();
      data = {
        title: this.$('input[name="title"]').val(),
        description: this.$('input[name="description"]').val()
      };
      if (data.title !== "") {
        playlist = app.playlists.create(data);
        playlist.set({
          selected: true
        });
        return this.hide();
      }
    };

    return PlaylistNewView;

  })(Backbone.View);
  
}});

window.require.define({"views/playlist_view": function(exports, require, module) {
  var PlaylistView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = PlaylistView = (function(_super) {

    __extends(PlaylistView, _super);

    function PlaylistView() {
      this.select = __bind(this.select, this);
      return PlaylistView.__super__.constructor.apply(this, arguments);
    }

    PlaylistView.prototype.className = 'playlist';

    PlaylistView.prototype.template = require('./templates/playlist');

    PlaylistView.prototype.events = {
      'click': 'select'
    };

    PlaylistView.prototype.render = function(model) {
      this.model = model;
      this.$el.html(this.template({
        model: model
      }));
      this.$el.css({
        backgroundColor: model.get('color')
      });
      return this;
    };

    PlaylistView.prototype.select = function(e) {
      e.preventDefault();
      return this.model.set({
        selected: true
      });
    };

    return PlaylistView;

  })(Backbone.View);
  
}});

window.require.define({"views/playlists_view": function(exports, require, module) {
  var PlaylistView, PlaylistsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PlaylistView = require('./playlist_view');

  module.exports = PlaylistsView = (function(_super) {

    __extends(PlaylistsView, _super);

    function PlaylistsView() {
      this.addAll = __bind(this.addAll, this);

      this.addOne = __bind(this.addOne, this);

      this.hide = __bind(this.hide, this);
      return PlaylistsView.__super__.constructor.apply(this, arguments);
    }

    PlaylistsView.prototype.className = 'playlists tab';

    PlaylistsView.prototype.initialize = function() {
      app.playlists.on('reset', this.addAll);
      app.playlists.on('add', this.addOne);
      return app.playlists.on('change:selected', this.hide);
    };

    PlaylistsView.prototype.render = function() {
      return this;
    };

    PlaylistsView.prototype.hide = function() {
      return this.$el.hide();
    };

    PlaylistsView.prototype.addOne = function(model) {
      var view;
      view = new PlaylistView;
      return this.$el.append(view.render(model).el);
    };

    PlaylistsView.prototype.addAll = function(models) {
      return models.each(this.addOne);
    };

    return PlaylistsView;

  })(Backbone.View);
  
}});

window.require.define({"views/sound_new_view": function(exports, require, module) {
  var SoundNewView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = SoundNewView = (function(_super) {

    __extends(SoundNewView, _super);

    function SoundNewView() {
      this.create = __bind(this.create, this);

      this["new"] = __bind(this["new"], this);

      this.render = __bind(this.render, this);
      return SoundNewView.__super__.constructor.apply(this, arguments);
    }

    SoundNewView.prototype.className = 'sound-new tab';

    SoundNewView.prototype.template = require('./templates/sound_new');

    SoundNewView.prototype.apiUrls = {
      resolve: 'http://api.soundcloud.com/resolve.json',
      waveform: 'http://waveformjs.org/w'
    };

    SoundNewView.prototype.events = {
      'submit form': 'new'
    };

    SoundNewView.prototype.render = function() {
      this.$el.html(this.template);
      return this;
    };

    SoundNewView.prototype.hide = function() {
      this.$('form')[0].reset();
      return this.$el.hide();
    };

    SoundNewView.prototype["new"] = function(e) {
      var req, url;
      e.preventDefault();
      url = this.$('input[name="url"]').val();
      if (url.match(/soundcloud.com/) != null) {
        req = $.getJSON("" + this.apiUrls.resolve + "?url=" + url + "&client_id=" + app.apiKey + "&callback=?");
        return req.success(this.create);
      }
    };

    SoundNewView.prototype.create = function(res) {
      var playlist,
        _this = this;
      if (res.kind !== 'track') {
        return;
      }
      playlist = app.playlists.current();
      return $.when(this.getWaveformData(res.waveform_url)).then(function(waveformData) {
        var extraData, sound;
        extraData = {
          track_id: res.id,
          playlist_id: playlist.id,
          waveform_data: waveformData
        };
        sound = playlist.sounds.create(_.extend(res, extraData));
        app.soundsView.addOne(sound);
        app.bannerView.deactivateTabs();
        return _this.hide();
      });
    };

    SoundNewView.prototype.getWaveformData = function(waveform_url) {
      var dfd, req,
        _this = this;
      dfd = $.Deferred();
      req = $.getJSON("" + this.apiUrls.waveform + "?url=" + waveform_url + "&callback=?");
      req.success(function(res) {
        return dfd.resolve(res);
      });
      return dfd.promise();
    };

    return SoundNewView;

  })(Backbone.View);
  
}});

window.require.define({"views/sound_view": function(exports, require, module) {
  var SoundView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = SoundView = (function(_super) {

    __extends(SoundView, _super);

    function SoundView() {
      this.streamTrack = __bind(this.streamTrack, this);

      this.render = __bind(this.render, this);

      this.showOnSoundCloud = __bind(this.showOnSoundCloud, this);

      this.onChangePlaying = __bind(this.onChangePlaying, this);

      this.togglePlay = __bind(this.togglePlay, this);
      return SoundView.__super__.constructor.apply(this, arguments);
    }

    SoundView.prototype.className = 'sound';

    SoundView.prototype.events = {
      'click': 'togglePlay',
      'dblclick': 'showOnSoundCloud'
    };

    SoundView.prototype.initialize = function() {
      return this.$el.attr('title', 'Click to play, double click to open on SoundCloud');
    };

    SoundView.prototype.togglePlay = function(e) {
      var play;
      play = this.model.get('play');
      return this.model.set({
        play: !play
      });
    };

    SoundView.prototype.onChangePlaying = function(model) {
      if (model.get('play')) {
        return this.stream.play();
      } else {
        return this.stream.pause();
      }
    };

    SoundView.prototype.showOnSoundCloud = function(e) {
      return window.open(this.model.get('permalink_url'));
    };

    SoundView.prototype.render = function(model) {
      this.model = model;
      model.on('change:play', this.onChangePlaying);
      model.on('finished', this.onFinished);
      this.renderTrack(model);
      return this;
    };

    SoundView.prototype.renderTrack = function(model) {
      var _this = this;
      return SC.get("/tracks/" + (model.get('track_id')), function(track) {
        var waveform;
        waveform = _this.renderWaveform(model.get('waveform_data'));
        return _this.streamTrack(track, waveform);
      });
    };

    SoundView.prototype.renderWaveform = function(waveformData) {
      var options;
      options = {
        container: this.$el[0],
        innerColor: '#999',
        data: waveformData
      };
      return new Waveform(options);
    };

    SoundView.prototype.streamTrack = function(track, waveform) {
      var options, streamOptions,
        _this = this;
      streamOptions = waveform.optionsForSyncedStream();
      options = {
        onfinish: (function() {
          return _this.model.trigger('finished', _this.model);
        })
      };
      _.extend(streamOptions, options);
      return SC.stream(track.uri, streamOptions, function(stream) {
        return _this.stream = stream;
      });
    };

    return SoundView;

  })(Backbone.View);
  
}});

window.require.define({"views/sounds_view": function(exports, require, module) {
  var SoundView, SoundsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SoundView = require('./sound_view');

  module.exports = SoundsView = (function(_super) {

    __extends(SoundsView, _super);

    function SoundsView() {
      this.addAll = __bind(this.addAll, this);

      this.addOne = __bind(this.addOne, this);

      this.renderSounds = __bind(this.renderSounds, this);
      return SoundsView.__super__.constructor.apply(this, arguments);
    }

    SoundsView.prototype.className = 'sounds';

    SoundsView.prototype.initialize = function() {
      return app.playlists.on('change:selected', this.renderSounds);
    };

    SoundsView.prototype.render = function() {
      return this;
    };

    SoundsView.prototype.renderSounds = function(playlist) {
      this.$el.empty();
      return this.addAll(playlist.sounds);
    };

    SoundsView.prototype.addOne = function(model) {
      var view;
      view = new SoundView;
      return this.$el.prepend(view.render(model).el);
    };

    SoundsView.prototype.addAll = function(models) {
      return models.each(this.addOne);
    };

    return SoundsView;

  })(Backbone.View);
  
}});

window.require.define({"views/tabs_view": function(exports, require, module) {
  var TabsView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = TabsView = (function(_super) {

    __extends(TabsView, _super);

    function TabsView() {
      return TabsView.__super__.constructor.apply(this, arguments);
    }

    TabsView.prototype.className = 'tabs';

    TabsView.prototype.render = function() {
      this.$el.append(app.playlistsView.render().el);
      this.$el.append(app.soundNewView.render().el);
      this.$el.append(app.playlistNewView.render().el);
      return this;
    };

    TabsView.prototype.switchTo = function(tab) {
      this.$('.tab').hide();
      switch (tab) {
        case 'show-playlists':
          return this.$('.playlists').show();
        case 'add-playlist':
          return this.$('.playlist-new').show().find('input').first().focus();
        case 'add-sound':
          return this.$('.sound-new').show().find('input').focus();
      }
    };

    return TabsView;

  })(Backbone.View);
  
}});

window.require.define({"views/templates/banner": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        var _ref;
      
        __out.push('<h1>\n  <a href="/" title="Home">\n    <img src="images/soundcloud.png" alt="SoundCloud" width="65" height="33">\n    ');
      
        __out.push(__sanitize(this.model.get('title')));
      
        __out.push('\n  </a>\n</h1>\n\n<h2>\n  ');
      
        __out.push(__sanitize(this.model.get('description')));
      
        __out.push('\n</h2>\n\n<nav>\n  ');
      
        if (((_ref = this.model.collection) != null ? _ref.length : void 0) > 0) {
          __out.push('\n    <a href="#" data-action="add-playlist">Add Playlist +</a>\n    <a href="#" data-action="show-playlists">');
          __out.push(__sanitize(this.model.collection.length));
          __out.push(' playlists</a>\n    <a href="#" data-action="add-sound" class="divide">Add track to ');
          __out.push(__sanitize(this.model.get('title')));
          __out.push(' +</a>\n  ');
        }
      
        __out.push('\n</nav>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/playlist": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<a href="#">\n  ');
      
        __out.push(__sanitize(this.model.get('title')));
      
        __out.push('\n</a>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/playlist_new": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<form>\n  <input name="title" type="text" placeholder="Title">\n  <input name="description" type="text" placeholder="Description (optional)">\n  <button type="submit">Add</button>\n</form>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/sound_new": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<form novalidate>\n  <input name="url" type="url" placeholder="SoundCloud track URL">\n  <button type="submit">Add</button>\n</form>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/templates/welcome": function(exports, require, module) {
  module.exports = function (__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
      
        __out.push('<h2>Create playlists of your favorite tracks on SoundCloud.</h2>\n\n<form>\n  <input name="title" type="text" placeholder="Playlist name" autofocus><br>\n  <input name="description" type="text" placeholder="Playlist description (optional)">\n  <button type="submit">Create your first playlist</button>\n</form>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  }
}});

window.require.define({"views/welcome_view": function(exports, require, module) {
  var WelcomeView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = WelcomeView = (function(_super) {

    __extends(WelcomeView, _super);

    function WelcomeView() {
      this.create = __bind(this.create, this);
      return WelcomeView.__super__.constructor.apply(this, arguments);
    }

    WelcomeView.prototype.className = 'welcome';

    WelcomeView.prototype.template = require('./templates/welcome');

    WelcomeView.prototype.events = {
      'submit form': 'create'
    };

    WelcomeView.prototype.render = function() {
      this.$el.html(this.template);
      return this;
    };

    WelcomeView.prototype.create = function(e) {
      var data, model;
      e.preventDefault();
      data = {
        title: this.$('input[name="title"]').val(),
        description: this.$('input[name="description"]').val()
      };
      if (data.title !== "") {
        model = app.playlists.create(data);
        model.set({
          selected: true
        });
        return this.remove();
      }
    };

    return WelcomeView;

  })(Backbone.View);
  
}});

