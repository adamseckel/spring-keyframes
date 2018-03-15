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

  return (0, _emotion.keyframes)(spring({ from: from, to: to }, options).join(''));
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
    return '' + animation + mapPropTypes(prop, spring[prop], unit);
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
  }).map(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 2),
        spring = _ref7[0],
        frame = _ref7[1];

    return [frame + '%', mapToCss(spring, unit)];
  }).filter(function (_ref8, i, frames) {
    var _ref9 = _slicedToArray(_ref8, 2),
        frame = _ref9[0],
        spring = _ref9[1];

    var lastIndex = i - 1 > 0 ? i - 1 : 0;
    return lastIndex > 0 && frame !== '100%' ? frames[lastIndex][1] !== spring : true;
  }).map(function (_ref10) {
    var _ref11 = _slicedToArray(_ref10, 2),
        frame = _ref11[0],
        spring = _ref11[1];

    return frame + ' {' + spring + '}';
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzcHJpbmciLCJvcHRpb25zIiwiZnJvbSIsInRvIiwiam9pbiIsImRlZmF1bHRzIiwic3RpZmZuZXNzIiwiZGFtcGluZyIsInByZWNpc2lvbiIsInVuaXQiLCJudW1GcmFtZXMiLCJsZW5ndGgiLCJ0cmFuc2Zvcm1NYXAiLCJyb3VuZFRvUHJlY2lzaW9uIiwibnVtIiwiZGVjaW1hbFBvaW50cyIsIkFycmF5IiwicmVkdWNlIiwiY291bnQiLCJNYXRoIiwiY2VpbCIsImNhbGNQcm9wVHdlZW5WYWwiLCJwcm9wIiwiZnJhbWUiLCJjcmVhdGVDYWxjUHJvcFR3ZWVuVmFsIiwic3BsaXRUcmFuc2Zvcm0iLCJ2IiwidHJhbnNmb3JtTGlzdCIsImluY2x1ZGVzIiwidHJhbnNmb3JtIiwicmVkdWNlRnJhbWUiLCJ0d2VlbiIsInByb3BlcnR5IiwidmFsdWUiLCJtYXBUcmFuc2Zvcm1Qcm9wVG9Dc3MiLCJtYXBUcmFuc2Zvcm1Qcm9wcyIsIm1hcFByb3BUeXBlcyIsIm1hcFRvQ3NzIiwiT2JqZWN0Iiwia2V5cyIsImFuaW1hdGlvbiIsImNhbGNUd2VlbiIsIm1hcCIsIl8iLCJmaWx0ZXIiLCJpIiwiZnJhbWVzIiwibGFzdEluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBa0ZnQkEsTSxHQUFBQSxNOztrQkErQkQsa0JBQXVCQyxPQUF2QixFQUFnQztBQUFBLE1BQXJCQyxJQUFxQixVQUFyQkEsSUFBcUI7QUFBQSxNQUFmQyxFQUFlLFVBQWZBLEVBQWU7O0FBQzdDLFNBQU8sd0JBQVVILE9BQU8sRUFBRUUsVUFBRixFQUFRQyxNQUFSLEVBQVAsRUFBcUJGLE9BQXJCLEVBQThCRyxJQUE5QixDQUFtQyxFQUFuQyxDQUFWLENBQVA7QUFDRCxDOztBQW5IRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU1DLFdBQVc7QUFDZkMsYUFBVyxHQURJO0FBRWZDLFdBQVMsR0FGTTtBQUdmQyxhQUFXLENBSEk7QUFJZkMsUUFB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LEVBQXlCbUIsVUFBVW5CLElBQVYsRUFBZ0JDLEtBQWhCLENBQXpCLENBQWpCO0FBQUEsS0FERixFQUVFLEVBRkYsQ0FEaUIsRUFLakJBLEtBTGlCLENBQWQ7QUFBQSxHQURBLEVBU0ptQixHQVRJLENBU0E7QUFBQTtBQUFBLFFBQUUxQyxNQUFGO0FBQUEsUUFBVXVCLEtBQVY7O0FBQUEsV0FBcUIsQ0FBSUEsS0FBSixRQUFjYyxTQUFTckMsTUFBVCxFQUFpQlMsSUFBakIsQ0FBZCxDQUFyQjtBQUFBLEdBVEEsRUFVSm1DLE1BVkksQ0FVRyxpQkFBa0JDLENBQWxCLEVBQXFCQyxNQUFyQixFQUFnQztBQUFBO0FBQUEsUUFBOUJ2QixLQUE4QjtBQUFBLFFBQXZCdkIsTUFBdUI7O0FBQ3RDLFFBQU0rQyxZQUFZRixJQUFJLENBQUosR0FBUSxDQUFSLEdBQVlBLElBQUksQ0FBaEIsR0FBb0IsQ0FBdEM7QUFDQSxXQUFPRSxZQUFZLENBQVosSUFBaUJ4QixVQUFVLE1BQTNCLEdBQ0h1QixPQUFPQyxTQUFQLEVBQWtCLENBQWxCLE1BQXlCL0MsTUFEdEIsR0FFSCxJQUZKO0FBR0QsR0FmSSxFQWdCSjBDLEdBaEJJLENBZ0JBO0FBQUE7QUFBQSxRQUFFbkIsS0FBRjtBQUFBLFFBQVN2QixNQUFUOztBQUFBLFdBQXdCdUIsS0FBeEIsVUFBa0N2QixNQUFsQztBQUFBLEdBaEJBLENBQVA7QUFpQkQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3ByaW5nZXIgZnJvbSAnc3ByaW5nZXInXG5pbXBvcnQgeyBrZXlmcmFtZXMgfSBmcm9tICdlbW90aW9uJ1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgc3RpZmZuZXNzOiAwLjUsXG4gIGRhbXBpbmc6IDAuOCxcbiAgcHJlY2lzaW9uOiAyLFxuICB1bml0OiAncHgnLFxufVxuY29uc3QgbnVtRnJhbWVzID0geyBsZW5ndGg6IDEwMSB9XG5jb25zdCB0cmFuc2Zvcm1NYXAgPSBbJ3gnLCAneScsICdzY2FsZSddXG5cbmZ1bmN0aW9uIHJvdW5kVG9QcmVjaXNpb24obnVtLCBwcmVjaXNpb24gPSAyKSB7XG4gIGNvbnN0IGRlY2ltYWxQb2ludHMgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBwcmVjaXNpb24gfSkucmVkdWNlKFxuICAgIChjb3VudCA9IDEpID0+IGNvdW50ICogMTBcbiAgKVxuICByZXR1cm4gTWF0aC5jZWlsKG51bSAqIGRlY2ltYWxQb2ludHMpIC8gZGVjaW1hbFBvaW50c1xufVxuXG5mdW5jdGlvbiBjYWxjUHJvcFR3ZWVuVmFsKFxuICBwcm9wLFxuICBmcmFtZSxcbiAgZnJvbSxcbiAgdG8sXG4gIHsgZGFtcGluZywgc3RpZmZuZXNzLCBwcmVjaXNpb24gfVxuKSB7XG4gIHJldHVybiByb3VuZFRvUHJlY2lzaW9uKFxuICAgIGZyb21bcHJvcF0gK1xuICAgICAgKHRvW3Byb3BdIC0gZnJvbVtwcm9wXSkgKiBzcHJpbmdlcihkYW1waW5nLCBzdGlmZm5lc3MpKGZyYW1lIC8gMTAwKSxcbiAgICBwcmVjaXNpb25cbiAgKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDYWxjUHJvcFR3ZWVuVmFsKGZyb20sIHRvLCBvcHRpb25zKSB7XG4gIHJldHVybiAocHJvcCwgZnJhbWUpID0+IGNhbGNQcm9wVHdlZW5WYWwocHJvcCwgZnJhbWUsIGZyb20sIHRvLCBvcHRpb25zKVxufVxuXG5mdW5jdGlvbiBzcGxpdFRyYW5zZm9ybShwcm9wLCB2LCB0cmFuc2Zvcm1MaXN0ID0gW10pIHtcbiAgcmV0dXJuIHRyYW5zZm9ybU1hcC5pbmNsdWRlcyhwcm9wKVxuICAgID8geyB0cmFuc2Zvcm06IFsuLi50cmFuc2Zvcm1MaXN0LCBbcHJvcCwgdl1dIH1cbiAgICA6IHsgW3Byb3BdOiB2IH1cbn1cblxuZnVuY3Rpb24gcmVkdWNlRnJhbWUodHdlZW4sIHByb3BlcnR5LCB2YWx1ZSkge1xuICByZXR1cm4geyAuLi50d2VlbiwgLi4uc3BsaXRUcmFuc2Zvcm0ocHJvcGVydHksIHZhbHVlLCB0d2Vlbi50cmFuc2Zvcm0pIH1cbn1cblxuZnVuY3Rpb24gbWFwVHJhbnNmb3JtUHJvcFRvQ3NzKHByb3AsIHNwcmluZywgdW5pdCA9ICdweCcpIHtcbiAgc3dpdGNoIChwcm9wKSB7XG4gICAgY2FzZSAneSc6XG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZVkoJHtzcHJpbmd9JHt1bml0fSlgXG4gICAgY2FzZSAneCc6XG4gICAgICByZXR1cm4gYHRyYW5zbGF0ZVgoJHtzcHJpbmd9JHt1bml0fSlgXG4gICAgY2FzZSAnc2NhbGUnOlxuICAgICAgcmV0dXJuIGBzY2FsZTNkKCR7c3ByaW5nfSwgJHtzcHJpbmd9LCAxKWBcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGAke3Byb3B9KCR7c3ByaW5nfSlgXG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwVHJhbnNmb3JtUHJvcHMoc3ByaW5nLCB1bml0KSB7XG4gIHJldHVybiBzcHJpbmcucmVkdWNlKFxuICAgICh0cmFuc2Zvcm0sIFtwcm9wLCBzcHJpbmddKSA9PlxuICAgICAgYCR7dHJhbnNmb3JtfSAke21hcFRyYW5zZm9ybVByb3BUb0Nzcyhwcm9wLCBzcHJpbmcsIHVuaXQpfWAsXG4gICAgJ3RyYW5zZm9ybTonXG4gIClcbn1cblxuZnVuY3Rpb24gbWFwUHJvcFR5cGVzKHByb3AsIHNwcmluZywgdW5pdCkge1xuICByZXR1cm4gcHJvcCA9PT0gJ3RyYW5zZm9ybSdcbiAgICA/IGAke21hcFRyYW5zZm9ybVByb3BzKHNwcmluZywgdW5pdCl9O2BcbiAgICA6IGAke3Byb3B9OiAke3NwcmluZ307YFxufVxuXG5mdW5jdGlvbiBtYXBUb0NzcyhzcHJpbmcsIHVuaXQpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHNwcmluZykucmVkdWNlKFxuICAgIChhbmltYXRpb24sIHByb3ApID0+XG4gICAgICBgJHthbmltYXRpb259JHttYXBQcm9wVHlwZXMocHJvcCwgc3ByaW5nW3Byb3BdLCB1bml0KX1gLFxuICAgICcnXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNwcmluZyh7IGZyb20sIHRvIH0sIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBzdGlmZm5lc3MsIGRhbXBpbmcsIHByZWNpc2lvbiwgdW5pdCB9ID0ge1xuICAgIC4uLmRlZmF1bHRzLFxuICAgIC4uLm9wdGlvbnMsXG4gIH1cblxuICBjb25zdCBjYWxjVHdlZW4gPSBjcmVhdGVDYWxjUHJvcFR3ZWVuVmFsKGZyb20sIHRvLCB7XG4gICAgc3RpZmZuZXNzLFxuICAgIGRhbXBpbmcsXG4gICAgcHJlY2lzaW9uLFxuICB9KVxuXG4gIHJldHVybiBBcnJheS5mcm9tKG51bUZyYW1lcylcbiAgICAubWFwKChfLCBmcmFtZSkgPT4gW1xuICAgICAgT2JqZWN0LmtleXMoZnJvbSkucmVkdWNlKFxuICAgICAgICAodHdlZW4sIHByb3ApID0+IHJlZHVjZUZyYW1lKHR3ZWVuLCBwcm9wLCBjYWxjVHdlZW4ocHJvcCwgZnJhbWUpKSxcbiAgICAgICAge31cbiAgICAgICksXG4gICAgICBmcmFtZSxcbiAgICBdKVxuXG4gICAgLm1hcCgoW3NwcmluZywgZnJhbWVdKSA9PiBbYCR7ZnJhbWV9JWAsIG1hcFRvQ3NzKHNwcmluZywgdW5pdCldKVxuICAgIC5maWx0ZXIoKFtmcmFtZSwgc3ByaW5nXSwgaSwgZnJhbWVzKSA9PiB7XG4gICAgICBjb25zdCBsYXN0SW5kZXggPSBpIC0gMSA+IDAgPyBpIC0gMSA6IDBcbiAgICAgIHJldHVybiBsYXN0SW5kZXggPiAwICYmIGZyYW1lICE9PSAnMTAwJSdcbiAgICAgICAgPyBmcmFtZXNbbGFzdEluZGV4XVsxXSAhPT0gc3ByaW5nXG4gICAgICAgIDogdHJ1ZVxuICAgIH0pXG4gICAgLm1hcCgoW2ZyYW1lLCBzcHJpbmddKSA9PiBgJHtmcmFtZX0geyR7c3ByaW5nfX1gKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih7IGZyb20sIHRvIH0sIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGtleWZyYW1lcyhzcHJpbmcoeyBmcm9tLCB0byB9LCBvcHRpb25zKS5qb2luKCcnKSlcbn1cbiJdfQ==