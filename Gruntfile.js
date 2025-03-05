module.exports = function(grunt) {
  grunt.initConfig({
    md2html: {
      options: {
        layout: 'markdown-template.html'
      },
      architecture: {
        files: [{
          src: ['architecture.md'],
          dest: 'architecture.html'
        }]
      },
      replyToThis: {
        files: [{
          src: ['reply-to-this.md'],
          dest: 'reply-to-this.html'
        }]
      }
    },
  })

  // Load the grunt plugins
  grunt.loadNpmTasks('grunt-md2html')

  grunt.registerTask('default', ['md2html'])
}
