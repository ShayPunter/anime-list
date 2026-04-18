import Webpass from '@laragear/webpass'

const webpass = Webpass.create({ findXsrfToken: true })

export function useWebpass() {
    return webpass
}

export { Webpass }
