module.exports = {
  async redirects() {
    const paths = await fetch(`${process.env.NEXT_PUBLIC_API}/community`).then(
      (response) => response.json().then((_) => _.map(({ urlName }) => urlName))
    )
    const urlNames = paths.join("|")
    return [
      {
        // ^(?!register)(.(?!\/))+$
        source: `/:path(^${urlNames}|[a-zA-Z0-9]+_token$)`,
        destination: "/:path/info",
        permanent: false,
      },
    ]
  },
}
