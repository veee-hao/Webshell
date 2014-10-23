
function command_parser(term)
{
    var command = {};
    
    this.t = term;

    this.parse = function(cmd_array, term)
    {
        var name = cmd_array.shift();
        var rpc = null;

        switch (name)
        {
            case "help":
                print_help_help(term);
                break;
            case "machine":
                //print_help_machine(term);
                rpc = parse_machine_option(cmd_array);
                break;
            case "job":
                rpc = parse_job_option(cmd_array);
                //print_help_job(term);
                break;
	    case "send":
                if(cmd_array.length <= 1) {
                    print_help_send(term);
                } else {
		    rpc = parse_send_option(cmd_array);
                }
                break;
            case "test":
                term.echo("-------------------------------------------------");
                term.echo("id | name | ip | product_id | memsize | disksize");
                term.echo("-------------------------------------------------");
                break;
            case 'scheme':
                rpc = parse_scheme_option(cmd_array);
                break;
            default:
                if(name.length != 0) {
                    this.print_error("unknow command!!");
                    print_help_help(term);
                }
                break;
        }
        return rpc;
    }

    this.print_error = function (err)
    {
    	this.t.echo("<err>"+err+"</err>",{raw:true});
    }
    function print_help_help(term)
    {
        var help = [
                      // "Usage: help  [command]\n",
                      // "Description: By default, it displays all the commands supported in this tool. if the command is specified,",
                      // "\tIt will print out the corresponding help info of the command.",
                       "Commands:",
                       "\tmachine - list, search, and send job to machines which is managed by the system.",
                       "\tjob     - list, track the running machine.",
		       "\tsend    - list, send job to machine.",
		       "\thelp    - print this.",
                       "\n"
                   ];
        _print_help(help, term);
    }
    
    function print_help_machine(term)
    {
        var help = [
                       "Usage: machine [options] [id]\n",
                       "Description: if no options specified, this command will print all the machines in the system.",
                       "\t\tif machine id is specified, the detail info of that machine will be displayed.",
                       "Options:",
                       "\t-h           - print this help infomation.",
                       "\t-l           - list, search, and send job to machines which is managed by the system.",
                       "\t-d <id>      - list, search, and send job to machines which is managed by the system.",
                       "\t-s [pattern] - list, track the running machine.",
                       "\t\t pattern:  attr1:val1,attr2:val2,...attrn:valn",
		       "\t\t\t attr: id,name,status,usage,reservation,arch,kernel,product,ram,disk",
                       "\n"
                   ];
        _print_help(help, term);

    }

    function print_help_job( term )
    {
        var help = [
                       "Usage: job [options] [id]\n",
                       "Description: if no options specified, this command will print all the jobs in the system.",
                       "\t\tif job id is specified, the detail info of that job will be displayed.",
                       "Options:",
                       "\t-h          - print this help infomation.",
                       "\t-l          - list jobs in the system.",
                       "\t-d <job_id> - display job details.",
                       "\n"
                   ];
        _print_help(help, term);
    }

    function print_help_send( term )
    {
        var help = [
                       "Usage: send [options] [param]\n",
                       "Options:",
                       "\t-h - print this help infomation.",
                       "\t-l [PARAMS] - list jobs in the system.",
                       '        Params:',
                       '              -t|--jobtype <jobtype>  set the job type (number)',
                       '                                      1 Single machine',
                       '                                      2 QA package',
                       '                                      3 Autotest',
                       '                                      4 Multi machine',
                       "\t-r [PARAMS] send job to sut.",
                       '        Params:',
                       '              -t|--jobtype <jobtype>  set the job type (number)',
                       '                                      1 Single machine',
                       '                                      2 QA package',
                       '                                      3 Autotest',
                       '                                      4 Multi machine',
                       '                                      5 Reinstall\n',
                       '              -n|--testname <testname>',
                       '                                      set test name for the job work with -t option ',
                       '                                      (only for Single machine, QA package, Autotest, Multi machine).',
                       '                                      Seperate by \',\' for qa_package and autotest job.\n',
                       '              -r|--roles              for Multi machine jobs, set roles number and host',
                       '                                      Assign SUT to roles , format like:',
                       '                                         -r \'r0:host1,host2;r1:host3,host4\'',
                       '      ',
                       '              -u|--re_url [url]               set reinstall url',
                       '                 --re_sdk [url]               set reinstall sdk',
                       '                 --pattern [pattern1,...]     set install pattern',
                       '                 --rpms [rpm1,rpm2,...]       set extra rpm packages',
                       '                 --kexec                      use kexec',
                       '      ',
                       '              -x|--cmd                set cmd for jobtype command_line',
                       '              -m|--mail               set email address for job result',
                       '              -h|--host <ip-or-hostname>',
                       '                                      set the target SUT for the test',
                       '              -g|--group <name>       set the target host group for test',
                       "\n"
                   ];
        _print_help(help, term);
    }

    function print_help_scheme( term )
    {
        var help = [
                       "Usage: scheme [scheme]\n",
                       "Description: Change the color scheme of current shell environment. There are only two schemes installed",
                       "\t\t'white' and 'terminal'. you can switch bewteen them using this command.",
                       "\n"
                   ];
        _print_help(help, term);

    }

    function _print_help( helps, term )
    {
        $.each(helps, function(index, line){
            term.echo(line);
        }); 
    }

    function parse_machine_option(opts)
    {
        var args = [];
        var rpc = {category:'machine', args:[], name:""};
        $.each(opts, function(index, opt){
             if (opt == '-h')
             {
                 print_help_machine(term);
                 rpc.name='help';
             }
             else if (opt == '-s')
             {
                 rpc.name = 'machine_search';
             }
             else if (opt == '-l')
             {
                 rpc.name = 'machine_list';
             }
             else if (opt == '-d')
             {
                 rpc.name = 'machine_get';
             }
             else {
                 if(index == 0) {
                     print_help_machine(term);
                     rpc.name='help';
                 } else {
                     rpc.args.push(opt);
                 }
             }

        });
        if ( !rpc.name )
        {
            rpc.name = 'machine_get';
            
            if ( rpc.args.length == 0 )
            {
                rpc.name = 'machine_list';
            }
        }

        return rpc;
    }
    function parse_job_option(opts)
    {
        var args = [];
        var rpc = {category:'job', args:[], name:""};
        $.each(opts, function(index, opt){
             if (opt == '-h')
             {
                 print_help_job(term);
                 rpc.name='help';
             }
             else if (opt == '-l')
             {
                 rpc.name = 'job_list';
             }
             else if (opt == '-d')
             {
                 rpc.name = 'job_get';
             }
             else {
                 if(index == 0) {
                     print_help_job(term);
                     rpc.name='help';
                 } else {
                     rpc.args.push(opt);
                 }
             }

        });
        if( !rpc.name ) 
            rpc.name = 'job_list';

        return rpc;
    }
    function parse_send_option(opts)
    {
        var args = [];
        var rpc = {category:'send', args:[], name:"help"};
        $.each(opts, function(index, opt){
             if (opt == '--help')
             {
                 print_help_send(term);
                 rpc.name='help';
             }
             else if (opt == '-f')
             {
                 rpc.name = 'send_list';
             }
             else if (opt == '-r')
             {
                 rpc.name = 'send_run';
             }
             else {
                 if(index == 0) {
                     print_help_send(term);
                     rpc.name='help';
                 } else {
                     rpc.args.push(opt);
                 }
             }

        });
        return rpc;
    }
    
    function parse_scheme_option(opts)
    {
        if (!opts)
            return;
        var scheme = opts[0];
        if ( !scheme )
            print_help_scheme(term);
        
        scheme ? $("#hamsta_webshell").attr('class', scheme) : null;
    }
}
