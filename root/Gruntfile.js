/*global module:false*/

var now = new Date();


module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var pkg = grunt.file.readJSON("package.json");

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    meta: {
      version: '0.1.0'
    },
    "file-creator": {
      "basic": {
        "src/version.jsx": function(fs, fd, done) {
          var v = pkg.version; // '<%= pkg.version %>';
          fs.writeSync(fd, "var v = '" + v + "';\n");
          done();
        }
      }
    },
    execute: {
      helptext: {
        src: ["bin/escapeStrings/index.jsx"]
      }
    },
    concat: {
      options: {

        banner: '\n/*! <%= pkg.name %>.jsx - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
        stripBanners: false
      },
      scripts: {
        src: [
          'license.jsx',
          'globals.jsx',
          'version.jsx',
          'util.jsx',
          'src/{%= name %}.jsx',
          'main.jsx'
        ],
        dest: 'src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx'
      }
    },

    copy: {
      "script": {
        src: "src/tmp/<%= pkg.name %>.concat.wrap.<%= pkg.version %>.jsx",
        dest: "dist/<%= pkg.name %>.<%= pkg.version %>.jsx",
      },
      "docs": {
        src: "assets/images/img.gif",
        dest: "dist/docs/assets/images/img.gif",
      }
    },
    /**
     * wrap it
     */
    wrap: {
      'script': {
        src: ['src/tmp/<%= pkg.name %>.concat.<%= pkg.version %>.jsx'],
        dest: 'src/tmp/<%= pkg.name %>.concat.wrap.<%= pkg.version %>.jsx',
        options: {
          wrapper: ['(function(thisObj) {', '})(this);\n']
        },
      },
    },
    watch: {
      files: ['src/*.jsx', 'src/*.js', 'src/lib/*'],
      tasks: ['concat:scripts', 'wrap:script', 'copy:script']
    },
    markdown: {
      all: {
        options: {
          template: 'src/docs/template.html',
          gfm: true,
          highlight: 'auto',
          // preCompile: function(src, context) {},
          // postCompile: function(src, context) {},
          templateContext: {
            title: '<%= pkg.name %>',
            now: now.getUTCFullYear().toString() + '-' + (now.getUTCMonth() + 1).toString() + '-' + now.getUTCDate().toString()
          },

          // codeLines: {
          //   before: '<span>',
          //   after: '</span>'
          // }

        },
        files: [{
          expand: true,
          src: './README.md',
          dest: './dist/docs/',
          ext: '.html'
        }]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'zips/<%= pkg.name %>.<%= pkg.version %>.zip'
        },
        files: [
          // {src: ['path/*'], dest: 'internal_folder/', filter: 'isFile'}, // includes files in path
          {
            flatten: true,
            src: ['dist/<%= pkg.name %>.<%= pkg.version %>.jsx', 'dist/docs/**']
          }, // includes files in path and its subdirs
          // {expand: true, cwd: 'path/', src: ['**'], dest: 'internal_folder3/'}, // makes all src relative to cwd
          // {flatten: true, src: ['path/**'], dest: 'internal_folder4/', filter: 'isFile'} // flattens results to a single level
        ]
      }
    }
  });
  grunt.registerTask('build', ['file-creator:basic', 'concat:scripts', 'wrap:script', 'copy:script', 'markdown:all', 'copy:docs', 'compress:main']);
  grunt.registerTask('build-docs', ['markdown:all', 'copy:docs']);
  grunt.registerTask('default', ['watch']);

};