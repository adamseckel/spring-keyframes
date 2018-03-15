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
    return lastIndex > 0 ? frames[lastIndex][1] !== spring : true;
  }).map(function (_ref10) {
    var _ref11 = _slicedToArray(_ref10, 2),
        frame = _ref11[0],
        spring = _ref11[1];

    return frame + ' { ' + spring + ' }';
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzcHJpbmciLCJvcHRpb25zIiwiZnJvbSIsInRvIiwiam9pbiIsImRlZmF1bHRzIiwic3RpZmZuZXNzIiwiZGFtcGluZyIsInByZWNpc2lvbiIsInVuaXQiLCJudW1GcmFtZXMiLCJsZW5ndGgiLCJ0cmFuc2Zvcm1NYXAiLCJyb3VuZFRvUHJlY2lzaW9uIiwibnVtIiwiZGVjaW1hbFBvaW50cyIsIkFycmF5IiwicmVkdWNlIiwiY291bnQiLCJNYXRoIiwiY2VpbCIsImNhbGNQcm9wVHdlZW5WYWwiLCJwcm9wIiwiZnJhbWUiLCJjcmVhdGVDYWxjUHJvcFR3ZWVuVmFsIiwic3BsaXRUcmFuc2Zvcm0iLCJ2IiwidHJhbnNmb3JtTGlzdCIsImluY2x1ZGVzIiwidHJhbnNmb3JtIiwicmVkdWNlRnJhbWUiLCJ0d2VlbiIsInByb3BlcnR5IiwidmFsdWUiLCJtYXBUcmFuc2Zvcm1Qcm9wVG9Dc3MiLCJtYXBUcmFuc2Zvcm1Qcm9wcyIsIm1hcFByb3BUeXBlcyIsIm1hcFRvQ3NzIiwiT2JqZWN0Iiwia2V5cyIsImFuaW1hdGlvbiIsImNhbGNUd2VlbiIsIm1hcCIsIl8iLCJmaWx0ZXIiLCJpIiwiZnJhbWVzIiwibGFzdEluZGV4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBa0ZnQkEsTSxHQUFBQSxNOztrQkE2QkQsa0JBQXVCQyxPQUF2QixFQUFnQztBQUFBLE1BQXJCQyxJQUFxQixVQUFyQkEsSUFBcUI7QUFBQSxNQUFmQyxFQUFlLFVBQWZBLEVBQWU7O0FBQzdDLFNBQU8sd0JBQVVILE9BQU8sRUFBRUUsVUFBRixFQUFRQyxNQUFSLEVBQVAsRUFBcUJGLE9BQXJCLEVBQThCRyxJQUE5QixDQUFtQyxFQUFuQyxDQUFWLENBQVA7QUFDRCxDOztBQWpIRDs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU1DLFdBQVc7QUFDZkMsYUFBVyxHQURJO0FBRWZDLFdBQVMsR0FGTTtBQUdmQyxhQUFXLENBSEk7QUFJZkMsUUFB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RUFBeUJtQixVQUFVbkIsSUFBVixFQUFnQkMsS0FBaEIsQ0FBekIsQ0FBakI7QUFBQSxLQURGLEVBRUUsRUFGRixDQURpQixFQUtqQkEsS0FMaUIsQ0FBZDtBQUFBLEdBREEsRUFTSm1CLEdBVEksQ0FTQTtBQUFBO0FBQUEsUUFBRTFDLE1BQUY7QUFBQSxRQUFVdUIsS0FBVjs7QUFBQSxXQUFxQixDQUFJQSxLQUFKLFFBQWNjLFNBQVNyQyxNQUFULEVBQWlCUyxJQUFqQixDQUFkLENBQXJCO0FBQUEsR0FUQSxFQVVKbUMsTUFWSSxDQVVHLGlCQUFrQkMsQ0FBbEIsRUFBcUJDLE1BQXJCLEVBQWdDO0FBQUE7QUFBQSxRQUE5QnZCLEtBQThCO0FBQUEsUUFBdkJ2QixNQUF1Qjs7QUFDdEMsUUFBTStDLFlBQVlGLElBQUksQ0FBSixHQUFRLENBQVIsR0FBWUEsSUFBSSxDQUFoQixHQUFvQixDQUF0QztBQUNBLFdBQU9FLFlBQVksQ0FBWixHQUFnQkQsT0FBT0MsU0FBUCxFQUFrQixDQUFsQixNQUF5Qi9DLE1BQXpDLEdBQWtELElBQXpEO0FBQ0QsR0FiSSxFQWNKMEMsR0FkSSxDQWNBO0FBQUE7QUFBQSxRQUFFbkIsS0FBRjtBQUFBLFFBQVN2QixNQUFUOztBQUFBLFdBQXdCdUIsS0FBeEIsV0FBbUN2QixNQUFuQztBQUFBLEdBZEEsQ0FBUDtBQWVEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNwcmluZ2VyIGZyb20gJ3NwcmluZ2VyJ1xuaW1wb3J0IHsga2V5ZnJhbWVzIH0gZnJvbSAnZW1vdGlvbidcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHN0aWZmbmVzczogMC41LFxuICBkYW1waW5nOiAwLjgsXG4gIHByZWNpc2lvbjogMixcbiAgdW5pdDogJ3B4Jyxcbn1cbmNvbnN0IG51bUZyYW1lcyA9IHsgbGVuZ3RoOiAxMDEgfVxuY29uc3QgdHJhbnNmb3JtTWFwID0gWyd4JywgJ3knLCAnc2NhbGUnXVxuXG5mdW5jdGlvbiByb3VuZFRvUHJlY2lzaW9uKG51bSwgcHJlY2lzaW9uID0gMikge1xuICBjb25zdCBkZWNpbWFsUG9pbnRzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogcHJlY2lzaW9uIH0pLnJlZHVjZShcbiAgICAoY291bnQgPSAxKSA9PiBjb3VudCAqIDEwXG4gIClcbiAgcmV0dXJuIE1hdGguY2VpbChudW0gKiBkZWNpbWFsUG9pbnRzKSAvIGRlY2ltYWxQb2ludHNcbn1cblxuZnVuY3Rpb24gY2FsY1Byb3BUd2VlblZhbChcbiAgcHJvcCxcbiAgZnJhbWUsXG4gIGZyb20sXG4gIHRvLFxuICB7IGRhbXBpbmcsIHN0aWZmbmVzcywgcHJlY2lzaW9uIH1cbikge1xuICByZXR1cm4gcm91bmRUb1ByZWNpc2lvbihcbiAgICBmcm9tW3Byb3BdICtcbiAgICAgICh0b1twcm9wXSAtIGZyb21bcHJvcF0pICogc3ByaW5nZXIoZGFtcGluZywgc3RpZmZuZXNzKShmcmFtZSAvIDEwMCksXG4gICAgcHJlY2lzaW9uXG4gIClcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2FsY1Byb3BUd2VlblZhbChmcm9tLCB0bywgb3B0aW9ucykge1xuICByZXR1cm4gKHByb3AsIGZyYW1lKSA9PiBjYWxjUHJvcFR3ZWVuVmFsKHByb3AsIGZyYW1lLCBmcm9tLCB0bywgb3B0aW9ucylcbn1cblxuZnVuY3Rpb24gc3BsaXRUcmFuc2Zvcm0ocHJvcCwgdiwgdHJhbnNmb3JtTGlzdCA9IFtdKSB7XG4gIHJldHVybiB0cmFuc2Zvcm1NYXAuaW5jbHVkZXMocHJvcClcbiAgICA/IHsgdHJhbnNmb3JtOiBbLi4udHJhbnNmb3JtTGlzdCwgW3Byb3AsIHZdXSB9XG4gICAgOiB7IFtwcm9wXTogdiB9XG59XG5cbmZ1bmN0aW9uIHJlZHVjZUZyYW1lKHR3ZWVuLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgcmV0dXJuIHsgLi4udHdlZW4sIC4uLnNwbGl0VHJhbnNmb3JtKHByb3BlcnR5LCB2YWx1ZSwgdHdlZW4udHJhbnNmb3JtKSB9XG59XG5cbmZ1bmN0aW9uIG1hcFRyYW5zZm9ybVByb3BUb0Nzcyhwcm9wLCBzcHJpbmcsIHVuaXQgPSAncHgnKSB7XG4gIHN3aXRjaCAocHJvcCkge1xuICAgIGNhc2UgJ3knOlxuICAgICAgcmV0dXJuIGB0cmFuc2xhdGVZKCR7c3ByaW5nfSR7dW5pdH0pYFxuICAgIGNhc2UgJ3gnOlxuICAgICAgcmV0dXJuIGB0cmFuc2xhdGVYKCR7c3ByaW5nfSR7dW5pdH0pYFxuICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgIHJldHVybiBgc2NhbGUzZCgke3NwcmluZ30sICR7c3ByaW5nfSwgMSlgXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgJHtwcm9wfSgke3NwcmluZ30pYFxuICB9XG59XG5cbmZ1bmN0aW9uIG1hcFRyYW5zZm9ybVByb3BzKHNwcmluZywgdW5pdCkge1xuICByZXR1cm4gc3ByaW5nLnJlZHVjZShcbiAgICAodHJhbnNmb3JtLCBbcHJvcCwgc3ByaW5nXSkgPT5cbiAgICAgIGAke3RyYW5zZm9ybX0gJHttYXBUcmFuc2Zvcm1Qcm9wVG9Dc3MocHJvcCwgc3ByaW5nLCB1bml0KX1gLFxuICAgICd0cmFuc2Zvcm06J1xuICApXG59XG5cbmZ1bmN0aW9uIG1hcFByb3BUeXBlcyhwcm9wLCBzcHJpbmcsIHVuaXQpIHtcbiAgcmV0dXJuIHByb3AgPT09ICd0cmFuc2Zvcm0nXG4gICAgPyBgJHttYXBUcmFuc2Zvcm1Qcm9wcyhzcHJpbmcsIHVuaXQpfTtgXG4gICAgOiBgJHtwcm9wfTogJHtzcHJpbmd9O2Bcbn1cblxuZnVuY3Rpb24gbWFwVG9Dc3Moc3ByaW5nLCB1bml0KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhzcHJpbmcpLnJlZHVjZShcbiAgICAoYW5pbWF0aW9uLCBwcm9wKSA9PlxuICAgICAgYCR7YW5pbWF0aW9ufSAke21hcFByb3BUeXBlcyhwcm9wLCBzcHJpbmdbcHJvcF0sIHVuaXQpfWAsXG4gICAgJydcbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3ByaW5nKHsgZnJvbSwgdG8gfSwgb3B0aW9ucykge1xuICBjb25zdCB7IHN0aWZmbmVzcywgZGFtcGluZywgcHJlY2lzaW9uLCB1bml0IH0gPSB7XG4gICAgLi4uZGVmYXVsdHMsXG4gICAgLi4ub3B0aW9ucyxcbiAgfVxuXG4gIGNvbnN0IGNhbGNUd2VlbiA9IGNyZWF0ZUNhbGNQcm9wVHdlZW5WYWwoZnJvbSwgdG8sIHtcbiAgICBzdGlmZm5lc3MsXG4gICAgZGFtcGluZyxcbiAgICBwcmVjaXNpb24sXG4gIH0pXG5cbiAgcmV0dXJuIEFycmF5LmZyb20obnVtRnJhbWVzKVxuICAgIC5tYXAoKF8sIGZyYW1lKSA9PiBbXG4gICAgICBPYmplY3Qua2V5cyhmcm9tKS5yZWR1Y2UoXG4gICAgICAgICh0d2VlbiwgcHJvcCkgPT4gcmVkdWNlRnJhbWUodHdlZW4sIHByb3AsIGNhbGNUd2Vlbihwcm9wLCBmcmFtZSkpLFxuICAgICAgICB7fVxuICAgICAgKSxcbiAgICAgIGZyYW1lLFxuICAgIF0pXG5cbiAgICAubWFwKChbc3ByaW5nLCBmcmFtZV0pID0+IFtgJHtmcmFtZX0lYCwgbWFwVG9Dc3Moc3ByaW5nLCB1bml0KV0pXG4gICAgLmZpbHRlcigoW2ZyYW1lLCBzcHJpbmddLCBpLCBmcmFtZXMpID0+IHtcbiAgICAgIGNvbnN0IGxhc3RJbmRleCA9IGkgLSAxID4gMCA/IGkgLSAxIDogMFxuICAgICAgcmV0dXJuIGxhc3RJbmRleCA+IDAgPyBmcmFtZXNbbGFzdEluZGV4XVsxXSAhPT0gc3ByaW5nIDogdHJ1ZVxuICAgIH0pXG4gICAgLm1hcCgoW2ZyYW1lLCBzcHJpbmddKSA9PiBgJHtmcmFtZX0geyAke3NwcmluZ30gfWApXG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHsgZnJvbSwgdG8gfSwgb3B0aW9ucykge1xuICByZXR1cm4ga2V5ZnJhbWVzKHNwcmluZyh7IGZyb20sIHRvIH0sIG9wdGlvbnMpLmpvaW4oJycpKVxufVxuIl19