const distingNodeEnv = () => {
  switch (process.env.__ENV) {
    case 'production':
      return 'https://www.kg.com/kgapi/'
      break
    case 'test':
      return 'https://testwebapi.kg.com/'
      break
    case 'development':
      return 'https://dev.kg.com/'
      break
    default:
      return new Error()
  }
}

module.exports = distingNodeEnv()
