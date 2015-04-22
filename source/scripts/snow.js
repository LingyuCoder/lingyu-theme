var Util = function() {
    function isType(type) {
        return function(value) {
            return Object.prototype.toString.call(value).toLowerCase() === '[object ' + type + ']';
        }
    }

    function irand(min, max) {
        return Math.floor((min || 0) + Math.random() * ((max + 1 || Number.MAX_SAFE_INTEGER) - (min || 0)));
    }

    function frand(min, max) {
        return (min || 0) + Math.random() * ((max || 1) - (min || 0));
    }

    function sequence(min, max) {
        var seq = [];
        var i, pos;

        if (isType('array')(min)) {
            seq = min.slice(0);
        } else {
            for (i = min; i <= max; i++) {
                seq[i - min] = i;
            }
        }

        for (i = seq.length; i--;) {
            pos = irand(0, i)
            seq[i] = [seq[pos], seq[pos] = seq[i]][0];
        }

        return seq;
    }

    return {
        isType: isType,
        Rand: {
            irand: irand,
            frand: frand,
            sequence: sequence
        }
    };
}(this);

var Vector2 = (function() {
    function Vector2(x, y) {
        if (!this instanceof Vector2) return new Vector2(x, y);
        if (x instanceof Vector2) {
            this.x = x.x;
            this.y = x.y;
            return;
        }
        this.x = x || 0;
        this.y = y || 0;
    }

    var proto = Vector2.prototype;

    proto.add = function(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    proto.magnitude = function() {
        return Math.sqrt(this.squaredMagnitude());
    }

    proto.scale = function(scale) {
        this.x *= scale;
        this.y *= scale;
    }

    proto.sub = function(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    proto.negate = function() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    proto.squaredMagnitude = function() {
        return this.x * this.x + this.y * this.y;
    }

    proto.normalize = function() {
        var magnitude = this.magnitude();
        if (magnitude) {
            this.x /= magnitude;
            this.y /= magnitude;
        }
        return this;
    }

    proto.rotate = function(angle) {
        var x = this.x;
        var y = this.y;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    }

    proto.dot = function(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    proto.toString = function() {
        return '(' + this.x.toFixed(3) + ',' + this.y.toFixed(3) + ')';
    }

    return Vector2;
}(this));

var Snow = (function() {
    function microtime() {
        return new Date().getTime() * 0.001;
    }

    function Particle(origin, velocity, size, amplitude, rspeed, alpha, image) {
        this.origin = origin;
        this.position = new Vector2(origin.x, origin.y);
        this.velocity = velocity || new Vector2(0, 0);
        this.size = size;
        this.rspeed = rspeed;
        this.amplitude = amplitude;
        this.alpha = alpha;
        this.image = image;

        this.dx = Math.random() * 100;
        this.rotation = Math.random() * 360;
    }

    Particle.prototype.update = function(delta_time) {
        this.dx += this.velocity.x * delta_time;
        this.position.y += this.velocity.y * delta_time;
        this.position.x = this.origin.x + (this.amplitude * Math.sin(this.dx));
        this.rotation += this.rspeed * delta_time;
    }


    function Snow(canvas_id, options) {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.running = false;
        this.pImageObjects = [];
        this.start_time = this.frame_time = 0;

        this.resize(window.innerWidth, window.innerHeight);

        this.pAmount = options.amount || 500;
        this.pSize = options.size || [8, 26];
        this.pRotation = options.rotation || [-5, 5];
        this.pSwing = options.swing || [0.1, 1];
        this.pSpeed = options.speed || [40, 100];
        this.pAmplitude = options.amplitude || [20, 50];
        this.pAlpha = options.alpha || [0.25, 1];
        this.pImageNames = options.images || [];

        for (var i = 0; i < this.pImageNames.length; i++) {
            var image = new Image();
            image.src = this.pImageNames[i];
            this.pImageObjects.push(image);
        }

        this._init_particles();
    }

    var proto = Snow.prototype;

    proto.start = function() {
        this.running = true;
        this.start_time = this.frame_time = microtime();
        this._loop();
    };

    proto.end = function() {
        this.running = false;
    };

    proto.resize = function(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    };

    proto._loop = function() {
        if (this.running) {
            this._clear();
            this._update();
            this._draw();
            this._tick();
        }
    };

    proto._init_particles = function() {
        this.particles.length = 0;

        for (var i = 0; i < this.pAmount; i++) {
            var origin = new Vector2(Util.Rand.frand(0, this.canvas.width), Util.Rand.frand(-this.canvas.height, 0));
            var velocity = new Vector2(Util.Rand.frand(this.pSwing[0], this.pSwing[1]), Util.Rand.frand(this.pSpeed[0], this.pSpeed[1]));
            var size = Util.Rand.frand(this.pSize[0], this.pSize[1]);
            var amplitude = Util.Rand.frand(this.pAmplitude[0], this.pAmplitude[1]);
            var rspeed = Util.Rand.frand(this.pRotation[0], this.pRotation[1]) * ((Math.random() < 0.5) ? -1 : 1);
            var alpha = Util.Rand.frand(this.pAlpha[0], this.pAlpha[1]);
            var image = (this.pImageObjects.length > 0) ? Util.Rand.irand(0, this.pImageObjects.length - 1) : -1;

            this.particles.push(new Particle(origin, velocity, size, amplitude, rspeed, alpha, image));
        }
    };

    proto._update = function() {
        var now_time = microtime();
        var delta_time = now_time - this.frame_time;

        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];
            particle.update(delta_time);

            if (particle.position.y - particle.size > this.canvas.height) {
                particle.position.y = -particle.size * 2;
                particle.position.x = particle.origin.x = Math.random() * this.canvas.width;
            }
        }

        this.frame_time = now_time;
    };

    proto._draw = function() {
        this.ctx.fillStyle = 'rgb(255,255,255)';

        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];
            var center = -(particle.size / 2);

            this.ctx.save();
            this.ctx.translate(particle.position.x, particle.position.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.globalAlpha = this.particles[i].alpha;

            if (particle.image == -1)
                this.ctx.fillRect(center, center, particle.size, particle.size);
            else
                this.ctx.drawImage(this.pImageObjects[particle.image], center, center, particle.size, particle.size);

            this.ctx.restore();
        }
    };

    proto._clear = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    proto._tick = function() {
        window.requestAnimationFrame(this._loop.bind(this));
    };

    return Snow;
}(this));

