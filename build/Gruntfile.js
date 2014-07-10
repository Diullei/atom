// Generated by CoffeeScript 1.7.1
(function() {
  var fm, fs, os, packageJson, path, _,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  os = require('os');

  require('vm-compatibility-layer');

  fm = require('json-front-matter');

  _ = require('underscore-plus');

  packageJson = require('../package.json');

  if (global.WeakMap == null) {
    _.extend(global, require('harmony-collections'));
  }

  module.exports = function(grunt) {
    var appDir, appName, atomShellDownloadDir, buildDir, child, coffeeConfig, contentsDir, csonConfig, defaultTasks, directory, engines, installDir, lessConfig, major, minor, patch, pegConfig, prebuildLessConfig, shellAppDir, symbolsDir, theme, tmpDir, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
    grunt.loadNpmTasks('grunt-coffeelint');
    grunt.loadNpmTasks('grunt-lesslint');
    grunt.loadNpmTasks('grunt-cson');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-download-atom-shell');
    grunt.loadNpmTasks('grunt-peg');
    grunt.loadTasks('tasks');
    grunt.file.setBase(path.resolve('..'));
    if (!grunt.option('verbose')) {
      grunt.log.writeln = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return grunt.log;
      };
      grunt.log.write = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return grunt.log;
      };
    }
    _ref = packageJson.version.split('.'), major = _ref[0], minor = _ref[1], patch = _ref[2];
    tmpDir = os.tmpdir();
    appName = process.platform === 'darwin' ? 'Atom.app' : 'Atom';
    buildDir = (_ref1 = grunt.option('build-dir')) != null ? _ref1 : path.join(tmpDir, 'atom-build');
    atomShellDownloadDir = path.join(os.tmpdir(), 'atom-cached-atom-shells');
    symbolsDir = path.join(buildDir, 'Atom.breakpad.syms');
    shellAppDir = path.join(buildDir, appName);
    if (process.platform === 'win32') {
      contentsDir = shellAppDir;
      appDir = path.join(shellAppDir, 'resources', 'app');
      installDir = path.join(process.env.ProgramFiles, appName);
    } else if (process.platform === 'darwin') {
      contentsDir = path.join(shellAppDir, 'Contents');
      appDir = path.join(contentsDir, 'Resources', 'app');
      installDir = path.join('/Applications', appName);
    } else {
      contentsDir = shellAppDir;
      appDir = path.join(shellAppDir, 'resources', 'app');
      installDir = (_ref2 = process.env.INSTALL_PREFIX) != null ? _ref2 : '/usr/local';
    }
    coffeeConfig = {
      glob_to_multiple: {
        expand: true,
        src: ['src/**/*.coffee', 'exports/**/*.coffee', 'static/**/*.coffee'],
        dest: appDir,
        ext: '.js'
      }
    };
    lessConfig = {
      options: {
        paths: ['static/variables', 'static']
      },
      glob_to_multiple: {
        expand: true,
        src: ['static/**/*.less'],
        dest: appDir,
        ext: '.css'
      }
    };
    prebuildLessConfig = {
      src: ['static/**/*.less', 'node_modules/bootstrap/less/bootstrap.less']
    };
    csonConfig = {
      options: {
        rootObject: true
      },
      glob_to_multiple: {
        expand: true,
        src: ['menus/*.cson', 'keymaps/*.cson', 'static/**/*.cson'],
        dest: appDir,
        ext: '.json'
      }
    };
    pegConfig = {
      glob_to_multiple: {
        expand: true,
        src: ['src/**/*.pegjs'],
        dest: appDir,
        ext: '.js'
      }
    };
    _ref3 = fs.readdirSync('node_modules');
    for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
      child = _ref3[_i];
      if (!(child !== '.bin')) {
        continue;
      }
      directory = path.join('node_modules', child);
      _ref4 = grunt.file.readJSON(path.join(directory, 'package.json')), engines = _ref4.engines, theme = _ref4.theme;
      if ((engines != null ? engines.atom : void 0) != null) {
        coffeeConfig.glob_to_multiple.src.push("" + directory + "/**/*.coffee");
        lessConfig.glob_to_multiple.src.push("" + directory + "/**/*.less");
        if (!theme) {
          prebuildLessConfig.src.push("" + directory + "/**/*.less");
        }
        csonConfig.glob_to_multiple.src.push("" + directory + "/**/*.cson");
        pegConfig.glob_to_multiple.src.push("" + directory + "/**/*.pegjs");
      }
    }
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      atom: {
        appDir: appDir,
        appName: appName,
        symbolsDir: symbolsDir,
        buildDir: buildDir,
        contentsDir: contentsDir,
        installDir: installDir,
        shellAppDir: shellAppDir
      },
      coffee: coffeeConfig,
      less: lessConfig,
      'prebuild-less': prebuildLessConfig,
      cson: csonConfig,
      peg: pegConfig,
      coffeelint: {
        options: {
          no_empty_param_list: {
            level: 'error'
          },
          max_line_length: {
            level: 'ignore'
          },
          indentation: {
            level: 'ignore'
          }
        },
        src: ['dot-atom/**/*.coffee', 'exports/**/*.coffee', 'src/**/*.coffee'],
        build: ['build/tasks/**/*.coffee', 'build/Gruntfile.coffee'],
        test: ['spec/*.coffee']
      },
      csslint: {
        options: {
          'adjoining-classes': false,
          'duplicate-background-images': false,
          'box-model': false,
          'box-sizing': false,
          'bulletproof-font-face': false,
          'compatible-vendor-prefixes': false,
          'display-property-grouping': false,
          'fallback-colors': false,
          'font-sizes': false,
          'gradients': false,
          'ids': false,
          'important': false,
          'known-properties': false,
          'outline-none': false,
          'overqualified-elements': false,
          'qualified-headings': false,
          'unique-headings': false,
          'universal-selector': false,
          'vendor-prefix': false
        },
        src: ['static/**/*.css']
      },
      lesslint: {
        src: ['static/**/*.less']
      },
      markdown: {
        guides: {
          files: [
            {
              expand: true,
              cwd: 'docs',
              src: '**/*.md',
              dest: 'docs/output/',
              ext: '.html'
            }
          ],
          options: {
            template: 'docs/template.jst',
            templateContext: {
              tag: "v" + major + "." + minor
            },
            markdownOptions: {
              gfm: true
            },
            preCompile: function(src, context) {
              var parsed;
              parsed = fm.parse(src);
              _.extend(context, parsed.attributes);
              return parsed.body;
            }
          }
        }
      },
      'download-atom-shell': {
        version: packageJson.atomShellVersion,
        outputDir: 'atom-shell',
        downloadDir: atomShellDownloadDir,
        rebuild: true
      },
      shell: {
        'kill-atom': {
          command: 'pkill -9 Atom',
          options: {
            stdout: false,
            stderr: false,
            failOnError: false
          }
        }
      }
    });
    grunt.registerTask('compile', ['coffee', 'prebuild-less', 'cson', 'peg']);
    grunt.registerTask('lint', ['coffeelint', 'csslint', 'lesslint']);
    grunt.registerTask('test', ['shell:kill-atom', 'run-specs']);
    grunt.registerTask('ci', ['output-disk-space', 'download-atom-shell', 'build', 'dump-symbols', 'set-version', 'check-licenses', 'lint', 'test', 'codesign', 'publish-build']);
    grunt.registerTask('docs', ['markdown:guides', 'build-docs']);
    defaultTasks = ['download-atom-shell', 'build', 'set-version'];
    if (process.platform !== 'linux') {
      defaultTasks.push('install');
    }
    return grunt.registerTask('default', defaultTasks);
  };

}).call(this);
