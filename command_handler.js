
function command_handler(p, r)
{
    /*var rpc =     {
                        category : 'machine | job | other'
                        name : 'func_name',
                        args: [],
                    };
   */
    this.parser = p;
  
    this.print_render = r;

    this.result_callback = null;
  
    this.error_callback  = null;

    this.run = function(rpc)
    {
        var h_rpc = null;
        
        if ( !rpc )
            return;  //help information

       

        if (rpc.category == 'machine')
        {
            h_rpc = new $.JsonRpcClient({ajaxUrl: '/hamsta/rpc_machine.php'});
            h_rpc.call(
                rpc.name, rpc.args,
                get_result_callback(rpc.name),
                get_error_callback(rpc.name)
            );
        }
        else if (rpc.category == 'job')
        {
            h_rpc = new $.JsonRpcClient({ajaxUrl: '/hamsta/rpc_job.php'});
            h_rpc.call(
                rpc.name, rpc.args,
                get_result_callback(rpc.name),
                get_error_callback(rpc.name)
            );
        }
        else if (rpc.category == 'send')
        {
            h_rpc = new $.JsonRpcClient({ajaxUrl: '/hamsta/rpc_send.php'});
            h_rpc.call(
                rpc.name, rpc.args,
                get_result_callback(rpc.name),
                get_error_callback(rpc.name)
            );
        }
        else {}
        
    }
    
    function get_result_callback(func_name)
    {
         var func = null;
         if (func_name == 'machine_list' || func_name == 'machine_search')
             func = machine_list_result_callback;
         else if (func_name == 'machine_get')
             func = machine_get_result_callback;
         else if (func_name == 'job_list')
             func = job_list_result_callback;
         else if (func_name == 'job_get')
             func = job_detail_result_callback;
         else if (func_name == 'send_list')
             func = send_list_result_callback;
         else if (func_name == 'send_run')
             func = send_run_result_callback;
         else
         {}
         return func;
    }

    function get_error_callback(func_name)
    {
        return function(error){ 
            if(error != null)
                this.r.print_error("RPC "+func_name+" error:"+error);
       };
    }


    function machine_list_result_callback( result )
    {
        var data = result;
        if (data.length > 0)
        {
            print_machine_list(data);
        }
         
    }
   
    function machine_get_result_callback( result )
    {
        var m = result;
        if (m)
        {
            print_machine_property(m);
        }
         
    }
    function print_machine_list(data)
    {
        var columns = [ {disname:'Id', dbname:'machine_id'}, {disname:'Hostname', dbname:'name'}, 
                        {disname:'Status', dbname:'machine_status'}, {disname:'Usage', dbname:'usage'}, 
                        {disname:'Reservation', dbname:'reservation'}, {disname:'Product', dbname:'product'}, 
                        {disname:'CPU_arch', dbname:'arch'}, {disname:'Kernel', dbname:'kernel'}, 
                      ];
        this.r.print_table(columns, data);

    }

    function print_machine_property(m)
    {
        var keys = [ {disname:'Id', dbname:'machine_id'}, {disname:'Hostname', dbname:'name'}, 
                     {disname:'Status', dbname:'machine_status'}, {disname:'Usage', dbname:'usage'}, 
                     {disname:'Reservation', dbname:'reservation'}, {disname:'Product', dbname:'product'}, 
                     {disname:'CPU arch', dbname:'arch'}, {disname:'Kernel', dbname:'kernel'}, 
                     {disname:'RAM', dbname:'memsize'}, {disname:'Disk size', dbname:'disksize'}, 
                     {disname:'MAC', dbname:'unique_id'}, {disname:'IP', dbname:'ip'}, 
                     {disname:'Type', dbname:'type'}, {disname:'Release', dbname:'release'}, 
                     {disname:'Serial console', dbname:'serialconsole'}, {disname:'Console device', dbname:'release'}, 
                     {disname:'Console speed', dbname:'consolespeed'}, {disname:'Default option', dbname:'default_option'}, 
                     {disname:'Power switch', dbname:'powerswitch'}, {disname:'Power switch type', dbname:'powertype'}, 
                     {disname:'Power switch slot', dbname:'powerslot'}, 
                     //{disname:'Description', dbname:'description'}, 
                   ];
        var head = [ "Attributes", 'Values' ];
        this.r.print_property(keys, m, head);
    }
    
    function job_list_result_callback( result )
    {
        var data = result;
        if (data.length > 0)
        {
            print_job_list(data);
        }
         
    }
    function job_detail_result_callback( result )
    {
        var data = result;
        print_job_detail(data);
         
    }

    function print_job_list(data)
    {
        var columns = [ {disname:'Id', dbname:'job_id'}, {disname:'Status', dbname:'job_status'},
                     {disname:'Hostname', dbname:'name'}, {disname:'Name', dbname:'short_name'}, 
                     {disname:'Started', dbname:'start'}, {disname:'Stopped', dbname:'stop'}, 
                   ];
        this.r.print_table(columns, data);
    }
    function print_job_detail(data)
    {
        var keys = [ {disname:'Id', dbname:'job_id'}, {disname:'Status', dbname:'job_status'},
                     {disname:'Hostname', dbname:'name'}, {disname:'Name', dbname:'short_name'}, 
                     {disname:'Started', dbname:'start'}, {disname:'Stopped', dbname:'stop'}, 
                   ];
        var head = [ "Attributes", 'Values' ];
        console.log(data);
        this.r.print_property(keys, data, head);
        var cols = [ {disname:'Date/Time', dbname:'log_time'}, {disname:'Type', dbname:'log_type'},
                     {disname:'Process', dbname:'log_what'}, {disname:'Message', dbname:'log_text'}, 
                   ];
        var log = data[0];
        this.r.print_table(cols, log);
    }
    function send_list_result_callback( result )
    {
        var data = result;
        if (data.length > 0)
        {
            this.r.print_array(data);
        }
    }
    function send_run_result_callback( result )
    {
        var data = result;
        if (data.length > 0)
        {
            this.r.printl(data);
        }
    }
}
