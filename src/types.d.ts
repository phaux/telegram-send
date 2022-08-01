declare module "url:*" {
  let url: string
  export default url
}

interface Window {
  browser: typeof chrome
}
