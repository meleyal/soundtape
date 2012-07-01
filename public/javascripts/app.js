(function(/*! Brunch !*/) {
  'use strict';

  if (!this.require) {
    var modules = {};
    var cache = {};
    var __hasProp = ({}).hasOwnProperty;

    var expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    };

    var getFullPath = function(path, fromCache) {
      var store = fromCache ? cache : modules;
      var dirIndex;
      if (__hasProp.call(store, path)) return path;
      dirIndex = expand(path, './index');
      if (__hasProp.call(store, dirIndex)) return dirIndex;
    };
    
    var cacheModule = function(name, path, contentFn) {
      var module = {id: path, exports: {}};
      try {
        cache[path] = module.exports;
        contentFn(module.exports, function(name) {
          return require(name, dirname(path));
        }, module);
        cache[path] = module.exports;
      } catch (err) {
        delete cache[path];
        throw err;
      }
      return cache[path];
    };

    var require = function(name, root) {
      var path = expand(root, name);
      var fullPath;

      if (fullPath = getFullPath(path, true)) {
        return cache[fullPath];
      } else if (fullPath = getFullPath(path, false)) {
        return cacheModule(name, fullPath, modules[fullPath]);
      } else {
        throw new Error("Cannot find module '" + name + "'");
      }
    };

    var dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };

    this.require = function(name) {
      return require(name, '');
    };

    this.require.brunch = true;
    this.require.define = function(bundle) {
      for (var key in bundle) {
        if (__hasProp.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    };
  }
}).call(this);
(this.require.define({
  "application": function(exports, require, module) {
    (function() {
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

    function Application() {
      var _this = this;
      $(function() {
        _this.initialize();
        return Backbone.history.start({
          pushState: true
        });
      });
    }

    Application.prototype.initialize = function() {
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

}).call(this);

  }
}));
(this.require.define({
  "lib/router": function(exports, require, module) {
    (function() {
  var Router, SoundNewView, SoundsView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  SoundsView = require('../views/sounds_view');

  SoundNewView = require('../views/sound_new_view');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'index'
    };

    Router.prototype.index = function() {
      $('#content').append(app.bannerView.render().el);
      $('#content').append(app.tabsView.render().el);
      $('#content').append(app.soundsView.render().el);
      app.playlists.fetch();
      if (app.playlists.length > 0) {
        app.playlists.clearSelection();
        return app.playlists.last().set({
          selected: true
        });
      } else {
        return $('#content').append(app.welcomeView.render().el);
      }
    };

    return Router;

  })(Backbone.Router);

}).call(this);

  }
}));
(this.require.define({
  "models/playlist": function(exports, require, module) {
    (function() {
  var Playlist, Sounds,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Sounds = require('../models/sounds');

  module.exports = Playlist = (function(_super) {

    __extends(Playlist, _super);

    function Playlist() {
      Playlist.__super__.constructor.apply(this, arguments);
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
      if (this.get('color') == null) this.set('color', this.randomColor());
      return Playlist.__super__.initialize.apply(this, arguments);
    };

    Playlist.prototype.randomColor = function() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    return Playlist;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "models/playlists": function(exports, require, module) {
    (function() {
  var Playlists,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Playlists = (function(_super) {

    __extends(Playlists, _super);

    function Playlists() {
      Playlists.__super__.constructor.apply(this, arguments);
    }

    Playlists.prototype.model = require('./playlist');

    Playlists.prototype.localStorage = new Backbone.LocalStorage('Playlists');

    Playlists.prototype.initialize = function() {
      return this.on('change:selected', this.deactivateOthers);
    };

    Playlists.prototype.current = function() {
      return this.where({
        selected: true
      })[0];
    };

    Playlists.prototype.clearSelection = function() {
      return this.each(function(model) {
        return model.set({
          selected: false
        });
      });
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

    return Playlists;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "models/sound": function(exports, require, module) {
    (function() {
  var Sound,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Sound = (function(_super) {

    __extends(Sound, _super);

    function Sound() {
      Sound.__super__.constructor.apply(this, arguments);
    }

    Sound.prototype.initialize = function(options) {
      return null;
    };

    return Sound;

  })(Backbone.Model);

}).call(this);

  }
}));
(this.require.define({
  "models/sounds": function(exports, require, module) {
    (function() {
  var Sounds,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = Sounds = (function(_super) {

    __extends(Sounds, _super);

    function Sounds() {
      Sounds.__super__.constructor.apply(this, arguments);
    }

    Sounds.prototype.model = require('./sound');

    Sounds.prototype.localStorage = new Backbone.LocalStorage('Sounds');

    Sounds.prototype.initialize = function() {
      return null;
    };

    return Sounds;

  })(Backbone.Collection);

}).call(this);

  }
}));
(this.require.define({
  "views/banner_view": function(exports, require, module) {
    (function() {
  var BannerView, Playlist, PlaylistsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PlaylistsView = require('./playlists_view');

  Playlist = require('../models/playlist');

  module.exports = BannerView = (function(_super) {

    __extends(BannerView, _super);

    function BannerView() {
      this.deactivateNav = __bind(this.deactivateNav, this);
      this.handleNavClick = __bind(this.handleNavClick, this);
      this.render = __bind(this.render, this);
      BannerView.__super__.constructor.apply(this, arguments);
    }

    BannerView.prototype.tagName = 'header';

    BannerView.prototype.className = 'banner';

    BannerView.prototype.template = require('./templates/banner');

    BannerView.prototype.events = {
      'click nav a': 'handleNavClick'
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

    BannerView.prototype.handleNavClick = function(e) {
      var action, el;
      e.preventDefault();
      el = $(e.currentTarget);
      action = el.attr('data-action');
      if (el.is('.active')) return;
      this.$('nav a').removeClass('active');
      el.addClass('active');
      return app.tabsView.switchTo(action);
    };

    BannerView.prototype.deactivateNav = function(e) {
      return this.$('nav a').removeClass('active');
    };

    return BannerView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/playlist_new_view": function(exports, require, module) {
    (function() {
  var PlaylistNewView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = PlaylistNewView = (function(_super) {

    __extends(PlaylistNewView, _super);

    function PlaylistNewView() {
      this.create = __bind(this.create, this);
      this.render = __bind(this.render, this);
      PlaylistNewView.__super__.constructor.apply(this, arguments);
    }

    PlaylistNewView.prototype.className = 'playlist-new tab';

    PlaylistNewView.prototype.template = require('./templates/playlist_new');

    PlaylistNewView.prototype.events = {
      'submit form': 'create'
    };

    PlaylistNewView.prototype.initialize = function() {};

    PlaylistNewView.prototype.render = function() {
      this.$el.html(this.template);
      return this;
    };

    PlaylistNewView.prototype.show = function() {
      return this.$el.show();
    };

    PlaylistNewView.prototype.create = function(e) {
      var data;
      e.preventDefault();
      data = {
        title: this.$('input[name="title"]').val(),
        description: this.$('input[name="description"]').val()
      };
      app.playlists.create(data);
      return this.remove();
    };

    return PlaylistNewView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/playlist_view": function(exports, require, module) {
    (function() {
  var PlaylistView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = PlaylistView = (function(_super) {

    __extends(PlaylistView, _super);

    function PlaylistView() {
      this.select = __bind(this.select, this);
      PlaylistView.__super__.constructor.apply(this, arguments);
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
      console.log(this.model);
      e.preventDefault();
      return this.model.set({
        selected: true
      });
    };

    return PlaylistView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/playlists_view": function(exports, require, module) {
    (function() {
  var PlaylistView, PlaylistsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  PlaylistView = require('./playlist_view');

  module.exports = PlaylistsView = (function(_super) {

    __extends(PlaylistsView, _super);

    function PlaylistsView() {
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      this.hide = __bind(this.hide, this);
      PlaylistsView.__super__.constructor.apply(this, arguments);
    }

    PlaylistsView.prototype.className = 'playlists tab';

    PlaylistsView.prototype.template = require('./templates/playlists');

    PlaylistsView.prototype.initialize = function() {
      app.playlists.on('reset', this.addAll);
      app.playlists.on('add', this.addOne);
      return app.playlists.on('change:selected', this.hide);
    };

    PlaylistsView.prototype.render = function() {
      return this;
    };

    PlaylistsView.prototype.show = function() {
      return this.$el.show();
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

}).call(this);

  }
}));
(this.require.define({
  "views/sound_new_view": function(exports, require, module) {
    (function() {
  var SoundNewView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = SoundNewView = (function(_super) {

    __extends(SoundNewView, _super);

    function SoundNewView() {
      this.create = __bind(this.create, this);
      this.render = __bind(this.render, this);
      SoundNewView.__super__.constructor.apply(this, arguments);
    }

    SoundNewView.prototype.className = 'sound-new tab';

    SoundNewView.prototype.template = require('./templates/sound_new');

    SoundNewView.prototype.apiUrl = 'http://soundcloud.com/oembed';

    SoundNewView.prototype.events = {
      'submit form': 'create'
    };

    SoundNewView.prototype.initialize = function() {};

    SoundNewView.prototype.render = function() {
      this.$el.html(this.template);
      return this;
    };

    SoundNewView.prototype.show = function() {
      return this.$el.show();
    };

    SoundNewView.prototype.create = function(e) {
      var options, req, url,
        _this = this;
      this.playlist = app.playlists.current();
      e.preventDefault();
      url = this.$('input[name="url"]').val();
      options = $.param({
        url: url,
        show_comments: false
      });
      req = $.getJSON("" + this.apiUrl + "?" + options);
      return req.success(function(data) {
        var sound;
        _.extend(data, {
          url: url,
          playlist_id: _this.playlist.id
        });
        return sound = _this.playlist.sounds.create(data);
      });
    };

    return SoundNewView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/sound_view": function(exports, require, module) {
    (function() {
  var SoundView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = SoundView = (function(_super) {

    __extends(SoundView, _super);

    function SoundView() {
      SoundView.__super__.constructor.apply(this, arguments);
    }

    SoundView.prototype.className = 'sound';

    SoundView.prototype.template = require('./templates/sound');

    SoundView.prototype.render = function(model) {
      this.model = model;
      this.$el.html(this.template({
        model: model
      }));
      return this;
    };

    return SoundView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/sounds_view": function(exports, require, module) {
    (function() {
  var SoundView, SoundsView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  SoundView = require('./sound_view');

  module.exports = SoundsView = (function(_super) {

    __extends(SoundsView, _super);

    function SoundsView() {
      this.addAll = __bind(this.addAll, this);
      this.addOne = __bind(this.addOne, this);
      this.renderSounds = __bind(this.renderSounds, this);
      SoundsView.__super__.constructor.apply(this, arguments);
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

}).call(this);

  }
}));
(this.require.define({
  "views/tabs_view": function(exports, require, module) {
    (function() {
  var TabsView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = TabsView = (function(_super) {

    __extends(TabsView, _super);

    function TabsView() {
      TabsView.__super__.constructor.apply(this, arguments);
    }

    TabsView.prototype.className = 'tabs';

    TabsView.prototype.initialize = function() {};

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
          return this.$('.playlist-new').show();
        case 'add-sound':
          return this.$('.sound-new').show();
      }
    };

    return TabsView;

  })(Backbone.View);

}).call(this);

  }
}));
(this.require.define({
  "views/templates/banner": function(exports, require, module) {
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
        __out.push(' playlists</a>\n    <a href="#" data-action="add-sound" class="divide">Add track +</a>\n  ');
      }
    
      __out.push('\n</nav>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/playlist": function(exports, require, module) {
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
    
      __out.push('<a href="#">');
    
      __out.push(__sanitize(this.model.get('title')));
    
      __out.push('</a>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/playlist_new": function(exports, require, module) {
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
    
      __out.push('<form>\n  <input name="title" type="text" placeholder="Title">\n  <input name="description" type="text" placeholder="Description (optional)">\n  <button type="submit" class="create">Add</button>\n</form>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/playlists": function(exports, require, module) {
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
    
      __out.push('<button class="new sc-button sc-button-icon sc-button-add sc-button-active">\n  <span>New playlist</span>\n</button>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/sound": function(exports, require, module) {
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
    
      __out.push(this.model.get('html'));
    
      __out.push('\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/sound_new": function(exports, require, module) {
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
    
      __out.push('\n\n<form novalidate>\n  <input name="url" type="url" placeholder="SoundCloud track URL">\n  <button type="submit" class="sc-button create">Add</button>\n</form>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/sounds": function(exports, require, module) {
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
    
    
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/templates/welcome": function(exports, require, module) {
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
    
      __out.push('<h2>Create playlists of your favorite tracks on SoundCloud.</h2>\n\n<form>\n  <input name="title" type="text" placeholder="Playlist name" autofocus><br>\n  <input name="description" type="text" placeholder="Playlist description (optional)">\n  <br><br>\n  <button type="submit">Create your first playlist</button>\n</form>\n');
    
    }).call(this);
    
  }).call(__obj);
  __obj.safe = __objSafe, __obj.escape = __escape;
  return __out.join('');
}
  }
}));
(this.require.define({
  "views/welcome_view": function(exports, require, module) {
    (function() {
  var WelcomeView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = WelcomeView = (function(_super) {

    __extends(WelcomeView, _super);

    function WelcomeView() {
      this.create = __bind(this.create, this);
      WelcomeView.__super__.constructor.apply(this, arguments);
    }

    WelcomeView.prototype.className = 'welcome';

    WelcomeView.prototype.template = require('./templates/welcome');

    WelcomeView.prototype.events = {
      'submit form': 'create'
    };

    WelcomeView.prototype.initialize = function() {};

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
      model = app.playlists.create(data);
      model.set({
        selected: true
      });
      return this.remove();
    };

    return WelcomeView;

  })(Backbone.View);

}).call(this);

  }
}));
