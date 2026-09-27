import { useEffect, useState } from 'react'

export function useMasonryColumns(
  containerRef: React.RefObject<HTMLElement | null>,
) {
  const [columnCount, setColumnCount] = useState(1)

  useEffect(() => {
    const updateColumnCount = () => {
      const container = containerRef.current

      if (!container) {
        return
      }

      const styles = window.getComputedStyle(container)
      const columnWidth = parseFloat(styles.columnWidth)
      const columnGap = parseFloat(styles.columnGap)

      if (!columnWidth || !columnGap) {
        return
      }

      const width = container.clientWidth

      const columns = Math.max(
        1,
        Math.floor((width + columnGap) / (columnWidth + columnGap)),
      )

      setColumnCount(columns)
    }

    updateColumnCount()

    window.addEventListener('resize', updateColumnCount)

    return () => {
      window.removeEventListener('resize', updateColumnCount)
    }
  }, [containerRef])

  return columnCount
}
