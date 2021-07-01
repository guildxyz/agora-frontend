import { useEffect, useRef } from "react"

const useContainerRef = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    containerRef.current = document.querySelector(".colorPaletteProvider")
  }, [])

  return containerRef
}

export default useContainerRef
