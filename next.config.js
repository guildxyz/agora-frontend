module.exports = {
  async redirects() {
    /**
     * NOTE: this only runs at deploy, so won't work for newly created communities
     * until another deploy happens
     */
    const communities = await fetch(`${process.env.NEXT_PUBLIC_API}/community`).then(
      (response) => response.json()
    )
    const urlNames = communities.map(({ urlName }) => urlName).join("|")

    return [
      {
        // ^(?!register)(.(?!\/))+$
        source: `/:path(^${urlNames}|[a-zA-Z0-9]+_token$)`,
        destination: "/:path/info",
        permanent: false,
      },
      /* {
        source: `/:path(^${urlNames}|[a-zA-Z0-9]+_token$)/admin`,
        destination: "/:path/admin/info",
        permanent: false,
      }, */
    ]
  },
}
