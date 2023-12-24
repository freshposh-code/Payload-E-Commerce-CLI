// 'use client'

// import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
// import qs from 'qs'

// import type { Product } from '../../../payload/payload-types'
// import type { ArchiveBlockProps } from '../../_blocks/ArchiveBlock/types'
// import { Card } from '../Card'
// import { Gutter } from '../Gutter'
// import { PageRange } from '../PageRange'
// import { Pagination } from '../Pagination'

// import classes from './index.module.scss'
// import { useFilter } from '../../_providers/Filter'

// type Result = {
//   docs: Product[]
//   hasNextPage: boolean
//   hasPrevPage: boolean
//   nextPage: number
//   page: number
//   prevPage: number
//   totalDocs: number
//   totalPages: number
// }

// export type Props = {
//   categories?: ArchiveBlockProps['categories']
//   className?: string
//   limit?: number
//   onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
//   populateBy?: 'collection' | 'selection'
//   populatedDocs?: ArchiveBlockProps['populatedDocs']
//   populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
//   relationTo?: 'products'
//   selectedDocs?: ArchiveBlockProps['selectedDocs']
//   showPageRange?: boolean
//   sort?: string
// }

// export const CollectionArchive: React.FC<Props> = props => {
//   const {categoryFilters, sort} = useFilter();
//   const {
//     categories: catsFromProps,
//     className,
//     limit = 10,
//     onResultChange,
//     populateBy,
//     populatedDocs,
//     populatedDocsTotal,
//     relationTo,
//     selectedDocs,
//     showPageRange,
//   } = props

//   const [results, setResults] = useState<Result>({
//     docs: (populateBy === 'collection'
//       ? populatedDocs
//       : populateBy === 'selection'
//       ? selectedDocs
//       : []
//     )?.map(doc => doc.value),
//     hasNextPage: false,
//     hasPrevPage: false,
//     nextPage: 1,
//     page: 1,
//     prevPage: 1,
//     totalDocs: typeof populatedDocsTotal === 'number' ? populatedDocsTotal : 0,
//     totalPages: 1,
//   })

//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | undefined>(undefined)
//   const scrollRef = useRef<HTMLDivElement>(null)
//   const hasHydrated = useRef(false)
//   const isRequesting = useRef(false)
//   const [page, setPage] = useState(1)

//   const categories = (catsFromProps || []).map(cat => cat.id).join(',')

//   const scrollToRef = useCallback(() => {
//     const { current } = scrollRef
//     if (current) {
//       // current.scrollIntoView({
//       //   behavior: 'smooth',
//       // })
//     }
//   }, [])

//   useEffect(() => {
//     if (!isLoading && typeof results.page !== 'undefined') {
//       // scrollToRef()
//     }
//   }, [isLoading, scrollToRef, results])

//   useEffect(() => {
//     let timer: NodeJS.Timeout = null

//     if (populateBy === 'collection' && !isRequesting.current) {
//       isRequesting.current = true

//       // hydrate the block with fresh content after first render
//       // don't show loader unless the request takes longer than x ms
//       // and don't show it during initial hydration
//       timer = setTimeout(() => {
//         if (hasHydrated.current) {
//           setIsLoading(true)
//         }
//       }, 500)

//       const searchQuery = qs.stringify(
//         {
//           depth: 1,
//           limit,
//           page,
//           sort,
//           where: {
//             ...(categoryFilters
//               ? {
//                   categoryFilters: {
//                     in: categoryFilters,
//                   },
//                 }
//               : {}),
//           },
//         },
//         { encode: false },
//       )

//       const makeRequest = async () => {
//         try {
//           const req = await fetch(
//             `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${relationTo}?${searchQuery}`,
//           )

//           const json = await req.json()
//           clearTimeout(timer)

//           const { docs } = json as { docs: Product[] }

//           if (docs && Array.isArray(docs)) {
//             setResults(json)
//             setIsLoading(false)
//             if (typeof onResultChange === 'function') {
//               onResultChange(json)
//             }
//           }
//         } catch (err) {
//           console.warn(err) // eslint-disable-line no-console
//           setIsLoading(false)
//           setError(`Unable to load "${relationTo} archive" data at this time.`)
//         }

//         isRequesting.current = false
//         hasHydrated.current = true
//       }

//       void makeRequest()
//     }

//     return () => {
//       if (timer) clearTimeout(timer)
//     }
//   }, [page, categories, relationTo, onResultChange, sort, limit, populateBy])

//   return (
//     <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
//       <div className={classes.scrollRef} ref={scrollRef} />
//       {!isLoading && error && <Gutter>{error}</Gutter>}
//       <Fragment>
//         {showPageRange !== false && populateBy !== 'selection' && (
//           <Gutter>
//             <div className={classes.pageRange}>
//               <PageRange
//                 collection={relationTo}
//                 currentPage={results.page}
//                 limit={limit}
//                 totalDocs={results.totalDocs}
//               />
//             </div>
//           </Gutter>
//         )}
//         <Gutter>
//           <div className={classes.grid}>
//             {results.docs?.map((result, index) => {
//               return (
//                 <div className={classes.column} key={index}>
//                   <Card doc={result} relationTo={relationTo} showCategories />
//                 </div>
//               )
//             })}
//           </div>
//           {results.totalPages > 1 && populateBy !== 'selection' && (
//             <Pagination
//               className={classes.pagination}
//               onClick={setPage}
//               page={results.page}
//               totalPages={results.totalPages}
//             />
//           )}
//         </Gutter>
//       </Fragment>
//     </div>
//   )
// }

'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import qs from 'qs'

import { Category, Product } from '../../../payload/payload-types'
import type { ArchiveBlockProps } from '../../_blocks/ArchiveBlock/types'
import { useFilter } from '../../_providers/Filter'
import { Card } from '../Card'
import { PageRange } from '../PageRange'
import { Pagination } from '../Pagination'

import classes from './index.module.scss'

type Result = {
  totalDocs: number
  docs: Product[]
  page: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  nextPage: number
  prevPage: number
}

export type Props = {
  className?: string
  relationTo?: 'products'
  populateBy?: 'collection' | 'selection'
  showPageRange?: boolean
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  limit?: number
  populatedDocs?: ArchiveBlockProps['populatedDocs']
  populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
  categories?: ArchiveBlockProps['categories']
}

export const CollectionArchive: React.FC<Props> = props => {
  const { categoryFilters, sort } = useFilter()

  const {
    className,
    relationTo,
    showPageRange,
    onResultChange,
    limit = 10,
    populatedDocs,
    populatedDocsTotal,
  } = props

  const [results, setResults] = useState<Result>({
    totalDocs: typeof populatedDocsTotal === 'number' ? populatedDocsTotal : 0,
    docs: (populatedDocs?.map(doc => doc.value) || []) as [],
    page: 1,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: 1,
    nextPage: 1,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const [page, setPage] = useState(1)

  const scrollToRef = useCallback(() => {
    const { current } = scrollRef
    if (current) {
      // current.scrollIntoView({
      //   behavior: 'smooth',
      // })
    }
  }, [])

  useEffect(() => {
    if (!isLoading && typeof results.page !== 'undefined') {
      // scrollToRef()
    }
  }, [isLoading, scrollToRef, results])

  useEffect(() => {
    // hydrate the block with fresh content after first render
    // don't show loader unless the request takes longer than x ms
    // and don't show it during initial hydration
    const timer: NodeJS.Timeout = setTimeout(() => {
      if (hasHydrated) {
        setIsLoading(true)
      }
    }, 500)

    const searchQuery = qs.stringify(
      {
        sort,
        where: {
          ...(categoryFilters && categoryFilters?.length > 0
            ? {
                categories: {
                  in:
                    typeof categoryFilters === 'string'
                      ? [categoryFilters]
                      : categoryFilters.map((cat: string) => cat).join(','),
                },
              }
            : {}),
        },
        limit,
        page,
        depth: 1,
      },
      { encode: false },
    )

    const makeRequest = async () => {
      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/${relationTo}?${searchQuery}`,
        )
        const json = await req.json()
        clearTimeout(timer)
        hasHydrated.current = true

        const { docs } = json as { docs: Product[] }

        if (docs && Array.isArray(docs)) {
          setResults(json)
          setIsLoading(false)
          if (typeof onResultChange === 'function') {
            onResultChange(json)
          }
        }
      } catch (err) {
        console.warn(err) // eslint-disable-line no-console
        setIsLoading(false)
        setError(`Unable to load "${relationTo} archive" data at this time.`)
      }
    }

    makeRequest()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [page, categoryFilters, relationTo, onResultChange, sort, limit])

  return (
    <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
      <div ref={scrollRef} className={classes.scrollRef} />
      {!isLoading && error && <div>{error}</div>}
      <Fragment>
        {showPageRange !== false && (
          <div className={classes.pageRange}>
            <PageRange
              totalDocs={results.totalDocs}
              currentPage={results.page}
              collection={relationTo}
              limit={limit}
            />
          </div>
        )}

        <div className={classes.grid}>
          {results.docs?.map((result, index) => {
            return <Card key={index} relationTo="products" doc={result} showCategories />
          })}
        </div>

        {results.totalPages > 1 && (
          <Pagination
            className={classes.pagination}
            page={results.page}
            totalPages={results.totalPages}
            onClick={setPage}
          />
        )}
      </Fragment>
    </div>
  )
}