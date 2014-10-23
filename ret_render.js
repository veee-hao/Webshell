function printer(Term)
{
    this.t = Term;
    String.prototype.repeat = function( num )
    {
        return new Array( num + 1 ).join( this );
    }

    this.print_table = function(col,data) {
        var table = '<div';
        if(data.length >16) 
            table += ' class="long-list" ';
        table += '><table><thead><tr>';
        for(var i=0;i<col.length;i++) {
	    table += '<th class="dotted">';
	    table += col[i].disname;
	    table += "</th>";
        }
	table += '</tr></thead><tbody>'
	for(var j=0;j<data.length;j++) {
	    table += '<tr>';
	    for(var i=0;i<col.length;i++) {
	        table += '<td class="dotted">';
	        //table += data[j][col[i].dbname];
                if(data[j][col[i].dbname] != "")
	            table += data[j][col[i].dbname];
	        else
		    table += '&nbsp';
		table += "</td>";
	    }
	    table += "</tr>";
	}
        table += '</tbody></table></div>';
	this.print_html(table);
    };

    this.print_property = function(keys,m,h) {
        var table = '<table><thead><tr>';
        $.each(h, function(i,e) {
            table += '<th>' + e + '</th>';
        });
        table += '</thead><tbody>';
        $.each(keys, function(i, k) {
            table += '<tr><td>';
            table += k.disname;        
            table += '</td><td>';
            if(m[k.dbname] != "")
                table += m[k.dbname];
            else
                table += '&nbsp';
            table += '</td></tr>';
        });
        table += '</tbody></table>';
	this.print_html(table);
    };
    
    this.print_array = function(data) {
        var table = '<table>';
        for(var i=0; i<data.length; i++) {
            table = table+'<tr><td>'+data[i]+'</td></tr>';
        }
        this.print_html(table);
    }
    this.print_error = function(str) {
        this.print_html("<err>"+str+"</err>");
    }
    this.print_html = function(str) {
        this.t.echo(str,{raw:true});
    }
    this.printl = function(str) {
        this.t.echo(str);
    }
}
