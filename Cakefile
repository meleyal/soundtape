{exec} = require 'child_process'
{print} = require 'util'

shell = (cmds) ->
  exec(cmds, (err, stdout, stderr) ->
    print trimStdout if trimStdout = stdout.trim()
    error stderr.trim() if err
  )

task 'docs', 'generate docs', ->
  shell 'docco app/*.coffee app/*/*.coffee'
