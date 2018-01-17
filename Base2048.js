(function($) 
{
    var score = 0;
    var size = 4;

    $.fn.game2048 = function() 
    {
        function generate_map()
        {
            var bord_thick = size*122+50;
            var borda = $('<div style= "width:'+ bord_thick + 'px; box-shadow: 10px 20px 5px grey; align-items: center; justify-content: center; margin-left: 30%"></div>');
            var table = $('<table></table>').css({"border-spacing": "10px", "padding": "15px", "background-color": "DarkSlateGrey", "overflow": "auto"});
            for (var y = 0; y < size; y++){
                var ligne = $('<tr></tr>');
                for (var x = 0; x < size; x++) {
                    var cases = $('<td id = "cell">0</td>').attr('x', x).attr('y', y).attr('nbr', 0).attr('merge', 0).css({"background-color": "CadetBlue", "width": "112px", "height": "112px", "border-radius": "25px", "font-size": "50px", "text-align": "center", "font-family": "'Arial'", "font-weight": "bold"});
                    ligne.append(cases);
                }
                table.append(ligne);
                borda.append(table);
            }
            return borda;
        }

        function displayStructure(){

            var head = $('<div><h1>2048</h1></div>').css({"text-align": "center", "font-size": "32px", "font-family": "'Arial'", "color": "DarkSlateGrey"});
            var instr = $('<div><p class="instr"> Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p> </div>').css({"font-size": "19px", "padding": "5px", "margin-left": "15%", "margin-right": "15%", "margin-bottom": "10px", "font-family": "Arial", "background-color": "#f6f6f6"});
            var set = $('<div style= "display: inline-flex"><input style= "width: 100px; height: 50px" type="button" value="New game" onclick="window.location.reload()"> <p id="score" style="width: 100px; height: 50px; color:white; background-color: DarkSlateGrey; font-weight: bold; font-size:22px; margin:0px; vertical-align:bottom">Score</p></div>');
          
            instr.append(set);
            head.append(instr);

            return head;
        }

        function generate_case(cases)
        {
            for (var i = 0; i < cases; i++)
            {
                var x = Math.floor((Math.random() * size));
                var y = Math.floor((Math.random() * size));

                var value =  2 * (Math.floor((Math.random() * 2) + 1));
                
                var elem = $('[x="' + x + '"][y="' + y + '"][nbr=0]');

                if (value === 4 && Math.random() > 0.5)
                    value = 2;
                
                if (!elem[0])
                    generate_case(cases - i);
                
                else {
                    elem.attr('nbr', value);  //// 2 or 4 as value (nbr) in cell
                    elem.text(value).css({"font-size": "50px", "text-align": "center"});  ///displays value
                    setColor();
                }
            }
        }

        function reset_merge(){
        //back to attr merge = 0 out of loop

            for(var y = 0; y <= (size-1); y++){

                for(var x = 0; x <= (size-1); x++){

                    var arrival = $('[x = "'+x+'"][y = "'+y+'"]');
                    arrival.attr('merge', 0);
                }
            }
        }


        function moveLeft(){
          
            reset_merge();

            let move = false;

            for(var y = 0; y <= (size-1); y++){  ////esse loop esta isolado, ele so serve p/ mudar de linha. toda operacao acontece no x

                for(var x = 0; x <= (size-1); x++){

                    for(var tmp = x; tmp > 0; tmp--) {

                        var depart = $('[x = "'+tmp+'"][y = "'+y+'"]');
                        var arrival = $('[x = "'+(tmp-1)+'"][y = "'+y+'"]');
                        ///// identif position

                        var value_depart = parseInt(depart.attr('nbr'));
                        var value_arrival = parseInt(arrival.attr('nbr'));
                        ///// identif value 'nbr'

                        var merge = parseInt(depart.attr('merge')) || parseInt(arrival.attr('merge'));   

                        if(value_depart === value_arrival && merge !== 1 && value_arrival !== 0 && value_depart !== 0){
                            //console.log("condition1");
                            arrival.text(value_depart + value_arrival);
                            var mergeValue = arrival.attr('nbr', (value_depart + value_arrival));
                            depart.attr('nbr', 0);
                            depart.text('0');
                            arrival.attr('merge', 1);
                            move = true;
                            score += parseInt(mergeValue.attr('nbr'));
                        }

                        else if(value_depart !== value_arrival && value_arrival === 0){
                            //console.log("condition2");
                            arrival.attr('nbr', value_depart);
                            arrival.text(value_depart);
                            depart.attr('nbr', 0);
                            depart.text('0');
                            move = true;
                        }
                    }
                }
            }
            return move;
        }

        function moveRight(){
            
            reset_merge();

            let move = false;

            for(var y = 0; y <= (size-1); y++){

                for(var x = (size-1); x >= 0; x--){

                    for(var tmp = x; tmp <= (size-1); tmp++) {

                        var depart = $('[x = "'+tmp+'"][y = "'+y+'"]');
                        var arrival = $('[x = "'+(tmp+1)+'"][y = "'+y+'"]');

                        var value_depart = parseInt(depart.attr('nbr'));
                        var value_arrival = parseInt(arrival.attr('nbr'));

                        var merge = parseInt(depart.attr('merge')) || parseInt(arrival.attr('merge'));   

                        if(value_depart === value_arrival && merge !== 1 && value_arrival !== 0 && value_depart !== 0){
                            arrival.text(value_depart + value_arrival);
                            var mergeValue = arrival.attr('nbr', (value_depart + value_arrival));
                            depart.attr('nbr', 0);
                            depart.text('0');
                            arrival.attr('merge', 1);
                            move = true;
                            score += parseInt(mergeValue.attr('nbr'));
                        }

                        else if(value_depart !== value_arrival && value_arrival === 0) {
                            arrival.attr('nbr', value_depart);
                            arrival.text(value_depart);
                            depart.attr('nbr', 0);
                            depart.text('0');
                            move = true;
                        }
                    }
                }
            }
            return move;
        }


        function moveDown(){

            reset_merge();

            let move = false;

            for(var x = 0; x <= (size-1); x++){ 

                for(var y = (size-1); y >= 0; y--){

                    for(var tmp = y; tmp <= (size-1); tmp++) {

                        var depart = $('[x = "'+x+'"][y = "'+tmp+'"]');
                        var arrival = $('[x = "'+x+'"][y = "'+(tmp+1)+'"]');

                        var value_depart = parseInt(depart.attr('nbr'));
                        var value_arrival = parseInt(arrival.attr('nbr'));

                        var merge = parseInt(depart.attr('merge')) || parseInt(arrival.attr('merge'));   

                        if(value_depart === value_arrival && merge !== 1 && value_arrival !== 0 && value_depart !== 0){
                            arrival.text(value_depart + value_arrival);
                            var mergeValue = arrival.attr('nbr', (value_depart + value_arrival));
                            depart.attr('nbr', 0);
                            depart.text('0');
                            arrival.attr('merge', 1);
                            move = true;
                            score += parseInt(mergeValue.attr('nbr'));                  
                        }

                        else if(value_depart !== value_arrival && value_arrival === 0){
                            arrival.attr('nbr', value_depart);
                            arrival.text(value_depart);
                            depart.attr('nbr', 0);
                            depart.text('0');
                            move = true;
                        }
                    }
                }
            }

            return move;       
        }


        function moveUp(){

            reset_merge();

            let move = false;

            for(var x = 0; x <= (size-1); x++){ 

                for(var y = 0; y <= (size-1); y++){

                    for(var tmp = y; tmp > 0; tmp--) {

                        var depart = $('[x = "'+x+'"][y = "'+tmp+'"]');
                        var arrival = $('[x = "'+x+'"][y = "'+(tmp-1)+'"]');

                        var merge = parseInt(depart.attr('merge')) || parseInt(arrival.attr('merge'));   

                        var value_depart = parseInt(depart.attr('nbr'));
                        var value_arrival = parseInt(arrival.attr('nbr'));

                        if(value_depart === value_arrival && merge !== 1 && value_arrival !== 0 && value_depart !== 0){
                            arrival.text(value_depart + value_arrival);
                            var mergeValue = arrival.attr('nbr', (value_depart + value_arrival));
                            depart.attr('nbr', 0);
                            depart.text('0');
                            arrival.attr('merge', 1);
                            move = true;
                            score += parseInt(mergeValue.attr('nbr'));                 
                        }

                        else if(value_depart !== value_arrival && value_arrival === 0){
                            arrival.attr('nbr', value_depart);
                            arrival.text(value_depart);
                            depart.attr('nbr', 0);
                            depart.text('0');
                            move = true;
                        }
                    }    
                }
            }
            return move;
        }

        function setColor(){      
            $('td').each(function(){
                if(parseInt($(this).attr('nbr')) === 0) {$(this).css({"background-color": "CadetBlue", "color": "transparent"});}
                if(parseInt($(this).attr('nbr')) === 2) {$(this).css({"background-color": "rgb(95, 128, 160)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 4) {$(this).css({"background-color": "rgb(13, 130, 148)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 8) {$(this).css({"background-color": "rgb(109, 208, 223)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 16) {$(this).css({"background-color": "rgb(0, 102, 102)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 32) {$(this).css({"background-color": "rgb(140, 204, 204)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 64) {$(this).css({"background-color": "rgb(0, 112, 141)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 128) {$(this).css({"background-color": "rgb(0, 152, 190)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 256) {$(this).css({"background-color": "rgb(100, 131, 123)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 512) {$(this).css({"background-color": "rgb(26, 255, 195)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 1024) {$(this).css({"background-color": "rgb(95, 108, 160)", "color": "#F0F0F0"});}
                if(parseInt($(this).attr('nbr')) === 2048) {$(this).css({"background-color": "rgb(255, 102, 102)", "color": "blue"});}
             });
        }


        $('html').keydown(function(event) {
            let a;
        
            switch (event['key']) {
                case 'ArrowLeft':
                    a = moveLeft();
                    break;

                case 'ArrowUp':
                    a = moveUp();
                    break;

                case 'ArrowRight':
                    a = moveRight();
                    break;

                case 'ArrowDown':
                    a = moveDown();
                    break;
            }
            if(a == true){
                generate_case(1);
            }

            setColor();
            $('#score').text(score);
            setWin();
            gameOver();
        });

 
        function setWin(){

            var win;
            
            $('td').each(function(){
                if(parseInt($(this).attr('nbr')) === 2048){
                    setTimeout(function(){
                        alert("You win");
                        $('td').attr('nbr', 0).text('0');
                        generate_map();
                        generate_case(2);
                        }, 120);                                      
                }
            });   
        }
        

        function gameOver(){

            if($('[nbr=0]')[0]){
                return;
            }

            for(var x = 0; x <= (size-1); x++){
                for(var y = 0; y <= (size-1); y++){

                    var y_plus = (parseInt($('[x = "'+x+'"][y = "'+(y+1)+'"]').attr('nbr')));
                    var y_minus = (parseInt($('[x = "'+x+'"][y = "'+(y-1)+'"]').attr('nbr')));
                    var x_plus = (parseInt($('[x = "'+(x+1)+'"][y = "'+y+'"]').attr('nbr')));
                    var x_minus = (parseInt($('[x = "'+(x-1)+'"][y = "'+y+'"]').attr('nbr')));
                    var current = (parseInt($('[x = "'+x+'"][y = "'+y+'"]').attr('nbr')));

                    if(x>0 && current==x_minus){
                        return;
                    }

                    if(y>0 && current==y_minus){
                        return;
                    }

                    if(x<(size-1) && current==x_plus){
                        return;
                    }

                    if(y<(size-1) && current==y_plus){
                        return;
                    }
                }
            }

            setTimeout(function(){
            alert("YOU SUCK!");
            $('td').attr('nbr', 0).text('0');
            generate_map();
            generate_case(2);
            }, 120); 
                   
        }

        $(this).append(displayStructure());
        setColor();
        $(this).append(generate_map());
        generate_case(2);
    }

})(jQuery);
