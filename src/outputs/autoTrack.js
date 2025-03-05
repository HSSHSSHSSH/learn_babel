var _tracker2 = _interopRequireDefault(require("tracker")).default;
function _interopRequireDefault(e) { _tracker2(); _tracker2(); return e && e.__esModule ? e : { default: e }; }
function a() {
  _tracker2();
  console.log('aaa');
}
class B {
  bb() {
    _tracker2();
    return 'bbb';
  }
}
const c = () => {
  _tracker2();
  return 'ccc';
};
const d = function () {
  _tracker2();
  console.log('ddd');
};