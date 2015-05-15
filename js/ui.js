document.addEventListener("DOMContentLoaded", function(event) {
  var scale = 1,
    gestureArea = document.getElementById('gesture-area'),
    scaleElement = document.getElementById('scale-element'),
    hasZoomed = false;

  scaleElement.addEventListener( 'webkitTransitionEnd', function() {
    scaleElement.classList.remove('transitions');
    gestureArea.classList.remove('transitions');
  }, false );

  interact(scaleElement).gesturable({
    onstart: function (event) {
      scaleElement.classList.remove('reset');
    },
    onmove: function (event) {
      scale = scale * (1 + event.ds);

      scaleElement.style.webkitTransform =
      scaleElement.style.transform =
        'scale(' + scale + ') translate(' + (scaleElement.getAttribute('data-x')*scale) + 'px, ' + (scaleElement.getAttribute('data-y')*scale) + 'px)';
      scaleElement.setAttribute('data-scale', scale);
    },
    onend: function (event) {
      scaleElement.classList.add('reset');
    }
  }).draggable({
    // enable inertial throwing
    inertia: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      var textEl = event.target.querySelector('p');

      textEl && (textEl.textContent =
        'moved a distance of '
        + (Math.sqrt(event.dx * event.dx +
                     event.dy * event.dy)|0) + 'px');
    }
  }).on('doubletap', function (event) {
    if(scale !== 1) {
      scale = 1;
      scaleElement.classList.add('transitions');
      scaleElement.style.webkitTransform =
      scaleElement.style.transform =
        'translate(0px, 0px)';
      scaleElement.setAttribute('data-x', 0);
      scaleElement.setAttribute('data-y', 0);
    } else {
      scale = scale * (2);
    }
    hasZoomed = !hasZoomed;

    scaleElement.classList.add('transitions');
    scaleElement.style.webkitTransform =
    scaleElement.style.transform =
      'scale(' + scale + ') translate(' + (scaleElement.getAttribute('data-x') * scale) + 'px, ' + (scaleElement.getAttribute('data-y') * scale) + 'px)';
    scaleElement.setAttribute('data-scale', scale);
  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy,
        scale = (parseFloat(target.getAttribute('data-scale')) || 1);


    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'scale(' + scale + ') translate(' + (x/scale) + 'px, ' + (y/scale) + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing demo
  window.dragMoveListener = dragMoveListener;;

  // prevent browser's native drag on the image
  gestureArea.addEventListener('dragstart', function (event) {
      event.preventDefault();
  });
});