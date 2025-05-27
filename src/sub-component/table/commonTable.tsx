import { EuiBasicTable, Pagination } from "@elastic/eui";
import React from "react";
interface CommonTableProps{
  items: any
  columns: any
  loading?: boolean;
  onChange: any,
  pagination: Pagination,

}
export const CommonTable: React.FC<CommonTableProps>=({
  items,
  columns,
  loading,
  onChange,
  pagination,

})=>{
  return(
    <>
      <EuiBasicTable items={items} columns={columns} loading = {loading} onChange={onChange} pagination={pagination}/>
    </>
  )
}