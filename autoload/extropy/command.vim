" extropy#command
"
" Set of commands that the node-vim interop layer can call back into

function! extropy#command#execute(command)
    :echom "Executing: ".a:command
    :execute a:command
    :redraw
endfunction

function! extropy#command#echo(msg)
    echom a:msg
endfunction

function! extropy#command#createCommand(pluginName, commandName) 
    echom "CreateCommand: " . a:pluginName . a:commandName
    execute "command! -nargs=0 " . a:commandName . " call extropy#js#callJsFunction('" . a:pluginName . "', '" . a:commandName . "')"
endfunction



" TODO:
" Add real 'start' method to the plugin
" Callback if node client reports an error talking to the server
" Load plugin as separate process
" Add plugin-name argument to script file
" Create plugin in vim-node-test-plugin that just does :TestRoundTrip and
" calls extropy#js#exec("myPlugin", "myFunction", args)
" Add logging to the server to see calls that came in