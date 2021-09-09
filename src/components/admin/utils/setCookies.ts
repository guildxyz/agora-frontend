import { GetServerSideProps } from "next"

const getServerSideProps: GetServerSideProps = async ({ preview, resolvedUrl }) => {
  if (!preview)
    return {
      redirect: {
        destination: `/api/preview?returnUrl=${resolvedUrl}`,
        permanent: false,
      },
      props: {},
    }

  return {
    props: {},
  }
}

export default getServerSideProps
