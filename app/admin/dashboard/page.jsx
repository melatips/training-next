"use client"
import React, { useState }  from 'react'
import { useQuery }         from '@tanstack/react-query'
import { useSession }       from 'next-auth/react'
import { useToast }         from '@chakra-ui/react'
import useAxiosAuth         from '@/hook/useAuthAxios'
import useDebounce          from '@/hook/useDebounce'
import useNotification      from '@/hook/useNotification'
import Pagination           from '@/components/Pagination'

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  Box,
  Input,
  Select,
  Spacer,
} from '@chakra-ui/react'
import { formatDateInd } from '@/utils/date'

function PAge() {
  const axiosClient = useAxiosAuth()
  const toast = useToast()
  const { data: session } = useSession()
  const [q, setQ] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const debounceValue = useDebounce(q, 1000, setPage)
  const {toastSuccess, toastWarning, toastDanger} = useNotification()

  const { data, isLoading, isFetching } = useQuery(
    ["/product/list", { page, pageSize, q:debounceValue }],
    () => axiosClient.get("/product/list", {
      params: {
        page,
        pageSize,
        q
      }
    }),
    {
      select: (response) => response.data,
      // onSuccess: (data) => {
      //   //berjalan ketika isLoading
      //   const filter = data.data.filter((item) => item.category !== 'mobil')
      //   data.data = filter
      //   toastSuccess("data isLoading")
        
      // },
      // staleTime: 1000*60, //60detik 
      // refetchInterval: 1000*5, // biasanya lebih besar daripada stale
      enabled: session?.user?.accessToken !== undefined,
    }
  );

  return (
    // <div>{JSON.stringify(data)}</div>
    <div className='w-full h-full p-10'>
      <Flex minWidth={'max-content'} alignItems={'center'} gap={2}>
        <Box p={2}>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(e.target.value);
            }}
            >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Select>
        </Box>
      
      <Spacer/>
      <Box p={2}>
        <Input value={q} onChange={(e) => {
          setQ(e.target.value);
        }} placeholder='Cari...'/>
      </Box>
      </Flex>
      {isFetching && <p>Fetching</p>}
      {isLoading && <p>Loading</p>}
      <TableContainer>
        <Table variant='striped' colorScheme='teal'>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Image</Th>
              <Th>Nama</Th>
              <Th>Kategori</Th>
              <Th>Tanggal</Th>
              <Th>Harga</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data &&
              data.data.map((item, index) => (
                <Tr key={index}>
                  <Td>{(page - 1) * pageSize + index + 1}</Td>
                  <Td>Image</Td>
                  <Td>{item.name || "-"}</Td>
                  <Td>{item.category || "-"}</Td>
                  <Td>{formatDateInd(item.openDate) || "-"}</Td>
                  <Td>{item.cost || "-"}</Td>
                  <Td>Aksi</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
        <Pagination 
          page={page}
          pageSize={pageSize}
          total={data?.pagination.total}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </TableContainer>
    </div>
  )
}

export default PAge