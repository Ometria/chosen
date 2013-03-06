/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      /*
       * 
       * 
       */
      banner: '/*******************************************************************************\n'
	      + 'Copyright (c) 2013 Banno LLC. All rights reserved.\n'+ 
	    '*******************************************************************************/'
    },
    lint: {
      files: ['grunt.js', 'src/main/coffeescript/*.coffee', 'src/test/coffeescript/*.coffee']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'browserify concat mocha'
    },
    browserify: {
      'lib/americano.js': {
        aliases: ['jquery:jquery-browserify'],
        entries: ["src/main/coffeescript/americano.coffee", "src/main/javascript/chosen.js"],
        prepend: ['<banner:meta.banner>'],
	dest: 'lib/<%= pkg.name %>.js'
      },
      'testable': {
        aliases: ['jquery:jquery-browserify'],
	entries: ["src/main/coffeescript/*.coffee", "src/test/coffeescript/*.coffee", "src/main/javascript/chosen.js"],
        prepend: ['<banner:meta.banner>'],
	dest: 'test/americano-specs.js'
      }
    },
    mocha: {
      all: {
        src: ['test/**/*.html'],
        options: {
          ignoreLeaks: true,
          globals: ['Americano', 'jQuery', '$', 'window', 'document'],
          ui: 'bdd',
          run: true,
          colors: true,
          bail: false
        }
      }
    },
    coffee: {
      compile: {
	files: {
	  'lib/compiled.js': ['src/main/coffeescript/*.coffee', 'src/main/coffeescript/**/*.coffee'],
	  'lib/test-compiled.js' : ['src/test/coffeescript/*.coffee', 'src/test/coffeescript/**/*.coffee']
	},
	options: {
	  map: true
	}
      }	
    },
    handlebars: {
      compile: {
	options: {
	  wrapped: true,
	  namespace: "com.banno.templates",
	  node: true,
	  processName: function(filename) {
	    var filenameRegex = /(?:.*\/)*(.*)(?:\.handlebars$)/
	    return filenameRegex.exec(filename)[1];
	  }
	},
	files: {
	  "lib/templates.js": ["src/main/handlebars/*.handlebars", "src/main/handlebars/**/*.handlebars", "src/main/handlebars/**/**/*.handlebars", "src/main/handlebars/**/**/**/*.handlebars"]
	}
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-browserify');
  // coffee grunt plugin needed to detect coffeescript errors and bail
  // if those errors exist.
  // need to figure out how to include handlebars helpers and what not, 
  // and how to add the handlebars compiled templates to the build, then
  // we are done!!!!
  // Default task.
  grunt.registerTask('test', 'handlebars coffee browserify concat mocha');
  grunt.registerTask('default', 'handlebars coffee browserify concat min');

};
