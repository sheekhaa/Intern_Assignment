import React, { useState } from "react";
import { useGetBooksQuery } from "../services/bookApi";
import { Book } from "../services/bookApi";
import { Criteria, EuiBasicTable, EuiBasicTableColumn, EuiButton, EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiText, EuiPopover, EuiIcon, EuiButtonEmpty,  } from "@elastic/eui";


const HomePage: React.FC = () =>{
  //for table
  const {data: books = [], isLoading} = useGetBooksQuery();
  //for pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, SetPageSize] = useState(4);
  const [searchTerm, setSearchTerm] = useState(""); //for search
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null); //for action

  const onTableChange = ({page}: Criteria<Book>)=>{
    if (page){
      const {index: pageIndex, size: pageSize} = page;
      setPageIndex(pageIndex);
      SetPageSize(pageSize);
    }
  };

  const findBooks = (
      books: Book[],
      pageIndex:number,
      pageSize: number,
      searchTerm: string
      )=>{
    const filtered = books.filter((book)=>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()));

     const startIndex = pageIndex * pageSize;
    let pageOfItems = filtered.slice(
       startIndex,
        Math.min(startIndex + pageSize, books.length)
      );     
   
  return {
    pageOfItems,
    totalItemCount: filtered.length,
  };
  };

  const {pageOfItems, totalItemCount} = findBooks(books, pageIndex, pageSize, searchTerm );

  const pagination = {
    pageIndex,
    pageSize,
    totalItemCount,
    pageSizeOptions: [4,8, 12],
  }
 

  const columns: Array<EuiBasicTableColumn<Book>> = [
    {
      field: "id", 
      name: "ID"
    },

    {
      field: "title",
      name: "Title"
    },
    {
      field: "author",
      name: "Author"
    },
    {
      field: "year",
      name: " Year"
    },
    {
      field: "quantity",
      name: "Quantity"
    },
    {
      field: "price",
      name: "Price ($)",
      render: (price: number) =>price.toFixed(2),
    },
    {
  name: "Action",
  render: (item: Book) => {
    const isOpen = openPopoverId === item.id;
    const onButtonClick = () => {
      setOpenPopoverId(isOpen ? null : item.id);
    };
    const closePopover = () => setOpenPopoverId(null);

    return (
      <EuiPopover
        button={
          <button onClick={onButtonClick} className="euiButtonIcon">
            <EuiIcon
              type="boxesHorizontal"
              className="ueba-table-column-icon"
            />
          </button>
        }
        isOpen={isOpen}
        closePopover={closePopover}
        panelPaddingSize="none"
        className="table-column-popover"
      >
        <EuiFlexGroup direction="column" gutterSize="s">
          <EuiFlexItem>
            <EuiButtonEmpty
              iconType="pencil"
              onClick={() => {
                // handleEdit(item);
                closePopover();
              }}
            >
              Edit
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButtonEmpty
              iconType="trash"
              color="danger"
              onClick={() => {
                // showModal(item.id);
                closePopover();
              }}
            >
              Delete
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPopover>
    );
  }
}
 

  ]
   
  return(
    <>
     <EuiFlexGroup>      
        <EuiText>
          <h2>Book List</h2>
        </EuiText>      
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiFieldSearch placeholder="Search book" value={searchTerm}onChange={(e)=>{
          setSearchTerm(e.target.value);
          setPageIndex(0); //reset first page on new search
        }}isClearable></EuiFieldSearch>
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiButton onClick={()=> alert("Search handle automatically")}>Search</EuiButton>        
      </EuiFlexItem>
      <EuiFlexItem>
        <EuiButton>Add</EuiButton>
      </EuiFlexItem>
    </EuiFlexGroup>    

    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiBasicTable items={pageOfItems}        
        columns={columns}
        pagination={pagination}
        onChange={onTableChange}
        loading = {isLoading}/>   
        
      </EuiFlexItem>
    </EuiFlexGroup>
    </>
  )
}
export default HomePage;
