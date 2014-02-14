window.onload = function() {
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 500,
        height: 800
    });
    var layer = new Kinetic.Layer();
    var bird = null;

    var imageObj = new Image();
    imageObj.onload = function() {
        var blob = bird = new Kinetic.Sprite({
            x: 50,
            y: 40,
            image: imageObj,
            animation: 'idle',
            animations: {
                idle: [
                // x, y, width, height (4 frames)
                2, 2, 70, 119, 71, 2, 74, 119, 146, 2, 81, 119, 226, 2, 76, 119],
                punch: [
                // x, y, width, height (3 frames)
                2, 138, 74, 122, 76, 138, 84, 122, 346, 138, 120, 122]
            },
            frameRate: 7,
            frameIndex: 0
        });

        bird.scale({
            x: 0.5,
            y: 0.5
        });

        // add the shape to the layer
        layer.add(blob);

        // add the layer to the stage
        stage.add(layer);

        // start sprite animation
        blob.start();

        var frameCount = 0;

        blob.on('frameIndexChange',
        function(evt) {
            if (blob.animation() === 'punch' && ++frameCount > 3) {
                blob.animation('idle');
                frameCount = 0;
            }
        });

        document.getElementById('restart').addEventListener('click',
        function() {
            window.location.reload();
        },
        false);

        anim = new Kinetic.Animation(function(frame) {
            if (_gameOvered) anim.stop();
            vy += frame.timeDiff * g;
            h += frame.timeDiff * vy;
            if (h > 700) h = 700;
            blob.setY(h);
        },
        layer);

        var vy = -1,
        g = 0.002,
        h = blob.getY();

        document.getElementById('container').addEventListener('click',
        function() {
            if (_gameOvered) return;
            vy = -.6;
            anim.start();
        },
        false);
    };
    imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/blob-sprite.png';

    var piplineImg = new Image();
    var _piplineImgLoaded = false;
    piplineImg.onload = function() {
        _piplineImgLoaded = true;
    };

    piplineImg.src = "http://stonesun.kd.io/pipline.png";
    var firstPipline = null;
    setTimeout(function() {
        console.debug(_piplineImgLoaded);
        if (_piplineImgLoaded) {
            var pipline = firstPipline = createPipline(3);

            // add the shape to the layer
            layer.add(pipline);
            console.debug(pipline);
            pipline.move();
            while (pipline.next) {
                layer.add(pipline.next);
                pipline = pipline.next;
            }

            pipline.next = firstPipline;

            bird.moveToTop();
        }
    },
    1000);

    function createPipline(initNextCount) {
        var offset = 100;
        var openDoor = 200;
        var heightOfHalfPipline = 800 - offset - openDoor;
        var totalHeight = heightOfHalfPipline * 2 + openDoor;
        var result = new Kinetic.Image({
            x: 500,
            y: 0,
            image: piplineImg,
            width: 100,
            height: totalHeight
        });

        result.anim = new Kinetic.Animation(function(frame) {
            if (result.getX() <= bird.getX() + 40 && result.getX() + 100 >= bird.getX()) {
                var doorTop = heightOfHalfPipline + result.getY();
                var doorBottom = doorTop + openDoor;
                console.debug(bird.getY());
                console.debug(result.getY());
                console.debug(doorTop);
                console.debug(doorBottom);
                if (bird.getY() < doorTop || bird.getY() + 60 > doorBottom) {
                    gameOver();
                }
            }

            result.setX(result.getX() - frame.timeDiff / 10);

            if (result.getX() < -105) {
                result.anim.stop();
                result.started = false;
            }

            if (result.getX() < 200 && !result.next.started) {
                result.next.move();
            }
        },
        layer);

        result.move = function() {
            result.setX(500);
            result.setY( - Math.random() * (totalHeight - 800));
            result.anim.start();
            result.started = true;
        }

        result.stop = function() {
            result.anim.stop();
        }

        if (initNextCount > 0) {
            result.next = createPipline(--initNextCount);
        }

        return result;
    }
    var _gameOvered = false;
    function gameOver() {
        var pipline = firstPipline;
        pipline.stop();
        while (pipline.next && pipline.next != firstPipline) {
            pipline.next.stop();
            pipline = pipline.next;
        }

        _gameOvered = true;
        //anim.start();
    }
};
