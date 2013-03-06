/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*******************************************************************************\n'
	+ '# Chosen, a Select Box Enhancer for jQuery and Protoype # by Patrick\n'+ 
	'#Filler for [Harvest](http://getharvest.com)\n'+ 
	'\n'+ 
	'Available for use under the [MIT License](http://en.wikipedia.org/wiki/MIT_License)\n'+ 
	'\n'+ 
	'Copyright (c) 2011 by Harvest\n'+ 
	'\n'+ 
	'Permission is hereby granted, free of charge, to any person obtaining a copy\n'+ 
	'of this software and associated documentation files (the "Software"), to deal\n'+ 
	'in the Software without restriction, including without limitation the rights\n'+ 
	'to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n'+ 
	'copies of the Software, and to permit persons to whom the Software is\n'+ 
	'furnished to do so, subject to the following conditions:\n'+ 
	'\n'+ 
	'The above copyright notice and this permission notice shall be included in\n'+ 
	'all copies or substantial portions of the Software.\n'+ 
	'\n'+ 
	'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n'+ 
	'IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n'+ 
	'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n'+ 
	'AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n'+ 
	'LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n'+ 
	'OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n'+ 
	'THE SOFTWARE.\n'+ 
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
      'lib/chosen-jquery-browserify.js': {
        aliases: ['jquery:jquery-browserify'],
        entries: ["src/main/coffeescript/chosen-jquery-browserify.coffee"],
        prepend: ['<banner:meta.banner>'],
	dest: 'lib/<%= pkg.name %>.js'
      },
      'test/chosen-specs.js': {
        aliases: ['jquery:jquery-browserify'],
	entries: ["src/main/coffeescript/*.coffee", "src/test/coffeescript/*.coffee"],
        prepend: ['<banner:meta.banner>'],
	dest: 'test/chosen-specs.js'
      }
    },
    mocha: {
      all: {
        src: ['test/**/*.html'],
        options: {
          ignoreLeaks: true,
          globals: ['window', 'document'],
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
	  'lib/compiled.js': ['src/main/coffeescript/*.coffee'],
	  'lib/test-compiled.js' : ['src/test/coffeescript/*.coffee']
	},
	options: {
	  map: true
	}
      }	
    },
    copy: {
      dist: {
	files:{
	"dist/resources/chosen-sprite@2x.png": ["src/main/resources/chosen-sprite@2x.png"],
	"dist/resources/chosen-sprite.png": ["src/main/resources/chosen-sprite.png"],
	"test/resources/chosen-sprite@2x.png": ["src/main/resources/chosen-sprite@2x.png"],
	"test/resources/chosen-sprite.png": ["src/main/resources/chosen-sprite.png"]}
      }
    },
    mincss: {
      compress: {
	options: {
	  banner: '<banner:meta.banner>'
	},
	files: {
	  "dist/resources/chosen.min.css": ["src/main/resources/chosen.css"],
	  "test/resources/mocha.min.css": ["node_modules/grunt-mocha/example/test/css/mocha.css"],
	  "test/resources/chosen.min.css": ["src/main/resources/chosen.css"]
	}
      }
    },
    uglify: {}
  });

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('test', 'coffee browserify mincss copy concat mocha');
  grunt.registerTask('default', 'coffee browserify mincss copy concat min');

};
