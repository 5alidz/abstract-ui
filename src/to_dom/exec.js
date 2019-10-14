export default function(_to_dom) {
  return handler => {
    return _to_dom(handler, 'unsafe')
  }
}
