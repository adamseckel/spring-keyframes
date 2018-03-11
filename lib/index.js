'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.spring = spring;

exports.default = function (_ref12, options) {
  var from = _ref12.from,
      to = _ref12.to;

  return (0, _emotion.keyframes)(spring({ from: from, to: to }, options));
};

var _springer = require('springer');

var _springer2 = _interopRequireDefault(_springer);

var _emotion = require('emotion');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaults = {
  stiffness: 0.5,
  damping: 0.8,
  precision: 2,
  unit: 'px'
};
var numFrames = { length: 101 };
var transformMap = ['x', 'y', 'scale'];

function roundToPrecision(num) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var decimalPoints = Array.from({ length: precision }).reduce(function () {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return count * 10;
  });
  return Math.ceil(num * decimalPoints) / decimalPoints;
}

function calcPropTweenVal(prop, frame, from, to, _ref) {
  var damping = _ref.damping,
      stiffness = _ref.stiffness,
      precision = _ref.precision;

  return roundToPrecision(from[prop] + (to[prop] - from[prop]) * (0, _springer2.default)(damping, stiffness)(frame / 100), precision);
}

function createCalcPropTweenVal(from, to, options) {
  return function (prop, frame) {
    return calcPropTweenVal(prop, frame, from, to, options);
  };
}

function splitTransform(prop, v) {
  var transformList = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  return transformMap.includes(prop) ? { transform: [].concat(_toConsumableArray(transformList), [[prop, v]]) } : _defineProperty({}, prop, v);
}

function reduceFrame(tween, property, value) {
  return _extends({}, tween, splitTransform(property, value, tween.transform));
}

function mapTransformPropToCss(prop, spring) {
  var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'px';

  switch (prop) {
    case 'y':
      return 'translateY(' + spring + unit + ')';
    case 'x':
      return 'translateX(' + spring + unit + ')';
    case 'scale':
      return 'scale3d(' + spring + ', ' + spring + ', 1)';
    default:
      return prop + '(' + spring + ')';
  }
}

function mapTransformProps(spring, unit) {
  return spring.reduce(function (transform, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        prop = _ref4[0],
        spring = _ref4[1];

    return transform + ' ' + mapTransformPropToCss(prop, spring, unit);
  }, 'transform:');
}

function mapPropTypes(prop, spring, unit) {
  return prop === 'transform' ? mapTransformProps(spring, unit) + ';' : prop + ': ' + spring + ';';
}

function mapToCss(spring, unit) {
  return Object.keys(spring).reduce(function (animation, prop) {
    return animation + ' ' + mapPropTypes(prop, spring[prop], unit);
  }, '');
}

function spring(_ref5, options) {
  var from = _ref5.from,
      to = _ref5.to;

  var _defaults$options = _extends({}, defaults, options),
      stiffness = _defaults$options.stiffness,
      damping = _defaults$options.damping,
      precision = _defaults$options.precision,
      unit = _defaults$options.unit;

  var calcTween = createCalcPropTweenVal(from, to, {
    stiffness: stiffness,
    damping: damping,
    precision: precision
  });

  return Array.from(numFrames).map(function (_, frame) {
    return [Object.keys(from).reduce(function (tween, prop) {
      return reduceFrame(tween, prop, calcTween(prop, frame));
    }, {}), frame];
  }).filter(function (_ref6, i, frames) {
    var _ref7 = _slicedToArray(_ref6, 2),
        spring = _ref7[0],
        frame = _ref7[1];

    var lastIndex = i - 1 > 0 ? i - 1 : 0;
    return lastIndex > 0 ? frames[lastIndex][0] !== spring : true;
  }).reduce(function (frames, _ref8) {
    var _ref9 = _slicedToArray(_ref8, 2),
        spring = _ref9[0],
        frame = _ref9[1];

    return [].concat(_toConsumableArray(frames), [[frame + '%', mapToCss(spring, unit)]]);
  }, []).map(function (_ref10) {
    var _ref11 = _slicedToArray(_ref10, 2),
        frame = _ref11[0],
        spring = _ref11[1];

    return frame + ' { ' + spring + ' }';
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzcHJpbmciLCJvcHRpb25zIiwiZnJvbSIsInRvIiwiZGVmYXVsdHMiLCJzdGlmZm5lc3MiLCJkYW1waW5nIiwicHJlY2lzaW9uIiwidW5pdCIsIm51bUZyYW1lcyIsImxlbmd0aCIsInRyYW5zZm9ybU1hcCIsInJvdW5kVG9QcmVjaXNpb24iLCJudW0iLCJkZWNpbWFsUG9pbnRzIiwiQXJyYXkiLCJyZWR1Y2UiLCJjb3VudCIsIk1hdGgiLCJjZWlsIiwiY2FsY1Byb3BUd2VlblZhbCIsInByb3AiLCJmcmFtZSIsImNyZWF0ZUNhbGNQcm9wVHdlZW5WYWwiLCJzcGxpdFRyYW5zZm9ybSIsInYiLCJ0cmFuc2Zvcm1MaXN0IiwiaW5jbHVkZXMiLCJ0cmFuc2Zvcm0iLCJyZWR1Y2VGcmFtZSIsInR3ZWVuIiwicHJvcGVydHkiLCJ2YWx1ZSIsIm1hcFRyYW5zZm9ybVByb3BUb0NzcyIsIm1hcFRyYW5zZm9ybVByb3BzIiwibWFwUHJvcFR5cGVzIiwibWFwVG9Dc3MiLCJPYmplY3QiLCJrZXlzIiwiYW5pbWF0aW9uIiwiY2FsY1R3ZWVuIiwibWFwIiwiXyIsImZpbHRlciIsImkiLCJmcmFtZXMiLCJsYXN0SW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUFrRmdCQSxNLEdBQUFBLE07O2tCQWtDRCxrQkFBdUJDLE9BQXZCLEVBQWdDO0FBQUEsTUFBckJDLElBQXFCLFVBQXJCQSxJQUFxQjtBQUFBLE1BQWZDLEVBQWUsVUFBZkEsRUFBZTs7QUFDN0MsU0FBTyx3QkFBVUgsT0FBTyxFQUFFRSxVQUFGLEVBQVFDLE1BQVIsRUFBUCxFQUFxQkYsT0FBckIsQ0FBVixDQUFQO0FBQ0QsQzs7QUF0SEQ7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNRyxXQUFXO0FBQ2ZDLGFBQVcsR0FESTtBQUVmQyxXQUFTLEdBRk07QUFHZkMsYUFBVyxDQUhJO0FBSWZDLFFBQU07QUFKUyxDQUFqQjtBQU1BLElBQU1DLFlBQVksRUFB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LENBQXpCLENBQWpCO0FBQUEsS0FERixFQUVFLEVBRkYsQ0FEaUIsRUFLakJBLEtBTGlCLENBQWQ7QUFBQSxHQURBLEVBUUpxQixNQVJJLENBUUcsaUJBQWtCQyxDQUFsQixFQUFxQkMsTUFBckIsRUFBZ0M7QUFBQTtBQUFBLFFBQTlCN0MsTUFBOEI7QUFBQSxRQUF0QnNCLEtBQXNCOztBQUN0QyxRQUFNd0IsWUFBWUYsSUFBSSxDQUFKLEdBQVEsQ0FBUixHQUFZQSxJQUFJLENBQWhCLEdBQW9CLENBQXRDO0FBQ0EsV0FBT0UsWUFBWSxDQUFaLEdBQWdCRCxPQUFPQyxTQUFQLEVBQWtCLENBQWxCLE1BQXlCOUMsTUFBekMsR0FBa0QsSUFBekQ7QUFDRCxHQVhJLEVBWUpnQixNQVpJLENBYUgsVUFBQzZCLE1BQUQ7QUFBQTtBQUFBLFFBQVU3QyxNQUFWO0FBQUEsUUFBa0JzQixLQUFsQjs7QUFBQSx3Q0FDS3VCLE1BREwsSUFFRSxDQUFJdkIsS0FBSixRQUFjYyxTQUFTcEMsTUFBVCxFQUFpQlEsSUFBakIsQ0FBZCxDQUZGO0FBQUEsR0FiRyxFQWlCSCxFQWpCRyxFQW1CSmlDLEdBbkJJLENBbUJBO0FBQUE7QUFBQSxRQUFFbkIsS0FBRjtBQUFBLFFBQVN0QixNQUFUOztBQUFBLFdBQXdCc0IsS0FBeEIsV0FBbUN0QixNQUFuQztBQUFBLEdBbkJBLENBQVA7QUFvQkQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3ByaW5nZXIgZnJvbSAnc3ByaW5nZXInXG5pbXBvcnQgeyBrZXlmcmFtZXMgfSBmcm9tICdlbW90aW9uJ1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgc3RpZmZuZXNzOiAwLjUsXG4gIGRhbXBpbmc6IDAuOCxcbiAgcHJlY2lzaW9uOiAyLFxuICB1bml0OiAncHgnLFxufVxuY29uc3QgbnVtRnJhbWVzID0geyBsZW5ndGg6IDEwMSB9XG5jb25zdCB0cmFuc2Zvcm1NYXAgPSBbJ3gnLCAneScsICdzY2FsZSddXG5cbmZ1bmN0aW9uIHJvdW5kVG9QcmVjaXNpb24obnVtLCBwcmVjaXNpb24gPSAyKSB7XG4gIGNvbnN0IGRlY2ltYWxQb2ludHMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBwcmVjaXNpb24gfSkucmVkdWNlKFxuICAgIChjb3VudCA9IDEpID0+IGNvdW50ICogMTBcbiAgKVxuICByZXR1cm4gTWF0aC5jZWlsKG51bSAqIGRlY2ltYWxQb2ludHMpIC8gZGVjaW1hbFBvaW50c1xufVxuXG5mdW5jdGlvbiBjYWxjUHJvcFR3ZWVuVmFsKFxuICBwcm9wLFxuICBmcmFtZSxcbiAgZnJvbSxcbiAgdG8sXG4gIHsgZGFtcGluZywgc3RpZmZuZXNzLCBwcmVjaXNpb24gfVxuKSB7XG4gIHJldHVybiByb3VuZFRvUHJlY2lzaW9uKFxuICAgIGZyb21bcHJvcF0gK1xuICAgICAgKHRvW3Byb3BdIC0gZnJvbVtwcm9wXSkgKiBzcHJpbmdlcihkYW1waW5nLCBzdGlmZm5lc3MpKGZyYW1lIC8gMTAwKSxcbiAgICBwcmVjaXNpb25cbiAgKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDYWxjUHJvcFR3ZWVuVmFsKGZyb20sIHRvLCBvcHRpb25zKSB7XG4gIHJldHVybiAocHJvcCwgZnJhbWUpID0+IGNhbGNQcm9wVHdlZW5WYWwocHJvcCwgZnJhbWUsIGZyb20sIHRvLCBvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBzcGxpdFRyYW5zZm9ybShwcm9wLCB2LCB0cmFuc2Zvcm1MaXN0ID0gW10pIHtcbiAgcmV0dXJuIHRyYW5zZm9ybU1hcC5pbmNsdWRlcyhwcm9wKVxuICAgID8geyB0cmFuc2Zvcm06IFsuLi50cmFuc2Zvcm1MaXN0LCBbcHJvcCwgdl1dIH1cbiAgICA6IHsgW3Byb3BdOiB2IH1cbn1cblxuZnVuY3Rpb24gcmVkdWNlRnJhbWUodHdlZW4sIHByb3BlcnR5LCB2YWx1ZSkge1xuICByZXR1cm4geyAuLi50d2VlbiwgLi4uc3BsaXRUcmFuc2Zvcm0ocHJvcGVydHksIHZhbHVlLCB0d2Vlbi50cmFuc2Zvcm0pIH1cbn1cblxuZnVuY3Rpb24gbWFwVHJhbnNmb3JtUHJvcFRvQ3NzKHByb3AsIHNwcmluZywgdW5pdCA9ICdweCcpIHtcbiAgc3dpdGNoIChwcm9wKSB7XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZVkoJHtzcHJpbmd9JHt1bml0fSlgXG4gICAgY2FzZSAneCc6XG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZVgoJHtzcHJpbmd9JHt1bml0fSlgXG4gICAgY2FzZSAnc2NhbGUnOlxuICAgICAgcmV0dXJuIGBzY2FsZTNkKCR7c3ByaW5nfSwgJHtzcHJpbmd9LCAxKWBcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGAke3Byb3B9KCR7c3ByaW5nfSlgXG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwVHJhbnNmb3JtUHJvcHMoc3ByaW5nLCB1bml0KSB7XG4gIHJldHVybiBzcHJpbmcucmVkdWNlKFxuICAgICh0cmFuc2Zvcm0sIFtwcm9wLCBzcHJpbmddKSA9PlxuICAgICAgYCR7dHJhbnNmb3JtfSAke21hcFRyYW5zZm9ybVByb3BUb0Nzcyhwcm9wLCBzcHJpbmcsIHVuaXQpfWAsXG4gICAgJ3RyYW5zZm9ybTonXG4gIClcbn1cblxuZnVuY3Rpb24gbWFwUHJvcFR5cGVzKHByb3AsIHNwcmluZywgdW5pdCkge1xuICByZXR1cm4gcHJvcCA9PT0gJ3RyYW5zZm9ybSdcbiAgICA/IGAke21hcFRyYW5zZm9ybVByb3BzKHNwcmluZywgdW5pdCl9O2BcbiAgICA6IGAke3Byb3B9OiAke3NwcmluZ307YFxufVxuXG5mdW5jdGlvbiBtYXBUb0NzcyhzcHJpbmcsIHVuaXQpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHNwcmluZykucmVkdWNlKFxuICAgIChhbmltYXRpb24sIHByb3ApID0+XG4gICAgICBgJHthbmltYXRpb259ICR7bWFwUHJvcFR5cGVzKHByb3AsIHNwcmluZ1twcm9wXSwgdW5pdCl9YCxcbiAgICAnJ1xuICApXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcHJpbmcoeyBmcm9tLCB0byB9LCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgc3RpZmZuZXNzLCBkYW1waW5nLCBwcmVjaXNpb24sIHVuaXQgfSA9IHtcbiAgICAuLi5kZWZhdWx0cyxcbiAgICAuLi5vcHRpb25zLFxuICB9XG5cbiAgY29uc3QgY2FsY1R3ZWVuID0gY3JlYXRlQ2FsY1Byb3BUd2VlblZhbChmcm9tLCB0bywge1xuICAgIHN0aWZmbmVzcyxcbiAgICBkYW1waW5nLFxuICAgIHByZWNpc2lvbixcbiAgfSlcblxuICByZXR1cm4gQXJyYXkuZnJvbShudW1GcmFtZXMpXG4gICAgLm1hcCgoXywgZnJhbWUpID0+IFtcbiAgICAgIE9iamVjdC5rZXlzKGZyb20pLnJlZHVjZShcbiAgICAgICAgKHR3ZWVuLCBwcm9wKSA9PiByZWR1Y2VGcmFtZSh0d2VlbiwgcHJvcCwgY2FsY1R3ZWVuKHByb3AsIGZyYW1lKSksXG4gICAgICAgIHt9XG4gICAgICApLFxuICAgICAgZnJhbWUsXG4gICAgXSlcbiAgICAuZmlsdGVyKChbc3ByaW5nLCBmcmFtZV0sIGksIGZyYW1lcykgPT4ge1xuICAgICAgY29uc3QgbGFzdEluZGV4ID0gaSAtIDEgPiAwID8gaSAtIDEgOiAwXG4gICAgICByZXR1cm4gbGFzdEluZGV4ID4gMCA/IGZyYW1lc1tsYXN0SW5kZXhdWzBdICE9PSBzcHJpbmcgOiB0cnVlXG4gICAgfSlcbiAgICAucmVkdWNlKFxuICAgICAgKGZyYW1lcywgW3NwcmluZywgZnJhbWVdKSA9PiBbXG4gICAgICAgIC4uLmZyYW1lcyxcbiAgICAgICAgW2Ake2ZyYW1lfSVgLCBtYXBUb0NzcyhzcHJpbmcsIHVuaXQpXSxcbiAgICAgIF0sXG4gICAgICBbXVxuICAgIClcbiAgICAubWFwKChbZnJhbWUsIHNwcmluZ10pID0+IGAke2ZyYW1lfSB7ICR7c3ByaW5nfSB9YClcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oeyBmcm9tLCB0byB9LCBvcHRpb25zKSB7XG4gIHJldHVybiBrZXlmcmFtZXMoc3ByaW5nKHsgZnJvbSwgdG8gfSwgb3B0aW9ucykpXG59XG4iXX0=