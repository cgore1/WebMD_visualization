function loadTimeline(topic)
{
//$(document).ready(function() {
   // month
      d3.select("#monthChart").html('');
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        if(!topic)
          return;

        data = [];
        for(var i=0; i<monthNames.length; i++)
        {
           var r = {};
           // r.date = parseDate(m)
           r.period = monthNames[i];
           r.value = monthD[topic][i];
           if(r.value == undefined)
           {
             r.value = 0;
           }
           data.push(r);
        }
        Morris.Bar({
          element: 'monthChart',
          data,
          xkey: 'period',
          hideHover: 'auto',
          barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
          ykeys: ['value'],
          labels: ['value'],
          xLabelAngle: 60,
          resize: true
        });

        $MENU_TOGGLE.on('click', function() {
          $(window).resize();
        });



        // draw hour

        d3.select("#hourChart").html('');

        if(!topic)
          return;

        data = [];
        for(var i=1; i<25; i++)
        {
           var r = {};
           // r.date = parseDate(m)
           r.period = i;
           r.value = hourData[topic][i];
           if(r.value == undefined)
           {
             r.value = 0;
           }
           data.push(r);
        }

        Morris.Bar({
          element: 'hourChart',
          data,
          xkey: 'period',
          hideHover: 'auto',
          barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
          ykeys: ['value', 'sorned'],
          labels: ['value', 'SORN'],
          xLabelAngle: 60,
          resize: true
        });

        $MENU_TOGGLE.on('click', function() {
          $(window).resize();
        });

//      });
}
