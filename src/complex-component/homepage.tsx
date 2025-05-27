import React, { useEffect, useState } from "react";
import { useGetBooksQuery, useUpdateBookMutation, useDeleteBookMutation, useCreateBookMutation, useBuyBookMutation } from "../services/bookApi";
import { Book } from "../services/bookApi";
import { Criteria, EuiBasicTableColumn,  EuiFieldSearch, EuiFlexGroup, EuiFlexItem, EuiText, EuiPopover, EuiIcon, EuiButtonEmpty, useGeneratedHtmlId,  EuiFlyoutHeader, EuiTitle, EuiFlyoutBody, EuiFlyoutFooter, EuiBadge, EuiHeaderSectionItemButton} from "@elastic/eui";
import { CommomButton } from "../sub-component/button/commonButton";
import { CommonFieldText } from "../sub-component/fieldtext/commonFieldText";
import { CommonTable } from "../sub-component/table/commonTable";
import { CommonFlyout } from "../sub-component/flyout/commonFlyout";
import { CommonModal } from "../sub-component/modal/commonModal";
import { CommonToast } from "../sub-component/toast/commonToast";
import { useDispatch,useSelector  } from "react-redux";
import { RootState } from "../Store";
import { addToCart } from "../slices/cart/cartSlice";
import { MyToast } from "../sub-component/toast/commonToast";



const HomePage: React.FC = () =>{
  //for table
  // const {data: books = [], isLoading} = useGetBooksQuery();
  //for pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, SetPageSize] = useState(4);
  const [searchTerm, setSearchTerm] = useState(""); //for search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null); //for action
  //for flyout
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [editFlyout, setEditFlyout] = useState<Book | null>(null);
  
  //for modal delete
  const [isModalVisible, setIsModalVisible] =useState(false);
  const [deleteModal, setDeleteModal] = useState <Book | null>(null);

  //for modal buy
  const [isBuyModalVisible, setIsBuyModalVisible] = useState(false);
  const [bookTobuy, setBookTobuy] = useState<Book | null>(null);
  
  //for toasts
  const [toasts, setToasts] = useState<MyToast[]>([]);

  const [updateBook] = useUpdateBookMutation();
  const [deleteBook] = useDeleteBookMutation();
  const [createBook] = useCreateBookMutation();
  const [buyBooks] = useBuyBookMutation();
  
  //for cart
  const [isCartModalVisible, setIsCartModalVisible] = useState(false);
const cartItems = useSelector((state: RootState) => state.cart.items);
const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  
  //for addbookflyout
  const [addBookFlyoutVisible, setAddBookFlyoutVisible] = useState(false);
  const [editAddBook, setEditAddBook] = useState<Book>({
    id: 0,
    title: "",
    author: "",
    year: new Date().getFullYear(),
    quantity: 0,
    price: 0 
  });

//debouncing
  useEffect(()=>{
    const timerId = setTimeout(()=>{
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return()=>{
      clearTimeout(timerId);
    };
  },[searchTerm]);
  
  const {data: books = [], isLoading} = useGetBooksQuery(debouncedSearchTerm);

 //for toasts
const addToast = (title: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'success') => {
  const id = `${Date.now()}`;
  setToasts((prev) => [
    ...prev,
    {
      id,
      title,
      color,
      iconType: color === 'success' ? 'check' : 'alert',
    },
  ]);
};

const removeToast = (removedToast: MyToast) => {
  setToasts((prevToasts) =>
    prevToasts.filter((toast) => toast.id !== removedToast.id)
  );
};
 //for add cart related state
 const dispatch = useDispatch(); 
const onAddToCart = (book: any) => {
  dispatch(addToCart(book));
  addToast(`${book.title} added to cart`, 'success');
};


  //for buy modal
  const closeBuyModal = () =>{
    setIsBuyModalVisible(false);
    setBookTobuy(null);
  };

  const handleBuy = async ()=>{
    if(bookTobuy){
      try{
        const response = await buyBooks({items: [{bookId: bookTobuy.id, quantity: 1}]}).unwrap();
        addToast('Purchase Successful', 'success');
        closeBuyModal();
        console.log ("Purchase Successful", response);
      }catch(error){
        console.error("Failed to buy books", error);
      }
    }
  };

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
        await updateBook({
          id: editFlyout.id,
          title: editFlyout.title,
          author: editFlyout.author,
          year: editFlyout.year,
          quantity: editFlyout.quantity,
          price: editFlyout.price

        }).unwrap();
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
    const filtered = books.filter((book)=>{
      const lowerSearch = searchTerm.toLowerCase();
      return(
        book.title.toLowerCase().includes(lowerSearch)||
        book.author.toLowerCase().includes(lowerSearch)
      );   
    });
    

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

  const {pageOfItems, totalItemCount} = findBooks(books, pageIndex, pageSize, debouncedSearchTerm );

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

           <EuiFlexItem>
            <EuiButtonEmpty
              iconType="check"              
              color="success"
              onClick={()=> {
                setBookTobuy(item);
                setIsBuyModalVisible(true);
                closePopover();
              }}                      
            >
              Buy
            </EuiButtonEmpty>
          </EuiFlexItem>

              <EuiFlexItem>
            <EuiButtonEmpty
              iconType="plusInCircle"              
              color="primary"     
              onClick={()=>{
                onAddToCart(item);
                closePopover();
              }}                
            >
              Add to Cart
            </EuiButtonEmpty>
          </EuiFlexItem>

        </EuiFlexGroup>
      </EuiPopover>
    );
  }
}
  ]

  //flyout handle for edit
  const simpleFlyoutTitled = useGeneratedHtmlId();

  let flyout;
  if(isFlyoutVisible && editFlyout){
    flyout = (
      <CommonFlyout 
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
              <CommonFieldText value={editFlyout.title} onChange={(e: { target: { value: any; }; })=> setEditFlyout({...editFlyout, title:e.target.value})}/>
            </EuiFlexItem>
          </EuiFlexGroup>  

          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Author:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editFlyout.author} onChange={(e: { target: { value: any; }; })=> setEditFlyout({...editFlyout, author: e.target.value})}/>
            </EuiFlexItem>
          </EuiFlexGroup>   

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText> Year:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editFlyout.year} onChange={(e: { target: { value: string; }; })=>setEditFlyout({...editFlyout, year: parseInt(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup>    

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Quantitiy:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editFlyout.quantity} onChange={(e: { target: { value: string; }; })=> setEditFlyout({...editFlyout, quantity:parseInt(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup>   

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Price:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editFlyout.price} onChange={(e: { target: { value: string; }; })=> setEditFlyout({...editFlyout, price:parseFloat(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup>   
        </EuiFlyoutBody>

        <EuiFlyoutFooter>
          <EuiFlexGroup>
            <EuiFlexItem>
              <CommomButton
              title="Close"
              onClick={()=>{
                setIsFlyoutVisible(false);
                setEditFlyout(null);
              }}/>
                
              
            </EuiFlexItem>

            <EuiFlexItem>
              <CommomButton title="update" onClick={handleEdit}/>                
              
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </CommonFlyout>
    );
  }

  //flyout for add book
  const addBookFlyout =  addBookFlyoutVisible && (
    <CommonFlyout
    ownFocus
    onClose={()=> setAddBookFlyoutVisible(false)}
    size= "s"
    arialabelledby="addBookFlyoutTitle">
      <EuiFlyoutHeader  hasBorder>
        <EuiTitle size="s">
          <h2 id="addBookFlyoutTitle"> Add new Book</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Title:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editAddBook.title} onChange={(e: { target: { value: string; }; })=> setEditAddBook({...editAddBook, title:(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup> 

            <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Author:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editAddBook.author} onChange={(e: { target: { value: string; }; })=> setEditAddBook({...editAddBook, author:(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup> 

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText> Year:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editAddBook.year} onChange={(e: { target: { value: string; }; })=> setEditAddBook({...editAddBook, year:parseInt(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup> 

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Quantity:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editAddBook.quantity} onChange={(e: { target: { value: string; }; })=> setEditAddBook({...editAddBook, quantity: parseInt(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup> 

           <EuiFlexGroup>
            <EuiFlexItem>
              <EuiText>Price:
              </EuiText>
            </EuiFlexItem>  
            <EuiFlexItem>
              <CommonFieldText value={editAddBook.price} onChange={(e: { target: { value: string; }; })=> setEditAddBook({...editAddBook, price:parseFloat(e.target.value)})}/>
            </EuiFlexItem>
          </EuiFlexGroup>        
      </EuiFlyoutBody>

      <EuiFlyoutFooter>
         <EuiFlexGroup>
           <EuiFlexItem>
            <CommomButton title="cancel" onClick={()=> setAddBookFlyoutVisible(false)} />

              
           </EuiFlexItem> 
           
           <EuiFlexItem >
            <CommomButton title="Add"             
            onClick={async()=>{
              try{
                await createBook(editAddBook).unwrap();
                setAddBookFlyoutVisible(false);
                setEditAddBook({id: 0, title: '', author: '', year: new Date().getFullYear(), quantity: 1, price: 0});
              }catch(error){
                console.error("Failed to create book", error);
              }
            }}/>
              

           </EuiFlexItem>
         </EuiFlexGroup> 
      </EuiFlyoutFooter>
    </CommonFlyout>
  )
   
  return(
    <>
     <EuiFlexGroup className="">      
        <EuiText>
          <h2>Book List</h2>
        </EuiText>      
    </EuiFlexGroup>

    <EuiFlexGroup>
      <EuiFlexItem>
        <EuiFieldSearch placeholder="Search book" value={searchTerm}onChange={(e)=>{
          setSearchTerm(e.target.value);
          setPageIndex(0);//reset first page on new search
        }}isClearable></EuiFieldSearch>
      </EuiFlexItem>
      <EuiFlexItem grow = {true}>
         <EuiHeaderSectionItemButton onClick={() => setIsCartModalVisible(true)}>
      <EuiIcon type="shopping-cart" />
      {totalCount > 0 && (
        <EuiBadge color="accent" style={{ marginLeft: "5px" }}>
          {totalCount}
        </EuiBadge>
      )}
    </EuiHeaderSectionItemButton>
       
      </EuiFlexItem>
      <EuiFlexItem>
        
        <CommomButton title="Add" onClick={()=>setAddBookFlyoutVisible(true)}/>
      </EuiFlexItem>
    </EuiFlexGroup>    

    <EuiFlexGroup>
      <EuiFlexItem>
        <CommonTable items={pageOfItems}        
        columns={columns}
        pagination={pagination}
        onChange={onTableChange}
        loading = {isLoading}/>           
      </EuiFlexItem>        

    </EuiFlexGroup>

    {isModalVisible &&(
      <CommonModal
     
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
      <p>This will permantantly delete the book's details.</p></CommonModal>
    )}
    {addBookFlyout}
    {flyout}

    {isBuyModalVisible && bookTobuy && (
      <CommonModal
      title = "Confirm Purchase"
      onCancel={closeBuyModal}
      onConfirm={async()=>{
        await handleBuy(); //triggers API call
        closeBuyModal(); //close modal after successful buy
      }}
     cancelButtonText= "Cancel"
      confirmButtonText = "Buy"
      defaultFocusedButton ="confirm">
        <p>Are you sure you want to buy <strong>{bookTobuy.title}</strong> buy {bookTobuy.author} for <strong>${bookTobuy.price.toFixed(2)}</strong>?</p>
      </CommonModal> 
    )}
    <CommonToast
     toasts={toasts}
     dismissToast={removeToast}
     toastLifeTimeMs={3000}/>

     {isCartModalVisible && (
  <CommonFlyout
    onClose={() => setIsCartModalVisible(false)}
    size="s"
    ownFocus
  >
    <EuiFlyoutHeader hasBorder>
      <EuiTitle size="m"><h2>Your Cart</h2></EuiTitle>
    </EuiFlyoutHeader>
    <EuiFlyoutBody>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index}>
            <p><strong>{item.title}</strong> – {item.quantity} pcs</p>
          </div>
        ))
      )}
    </EuiFlyoutBody>
  </CommonFlyout>
)}

    </>
  )
}
export default HomePage;
// function useToast(): { addToast: any; toasts: any; removeToast: any; } {
//   throw new Error("Function not implemented.");
// }

