module.exports = {
  dir: {
    type: 'function',
    required: true,
    description: 'points to a directory and treats index.js as / and 404.js as the fallback.'
  },
  on_mount: {
    type: 'function',
    description: 'excutes when the route page mounts.'
  },
  on_unmount: {
    type: 'function',
    description: 'excutes when the route page unmounts'
  }
}
