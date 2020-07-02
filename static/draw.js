// Only show new chat prompt page if user name in local Storage
if (!localStorage.getItem('username')) {
  location.replace('/name');
}

else {

  document.addEventListener('DOMContentLoaded', () => {

      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

      // state
      let draw = false;

      // elements
      let points = [];
      let lines = [];
      let svg = null;

      function render() {

          // create the selection area
          svg = d3.select('#draw')
                  .attr('height', window.innerHeight)
                  .attr('width', window.innerWidth);

          svg.on('mousedown', function() {
              draw = true;
              const coords = d3.mouse(this);
              draw_point(coords[0], coords[1], false);
          });

          svg.on('mouseup', () =>{
              draw = false;
          });

          svg.on('mousemove', function() {
              if (!draw)
                  return;
              const coords = d3.mouse(this);
              draw_point(coords[0], coords[1], true);
          });

          document.querySelector('#erase').onclick = () => {
              for (let i = 0; i < points.length; i++)
                  points[i].remove();
              for (let i = 0; i < lines.length; i++)
                  lines[i].remove();
              points = [];
              lines = [];
          }

          socket.on('connect', () => {
            document.querySelector('#send').onclick = () => {
              let cx = []
              let cy = []
              let r = []
              for (let i = 0; i < points.length; i++) {
                cx.push(points[i].attr('cx'));
                cy.push(points[i].attr('cy'));
                r.push(points[i].attr('r'));
              }

              socket.emit('send drawing', {'chat_room': localStorage.getItem('actual-chat-room'), 'user': localStorage.getItem('username'), 'cx': cx, 'cy': cy, 'r': r})
              //socket.emit('send drawing', {'chat_room': localStorage.getItem('actual-chat-room'), 'points': points, 'lines': lines})

              // set time out before runing afterTimeOut function. Otherwise new chat is not emit to flask
              window.setTimeout('afterTimeOut()', 1);
              /*for (let i = 0; i < points.length; i++) {
                //console.log(points[i].attr('cx'));
                draw_point(points[i].attr('cx'), points[i].attr('cy'), false);
              }*/
            }
          });

      }

      function draw_point(x, y, connect) {

          const color = document.querySelector('#color-picker').value;
          const thickness = document.querySelector('#thickness-picker').value;

          if (connect) {
              const last_point = points[points.length - 1];
              const line = svg.append('line')
                              .attr('x1', last_point.attr('cx'))
                              .attr('y1', last_point.attr('cy'))
                              .attr('x2', x)
                              .attr('y2', y)
                              .attr('stroke-width', thickness * 2)
                              .style('stroke', color);
              lines.push(line);
          }

          const point = svg.append('circle')
                           .attr('cx', x)
                           .attr('cy', y)
                           .attr('r', thickness)
                           .style('fill', color);
          points.push(point);
      }

      render();
  });

}

function afterTimeOut() {
  location.replace('/');
}
