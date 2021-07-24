const styles = {
  parts: ["popper", "content", "header", "body", "footer", "arrow"],
  baseStyle: {
    content: {
      // we can't add data attributes to the Modal component so we have
      // to prevent the focus-visible polyfill from removing shadow on
      // focus by overriding it's style with the default box-shadow
      ":focus:not([data-focus-visible-added])": {
        boxShadow: "md",
      },
    },
  },
}

export default styles
