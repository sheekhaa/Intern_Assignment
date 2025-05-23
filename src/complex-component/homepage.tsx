import React, { useState } from "react";
import { useGetBooksQuery, useUpdateBookMutation, useDeleteBookMutation } from "../services/bookApi";
import { Book } from "../services/bookApi";
import { Criteria, EuiBasicTable, EuiBasicTableColumn, EuiButton, EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiText, EuiPopover, EuiIcon, EuiButtonEmpty, useGeneratedHtmlId, EuiFlyout, EuiFlyoutHeader, EuiTitle, EuiFlyoutBody, EuiFieldText, EuiFlyoutFooter, EuiConfirmModal,  } from "@elastic/eui";


const HomePage: React.FC = () =>{
  //for table
  const {data: books = [], isLoading} = useGetBooksQuery();
  //for pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, SetPageSize] = useState(4);
  const [searchTerm, setSearchTerm] = useState(""); //for search
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null); //for action
  //for flyout
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [editFlyout, setEditFlyout] = useState<Book | null>(null);
  const [isModalVisible, setIsModalVisible] =useState(false);
  const [deleteModal, setDeleteModal] = useState <Book | null>(null);
  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();


  //for modal
  const closeModal = ()=> {
    setDeleteModal(null);
    setIsModalVisible(false);
  }
  const showModal = (book: Book) => {
    setDeleteModal(book);
    setIsModalVisible(true)
  }
  const modalTitleId = useGeneratedHtmlId();
  const handleDeleteModal =async () =>{
    if(deleteModal){
      try{
        await deleteBook(deleteModal.id).unwrap();
        closeModal();        
      }catch(error){
        console.error("Failed delete book", error);
      }
    }
  }

  //handle edit flyout
  const handleEdit = async() =>{
    if(editFlyout){
      try{
        await updateBook(editFlyout).unwrap();
        setIsFlyoutVisible(false);
        setEditFlyout(null);
      }catch(error){
        console.error("Failed to update book", error);
      }      
    }
  };
  

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
                setEditFlyout(item);
                setIsFlyoutVisible(true);

                // handleEdit(item);
                closePopover();
              }}            >
              Edit
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiButtonEmpty
              iconType="trash"
              color="danger"
              onClick={() => {
                showModal(item);
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

  //flyout handle
  const simpleFlyoutTitled = useGeneratedHtmlId();

  let flyout;
  if(isFlyoutVisible && editFlyout){
    flyout = (
      <EuiFlyout 
      ownFocus
      onClose={()=>{ setIsFlyoutVisible(false);
        setEditFlyout(null);
      }}
      aria-labelledby={simpleFlyoutTitled}
      size="s">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="s">
            <h2 id = {simpleFlyoutTitled}>A Edit Details</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Title:   
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFieldText value={editFlyout.title} onChange={(e)=> setEditFlyout({...editFlyout, title:e.target.value})}/>
            </EuiFlexItem>
          </EuiFlexGroup>  

          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Author:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <EuiFieldText value={editFlyout.author} onChange={(e)=> setEditFlyout({...editFlyout, author: e.target.value})}/>
            </EuiFlexItem>
          </EuiFlexGroup>   

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText> Year:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <EuiFieldText value={editFlyout.year} onChange={(e)=>setEditFlyout({...editFlyout, year: parseInt(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup>    

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Quantitiy:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <EuiFieldText value={editFlyout.quantity} onChange={(e)=> setEditFlyout({...editFlyout, quantity:parseInt(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup>   

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Price:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <EuiFieldText value={editFlyout.price} onChange={(e)=> setEditFlyout({...editFlyout, price:parseFloat(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup>   
        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiButton onClick={()=>{
                setIsFlyoutVisible(false);
                setEditFlyout(null);
              }}>
                Close
              </EuiButton>
            </EuiFlexItem>

            <EuiFlexItem>
              <EuiButton onClick={handleEdit}>
                Update
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyout>
    );
  }
   
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

    {isModalVisible &&(
      <EuiConfirmModal
      aria-labelledby={modalTitleId}
      style={{width:600}}
      title = "Are you sure want to delete this book's details?"
      titleProps={{id: modalTitleId}}
      onCancel={closeModal}
      onConfirm={handleDeleteModal}
      cancelButtonText = "Cancel"
      confirmButtonText = "Delete"
      defaultFocusedButton="confirm"
      buttonColor="danger"
      > 
      <p>This will permantantly delete the book's details.</p></EuiConfirmModal>
    )}
    {flyout}
    </>
  )
}
export default HomePage;
