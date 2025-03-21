import { useRouter } from 'next/router'
import styles from './styles.module.css'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '@/lib/axios'
import { formatPrice } from '@/utils/formatPrice'

interface productProps {
  productName: string
  price: number
  id: string
}

interface paginationMetaProps{
  pagesQuantity: number
  productsPerPage: number
}

export default function Products(){
  const [currentPage, setCurrentPage] = useState(1)
  const [isInfiniteScrollOn, setIsInfiniteScrollOn] = useState(false)
  const [paginationMeta, setPaginationMeta] = useState<paginationMetaProps>()

  const router = useRouter()

  function handleChangePage(){
    router.push('/')
  }

  const { data: responseData, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['products', currentPage, isInfiniteScrollOn],
    queryFn: async () => {
      const response = await api.get('/products',{
        params:{
          pageNumber: currentPage,
          infiniteScroll: isInfiniteScrollOn
        }
      })
      if(response.data.meta) setPaginationMeta(response.data.meta)
      return response.data.products
    }
  })

  function handleNextPage(){
    if(paginationMeta?.pagesQuantity && currentPage < paginationMeta.pagesQuantity){
        setCurrentPage(currentPage + 1);
    }
}

  function handlePreviousPage(){
    if(currentPage === 1) return
    setCurrentPage(currentPage - 1)
  }

  function handlePaginateToFirstPage(){
    if(paginationMeta?.pagesQuantity) setCurrentPage(1);
  }

  function handlePaginateToLastPage(){
    if(paginationMeta?.pagesQuantity) setCurrentPage(paginationMeta?.pagesQuantity);
  }

  function handleChangeMode(){
    setIsInfiniteScrollOn(!isInfiniteScrollOn)
  }

  return(
    <>
      
      <button onClick={handleChangePage} className={styles.changePageButton}> Trocar de página </button>
      {isInfiniteScrollOn ? (
        <button className={styles.changeModeTop} onClick={handleChangeMode}> Paginação </button>
      ) : (
        <>
        <p className={styles.midtop}>{currentPage}</p>
        <div className={styles.paginationButtons}>
          <button className={styles.paginationButton} onClick={handlePaginateToFirstPage}>{'<<'}</button>
          <button className={styles.paginationButton} onClick={handlePreviousPage}>{'<'}</button>
          <button className={styles.paginationButton} onClick={handleNextPage}>{'>'}</button>
          <button className={styles.paginationButton} onClick={handlePaginateToLastPage}>{'>>'}</button>
        </div>
        <button className={styles.changeMode} onClick={handleChangeMode}> Feed Mode </button>
        </>
      )}

    <main className={styles.page}>
      <div className={styles.paginationContainer}>
        {!isLoadingOrders ? (
          responseData.map(({productName, id, price}: productProps)=>(
            <div key={id} className={styles.product}>
              <p>{productName}</p>
              <p>{formatPrice(price)}</p>
              <p>{`ID: ${id}`}</p>
            </div>
          ))
        ): (
          Array.from({length: 4}).map((_, i)=>(
          <div key={i} className={styles.product}/>
          ))
        )}
      </div>
    </main>
    </>
  )
}